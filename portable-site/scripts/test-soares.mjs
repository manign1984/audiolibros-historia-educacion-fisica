import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { buildSoaresDocument } from '../src/soares/buildReadingDocument.js';
import { soaresReaderConfig as config } from '../src/soares/readerConfig.js';
import { soaresParagraphPreviewConfig as candidate } from '../src/soares/paragraphPreviewConfig.js';
import { catalog } from '../src/biblioteca/catalog.js';
const manifest=JSON.parse(await readFile('../validation/soares-candidate.json','utf8'));
// Ruta obsoleta del candidato privado: evitar duplicados accidentales en public.
const accidentallyPublic = await readdir('public/assets/soares-private', { recursive: true }).catch(error => {
  if (error.code === 'ENOENT') return [];
  throw error;
});
assert.deepEqual(accidentallyPublic, [], 'Soares: la ruta obsoleta soares-private debe permanecer vacía; los recursos vigentes usan rutas explícitas');
assert.equal(catalog.find(w=>w.id===config.workId).status,'available');
assert.equal(config.sync.status,'pending');assert.equal(config.sync.unit,'sentence');
assert.deepEqual(candidate.storage,manifest.storage);
assert.equal(candidate.sync.unit,manifest.sync.unit);
assert.equal(candidate.sync.status,manifest.sync.status);
assert.equal(candidate.sync.paragraphTimings.length,manifest.sync.activeTimings);
const prior=JSON.parse(await readFile('../validation/works.json','utf8'));
for(const w of prior.works.filter(work => work.id !== config.workId))for(const key of Object.values(w.storage))assert.ok(!Object.values(candidate.storage).includes(key), 'Claves de Soares independientes de otras obras.');
const correspondence=JSON.parse(await readFile('../documentation/obras/soares-corrientes-gimnasticas/evidencia/correspondencia-work2.json','utf8'));
assert.equal(correspondence.cueCount,593);assert.equal(correspondence.units,194);
for(const e of Object.values(correspondence.evidence)) {
  assert.notEqual(e.runtimeEnabled,true);assert.notEqual(e.acousticallyVerified,true);
  if(e.status==='cue-envelope')assert.ok(e.candidateStart>=0&&e.candidateEnd<=3113.377959&&e.candidateEnd>e.candidateStart);
}
const page=await readFile('src/soares/SoaresApp.jsx','utf8');
const acoustic=JSON.parse(await readFile('../documentation/obras/soares-corrientes-gimnasticas/evidencia/acustica-work3.json','utf8'));
assert.equal(acoustic.status,'candidate-not-activated');assert.equal(acoustic.runtimeEnabled,false);assert.equal(acoustic.humanListening,false);
assert.equal(acoustic.records.length,correspondence.units);
assert.equal(new Set(acoustic.records.map(r=>r.id)).size,acoustic.records.length);
for(const r of acoustic.records){
  assert.ok(r.id in correspondence.evidence);
  for(const [edge,b] of Object.entries(r.boundaries)){
    assert.ok(['start','end'].includes(edge));
    for(const t of [b.tiny,b.base])assert.ok(Number.isFinite(t)&&t>=0&&t<=3113.377959);
    assert.ok(Math.abs((b.base-b.tiny)-b.delta)<.00011);
    assert.equal(b.agreementWithin450ms,Math.abs(b.delta)<=.45);
  }
  assert.equal(r.bothCompared,Object.keys(r.boundaries).length===2);
  assert.equal(r.needsHumanReview,Boolean(r.priorFlags.length)||Object.values(r.boundaries).some(b=>!b.agreementWithin450ms));
}
assert.equal(acoustic.comparedBoundaries,acoustic.records.reduce((n,r)=>n+Object.keys(r.boundaries).length,0));
assert.equal(acoustic.disagreements,acoustic.records.flatMap(r=>Object.values(r.boundaries)).filter(b=>!b.agreementWithin450ms).length);
assert.equal(acoustic.needsHumanReview,acoustic.records.filter(r=>r.needsHumanReview).length);
const ctc=JSON.parse(await readFile('../documentation/obras/soares-corrientes-gimnasticas/evidencia/ctc-work3.json','utf8'));
assert.equal(ctc.status,'candidate-not-activated');assert.equal(ctc.runtimeEnabled,false);assert.equal(ctc.humanListening,false);
assert.equal(ctc.notesOrBibliographyTimed,false);assert.equal(ctc.thresholdsAreTriageOnly,true);
assert.equal(ctc.audioSha256,manifest.localInputs.mp3Sha256);assert.equal(ctc.vttSha256,manifest.localInputs.vttSha256);
assert.equal(ctc.modelWeights.sha256,'20ef12963ab4924bef49ac4fc7f58ad5da2ee43b2c11bc8c853c9b90ecdbc680');
assert.equal(ctc.chunks,111);assert.equal(ctc.narratedVttWords,6390);assert.equal(ctc.settings.paddingSeconds,4);
assert.equal(ctc.records.length,correspondence.units);assert.equal(new Set(ctc.records.map(r=>r.id)).size,ctc.records.length);
for(const r of ctc.records){
  assert.ok(r.id in correspondence.evidence);assert.equal(r.runtimeEnabled,false);
  assert.ok(Number.isFinite(r.candidateStart)&&Number.isFinite(r.candidateEnd));
  assert.ok(r.candidateStart>=0&&r.candidateStart<r.candidateEnd&&r.candidateEnd<=3113.331293);
  for(const b of Object.values(r.sameTokenWhisperComparison)){
    assert.ok(Math.abs((b.ctc-b.whisperTiny)-b.deltaSeconds)<.0000011);
    assert.equal(b.within300ms,Math.abs(b.deltaSeconds)<=.3);
  }
  assert.equal(r.machineCorroboratedCandidate,r.flags.length===0&&r.ctcVsWhisperBothWithin300ms);
  assert.equal(r.requiresReview,!r.machineCorroboratedCandidate);
}
assert.equal(ctc.machineCorroboratedCandidates,ctc.records.filter(r=>r.machineCorroboratedCandidate).length);
assert.equal(ctc.requiresReview,ctc.records.filter(r=>r.requiresReview).length);
for(const [flag,n] of Object.entries(ctc.flagCounts))assert.equal(n,ctc.records.filter(r=>r.flags.includes(flag)).length);
const comparedCtcEdges=ctc.records.flatMap(r=>Object.values(r.sameTokenWhisperComparison));
assert.equal(ctc.comparisonDiagnostics.comparedBoundaries,comparedCtcEdges.length);
assert.equal(ctc.comparisonDiagnostics.within300ms,comparedCtcEdges.filter(b=>b.within300ms).length);
assert.equal(ctc.comparisonDiagnostics.over450ms,comparedCtcEdges.filter(b=>Math.abs(b.deltaSeconds)>.45).length);
assert.equal(ctc.comparisonDiagnostics.unitsWithoutBothWhisperBoundaries,ctc.records.filter(r=>Object.keys(r.sameTokenWhisperComparison).length<2).length);
assert.deepEqual([...page.matchAll(/<section id="([a-z]+)"/g)].map(x=>x[1]),['inicio','autor','contexto','lectura']);
assert.match(page,/<JourneyCredits workId="soares"/);assert.equal((page.match(/className="so-screen so-context/g)||[]).length,3);
assert.match(await readFile('src/shared/canonical-reading.css','utf8'),/\.scharagrodsky-page, \.soares-page(?:, \.lionetti-page)?(?:, \.melano-page)?(?:, \.arata-marino-page)?\)/);
assert.match(await readFile('scripts/soares-local-candidate.mjs','utf8'),/SOARES_LOCAL_CANDIDATE==='1'/);
assert.match(await readFile('textos/soares-corrientes-gimnasticas/index.html','utf8'),/src\/soares\/main.jsx/);
await access('public/assets/soares-demeny-1906.jpg');
assert.equal(createHash('sha256').update(await readFile('public/assets/soares-demeny-1906.jpg')).digest('hex'),'5663af848681deca1f9fd19551de220a858b5ce5cf37eff30021ef502512d7b2');
let document;
try { document=JSON.parse(await readFile('.local/soares/reader-document.json','utf8')); }
catch(e) { if(e.code!=='ENOENT')throw e; }
if(document) {
  const evidence=JSON.parse(await readFile('../documentation/obras/soares-corrientes-gimnasticas/evidencia/documento-work2.json','utf8'));assert.equal(createHash('sha256').update(await readFile('.local/soares/reader-document.json')).digest('hex'),evidence.documentSha256);
  assert.equal(document.sections.length,7);assert.equal(document.endnotes.length,29);assert.equal(document.bibliography.length,47);
  const units=[...document.frontMatter,...document.sections.flatMap(s=>[s.headingSentence,...s.paragraphs.flatMap(p=>p.sentences)])];
  assert.equal(document.sections.flatMap(s=>s.paragraphs.flatMap(p=>p.sentences)).length,185);
  assert.equal(new Set(units.map(u=>u.id)).size,units.length);
  for(const u of units){assert.ok(u.text.trim());assert.ok(!('start' in u));assert.ok(!('end' in u));}
  for(const n of document.endnotes){assert.ok(units.some(u=>u.id===n.sentenceId));assert.ok(n.text.trim());assert.ok(!('start' in n));}
  assert.match(units.map(u=>u.text).join(' '),/Jahn \(1778-1825\)/);assert.match(document.sourceNote,/Aclaración editorial/);
  const note2=units.find(u=>u.id===document.endnotes.find(n=>n.number===2).sentenceId);assert.match(note2.text,/inexistentes/);assert.ok(!note2.text.includes('De este modo'));
  assert.equal(document.endnotes.find(n=>n.number===9).sentenceId,'soa-sistematizacion-heading');assert.equal(document.endnotes.find(n=>n.number===22).sentenceId,'soa-minoritarios-heading');
  for(const [file,h] of Object.entries({'chapter.pdf':manifest.localInputs.pdfSha256,'audiobook.mp3':manifest.localInputs.mp3Sha256,'original.vtt':manifest.localInputs.vttSha256}))assert.equal(createHash('sha256').update(await readFile('.local/soares/'+file)).digest('hex'),h);
  console.log('Soares: fuente local comprobada (185 oraciones, 29 llamadas, 47 referencias, hashes, sin tiempos activos).');
} else console.log('Soares: materiales privados ausentes; comprobación de fuente real OMITIDA.');
assert.throws(()=>buildSoaresDocument({endnotes:[{number:1},{number:2}],sections:[],bibliography:[],editorialClarification:{}}),/Llamadas/);
console.log('Soares: contratos, tres pantallas, independencia, preparación y bloqueo comprobados.');

import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { buildSoaresDocument } from '../src/soares/buildReadingDocument.js';
import { soaresReaderConfig as config } from '../src/soares/readerConfig.js';
import { catalog } from '../src/biblioteca/catalog.js';
const manifest=JSON.parse(await readFile('../validation/soares-candidate.json','utf8'));
assert.equal(catalog.find(w=>w.id===config.workId).status,'preparation');
assert.equal(config.sync.status,'pending');assert.equal(config.sync.unit,'sentence');
assert.deepEqual(config.storage,manifest.storage);
const prior=JSON.parse(await readFile('../validation/works.json','utf8'));
for(const w of prior.works)for(const key of Object.values(w.storage))assert.ok(!Object.values(config.storage).includes(key));
const correspondence=JSON.parse(await readFile('../documentation/obras/soares-corrientes-gimnasticas/evidencia/correspondencia-work2.json','utf8'));
assert.equal(correspondence.cueCount,593);assert.equal(correspondence.units,194);
for(const e of Object.values(correspondence.evidence)) {
  assert.notEqual(e.runtimeEnabled,true);assert.notEqual(e.acousticallyVerified,true);
  if(e.status==='cue-envelope')assert.ok(e.candidateStart>=0&&e.candidateEnd<=3113.377959&&e.candidateEnd>e.candidateStart);
}
const page=await readFile('src/soares/SoaresApp.jsx','utf8');
assert.deepEqual([...page.matchAll(/<section id="([a-z]+)"/g)].map(x=>x[1]),['inicio','autor','contexto','lectura']);
assert.match(page,/<JourneyCredits workId="soares"/);assert.equal((page.match(/className="so-screen so-context/g)||[]).length,3);
assert.match(await readFile('src/shared/canonical-reading.css','utf8'),/\.scharagrodsky-page, \.soares-page\)/);
assert.match(await readFile('scripts/soares-local-candidate.mjs','utf8'),/SOARES_LOCAL_CANDIDATE==='1'/);
assert.match(await readFile('textos/soares-corrientes-gimnasticas/index.html','utf8'),/src\/biblioteca\/main.jsx/);
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

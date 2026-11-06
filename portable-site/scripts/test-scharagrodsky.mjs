import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { buildScharagrodskyDocument } from '../src/scharagrodsky/buildReadingDocument.js';
import { scharagrodskyReaderConfig as config } from '../src/scharagrodsky/readerConfig.js';
import { catalog, filterCatalog } from '../src/biblioteca/catalog.js';
import { readingUnits, validateTimeline, parseSubtitles } from './lib/validate-work-contracts.mjs';

const read = path => readFile(new URL(path, import.meta.url));
const source = JSON.parse(await read('../src/scharagrodsky/academic-source.json'));
const alignment = JSON.parse(await read('../src/scharagrodsky/alignment.json'));
const words = JSON.parse(await read('../../data/scharagrodsky-voice-words.json'));
const audit = JSON.parse(await read('../../data/scharagrodsky-alignment-audit.json'));
const doc = buildScharagrodskyDocument(source, alignment);
assert.equal(doc.sections.length, 8);
assert.equal(doc.sections.flatMap(s => s.paragraphs).length, 85);
assert.equal(doc.sections.flatMap(s => s.paragraphs.flatMap(p => p.sentences)).length, 245);
assert.equal(doc.endnotes.length, 29);
assert.equal(doc.bibliography.length, 86);
assert.deepEqual(doc.endnotes.map(n => n.number), Array.from({ length: 29 }, (_, i) => i + 1));
assert.equal(doc.endnotes[16].continuedOnPage, 9);
assert.match(doc.endnotes[16].text, /ello dejar de lado el núcleo duro/);
assert.match(doc.endnotes[16].text, /Aisenstein y Scharagrodsky/);
const normalize = text => text.replace(/\s/g, '');
for (const [i, section] of doc.sections.entries()) {
  for (const [j, paragraph] of section.paragraphs.entries()) {
    assert.equal(normalize(paragraph.sentences.map(s => s.text).join(' ')), normalize(source.sections[i].paragraphs[j].text.replace(/\[\[note:\d+\]\]/g, '')), paragraph.id);
  }
}
const units = readingUnits(doc, config);
const unitIds = new Set(units.map(u => u.id));
for (const note of doc.endnotes) assert.ok(unitIds.has(note.sentenceId), `Llamada de nota ${note.number}`);
const referencesPerSentence = Object.groupBy(doc.endnotes, n => n.sentenceId);
assert.ok(Object.values(referencesPerSentence).some(notes => notes.length === 2), 'Conservar dos llamadas dentro de una oración');
assert.deepEqual(validateTimeline(units, doc.duration).errors, []);
assert.equal(units.filter(u => Number.isFinite(u.start)).length, 252);
assert.deepEqual(units.filter(u => u.audioUnavailable).map(u => u.id), doc.sections[0].paragraphs.map(p => p.sentences[0].id));
const starts = new Set(words.map(w => w.start.toFixed(3)));
const ends = new Set(words.map(w => w.end.toFixed(3)));
for (const unit of units.filter(u => Number.isFinite(u.start))) {
  assert.ok(starts.has(unit.start.toFixed(3)), `${unit.id}: inicio sobre una palabra del audio, sin interpolar`);
  assert.ok(ends.has(unit.end.toFixed(3)), `${unit.id}: final sobre una palabra del audio, sin interpolar`);
}
assert.ok(audit.units.every(u => !u.flags?.length));
assert.equal(alignment['sch-antecedentes-p14-s2'].start, 1072.36);
assert.equal(alignment['sch-inef-p1-s2'].start, 1859.246);
const vtt = await read('../src/scharagrodsky/sync.vtt');
assert.ok(vtt.equals(await read('../public/assets/scharagrodsky-subtitulos-originales.vtt')));
assert.equal(parseSubtitles(vtt.toString()).length, 693);
assert.equal(parseSubtitles(vtt.toString()).at(-1).end, 3083.663);
const entry = catalog.find(e => e.id === config.workId);
assert.equal(entry.status, 'available');
assert.equal(entry.duration, doc.duration);
assert.equal(entry.stateKey, config.storage.stateKey);
assert.equal(filterCatalog(catalog, 'Scharagrodsky constitución')[0].id, config.workId);
assert.equal(new Set(catalog.map(e => e.id)).size, 29);
assert.equal(config.sync.status, 'ready');
const manifest = JSON.parse(await read('../../validation/works.json'));
const work = manifest.works.find(w => w.id === config.workId);
assert.ok(work);
for (const material of work.materials) {
  const bytes = await read('../' + material.path);
  assert.equal(bytes.length, material.bytes);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), material.sha256);
}
console.log('Scharagrodsky: texto completo, 29 llamadas/notas, 86 referencias, 252 intervalos acústicos sin interpolar, tres epígrafes sin audio, VTT original intacto, recursos y catálogo verificados. No equivale a escucha humana exhaustiva.');

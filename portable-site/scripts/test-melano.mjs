import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildMelanoReadingDocument } from '../src/melano/buildMelanoReadingDocument.js';

const asset = (name) => fileURLToPath(new URL('../public/assets/melano/' + name, import.meta.url));
const academic = readFileSync(asset('texto-academico.txt'), 'utf8');
const srt = readFileSync(asset('subtitulos.srt'), 'utf8');
const { document, cues, paragraphTimings, legacyPageMap } = buildMelanoReadingDocument(academic, srt);
const paragraphs = document.sections.flatMap(section => section.paragraphs);

assert.equal(document.id, 'melano-militares-juramentados');
assert.equal(document.sections.length, 7);
assert.equal(paragraphs.length, 61);
assert.equal(document.endnotes.length, 20);
assert.deepEqual(document.endnotes.map(note => note.number), Array.from({ length: 20 }, (_, i) => 193 + i));
assert.equal(document.endnotes.filter(note => note.sentenceId).length, 15);
assert.equal(cues.length, 489);
assert.equal(document.duration, 2348.802);
assert.equal(paragraphTimings.length, paragraphs.length, 'Cada párrafo debe conservar una referencia SRT');
assert.equal(Object.keys(legacyPageMap).length, 19);
assert.ok(paragraphs[0].sentences[0].text.includes('Más allá de los cambios producidos'));
assert.ok(paragraphs.at(-1).sentences.at(-1).text.includes('proyecto dictatorial.'));
assert.ok(paragraphs.some(p => p.sentences.some(s => s.text.includes('Viñao Frago, 2002'))), 'La edición debe conservar citas parentéticas');
assert.ok(document.endnotes.every(note => note.text.length > 0));
for (let i = 0; i < paragraphTimings.length; i += 1) {
  const item = paragraphTimings[i];
  assert.ok(Number.isFinite(item.start) && Number.isFinite(item.end));
  assert.ok(item.start <= item.end && item.end <= document.duration);
  if (i) assert.ok(paragraphTimings[i - 1].end < item.start, 'Los tiempos deben seguir el orden del capítulo');
}

let totalBytes = 0;
for (let i = 0; i < 8; i += 1) {
  const path = asset('audio/audio-' + String(i).padStart(2, '0') + '.part');
  totalBytes += statSync(path).size;
}
assert.equal(totalBytes, 23492550, 'Los fragmentos deben sumar exactamente lo que pesa el MP3 de Drive');
console.log('Melano: 61 párrafos, 20 notas, 489 subtítulos y ocho fragmentos MP3 con tamaño coincidente. Sin auditoría acústica.');

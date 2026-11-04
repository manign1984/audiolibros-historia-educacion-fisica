import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { marcaidaReaderConfig as config } from '../src/marcaida/readerConfig.js';
import { catalog } from '../src/biblioteca/catalog.js';

const doc = JSON.parse(await readFile(new URL('../src/marcaida/reading-document.json', import.meta.url), 'utf8'));
const sentences = [...doc.frontMatter, ...doc.sections.flatMap(s => s.paragraphs.flatMap(p => p.sentences))];
const source = await readFile(new URL('../public/assets/marcaida-texto-accesible.txt', import.meta.url), 'utf8');
assert.equal(doc.sections.length, 5, 'Introducción y cuatro apartados de la fuente.');
assert.equal(doc.bibliography.length, 18, 'Conservar la bibliografía que omiten los Docs.');

// Las notas de la edición editorial son un aparato textual, nunca pistas de audio.
assert.equal(doc.endnotes.length, 10, 'Recuperar las diez llamadas numeradas de la edición original.');
assert.deepEqual(doc.endnotes.map(n => n.number), [1,2,3,4,5,6,7,8,9,10]);
const sentenceIds = new Set(sentences.map(s => s.id));
for (const note of doc.endnotes) {
  assert.ok(sentenceIds.has(note.sentenceId), `Nota ${note.number}: el pasaje vinculado debe existir.`);
  assert.equal(typeof note.text, 'string');
  assert.ok(note.text.length > 30, `Nota ${note.number} no puede ser una referencia vacía.`);
  assert.equal(note.sourceUrl, `https://cedinpe.unsam.edu.ar/sites/default/files/pdfs/scaltritti-historia_reciente.pdf#page=${note.page}`);
  assert.ok(!('start' in note) && !('end' in note), 'Las notas no llevan timestamps ni se sincronizan.');
}
assert.equal(doc.endnotes[1].kind, 'incorporada-al-cuerpo', 'La nota 2 está integrada en el cuerpo de la copia de cátedra: no duplicar.');
assert.ok(sentences.some(s => s.text.startsWith('La “Generación del 37” estaba formada')), 'Conservar el contenido incorporado de la nota 2.');
assert.equal(doc.endnotes.filter(n => n.kind === 'sintesis').length, 2, 'Las notas explicativas se identifican como síntesis, no como citas textuales.');
const sharedReaderSource = await readFile(new URL('../src/IntegratedReader.jsx', import.meta.url), 'utf8');
assert.match(sharedReaderSource, /reader-editorial-reference/, 'Los números de nota deben ser clicables desde el pasaje.');
assert.match(sharedReaderSource, /reader-editorial-note-/, 'Las notas deben tener destino accesible en el lector.');
assert.match(sharedReaderSource, /endnotesDetailsRef\.current\.open = true/, 'Abrir las notas desde la referencia sin perder contexto.');
assert.match(sharedReaderSource, /returnToEditorialReference/, 'Permitir regresar al pasaje correspondiente.');
assert.match(sharedReaderSource, /Notas académicas de la edición · no narradas/, 'No atribuir las notas al audiolibro.');

assert.equal(new Set(sentences.map(s => s.id)).size, sentences.length, 'Cada pasaje anotable tiene identidad estable.');
assert.ok(sentences.every(s => !('start' in s) && !('end' in s)), 'No activar marcas temporales sin verificar.');
assert.equal(config.sync.status, 'pending');
assert.equal(doc.duration, 2026.374625);
assert.equal(config.workId, 'marcaida-scaltritti-estado-nacional');
assert.match(config.storage.notesKey, /^marcaida-scaltritti-/);
assert.match(config.storage.stateKey, /^marcaida-scaltritti-/);
assert.ok(sentences.some(s => s.text.includes('Rusia y China')), 'Conservar Rusia, sin propagar Europa desde el VTT.');
assert.ok(sentences.some(s => s.text.includes('autonomía porteña')), 'Corregir contra el PDF.');
assert.ok(sentences.every(s => !s.text.includes('<break') && !s.text.includes('<v ')), 'No incorporar SSML como texto académico.');
for (const s of doc.sections.flatMap(s => s.paragraphs.flatMap(p => p.sentences))) assert.ok(source.includes(s.text), `El pasaje ${s.id} deriva literalmente del texto accesible.`);
for (const entry of doc.bibliography) assert.ok(source.includes(entry));
const entry = catalog.find(x => x.id === config.workId);
assert.equal(entry.status, 'preparation', 'La edición en revisión no se anuncia como lectura sincronizada disponible.');
assert.match(entry.title, /1852–1880/);
assert.doesNotMatch(entry.reference, /1850–1880/);
for (const [name, expected] of [
  ['marcaida-audiolibro.mp3', 'cc324ffa8999233c94a76521b097eb6c7e81d43182d9df5ef49a46413b76b5ba'],
  ['marcaida-scaltritti-estado-nacional.pdf', '9311da9f8094f07322e06c907409b03f6cbba4e9b69fd685a3457ab58490818c'],
]) assert.equal(createHash('sha256').update(await readFile(new URL(`../public/assets/${name}`, import.meta.url))).digest('hex'), expected, 'Conservar los bytes de los materiales auditados.');
console.log('Marcaida/Scaltritti: fuente y bibliografía conservadas, IDs únicos, audio/PDF íntegros, sin tiempos inventados y estado editorial explícito.');

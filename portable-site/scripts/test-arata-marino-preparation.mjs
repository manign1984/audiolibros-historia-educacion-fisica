import assert from 'node:assert/strict';
import { buildArataMarinoReadingDocument, parseArataMarinoSrt, ARATA_SECTIONS } from '../src/arata-marino/buildArataMarinoReadingDocument.js';
import { createArataMarinoReaderConfig, ARATA_AUDIO_PARTS, ARATA_AUDIO_BYTES } from '../src/arata-marino/readerConfig.js';

// Todos los pasajes son ficticios: no se copia ningún fragmento del libro.
const body = ['Este es un párrafo ficticio para comprobar el acceso a la lectura.'];
ARATA_SECTIONS.forEach((section, i) => body.push('Prueba de lectura número ' + (i + 1) + ' para el lector académico.'));
const academic = ['Lección 10', 'Auroras y tempestades: la educación entre golpes (1955-1976)',
  body[0], ...ARATA_SECTIONS.flatMap(([id, heading], i) => [heading, body[i + 1]]),
  'Bibliografía de la lección', 'Sarlo, Beatriz (2001): Referencia ficticia de prueba.',
  'Biografías disponibles en el multimedia', 'Autor de ejemplo',
  'Fuentes disponibles en el multimedia', 'Archivo ficticio'].join('\n\n');
const time = (n) => '00:00:' + String(n).padStart(2, '0') + ',000';
const srt = body.map((p, i) => String(i + 1) + '\n' +
  time(i) + ' --> ' + time(i + 1) + '\n' + p).join('\n\n');
const result = buildArataMarinoReadingDocument(academic, srt);
assert.equal(result.document.sections.length, 9);
assert.equal(result.metrics.paragraphs, 9);
assert.equal(result.metrics.timed, 9);
assert.equal(result.metrics.references, 1);
assert.equal(result.metrics.supplements, 2);
assert.equal(result.document.duration, 9);
assert.equal(result.paragraphTimings.at(-1).end, 9);
assert.equal(result.document.sections.at(-1).paragraphs[0].id, 'arata-marino-imagenes-oscuridad-p1');
assert.throws(() => parseArataMarinoSrt('1\n00:00:03,000 --> 00:00:02,000\nTexto'), /negativa/);
assert.throws(() => parseArataMarinoSrt('2\n00:00:01,000 --> 00:00:02,000\nTexto'), /consecutivo/);
assert.throws(() => createArataMarinoReaderConfig('sin-barra'), /terminar/);
const config = createArataMarinoReaderConfig('/assets/arata-marino-local/');
assert.equal(config.audiobookParts.length, ARATA_AUDIO_PARTS);
assert.equal(config.audiobookParts[0], '/assets/arata-marino-local/audio/audio-00.part');
assert.equal(config.audiobookParts.at(-1), '/assets/arata-marino-local/audio/audio-16.part');
assert.equal(config.expectedAudioBytes, ARATA_AUDIO_BYTES);
assert.equal(config.sync.status, 'paragraph-preview');
assert.equal(config.sync.unit, 'paragraph');
assert.notEqual(config.storage.stateKey, config.storage.notesKey);
console.log('Arata y Mariño: parser, SRT y contrato del lector compartido OK.');

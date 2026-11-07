// Validación de la prueba VTT → párrafo sin acceder a materiales privados.
// Se suma a test:soares; no habilita sincronización en la configuración normal.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { soaresReaderConfig } from '../src/soares/readerConfig.js';

const read = async relative => JSON.parse(await readFile(new URL(relative, import.meta.url), 'utf8'));
const timings = await read('../src/soares/paragraphPreviewTimings.json');
const correspondence = await read('../../documentation/obras/soares-corrientes-gimnasticas/evidencia/correspondencia-work2.json');
const manifest = await read('../../validation/soares-candidate.json');

assert.equal(timings.schemaVersion, 1);
assert.equal(timings.mode, 'paragraph-preview');
assert.equal(timings.sourceVttSha256, correspondence.sourceVttSha256);
assert.equal(timings.sourceVttSha256, manifest.localInputs.vttSha256);
assert.equal(timings.paragraphCount, 70);
assert.equal(timings.paragraphTimings.length, 70);
assert.equal(new Set(timings.paragraphTimings.map(p => p.id)).size, 70);
const ids = new Set(Object.keys(correspondence.evidence).map(id => id.match(/^(soa-.+-p\d+)-s\d+$/)?.[1]).filter(Boolean));
assert.equal(ids.size, 70);
for (const [i, p] of timings.paragraphTimings.entries()) {
  assert.ok(ids.has(p.id), 'Párrafo ajeno a documento auditado');
  assert.ok(Number.isFinite(p.start) && Number.isFinite(p.end) && p.start >= 0 && p.end <= 3113.377959);
  assert.ok(p.start < p.end);
  if (i) assert.ok(p.start >= timings.paragraphTimings[i - 1].end, 'Solapamiento sin resolver');
}
assert.equal(timings.warnings.length, 1);
assert.equal(timings.warnings[0].sharedCue, 63);
assert.equal(timings.warnings[0].switchAt, 318.107);
assert.equal(soaresReaderConfig.sync.unit, 'sentence', 'El lector original debe seguir por oración');
assert.equal(soaresReaderConfig.sync.status, 'pending', 'El lector original no debe activar tiempos');
assert.ok(!soaresReaderConfig.sync.paragraphTimings, 'El modo piloto no se filtra a modo habitual');
const previewSource = await readFile(new URL('../src/soares/paragraphPreviewConfig.js', import.meta.url), 'utf8');
assert.match(previewSource, /status: 'paragraph-preview'/);
assert.match(previewSource, /unit: 'paragraph'/);
assert.match(previewSource, /paragraphPreview\.paragraphTimings/);
assert.doesNotMatch(previewSource, /soares-corrientes-gimnasticas-reader-notes-v1'/);
const pageSource = await readFile(new URL('../src/soares/SoaresApp.jsx', import.meta.url), 'utf8');
assert.match(pageSource, /VITE_SOARES_PARAGRAPH_PREVIEW === '1'/);
const baseReader = await readFile(new URL('../src/IntegratedReader.jsx', import.meta.url), 'utf8');
assert.match(baseReader, /config\.editorialReferenceLabel \|\| 'de la edición de Marcaida y Scaltritti'/);
execFileSync(process.execPath, [new URL('./generate-soares-paragraph-preview.mjs', import.meta.url).pathname, '--check'], { stdio: 'pipe' });
console.log('Soares VTT: 70 párrafos, límites monótonos, cue 63 explicitado, fuente/hashes coherentes, configuración normal protegida.');

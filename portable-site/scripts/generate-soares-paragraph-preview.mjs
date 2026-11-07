// Reproduce los intervalos experimentales sin audio, ASR ni CTC.
// La correspondencia existente proviene del VTT auditado en Work 2.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
const input = new URL('../../documentation/obras/soares-corrientes-gimnasticas/evidencia/correspondencia-work2.json', import.meta.url);
const output = new URL('../src/soares/paragraphPreviewTimings.json', import.meta.url);
const data = JSON.parse(await readFile(input, 'utf8'));
assert.equal(data.cueCount, 593);
assert.equal(data.sourceVttSha256, 'ec0beaea889464cd05328c6e73fb80f36f3f8899ae99cc463fcefb82bc1e294f');
const groups = new Map();
for (const [id, evidence] of Object.entries(data.evidence)) {
  const match = id.match(/^(soa-.+-p\d+)-s(\d+)$/);
  if (!match) continue;
  const units = groups.get(match[1]) || [];
  units.push({ n: Number(match[2]), ...evidence });
  groups.set(match[1], units);
}
const paragraphs = [...groups].map(([id, units]) => {
  units.sort((a, b) => a.n - b.n);
  return { id, start: units[0].candidateStart, end: units.at(-1).candidateEnd,
    startCue: units[0].cueFirst, endCue: units.at(-1).cueLast };
}).sort((a, b) => a.start - b.start);
assert.equal(paragraphs.length, 70, 'Cambió la cantidad de párrafos: reauditar');
const warnings = [];
for (let i = 1; i < paragraphs.length; i++) {
  const previous = paragraphs[i - 1], next = paragraphs[i];
  if (next.start < previous.end) {
    const originalPreviousEnd = previous.end, originalNextStart = next.start;
    const switchAt = Number(((originalPreviousEnd + originalNextStart) / 2).toFixed(3));
    warnings.push({
      previous: previous.id, next: next.id,
      sharedCue: previous.endCue === next.startCue ? previous.endCue : null,
      originalPreviousEnd, originalNextStart, switchAt,
      reason: 'mismo cue compartido entre dos párrafos; punto medio provisional, sin confirmación acústica',
    });
    previous.end = switchAt;
    next.start = switchAt;
  }
}
assert.equal(warnings.length, 1, 'Cambió el número de superposiciones: revisar manualmente');
const result = {
  schemaVersion: 1, workId: 'soares-corrientes-gimnasticas', mode: 'paragraph-preview',
  source: 'correspondencia-work2.json derivado del VTT original, sin CTC ni Whisper',
  sourceVttSha256: data.sourceVttSha256,
  sourceEvidencePath: 'documentation/obras/soares-corrientes-gimnasticas/evidencia/correspondencia-work2.json',
  paragraphCount: paragraphs.length,
  method: 'Inicio del primer segmento asociado al párrafo y fin del último. En cue compartido, punto medio provisional. Intervalos estimativos; no implica escucha humana ni sincronización certificada.',
  warnings,
  paragraphTimings: paragraphs.map(({ id, start, end }) => ({
    id, start: Number(start.toFixed(3)), end: Number(end.toFixed(3)),
  })),
};
for (const [i, item] of result.paragraphTimings.entries()) {
  assert.ok(Number.isFinite(item.start) && Number.isFinite(item.end) && item.end > item.start);
  assert.ok(item.start >= 0 && item.end <= 3113.377959);
  if (i) assert.ok(item.start >= result.paragraphTimings[i - 1].end, 'Intervalos superpuestos');
}
const content = JSON.stringify(result, null, 2) + '\n';
if (process.argv.includes('--check')) {
  assert.equal(await readFile(output, 'utf8'), content, 'La tabla no corresponde con la evidencia VTT');
  console.log('Soares párrafos: 70 intervalos VTT reproducidos y cotejados (1 límite compartido).');
} else {
  await writeFile(output, content);
  console.log('Tabla experimental de párrafos generada.');
}

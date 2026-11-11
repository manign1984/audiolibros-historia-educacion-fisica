import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { buildArataMarinoReadingDocument } from '../src/arata-marino/buildArataMarinoReadingDocument.js';

// Modelo único del lector, derivado de fuente académica, nunca del guion sonoro.
// El JSON se genera antes de Vite para abrir IntegratedReader inmediatamente.
const run = promisify(execFile);
const source = fileURLToPath(new URL('../source-assets/arata-marino/edicion-academica.pdf', import.meta.url));
const textPath = fileURLToPath(new URL('../public/assets/arata-marino/edicion-academica.txt', import.meta.url));
const srtPath = fileURLToPath(new URL('../public/assets/arata-marino/subtitulos.srt', import.meta.url));
const modelPath = fileURLToPath(new URL('../src/arata-marino/readingDocument.generated.json', import.meta.url));
const originalPdf = { bytes: 237347, sha256: '96431e1d98a6e2a474963a1bb51e421b3af2c3f898edfdeab99f3b32fb19cf1b' };
const originalText = { bytes: 66827, sha256: 'd9ab4e078810cdd743b8188232fd3af2a6c49470d0a32732f4e00b0480211453' };
const originalSrt = { bytes: 88272, sha256: 'b713bb72b595735bb8b39a55a1a72939686046ef89fc3424c3f61374d25698f7' };
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const expected = (bytes, spec) => bytes.length === spec.bytes && sha(bytes) === spec.sha256;
const pdf = await readFile(source);
if (!expected(pdf, originalPdf)) throw Error('Arata y Mariño: el PDF fuente no coincide con el original verificado.');
const srtBytes = await readFile(srtPath);
if (!expected(srtBytes, originalSrt)) throw Error('Arata y Mariño: el SRT no coincide con el original verificado.');
await mkdir(dirname(textPath), { recursive: true });

let extracted;
try { extracted = await readFile(textPath); }
catch (error) { if (error.code !== 'ENOENT') throw error; }

if (!extracted || !expected(extracted, originalText)) {
  const tmp = textPath + '.generando';
  try {
    try { await run('pdftotext', ['-layout', source, tmp], { timeout: 30000 }); }
    catch (error) {
      if (error.code === 'ENOENT') throw Error('Falta pdftotext (Poppler). Instalar poppler-utils para generar el texto académico.');
      throw error;
    }
    extracted = await readFile(tmp);
    if (!expected(extracted, originalText)) {
      throw Error('Arata y Mariño: la extracción difiere del texto aprobado; no se publica una versión alterada.');
    }
    await rename(tmp, textPath);
  } finally { await rm(tmp, { force: true }); }
}

const prepared = buildArataMarinoReadingDocument(extracted.toString('utf8'), srtBytes.toString('utf8'));
const { document, paragraphTimings, cues, metrics } = prepared;
if (document.sections.length !== 9 || metrics.paragraphs !== 79 ||
    metrics.timed !== 78 || metrics.references !== 13 || metrics.supplements !== 2 ||
    cues.length !== 796 || Math.abs(document.duration - 3616.8) > 0.001) {
  throw Error('Arata y Mariño: la estructura académica o las marcas temporales no cumplen el control de integridad: ' +
    JSON.stringify(metrics));
}
const tables = document.sections.flatMap(section => section.paragraphs).filter(p => p.kind === 'table');
if (tables.length !== 1 || paragraphTimings.some(t => t.id === tables[0].id)) {
  throw Error('Arata y Mariño: el cuadro estadístico debe quedar completo y sin tiempo ficticio.');
}
const model = { document, paragraphTimings };
const tmpModel = modelPath + '.generando';
try {
  await writeFile(tmpModel, JSON.stringify(model));
  await rename(tmpModel, modelPath);
} finally { await rm(tmpModel, { force: true }); }
console.log('Arata y Mariño: 9 secciones, 79 párrafos, 78 anclajes, 13 referencias, SRT original 796 cues. Lector canónico preparado.');

import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, readFile, rename, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// La base académica se extrae del PDF aportado con su disposición original.
// No usa el guion de locución, que carece de bibliografía y fuentes finales.
const run = promisify(execFile);
const source = fileURLToPath(new URL('../source-assets/arata-marino/edicion-academica.pdf', import.meta.url));
const output = fileURLToPath(new URL('../public/assets/arata-marino/edicion-academica.txt', import.meta.url));
const originalPdf = { bytes: 237347, sha256: '96431e1d98a6e2a474963a1bb51e421b3af2c3f898edfdeab99f3b32fb19cf1b' };
const originalText = { bytes: 66827, sha256: 'd9ab4e078810cdd743b8188232fd3af2a6c49470d0a32732f4e00b0480211453' };
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const isExpected = (bytes, expected) => bytes.length === expected.bytes && sha(bytes) === expected.sha256;
const pdf = await readFile(source);
if (!isExpected(pdf, originalPdf)) throw Error('Arata y Mariño: el PDF fuente no coincide con el original verificado.');
await mkdir(dirname(output), { recursive: true });
try {
  if (isExpected(await readFile(output), originalText)) {
    console.log('Arata y Mariño: texto académico original ya disponible.');
    process.exit(0);
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const tmp = output + '.generando';
try {
  try {
    // Poppler: salida UTF-8 y saltos de página preservados para el adaptador.
    await run('pdftotext', ['-layout', source, tmp], { timeout: 30000 });
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw Error('Falta pdftotext (Poppler). Instalar poppler-utils para generar el texto académico de la obra.');
    }
    throw error;
  }
  const extracted = await readFile(tmp);
  if (!isExpected(extracted, originalText)) {
    throw Error('Arata y Mariño: la extracción difiere del texto académico aprobado; no se publica una versión alterada.');
  }
  await rename(tmp, output);
  console.log('Arata y Mariño: texto académico fiel extraído (' + extracted.length + ' bytes).');
} finally { await rm(tmp, { force: true }); }

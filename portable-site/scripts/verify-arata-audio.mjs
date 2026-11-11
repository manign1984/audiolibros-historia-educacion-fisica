// Control binario local del MP3 de Arata y Mariño; no transcodifica ni publica contenido.
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const EXPECTED_BYTES = 36125008;
const PART_COUNT = 17;
const PART_BYTES = 2250000;

async function digestFiles(paths) {
  const hash = createHash('sha256');
  for (const path of paths) {
    for await (const bytes of createReadStream(path)) hash.update(bytes);
  }
  return hash.digest('hex');
}

export async function verifyArataAudio(originalFile, partsDir, options = {}) {
  const count = options.count ?? PART_COUNT;
  const expectedBytes = options.expectedBytes ?? EXPECTED_BYTES;
  const partBytes = options.partBytes ?? PART_BYTES;
  if (!Number.isInteger(count) || count < 1) throw Error('Cantidad de partes inválida.');
  const names = Array.from({ length: count }, (_, i) =>
    join(partsDir, 'audio-' + String(i).padStart(2, '0') + '.part'));
  const originalSize = (await stat(originalFile)).size;
  const sizes = await Promise.all(names.map(async (file) => (await stat(file)).size));
  const combined = sizes.reduce((sum, n) => sum + n, 0);
  if (originalSize !== expectedBytes || combined !== expectedBytes) {
    throw Error('Los tamaños del original y las partes no coinciden con el total esperado.');
  }
  if (sizes.slice(0, -1).some((n) => n !== partBytes)) {
    throw Error('Los tamaños de los fragmentos intermedios no coinciden.');
  }
  const finalExpected = expectedBytes - partBytes * (count - 1);
  if (sizes.at(-1) !== finalExpected) throw Error('El último fragmento tiene un tamaño incorrecto.');
  const originalSha256 = await digestFiles([originalFile]);
  const concatenatedSha256 = await digestFiles(names);
  if (originalSha256 !== concatenatedSha256) {
    throw Error('SHA-256 diferente: la concatenación no es idéntica al MP3 original.');
  }
  return { verified: true, originalSize, combinedSize: combined,
    partCount: count, sha256: originalSha256 };
}

const invoked = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  const [originalFile, partsDir] = process.argv.slice(2);
  if (!originalFile || !partsDir) {
    console.error('Uso: node scripts/verify-arata-audio.mjs ORIGINAL.mp3 DIRECTORIO_PARTES');
    process.exitCode = 2;
  } else {
    try {
      const result = await verifyArataAudio(originalFile, partsDir);
      console.log('MP3 y fragmentos idénticos, SHA-256: ' + result.sha256 +
        ' (' + result.originalSize + ' bytes; ' + result.partCount + ' partes).');
    } catch (error) {
      console.error(basename(originalFile) + ': ' + error.message);
      process.exitCode = 1;
    }
  }
}

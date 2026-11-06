import { readFile, writeFile, rename, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

// Exact binary source, split only for bounded authenticated repository transfer.
// The public player always receives one original MP3, never 106 network requests.
const source = new URL('../../source-assets/scharagrodsky/', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('manifest.json', source), 'utf8'));
const target = fileURLToPath(new URL('../public/assets/scharagrodsky-audiolibro.mp3', import.meta.url));
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
let present = false;
try {
  const bytes = await readFile(target);
  present = bytes.length === manifest.bytes && digest(bytes) === manifest.sha256;
} catch (error) { if (error.code !== 'ENOENT') throw error; }
if (!present) {
  const parts = [];
  for (const part of manifest.parts) {
    if (!/^audio-\d{3}\.part$/.test(part.name)) throw new Error('Nombre de parte inválido.');
    const bytes = await readFile(new URL(part.name, source));
    if (bytes.length !== part.bytes || digest(bytes) !== part.sha256) throw new Error(`Parte dañada: ${part.name}`);
    parts.push(bytes);
  }
  const bytes = Buffer.concat(parts);
  if (bytes.length !== manifest.bytes || digest(bytes) !== manifest.sha256) throw new Error('El MP3 reconstruido no coincide con el original.');
  const temporary = `${target}.download`;
  try { await writeFile(temporary, bytes); await rename(temporary, target); }
  finally { await rm(temporary, { force: true }); }
  console.log(`MP3 original de Scharagrodsky materializado y verificado: ${bytes.length} bytes.`);
}

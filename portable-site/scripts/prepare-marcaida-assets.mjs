import { createHash } from 'node:crypto';
import { readFile, mkdir, rename, rm } from 'node:fs/promises';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import { resolve } from 'node:path';

// Public source files verified against the authenticated project originals.
// Large binary originals stay in Drive. Builds materialize exact, hash-checked copies.
export const marcaidaAssets = [
  { name: 'marcaida-audiolibro-2026-11.mp3', id: '1j-Y41ElgZfLe0Lkp5bdFWmOcx3ktGiEz', bytes: 45231840, sha256: 'e5b586268ac633f814e898003baf7e8de690fce605db7dd708954613267deedf' },
];

const run = promisify(execFile);
const directory = resolve('public/assets');
await mkdir(directory, { recursive: true });
for (const source of marcaidaAssets) {
  const target = resolve(directory, source.name);
  const matches = bytes => bytes.length === source.bytes && createHash('sha256').update(bytes).digest('hex') === source.sha256;
  try { if (matches(await readFile(target))) continue; } catch (error) { if (error.code !== 'ENOENT') throw error; }
  const temporary = target + '.download';
  try {
    await run('curl', ['--fail', '--location', '--silent', '--show-error', '--max-time', '180', '--retry', '1', `https://drive.google.com/uc?export=download&id=${source.id}`, '--output', temporary], { timeout: 370000 });
    if (!matches(await readFile(temporary))) throw new Error(`El recurso ${source.name} no coincide con la fuente auditada. Se detiene la compilación.`);
    await rename(temporary, target);
    console.log(`Recurso de Marcaida/Scaltritti recuperado y verificado: ${source.name}`);
  } finally { await rm(temporary, { force: true }); }
}

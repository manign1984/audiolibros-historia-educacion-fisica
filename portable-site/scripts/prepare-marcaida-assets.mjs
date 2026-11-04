import { createHash } from 'node:crypto';
import { readFile, mkdir, rename, rm } from 'node:fs/promises';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import { resolve } from 'node:path';

// Public source files verified against the authenticated project originals.
// Large binary originals stay in Drive. Builds materialize exact, hash-checked copies.
export const marcaidaAssets = [
  { name: 'marcaida-audiolibro.mp3', id: '1OdJmzsqdlV-xaPx7uyYaej8PJBL6QZ9s', bytes: 64845012, sha256: 'cc324ffa8999233c94a76521b097eb6c7e81d43182d9df5ef49a46413b76b5ba' },
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

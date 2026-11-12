import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdtemp, readFile, rename, rm, stat } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const workId = 'torre-pastoriza-bienestar';
const { works } = JSON.parse(await readFile(new URL('../../validation/works.json', import.meta.url), 'utf8'));
const { path, bytes, sha256, sourceUrl } = works.find(work => work.id === workId).materials.find(material => material.kind === 'audio');
const target = fileURLToPath(new URL('../' + path, import.meta.url));

async function matches(path) {
  try {
    if ((await stat(path)).size !== bytes) return false;
    const hash = createHash('sha256');
    for await (const chunk of createReadStream(path)) hash.update(chunk);
    return hash.digest('hex') === sha256;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return false;
  }
}

if (!await matches(target)) {
  const staging = await mkdtemp(join(dirname(target), '.audio-'));
  const download = join(staging, 'audiolibro.mp3');
  try {
    await promisify(execFile)('curl', [
      '--fail', '--location', '--silent', '--show-error',
      '--max-time', '180', '--retry', '1', '--output', download, sourceUrl,
    ], { timeout: 370000 });
    if (!await matches(download)) throw new Error('El audiolibro de Torre y Pastoriza no coincide con el tamaño y SHA-256 registrados.');
    await rename(download, target);
    console.log('Audiolibro completo de Torre y Pastoriza descargado y verificado.');
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
}

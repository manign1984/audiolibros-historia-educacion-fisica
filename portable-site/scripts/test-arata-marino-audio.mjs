import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verifyArataAudio } from './verify-arata-audio.mjs';

// Binarios ficticios pequeños: ningún archivo real de la obra entra en CI.
const directory = await mkdtemp(join(tmpdir(), 'arata-audio-test-'));
try {
  const original = join(directory, 'test-original.mp3');
  const a = join(directory, 'audio-00.part');
  const b = join(directory, 'audio-01.part');
  const c = join(directory, 'audio-02.part');
  await writeFile(original, Buffer.from('ABCDEFGHI'));
  await writeFile(a, Buffer.from('ABCD'));
  await writeFile(b, Buffer.from('EFGH'));
  await writeFile(c, Buffer.from('I'));
  const verified = await verifyArataAudio(original, directory,
    { count: 3, expectedBytes: 9, partBytes: 4 });
  assert.equal(verified.verified, true);
  assert.equal(verified.partCount, 3);
  await writeFile(b, Buffer.from('EFXH'));
  await assert.rejects(verifyArataAudio(original, directory,
    { count: 3, expectedBytes: 9, partBytes: 4 }), /SHA-256 diferente/);
  console.log('Arata y Mariño: cotejo SHA-256 y detección de corrupción OK.');
} finally {
  await rm(directory, { recursive: true, force: true });
}

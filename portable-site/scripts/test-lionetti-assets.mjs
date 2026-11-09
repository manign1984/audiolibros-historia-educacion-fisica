import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const dir = new URL('../public/assets/lionetti/', import.meta.url);
const audioHash = createHash('sha256');
let total = 0;

for (let i = 0; i < 63; i += 1) {
  const name = `audio/audio-${String(i).padStart(2, '0')}.part`;
  const part = await readFile(new URL(name, dir));
  assert.equal(part.length, i === 62 ? 452177 : 589824, `${name}: tamaño inesperado`);
  audioHash.update(part);
  total += part.length;
}

assert.equal(total, 37021265, 'El audio debe conservar los bytes originales.');
assert.equal(audioHash.digest('hex'), '99d49c1e3985a61e7209f01f8d17978ba2a3e172da186dd0a251e0d6a5e6ebe0',
  'La reconstrucción de los fragmentos debe coincidir exactamente con el MP3 de Drive.');

const original = await readFile(new URL('lionetti-subtitulos.srt', dir));
assert.equal(original.length, 82882);
assert.equal(createHash('sha256').update(original).digest('hex'),
  '89616a56a51c18cd8b193c28bd04661bc62d321ea9a09f9e6a9412ac9fce7612',
  'El SRT debe permanecer idéntico al material entregado.');
const blocks = original.toString('utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').trim().split(/\n\s*\n/);
const cuePattern = /^(\d+)\n(\d{2}:\d{2}:\d{2},\d{3})\s+-->\s+(\d{2}:\d{2}:\d{2},\d{3})\n([\s\S]+)$/;
assert.equal(blocks.length, 747, 'El SRT contiene 747 segmentos.');
blocks.forEach((block, i) => {
  const cue = block.match(cuePattern);
  assert.ok(cue, `Subtítulo ${i + 1} malformado`);
  assert.equal(Number(cue[1]), i + 1, 'La numeración se conserva sin omisiones.');
  assert.ok(cue[4].trim(), 'Cada subtítulo debe tener texto.');
});
assert.match(blocks[0], /00:00:00,000 --> 00:00:05,350/);
assert.match(blocks.at(-1), /01:01:41,182 --> 01:01:41,996/);

console.log('Lionetti · recursos A: 63 fragmentos = 37.021.265 bytes exactos, SRT original íntegro con 747 subtítulos.');

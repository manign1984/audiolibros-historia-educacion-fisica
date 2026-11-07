// Prueba barata: sintaxis y contrato del visor offline, sin MP3 ni modelo acústico.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const html = await readFile(new URL('../../tools/soares/prueba-rapida-parrafos.html', import.meta.url), 'utf8');
const match = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(match, 'Script offline presente');
new vm.Script(match[1], { filename: 'soares-prueba-rapida.html' });
const arrays = match[1].match(/^const PARAGRAPHS=(.*?);const STOPS=(.*?);/);
assert.ok(arrays, 'Datos numéricos precargados');
const paragraphs=JSON.parse(arrays[1]),stops=JSON.parse(arrays[2]);
assert.equal(paragraphs.length,70);
assert.equal(stops.length,4);
assert.deepEqual(stops.map(s=>s.at),[116.175,318.107,1571.167,3095.333]);
assert.equal(new Set(paragraphs.map(p=>p.id)).size,70);
assert.equal(paragraphs[0].start,11.968);
assert.equal(paragraphs.at(-1).end,3113.305);
for (const [i,p] of paragraphs.entries()) {
  assert.ok(Number.isFinite(p.start)&&Number.isFinite(p.end)&&p.start<p.end&&p.firstCue>=1&&p.lastCue<=593);
  if (i>0) assert.ok(paragraphs[i-1].end<=p.start);
}
assert.ok(html.includes('type="file" accept=".mp3'), 'Cargador MP3 privado');
assert.ok(html.includes('type="file" accept=".vtt'), 'Cargador VTT privado');
assert.ok(html.includes('URL.createObjectURL(f)'), 'Audio local');
assert.ok(!/fetch\s*\(|XMLHttpRequest|sendBeacon\s*\(/.test(match[1]), 'Sin transferencias de datos');
assert.ok(!html.includes('<audio src='), 'Sin audio remoto');
console.log('Soares quickcheck: HTML/JS válido, 70 párrafos, 4 transiciones y archivos locales sin transmisión.');

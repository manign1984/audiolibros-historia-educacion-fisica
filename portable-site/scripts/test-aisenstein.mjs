import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
const load = async (name) => readFile(resolve(root, name), 'utf8');

const vtt = await load('src/aisenstein/aisenstein_subtitulos_verificados.vtt');
assert.match(vtt, /^WEBVTT/);
const cues = [...vtt.matchAll(/(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})/g)];
assert.equal(cues.length, 320, 'La lectura debe partir de los 320 subtítulos verificados.');
const seconds = (value) => { const [h, m, s] = value.split(':'); return Number(h) * 3600 + Number(m) * 60 + Number(s); };
let previous = 0;
for (const cue of cues) {
  const start = seconds(cue[1]);
  const end = seconds(cue[2]);
  assert.ok(start >= previous - 0.005, 'Los segmentos no pueden retroceder temporalmente.');
  assert.ok(end >= start, 'Cada segmento debe tener duración no negativa.');
  previous = start;
}
assert.ok(Math.abs(seconds(cues.at(-1)[2]) - 1493.19) < 0.01, 'La duración VTT debe coincidir con 24:53.19.');
const source = await load('src/aisenstein/aisenstein_texto_fuente.txt');
for (const heading of [
  'La investigación en Historia', 'La enseñanza de la Historia',
  'Algunas pistas que nos da la Historia', 'De la utopía al pragmatismo',
]) assert.ok(source.includes(heading), 'Falta un capítulo de la obra fuente: ' + heading);
const config = await load('src/readerConfigs.js');
const reader = await load('src/IntegratedReader.jsx');
const app = await load('src/aisenstein/AisensteinApp.jsx');
const html = await load('textos/aisenstein-tabla-rasa/index.html');
assert.match(html, /src\/aisenstein\/main\.jsx/);
assert.match(app, /<IntegratedReader/);
assert.match(app, /Launcher=\{CanonicalReadingEntry\}/);
assert.match(app, /<JourneyCredits workId="aisenstein"/);
assert.match(app, /<AisensteinInicioPreview>/);
assert.match(reader, /config\.audiobookParts/);
assert.match(config, /aisenstein-tabla-rasa-reader-notes-v1/);
let total = 0;
for (let n = 1; n <= 16; n += 1) {
  const file = resolve(root, 'public/assets/aisenstein-audio-' + String(n).padStart(2, '0') + '.part');
  const info = await stat(file);
  assert.ok(info.size > 1000, 'Archivo incompleto: ' + file);
  total += info.size;
}
assert.equal(total, 35966683, 'Los 16 fragmentos deben conservar exactamente el tamaño del MP3 definitivo.');
console.log('Aisenstein: 320 VTT, fuente, entrada, lector y 16 fragmentos MP3 verificados.');

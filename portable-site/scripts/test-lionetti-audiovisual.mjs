import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { findLionettiSubtitle, parseLionettiSubtitles, readableAudioTime, subtitleSeconds } from '../src/lionetti/lionettiSubtitles.js';

const path = new URL('../public/assets/lionetti/lionetti-subtitulos.srt', import.meta.url);
const srt = await readFile(path, 'utf8');
const cues = parseLionettiSubtitles(srt);

assert.equal(cues.length, 747, 'Los 747 subtítulos entregados deben poder consultarse.');
assert.equal(cues[0].start, 0);
assert.equal(cues[0].end, 5.35);
assert.equal(cues.at(-1).start, 3701.182);
assert.equal(cues.at(-1).end, 3701.996);
assert.ok(cues.every((cue, i) => i === 0 || cues[i - 1].start <= cue.start), 'El SRT debe estar ordenado por marcas de inicio.');
assert.equal(subtitleSeconds('01:01:41,996'), 3701.996);
assert.equal(subtitleSeconds('mal'), null);
assert.equal(readableAudioTime(3701.996), '01:01:41');
assert.equal(findLionettiSubtitle(cues, 0)?.text.startsWith('La función republicana de la escuela'), true);
assert.equal(findLionettiSubtitle(cues, 5.35)?.text.startsWith('Argentina a fines del siglo XIX'), true);
assert.equal(findLionettiSubtitle(cues, -1), null);
assert.equal(findLionettiSubtitle(cues, 3701.997), null);
assert.equal(findLionettiSubtitle([], 0), null);

const files = {
  player: await readFile(new URL('../src/lionetti/LionettiAudioPlayer.jsx', import.meta.url), 'utf8'),
  app: await readFile(new URL('../src/lionetti/LionettiApp.jsx', import.meta.url), 'utf8'),
  config: await readFile(new URL('../src/lionetti/readerConfig.js', import.meta.url), 'utf8'),
  reader: await readFile(new URL('../src/shared/TextOnlyReader.jsx', import.meta.url), 'utf8'),
  credits: await readFile(new URL('../src/shared/creditsContent.jsx', import.meta.url), 'utf8'),
};

assert.match(files.player, /for \(let start = 0; start < config\.audio\.parts\.length; start \+= 6\)/, 'Descarga por grupos acotados.');
assert.match(files.player, /new Blob\(buffers, \{ type: 'audio\/mpeg' \}\)/, 'Los fragmentos se reconstruyen sin reencodificar.');
assert.match(files.player, /findLionettiSubtitle\(cues, currentTime\)/, 'Subtítulo temporal original.');
assert.match(files.player, /player\.play\(\)\.catch/, 'Reproducción con activación voluntaria.');
assert.match(files.player, /if \(!open \|\| !src \|\| !duration\) return/, 'No borrar posición durante recarga.');
assert.match(files.player, /Mostrar subtítulos/, 'Subtítulos visibles y opcionales.');
assert.match(files.player, /aria-label="Posición del audiolibro"/);
assert.match(files.app, /AudioPlayer=\{LionettiAudioPlayer\}/, 'Reproductor dentro del lector existente.');
assert.doesNotMatch(files.app, /Sin audiolibro/, 'No anunciar modo obsoleto.');
assert.match(files.config, /length: 63/, '63 fragmentos originales.');
assert.match(files.config, /lionetti-escuela-republicana-text-page-v1/, 'Progreso textual conservado.');
assert.match(files.config, /lionetti-escuela-republicana-text-notes-v1/, 'Anotaciones anteriores conservadas.');
assert.match(files.config, /lionetti-escuela-republicana-audio-state-v1/, 'Avance de audio separado.');
assert.match(files.reader, /AudioPlayer && <AudioPlayer open=\{open\} config=\{config\}/, 'Componente opcional.');
assert.match(files.credits, /Audiolibro y subtítulos SRT aportados al proyecto/, 'Créditos actualizados.');

console.log('Lionetti audiovisual: 747 subtítulos y sus límites, controles y claves de continuidad verificados.');

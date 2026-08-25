import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { access, readdir, readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const src = resolve(root, 'src');
const assets = resolve(root, 'public/assets');

async function text(path) {
  return readFile(resolve(root, path), 'utf8');
}

async function sha256(path) {
  const contents = await readFile(resolve(root, path));
  return createHash('sha256').update(contents).digest('hex');
}

const [reader, pineauApp, orbuchApp, orbuchStyles, readerStyles, configSource, accessibleSource, accessiblePublic] = await Promise.all([
  text('src/IntegratedReader.jsx'),
  text('src/App.jsx'),
  text('src/orbuch/OrbuchApp.jsx'),
  text('src/orbuch/orbuch.css'),
  text('src/reader.css'),
  text('src/readerConfigs.js'),
  text('src/orbuch/orbuch-texto-accesible.txt'),
  text('public/assets/orbuch-texto-accesible.txt'),
]);

assert.match(pineauApp, /import IntegratedReader from '\.\/IntegratedReader\.jsx'/);
assert.match(orbuchApp, /import IntegratedReader from '\.\.\/IntegratedReader\.jsx'/);
assert.equal(
  (await readdir(src, { recursive: true })).filter((name) => /IntegratedReader.*\.jsx$/.test(name)).length,
  1,
  'Debe existir un solo motor de lectura.',
);
assert.doesNotMatch(
  reader,
  /Pineau|Orbuch|Fresco|fresco-noble-reader|orbuch-educar-cuerpo-reader/,
  'El motor no debe conocer identidades de obra.',
);

for (const capability of [
  'togglePlayback',
  'seekBy(-10)',
  'seekBy(10)',
  'changeRate',
  'changeVolume',
  'toggleMuted',
  'jumpToSection',
  'openNoteEditor',
  'deleteNote',
  'shareNotes',
  "downloadNotes('txt')",
  "downloadNotes('json')",
  'fontScale',
]) {
  assert.ok(reader.includes(capability), `El lector compartido debe conservar ${capability}.`);
}

assert.match(reader, /audioTimeSource: 'playback-position-at-annotation'/);
assert.match(reader, /sin alineación oración–audio/);
assert.match(configSource, /status: 'ready'/);
assert.match(configSource, /status: 'pending'/);
assert.match(configSource, /fresco-noble-reader-notes-v1/);
assert.match(configSource, /orbuch-educar-cuerpo-reader-notes-v1/);

assert.equal(accessibleSource, accessiblePublic, 'El readingDocument y el TXT público deben usar el mismo texto.');
assert.equal(
  await sha256('src/readingDocument.js'),
  '42743f60e54b7d247891ed49fe3271c9ebff1124fcdcbe45dd171fb63f152982',
  'La sincronización de Pineau debe permanecer intacta.',
);
assert.equal(
  await sha256('public/assets/pineau-audiolibro.mp3'),
  '46b19c38a1b0d15db4010ab1dd002f72a99939f1486116595d257286deeeae2c',
  'El MP3 de Pineau debe permanecer intacto.',
);
assert.equal(await sha256('public/assets/orbuch-audiolibro.mp3'), '1ad70702ffd057916d20b17810713f0c8a26f1a076f4bd812a5bb327f5e2140c');
assert.equal((await stat(resolve(assets, 'orbuch-audiolibro.mp3'))).size, 40174404);
assert.equal(await sha256('public/assets/orbuch-educar-al-cuerpo.pdf'), '726b877620519d8b2ad3f2444dfcf04cfed7d68fedae91e4bbcb7a6671ad4ca2');
assert.equal(await sha256('public/assets/orbuch-gimnasia-compensatoria-1949.pdf'), 'c16511428cd149dd4454981b85647dc2dc4be2a2bc417becb6e72edd271ebef2');
assert.equal(await sha256('public/assets/orbuch-gimnasia-oficinas-1950.pdf'), '52828ca1f89422f0dba788e32566402718a99238a676efdf53087539ef0f5aa2');

for (const sectionId of ['inicio', 'problema', 'autor', 'contexto', 'lectura', 'archivo', 'creditos']) {
  assert.match(orbuchApp, new RegExp(`id="${sectionId}"`), `Falta la sección ${sectionId}.`);
}
for (const fidelityMarker of [
  'Recorrido documental e interactivo',
  'La pregunta que organiza el recorrido',
  'Dos expedientes históricos',
  'Prescripción',
  'Implementación',
  'Tensiones',
]) {
  assert.ok(orbuchApp.includes(fidelityMarker), `Debe conservarse la pieza editorial “${fidelityMarker}”.`);
}
const referencedAssets = [...new Set(orbuchApp.match(/\/assets\/orbuch-[A-Za-z0-9._-]+/g) || [])];
for (const resource of referencedAssets) {
  await access(resolve(assets, resource.replace('/assets/', '')));
}
for (const forbidden of ['Comprobar respuestas', 'Producción final', 'Clasificá cada enunciado', 'quiz', 'trivia']) {
  assert.ok(
    !orbuchApp.toLocaleLowerCase('es').includes(forbidden.toLocaleLowerCase('es')),
    `No debe publicarse la actividad “${forbidden}”.`,
  );
}

for (const breakpoint of ['1040px', '780px', '520px']) assert.ok(orbuchStyles.includes(`max-width: ${breakpoint}`));
for (const breakpoint of ['1220px', '900px', '640px']) assert.ok(readerStyles.includes(`max-width: ${breakpoint}`));
assert.match(orbuchStyles, /min-height:\s*max\(920px, 100svh\)/);
assert.match(orbuchStyles, /text-shadow:\s*3px 3px 0/);
assert.match(orbuchStyles, /\.orbuch-hero-operations/);
assert.match(orbuchStyles, /\.orbuch-folder--aula/);
assert.match(orbuchStyles, /prefers-reduced-motion: reduce/);
assert.match(readerStyles, /prefers-reduced-motion: reduce/);
assert.match(orbuchStyles, /:focus-visible/);
assert.match(orbuchStyles, /overflow: clip/);
assert.match(readerStyles, /width: 100vw/);

const subtitleFiles = (await readdir(assets)).filter((name) => name.startsWith('orbuch-') && /\.(srt|vtt)$/i.test(name));
assert.deepEqual(subtitleFiles, [], 'No debe publicarse una sincronización inexistente.');

console.log('Dos obras: motor único, recursos auténticos, aislamiento, exportación y contratos responsive/accesibles verificados.');

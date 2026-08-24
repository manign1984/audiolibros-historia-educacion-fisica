import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const dist = resolve('dist');
const expectedBase = process.env.GITHUB_PAGES_BASE || '/';
const normalizedBase = expectedBase.endsWith('/') ? expectedBase : `${expectedBase}/`;
const libraryHtmlPath = resolve(dist, 'index.html');
const orbuchHtmlPath = resolve(dist, 'textos/orbuch-educar-al-cuerpo/index.html');
const pineauHtmlPath = resolve(dist, 'textos/pineau-fresco-noble/index.html');

const [libraryHtml, orbuchHtml, pineauHtml] = await Promise.all([
  readFile(libraryHtmlPath, 'utf8'),
  readFile(orbuchHtmlPath, 'utf8'),
  readFile(pineauHtmlPath, 'utf8'),
]);

assert.match(libraryHtml, /Biblioteca de Historia de la Educación y de la Educación Física/);
assert.match(orbuchHtml, /Educar al cuerpo dentro y fuera del aula/);
assert.match(pineauHtml, /La reforma educativa Fresco–Noble/);
assert.ok(libraryHtml.includes(`src="${normalizedBase}assets/`), 'La entrada de la biblioteca debe respetar el base público.');
assert.ok(orbuchHtml.includes(`src="${normalizedBase}assets/`), 'Orbuch debe respetar el base público.');
assert.ok(pineauHtml.includes(`src="${normalizedBase}assets/`), 'Pineau debe respetar el base público.');

const assetNames = await readdir(resolve(dist, 'assets'));
const libraryBundleName = assetNames.find((name) => /^biblioteca-.*\.js$/.test(name));
const orbuchBundleName = assetNames.find((name) => /^orbuchEducarAlCuerpo-.*\.js$/.test(name));
const pineauBundleName = assetNames.find((name) => /^pineauFrescoNoble-.*\.js$/.test(name));
const readerBundleNames = assetNames.filter((name) => /^reader-.*\.js$/.test(name));
assert.ok(libraryBundleName, 'Debe existir el bundle independiente de la biblioteca.');
assert.ok(orbuchBundleName, 'Debe existir el bundle independiente de Orbuch.');
assert.ok(pineauBundleName, 'Debe existir el bundle independiente de Fresco–Noble.');
assert.equal(readerBundleNames.length, 1, 'Debe existir un único bundle funcional compartido del lector.');

const [libraryBundle, orbuchBundle, pineauBundle] = await Promise.all([
  readFile(resolve(dist, 'assets', libraryBundleName), 'utf8'),
  readFile(resolve(dist, 'assets', orbuchBundleName), 'utf8'),
  readFile(resolve(dist, 'assets', pineauBundleName), 'utf8'),
]);
const allJavaScript = (await Promise.all(
  assetNames.filter((name) => name.endsWith('.js')).map((name) => readFile(resolve(dist, 'assets', name), 'utf8')),
)).join('\n');

assert.ok(orbuchBundle.includes(`./${readerBundleNames[0]}`), 'Orbuch debe importar el bundle compartido del lector.');
assert.ok(pineauBundle.includes(`./${readerBundleNames[0]}`), 'Pineau debe importar el bundle compartido del lector.');

assert.ok(
  libraryBundle.includes(normalizedBase)
    && libraryBundle.includes('textos/orbuch-educar-al-cuerpo/')
    && libraryBundle.includes('textos/pineau-fresco-noble/'),
  'El catálogo debe enlazar a las dos rutas físicas.',
);
assert.ok(allJavaScript.includes('Volver a la biblioteca'));
assert.ok(allJavaScript.includes(`${normalizedBase}assets/pineau-audiolibro.mp3`));
assert.ok(allJavaScript.includes(`${normalizedBase}assets/orbuch-audiolibro.mp3`));
assert.ok(allJavaScript.includes('Elegir capítulo del texto'));
assert.ok(allJavaScript.includes('Escuchar desde aquí'));
assert.ok(allJavaScript.includes('fresco-noble-reader-notes-v1'));
assert.ok(allJavaScript.includes('orbuch-educar-cuerpo-reader-notes-v1'));
assert.ok(allJavaScript.includes('Sincronización fina pendiente'));

for (const removedSection of [
  'La brújula del texto',
  'Ejercicios de calentamiento',
  'Conciencia histórica',
]) {
  assert.ok(!allJavaScript.includes(removedSection), `No debe reaparecer la sección eliminada: ${removedSection}`);
}

for (const forbiddenOrbuchActivity of [
  'Comprobar respuestas',
  'Producción final',
  'Clasificá cada enunciado',
]) {
  assert.ok(!allJavaScript.includes(forbiddenOrbuchActivity), `Orbuch no debe publicar actividades: ${forbiddenOrbuchActivity}`);
}

await Promise.all([
  access(resolve(dist, 'assets/pineau-audiolibro.mp3')),
  access(resolve(dist, 'assets/pineau-renovacion-represion-cooptacion.pdf')),
  access(resolve(dist, 'assets/pablo-pineau.webp')),
  access(resolve(dist, 'assets/orbuch-audiolibro.mp3')),
  access(resolve(dist, 'assets/orbuch-educar-al-cuerpo.pdf')),
  access(resolve(dist, 'assets/orbuch-gimnasia-compensatoria-1949.pdf')),
  access(resolve(dist, 'assets/orbuch-gimnasia-oficinas-1950.pdf')),
  access(resolve(dist, 'assets/orbuch-gimnasia-compensatoria-portada.png')),
  access(resolve(dist, 'assets/orbuch-hero-mural-desktop.webp')),
  access(resolve(dist, 'assets/orbuch-nimbus-sans-narrow-regular.otf')),
  access(resolve(dist, 'assets/orbuch-nimbus-sans-narrow-bold.otf')),
  access(resolve(dist, 'assets/orbuch-texto-accesible.txt')),
]);

console.log(`Build multipágina verificado para base ${normalizedBase}`);

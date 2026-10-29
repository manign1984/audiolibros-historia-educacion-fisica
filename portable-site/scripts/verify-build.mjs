import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { catalog } from '../src/biblioteca/catalog.js';

const dist = resolve('dist');
const expectedBase = process.env.GITHUB_PAGES_BASE || '/';
const normalizedBase = expectedBase.endsWith('/') ? expectedBase : `${expectedBase}/`;
const libraryHtmlPath = resolve(dist, 'index.html');
const orbuchHtmlPath = resolve(dist, 'textos/orbuch-educar-al-cuerpo/index.html');
const pineauHtmlPath = resolve(dist, 'textos/pineau-fresco-noble/index.html');
const hobsbawmHtml = await readFile(resolve(dist, 'textos/hobsbawm-historia-siglo-xx/index.html'), 'utf8');
assert.match(hobsbawmHtml, /Historia del siglo XX · Eric Hobsbawm/);
assert.ok(hobsbawmHtml.includes(`src="${normalizedBase}assets/`));

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
const libraryBundleName = assetNames.find((name) => /^(?:biblioteca|main)-.*\.js$/.test(name) && libraryHtml.includes(name));
const orbuchBundleName = assetNames.find((name) => /^orbuchEducarAlCuerpo-.*\.js$/.test(name));
const pineauBundleName = assetNames.find((name) => /^pineauFrescoNoble-.*\.js$/.test(name));
const hobsbawmBundleName = assetNames.find((name) => /^hobsbawmHistoriaSigloXX-.*\.js$/.test(name));
assert.ok(hobsbawmBundleName, 'Debe existir el bundle independiente de Hobsbawm.');
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
const hobsbawmBundle = await readFile(resolve(dist, 'assets', hobsbawmBundleName), 'utf8');
assert.ok(hobsbawmBundle.includes(`./${readerBundleNames[0]}`), 'Hobsbawm debe compartir el mismo lector.');
assert.ok(allJavaScript.includes(`${normalizedBase}assets/hobsbawm-audiolibro.mp3`));
for (const path of ['hobsbawm-audiolibro.mp3', 'hobsbawm-vista-panoramica.pdf', 'hobsbawm-texto-accesible.txt', 'hobsbawm-retrato.jpg']) await access(resolve(dist, 'assets', path));

assert.ok(
  libraryBundle.includes(normalizedBase)
    && libraryBundle.includes('textos/orbuch-educar-al-cuerpo/')
    && libraryBundle.includes('textos/pineau-fresco-noble/'),
  'El catálogo debe enlazar a las dos rutas físicas.',
);
assert.ok(allJavaScript.includes('Volver a la biblioteca'));
for (const entry of catalog.filter((item) => item.status === 'preparation')) {
  const html = await readFile(resolve(dist, entry.path, 'index.html'), 'utf8');
  assert.ok(html.includes('Recorrido en preparación.'), `${entry.id}: disponibilidad explícita en metadatos.`);
  assert.ok(html.includes(`src="${normalizedBase}assets/`), `${entry.id}: ruta refrescable en el base público.`);
  assert.ok(html.includes(`<title>${entry.shortTitle} · Biblioteca +TEC</title>`));
}
assert.ok(allJavaScript.includes(`${normalizedBase}assets/pineau-audiolibro.mp3`));
assert.ok(allJavaScript.includes(`${normalizedBase}assets/orbuch-audiolibro.mp3`));
assert.ok(allJavaScript.includes('Elegir capítulo del texto'));
assert.ok(allJavaScript.includes('Escuchar desde aquí'));
assert.ok(allJavaScript.includes('fresco-noble-reader-notes-v1'));
assert.ok(allJavaScript.includes('orbuch-educar-cuerpo-reader-notes-v1'));
assert.ok(allJavaScript.includes('El resaltado y el desplazamiento acompañan el momento real del audio.'));
assert.ok(allJavaScript.includes('.75,.9,1,1.1,1.25,1.5,2'), 'El bundle compartido debe incluir 0,9× y 1,1×.');
for (const restoredOrbuchMarker of [
  'Pregunta que organiza el recorrido',
  'Dos expedientes históricos',
  'Subtítulos SRT',
  'Ver biografía académica',
]) {
  assert.ok(allJavaScript.includes(restoredOrbuchMarker), `Falta la pieza recuperada de Orbuch: ${restoredOrbuchMarker}`);
}

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
  access(resolve(dist, 'assets/orbuch-subtitulos.srt')),
  access(resolve(dist, 'assets/orbuch-ivan-orbuch.webp')),
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

// The common structural measure must be present in every published build.
const referenceHtml = await readFile(resolve(dist, 'layout/pineau-reference.html'), 'utf8');
assert.doesNotMatch(referenceHtml, /<script\b|<audio\b|<dialog\b/i);
assert.doesNotMatch(referenceHtml, /<iframe[^>]+\ssrc=/i);
for (const id of ['inicio', 'autor', 'contexto', 'lectura', 'creditos']) assert.ok(referenceHtml.includes(`id="${id}"`));
await access(resolve(dist, 'layout/pineau-reference.css'));
await access(resolve(dist, 'assets/hobsbawm-retrato-joven.jpg'));
assert.ok(referenceHtml.includes('../assets/manuel-fresco.webp'), 'La referencia debe usar recursos relativos válidos en cualquier base pública.');

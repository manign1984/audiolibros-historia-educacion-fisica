import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const dist = resolve('dist');
const expectedBase = process.env.GITHUB_PAGES_BASE || '/';
const normalizedBase = expectedBase.endsWith('/') ? expectedBase : `${expectedBase}/`;
const libraryHtmlPath = resolve(dist, 'index.html');
const workHtmlPath = resolve(dist, 'textos/pineau-fresco-noble/index.html');

const [libraryHtml, workHtml] = await Promise.all([
  readFile(libraryHtmlPath, 'utf8'),
  readFile(workHtmlPath, 'utf8'),
]);

assert.match(libraryHtml, /Biblioteca de Historia de la Educación y de la Educación Física/);
assert.match(workHtml, /La reforma educativa Fresco–Noble/);
assert.ok(libraryHtml.includes(`src="${normalizedBase}assets/`), 'La entrada de la biblioteca debe respetar el base público.');
assert.ok(workHtml.includes(`src="${normalizedBase}assets/`), 'La obra interna debe respetar el base público.');

const assetNames = await readdir(resolve(dist, 'assets'));
const libraryBundleName = assetNames.find((name) => /^biblioteca-.*\.js$/.test(name));
const workBundleName = assetNames.find((name) => /^pineauFrescoNoble-.*\.js$/.test(name));
assert.ok(libraryBundleName, 'Debe existir el bundle independiente de la biblioteca.');
assert.ok(workBundleName, 'Debe existir el bundle independiente de Fresco–Noble.');

const [libraryBundle, workBundle] = await Promise.all([
  readFile(resolve(dist, 'assets', libraryBundleName), 'utf8'),
  readFile(resolve(dist, 'assets', workBundleName), 'utf8'),
]);

assert.ok(
  libraryBundle.includes(normalizedBase)
    && libraryBundle.includes('textos/pineau-fresco-noble/'),
  'El catálogo debe enlazar a la ruta física de la obra.',
);
assert.ok(workBundle.includes('Volver a la biblioteca'));
assert.ok(workBundle.includes(`${normalizedBase}assets/pineau-audiolibro.mp3`));
assert.ok(workBundle.includes('Elegir capítulo del texto'));
assert.ok(workBundle.includes('Escuchar desde aquí'));
assert.ok(workBundle.includes('fresco-noble-reader-notes-v1'));

for (const removedSection of [
  'La brújula del texto',
  'Ejercicios de calentamiento',
  'Conciencia histórica',
]) {
  assert.ok(!workBundle.includes(removedSection), `No debe reaparecer la sección eliminada: ${removedSection}`);
}

await Promise.all([
  access(resolve(dist, 'assets/pineau-audiolibro.mp3')),
  access(resolve(dist, 'assets/pineau-renovacion-represion-cooptacion.pdf')),
  access(resolve(dist, 'assets/pablo-pineau.webp')),
]);

console.log(`Build multipágina verificado para base ${normalizedBase}`);

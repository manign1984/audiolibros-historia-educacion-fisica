import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { catalog } from '../src/biblioteca/catalog.js';

const dist = resolve('dist');
const expectedBase = process.env.GITHUB_PAGES_BASE || '/';
const normalizedBase = expectedBase.endsWith('/') ? expectedBase : `${expectedBase}/`;
const libraryHtmlPath = resolve(dist, 'index.html');
const orbuchHtmlPath = resolve(dist, 'textos/orbuch-educar-al-cuerpo/index.html');
const pineauHtmlPath = resolve(dist, 'textos/pineau-fresco-noble/index.html');
const hobsbawmHtml = await readFile(resolve(dist, 'textos/hobsbawm-historia-siglo-xx/index.html'), 'utf8');
const soaresHtml = await readFile(resolve(dist, 'textos/soares-corrientes-gimnasticas/index.html'), 'utf8');
assert.match(soaresHtml, /Leer y escuchar/);
assert.ok(soaresHtml.includes(`src="${normalizedBase}assets/`), 'La ruta Soares debe compilarse en la base pública correcta.');
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
assert.ok(!assetNames.includes('soares-private'), 'I04: un build ordinario nunca debe publicar materiales privados de Soares.');
const libraryBundleName = assetNames.find((name) => /^(?:biblioteca|main)-.*\.js$/.test(name) && libraryHtml.includes(name));
const orbuchBundleName = assetNames.find((name) => /^orbuchEducarAlCuerpo-.*\.js$/.test(name));
const pineauBundleName = assetNames.find((name) => /^pineauFrescoNoble-.*\.js$/.test(name));
const hobsbawmBundleName = assetNames.find((name) => /^hobsbawmHistoriaSigloXX-.*\.js$/.test(name));
assert.ok(hobsbawmBundleName, 'Debe existir el bundle independiente de Hobsbawm.');
const readerBundleNames = assetNames.filter((name) => /^(?:reader|IntegratedReader)-.*\.js$/.test(name));
const marcaidaBundleName = assetNames.find((name) => /^marcaida-scaltritti-estado-nacional-.*\.js$/.test(name));
assert.ok(marcaidaBundleName, 'Marcaida/Scaltritti debe tener su recorrido independiente.');
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

const marcaidaBundle = await readFile(resolve(dist, 'assets', marcaidaBundleName), 'utf8');
assert.ok(marcaidaBundle.includes(`./${readerBundleNames[0]}`), 'Marcaida/Scaltritti debe importar el lector compartido.');
for (const name of ['marcaida-audiolibro-2026-11.mp3', 'marcaida-scaltritti-estado-nacional.pdf', 'marcaida-texto-accesible.txt', 'marcaida-tramas.svg']) {
  await access(resolve(dist, 'assets', name));
  assert.ok(allJavaScript.includes(`${normalizedBase}assets/${name}`), `Marcaida/Scaltritti: recurso publicado en la base correcta: ${name}`);
}

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
// Recorrido con audiolibro realmente integrado; comprobar la ruta y todos sus recursos.
const arataEntry = catalog.find(entry => entry.id === 'arata-marino-auroras-tempestades');
assert.equal(arataEntry?.status, 'available', 'Arata y Mariño debe estar disponible para leer y escuchar.');
const arataHtml = await readFile(resolve(dist, 'textos/arata-marino-auroras-tempestades/index.html'), 'utf8');
assert.match(arataHtml, /Auroras y tempestades/);
assert.ok(arataHtml.includes(`src="${normalizedBase}assets/`), 'Arata y Mariño: respetar la base de GitHub Pages.');
// Levoratti: el lector comienza en Introducción; los preliminares de la edición
// original permanecen en el TXT de origen, pero no se renderizan ni se listan.
const levorattiPrepared = JSON.parse(await readFile(resolve('src/levoratti/readingDocument.generated.json'), 'utf8'));
const levorattiDocument = levorattiPrepared.document;
assert.equal(levorattiDocument.sections.length, 5, 'Levoratti debe conservar los cinco apartados de lectura.');
assert.equal(levorattiDocument.sections[0].id, 'introduccion', 'Levoratti debe comenzar por Introducción.');
assert.ok(levorattiDocument.sections[0].paragraphs[0].sentences[0].text.startsWith('En mayo de 1958'), 'No alterar el comienzo del cuerpo académico.');
const levorattiDisplayedText = JSON.stringify(levorattiDocument.sections);
for (const removedText of ['Portada, resúmenes y abstracts', 'Curitiba, v. 14', 'Physical Education and gymnastics in primary']) {
  assert.ok(!levorattiDisplayedText.includes(removedText), 'Levoratti: preliminar no debe figurar en el lector: ' + removedText);
}
assert.equal(levorattiDocument.endnotes.length, 5, 'Levoratti debe preservar las cinco notas académicas.');
assert.equal(levorattiPrepared.paragraphTimings.length, 39, 'Levoratti debe preservar los 39 párrafos con tiempo.');
assert.equal(levorattiPrepared.legacyPageMap['0'], 'levoratti-introduccion-p1', 'El progreso histórico debe abrir un apartado existente.');
assert.equal(levorattiDocument.legacySentenceMap['levoratti-preliminares-p1'], 'levoratti-introduccion-p1', 'Las anotaciones antiguas deben conservar un anclaje.');
const levorattiSource = await readFile(resolve('public/assets/levoratti-gimnasia-1958-1968/texto-academico.txt'), 'utf8');
assert.ok(levorattiSource.includes('Curitiba, v. 14'), 'El archivo original de fuente no debe perder sus preliminares.');

// B04 · COMPUERTA OBLIGATORIA DE ESTILOS DEL LECTOR.
// Lecciones de Arata–Mariño (PR #122) y Levoratti (PR #131):
// React/DOM y audio pueden funcionar mientras el modal carece de reader.css.
// Recorrer TODAS las entradas con IntegratedReader, no solo dos nombres.
async function traceIntegratedReaderSources(entry, visited = new Set()) {
  const path = resolve(entry);
  if (visited.has(path)) return { reader: false, stylesheet: false, archivo400: false, archivo700: false, bebas400: false };
  visited.add(path);
  const source = await readFile(path, 'utf8');
  const result = { reader: path.endsWith('/IntegratedReader.jsx'), stylesheet: false,
    archivo400: false, archivo700: false, bebas400: false };
  const imports = [...source.matchAll(/\b(?:from\s*|import\s*)['"]([^'"]+)['"]/g)];
  for (const [, specifier] of imports) {
    result.archivo400 ||= /^@fontsource\/archivo\/(?:latin-)?400\.css$/.test(specifier);
    result.archivo700 ||= /^@fontsource\/archivo\/(?:latin-)?700\.css$/.test(specifier);
    result.bebas400 ||= /^@fontsource\/bebas-neue\/(?:latin-)?400\.css$/.test(specifier);
    if (!specifier.startsWith('.')) continue;
    const target = resolve(dirname(path), specifier);
    if (target.endsWith('/reader.css')) {
      result.stylesheet = true;
      continue;
    }
    const candidates = [target, target + '.jsx', target + '.js', target + '.mjs'];
    let imported = null;
    for (const candidate of candidates) {
      if (!/\.(?:js|jsx|mjs)$/.test(candidate)) continue;
      try { await access(candidate); imported = candidate; break; }
      catch { /* El candidato tiene una extensión diferente */ }
    }
    if (!imported) continue;
    const child = await traceIntegratedReaderSources(imported, visited);
    for (const key of ['reader', 'stylesheet', 'archivo400', 'archivo700', 'bebas400']) {
      result[key] ||= child[key];
    }
  }
  return result;
}

async function verifyIntegratedReaderStyles(route) {
  const html = await readFile(resolve(dist, route, 'index.html'), 'utf8');
  const stylesheetTags = [...html.matchAll(/<link\b[^>]*>/gi)]
    .map(match => match[0])
    .filter(tag => /\brel=["']stylesheet["']/i.test(tag));
  const hrefs = stylesheetTags.map(tag => tag.match(/\bhref=["']([^"']+)["']/i)?.[1]).filter(Boolean);
  assert.ok(hrefs.length > 0, route + ': no hay CSS enlazado en el HTML.');
  const styles = (await Promise.all(hrefs.map(async href => {
    assert.ok(href.startsWith(normalizedBase), route + ': CSS fuera de BASE_URL: ' + href);
    const relative = href.slice(normalizedBase.length);
    assert.ok(/^assets\/[a-zA-Z0-9_.-]+\.css$/.test(relative), route + ': ruta CSS inesperada: ' + href);
    return readFile(resolve(dist, relative), 'utf8');
  }))).join('\n');
  assert.match(styles, /\.integrated-reader\s*\{/, route + ': modal sin reader.css.');
  assert.match(styles, /\.reader-app__layout\s*\{/, route + ': falta la retícula del lector.');
  assert.match(styles, /\.reader-player\s*\{/, route + ': falta la estructura del reproductor.');
}

const readerRoutes = [];
for (const entry of await readdir(resolve('textos'), { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const route = 'textos/' + entry.name;
  const sourceIndex = await readFile(resolve(route, 'index.html'), 'utf8');
  const entrypoint = sourceIndex.match(/<script\b[^>]*\bsrc=["']\/(src\/[^"']+\.(?:js|jsx))["']/i)?.[1];
  if (!entrypoint) continue; // Fichas sin aplicación React propia.
  const graph = await traceIntegratedReaderSources(entrypoint);
  if (!graph.reader) continue;
  assert.ok(graph.stylesheet, route + ': falta import real de src/reader.css en el entrypoint.');
  assert.ok(graph.archivo400 && graph.archivo700 && graph.bebas400,
    route + ': faltan fuentes del lector (Archivo 400/700 y Bebas Neue 400) en la entrada real.');
  readerRoutes.push(route);
  await verifyIntegratedReaderStyles(route);
}
assert.ok(readerRoutes.includes('textos/arata-marino-auroras-tempestades'), 'No se detectó lector de Arata–Mariño.');
assert.ok(readerRoutes.includes('textos/levoratti-gimnasia-1958-1968'), 'No se detectó lector de Levoratti.');
assert.ok(readerRoutes.length >= 8, 'La compuerta no cubre los lectores existentes.');
console.log('B04: modal, retícula y reproductor con CSS integrado en ' + readerRoutes.length + ' entradas (base ' + normalizedBase + ').');

const arataBundleName = assetNames.find(name => name.startsWith('arata-marino-auroras-tempestades-') && name.endsWith('.js'));
assert.ok(arataBundleName, 'Debe existir un bundle independiente de Arata y Mariño.');
const arataBundle = await readFile(resolve(dist, 'assets', arataBundleName), 'utf8');
assert.ok(arataBundle.includes(`./${readerBundleNames[0]}`), 'Arata y Mariño debe reutilizar IntegratedReader.');
assert.ok(!allJavaScript.includes('CONSULTAR EDICIÓN') && !allJavaScript.includes('Abrí tu ejemplar en el lector'),
  'Arata y Mariño: sin acceso alternativo ni formulario de archivos.');
for (const path of ['assets/arata-marino/autor-editorial.svg', 'assets/arata-marino/edicion-academica.txt',
  'assets/arata-marino/subtitulos.srt', ...Array.from({ length: 17 }, (_, i) =>
    'assets/arata-marino/audio/audio-' + String(i).padStart(2, '0') + '.part')]) {
  await access(resolve(dist, path));
}

for (const entry of catalog.filter((item) => item.status !== 'available')) {
  const html = await readFile(resolve(dist, entry.path, 'index.html'), 'utf8');
  if (entry.status === 'review') {
    assert.ok(html.includes('Edición en revisión'), `${entry.id}: distinguir lectura disponible de alineación pendiente.`);
    assert.doesNotMatch(html, /Recorrido en preparación\./, `${entry.id}: no publicar como ficha sin recorrido.`);
  } else if (entry.status === 'text') {
    assert.ok(html.includes('src="' + normalizedBase + 'assets/'), `${entry.id}: ruta web correcta.`);
    const textAsset = {
      'almada-privilegiados': 'assets/almada/texto-academico.txt',
      'levoratti-debates-ef': 'assets/levoratti-debates-ef/texto-academico.txt',
      'melano-militares-juramentados': 'assets/melano/texto-academico.txt',
      'torre-pastoriza-bienestar': 'assets/torre-pastoriza/texto-academico.txt',
    }[entry.id] ?? 'assets/lionetti/texto-academico.txt';
    await access(resolve(dist, textAsset));
    assert.ok(html.includes(entry.author), `${entry.id}: autor presente en el HTML.`);
    if (entry.id === 'lionetti-escuela-republicana') {
      assert.ok(html.includes('Sin audio') || html.includes('sin audiolibro') || html.includes('sin audio'), `${entry.id}: no prometer escucha.`);
    } else if (entry.id === 'melano-militares-juramentados') {
      await access(resolve(dist, 'assets/melano/ignacio-melano-retrato.jpeg'));
      assert.ok(html.includes('src="' + normalizedBase + 'assets/'), `${entry.id}: ruta de página correctamente compilada.`);
      assert.ok(html.includes('Juramentados al poder'), `${entry.id}: identidad de página presente.`);
    }
    continue;
  } else {
    assert.ok(html.includes('Recorrido en preparación.'), `${entry.id}: disponibilidad explícita en metadatos.`);
  }
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
  assert.ok(!orbuchBundle.includes(removedSection), `Orbuch no debe recuperar la sección eliminada: ${removedSection}`);
}

for (const forbiddenOrbuchActivity of [
  'Comprobar respuestas',
  'Producción final',
  'Clasificá cada enunciado',
]) {
  assert.ok(!orbuchBundle.includes(forbiddenOrbuchActivity), `Orbuch no debe publicar actividades: ${forbiddenOrbuchActivity}`);
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

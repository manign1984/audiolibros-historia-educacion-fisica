import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import {
  alphabeticGroup,
  catalog as allCatalog,
  collections,
  citationAsPlainText,
  filterCatalog,
  matchesCatalogEntry,
  normalizeForSearch,
  resolveSitePath,
  sortCatalog,
} from '../src/biblioteca/catalog.js';
import { orbuchReaderConfig, pineauReaderConfig } from '../src/readerConfigs.js';
import { buildOrbuchReadingDocument } from '../src/orbuch/buildReadingDocument.js';

const catalog = allCatalog.filter((entry) => entry.status === 'available');
const orbuch = catalog.find((entry) => entry.id === 'orbuch-educar-al-cuerpo');
const pineau = catalog.find((entry) => entry.id === 'pineau-fresco-noble');
const orbuchAccessibleText = await readFile(new URL('../src/orbuch/orbuch-texto-accesible.txt', import.meta.url), 'utf8');
const orbuchReadingDocument = buildOrbuchReadingDocument(orbuchAccessibleText);
const expectedOrbuchCitation = 'Orbuch, I. P. (2020). Educar al cuerpo dentro y fuera del aula. Análisis de dos experiencias en la Nueva Argentina de Perón. History of Education in Latin America, 3, e21435.';
const expectedPineauCitation = 'Pineau, P. (1999). Renovación, represión, cooptación: Las estrategias de la Reforma Fresco–Noble (Provincia de Buenos Aires, década del 30). En A. Ascolani (Comp.), La educación en Argentina: Estudios de historia (pp. 223–239). Ediciones del Arca.';

assert.equal(catalog.length, 2, 'La biblioteca debe contener exactamente las dos obras reales integradas.');
assert.equal(new Set(catalog.map((entry) => entry.id)).size, catalog.length, 'Los identificadores deben ser únicos.');
assert.ok(orbuch && pineau, 'Las dos obras deben estar identificadas en el catálogo.');
assert.equal(citationAsPlainText(orbuch), expectedOrbuchCitation, 'La referencia APA de Orbuch no debe alterarse.');
assert.equal(citationAsPlainText(pineau), expectedPineauCitation, 'La referencia APA de Pineau no debe alterarse.');
assert.equal(alphabeticGroup(orbuch), 'O');
assert.equal(alphabeticGroup(pineau), 'P');
assert.equal(normalizeForSearch('Renovación – COOPTACIÓN'), 'renovacion cooptacion');
assert.deepEqual(sortCatalog(catalog).map((entry) => entry.id), ['orbuch-educar-al-cuerpo', 'pineau-fresco-noble']);

for (const query of [
  'Pineau',
  'reforma',
  'Pineau reforma',
  'renovacion',
  'COOPTACIÓN',
  'Pine refor',
  'provincia buenos aires',
]) {
  assert.equal(matchesCatalogEntry(pineau, query), true, `La búsqueda debe encontrar la obra con “${query}”.`);
  assert.deepEqual(filterCatalog(catalog, query).map((entry) => entry.id), ['pineau-fresco-noble']);
}

assert.deepEqual(
  filterCatalog(catalog, 'pablo').map((entry) => entry.id),
  ['orbuch-educar-al-cuerpo', 'pineau-fresco-noble'],
  'La búsqueda por un nombre compartido debe devolver ambas obras en orden bibliográfico.',
);

for (const query of [
  'Orbuch',
  'ivan',
  'educar cuerpo',
  'nueva argentina peron',
  'Orbu aula',
]) {
  assert.equal(matchesCatalogEntry(orbuch, query), true, `La búsqueda debe encontrar Orbuch con “${query}”.`);
  assert.deepEqual(filterCatalog(catalog, query).map((entry) => entry.id), ['orbuch-educar-al-cuerpo']);
}

assert.equal(filterCatalog(catalog, 'Sarmiento civilización').length, 0, 'Una búsqueda ajena no debe devolver resultados.');
assert.deepEqual(filterCatalog(catalog, '').map((entry) => entry.id), ['orbuch-educar-al-cuerpo', 'pineau-fresco-noble'], 'Sin consulta se conserva el catálogo ordenado.');

const mockEntries = [
  { ...pineau, id: 'z', sortAuthor: 'Zeta, Ana', title: 'B' },
  { ...pineau, id: 'a2', sortAuthor: 'Álvarez, Ana', title: 'Z' },
  { ...pineau, id: 'a1', sortAuthor: 'Alvarez, Ana', title: 'A' },
];
assert.deepEqual(sortCatalog(mockEntries).map((entry) => entry.id), ['a1', 'a2', 'z']);

assert.equal(resolveSitePath(pineau.path, '/'), '/textos/pineau-fresco-noble/');
assert.equal(resolveSitePath(orbuch.path, '/'), '/textos/orbuch-educar-al-cuerpo/');
assert.equal(
  resolveSitePath(pineau.path, '/audiolibros-historia-educacion-fisica/'),
  '/audiolibros-historia-educacion-fisica/textos/pineau-fresco-noble/',
);
assert.equal(
  resolveSitePath(pineau.thumbnail.src, '/audiolibros-historia-educacion-fisica'),
  '/audiolibros-historia-educacion-fisica/assets/pablo-pineau.webp',
);
assert.equal(
  resolveSitePath(orbuch.path, '/audiolibros-historia-educacion-fisica/'),
  '/audiolibros-historia-educacion-fisica/textos/orbuch-educar-al-cuerpo/',
);

assert.notEqual(orbuchReaderConfig.storage.notesKey, pineauReaderConfig.storage.notesKey, 'Las notas deben tener espacios locales independientes.');
assert.notEqual(orbuchReaderConfig.storage.stateKey, pineauReaderConfig.storage.stateKey, 'El progreso debe tener espacios locales independientes.');
assert.equal(orbuchReaderConfig.sync.status, 'ready');
assert.equal(pineauReaderConfig.sync.status, 'ready');
assert.equal(orbuchReadingDocument.duration, 1673.900408);
assert.equal(orbuchReadingDocument.sections.length, 4);
const orbuchSentences = orbuchReadingDocument.sections.flatMap((section) => section.paragraphs.flatMap((paragraph) => paragraph.sentences));
assert.ok(orbuchSentences.length > 100, 'El texto accesible de Orbuch debe conservar segmentación suficiente para anotar.');
assert.ok(orbuchSentences.every((sentence) => Number.isFinite(sentence.start) && Number.isFinite(sentence.end)), 'Todas las oraciones de Orbuch deben usar tiempos del SRT validado.');
assert.ok(orbuchReadingDocument.frontMatter.every((sentence) => Number.isFinite(sentence.start) && Number.isFinite(sentence.end)));
assert.ok(orbuchReadingDocument.sections.every((section) => Number.isFinite(section.headingSentence?.start) && Number.isFinite(section.headingSentence?.end)));
assert.equal(orbuchReadingDocument.syncMetadata.status, 'source-srt-validated');
assert.equal(orbuchReadingDocument.syncMetadata.units, 154);

await Promise.all([
  access(new URL('../textos/orbuch-educar-al-cuerpo/index.html', import.meta.url)),
  access(new URL('../textos/pineau-fresco-noble/index.html', import.meta.url)),
]);

// New catalog entries have stable physical routes; their availability is explicit.
assert.equal(allCatalog.length, 29);
assert.equal(new Set(allCatalog.map((entry) => entry.id)).size, allCatalog.length);
for (const entry of allCatalog) {
  assert.ok(collections.some((collection) => collection.id === entry.collection));
  assert.ok(citationAsPlainText(entry).length > 30);
  assert.ok(['available', 'preparation'].includes(entry.status));
  await access(new URL(`../${entry.path}index.html`, import.meta.url));
  if (entry.status === 'preparation') {
    assert.equal(entry.duration, undefined, 'No inventar duración para audios pendientes.');
    assert.equal(entry.stateKey, undefined, 'Una ficha sin audio no puede mostrar progreso.');
  }
}
assert.equal(filterCatalog(allCatalog, 'FEIGUÍN').length, 1);
assert.equal(filterCatalog(allCatalog, 'galak dicho')[0].id, 'galak-del-dicho-al-hecho');
assert.equal(filterCatalog(allCatalog, 'zzzinexistente').length, 0);

const { LIST_KEY, readList, saveList, readProgress } = await import('../src/biblioteca/libraryState.js');
const values = new Map();
const storage = { getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) };
const ids = allCatalog.map((entry) => entry.id);
assert.deepEqual(readList(storage, ids), []);
assert.ok(saveList(storage, [pineau.id, orbuch.id]));
assert.deepEqual(readList(storage, ids), [pineau.id, orbuch.id]);
values.set(LIST_KEY, JSON.stringify([pineau.id, pineau.id, 'unknown']));
assert.deepEqual(readList(storage, ids), [pineau.id]);
values.set(LIST_KEY, 'broken-json');
assert.deepEqual(readList(storage, ids), []);
assert.equal(readProgress(storage, pineau), 0);
values.set(pineau.stateKey, JSON.stringify({ currentTime: 60 }));
assert.equal(readProgress(storage, pineau), 60);
values.set(pineau.stateKey, JSON.stringify({ currentTime: -20 }));
assert.equal(readProgress(storage, pineau), 0);
values.set(pineau.stateKey, JSON.stringify({ currentTime: 999999 }));
assert.equal(readProgress(storage, pineau), pineau.duration);
values.set(pineau.stateKey, JSON.stringify({ currentTime: '60' }));
assert.equal(readProgress(storage, pineau), 0);
const blocked = { getItem() { throw new Error('Blocked'); }, setItem() { throw new Error('Blocked'); } };
assert.deepEqual(readList(blocked, ids), []);
assert.equal(saveList(blocked, ids), false);
assert.equal(readProgress(blocked, pineau), 0);
console.log('Biblioteca: 29 fichas, 2 recorridos completos, búsqueda, APA, rutas, lista, progreso y sincronización verificados.');

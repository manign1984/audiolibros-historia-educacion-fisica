import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import {
  alphabeticGroup,
  catalog,
  citationAsPlainText,
  filterCatalog,
  matchesCatalogEntry,
  normalizeForSearch,
  resolveSitePath,
  sortCatalog,
} from '../src/biblioteca/catalog.js';

const [pineau] = catalog;
const expectedCitation = 'Pineau, P. (1999). Renovación, represión, cooptación: Las estrategias de la Reforma Fresco–Noble (Provincia de Buenos Aires, década del 30). En A. Ascolani (Comp.), La educación en Argentina: Estudios de historia (pp. 223–239). Ediciones del Arca.';

assert.equal(catalog.length, 1, 'La primera versión debe contener exactamente una obra real.');
assert.equal(new Set(catalog.map((entry) => entry.id)).size, catalog.length, 'Los identificadores deben ser únicos.');
assert.equal(citationAsPlainText(pineau), expectedCitation, 'La referencia APA revisada no debe alterarse.');
assert.equal(alphabeticGroup(pineau), 'P');
assert.equal(normalizeForSearch('Renovación – COOPTACIÓN'), 'renovacion cooptacion');

for (const query of [
  'Pineau',
  'pablo',
  'reforma',
  'Pineau reforma',
  'renovacion',
  'COOPTACIÓN',
  'Pine refor',
  'provincia buenos aires',
]) {
  assert.equal(matchesCatalogEntry(pineau, query), true, `La búsqueda debe encontrar la obra con “${query}”.`);
  assert.equal(filterCatalog(catalog, query).length, 1);
}

assert.equal(filterCatalog(catalog, 'Sarmiento civilización').length, 0, 'Una búsqueda ajena no debe devolver resultados.');
assert.deepEqual(filterCatalog(catalog, ''), catalog, 'Sin consulta se conserva el catálogo completo.');

const mockEntries = [
  { ...pineau, id: 'z', sortAuthor: 'Zeta, Ana', title: 'B' },
  { ...pineau, id: 'a2', sortAuthor: 'Álvarez, Ana', title: 'Z' },
  { ...pineau, id: 'a1', sortAuthor: 'Alvarez, Ana', title: 'A' },
];
assert.deepEqual(sortCatalog(mockEntries).map((entry) => entry.id), ['a1', 'a2', 'z']);

assert.equal(resolveSitePath(pineau.path, '/'), '/textos/pineau-fresco-noble/');
assert.equal(
  resolveSitePath(pineau.path, '/biblioteca-historia-educacion-fisica/'),
  '/biblioteca-historia-educacion-fisica/textos/pineau-fresco-noble/',
);
assert.equal(
  resolveSitePath(pineau.thumbnail.src, '/biblioteca-historia-educacion-fisica'),
  '/biblioteca-historia-educacion-fisica/assets/pablo-pineau.webp',
);

await access(new URL('../textos/pineau-fresco-noble/index.html', import.meta.url));

const libraryStyles = await readFile(new URL('../src/biblioteca/library.css', import.meta.url), 'utf8');
assert.match(
  libraryStyles,
  /\.catalog-entry\s*\{[^}]*grid-column:\s*2;/s,
  'Las entradas que comparten inicial deben permanecer alineadas con la columna bibliográfica.',
);

console.log('Biblioteca: búsqueda, orden, referencia APA, rutas y catálogo verificados.');

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { getChapters, normalizeNotes, paragraphsOf, preparePages, resolvePage, searchDocument } from '../src/shared/textOnlyReaderModel.js';

const raw = await readFile(new URL('../public/assets/lionetti/texto-academico.txt', import.meta.url), 'utf8');
const pages = preparePages(raw);
assert.equal(pages.length, 32, 'La edición facilitada contiene 32 páginas útiles.');
assert.ok(pages[0].includes('La función republicana de la escuela pública'));
assert.ok(pages[31].includes('Wainerman'));
assert.ok(paragraphsOf(pages[0]).length > 3);
assert.equal(resolvePage(17, pages.length), 17);
assert.equal(resolvePage(200, pages.length), 31);
assert.equal(resolvePage(-5, pages.length), 0);
assert.equal(resolvePage('mal', pages.length), 0);
assert.equal(resolvePage(17, 0), 0);
const sections = [
  'La Argentina a partir de 1880',
  'Garantizar el triunfo de la civilización',
  'Educar para “argentinizar”',
  'Formar en la virtud pública y la moral cívica',
  'Consideraciones finales',
  '(*) Agradezco',
  'BIBLIOGRAFIA',
].map(term => ({ title: term, term }));
const toc = getChapters(pages, sections);
assert.equal(toc.length, 7, 'El índice debe encontrar los siete apartados reales.');
assert.ok(toc.every(item => item.page >= 0 && item.page < pages.length));
assert.ok(searchDocument(pages, 'ciudadanía').length > 0);
assert.ok(searchDocument(pages, 'CIUDADANIA').length > 0, 'La búsqueda ignora tildes y mayúsculas.');
assert.deepEqual(searchDocument(pages, 'zzzz_no_existe'), []);
assert.deepEqual(searchDocument(pages, 'x'), [], 'No buscar cadenas de un solo carácter.');
assert.deepEqual(normalizeNotes({ invalid: true }), []);
assert.deepEqual(normalizeNotes([{ id: 'n1', page: 17, text: 'Idea guardada' }, { id: '', page: -2, text: 'Inválida' }]), [{ id: 'n1', page: 17, text: 'Idea guardada' }]);
const reader = await readFile(new URL('../src/shared/TextOnlyReader.jsx', import.meta.url), 'utf8');
assert.match(reader, /if \(!pages\.length\) return;/, 'No sobrescribir el progreso antes de cargar el archivo.');
assert.match(reader, /searchDocument\(pages, searchTerm\)/, 'La búsqueda recorre todas las páginas.');
assert.match(reader, /className="text-only-mobile-navigation"/, 'El índice permanece accesible en pantallas estrechas.');
assert.match(reader, /editingId \? 'Guardar cambios' : 'Guardar nota'/, 'El cuaderno admite edición.');
assert.match(reader, /<dialog ref=\{dialog\}/, 'El lector conserva su diálogo accesible.');
console.log('Lionetti: 32 páginas, 7 apartados, búsqueda, progreso diferido y cuaderno verificados.');

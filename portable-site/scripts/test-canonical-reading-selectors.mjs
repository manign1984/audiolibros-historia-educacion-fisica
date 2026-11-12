import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

/*
 * Regresión de alcance de canonical-reading.css:
 * - todas las obras con JourneyHeader directo heredan el bloque 04;
 * - un catálogo o un contenedor ajeno no lo heredan;
 * - no hace falta añadir nombres de páginas al CSS;
 * - la selección ancestral conserva una clase de especificidad
 *   (antes :is(.obra-page), ahora :has(> .journey-header)).
 */
const css = readFileSync(fileURLToPath(new URL('../src/shared/canonical-reading.css', import.meta.url)), 'utf8');
const canonicalAncestor = ':has(> .journey-header)';
const readingSelector = `body:has(.journey-header, .aisenstein-preview__header) ${canonicalAncestor} #lectura.hb-material-reading`;
const pageClasses = [
  'hobsbawm-page', 'orbuch-page', 'pineau-page', 'aisenstein-preview',
  'marcaida-page', 'scharagrodsky-page', 'soares-page', 'lionetti-page',
  'melano-page', 'arata-marino-page', 'levoratti-page',
  'proxima-obra-page',
];

assert.equal(css.split(canonicalAncestor).length - 1, 70, 'Cada selector común debe utilizar el mismo alcance general');
assert.ok(css.includes(readingSelector), 'La superficie principal debe heredar el alcance general');
assert.ok(css.includes(`${canonicalAncestor} .hb-material-content`), 'La retícula debe ser heredada');
assert.ok(css.includes(`${canonicalAncestor} .hb-material-open`), 'El botón debe ser heredado');
assert.ok(!css.includes(':is(.hobsbawm-page, .orbuch-page'), 'No debe restablecerse la enumeración de autores');
assert.ok(!css.includes(':has(> .levoratti-page)'), 'No deben crearse excepciones para obras nuevas');

const html = `<!doctype html><html><body>
  ${pageClasses.map((name) => `<div class="${name}">
    <header class="journey-header"></header>
    <main><section id="lectura" class="hb-material-reading">
      <div class="hb-material-content">
        <div class="hb-material-hero"></div>
        <button class="hb-material-open">Abrir el lector</button>
      </div>
    </section></main>
  </div>`).join('')}
  <div class="library-page"><main><section class="hb-material-reading"><div class="hb-material-content"></div></section></main></div>
  <div class="nested-only"><div><header class="journey-header"></header></div><section class="hb-material-reading"></section></div>
</body></html>`;
// IDs de ejemplo se duplican intencionalmente para probar cada recorrido por separado;
// las páginas reales son documentos independientes y solo contienen un #lectura.
const document = new JSDOM(html).window.document;
for (const name of pageClasses) {
  const page = document.querySelector(`.${name}`);
  assert.ok(page.matches(canonicalAncestor), `El recorrido ${name} debe entrar en el selector`);
  assert.ok(page.querySelector('.hb-material-content'), `El recorrido ${name} conserva su entrada`);
  assert.ok(page.querySelector('.hb-material-open'), `El recorrido ${name} conserva su botón`);
}
assert.ok(!document.querySelector('.library-page').matches(canonicalAncestor), 'El catálogo no debe heredar el lector');
assert.ok(!document.querySelector('.nested-only').matches(canonicalAncestor), 'Un encabezado anidado no es contrato de página');
assert.ok(document.querySelector('.levoratti-page').matches(canonicalAncestor), 'Levoratti hereda el bloque 04');
console.log('PASS: selector canónico para 10 páginas existentes, Levoratti y futuras obras; sin alcance sobre catálogo');

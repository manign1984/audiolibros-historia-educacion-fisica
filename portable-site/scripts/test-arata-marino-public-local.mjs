// Verifica entrada pública sin redistribución: lectura, MP3 local y modal canónico.
import assert from 'node:assert/strict';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { JSDOM } from 'jsdom';

const root = fileURLToPath(new URL('../', import.meta.url));
const dir = root + 'node_modules/.cache';
const out = dir + '/arata-private-runtime';
const entry = dir + '/arata-private-runtime-entry.js';
await mkdir(dir, { recursive: true });
await writeFile(entry, 'export {default as Reader} from ' +
  JSON.stringify(root + 'src/arata-marino/ArataMarinoPrivateReader.jsx') + ';');
try {
  await build({
    configFile: false, root, publicDir: false, logLevel: 'silent', plugins: [react()],
    build: { outDir: out, emptyOutDir: true, minify: false,
      lib: { entry, formats: ['es'], fileName: 'arata-private-runtime' },
      rollupOptions: { external: ['react', 'react/jsx-runtime', 'lucide-react'] } },
  });
  const dom = new JSDOM('<section id="lectura"><div id="root"></div></section>',
    { url: 'https://lector.test/', pretendToBeVisual: true });
  const { window } = dom;
  for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node']) {
    Object.defineProperty(globalThis, name,
      { configurable: true, value: name === 'window' ? window : window[name] });
  }
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  window.matchMedia = () => ({ matches: true });
  window.confirm = () => true;
  document.fonts = { ready: Promise.resolve() };
  window.HTMLElement.prototype.scrollIntoView = function () {};
  window.HTMLElement.prototype.scrollTo = function () {};
  window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  window.HTMLDialogElement.prototype.close = function () { this.open = false; };
  globalThis.requestAnimationFrame = window.requestAnimationFrame.bind(window);
  globalThis.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
  Object.defineProperty(window.HTMLMediaElement.prototype, 'readyState', { get: () => 4 });
  Object.defineProperty(window.HTMLMediaElement.prototype, 'duration', { get: () => 796 });
  window.HTMLMediaElement.prototype.play = async function () { this.dataset.playing = '1'; };
  window.HTMLMediaElement.prototype.pause = function () { this.dataset.playing = '0'; };
  let requested = 0, objectURLs = 0;
  globalThis.fetch = async () => { requested++; throw Error('El lector no debe pedir medios remotos.'); };
  URL.createObjectURL = () => { objectURLs++; return 'blob:arata-local-' + objectURLs; };
  URL.revokeObjectURL = () => {};
  window.HTMLAnchorElement.prototype.click = function () {};
  process.env.NODE_ENV = 'development';
  const React = await import('react');
  const { act } = React;
  const { createRoot } = await import('react-dom/client');
  const { Reader } = await import(pathToFileURL(out + '/arata-private-runtime.js').href);
  const rootNode = createRoot(document.getElementById('root'));
  const flush = async (callback) => act(async () => {
    await callback?.();
    await new Promise((resolve) => setTimeout(resolve, 65));
  });
  await flush(() => rootNode.render(React.createElement(Reader)));
  assert.ok(document.querySelector('.hb-material-open'), 'Se conserva CanonicalReadingEntry.');
  assert.equal(document.querySelector('.integrated-reader'), null, 'No simular un lector sin materiales.');
  await flush(() => document.querySelector('.hb-material-open').click());
  assert.equal(document.querySelector('.am-private-reading-dialog').open, true);
  assert.equal(document.querySelectorAll('.am-private-reading-form input[type=file]').length, 3);
  assert.equal(requested, 0, 'Ningún recurso ajeno descargado.');
  const dialog = document.querySelector('.am-private-reading-dialog');
  const form = dialog.querySelector('form.am-private-reading-form');

  // Datos exclusivamente ficticios, no se incluye un pasaje del texto real.
  const body = Array.from({ length: 79 }, (_, i) =>
    'Oración de demostración exclusiva y numerada ' + (i + 1) +
    ' para estudiar una secuencia ficticia de datos.');
  const sections = ['Darse cuenta', 'El optimismo capitalista llega a la educación',
    'Destellos de larga duración en la coyuntura educativa desarrollista',
    'Algunos indicios para pensar la trama cultural y educativa del período',
    'Maestros en la epifanía del progreso', 'La liberación como superación del progreso',
    'Inclusión: sujetos y pedagogía', 'Imágenes de la oscuridad'];
  const parts = ['Lección 10', 'Auroras y tempestades: la educación entre golpes (1955-1976)'];
  parts.push(...body.slice(0, 7));
  sections.forEach((title, index) => parts.push(title, ...body.slice(7 + index * 9, 16 + index * 9)));
  parts.push('Bibliografía de la lección',
    'Sarlo, Beatriz (2001): Referencia sintética.',
    'Biografías disponibles en el multimedia', 'Autora de prueba',
    'Fuentes disponibles en el multimedia', 'Documento de prueba');
  const academicText = parts.join('\n\n');
  const srtText = Array.from({ length: 796 }, (_, i) => {
    const toTime = v => '00:' + String(Math.floor(v / 60)).padStart(2, '0') +
      ':' + String(v % 60).padStart(2, '0') + ',000';
    return String(i + 1) + '\n' + toTime(i) + ' --> ' + toTime(i + 1) +
      '\n' + (body[i] || 'Marca ficticia de espera.');
  }).join('\n\n');
  const files = [
    { size: academicText.length, text: async () => academicText },
    { size: srtText.length, text: async () => srtText },
    { size: 36125008, type: 'audio/mpeg' },
  ];
  [...form.querySelectorAll('input')].forEach((input, index) =>
    Object.defineProperty(input, 'files', { configurable: true, value: [files[index]] }));
  await flush(() => form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true })));
  await flush();
  assert.equal(dialog.isConnected, false, 'El selector desaparece al cargar materiales.');
  const reader = document.querySelector('.integrated-reader');
  assert.ok(reader, 'Se abre el motor IntegratedReader compartido.');
  assert.equal(reader.open, true, 'Se abre su modal automáticamente.');
  assert.equal(document.querySelectorAll('.reader-paragraph-unit').length, 79);
  assert.equal(document.querySelector('.reader-player__captions'), null,
    'No se muestran subtítulos duplicados.');
  assert.equal(requested, 0, 'El MP3 local no se solicita por red.');
  assert.equal(objectURLs, 1, 'Solo un objeto local para el MP3.');
  assert.equal(document.querySelector('audio')?.getAttribute('src'), 'blob:arata-local-1');
  await flush(() => rootNode.unmount());
  dom.window.close();
  console.log('Arata y Mariño: lector público con tres archivos privados, 79 párrafos, audio local y sin red externa OK.');
} finally {
  await rm(out, { recursive: true, force: true });
  await rm(entry, { force: true });
}

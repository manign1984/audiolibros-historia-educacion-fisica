// Contrato 3.6.17: la página monta el lector de verdad, sin formularios ni puentes.
// Se usan los metadatos académicos generados desde fuentes verificadas y un MP3 simulado.
import assert from 'node:assert/strict';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { JSDOM } from 'jsdom';

const root = fileURLToPath(new URL('../', import.meta.url));
const cache = root + 'node_modules/.cache';
const out = cache + '/arata-canonical-runtime';
const entry = cache + '/arata-canonical-runtime-entry.js';
await mkdir(cache, { recursive: true });
await writeFile(entry, [
  "import React from 'react';",
  'import IntegratedReader from ' + JSON.stringify(root + 'src/IntegratedReader.jsx') + ';',
  'import CanonicalReadingEntry from ' + JSON.stringify(root + 'src/shared/CanonicalReadingEntry.jsx') + ';',
  'import { arataReaderConfig, arataReadingDocument } from ' +
    JSON.stringify(root + 'src/arata-marino/readerContract.js') + ';',
  'export function Reader(){ return React.createElement(IntegratedReader, { readingDocument: arataReadingDocument, config: arataReaderConfig, Launcher: CanonicalReadingEntry }); }',
].join('\n'));
try {
  await build({
    configFile: false, root, publicDir: false, logLevel: 'silent', plugins: [react()],
    build: {
      outDir: out, emptyOutDir: true, minify: false,
      lib: { entry, formats: ['es'], fileName: 'arata-canonical-runtime' },
      rollupOptions: { external: ['react', 'react/jsx-runtime', 'lucide-react'] },
    },
  });
  const dom = new JSDOM('<section id="lectura"><div id="root"></div></section>',
    { url: 'https://biblioteca.test/', pretendToBeVisual: true });
  const { window } = dom;
  for (const key of ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node']) {
    Object.defineProperty(globalThis, key,
      { configurable: true, value: key === 'window' ? window : window[key] });
  }
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  document.fonts = { ready: Promise.resolve() };
  window.matchMedia = () => ({ matches: true });
  window.confirm = () => true;
  window.HTMLElement.prototype.scrollIntoView = () => {};
  window.HTMLElement.prototype.scrollTo = () => {};
  window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  window.HTMLDialogElement.prototype.close = function () { this.open = false; };
  globalThis.requestAnimationFrame = window.requestAnimationFrame.bind(window);
  globalThis.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
  Object.defineProperty(window.HTMLMediaElement.prototype, 'readyState', { get: () => 4 });
  Object.defineProperty(window.HTMLMediaElement.prototype, 'duration', { get: () => 3612.447 });
  window.HTMLMediaElement.prototype.play = async function () { this.dataset.playing = '1'; };
  window.HTMLMediaElement.prototype.pause = function () { this.dataset.playing = '0'; };
  let audioRequests = 0, generatedUrls = 0;
  globalThis.fetch = async (url) => {
    const part = String(url).match(/audio-(\d{2})\.part$/);
    if (!part) throw Error('Lectura no solicitada por red: ' + url);
    audioRequests++;
    const size = Number(part[1]) === 16 ? 125008 : 2250000;
    return { ok: true, arrayBuffer: async () => new ArrayBuffer(size) };
  };
  URL.createObjectURL = () => { generatedUrls++; return 'blob:arata-audio-sintetico'; };
  URL.revokeObjectURL = () => {};
  process.env.NODE_ENV = 'development';
  const React = await import('react');
  const { act } = React;
  const { createRoot } = await import('react-dom/client');
  const { Reader } = await import(pathToFileURL(out + '/arata-canonical-runtime.js').href);
  const mount = createRoot(document.getElementById('root'));
  const flush = async (fn) => act(async () => {
    await fn?.();
    await new Promise(resolve => setTimeout(resolve, 75));
  });
  await flush(() => mount.render(React.createElement(Reader)));
  const button = document.querySelector('#lectura .hb-material-open');
  assert.ok(button, 'El lector tiene la entrada CanonicalReadingEntry');
  assert.equal(button.textContent.trim(), 'ABRIR EL LECTOR');
  assert.equal(button.getAttribute('aria-haspopup'), 'dialog');
  assert.equal(document.querySelectorAll('dialog').length, 1);
  assert.equal(document.querySelectorAll('input[type=file]').length, 0);
  assert.equal(document.querySelectorAll('.reader-paragraph-unit').length, 79);
  assert.equal(document.querySelector('.integrated-reader')?.open, false);
  await flush(() => button.click());
  assert.equal(document.querySelector('.integrated-reader')?.open, true,
    'Un clic abre el IntegratedReader, sin transición');
  await flush();
  assert.equal(audioRequests, 17, 'Se cargan los 17 fragmentos del audio preconfigurado');
  assert.equal(generatedUrls, 1, 'El audio se reconstruye como una URL binaria local');
  assert.equal(document.querySelector('audio')?.getAttribute('src'), 'blob:arata-audio-sintetico');
  assert.equal(document.querySelector('.reader-player__captions'), null,
    'No existe franja separada de subtítulos');
  assert.ok(document.querySelector('.reader-player__play'), 'Conserva los controles de reproducción');
  assert.ok(document.querySelector('[aria-label="Lector integrado: Auroras y tempestades"]'),
    'Se conserva la identidad de la obra');
  await flush(() => mount.unmount());
  dom.window.close();
  console.log('Arata y Mariño: acceso canónico directo, 79 párrafos, MP3 por 17 partes y modal de lectura OK.');
} finally {
  await rm(out, { recursive: true, force: true });
  await rm(entry, { force: true });
}

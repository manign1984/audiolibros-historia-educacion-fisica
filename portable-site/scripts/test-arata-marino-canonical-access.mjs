// Regression 3.6.17: no file selector on the public site; direct reader in the local build.
// Fixtures are synthetic and contain no chapters, recordings or SRT from the copyrighted work.
import assert from 'node:assert/strict';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { JSDOM } from 'jsdom';

const root = fileURLToPath(new URL('../', import.meta.url));
const cache = root + 'node_modules/.cache';
const out = cache + '/arata-canonical-test';
const entry = cache + '/arata-canonical-entry.js';
await mkdir(cache, { recursive: true });
await writeFile(entry,
  'export { default as Editorial, ARATA_MARINO_OFFICIAL_EDITION } from ' +
  JSON.stringify(root + 'src/arata-marino/ArataMarinoEditorialAccess.jsx') +
  '; export { default as Preview } from ' +
  JSON.stringify(root + 'src/arata-marino/ArataMarinoReaderPreview.jsx') + ';');

try {
  await build({
    configFile: false, root, publicDir: false, logLevel: 'silent',
    plugins: [react()],
    build: {
      outDir: out, emptyOutDir: true, minify: false,
      lib: { entry, formats: ['es'], fileName: 'arata-canonical-test' },
      rollupOptions: { external: ['react', 'react/jsx-runtime', 'lucide-react'] },
    },
  });
  const dom = new JSDOM('<section id="lectura"><div id="root"></div></section>',
    { url: 'https://biblioteca.test/', pretendToBeVisual: true });
  const { window } = dom;
  for (const key of ['window', 'document', 'navigator', 'HTMLElement', 'Element',
    'Node', 'HTMLInputElement', 'HTMLTextAreaElement', 'HTMLSelectElement']) {
    Object.defineProperty(globalThis, key,
      { configurable: true, value: key === 'window' ? window : window[key] });
  }
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  document.fonts = { ready: Promise.resolve() };
  window.matchMedia = () => ({ matches: true });
  window.HTMLElement.prototype.scrollIntoView = () => {};
  window.HTMLElement.prototype.scrollTo = () => {};
  window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  window.HTMLDialogElement.prototype.close = function () { this.open = false; };
  window.confirm = () => true;
  const navigation = [];
  window.open = (...args) => { navigation.push(args); return null; };
  URL.createObjectURL = () => 'blob:synthetic-audio';
  URL.revokeObjectURL = () => {};
  process.env.NODE_ENV = 'development';

  const React = await import('react');
  const { act } = React;
  const { createRoot } = await import('react-dom/client');
  const fixture = await import(pathToFileURL(out + '/arata-canonical-test.js').href);
  const mount = createRoot(document.getElementById('root'));
  const flush = async (fn) => act(async () => {
    await fn?.(); await new Promise(resolve => setTimeout(resolve, 45));
  });

  await flush(() => mount.render(React.createElement(fixture.Editorial)));
  const publicButton = document.querySelector('#lectura .hb-material-open');
  assert.ok(publicButton, 'Se conserva CanonicalReadingEntry');
  assert.equal(publicButton.textContent.trim(), 'CONSULTAR EDICIÓN');
  assert.equal(publicButton.hasAttribute('aria-haspopup'), false,
    'Un enlace a la edición no debe anunciar falsamente un diálogo');
  assert.equal(document.querySelectorAll('dialog').length, 0,
    'No se muestra una pantalla intermedia');
  assert.equal(document.querySelectorAll('input[type="file"]').length, 0,
    'El acceso no solicita materiales al estudiante');
  await flush(() => publicButton.click());
  assert.deepEqual(navigation[0], [fixture.ARATA_MARINO_OFFICIAL_EDITION, '_blank', 'noopener,noreferrer'],
    'Una pulsación abre la edición oficial directamente');
  assert.equal(document.querySelectorAll('.integrated-reader').length, 0,
    'El acceso editorial no se simula como lector con audio');

  // Developer preview of the *actual* IntegratedReader: one click, no prompts.
  const headings = [
    'Darse cuenta',
    'El optimismo capitalista llega a la educación',
    'Destellos de larga duración en la coyuntura educativa desarrollista',
    'Algunos indicios para pensar la trama cultural y educativa del período',
    'Maestros en la epifanía del progreso',
    'La liberación como superación del progreso',
    'Inclusión: sujetos y pedagogía',
    'Imágenes de la oscuridad',
  ];
  const segments = [
    'La apertura describe una idea sintética para el recorrido de prueba.',
    ...headings.map((_,i) => 'Este apartado contiene material de prueba número ' + (i+1) + '.'),
  ];
  const academic = [
    'Lección 10', 'Auroras y tempestades: la educación entre golpes (1955-1976)',
    segments[0], ...headings.flatMap((name,i) => [name, segments[i+1]]),
    'Bibliografía de la lección', 'Sarlo, Beatriz (2001): referencia de ensayo.',
    'Biografías disponibles en el multimedia', 'Autores de prueba',
    'Fuentes disponibles en el multimedia', 'Fuentes sintéticas',
  ].join('\n\n');
  const time = n => '00:00:' + String(n).padStart(2,'0') + ',000';
  const srt = segments.map((text,i) =>
    (i+1) + '\n' + time(i) + ' --> ' + time(i+1) + '\n' + text).join('\n\n');
  let audioFetches = 0;
  globalThis.fetch = async (url) => {
    if (String(url).endsWith('edicion-academica.txt')) return { ok:true, text:async()=>academic };
    if (String(url).endsWith('subtitulos.srt')) return { ok:true, text:async()=>srt };
    const match = String(url).match(/audio-(\d{2})\.part$/);
    if (match) {
      audioFetches += 1;
      const index = Number(match[1]);
      return { ok:true, arrayBuffer:async()=>new ArrayBuffer(index===16 ? 125008 : 2250000) };
    }
    throw Error('Ruta de prueba inesperada: '+url);
  };
  await flush(() => mount.render(React.createElement(fixture.Preview,
    { assetBase: '/assets/arata-marino-local/' })));
  await flush();
  const devButton = document.querySelector('#lectura .hb-material-open');
  assert.ok(devButton, 'La vista local muestra la entrada canónica');
  assert.equal(devButton.textContent.trim(), 'ABRIR EL LECTOR');
  assert.equal(document.querySelectorAll('input[type="file"]').length, 0);
  assert.equal(document.querySelectorAll('dialog').length, 1, 'Un solo modal, el compartido');
  await flush(() => devButton.click());
  assert.equal(document.querySelector('.integrated-reader')?.open, true,
    'Un clic abre directamente IntegratedReader');
  assert.equal(audioFetches, 17, 'Se preparan los 17 fragmentos desde recursos preconfigurados');
  assert.equal(document.querySelector('.reader-player__captions'), null,
    'El SRT no se visualiza en una franja adicional');
  await flush(() => mount.unmount());
  dom.window.close();
  console.log('Arata y Mariño 3.6.17: acceso editorial honesto; integración audiovisual directa en entorno local.');
} finally {
  await rm(out, { recursive: true, force: true });
  await rm(entry, { force: true });
}

// Interacciones reales de React en DOM simulado. No valida diseño ni escucha.
import assert from 'node:assert/strict';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { JSDOM } from 'jsdom';

const rootPath = fileURLToPath(new URL('../', import.meta.url));
const outDir = `${rootPath}node_modules/.cache/reader-runtime`;
const entryPath = `${rootPath}node_modules/.cache/reader-test-entry.js`;
await mkdir(`${rootPath}node_modules/.cache`, { recursive: true });
await writeFile(entryPath, `
      export { default as Reader } from ${JSON.stringify(`${rootPath}src/IntegratedReader.jsx`)};
      export { marcaidaReaderConfig } from ${JSON.stringify(`${rootPath}src/marcaida/readerConfig.js`)};
      export { default as marcaidaDocument } from ${JSON.stringify(`${rootPath}src/marcaida/reading-document.json`)};
      export * from ${JSON.stringify(`${rootPath}src/readerConfigs.js`)};
      export { readingDocument as pineauDocument } from ${JSON.stringify(`${rootPath}src/readingDocument.js`)};
      export { orbuchReadingDocument as orbuchDocument } from ${JSON.stringify(`${rootPath}src/orbuch/orbuchReadingDocument.js`)};
      export { hobsbawmReadingDocument as hobsbawmDocument } from ${JSON.stringify(`${rootPath}src/hobsbawm/hobsbawmReadingDocument.js`)};
      export { aisensteinReadingDocument as aisensteinDocument } from ${JSON.stringify(`${rootPath}src/aisenstein/aisensteinReadingDocument.js`)};
    `);
await build({
  configFile: false, root: rootPath, publicDir: false, logLevel: 'silent',
  plugins: [react()],
  build: {
    outDir, emptyOutDir: true, minify: false,
    lib: { entry: entryPath, formats: ['es'], fileName: 'reader-runtime' },
    rollupOptions: { external: ['react', 'react/jsx-runtime', 'lucide-react'] },
  },
});

const dom = new JSDOM('<div id="root"></div>', { url: 'https://reader.test/', pretendToBeVisual: true });
const { window } = dom;
for (const key of ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'HTMLInputElement', 'HTMLTextAreaElement', 'HTMLSelectElement']) {
  Object.defineProperty(globalThis, key, { value: key === 'window' ? window : window[key], configurable: true });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
window.matchMedia = () => ({ matches: true });
window.confirm = () => true; // Únicamente notas ficticias de esta prueba aislada.
const scrolls = [];
window.HTMLElement.prototype.scrollIntoView = function () { scrolls.push(this); };
window.HTMLElement.prototype.scrollTo = function ({ top }) { this.scrollTop = top; };
window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
window.HTMLDialogElement.prototype.close = function () { this.open = false; };
const audioStates = new WeakMap();
let audioDuration = 2026.374625;
Object.defineProperties(window.HTMLMediaElement.prototype, {
  readyState: { get: () => 4 },
  duration: { get: () => audioDuration },
  paused: { get() { return audioStates.get(this) !== 'playing'; } },
});
window.HTMLMediaElement.prototype.play = async function () { audioStates.set(this, 'playing'); this.dispatchEvent(new window.Event('play')); };
window.HTMLMediaElement.prototype.pause = function () { audioStates.set(this, 'paused'); this.dispatchEvent(new window.Event('pause')); };
globalThis.fetch = async () => ({ ok: true, blob: async () => new Blob(['test audio']), arrayBuffer: async () => new ArrayBuffer(1) });
const blobs = new Map();
let blobCounter = 0;
URL.createObjectURL = blob => { const url = `blob:test-${++blobCounter}`; blobs.set(url, blob); return url; };
URL.revokeObjectURL = () => {};
const downloads = [];
window.HTMLAnchorElement.prototype.click = function () { downloads.push({ name: this.download, blob: blobs.get(this.href) }); };

process.env.NODE_ENV = 'development';
const React = await import('react');
const { act } = React;
const { createRoot } = await import('react-dom/client');
const fixture = await import(pathToFileURL(`${outDir}/reader-runtime.js`).href);
const mountNode = document.getElementById('root');
let mounted;
const flush = async fn => act(async () => { await fn?.(); await new Promise(resolve => window.setTimeout(resolve, 25)); });
const byLabel = label => [...document.querySelectorAll('[aria-label]')].find(el => el.getAttribute('aria-label') === label);
const byText = (selector, text) => [...document.querySelectorAll(selector)].find(el => el.textContent.trim() === text);
const click = async el => { assert.ok(el, 'Existe el control solicitado'); await flush(() => el.click()); };
const select = async value => flush(() => { const el = byLabel('Elegir capítulo del texto'); el.value = value; el.dispatchEvent(new window.Event('change', { bubbles: true })); });
const updateTime = async time => flush(() => { const audio = document.querySelector('audio'); audio.currentTime = time; audio.dispatchEvent(new window.Event('timeupdate')); });
const typeComment = async text => flush(() => {
  const el = document.querySelector('textarea');
  Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set.call(el, text);
  el.dispatchEvent(new window.Event('input', { bubbles: true }));
});
const cancelDialog = async () => flush(() => document.querySelector('.integrated-reader').dispatchEvent(new window.Event('cancel', { cancelable: true })));
const Launcher = ({ onOpen }) => React.createElement('button', { onClick: onOpen }, 'Abrir prueba');
async function mount(config, doc) {
  audioDuration = doc.duration;
  mounted = createRoot(mountNode);
  await flush(() => mounted.render(React.createElement(fixture.Reader, { config, readingDocument: doc, Launcher })));
  await click(byText('button', 'Abrir prueba'));
  await flush(() => document.querySelector('audio').dispatchEvent(new window.Event('loadedmetadata')));
}
async function unmount() { await flush(() => mounted.unmount()); }

const config = fixture.marcaidaReaderConfig;
const doc = fixture.marcaidaDocument;
const legacyId = doc.sections[0].paragraphs[0].sentences[1].id;
const legacyNotes = [
  { id: 'legacy-sentence', sentenceId: legacyId, text: 'Nota previa de una oración', createdAt: '2026-11-01T10:00:00Z' },
  { id: 'legacy-cover', sentenceId: doc.frontMatter[0].id, text: 'Nota previa de portada' },
  { id: 'legacy-other', sentenceId: doc.sections[1].paragraphs[0].sentences[0].id, text: 'Otra nota previa', audioTime: 101 },
];
window.localStorage.setItem(config.storage.notesKey, JSON.stringify(legacyNotes));
await mount(config, doc);
assert.equal(document.querySelectorAll('.reader-paragraph-unit').length, 42);
assert.equal(document.querySelector('audio').paused, true, 'Sin reproducción automática');
assert.equal(document.documentElement.style.overflow, 'hidden', 'Sin scroll de la página debajo del lector');
let notes = JSON.parse(window.localStorage.getItem(config.storage.notesKey));
assert.equal(notes.length, 3);
assert.equal(notes[0].sentenceId, 'ms-introduccion-p1');
assert.equal(notes[0].originalSentenceId, legacyId);
assert.deepEqual(notes.map(n => n.text), legacyNotes.map(n => n.text), 'Migración sin perder comentarios');

await select('apartado-4');
await select('frontmatter');
assert.equal(byLabel('Elegir capítulo del texto').value, 'frontmatter');
assert.equal(document.querySelector('.reader-text-scroll').scrollTop, 0);
await select('introduccion');
await click(byLabel('Seguir el texto'));
for (const interval of config.sync.paragraphTimings) {
  await updateTime((interval.start + interval.end) / 2);
  assert.equal(document.querySelector('.reader-paragraph-unit.is-active')?.dataset.readerSentence, interval.id);
}
for (const time of [0, 13, 2021, doc.duration]) {
  await updateTime(time);
  assert.equal(document.querySelectorAll('.reader-paragraph-unit.is-active').length, 0, 'Sin resaltar portada ni cola del audio');
}
for (const interval of config.sync.paragraphTimings.filter(p => !p.asrBounded)) {
  await updateTime(interval.start);
  assert.equal(document.querySelector('.is-active[data-reader-sentence]')?.dataset.readerSentence, interval.id);
}
await updateTime(790);
let before = scrolls.length;
await updateTime(800);
assert.equal(scrolls.length, before, 'No recentrar continuamente dentro de un párrafo largo');
await click(byLabel('Dejar de seguir el texto'));
before = scrolls.length;
await updateTime(860);
assert.equal(scrolls.length, before, 'Seguimiento desactivado');
const follow = byLabel('Seguir el texto');
await flush(() => follow.dispatchEvent(new window.KeyboardEvent('keydown', { code: 'Space', key: ' ', bubbles: true, cancelable: true })));
assert.equal(document.querySelector('audio').paused, true, 'Espacio sobre un control no reproduce el audio');
await click(follow);
assert.ok(scrolls.length > before);

const paragraph = document.querySelector('[data-reader-sentence="ms-apartado-4-p3"]');
const paragraphText = doc.sections.at(-1).paragraphs[2].sentences.map(s => s.text).join(' ');
await click(paragraph.querySelectorAll('.reader-paragraph-unit__text')[1]);
await click(byText('button', 'Escuchar desde aquí'));
assert.equal(document.querySelector('audio').currentTime, 1775.5);
assert.equal(document.querySelector('audio').paused, false);
await click(byLabel('Anotar'));
assert.equal(document.querySelector('audio').paused, true);
assert.equal(document.activeElement.tagName, 'TEXTAREA');
assert.equal(document.querySelector('.note-editor blockquote').textContent.includes(paragraphText), true, 'La nota cita todo el párrafo');
await typeComment('Comentario de prueba sobre el párrafo completo');
await click(byText('button', 'Guardar y continuar'));
assert.equal(document.querySelector('audio').paused, false);
await click(byLabel('Pausar audiolibro'));
await click(byLabel('Abrir cuaderno'));
assert.equal(document.activeElement, byLabel('Cerrar cuaderno'));
const noteCard = [...document.querySelectorAll('.notes-drawer .margin-note')].find(el => el.textContent.includes('Comentario de prueba'));
await click(noteCard.querySelector('[aria-label="Editar nota"]'));
await typeComment('Comentario editado');
await click(byText('button', 'Guardar nota'));
await click(byLabel('Abrir cuaderno'));
await click(byText('button', 'Descargar TXT'));
await click(byText('button', 'Copia JSON'));
const exported = JSON.parse(await downloads.find(x => x.name.endsWith('.json')).blob.text());
assert.equal(exported.entries.length, 4);
const exportedNote = exported.entries.find(x => x.note === 'Comentario editado');
assert.equal(exported.notes.find(n => n.id === exportedNote.id).sentenceId, 'ms-apartado-4-p3');
assert.equal(exportedNote.selectedText, paragraphText);
assert.match(await downloads.find(x => x.name.endsWith('.txt')).blob.text(), /Comentario editado/);
await cancelDialog();
assert.equal(document.querySelector('.notes-drawer'), null, 'Escape cierra el cuaderno');
assert.equal(document.querySelector('.integrated-reader').open, true);

for (const note of doc.endnotes) {
  await click(byLabel(`Consultar nota editorial ${note.number} de la edición de Marcaida y Scaltritti`));
  assert.equal(document.querySelector('#reader-editorial-note-' + note.number).parentElement.closest('details').open, true);
  await click(byText(`#reader-editorial-note-${note.number} button`, 'Volver al pasaje'));
  assert.equal(document.activeElement.closest('.reader-paragraph-unit')?.dataset.readerSentence,
    doc.sections.flatMap(s => s.paragraphs).find(p => p.sentences.some(s => s.id === note.sentenceId)).id);
}
await click(byLabel('Abrir cuaderno'));
const editedCard = [...document.querySelectorAll('.notes-drawer .margin-note')].find(el => el.textContent.includes('Comentario editado'));
await click(editedCard.querySelector('[aria-label="Eliminar nota"]'));
assert.equal(JSON.parse(window.localStorage.getItem(config.storage.notesKey)).length, 3, 'Eliminar solo la nota ficticia');
await cancelDialog();
await click(byLabel('Anotar'));
await cancelDialog();
assert.equal(document.querySelector('.note-editor'), null, 'Escape cierra el editor');
assert.equal(document.querySelector('.integrated-reader').open, true);
await updateTime(1260.9);
await click(byLabel('Seguir el texto'));
await click(byLabel('Cerrar modo lectura'));
assert.equal(document.documentElement.style.overflow, '');
await new Promise(resolve => window.setTimeout(resolve, 500));
await unmount();
await mount(config, doc);
assert.equal(document.querySelector('audio').currentTime, 1260.9, 'Recuperar progreso tras remontar');
assert.equal(document.querySelector('audio').paused, true);
assert.equal(document.querySelector('.reader-paragraph-unit.is-active').dataset.readerSentence, 'ms-apartado-3-p15');
assert.equal(JSON.parse(window.localStorage.getItem(config.storage.notesKey)).length, 3);
await unmount();

// Regresión de las cuatro obras en su modalidad original con sus documentos reales.
for (const work of ['pineau', 'orbuch', 'hobsbawm', 'aisenstein']) {
  const otherConfig = fixture[`${work}ReaderConfig`];
  const otherDoc = fixture[`${work}Document`];
  await mount(otherConfig, otherDoc);
  assert.equal(document.querySelectorAll('.reader-paragraph-unit').length, 0, work);
  assert.ok(document.querySelectorAll('.reader-sentence').length > 0, work);
  assert.equal(document.documentElement.style.overflow, '', work);
  const timed = [...otherDoc.frontMatter, ...otherDoc.sections.flatMap(s => [s.headingSentence, ...s.paragraphs.flatMap(p => p.sentences)])].find(s => s && Number.isFinite(s.start));
  await updateTime(timed.start + 0.01);
  assert.equal(document.querySelector('.reader-sentence.is-active')?.dataset.readerSentence, timed.id, work);
  await click(document.querySelector(`[data-reader-sentence="${timed.id}"]`));
  await click(byLabel('Anotar'));
  await typeComment(`Nota de regresión ${work}`);
  await click(byText('button', 'Guardar nota'));
  await click(byLabel('Abrir cuaderno'));
  await click(byText('button', 'Copia JSON'));
  const last = JSON.parse(await downloads.at(-1).blob.text());
  assert.equal(last.workId, otherConfig.workId);
  assert.equal(last.notes[0].sentenceId, timed.id);
  assert.equal(JSON.parse(window.localStorage.getItem(config.storage.notesKey)).length, 3, 'Namespaces independientes');
  await unmount();
}
dom.window.close();
await rm(outDir, { recursive: true, force: true });
await rm(entryPath, { force: true });
console.log('Runtime: 42 párrafos, seis límites aproximados (solo control lógico), migración, selección, seguimiento, notas CRUD/TXT/JSON, diez referencias, foco/teclado y recuperación de progreso. Regresión de cuatro lectores por oración aprobada. No prueba escucha ni responsive.');

// Interacciones reales de React en DOM simulado. No valida diseño ni escucha.
import assert from 'node:assert/strict';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { JSDOM } from 'jsdom';

const rootPath = fileURLToPath(new URL('../', import.meta.url));
const outDir = `${rootPath}node_modules/.cache/soares-runtime`;
const entryPath = `${rootPath}node_modules/.cache/soares-test-entry.js`;
await mkdir(`${rootPath}node_modules/.cache`, { recursive: true });
let sourceDoc;
try { sourceDoc=JSON.parse(await (await import('node:fs/promises')).readFile(`${rootPath}.local/soares/reader-document.json`,'utf8')); }
catch(e) { if(e.code!=='ENOENT')throw e; }
if(!sourceDoc) sourceDoc={id:'soares-corrientes-gimnasticas',title:'Texto sintético de prueba',author:'Autora de prueba',duration:3113.377959,frontMatter:[{id:'soa-title',role:'title',text:'Título de prueba'}],sections:Array.from({length:7},(_,i)=>({id:`apartado-${i}`,title:`Apartado ${i}`,paragraphs:[{id:`soa-p${i}`,sentences:[{id:`soa-p${i}-s1`,text:'Primera oración de prueba.'},{id:`soa-p${i}-s2`,text:'Segunda oración de prueba.'}]}]})),endnotes:Array.from({length:29},(_,i)=>({number:i+1,text:`Nota académica sintética ${i+1}`,sentenceId:'soa-p0-s1'})),bibliography:['Referencia sintética de prueba'],sourceNote:'Sin seguimiento automático.'};
await writeFile(entryPath, `export { default as Reader } from ${JSON.stringify(`${rootPath}src/IntegratedReader.jsx`)};export { soaresReaderConfig } from ${JSON.stringify(`${rootPath}src/soares/readerConfig.js`)};export { soaresParagraphPreviewConfig } from ${JSON.stringify(`${rootPath}src/soares/paragraphPreviewConfig.js`)};export const soaresDocument=${JSON.stringify(sourceDoc)};`);
await build({
  configFile: false, root: rootPath, publicDir: false, logLevel: 'silent',
  plugins: [react()],
  build: {
    outDir, emptyOutDir: true, minify: false,
    lib: { entry: entryPath, formats: ['es'], fileName: 'soares-runtime' },
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
let audioDuration = 1878.909388;
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
const fixture = await import(pathToFileURL(`${outDir}/soares-runtime.js`).href);
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

const config=fixture.soaresReaderConfig,doc=fixture.soaresDocument;
window.localStorage.setItem('fresco-noble-reader-notes-v1',JSON.stringify([{id:'sentinel',text:'No modificar'}]));
await mount(config,doc);
assert.equal(document.querySelector('audio').paused,true);
assert.equal(document.querySelectorAll('.reader-paragraph-unit').length,0,'Unidad oración');
assert.equal(document.documentElement.style.overflow,'hidden');
const sentence=doc.sections[0].paragraphs[0].sentences[0];
await select(doc.sections[0].id);
await click(document.querySelector(`[data-reader-sentence="${sentence.id}"]`));
const listen=byText('button','Escuchar desde aquí');assert.ok(!listen||listen.disabled,'Sin salto ficticio');
await updateTime(1500);assert.equal(document.querySelectorAll('.reader-sentence.is-active').length,0,'Sin resaltado sin verificar');
for(const number of [1,9,22,29]) {
 await click(byLabel(`Consultar nota editorial ${number} de la edición de Soares`));
 assert.equal(document.activeElement.id,`reader-editorial-note-${number}`);
 await click(byText(`#reader-editorial-note-${number} button`,'Volver al pasaje'));
}
await click(document.querySelector(`[data-reader-sentence="${sentence.id}"]`));
await click(byLabel('Anotar'));await typeComment('Comentario sintético Soares');
await click(byText('button','Guardar nota'));
await click(byLabel('Abrir cuaderno'));await click(byText('button','Copia JSON'));await click(byText('button','Descargar TXT'));
const exported=JSON.parse(await downloads.at(-2).blob.text());
assert.equal(exported.workId,config.workId);assert.equal(exported.notes[0].sentenceId,sentence.id);
assert.match(await downloads.at(-1).blob.text(),/Comentario sintético Soares/);
assert.equal(JSON.parse(window.localStorage.getItem(config.storage.notesKey)).length,1,'Notas académicas no son personales');
assert.equal(JSON.parse(window.localStorage.getItem('fresco-noble-reader-notes-v1'))[0].id,'sentinel');
await cancelDialog();await updateTime(1800);await click(byLabel('Cerrar modo lectura'));
await new Promise(resolve=>window.setTimeout(resolve,500));await unmount();await mount(config,doc);
assert.equal(document.querySelector('audio').currentTime,1800);assert.equal(document.querySelector('audio').paused,true);
assert.equal(JSON.parse(window.localStorage.getItem(config.storage.notesKey))[0].text,'Comentario sintético Soares');
await unmount();

// Segundo montaje aislado: VTT estimativo por párrafos, sin tocar las notas de la configuración habitual.
const pilotConfig = fixture.soaresParagraphPreviewConfig;
assert.equal(pilotConfig.sync.unit, 'paragraph');
assert.equal(pilotConfig.sync.status, 'paragraph-preview');
assert.equal(pilotConfig.sync.paragraphTimings.length, 70);
assert.notEqual(pilotConfig.storage.notesKey, config.storage.notesKey);
assert.notEqual(pilotConfig.storage.stateKey, config.storage.stateKey);
const pilotDoc = {
  id: config.workId, title: 'Texto de ensayo por párrafos', author: 'Autora de ensayo',
  duration: 3113.377959, frontMatter: [{ id: 'soa-title', role: 'title', text: 'Título de ensayo' }],
  sections: [{
    id: 'introduccion', title: 'Introducción',
    headingSentence: { id: 'soa-introduccion-heading', text: 'Introducción' },
    paragraphs: [
      { id: 'soa-introduccion-p1', sentences: [{ id: 'soa-introduccion-p1-s1', text: 'Primera oración del primer párrafo.' }] },
      { id: 'soa-introduccion-p2', sentences: [{ id: 'soa-introduccion-p2-s1', text: 'Primera oración del segundo párrafo.' }] },
    ],
  }],
  endnotes: [{ number: 1, text: 'Nota académica de ensayo', sentenceId: 'soa-introduccion-p1-s1', page: 1 }],
  bibliography: ['Referencia de ensayo'],
  sourceNote: 'Ensayo local no publicado.',
};
await mount(pilotConfig, pilotDoc);
assert.equal(document.querySelectorAll('.reader-paragraph-unit').length, 2);
await updateTime(20);
assert.equal(document.querySelectorAll('.reader-paragraph-unit.is-active').length, 1);
assert.equal(document.querySelector('.reader-paragraph-unit.is-active')?.getAttribute('data-reader-sentence'), 'soa-introduccion-p1');
await updateTime(120);
assert.equal(document.querySelector('.reader-paragraph-unit.is-active')?.getAttribute('data-reader-sentence'), 'soa-introduccion-p2');
await click(byLabel('Consultar nota editorial 1 de la edición de Soares'));
assert.equal(document.activeElement.id, 'reader-editorial-note-1');
await click(byText('#reader-editorial-note-1 button', 'Volver al pasaje'));
assert.ok(!window.localStorage.getItem(pilotConfig.storage.notesKey) || JSON.parse(window.localStorage.getItem(pilotConfig.storage.notesKey)).length === 0);
assert.equal(JSON.parse(window.localStorage.getItem(config.storage.notesKey))[0].text, 'Comentario sintético Soares');
await unmount();
dom.window.close();await rm(outDir,{recursive:true,force:true});await rm(entryPath,{force:true});
console.log('Soares runtime: modo original sin resaltado y piloto por párrafos en DOM sintético, notas académicas, progreso, separación de claves. Sin prueba perceptiva.');

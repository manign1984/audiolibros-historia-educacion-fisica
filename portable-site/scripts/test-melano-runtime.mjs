// Prueba funcional del lector de Melano en DOM sintético; NO acredita percepción auditiva ni diseño responsive.
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { JSDOM } from 'jsdom';
import { buildMelanoReadingDocument } from '../src/melano/buildMelanoReadingDocument.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const cache = root + 'node_modules/.cache';
const output = cache + '/melano-runtime';
const entry = cache + '/melano-test-entry.js';
await mkdir(cache, { recursive: true });
await writeFile(entry, 'export { default as Reader } from ' + JSON.stringify(root+'src/IntegratedReader.jsx') + ';export { melanoReaderConfig } from ' + JSON.stringify(root+'src/melano/readerConfig.js') + ';');
await build({ configFile: false, root, publicDir: false, logLevel: 'silent', plugins: [react()], build: {
  outDir: output, emptyOutDir: true, minify: false,
  lib: { entry, formats: ['es'], fileName: 'melano-runtime' },
  rollupOptions: { external: ['react','react/jsx-runtime','lucide-react'] }
} });
const [academic, subtitles] = await Promise.all([
  readFile(root+'public/assets/melano/texto-academico.txt','utf8'),
  readFile(root+'public/assets/melano/subtitulos.srt','utf8')
]);
const data = buildMelanoReadingDocument(academic, subtitles);
const dom = new JSDOM('<div id="root"></div>', { url:'https://melano.test/',pretendToBeVisual:true });
const {window}=dom;
for (const key of ['window','document','navigator','HTMLElement','Element','Node','HTMLInputElement','HTMLTextAreaElement','HTMLSelectElement']) {
  Object.defineProperty(globalThis,key,{value:key==='window'?window:window[key],configurable:true});
}
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
window.matchMedia=()=>({matches:true});
window.confirm=()=>true;
window.HTMLElement.prototype.scrollIntoView=function(){};
window.HTMLElement.prototype.scrollTo=function(){};
window.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
window.HTMLDialogElement.prototype.close=function(){this.open=false;};
const playback = new WeakMap();
Object.defineProperties(window.HTMLMediaElement.prototype, {
 readyState:{get:()=>4},
 duration:{get:()=>2348.802},
 paused:{get(){return playback.get(this)!=='playing';}}
});
window.HTMLMediaElement.prototype.play=async function(){playback.set(this,'playing');this.dispatchEvent(new window.Event('play'));};
window.HTMLMediaElement.prototype.pause=function(){playback.set(this,'paused');this.dispatchEvent(new window.Event('pause'));};
let fetched=[];
globalThis.fetch=async url=>{
  fetched.push(String(url));
  const part=String(url).match(/audio-(\d\d)\.part$/);
  assert.ok(part,'Se solicita exclusivamente un fragmento MP3 real');
  const bytes=Number(part[1])===7?2936567:2936569;
  return {ok:true,arrayBuffer:async()=>new ArrayBuffer(bytes)};
};
const blobs=[];
URL.createObjectURL=blob=>{blobs.push(blob);return 'blob:melano-test-'+blobs.length;};
URL.revokeObjectURL=()=>{};
window.HTMLAnchorElement.prototype.click=function(){};
process.env.NODE_ENV='development';
const React=await import('react');
const {act}=React;
const {createRoot}=await import('react-dom/client');
const fixture=await import(pathToFileURL(output+'/melano-runtime.js').href);
const config={...fixture.melanoReaderConfig,
 captionCues:data.cues,
 sync:{...fixture.melanoReaderConfig.sync,paragraphTimings:data.paragraphTimings}};
const firstPageSentinel=[{id:'prior-page',sentenceId:data.document.sections[0].paragraphs[0].id,text:'Nota académica personal previamente conservada'}];
window.localStorage.setItem(config.storage.notesKey,JSON.stringify(firstPageSentinel));
const Launcher=({onOpen})=>React.createElement('button',{onClick:onOpen},'Abrir Melano');
const mounted=createRoot(document.getElementById('root'));
const flush=async action=>act(async()=>{await action?.();await new Promise(resolve=>setTimeout(resolve,30));});
const control=(label)=>[...document.querySelectorAll('[aria-label]')].find(x=>x.getAttribute('aria-label')===label);
const button=(text)=>[...document.querySelectorAll('button')].find(x=>x.textContent.trim()===text);
const click=async element=>{assert.ok(element,'Debe existir el control solicitado');await flush(()=>element.click());};
const setAudio=async seconds=>flush(()=>{
 const audio=document.querySelector('audio');audio.currentTime=seconds;audio.dispatchEvent(new window.Event('timeupdate'));
});
await flush(()=>mounted.render(React.createElement(fixture.Reader,{config,readingDocument:data.document,Launcher})));
await click(button('Abrir Melano'));
await flush();
assert.equal(fetched.length,8,'Los ocho fragmentos se solicitan una sola vez');
assert.equal(blobs[0]?.size,23492550,'Audio recompuesto sin pérdida de bytes');
const audio=document.querySelector('audio');
assert.ok(audio);
assert.equal(audio.paused,true,'No reproducir automáticamente');
await flush(()=>audio.dispatchEvent(new window.Event('loadedmetadata')));
assert.equal(document.querySelectorAll('.reader-paragraph-unit').length,61);
assert.equal(document.querySelectorAll('.reader-editorial-note-body').length,20);
assert.equal(JSON.parse(window.localStorage.getItem(config.storage.notesKey))[0].text,firstPageSentinel[0].text);
const first=data.paragraphTimings[0];
await setAudio((first.start+first.end)/2);
assert.equal(document.querySelector('.reader-paragraph-unit.is-active')?.dataset.readerSentence,first.id);
const cue=data.cues.find(x=>x.start<=17&&x.end>17);
assert.ok(cue,'Existe un subtítulo real a los 17 segundos');
await setAudio(17);
assert.equal(document.querySelector('.reader-player__captions p')?.textContent, cue.text);
await click(button('Ocultar subtítulos'));
assert.equal(document.querySelector('.reader-player__captions p'),null);
await click(button('Mostrar subtítulos'));
assert.equal(document.querySelector('.reader-player__captions p')?.textContent,cue.text);
await click(control('Reproducir audiolibro'));
assert.equal(audio.paused,false);
await click(control('Pausar audiolibro'));
assert.equal(audio.paused,true);
const last=data.paragraphTimings.at(-1);
await setAudio((last.start+last.end)/2);
assert.equal(document.querySelector('.reader-paragraph-unit.is-active')?.dataset.readerSentence,last.id);
await click(control('Cerrar modo lectura'));
await flush(()=>mounted.unmount());
dom.window.close();
await rm(output,{recursive:true,force:true});
await rm(entry,{force:true});
console.log('Melano runtime: MP3 segmentado, subtítulos SRT activables, 61 párrafos, 20 notas, progreso, reproducción y cierre DOM simulados. No es prueba perceptiva ni responsive.');

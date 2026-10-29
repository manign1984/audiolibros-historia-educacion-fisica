import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { resolve, dirname, basename } from 'node:path';
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Derive the measuring document from Pineau itself on every dev/build run.
// It has no scripts, audio, video playback or storage; only the original flow.
const output = resolve('public/layout');
await mkdir(resolve(output, 'fonts'), { recursive: true });
const server = await createServer({ server: { middlewareMode: true, watch: null }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom' });
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx');
  await server.watcher.close();
  let markup = renderToStaticMarkup(React.createElement(App));
  markup = markup.replaceAll(`${server.config.base}assets/`, '../assets/');
  markup = markup.replace(/<link\b[^>]*>/g, '').replace(/<dialog\b[\s\S]*?<\/dialog>/g, '');
  markup = markup.replace(/<iframe\b[^>]*>/g, tag => tag.replace(/\ssrc="[^"]*"/g, ''));
  let fonts = '';
  for (const [family, weights] of [['archivo', [400, 500, 600, 700]], ['bebas-neue', [400]], ['limelight', [400]], ['poiret-one', [400]]]) {
    for (const weight of weights) {
      const path = resolve(`node_modules/@fontsource/${family}/latin-${weight}.css`);
      let css = await readFile(path, 'utf8');
      const urls = [...css.matchAll(/url\(([^)]+)\)/g)].map(m => m[1]);
      for (const url of urls) {
        const name = basename(url);
        await copyFile(resolve(dirname(path), url), resolve(output, 'fonts', name));
        css = css.replaceAll(url, `./fonts/${name}`);
      }
      fonts += css;
    }
  }
  const styles = (await Promise.all(['src/styles.css', 'src/reader.css', 'src/shared/journey-header.css', 'src/shared/hero-viewport.css', 'src/shared/author-viewport.css', 'src/shared/journey-block-labels.css', 'src/pineau-block-labels.css'].map(p => readFile(p, 'utf8')))).join('\n').replaceAll('/assets/', '../assets/');
  await writeFile(resolve(output, 'pineau-reference.css'), fonts + '\n' + styles);
  await writeFile(resolve(output, 'pineau-reference.html'), `<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="robots" content="noindex"><title>Referencia estructural de Pineau</title><link rel="stylesheet" href="./pineau-reference.css"></head><body inert>${markup}</body></html>`);
  console.log('Referencia estructural generada desde los componentes y estilos de Pineau.');
} finally {
  await server.close();
}

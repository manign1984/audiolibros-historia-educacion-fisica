import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import {
  diagnosisItems,
  genealogyThemes,
  glossary,
  players,
  readingTabs,
  strategies,
  timeline,
} from '../portable-site/src/data.js';
import { readingDocument } from '../portable-site/src/readingDocument.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const portable = path.join(root, 'portable-site');
const output = path.join(root, 'data');
fs.mkdirSync(output, { recursive: true });

const sourceFiles = [
  'src/App.jsx',
  'src/IntegratedReader.jsx',
  'src/data.js',
  'src/readingDocument.js',
  'src/styles.css',
  'src/reader.css',
  'index.html',
];

const sourceText = new Map(sourceFiles.map((file) => [file, fs.readFileSync(path.join(portable, file), 'utf8')]));
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

function secondsToSrt(seconds) {
  const milliseconds = Math.max(0, Math.round(seconds * 1000));
  const hours = Math.floor(milliseconds / 3_600_000);
  const minutes = Math.floor((milliseconds % 3_600_000) / 60_000);
  const secs = Math.floor((milliseconds % 60_000) / 1000);
  const millis = milliseconds % 1000;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(millis).padStart(3, '0')}`;
}

function csvCell(value) {
  const string = value == null ? '' : String(value);
  return /[",\n]/.test(string) ? `"${string.replaceAll('"', '""')}"` : string;
}

const readingUnits = [
  ...(readingDocument.frontMatter || []).map((sentence) => ({
    ...sentence,
    sectionId: 'frontmatter',
    sectionTitle: 'Portada',
    paragraphId: null,
    kind: sentence.role,
  })),
  ...readingDocument.sections.flatMap((section) => [
    ...(section.headingSentence ? [{
      ...section.headingSentence,
      sectionId: section.id,
      sectionTitle: section.title,
      paragraphId: null,
      kind: 'heading',
    }] : []),
    ...section.paragraphs.flatMap((paragraph) => paragraph.sentences.map((sentence) => ({
      ...sentence,
      sectionId: section.id,
      sectionTitle: section.title,
      paragraphId: paragraph.id,
      kind: paragraph.kind || 'paragraph',
    }))),
  ]),
];

fs.writeFileSync(path.join(output, 'reading-sync_exact.json'), `${JSON.stringify({
  provenance: {
    classification: 'literal_extraction',
    source: 'portable-site/src/readingDocument.js',
    sourceCommit: '7882327b5bf619ba81335d136e9eddc96cf894c9',
    warning: 'No es el SRT original de ElevenLabs; conserva exactamente las 201 unidades y tiempos usados por el Site.',
  },
  document: {
    title: readingDocument.title,
    subtitle: readingDocument.subtitle,
    author: readingDocument.author,
    duration: readingDocument.duration,
    source: readingDocument.source,
  },
  units: readingUnits,
}, null, 2)}\n`);

const srt = readingUnits.map((unit, index) => [
  index + 1,
  `${secondsToSrt(unit.start)} --> ${secondsToSrt(unit.end)}`,
  unit.text,
].join('\n')).join('\n\n');
fs.writeFileSync(path.join(output, 'reading-sync_reconstructed-from-site.srt'), `${srt}\n`);

fs.writeFileSync(path.join(output, 'content-structure_exact.json'), `${JSON.stringify({
  provenance: {
    classification: 'literal_extraction',
    sourceCommit: '7882327b5bf619ba81335d136e9eddc96cf894c9',
    sources: ['src/App.jsx', 'src/data.js', 'src/readingDocument.js'],
  },
  navigation: [
    ['inicio', 'Inicio'],
    ['autor', 'Autor'],
    ['contexto', 'Contexto'],
    ['lectura', 'Lectura'],
    ['partido', 'Partido'],
    ['genealogia', 'Conciencia histórica'],
    ['creditos', 'Créditos'],
  ],
  strategies,
  players,
  timeline,
  diagnosisItems,
  genealogyThemes,
  declaredButNotRendered: { readingTabs, glossary },
  reading: {
    title: readingDocument.title,
    subtitle: readingDocument.subtitle,
    author: readingDocument.author,
    duration: readingDocument.duration,
    source: readingDocument.source,
    sections: readingDocument.sections.map((section) => ({
      id: section.id,
      title: section.title,
      shortTitle: section.shortTitle,
      paragraphCount: section.paragraphs.length,
      sentenceCount: section.paragraphs.reduce((total, paragraph) => total + paragraph.sentences.length, 0),
    })),
    renderedUnitCount: readingUnits.length,
    endnoteCount: readingDocument.endnotes.length,
    bibliographyCount: readingDocument.bibliography.length,
    legacySentenceMapCount: Object.keys(readingDocument.legacySentenceMap || {}).length,
  },
}, null, 2)}\n`);

const assetDir = path.join(portable, 'public', 'assets');
const declaredNotRendered = new Set([
  '/assets/estrategia-cooptativa-archivo.webp',
  '/assets/estrategia-renovadora-archivo.webp',
  '/assets/estrategia-represiva-archivo.webp',
]);
const unreferenced = new Set([
  '/assets/estrategia-renovadora.webp',
  '/assets/salamone-carhue.webp',
  '/assets/timeline-1937-guernica.jpg',
]);

const assets = fs.readdirSync(assetDir).sort().map((name) => {
  const file = path.join(assetDir, name);
  const publicPath = `/assets/${name}`;
  const stat = fs.statSync(file);
  const extension = path.extname(name).slice(1).toLowerCase();
  const references = [...sourceText].filter(([, text]) => text.includes(publicPath)).map(([source]) => source);
  const record = {
    path: publicPath,
    bytes: stat.size,
    sha256: sha256(file),
    extension,
    status: unreferenced.has(publicPath)
      ? 'unreferenced'
      : declaredNotRendered.has(publicPath)
        ? 'declared_not_rendered'
        : 'runtime',
    sourceReferences: references,
    width: null,
    height: null,
    durationSeconds: null,
    pages: null,
  };

  if (['jpg', 'jpeg', 'png', 'webp'].includes(extension)) {
    try {
      const dimensions = execFileSync('identify', ['-format', '%w %h', file], { encoding: 'utf8' }).trim().split(/\s+/);
      record.width = Number(dimensions[0]);
      record.height = Number(dimensions[1]);
    } catch {}
  } else if (extension === 'mp3') {
    try {
      const metadata = JSON.parse(execFileSync('ffprobe', [
        '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'json',
        file,
      ], { encoding: 'utf8' }));
      record.durationSeconds = Number(metadata.format.duration);
    } catch {}
  } else if (extension === 'pdf') {
    try {
      const metadata = execFileSync('pdfinfo', [file], { encoding: 'utf8' });
      record.pages = Number(metadata.match(/^Pages:\s+(\d+)/m)?.[1] || 0) || null;
    } catch {}
  }
  return record;
});

const assetCsvHeaders = ['path', 'bytes', 'sha256', 'extension', 'status', 'sourceReferences', 'width', 'height', 'durationSeconds', 'pages'];
fs.writeFileSync(path.join(output, 'assets-inventory.csv'), `${[
  assetCsvHeaders.join(','),
  ...assets.map((asset) => assetCsvHeaders.map((key) => csvCell(key === 'sourceReferences' ? asset[key].join(';') : asset[key])).join(',')),
].join('\n')}\n`);

const runtimeExternal = [
  ['image', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Uruguay_national_football_team_1930.jpg', 'timeline-1930'],
  ['image', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Paraguayos_en_alihuat%C3%A1.jpg', 'timeline-1932-35'],
  ['image', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Roca_Runciman.jpg', 'timeline-1933'],
  ['image', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Chaplin_-_Modern_Times.jpg', 'timeline-1936'],
  ['video_embed', 'https://www.youtube-nocookie.com/embed/cbrqOu1pQU0?rel=0', 'context-video'],
  ['audio_fallback_link', 'https://drive.google.com/file/d/17w1Pw25aGLXu_cR9mRBZgIOnCG2qNAEm/view', 'integrated-reader'],
];

const allUrls = [...new Set([...sourceText.values()].flatMap((text) =>
  [...text.matchAll(/(['"`])(https?:\/\/.*?)\1/g)].map((match) => match[2]),
))]
  .filter((url) => !url.includes('${AUDIOBOOK_DRIVE_ID}'));
const externalRows = allUrls.map((url) => {
  const runtime = runtimeExternal.find(([, candidate]) => candidate === url);
  return {
    url,
    category: runtime?.[0] || 'user_initiated_link_or_source',
    runtimeDependency: Boolean(runtime),
    context: runtime?.[2] || '',
    sourceReferences: [...sourceText].filter(([, text]) => text.includes(url)).map(([source]) => source),
  };
});
if (!externalRows.some((row) => row.url.includes('drive.google.com/file/d/17w1'))) {
  externalRows.push({
    url: 'https://drive.google.com/file/d/17w1Pw25aGLXu_cR9mRBZgIOnCG2qNAEm/view',
    category: 'audio_fallback_link',
    runtimeDependency: true,
    context: 'integrated-reader',
    sourceReferences: ['src/App.jsx', 'src/IntegratedReader.jsx'],
  });
}
const externalHeaders = ['url', 'category', 'runtimeDependency', 'context', 'sourceReferences'];
fs.writeFileSync(path.join(output, 'external-resources.csv'), `${[
  externalHeaders.join(','),
  ...externalRows.sort((a, b) => a.url.localeCompare(b.url)).map((row) => externalHeaders.map((key) => csvCell(key === 'sourceReferences' ? row[key].join(';') : row[key])).join(',')),
].join('\n')}\n`);

const mediaQueries = ['src/styles.css', 'src/reader.css'].flatMap((source) =>
  [...sourceText.get(source).matchAll(/@media\s*([^\{]+)\{/g)].map((match) => ({ source, query: match[1].trim() })),
);

fs.writeFileSync(path.join(output, 'technical-manifest.json'), `${JSON.stringify({
  backupId: 'FN-PREMIG-20260823-SITEV57-7882327',
  sourceCommit: '7882327b5bf619ba81335d136e9eddc96cf894c9',
  sourceTree: 'dbb99c32a4b0bb8aaf46a959ef46cbb2ab9807e2',
  architecture: {
    original: 'React 19 + Vinext + Vite + Cloudflare adapter for ChatGPT Sites',
    portable: 'React 19 SPA + Vite static build',
    backend: false,
    database: false,
    serviceWorker: false,
    analytics: false,
    authentication: false,
  },
  storage: [
    { key: 'fresco-noble-reader-notes-v1', purpose: 'reader notes', persisted: true },
    { key: 'fresco-noble-reader-state-v1', purpose: 'audio and reader state', persisted: true },
    { key: 'fresco-noble-genealogia', purpose: 'genealogical draft', persisted: true },
  ],
  counts: {
    localAssets: assets.length,
    runtimeAssets: assets.filter((asset) => asset.status === 'runtime').length,
    declaredNotRenderedAssets: assets.filter((asset) => asset.status === 'declared_not_rendered').length,
    unreferencedAssets: assets.filter((asset) => asset.status === 'unreferenced').length,
    timelineItems: timeline.length,
    players: players.length,
    readingUnits: readingUnits.length,
  },
  mediaQueries,
  reconstructedFiles: [
    'portable-site/package.json',
    'portable-site/package-lock.json',
    'portable-site/vite.config.js',
    'portable-site/README.md',
    'portable-site/.gitignore',
    'data/reading-sync_reconstructed-from-site.srt',
  ],
  literalFiles: [
    'portable-site/index.html',
    'portable-site/src/**',
    'portable-site/public/assets/**',
    'portable-site/scripts/generate-reading-document-from-srt.mjs',
    'data/reading-sync_exact.json',
    'data/content-structure_exact.json',
  ],
  auditArtifacts: [
    'README.md',
    'documentation/**',
    'data/assets-inventory.csv',
    'data/external-resources.csv',
    'data/technical-manifest.json',
    'tools/generate-audit-data.mjs',
  ],
}, null, 2)}\n`);

console.log(JSON.stringify({ assets: assets.length, readingUnits: readingUnits.length, externalRows: externalRows.length }, null, 2));

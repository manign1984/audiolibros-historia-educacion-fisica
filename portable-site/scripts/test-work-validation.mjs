// Fallos deliberados en un checkout ficticio temporal. No toca fuentes ni notas reales.
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { within } from './lib/load-work-contracts.mjs';
import { digest, hashFiles, checkManifest, validateWorks, validateTimeline, parseSubtitles, validateReferences } from './lib/validate-work-contracts.mjs';

const root = await mkdtemp(resolve(tmpdir(), 'tec-work-validator-'));
try {
  const put = async (path, text) => { await mkdir(resolve(root, path, '..'), { recursive: true }); await writeFile(resolve(root, path), text); };
  for (const [path, text] of Object.entries({
    'public/assets/book.pdf': '%PDF-1.4\nfixture',
    'public/assets/text.txt': 'Texto ficticio de prueba.',
    'public/assets/a.part': 'ID3-a', 'public/assets/b.part': 'b-final',
    'src/config.js': 'export const trialConfig = {};', 'src/document.js': 'export const trialDocument = {};',
    'src/main.jsx': "import './Trial.jsx';",
    'src/Trial.jsx': 'import {trialConfig} from "./config.js"; import {trialDocument} from "./document.js"; /* IntegratedReader; <JourneyCredits workId="trial" /> */',
    'src/shared/creditsContent.jsx': 'export const creditsContent = { trial: { references: ["Referencia ficticia"] } };',
    'textos/trial/index.html': '<script type="module" src="/src/main.jsx"></script>',
    'textos/second/index.html': '<script type="module" src="/src/main.jsx"></script>',
  })) await put(path, text);
  const document = { title: 'Prueba', author: 'Autor ficticio', duration: 20, frontMatter: [{ id: 'title', text: 'Prueba', start: 0, end: 1 }], sections: [{ id: 'intro', title: 'Introducción', paragraphs: [{ id: 'p1', sentences: [{ id: 's1', text: 'Prueba.', start: 1, end: 4 }, { id: 's2', text: 'Otra prueba.', start: 4, end: 8 }] }] }] };
  const config = { workId: 'trial', audiobookParts: ['/assets/a.part', '/assets/b.part'], pdfUrl: '/assets/book.pdf', storage: { notesKey: 'trial-notes-v1', stateKey: 'trial-state-v1' }, export: { jsonFileName: 'trial.json', textFileName: 'trial.txt', shareTitle: 'Prueba' }, sync: { status: 'ready' } };
  const work = { id: 'trial', config: { module: 'src/config.js', export: 'trialConfig' }, document: { module: 'src/document.js', export: 'trialDocument' }, page: 'src/Trial.jsx', main: 'src/main.jsx', creditsKey: 'trial', storage: config.storage, sync: { unit: 'sentence', status: 'ready', review: 'Datos ficticios.' }, documentSha256: digest(document), audioDuration: 20, audioSha256: await hashFiles(['a', 'b'].map(part => resolve(root, `public/assets/${part}.part`))), materials: [] };
  for (const [path, kind] of [['public/assets/book.pdf', 'pdf'], ['public/assets/text.txt', 'text'], ['public/assets/a.part', 'audio'], ['public/assets/b.part', 'audio']]) {
    const bytes = await readFile(resolve(root, path)); work.materials.push({ path, kind, bytes: bytes.length, sha256: await hashFiles([resolve(root, path)]) });
  }
  work.storage = { ...config.storage };
  const manifest = { schemaVersion: 1, works: [work] };
  const catalog = [{ id: 'trial', status: 'available', path: 'textos/trial/', title: 'Prueba', shortTitle: 'Prueba', author: 'Autor ficticio', sortAuthor: 'Ficticio', programGroup: 'testing', reference: 'Referencia ficticia', duration: 20, stateKey: config.storage.stateKey }];
  const input = { root, manifest, contracts: [{ id: 'trial', config, document }], catalog, programGroups: [{ id: 'testing' }] };
  const clone = () => structuredClone(input);
  const expectFailure = async (mutate, code) => { const value = clone(); await mutate(value); const report = await validateWorks(value); assert.ok(report.errors.some(error => error.code === code), `${code}: ${JSON.stringify(report.errors)}`); };
  assert.deepEqual((await validateWorks(input)).errors, []);
  {
    const remoteArtwork = clone();
    remoteArtwork.catalog[0].artwork = 'https://pbs.twimg.com/media/F0hQOq4X0AALbUU.jpg';
    assert.deepEqual((await validateWorks(remoteArtwork)).errors, [],
      'Una fotografía documental por HTTPS no debe tratarse como archivo local.');
  }
  await expectFailure(value => { value.catalog[0].artwork = 'http://example.org/photo.jpg'; }, 'external-image');
  await expectFailure(value => { value.catalog[0].artwork = 'assets/does-not-exist.jpg'; }, 'missing-file');
  await expectFailure(value => { value.contracts[0].config.storage.notesKey = 'changed'; }, 'storage-contract');
  await expectFailure(value => { value.catalog[0].stateKey = 'another-key'; }, 'catalog-storage');
  await expectFailure(value => { value.reservedStorageKeys = [value.contracts[0].config.storage.notesKey]; }, 'storage-collision');
  await expectFailure(value => { delete value.catalog[0].reference; }, 'bibliography');
  await expectFailure(value => { value.catalog[0].duration = 99; }, 'duration');
  await expectFailure(value => { value.contracts[0].config.audiobookParts.reverse(); }, 'audio-sequence');
  await expectFailure(value => { value.manifest.works[0].materials[0].sha256 = '0'.repeat(64); }, 'material-integrity');
  await expectFailure(value => { value.contracts[0].document.sections[0].paragraphs[0].sentences[0].text = 'Alterado'; }, 'document-integrity');
  await expectFailure(value => { value.contracts[0].config.sync.status = 'pending'; }, 'sync-mode');
  await expectFailure(value => {
    const second = structuredClone(value.manifest.works[0]); second.id = 'second'; value.manifest.works.push(second);
    value.catalog.push({ ...value.catalog[0], id: 'second', path: 'textos/second/' });
    value.contracts.push({ ...structuredClone(value.contracts[0]), id: 'second', config: { ...value.contracts[0].config, workId: 'second' } });
  }, 'storage-collision');
  await expectFailure(value => { value.manifest.works[0].sync.unit = 'paragraph'; value.contracts[0].config.sync.unit = 'paragraph'; value.contracts[0].config.sync.paragraphTimings = []; }, 'paragraph-coverage');
  const originalAudio = await readFile(resolve(root, 'public/assets/a.part'));
  await put('public/assets/a.part', 'corrupto'); await expectFailure(() => {}, 'material-integrity');
  await writeFile(resolve(root, 'public/assets/a.part'), originalAudio);
  await put('public/assets/book.pdf', '<html>Error de descarga</html>');
  await expectFailure(async value => {
    const material = value.manifest.works[0].materials[0];
    material.bytes = (await readFile(resolve(root, material.path))).length;
    material.sha256 = await hashFiles([resolve(root, material.path)]);
  }, 'pdf-signature');
  await rm(resolve(root, 'public/assets/book.pdf')); await expectFailure(() => {}, 'missing-file');
  assert.throws(() => within(root, '../outside'), /fuera/);
  assert.throws(() => checkManifest({ ...manifest, works: [work, work] }), /repetido/);
  const timeline = [{ id: 'a', start: 0, end: 3 }, { id: 'b', start: 4, end: 8 }];
  assert.equal(validateTimeline(timeline, 10).gaps[0].seconds, 1);
  for (const broken of [[{ id: 'x', start: -1, end: 2 }], [{ id: 'x', start: 2, end: 1 }], [{ id: 'x', start: 0, end: 11 }], [{ id: 'x', start: 0 }], [{ id: 'x', start: NaN, end: 2 }], [{ id: 'x', audioUnavailable: true, start: 0, end: 2 }], [timeline[0], { id: 'b', start: 2, end: 4 }], [timeline[0], { id: 'a', start: 4, end: 5 }], [{ id: 'untimed' }]]) assert.ok(validateTimeline(broken, 10).errors.length);
  assert.equal(validateTimeline([{ id: 'omitted', audioUnavailable: true }], 10).errors.length, 0);
  assert.equal(validateTimeline([{ id: 'pending' }], 10, { allowUntimed: true }).errors.length, 0);
  assert.equal(parseSubtitles('WEBVTT\n\n00:00:00.000 --> 00:00:01.500\nPrueba')[0].end, 1.5);
  assert.equal(parseSubtitles('1\n00:00:00,000 --> 00:00:01,500\nPrueba')[0].end, 1.5);
  assert.throws(() => parseSubtitles('00:99:00.000 --> 00:00:02.000'), /inválido/);
  assert.throws(() => parseSubtitles('sin tiempos'), /sin intervalos/);
  await put('dist/index.html', '<script src="/site/assets/app.js"></script>');
  await put('dist/assets/app.js', 'import "./chunk.js"; const x="/site/assets/missing.png";');
  await put('dist/assets/chunk.js', 'export const value=1;');
  const refs = await validateReferences({ directory: resolve(root, 'dist'), base: '/site/' });
  assert.equal(refs.errors.length, 1); assert.equal(refs.errors[0].message, '/site/assets/missing.png');
  assert.ok((await validateReferences({ directory: resolve(root, 'dist'), base: '/wrong/' })).errors.some(error => error.code === 'asset-base'));
  console.log('Validador: casos de corrupción, recurso ausente, audio desordenado, claves cruzadas, referencia faltante, cambios de texto/tiempos, cobertura por párrafos, subtítulos inválidos y referencias de build rotas detectados. No se modificaron materiales reales.');
} finally { await rm(root, { recursive: true, force: true }); }

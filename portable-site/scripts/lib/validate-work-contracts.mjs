import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readFile, stat, readdir } from 'node:fs/promises';
import { resolve, dirname, relative, extname } from 'node:path';
import { within } from './load-work-contracts.mjs';

export const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const present = value => typeof value === 'string' && value.trim().length > 0;
const finite = value => Number.isFinite(value) && value >= 0;
const issues = () => ({ errors: [], warnings: [], works: [] });
const add = (report, level, code, location, message) => report[level].push({ code, location, message });

export async function hashFiles(paths) {
  const hash = createHash('sha256');
  for (const path of paths) for await (const chunk of createReadStream(path)) hash.update(chunk);
  return hash.digest('hex');
}

export function readingUnits(document, config) {
  if (config.sync.unit === 'paragraph') return config.sync.paragraphTimings;
  return [...(document.frontMatter || []), ...document.sections.flatMap(section => [
    ...(section.headingSentence ? [section.headingSentence] : []),
    ...section.paragraphs.flatMap(paragraph => paragraph.sentences),
  ])];
}

export function validateTimeline(units, duration, { allowUntimed = false } = {}) {
  const report = { errors: [], gaps: [], untimed: [] };
  const ids = new Set();
  let previous;
  for (const unit of units) {
    if (!present(unit.id) || ids.has(unit.id)) report.errors.push(`ID temporal vacío o repetido: ${unit.id}`);
    ids.add(unit.id);
    const hasStart = unit.start !== undefined && unit.start !== null;
    const hasEnd = unit.end !== undefined && unit.end !== null;
    if (!hasStart && !hasEnd) {
      report.untimed.push(unit.id);
      if (!unit.audioUnavailable && !allowUntimed) report.errors.push(`${unit.id}: sin tiempos ni ausencia de audio declarada`);
      continue;
    }
    if (unit.audioUnavailable) report.errors.push(`${unit.id}: pasaje sin audio con tiempos asignados`);
    if (!finite(unit.start) || !finite(unit.end) || unit.end <= unit.start || unit.end > duration + 0.005) {
      report.errors.push(`${unit.id}: intervalo inválido o fuera de la duración real`);
      continue;
    }
    if (previous) {
      const gap = unit.start - previous.end;
      if (gap < -0.005) report.errors.push(`${unit.id}: solapamiento o retroceso respecto de ${previous.id}`);
      if (gap > 0.005) report.gaps.push({ from: previous.id, to: unit.id, seconds: +gap.toFixed(6) });
    }
    previous = unit;
  }
  return report;
}

export function parseSubtitles(text) {
  const units = [];
  for (const line of text.replace(/\r/g, '').split('\n').filter(value => value.includes('-->'))) {
    const match = line.match(/^(\d{2,}):(\d{2}):(\d{2})[.,](\d{3})\s+-->\s+(\d{2,}):(\d{2}):(\d{2})[.,](\d{3})(?:\s.*)?$/);
    if (!match || [match[2], match[3], match[6], match[7]].some(value => Number(value) > 59)) throw new Error(`Tiempo de subtítulo inválido: ${line}`);
    const seconds = offset => Number(match[offset]) * 3600 + Number(match[offset + 1]) * 60 + Number(match[offset + 2]) + Number(match[offset + 3]) / 1000;
    units.push({ id: `cue-${units.length + 1}`, start: seconds(1), end: seconds(5) });
  }
  if (!units.length) throw new Error('Archivo de subtítulos sin intervalos.');
  return units;
}

export function checkManifest(manifest) {
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.works) || !manifest.works.length) throw new Error('Se requiere schemaVersion: 1 y works no vacío.');
  const ids = new Set();
  for (const work of manifest.works) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(work.id) || ids.has(work.id)) throw new Error(`ID de obra inválido o repetido: ${work.id}`);
    ids.add(work.id);
    for (const descriptor of [work.config, work.document]) if (!descriptor || !present(descriptor.module) || !/^(?:default|[A-Za-z_$][\w$]*)$/.test(descriptor.export)) throw new Error(`${work.id}: descriptor de módulo/export inválido`);
    for (const field of ['page', 'main', 'creditsKey', 'documentSha256']) if (!present(work[field])) throw new Error(`${work.id}: falta ${field}`);
    if (!/^[a-f0-9]{64}$/.test(work.documentSha256) || !/^[a-f0-9]{64}$/.test(work.audioSha256)) throw new Error(`${work.id}: hash de documento/audio inválido`);
    if (!finite(work.audioDuration) || work.audioDuration === 0) throw new Error(`${work.id}: duración real requerida`);
    if (!['sentence', 'paragraph'].includes(work.sync?.unit) || !['ready', 'pending', 'paragraph-preview'].includes(work.sync?.status) || !present(work.sync?.review)) throw new Error(`${work.id}: modalidad/estado/revisión requeridos`);
    if (work.sync.status === 'paragraph-preview' && work.sync.unit !== 'paragraph') throw new Error(`${work.id}: paragraph-preview requiere párrafos`);
    const untimed = work.sync.untimedParagraphIds;
    if (untimed !== undefined && (work.sync.unit !== 'paragraph' || !Array.isArray(untimed) || !untimed.every(present) || new Set(untimed).size !== untimed.length)) {
      throw new Error(`${work.id}: IDs inválidos o repetidos para párrafos sin narración`);
    }
    if (!present(work.storage?.notesKey) || !present(work.storage?.stateKey)) throw new Error(`${work.id}: claves de guardado requeridas`);
    if (!Array.isArray(work.materials) || !work.materials.length) throw new Error(`${work.id}: materiales requeridos`);
    const paths = new Set();
    for (const item of work.materials) {
      if (!present(item.path) || paths.has(item.path) || !['pdf', 'audio', 'text', 'subtitles', 'alignment'].includes(item.kind) || !Number.isInteger(item.bytes) || item.bytes < 1 || !/^[a-f0-9]{64}$/.test(item.sha256)) throw new Error(`${work.id}: material inválido/repetido: ${item.path}`);
      paths.add(item.path);
    }
    const remoteAudio = present(work.externalAudioUrl) && /^https:\/\//.test(work.externalAudioUrl);
    if (!work.materials.some(item => item.kind === 'text') || (!work.materials.some(item => item.kind === 'audio') && !remoteAudio)) throw new Error(`${work.id}: falta texto o audio real/localizado`);
  }
  return manifest;
}

export async function validateWorks({ root, manifest, contracts, catalog, programGroups, reservedStorageKeys = [] }) {
  checkManifest(manifest);
  const report = issues();
  const error = (code, location, message) => add(report, 'errors', code, location, message);
  const warning = (code, location, message) => add(report, 'warnings', code, location, message);
  const check = (condition, code, location, message) => { if (!condition) error(code, location, message); };
  const keys = new Map(reservedStorageKeys.map(key => [key, 'biblioteca'])), ids = new Set(), routes = new Set();
  const live = new Set(catalog.filter(entry => ['available', 'review'].includes(entry.status)).map(entry => entry.id));
  for (const id of live) check(manifest.works.some(work => work.id === id), 'unregistered-work', id, 'Recorrido accesible sin registro de validación.');
  const exists = async (path, location) => {
    try { const info = await stat(within(root, path)); if (!info.isFile() || info.size === 0) throw new Error('No es un archivo no vacío'); return true; }
    catch (cause) { error('missing-file', location, `${path}: ${cause.code || cause.message}`); return false; }
  };
  for (const entry of catalog) {
    check(!ids.has(entry.id), 'catalog-id', entry.id, 'ID repetido en catálogo.'); ids.add(entry.id);
    check(/^textos\/[a-z0-9-]+\/$/.test(entry.path), 'catalog-route', entry.id, 'Ruta no canónica.');
    check(!routes.has(entry.path), 'catalog-route', entry.id, 'Ruta repetida.'); routes.add(entry.path);
    for (const field of ['id', 'author', 'title', 'shortTitle', 'sortAuthor']) check(present(entry[field]), 'catalog-metadata', entry.id, `Falta ${field}.`);
    check(['available', 'review', 'text', 'preparation'].includes(entry.status), 'catalog-status', entry.id, 'Estado desconocido.');
    check(programGroups.some(group => group.id === entry.programGroup), 'catalog-program-group', entry.id, 'Unidad o categoría complementaria inexistente.');
    check(present(entry.reference) || ['beforeItalic', 'italic', 'afterItalic'].every(field => present(entry.citation?.[field])), 'bibliography', entry.id, 'Falta referencia bibliográfica.');
    await exists(`${entry.path}index.html`, entry.id);
    for (const resource of [entry.artwork, entry.thumbnail?.src].filter(Boolean)) {
      if (/^https?:\/\//i.test(resource)) {
        const imageUrl = new URL(resource);
        check(imageUrl.protocol === 'https:' && Boolean(imageUrl.hostname), 'external-image', entry.id,
          'Las imágenes remotas deben utilizar una URL HTTPS válida.');
      } else await exists(`public/${resource.replace(/^\//, '')}`, entry.id);
    }
    if (entry.status === 'preparation') check(!entry.stateKey && !entry.duration, 'preparation-state', entry.id, 'Ficha futura con progreso o duración de lectura.');
  }
  for (const work of manifest.works) {
    const contract = contracts.find(item => item.id === work.id);
    check(live.has(work.id), 'orphan-work', work.id, 'Registro sin recorrido disponible/review en catálogo.');
    if (!contract?.config || !contract?.document) { error('missing-contract', work.id, 'Módulos/export no producen configuración y documento.'); continue; }
    const { config, document } = contract;
    check(config.workId === work.id, 'config-id', work.id, 'workId no coincide con el registro.');
    const entry = catalog.find(item => item.id === work.id);
    if (!entry) continue;
    check(present(document.title) && present(document.author) && Array.isArray(document.sections) && document.sections.length > 0, 'document-structure', work.id, 'Título, autor y apartados no vacíos requeridos.');
    check(digest(document) === work.documentSha256, 'document-integrity', work.id, 'Documento/IDs/tiempos distintos de la línea base revisada. No regenerar el hash para ocultar una diferencia.');
    const delta = work.audioDuration - document.duration;
    const recordedDelta = work.durationDifference;
    const documentedDifference = recordedDelta && Number.isFinite(recordedDelta.seconds) && Math.abs(delta - recordedDelta.seconds) <= 0.005 && present(recordedDelta.reason);
    check((Math.abs(delta) <= 0.1 || documentedDifference) && Math.abs((entry?.duration ?? NaN) - document.duration) <= 0.005, 'duration', work.id, 'Duración discrepante entre audio registrado, documento y catálogo.');
    if (Math.abs(delta) > 0.1 && documentedDifference) warning('duration-difference', work.id, `${delta.toFixed(6)} s: ${recordedDelta.reason}`);
    check((config.sync.unit || 'sentence') === work.sync.unit && config.sync.status === work.sync.status, 'sync-mode', work.id, 'Modalidad/estado distintos de los registrados.');
    for (const field of ['notesKey', 'stateKey']) {
      const key = config.storage?.[field];
      check(present(key) && key === work.storage[field], 'storage-contract', work.id, `${field}: clave ausente o cambiada.`);
      check(!keys.has(key), 'storage-collision', work.id, `${field}: colisión con ${keys.get(key)}.`); keys.set(key, work.id);
    }
    check(entry?.stateKey === config.storage.stateKey, 'catalog-storage', work.id, 'El catálogo recupera el progreso con otra clave.');
    for (const field of ['jsonFileName', 'textFileName', 'shareTitle']) check(present(config.export?.[field]), 'export-config', work.id, `Falta export.${field}.`);
    const materialPaths = new Set(work.materials.map(item => item.path));
    for (const material of work.materials) {
      if (!await exists(material.path, work.id)) continue;
      const path = within(root, material.path), info = await stat(path);
      check(info.size === material.bytes && await hashFiles([path]) === material.sha256, 'material-integrity', material.path, 'Tamaño o SHA-256 no coincide.');
      if (material.kind === 'pdf') check((await readFile(path)).subarray(0, 1024).includes(Buffer.from('%PDF-')), 'pdf-signature', material.path, 'No hay cabecera PDF.');
      if (material.kind === 'subtitles') {
        try {
          // Algunas marcas de origen terminan después del contenedor MP3.
          // La excepción exige constancia y correspondencia con la fuente;
          // preserva los cues sin modificarlos ni extender la pista de audio.
          const subtitleEnd = Number.isFinite(work.subtitleTimelineEnd) ? work.subtitleTimelineEnd : work.audioDuration;
          if (subtitleEnd > work.audioDuration + 0.005) {
            check(present(work.subtitleTimelineReason) &&
              Math.abs(subtitleEnd - (document.source?.finalCueEnd ?? 0)) <= 0.005,
              'subtitle-duration-documentation', work.id,
              'Diferencia de duración del SRT no documentada o sin concordancia con el original.');
            warning('subtitle-duration-difference', work.id,
              (subtitleEnd - work.audioDuration).toFixed(3) + ' s: ' + (work.subtitleTimelineReason || 'Diferencia no documentada.'));
          }
          for (const message of validateTimeline(parseSubtitles(await readFile(path, 'utf8')), subtitleEnd).errors) {
            error('subtitle-timeline', material.path, message);
          }
        } catch (cause) { error('subtitle-format', material.path, cause.message); }
      }
    }
    const audioUrls = config.audiobookParts || (config.audiobookUrl ? [config.audiobookUrl] : []);
    const usesRemoteAudio = present(work.externalAudioUrl);
    if (usesRemoteAudio) {
      check(config.audiobookUrl === work.externalAudioUrl && config.audioMode === 'direct' && !config.audiobookParts,
        'external-audio-config', work.id, 'El audio remoto requiere URL explícita y reproducción directa.');
      warning('external-audio', work.id,
        'Audio institucional alojado fuera de este repositorio. No se comprueban disponibilidad remota, permisos de acceso ni correspondencia acústica.');
    } else {
      check(audioUrls.length > 0 && !(config.audiobookParts && config.audiobookUrl), 'audio-config', work.id, 'Declarar un MP3 o una secuencia de partes.');
      const audioPaths = audioUrls.map(url => `public${url}`);
      for (const [index, path] of audioPaths.entries()) check(/^\/assets\/[^.][^\s]*$/.test(audioUrls[index]) && materialPaths.has(path) && work.materials.some(item => item.path === path && item.kind === 'audio'), 'unregistered-resource', work.id, `Audio local sin registro: ${path}`);
      if (audioPaths.length && (await Promise.all(audioPaths.map(async path => { try { await stat(within(root, path)); return true; } catch { return false; } }))).every(Boolean)) {
        check(await hashFiles(audioPaths.map(path => within(root, path))) === work.audioSha256, 'audio-sequence', work.id, 'El audio concatenado o el orden de sus partes cambió.');
      }
    }
    if (config.pdfUrl) check(work.materials.some(item => item.path === `public${config.pdfUrl}` && item.kind === 'pdf'), 'unregistered-resource', work.id, 'PDF de configuración no registrado como PDF.');
    else warning('pdf-unavailable', work.id, 'No hay pdfUrl en este lector; se conserva el texto registrado. No se inventa un PDF.');
    for (const url of [config.readingEntry?.textUrl, config.readingEntry?.srtUrl].filter(Boolean)) check(materialPaths.has(`public${url}`), 'unregistered-resource', work.id, `${url} no registrado.`);
    for (const pair of work.equalTextFiles || []) check((await readFile(within(root, pair[0]), 'utf8')) === (await readFile(within(root, pair[1]), 'utf8')), 'text-copy', work.id, `Copias de texto diferentes: ${pair.join(' / ')}.`);
    const allIds = new Set();
    const unique = id => { check(present(id) && !allIds.has(id), 'document-id', work.id, `ID vacío/repetido: ${id}`); allIds.add(id); };
    for (const front of document.frontMatter || []) { unique(front.id); check(present(front.text), 'empty-text', work.id, front.id); }
    for (const section of document.sections || []) {
      unique(section.id); check(present(section.title), 'empty-section', work.id, section.id);
      if (section.headingSentence) unique(section.headingSentence.id);
      for (const paragraph of section.paragraphs) { unique(paragraph.id); check(paragraph.sentences.length > 0, 'empty-paragraph', work.id, paragraph.id); for (const sentence of paragraph.sentences) { unique(sentence.id); check(present(sentence.text), 'empty-text', work.id, sentence.id); } }
    }
    if (work.sync.unit === 'paragraph') {
      const paragraphIds = document.sections.flatMap(section => section.paragraphs.map(item => item.id));
      const untimed = work.sync.untimedParagraphIds || [];
      check(untimed.every(id => paragraphIds.includes(id)),
        'paragraph-coverage', work.id, 'Los párrafos sin narración deben existir en el documento.');
      const expectedTimedIds = paragraphIds.filter(id => !untimed.includes(id));
      check(JSON.stringify(config.sync.paragraphTimings.map(item => item.id)) === JSON.stringify(expectedTimedIds),
        'paragraph-coverage', work.id, 'Los tiempos deben cubrir cada párrafo narrado una vez y en orden.');
    }
    const units = readingUnits(document, config);
    const timeline = validateTimeline(units, work.audioDuration, { allowUntimed: config.sync.status === 'pending' });
    for (const message of timeline.errors) error('timeline', work.id, message);
    const longGaps = timeline.gaps.filter(gap => gap.seconds > 5);
    if (longGaps.length) warning('timeline-gaps', work.id, `${longGaps.length} hueco(s) mayor(es) a 5 s: revisar voz/encabezados, sin rellenar tiempos automáticamente.`);
    if (work.sync.status !== 'ready' || /pendiente/i.test(work.sync.review)) warning('sync-review', work.id, work.sync.review);
    for (const file of [work.page, work.main, work.config.module, work.document.module]) await exists(file, work.id);
    const html = await readFile(within(root, `${entry.path}index.html`), 'utf8');
    check(html.includes(`/${work.main}`), 'entrypoint', work.id, 'El HTML no carga el main registrado.');
    const page = await readFile(within(root, work.page), 'utf8');
    const imports = [...page.matchAll(/from\s+['"]([^'"]+)['"]/g)].map(match => resolve(dirname(within(root, work.page)), match[1]));
    for (const descriptor of [work.config, work.document]) check(imports.includes(within(root, descriptor.module)), 'page-binding', work.id, `La página no importa ${descriptor.module}.`);
    check(page.includes('IntegratedReader') && page.includes(`workId="${work.creditsKey}"`), 'shared-components', work.id, 'Falta lector compartido o clave de créditos registrada.');
    const credits = await readFile(resolve(root, 'src/shared/creditsContent.jsx'), 'utf8');
    check(new RegExp(`\\b${work.creditsKey}:\\s*\\{\\s*references:\\s*\\[`).test(credits), 'credits-reference', work.id, 'No existe la entrada bibliográfica en los créditos compartidos.');
    report.works.push({ id: work.id, duration: document.duration, unit: work.sync.unit, status: config.sync.status, sections: document.sections.length, paragraphs: document.sections.flatMap(section => section.paragraphs).length, units: units.length, timed: units.length - timeline.untimed.length, untimed: timeline.untimed, gaps: timeline.gaps, materials: work.materials.length });
  }
  return report;
}

export async function listFiles(directory) {
  const result = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, item.name);
    if (item.isDirectory()) result.push(...await listFiles(path)); else if (item.isFile()) result.push(path);
  }
  return result;
}

// Referencias locales literales: assets en JS/JSX y CSS; imports del bundle y
// src/href/poster en HTML. No consulta servicios externos ni promete resolver
// URLs construidas dinámicamente o anclas de una aplicación React sin renderizar.
export function localReferences(text, extension) {
  const refs = new Set();
  const collect = regex => { for (const match of text.matchAll(regex)) refs.add(match[1]); };
  collect(/["'`]([^"'`\s]*\bassets\/[A-Za-z0-9_./%?#=&+-]+)["'`]/g);
  if (extension === '.html') collect(/(?:src|href|poster)\s*=\s*["']([^"']+)["']/g);
  if (extension === '.css') collect(/url\(\s*["']?([^\s)"']+)["']?\s*\)/g);
  if (['.js', '.mjs'].includes(extension)) collect(/\b(?:from|import)\s*(?:\(\s*)?["']([^"']+)["']/g);
  return [...refs].filter(ref => !/^(?:[a-z][\w+.-]*:|\/\/|#)/i.test(ref));
}

export async function validateReferences({ directory, base = '/', source = false }) {
  const report = { errors: [], checked: 0 };
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  for (const path of await listFiles(directory)) {
    if (!/\.(?:html|css|js|mjs|jsx)$/.test(path)) continue;
    for (const ref of localReferences(await readFile(path, 'utf8'), extname(path))) {
      let target;
      const clean = decodeURIComponent(ref.split(/[?#]/)[0]);
      if (source) {
        if (!/^\/?assets\//.test(clean)) continue;
        target = resolve(directory, '../public', clean.replace(/^\//, ''));
      } else if (clean.startsWith('/')) {
        if (!clean.startsWith(normalizedBase)) { report.errors.push({ code: 'asset-base', location: relative(directory, path), message: ref }); continue; }
        target = resolve(directory, clean.slice(normalizedBase.length));
      // El catálogo conserva assets/... como datos y resolveSitePath los une
      // al base del sitio; no son imports relativos al directorio del bundle.
      } else if (extname(path) === '.js' && clean.startsWith('assets/')) {
        target = resolve(directory, clean);
      } else target = resolve(dirname(path), clean);
      if (relative(source ? resolve(directory, '../public') : directory, target).startsWith('..')) { report.errors.push({ code: 'asset-path', location: path, message: ref }); continue; }
      if (ref.endsWith('/')) target = resolve(target, 'index.html');
      try { if (!(await stat(target)).isFile()) throw new Error('No es archivo'); report.checked += 1; }
      catch { report.errors.push({ code: 'broken-reference', location: relative(directory, path), message: ref }); }
    }
  }
  return report;
}

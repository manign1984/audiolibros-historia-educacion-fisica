// Modelo singular de Almada. La edición académica, y no el SRT de locución, es la fuente de lectura.
// Los tiempos del SRT solo sirven para destacar aproximadamente los párrafos narrados.
const TITLE = 'Los privilegiados en la Nueva Argentina. La cultura física y el deporte en la política del peronismo';
const HEADINGS = new Map([
  ['Resumen', 'resumen'],
  ['Introducción', 'introduccion'],
  ['La política pública peronista sobre cultura física', 'politica-publica'],
  ['El rol de la Fundación Eva Perón', 'fundacion-eva-peron'],
  ['Consideraciones finales', 'consideraciones-finales'],
  ['Bibliografía', 'bibliografia'],
]);
const MAIN_SECTIONS = new Set(['introduccion', 'politica-publica', 'fundacion-eva-peron', 'consideraciones-finales']);

function srtSeconds(value) {
  const m = String(value).match(/^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/);
  if (!m) throw new Error('Marca temporal SRT inválida');
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) + Number(m[4]) / 1000;
}

export function parseAlmadaSrt(input) {
  const normalized = String(input || '').replace(/\r/g, '').trim();
  const cues = normalized.split(/\n\s*\n/).map(block => {
    const lines = block.split('\n');
    const time = lines.find(line => /-->/.test(line));
    const match = time?.match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);
    if (!match) return null;
    const text = lines.slice(lines.indexOf(time) + 1).join(' ')
      .replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return { start: srtSeconds(match[1]), end: srtSeconds(match[2]), text };
  }).filter(cue => cue && cue.text);
  if (!cues.length) throw new Error('Archivo de marcas SRT vacío');
  return cues;
}

function tokenize(input) {
  return String(input || '').normalize('NFD').replace(/\p{M}/gu, '')
    .toLowerCase().replace(/<[^>]*>/g, ' ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ').trim().split(/\s+/).filter(Boolean);
}
function cleanBlock(value) {
  return String(value || '').replace(/\s*\n\s*/g, ' ').replace(/[ \t]{2,}/g, ' ').trim();
}
function splitPages(raw) {
  return String(raw || '').replace(/\r/g, '').split('\f')
    .map(page => page.split(/\n\s*\n/).map(cleanBlock).filter(Boolean));
}
function isNote(block) {
  const m = block.match(/^(\d{1,2})\s+([\s\S]{20,})$/);
  return m && Number(m[1]) >= 1 && Number(m[1]) <= 21 ? m : null;
}

export function buildAlmadaReadingDocument(raw, subtitleFile) {
  const cues = parseAlmadaSrt(subtitleFile);
  const pages = splitPages(raw);
  if (pages.length !== 16) throw new Error('La edición académica de Almada debe conservar sus 16 páginas');
  const sections = [];
  const endnotes = [];
  const bibliography = [];
  const legacyPageMap = {};
  let section = null;
  let previousBlock = null;

  for (const [pageIndex, blocks] of pages.entries()) {
    for (const block of blocks) {
      const note = isNote(block);
      if (note) {
        endnotes.push({ number: Number(note[1]), page: String(pageIndex + 1), text: note[2].trim() });
        continue;
      }
      const headingId = HEADINGS.get(block);
      if (headingId) {
        if (headingId === 'bibliografia') {
          section = { id: headingId, title: block, paragraphs: [] };
        } else {
          section = { id: headingId, title: block, shortTitle: block, paragraphs: [] };
          sections.push(section);
        }
        previousBlock = null;
        continue;
      }
      // Los cuatro elementos de portada preceden al Resumen y se representan en frontMatter.
      if (!section) continue;
      if (section.id === 'bibliografia') {
        bibliography.push(block);
        continue;
      }
      // Las páginas impresas pueden cortar un párrafo sin punto final.
      // La continuidad se une únicamente si la nueva página empieza dentro de la misma oración.
      const continuation = previousBlock && previousBlock.section === section && previousBlock.page < pageIndex
        && !/[.!?…»”:]$/.test(previousBlock.text)
        && /^[\p{Ll}\d]/u.test(block);
      if (continuation) {
        const p = previousBlock.paragraph;
        p.sentences[0].text += ' ' + block;
        previousBlock.text += ' ' + block;
        if (!(pageIndex in legacyPageMap)) legacyPageMap[pageIndex] = p.id;
        continue;
      }
      const paraId = 'almada-' + section.id + '-p' + String(section.paragraphs.length + 1).padStart(2, '0');
      const paragraph = {
        id: paraId,
        kind: 'body',
        sentences: [{ id: paraId + '-s1', text: block }],
      };
      section.paragraphs.push(paragraph);
      if (!(pageIndex in legacyPageMap)) legacyPageMap[pageIndex] = paraId;
      previousBlock = { section, paragraph, text: block, page: pageIndex };
    }
  }
  // Páginas con bibliografía o notas sin texto narrativo conservan un anclaje anterior.
  let mostRecent = sections.flatMap(item => item.paragraphs)[0]?.id;
  for (let index = 0; index < pages.length; index++) {
    if (legacyPageMap[index]) mostRecent = legacyPageMap[index];
    else if (mostRecent) legacyPageMap[index] = mostRecent;
  }
  const uniqueNotes = new Map(endnotes.map(note => [note.number, note]));
  if (uniqueNotes.size !== 21) throw new Error('La edición académica de Almada exige 21 notas');
  const cueWords = cues.flatMap(cue => tokenize(cue.text).map(word => ({ word, start: cue.start })));
  const paragraphTimings = [];
  let cursor = 0;
  for (const item of sections) {
    if (!MAIN_SECTIONS.has(item.id)) continue; // Resumen y bibliografía no son narrados.
    for (const paragraph of item.paragraphs) {
      const plain = paragraph.sentences.map(s => s.text).join(' ')
        .replace(/\([^)]*(?:18\d{2}|19\d{2}|20\d{2}|p\.\s*\d+)[^)]*\)/g, ' ');
      const tokens = tokenize(plain);
      let found = -1;
      // Se buscan secuencias literales en orden, sin interpolar ni inventar tiempos.
      for (const span of [6, 5, 4, 3]) {
        if (found >= 0 || tokens.length < span) continue;
        for (let offset = 0; offset <= Math.min(26, tokens.length - span) && found < 0; offset++) {
          const target = tokens.slice(offset, offset + span);
          for (let j = cursor; j <= cueWords.length - span; j++) {
            if (cueWords[j].word !== target[0]) continue;
            if (target.every((word, k) => word === cueWords[j + k].word)) {
              found = j;
              break;
            }
          }
        }
      }
      if (found >= 0) {
        paragraphTimings.push({ id: paragraph.id, start: cueWords[found].start });
        cursor = found + 1;
      }
    }
  }
  for (let index = 0; index < paragraphTimings.length; index++) {
    const mark = paragraphTimings[index];
    const next = paragraphTimings[index + 1];
    mark.end = next ? Math.max(mark.start, next.start - 0.001) : cues.at(-1).end;
  }
  const document = {
    id: 'almada-privilegiados',
    title: TITLE,
    subtitle: 'La cultura física y el deporte en la política del peronismo',
    author: 'Cecilia Almada',
    duration: 1423.673469,
    versionLabel: 'Texto académico completo · HistELA 3, 2020',
    frontMatter: [
      { id: 'almada-title', role: 'title', text: TITLE },
      { id: 'almada-subtitle', role: 'subtitle', text: 'La cultura física y el deporte en la política del peronismo' },
      { id: 'almada-author', role: 'author', text: 'Cecilia Almada' },
    ],
    sections,
    endnotes: [...uniqueNotes.values()].sort((a, b) => a.number - b.number),
    bibliography,
    source: { kind: 'SRT de narración', cueCount: cues.length, finalCueEnd: cues.at(-1).end },
    sourceNote: 'Edición académica con resumen, referencias y 21 notas. El resaltado temporal es aproximado por párrafos; las notas y la bibliografía no forman parte de la narración.',
  };
  return { document, cues, paragraphTimings, legacyPageMap };
}

// Adaptador local para la lección 10: no contiene el texto académico ni archivos protegidos.
export const ARATA_SECTIONS = [
  ['darse-cuenta', 'Darse cuenta'],
  ['optimismo-capitalista', 'El optimismo capitalista llega a la educación'],
  ['destellos-desarrollistas', 'Destellos de larga duración en la coyuntura educativa desarrollista'],
  ['trama-cultural', 'Algunos indicios para pensar la trama cultural y educativa del período'],
  ['epifania-progreso', 'Maestros en la epifanía del progreso'],
  ['liberacion-progreso', 'La liberación como superación del progreso'],
  ['inclusion-pedagogia', 'Inclusión: sujetos y pedagogía'],
  ['imagenes-oscuridad', 'Imágenes de la oscuridad'],
];
const FOLIO = /^\s*(?:lOMoARcPSD\|\d+|18[2-9]|19\d|20[01])\s*$/;
const norm = (value) => String(value).replace(/-\s*\n\s*/g, '-').replace(/\s+/g, ' ').trim();
const tokens = (value) => String(value).normalize('NFD').replace(/\p{M}/gu, '')
  .toLowerCase().replace(/<[^>]+>/g, ' ').replace(/[^\p{L}\p{N}]+/gu, ' ')
  .trim().split(/\s+/).filter(Boolean);

function academicBlocks(raw) {
  const result = [];
  for (const page of String(raw).replace(/\r/g, '').split('\f')) {
    const clean = page.split('\n').filter((line) => !FOLIO.test(line)).join('\n');
    const parts = clean.split(/\n\s*\n/).map(norm).filter(Boolean);
    if (!parts.length) continue;
    const prev = result.at(-1), next = parts[0];
    if (prev && !/[.!?…:»”]$/.test(prev) &&
        !ARATA_SECTIONS.some(([, heading]) => heading === prev || heading === next) &&
        !/^(?:Lección 10|Bibliografía de la lección|Biografías disponibles|Fuentes disponibles)/.test(next)) {
      result[result.length - 1] += (prev.endsWith('-') ? '' : ' ') + parts.shift();
    }
    result.push(...parts);
  }
  return result;
}
function bibliographyFrom(raw) {
  const text = String(raw);
  const beginning = text.indexOf('Bibliografía de la lección');
  const ending = text.indexOf('Biografías disponibles en el multimedia', beginning);
  if (beginning < 0 || ending < 0) throw Error('No se encuentra la bibliografía original.');
  const authors = /^(?:Balduzzi|Bettolli|Braslavsky|Carli|Feldfeber|Ianni|López|Puiggrós|Rodríguez|Sarlo|Southwell|Weinberg),\s/u;
  const refs = [];
  for (const rawLine of text.slice(beginning, ending).replace(/\f/g, '\n').split('\n')) {
    if (!rawLine.trim() || FOLIO.test(rawLine) || /^Bibliografía de la lección/.test(rawLine.trim())) continue;
    const line = rawLine.trim();
    if (authors.test(line) && !/^Puiggrós, Adriana\s*\(dir\.?\)/i.test(line)) refs.push(line);
    else if (refs.length) refs[refs.length - 1] += (refs.at(-1).endsWith('-') ? '' : ' ') + line;
  }
  return refs;
}
function accessibleTable(text) {
  if (!text.startsWith('Año Establecimientos Alumnos Docentes Relación docente/alumno')) return null;
  const rows = [...text.matchAll(/\b(1955|1960|1965|1970|1975)\s+(\d{1,3}(?:\.\d{3})+)\s+(\d{1,3}(?:\.\d{3})+)\s+(\d{1,3}(?:\.\d{3})+)\s+(\d{1,2},\d)\b/g)];
  if (rows.length !== 5) throw Error('El cuadro académico no conserva sus cinco filas.');
  const content = ['Cuadro de expansión del sistema educativo.'];
  for (const row of rows) content.push(row[1] + ': ' + row[2] + ' establecimientos; ' + row[3] +
    ' alumnos; ' + row[4] + ' docentes; relación docente/alumno ' + row[5] + '.');
  const source = text.slice(rows.at(-1).index + rows.at(-1)[0].length).trim();
  if (source) content.push(source);
  return content.join(' ');
}
export function extractArataAcademicDocument(academicText) {
  const blocks = academicBlocks(academicText);
  if (!blocks.some((value) => value === 'Lección 10') ||
      !blocks.some((value) => value.startsWith('Auroras y tempestades: la educación entre golpes'))) {
    throw Error('La fuente no corresponde a la lección académica esperada.');
  }
  const sections = [{ id: 'apertura', title: 'Apertura', shortTitle: 'Apertura', paragraphs: [] }];
  let current = sections[0], mode = 'main';
  const supplements = [];
  for (const block of blocks) {
    if (block === 'Lección 10' || block.startsWith('Auroras y tempestades: la educación entre golpes')) continue;
    if (block === 'Bibliografía de la lección') { mode = 'bibliography'; continue; }
    if (block === 'Biografías disponibles en el multimedia') { mode = 'biographies'; continue; }
    if (block === 'Fuentes disponibles en el multimedia') { mode = 'sources'; continue; }
    if (mode === 'bibliography') continue;
    if (mode !== 'main') {
      supplements.push((mode === 'biographies' ? 'Biografías disponibles en el multimedia: ' :
        'Fuentes disponibles en el multimedia: ') + block);
      continue;
    }
    const heading = ARATA_SECTIONS.find(([, name]) => name === block);
    if (heading) {
      current = { id: heading[0], title: heading[1], shortTitle: heading[1], paragraphs: [] };
      sections.push(current);
      continue;
    }
    const id = 'arata-marino-' + current.id + '-p' + (current.paragraphs.length + 1);
    const table = accessibleTable(block);
    current.paragraphs.push({ id, kind: table ? 'table' : 'body',
      sentences: [{ id: id + '-s1', text: table || block }] });
  }
  const bibliography = bibliographyFrom(academicText);
  if (sections.length !== 9 || sections.some((s) => s.paragraphs.length === 0) || !bibliography.length) {
    throw Error('Faltan apartados, cuerpo o referencias de la obra.');
  }
  return { sections, bibliography, supplements };
}
export function parseArataMarinoSrt(input) {
  const seconds = (time) => {
    const m = /^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/.exec(time);
    if (!m) throw Error('Tiempo SRT inválido: ' + time);
    return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) + Number(m[4]) / 1000;
  };
  const cues = String(input).replace(/\r/g, '').trim().split(/\n\s*\n/).map((block, index) => {
    const lines = block.split('\n');
    const match = /^(\S+)\s+-->\s+(\S+)$/.exec(lines[1] || '');
    if (Number(lines[0]) !== index + 1 || !match) throw Error('SRT no consecutivo o inválido.');
    const start = seconds(match[1]), end = seconds(match[2]);
    if (end < start) throw Error('Duración SRT negativa.');
    return { start, end, text: norm(lines.slice(2).join(' ').replace(/<[^>]*>/g, '')) };
  });
  if (cues.some((cue, i) => i && cue.start < cues[i - 1].start)) throw Error('SRT desordenado.');
  return cues;
}
export function arataParagraphTimings(sections, cues) {
  const stream = cues.flatMap((cue) => tokens(cue.text).map((word) => ({ word, start: cue.start })));
  const anchors = new Map();
  for (let i = 0; i + 4 <= stream.length; i++) {
    const key = stream.slice(i, i + 4).map((v) => v.word).join(' ');
    if (!anchors.has(key)) anchors.set(key, []);
    anchors.get(key).push(i);
  }
  let cursor = 0;
  const results = [];
  for (const paragraph of sections.flatMap((s) => s.paragraphs)) {
    // La tabla original queda disponible, pero no se le inventa un tiempo de narración.
    if (paragraph.kind === 'table') continue;
    const target = tokens(paragraph.sentences.map((s) => s.text).join(' '));
    let hit = -1;
    for (let offset = 0; offset < Math.min(24, target.length - 3) && hit < 0; offset++) {
      const key = target.slice(offset, offset + 4).join(' ');
      hit = (anchors.get(key) || []).find((position) => position >= cursor) ?? -1;
    }
    if (hit < 0) {
      for (let offset = 0; offset < Math.min(24, target.length - 2) && hit < 0; offset++) {
        for (let index = cursor; index + 3 <= stream.length; index++) {
          if (target.slice(offset, offset + 3).every((word, i) => stream[index + i].word === word)) {
            hit = index; break;
          }
        }
      }
    }
    if (hit >= 0) { results.push({ id: paragraph.id, start: stream[hit].start }); cursor = hit + 1; }
  }
  results.forEach((entry, i) => { entry.end = i + 1 < results.length ?
    Math.max(entry.start, results[i + 1].start - 0.001) : (cues.at(-1)?.end ?? entry.start); });
  return results;
}
export function buildArataMarinoReadingDocument(academicText, srt) {
  const academic = extractArataAcademicDocument(academicText);
  const cues = parseArataMarinoSrt(srt);
  const paragraphTimings = arataParagraphTimings(academic.sections, cues);
  const title = 'Auroras y tempestades: la educación entre golpes (1955–1976)';
  const author = 'Nicolás Arata y Marcelo Mariño';
  const document = {
    id: 'arata-marino-auroras-tempestades', title,
    subtitle: 'Lección 10 · La educación en la Argentina. Una historia en 12 lecciones',
    author, duration: cues.at(-1)?.end || 0,
    versionLabel: 'Lección 10 · Ediciones Novedades Educativas · copia académica de trabajo',
    source: { kind: 'ElevenLabs SRT', cueCount: cues.length, finalCueEnd: cues.at(-1)?.end || 0 },
    frontMatter: [{ id: 'arata-marino-front-title', role: 'title', text: title },
      { id: 'arata-marino-front-author', role: 'author', text: author }],
    sections: academic.sections, endnotes: [],
    bibliography: [...academic.bibliography, ...academic.supplements],
    sourceNote: 'La copia académica conserva bibliografía y recursos multimedia citados. El seguimiento temporal es aproximado por párrafos.',
  };
  return { document, cues, paragraphTimings,
    metrics: { paragraphs: academic.sections.reduce((n, s) => n + s.paragraphs.length, 0),
      timed: paragraphTimings.length, references: academic.bibliography.length,
      supplements: academic.supplements.length } };
}

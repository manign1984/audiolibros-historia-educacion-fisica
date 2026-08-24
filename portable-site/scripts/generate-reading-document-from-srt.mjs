import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_OUTPUT = path.join(ROOT, 'src', 'readingDocument.js');

const SECTION_DEFINITIONS = [
  {
    id: 'apertura',
    title: 'Apertura',
    shortTitle: 'Apertura',
    marker: null,
  },
  {
    id: 'problema-pedagogias',
    title: 'El problema de las pedagogías',
    shortTitle: 'El problema de las pedagogías',
    marker: 'El problema de las pedagogías.',
  },
  {
    id: 'pedagogia-reforma',
    title: 'La pedagogía de la Reforma Fresco–Noble',
    shortTitle: 'La pedagogía de la Reforma',
    marker: 'La pedagogía de la Reforma Fresco-Noble.',
  },
  {
    id: 'estrategias-triunfo',
    title: 'Las estrategias del triunfo',
    shortTitle: 'Las estrategias del triunfo',
    marker: 'Las estrategias del triunfo.',
  },
];

const FOOTNOTE_INSERTIONS = {
  's-002': [{ number: 2, after: 'nivel nacional.' }],
  's-025': [{ number: 3, after: 'En un trabajo anterior' }],
  's-027': [{ number: 4, after: 'imaginario normalizador' }],
  's-028': [{ number: 5, after: '”imaginario disciplinador”' }],
  's-031': [{ number: 6, after: 'poder/saber' }],
  's-035': [{ number: 7, after: 'evaluación' }],
  's-039': [{ number: 8, after: '”campo”' }],
  's-041': [
    { number: 9, after: '“pedagogías hegemónicas”' },
    { number: 10, after: 'período histórico', last: true },
  ],
  's-055': [{ number: 11, after: 'familia”' }],
  's-064': [{ number: 12, after: 'niños”' }],
  's-070': [{ number: 13, after: 'Argentina' }],
  's-098': [{ number: 14, after: 'década', last: true }],
  's-099': [{ number: 15, after: 'Barcelona”' }],
  's-102': [{ number: 16, after: 'disciplinar”.' }],
  's-115': [{ number: 17, after: 'positivismo', last: true }],
  's-137': [{ number: 18, after: 'satisfechas' }],
  's-148': [{ number: 19, after: 'Escalafón Docente' }],
  's-189': [{ number: 20, after: 'territorio provincial' }],
};

const LEGACY_SENTENCE_OVERRIDES = {
  // Esta aclaración figuraba en la versión textual anterior, pero no fue locutada.
  // Sus posibles notas quedan asociadas a la oración inmediatamente anterior.
  's-188': 's-187',
};

function timestampToSeconds(value) {
  const match = value.match(/^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/);
  if (!match) throw new Error(`Marca temporal inválida: ${value}`);
  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]) + Number(match[4]) / 1000;
}

function cleanCueText(lines) {
  return lines
    .join(' ')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseSrt(raw) {
  return raw
    .replace(/\r/g, '')
    .trim()
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block.split('\n');
      const timeMatch = lines[1]?.match(/^(.+?) --> (.+)$/);
      if (!timeMatch) throw new Error(`Bloque SRT inválido: ${block.slice(0, 80)}`);
      return {
        index: Number(lines[0]),
        start: timestampToSeconds(timeMatch[1]),
        end: timestampToSeconds(timeMatch[2]),
        text: cleanCueText(lines.slice(2)),
      };
    })
    .filter((cue) => cue.text);
}

function normalize(value) {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[“”«»"'()[\]{}.,;:!?¿¡—–-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const NON_TERMINAL_ABBREVIATIONS = /^(?:Sr|Sra|Srta|Dr|Dra|Prof|Ing|Lic|Nro|No|p|pp|art)$/i;

function segmentTranscript(transcript) {
  const segments = [];
  let startOffset = 0;

  for (let index = 0; index < transcript.length; index += 1) {
    const character = transcript[index];
    if (!'.!?'.includes(character)) continue;
    if (character === '.' && /\d/.test(transcript[index - 1] || '') && /\d/.test(transcript[index + 1] || '')) continue;

    let endOffset = index;
    while (/[”’"'»\])}]/.test(transcript[endOffset + 1] || '')) endOffset += 1;
    if (!/\s/.test(transcript[endOffset + 1] || '')) continue;

    const pending = transcript.slice(startOffset, index + 1);
    const lastToken = pending.match(/([\p{L}]+)\.$/u)?.[1] || '';
    const isInitial = /^[A-ZÁÉÍÓÚÑ]$/.test(lastToken);
    if (character === '.' && (isInitial || NON_TERMINAL_ABBREVIATIONS.test(lastToken))) continue;

    const leadingWhitespace = transcript.slice(startOffset, endOffset + 1).match(/^\s*/)?.[0].length || 0;
    const trailingWhitespace = transcript.slice(startOffset, endOffset + 1).match(/\s*$/)?.[0].length || 0;
    const contentStart = startOffset + leadingWhitespace;
    const contentEnd = endOffset + 1 - trailingWhitespace;
    if (contentEnd > contentStart) {
      segments.push({
        segment: transcript.slice(contentStart, contentEnd),
        index: contentStart,
      });
    }
    startOffset = endOffset + 1;
    index = endOffset;
  }

  const trailing = transcript.slice(startOffset);
  const leadingWhitespace = trailing.match(/^\s*/)?.[0].length || 0;
  const trailingWhitespace = trailing.match(/\s*$/)?.[0].length || 0;
  const contentStart = startOffset + leadingWhitespace;
  const contentEnd = transcript.length - trailingWhitespace;
  if (contentEnd > contentStart) {
    segments.push({
      segment: transcript.slice(contentStart, contentEnd),
      index: contentStart,
    });
  }

  return segments;
}

function polishSentenceText(value) {
  const text = value
    .replace(/^([a-záéíóúñ])/, (character) => character.toUpperCase())
    .replace(/\bestrategia coptativa\b/gi, 'estrategia cooptativa')
    .replace(/\bMás allá\b/g, 'más allá')
    .replace(/\bRango legislativo\b/g, 'rango legislativo')
    .replace(/\bY ante el cual\b/g, 'y ante el cual')
    .replace(/\bMientras que el espiritualismo\b/g, 'mientras que el espiritualismo')
    .replace(/\bpor fresco\b/g, 'por Fresco');

  return text;
}

function addFootnoteMarkers(value, oldSentenceId) {
  return (FOOTNOTE_INSERTIONS[oldSentenceId] || []).reduce((text, insertion) => {
    const marker = `[${insertion.number}]`;
    if (text.includes(marker)) return text;
    const matchIndex = insertion.last ? text.lastIndexOf(insertion.after) : text.indexOf(insertion.after);
    if (matchIndex < 0) throw new Error(`No se pudo ubicar la nota ${marker} en ${oldSentenceId}.`);
    const insertionIndex = matchIndex + insertion.after.length;
    return `${text.slice(0, insertionIndex)}${marker}${text.slice(insertionIndex)}`;
  }, value);
}

function buildTimedSentences(cues) {
  let transcript = '';
  const cueSpans = [];

  for (const cue of cues) {
    if (transcript) transcript += ' ';
    const startOffset = transcript.length;
    transcript += cue.text;
    cueSpans.push({
      ...cue,
      startOffset,
      endOffset: transcript.length,
    });
  }

  const locateCue = (offset) => {
    const bounded = Math.max(0, Math.min(offset, Math.max(0, transcript.length - 1)));
    return cueSpans.find((span) => bounded >= span.startOffset && bounded < span.endOffset)
      || cueSpans.find((span) => bounded < span.startOffset)
      || cueSpans.at(-1);
  };

  const timeAt = (offset, edge) => {
    const cue = locateCue(offset);
    if (!cue) return 0;
    const length = Math.max(1, cue.endOffset - cue.startOffset);
    const relative = Math.max(0, Math.min(1, (offset - cue.startOffset + (edge === 'end' ? 1 : 0)) / length));
    return cue.start + (cue.end - cue.start) * relative;
  };

  const sentences = segmentTranscript(transcript)
    .map((segment) => {
      const startOffset = segment.index;
      const endOffset = segment.index + segment.segment.length - 1;
      const text = segment.segment.trim().replace(/\s+/g, ' ');
      return {
        text,
        start: Number(timeAt(startOffset, 'start').toFixed(3)),
        end: Number(timeAt(endOffset, 'end').toFixed(3)),
      };
    })
    .filter((sentence) => sentence.text);

  const rebuiltTranscript = sentences.map((sentence) => sentence.text).join(' ').replace(/\s+/g, ' ').trim();
  const sourceTranscript = transcript.replace(/\s+/g, ' ').trim();
  if (rebuiltTranscript !== sourceTranscript) {
    throw new Error('La segmentación por oraciones perdió o alteró texto del SRT.');
  }

  sentences.forEach((sentence) => {
    sentence.text = polishSentenceText(sentence.text);
  });

  for (let index = 0; index < sentences.length - 1; index += 1) {
    sentences[index].end = Number(Math.min(sentences[index].end, sentences[index + 1].start).toFixed(3));
  }

  return sentences;
}

function tokenCounts(value) {
  const counts = new Map();
  for (const token of normalize(value).split(' ').filter(Boolean)) {
    counts.set(token, (counts.get(token) || 0) + 1);
  }
  return counts;
}

function similarity(left, right) {
  const leftCounts = tokenCounts(left);
  const rightCounts = tokenCounts(right);
  const leftTotal = [...leftCounts.values()].reduce((sum, count) => sum + count, 0);
  const rightTotal = [...rightCounts.values()].reduce((sum, count) => sum + count, 0);
  if (!leftTotal || !rightTotal) return 0;
  let shared = 0;
  for (const [token, count] of leftCounts) {
    shared += Math.min(count, rightCounts.get(token) || 0);
  }
  return (2 * shared) / (leftTotal + rightTotal);
}

function alignSentences(oldSentences, newSentences) {
  const rows = oldSentences.length + 1;
  const columns = newSentences.length + 1;
  const gapPenalty = -0.34;
  const score = Array.from({ length: rows }, () => new Float64Array(columns));
  const move = Array.from({ length: rows }, () => new Uint8Array(columns));

  for (let row = 1; row < rows; row += 1) {
    score[row][0] = score[row - 1][0] + gapPenalty;
    move[row][0] = 2;
  }
  for (let column = 1; column < columns; column += 1) {
    score[0][column] = score[0][column - 1] + gapPenalty;
    move[0][column] = 3;
  }

  for (let row = 1; row < rows; row += 1) {
    for (let column = 1; column < columns; column += 1) {
      const sim = similarity(oldSentences[row - 1].text, newSentences[column - 1].text);
      const diagonal = score[row - 1][column - 1] + (sim >= 0.18 ? sim * 2 - 0.72 : -0.9);
      const up = score[row - 1][column] + gapPenalty;
      const left = score[row][column - 1] + gapPenalty;
      if (diagonal >= up && diagonal >= left) {
        score[row][column] = diagonal;
        move[row][column] = 1;
      } else if (up >= left) {
        score[row][column] = up;
        move[row][column] = 2;
      } else {
        score[row][column] = left;
        move[row][column] = 3;
      }
    }
  }

  const matches = [];
  let row = rows - 1;
  let column = columns - 1;
  while (row > 0 || column > 0) {
    if (move[row][column] === 1) {
      matches.push({
        oldIndex: row - 1,
        newIndex: column - 1,
        similarity: similarity(oldSentences[row - 1].text, newSentences[column - 1].text),
      });
      row -= 1;
      column -= 1;
    } else if (move[row][column] === 2) {
      row -= 1;
    } else {
      column -= 1;
    }
  }

  return matches.reverse();
}

function interpolateParagraphAnchors(oldParagraphs, matches, newSentenceCount) {
  const paragraphByOldSentence = [];
  oldParagraphs.forEach((paragraph, paragraphIndex) => {
    paragraph.sentences.forEach((_, sentenceIndex) => {
      paragraphByOldSentence.push({ paragraphIndex, sentenceIndex });
    });
  });

  const candidates = Array.from({ length: oldParagraphs.length }, () => []);
  for (const match of matches) {
    if (match.similarity < 0.28) continue;
    const location = paragraphByOldSentence[match.oldIndex];
    if (!location) continue;
    candidates[location.paragraphIndex].push(Math.max(0, match.newIndex - location.sentenceIndex));
  }

  const anchors = candidates.map((values) => values.length ? Math.min(...values) : null);
  anchors[0] = 0;

  for (let index = 0; index < anchors.length; index += 1) {
    if (anchors[index] !== null) continue;
    let previous = index - 1;
    while (previous >= 0 && anchors[previous] === null) previous -= 1;
    let next = index + 1;
    while (next < anchors.length && anchors[next] === null) next += 1;
    if (previous >= 0 && next < anchors.length) {
      const progress = (index - previous) / (next - previous);
      anchors[index] = Math.round(anchors[previous] + (anchors[next] - anchors[previous]) * progress);
    } else if (previous >= 0) {
      const remainingParagraphs = anchors.length - previous;
      const step = (newSentenceCount - anchors[previous]) / remainingParagraphs;
      anchors[index] = Math.round(anchors[previous] + step * (index - previous));
    } else if (next < anchors.length) {
      anchors[index] = Math.round((anchors[next] * index) / next);
    } else {
      anchors[index] = Math.round((newSentenceCount * index) / anchors.length);
    }
  }

  for (let index = 0; index < anchors.length; index += 1) {
    anchors[index] = Math.max(index ? anchors[index - 1] : 0, Math.min(newSentenceCount, anchors[index]));
  }
  return anchors;
}

function sentenceIdFor(globalIndex) {
  return `srt-${String(globalIndex + 1).padStart(3, '0')}`;
}

function rebuildSection(definition, cues, oldSection, globalOffset, legacySentenceMap) {
  const newSentences = buildTimedSentences(cues);
  const oldSentences = oldSection.paragraphs.flatMap((paragraph) => paragraph.sentences);
  const matches = alignSentences(oldSentences, newSentences);
  const matchByNewIndex = new Map(matches.filter((match) => match.similarity >= 0.48).map((match) => [match.newIndex, match]));
  const matchByOldIndex = new Map(matches.map((match) => [match.oldIndex, match]));
  const usedIds = new Set();

  const rebuiltSentences = newSentences.map((sentence, newIndex) => {
    const match = matchByNewIndex.get(newIndex);
    const oldId = match ? oldSentences[match.oldIndex].id : null;
    const id = oldId && !usedIds.has(oldId) ? oldId : sentenceIdFor(globalOffset + newIndex);
    usedIds.add(id);
    return {
      id,
      ...sentence,
      text: addFootnoteMarkers(sentence.text, oldId),
    };
  });

  oldSentences.forEach((oldSentence, oldIndex) => {
    const direct = matchByOldIndex.get(oldIndex);
    if (direct && direct.similarity >= 0.25) {
      legacySentenceMap[oldSentence.id] = rebuiltSentences[direct.newIndex].id;
      return;
    }
    const expected = oldSentences.length <= 1
      ? 0
      : Math.round((oldIndex / (oldSentences.length - 1)) * Math.max(0, rebuiltSentences.length - 1));
    let bestIndex = expected;
    let bestScore = -1;
    const radius = Math.max(4, Math.ceil(rebuiltSentences.length * 0.08));
    for (let newIndex = Math.max(0, expected - radius); newIndex <= Math.min(rebuiltSentences.length - 1, expected + radius); newIndex += 1) {
      const candidate = similarity(oldSentence.text, rebuiltSentences[newIndex].text);
      if (candidate > bestScore) {
        bestScore = candidate;
        bestIndex = newIndex;
      }
    }
    if (rebuiltSentences[bestIndex]) legacySentenceMap[oldSentence.id] = rebuiltSentences[bestIndex].id;
  });

  const anchors = interpolateParagraphAnchors(oldSection.paragraphs, matches, rebuiltSentences.length);
  const paragraphs = oldSection.paragraphs
    .map((oldParagraph, paragraphIndex) => {
      const start = anchors[paragraphIndex];
      const end = paragraphIndex + 1 < anchors.length ? anchors[paragraphIndex + 1] : rebuiltSentences.length;
      return {
        id: oldParagraph.id,
        kind: oldParagraph.kind || 'paragraph',
        sentences: rebuiltSentences.slice(start, end),
      };
    })
    .filter((paragraph) => paragraph.sentences.length);

  return {
    section: {
      id: definition.id,
      title: definition.title,
      shortTitle: definition.shortTitle,
      paragraphs,
    },
    matches,
    sentenceCount: rebuiltSentences.length,
  };
}

function buildDocument(cues, oldDocument) {
  if (cues.length < 10) throw new Error('El SRT no contiene suficientes bloques.');

  const frontMatter = [
    { id: 'front-title', role: 'title', text: oldDocument.title, start: cues[0].start, end: cues[0].end },
    { id: 'front-subtitle', role: 'subtitle', text: oldDocument.subtitle, start: cues[1].start, end: cues[2].end },
    { id: 'front-author', role: 'author', text: `${oldDocument.author}[1]`, start: cues[3].start, end: cues[3].end },
  ];

  const markerIndexes = SECTION_DEFINITIONS.slice(1).map((definition) => {
    const markerIndex = cues.findIndex((cue) => normalize(cue.text) === normalize(definition.marker));
    if (markerIndex < 0) throw new Error(`No se encontró la cabecera: ${definition.marker}`);
    return markerIndex;
  });

  const ranges = [
    [4, markerIndexes[0]],
    [markerIndexes[0] + 1, markerIndexes[1]],
    [markerIndexes[1] + 1, markerIndexes[2]],
    [markerIndexes[2] + 1, cues.length],
  ];

  const legacySentenceMap = {};
  const sections = [];
  const reports = [];
  let globalOffset = 0;

  SECTION_DEFINITIONS.forEach((definition, sectionIndex) => {
    const oldSection = oldDocument.sections.find((section) => section.id === definition.id);
    if (!oldSection) throw new Error(`No se encontró la sección anterior: ${definition.id}`);
    const [start, end] = ranges[sectionIndex];
    const rebuilt = rebuildSection(definition, cues.slice(start, end), oldSection, globalOffset, legacySentenceMap);
    if (sectionIndex > 0) {
      const headingCue = cues[markerIndexes[sectionIndex - 1]];
      rebuilt.section.headingSentence = {
        id: `heading-${definition.id}`,
        text: definition.title,
        start: headingCue.start,
        end: headingCue.end,
      };
    }
    sections.push(rebuilt.section);
    reports.push({
      id: definition.id,
      oldSentences: oldSection.paragraphs.flatMap((paragraph) => paragraph.sentences).length,
      newSentences: rebuilt.sentenceCount,
      strongMatches: rebuilt.matches.filter((match) => match.similarity >= 0.48).length,
      weakestStrongMatch: Math.min(...rebuilt.matches.filter((match) => match.similarity >= 0.48).map((match) => match.similarity), 1),
    });
    globalOffset += rebuilt.sentenceCount;
  });

  for (const [legacyId, previousId] of Object.entries(oldDocument.legacySentenceMap || {})) {
    legacySentenceMap[legacyId] = legacySentenceMap[previousId] || previousId;
  }
  Object.assign(legacySentenceMap, LEGACY_SENTENCE_OVERRIDES);

  const document = {
    title: oldDocument.title,
    subtitle: oldDocument.subtitle,
    author: oldDocument.author,
    duration: oldDocument.duration,
    source: {
      kind: 'ElevenLabs SRT',
      cueCount: cues.length,
      finalCueEnd: cues.at(-1).end,
    },
    frontMatter,
    sections,
    legacySentenceMap,
    endnotes: oldDocument.endnotes,
    bibliography: oldDocument.bibliography,
  };

  return { document, reports };
}

function validateDocument(document) {
  const timedSentences = [
    ...document.frontMatter,
    ...document.sections.flatMap((section) => [
      ...(section.headingSentence ? [section.headingSentence] : []),
      ...section.paragraphs.flatMap((paragraph) => paragraph.sentences),
    ]),
  ];
  const ids = new Set();
  let previousStart = -1;
  for (const sentence of timedSentences) {
    if (!sentence.id || ids.has(sentence.id)) throw new Error(`ID duplicado o ausente: ${sentence.id}`);
    ids.add(sentence.id);
    if (!sentence.text?.trim()) throw new Error(`Texto vacío en ${sentence.id}`);
    if (!(sentence.start >= previousStart)) throw new Error(`Tiempo fuera de orden en ${sentence.id}`);
    if (!(sentence.end >= sentence.start)) throw new Error(`Intervalo inválido en ${sentence.id}`);
    previousStart = sentence.start;
  }
  return timedSentences;
}

const srtPath = process.argv[2] ? path.resolve(process.argv[2]) : null;
const shouldWrite = process.argv.includes('--write');
const useHeadBaseline = process.argv.includes('--baseline-head');
if (!srtPath) {
  console.error('Uso: node scripts/generate-reading-document-from-srt.mjs <archivo.srt> [--baseline-head] [--write]');
  process.exit(1);
}

let oldDocument;
if (useHeadBaseline) {
  const baselineSource = execFileSync('git', ['show', 'HEAD:src/readingDocument.js'], { cwd: ROOT, encoding: 'utf8' });
  oldDocument = JSON.parse(baselineSource.slice(baselineSource.indexOf('{'), baselineSource.lastIndexOf('}') + 1));
} else {
  const oldModuleUrl = `${pathToFileURL(DEFAULT_OUTPUT).href}?source=${Date.now()}`;
  ({ readingDocument: oldDocument } = await import(oldModuleUrl));
}
const cues = parseSrt(fs.readFileSync(srtPath, 'utf8'));
const { document, reports } = buildDocument(cues, oldDocument);
const timedSentences = validateDocument(document);
const bodySentences = document.sections.flatMap((section) => section.paragraphs.flatMap((paragraph) => paragraph.sentences));

console.log(JSON.stringify({
  cueCount: cues.length,
  finalCueEnd: cues.at(-1).end,
  timedSentenceCount: timedSentences.length,
  bodySentenceCount: bodySentences.length,
  bodyCharacterCount: bodySentences.reduce((sum, sentence) => sum + sentence.text.length, 0),
  firstStart: timedSentences[0].start,
  lastEnd: timedSentences.at(-1).end,
  sections: reports,
}, null, 2));

if (shouldWrite) {
  fs.writeFileSync(DEFAULT_OUTPUT, `export const readingDocument = ${JSON.stringify(document, null, 2)};\n`, 'utf8');
  console.log(`Documento actualizado: ${DEFAULT_OUTPUT}`);
}

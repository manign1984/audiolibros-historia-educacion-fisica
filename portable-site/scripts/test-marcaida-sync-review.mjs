import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Prueba de consistencia y reproducibilidad de la propuesta.
// NO activa la sincronización del lector ni aprueba los tiempos obtenidos.
const root = new URL('../../', import.meta.url);
const read = async path => readFile(new URL(path, root), 'utf8');
const [proposal, asr, text, configSource, vtt] = await Promise.all([
  read('data/marcaida-scaltritti-alineacion-propuesta-v2.json').then(JSON.parse),
  read('data/marcaida-scaltritti-alineacion-revision.json').then(JSON.parse),
  read('portable-site/src/marcaida/reading-document.json').then(JSON.parse),
  read('portable-site/src/marcaida/readerConfig.js'),
  read('data/marcaida-scaltritti-original.vtt'),
]);

const sentences = text.sections.flatMap(s => s.paragraphs.flatMap(p => p.sentences));
const tokenize = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(/[a-z0-9]+/g) || [];
const sourceWords = [];
const bounds = [];
for (const sentence of sentences) {
  const words = tokenize(sentence.text);
  const first = sourceWords.length;
  sourceWords.push(...words);
  bounds.push({ id: sentence.id, first, last: sourceWords.length - 1, count: words.length });
}

const cues = [];
for (const block of vtt.replace(/\r/g, '').split(/\n\s*\n/)) {
  const match = block.match(/(\d{2}):(\d{2}):(\d{2})\.(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})\.(\d{3})/);
  if (!match) continue;
  const q = match.slice(1).map(Number);
  const start = q[0] * 3600 + q[1] * 60 + q[2] + q[3] / 1000;
  const end = q[4] * 3600 + q[5] * 60 + q[6] + q[7] / 1000;
  const cleaned = block.slice(match.index + match[0].length)
    .replace(/<v[^>\n]*>/g, ' ')
    .replace(/<break[^>]*>/gs, ' ')
    .replace(/<[^>]*>/gs, ' ')
    .replace(/time="[^"]+"\/?>/g, ' ');
  cues.push({ start, end, words: tokenize(cleaned) });
}

const vttWords = [];
for (const cue of cues) {
  cue.words.forEach((word, index) => {
    const n = cue.words.length;
    vttWords.push({
      word,
      start: cue.start + (cue.end - cue.start) * index / n,
      end: cue.start + (cue.end - cue.start) * (index + 1) / n,
    });
  });
}

// Alineación global exacta por palabras, admitiendo inserciones/eliminaciones.
// La salida permite verificar independientemente los 3.976 emparejamientos.
const n = sourceWords.length;
const m = vttWords.length;
const width = m + 1;
const previous = new Uint16Array(width);
const current = new Uint16Array(width);
const decisions = new Uint8Array((n + 1) * width);
for (let j = 0; j <= m; j++) previous[j] = j;
for (let i = 1; i <= n; i++) {
  current[0] = i;
  const offset = i * width;
  for (let j = 1; j <= m; j++) {
    const equal = sourceWords[i - 1] === vttWords[j - 1].word;
    let cost = previous[j - 1] + (equal ? 0 : 2);
    let move = equal ? 1 : 4;
    if (previous[j] + 1 < cost) { cost = previous[j] + 1; move = 2; }
    if (current[j - 1] + 1 < cost) { cost = current[j - 1] + 1; move = 3; }
    current[j] = cost;
    decisions[offset + j] = move;
  }
  previous.set(current);
}
const aligned = new Int32Array(n).fill(-1);
let x = n, y = m;
while (x > 0 && y > 0) {
  const move = decisions[x * width + y];
  if (move === 1 || move === 4) {
    if (move === 1) aligned[x - 1] = y - 1;
    x--; y--;
  } else if (move === 2) x--;
  else if (move === 3) y--;
  else throw Error('Invalid alignment backtrace.');
}
const timesById = new Map();
for (const b of bounds) {
  const matched = [];
  for (let i = b.first; i <= b.last; i++) if (aligned[i] >= 0) matched.push(aligned[i]);
  timesById.set(b.id, {
    matched: matched.length,
    words: b.count,
    vttStart: matched.length ? vttWords[matched[0]].start : null,
    vttEnd: matched.length ? vttWords[matched.at(-1)].end : null,
  });
}

assert.equal(proposal.status, 'REVIEW-ONLY / DO NOT LOAD INTO PUBLIC READER');
assert.equal(proposal.activeInReader, false);
assert.equal(proposal.humanAuditoryReview, false);
assert.match(configSource, /status: 'paragraph-preview'/);
assert.match(configSource, /unit: 'paragraph'/);
assert.equal(cues.length, proposal.summary.vttCueCount);
assert.equal(sourceWords.length, proposal.summary.sourceTokens);
assert.equal(vttWords.length, proposal.summary.vttTokens);
assert.equal(aligned.filter(i => i >= 0).length, proposal.summary.exactAlignedTokens);
assert.equal(sentences.length, 123);
assert.equal(proposal.sentences.length, sentences.length);
assert.deepEqual(proposal.sentences.map(s => s.sentenceId), sentences.map(s => s.id));
assert.equal(new Set(proposal.sentences.map(s => s.sentenceId)).size, 123);
assert.equal(proposal.summary.audioDuration, asr.audioDuration);

const asrById = new Map(asr.sentences.map(s => [s.sentenceId, s]));
const anchors = [];
for (const candidate of proposal.sentences) {
  const base = timesById.get(candidate.sentenceId);
  assert.ok(base);
  assert.equal(candidate.matchedVttTokens, base.matched);
  assert.equal(candidate.sourceTokens, base.words);
  assert.ok(Number.isFinite(candidate.start) && Number.isFinite(candidate.end) && candidate.start <= candidate.end);
  assert.ok(candidate.start >= 0 && candidate.end <= asr.audioDuration);
  assert.equal(candidate.verification, 'auditory-check-required');
  const sourceAsr = asrById.get(candidate.sentenceId);
  const hasAsrBounds = Number.isFinite(sourceAsr?.start) && Number.isFinite(sourceAsr?.end);
  if (hasAsrBounds) {
    assert.equal(candidate.method, 'asr-word-timestamps');
    assert.ok(Math.abs(candidate.start - sourceAsr.start) < 0.002);
    assert.ok(Math.abs(candidate.end - sourceAsr.end) < 0.002);
    anchors.push({ id: candidate.sentenceId, vtt: base.vttStart, audio: sourceAsr.start });
    anchors.push({ id: candidate.sentenceId, vtt: base.vttEnd, audio: sourceAsr.end });
  } else {
    assert.equal(candidate.method, 'vtt-mapped-between-asr-anchors');
    assert.ok(candidate.anchors && candidate.anchors.start && candidate.anchors.end);
  }
}

const asrCount = proposal.sentences.filter(s => s.method === 'asr-word-timestamps').length;
const inferredCount = proposal.sentences.length - asrCount;
assert.equal(asrCount, 110);
assert.equal(inferredCount, 13);
anchors.sort((a,b) => a.vtt - b.vtt);
function interpolate(vttTime) {
  let left, right;
  for (const item of anchors) {
    if (item.vtt <= vttTime) left = item;
    else { right = item; break; }
  }
  assert.ok(left && right && left.vtt < right.vtt);
  return left.audio + (vttTime - left.vtt) * (right.audio - left.audio) / (right.vtt - left.vtt);
}
for (const candidate of proposal.sentences.filter(s => s.method === 'vtt-mapped-between-asr-anchors')) {
  const base = timesById.get(candidate.sentenceId);
  assert.ok(Math.abs(candidate.start - interpolate(base.vttStart)) <= 0.002, candidate.sentenceId + ': start');
  assert.ok(Math.abs(candidate.end - interpolate(base.vttEnd)) <= 0.002, candidate.sentenceId + ': end');
}
let overlapCount = 0;
for (let i = 1; i < proposal.sentences.length; i++) {
  if (proposal.sentences[i].start < proposal.sentences[i-1].end - 0.05) overlapCount++;
}
assert.equal(overlapCount, proposal.summary.overlapCount);
assert.equal(overlapCount, 0);

// Las notas al pie NO se narran ni se incorporan a la línea temporal.
assert.equal(text.endnotes.length, 10);
assert.ok(text.endnotes.every(n => n.start === undefined && n.end === undefined));
assert.ok(sentences.every(s => s.start === undefined && s.end === undefined),
  'El lector público debe conservarse sin sincronización hasta la aprobación auditiva.');

console.log('Marcaida: 361 cues, 3976/3980 palabras alineadas, 110 rangos ASR + 13 candidatos entre anclas, sin solapamientos; sincronización pública sin activar.');

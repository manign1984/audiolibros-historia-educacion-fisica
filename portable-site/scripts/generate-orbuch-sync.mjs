import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const transcriptPath = resolve(root, 'src/orbuch/orbuch-texto-accesible.txt');
const audioPath = resolve(root, 'public/assets/orbuch-audiolibro.mp3');
const subtitlesPath = resolve(root, 'public/assets/orbuch-subtitulos.srt');
const outputPath = resolve(root, 'src/orbuch/orbuch-timings.json');

const sectionIds = new Map([
  ['Introducción', 'introduccion'],
  ['Gimnasia compensatoria en el aula', 'aula'],
  ['Gimnasia de Oficinas', 'oficinas'],
  ['Conclusiones', 'conclusiones'],
]);

const waveformChecks = [
  { id: 'introduccion-titulo', srtStart: 9.162, audioStart: 9.578 },
  { id: 'aula-titulo', srtStart: 426.065, audioStart: 427.627 },
  { id: 'oficinas-titulo', srtStart: 1134.324, audioStart: 1138.15 },
  { id: 'conclusiones-titulo', srtStart: 1596.82, audioStart: 1601.95 },
];

function sha256(contents) {
  return createHash('sha256').update(contents).digest('hex');
}

function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .replace(/[^a-z0-9]/g, '');
}

function timestampToSeconds(value) {
  const match = value.match(/^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/);
  assert.ok(match, `Marca SRT inválida: ${value}`);
  return (Number(match[1]) * 3600) + (Number(match[2]) * 60) + Number(match[3]) + (Number(match[4]) / 1000);
}

function parseSrt(source) {
  return source
    .replace(/^\uFEFF/, '')
    .trim()
    .split(/\n\s*\n/)
    .map((block) => {
      const lines = block.split(/\r?\n/);
      const match = lines[1]?.match(/^(\S+) --> (\S+)$/);
      assert.ok(match, `Cue SRT inválido: ${block.slice(0, 120)}`);
      return {
        index: Number(lines[0]),
        start: timestampToSeconds(match[1]),
        end: timestampToSeconds(match[2]),
        text: lines.slice(2).join(' ').replace(/\s+/g, ' ').trim(),
      };
    });
}

function parseUnits(source) {
  const blocks = source
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);
  const segmenter = new Intl.Segmenter('es', { granularity: 'sentence' });
  const units = blocks.slice(0, 3).map((text, index) => ({
    id: ['portada-titulo', 'portada-subtitulo', 'portada-autor'][index],
    text,
  }));

  let sectionId = '';
  let paragraphIndex = 0;
  blocks.slice(3).forEach((block) => {
    if (sectionIds.has(block)) {
      sectionId = sectionIds.get(block);
      paragraphIndex = 0;
      units.push({ id: `${sectionId}-titulo`, text: block });
      return;
    }

    assert.ok(sectionId, `Párrafo fuera de sección: ${block.slice(0, 80)}`);
    paragraphIndex += 1;
    [...segmenter.segment(block)]
      .map(({ segment }) => segment.trim())
      .filter(Boolean)
      .forEach((text, sentenceIndex) => units.push({
        id: `${sectionId}-p${paragraphIndex}-s${sentenceIndex + 1}`,
        text,
      }));
  });
  return units;
}

function readAudioDuration() {
  const result = spawnSync('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    audioPath,
  ], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || 'ffprobe no pudo leer el MP3.');
  const duration = Number(result.stdout.trim());
  assert.ok(Number.isFinite(duration) && duration > 0, 'Duración de audio inválida.');
  return duration;
}

function locateTime(cues, globalOffset, edge, scale) {
  const cue = cues.find(({ normalizedStart, normalizedEnd }) => (
    edge === 'start'
      ? globalOffset >= normalizedStart && globalOffset < normalizedEnd
      : globalOffset > normalizedStart && globalOffset <= normalizedEnd
  ));
  assert.ok(cue, `No se encontró el carácter ${globalOffset} en el SRT.`);
  const localOffset = globalOffset - cue.normalizedStart;
  const fraction = localOffset / (cue.normalizedEnd - cue.normalizedStart);
  return (cue.start + ((cue.end - cue.start) * fraction)) * scale;
}

function align(units, spokenCues, audioDuration, srtDuration) {
  let cueOffset = 0;
  const indexedCues = spokenCues.map((cue) => {
    const normalizedText = normalize(cue.text);
    const indexed = {
      ...cue,
      normalizedText,
      normalizedStart: cueOffset,
      normalizedEnd: cueOffset + normalizedText.length,
    };
    cueOffset = indexed.normalizedEnd;
    return indexed;
  });
  const normalizedScript = units.map(({ text }) => normalize(text)).join('');
  const normalizedSubtitles = indexedCues.map(({ normalizedText }) => normalizedText).join('');
  assert.equal(normalizedSubtitles, normalizedScript, 'El texto hablado del SRT no coincide con el guion del lector.');

  const scale = audioDuration / srtDuration;
  let unitOffset = 0;
  const aligned = units.map((unit) => {
    const normalizedText = normalize(unit.text);
    const startOffset = unitOffset;
    unitOffset += normalizedText.length;
    return {
      id: unit.id,
      start: locateTime(indexedCues, startOffset, 'start', scale),
      end: locateTime(indexedCues, unitOffset, 'end', scale),
    };
  });

  // El MP3 no conserva el medio segundo inicial declarado como etiqueta break.
  aligned[0].start = 0;
  aligned.at(-1).end = audioDuration;
  aligned.forEach((entry, index) => {
    assert.ok(entry.end > entry.start, `${entry.id} no tiene un intervalo positivo.`);
    if (index > 0) assert.ok(entry.start >= aligned[index - 1].end, `${entry.id} no es monótono.`);
  });
  return { aligned, scale };
}

const [transcriptBuffer, audioBuffer, subtitlesBuffer] = await Promise.all([
  readFile(transcriptPath),
  readFile(audioPath),
  readFile(subtitlesPath),
]);
const transcript = transcriptBuffer.toString('utf8');
const subtitles = parseSrt(subtitlesBuffer.toString('utf8'));
const spokenCues = subtitles.filter(({ text }) => !/^<break\b/i.test(text));
const units = parseUnits(transcript);
const audioDuration = readAudioDuration();
const srtDuration = subtitles.at(-1).end;
const { aligned, scale } = align(units, spokenCues, audioDuration, srtDuration);

const checks = waveformChecks.map((check) => {
  const scaledStart = check.srtStart * scale;
  const error = Math.abs(scaledStart - check.audioStart);
  assert.ok(error < 0.45, `${check.id} se desvía ${error.toFixed(3)} s del MP3.`);
  return { ...check, scaledStart: Number(scaledStart.toFixed(3)), error: Number(error.toFixed(3)) };
});

const payload = {
  metadata: {
    status: 'source-srt-validated',
    method: 'exact normalized-text alignment to the supplied SRT, scaled to the definitive MP3 duration',
    audioSha256: sha256(audioBuffer),
    transcriptSha256: sha256(transcriptBuffer),
    sourceSrtSha256: sha256(subtitlesBuffer),
    audioDuration,
    sourceSrtDuration: srtDuration,
    timeScale: Number(scale.toFixed(9)),
    sourceCues: subtitles.length,
    spokenCues: spokenCues.length,
    units: aligned.length,
    normalizedCharacters: normalize(transcript).length,
    waveformChecks: checks,
    note: 'Marcas basadas en el SRT aportado por el proyecto; la escala corrige la diferencia uniforme de duración entre esa línea temporal y el MP3 definitivo.',
  },
  timings: Object.fromEntries(aligned.map(({ id, start, end }) => [id, {
    start: Number(start.toFixed(3)),
    end: Number(end.toFixed(3)),
  }])),
};

await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Alineadas ${aligned.length} unidades desde ${subtitles.length} cues SRT en ${outputPath}`);

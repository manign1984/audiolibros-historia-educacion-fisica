import vtt from './aisenstein_subtitulos_verificados.vtt?raw';

// La edición de lectura proviene de los 320 subtítulos corregidos aportados
// al proyecto. Los tiempos se asignan a oraciones, interpolando dentro de cada
// segmento; son aproximados y requieren control editorial de sincronización fina.
function seconds(time) {
  const [h, m, s] = time.split(':');
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
}
const cues = vtt.replace(/\r/g, '').split(/\n\s*\n/)
  .map((block) => {
    const line = block.split('\n').find((value) => value.includes(' --> '));
    if (!line) return null;
    const match = line.match(/(\d{2}:\d{2}:\d{2}\.\d{3})\s+-->\s+(\d{2}:\d{2}:\d{2}\.\d{3})/);
    if (!match) return null;
    return {
      start: seconds(match[1]),
      end: seconds(match[2]),
      text: block.split('\n').slice(block.split('\n').indexOf(line) + 1).join(' ').replace(/\s+/g, ' ').trim(),
    };
  }).filter(Boolean);

const sectionHeadings = [
  ['la investigación en historia', 'investigacion', 'La investigación en Historia', 'Investigar la historia'],
  ['la enseñanza de la historia', 'ensenanza', 'La enseñanza de la Historia', 'Enseñar historia'],
  ['algunas pistas que nos da la historia', 'pistas', 'Algunas pistas que nos da la Historia', 'Pistas del pasado'],
  ['de la utopia al pragmatismo', 'presente', 'De la utopía al pragmatismo', 'Pasado y presente'],
];
function headingFor(text) {
  const normalized = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[.!?]+$/g, '').trim();
  return sectionHeadings.find(([match]) => normalized === match);
}
function timedSentences(segmentCues, prefix) {
  if (!segmentCues.length) return [];
  let content = '';
  const ranges = segmentCues.map((cue) => {
    const from = content.length;
    content += (content ? ' ' : '') + cue.text;
    return { ...cue, from: from + (from ? 1 : 0), to: content.length };
  });
  const at = (position) => {
    const cue = ranges.find((range) => position <= range.to) || ranges.at(-1);
    const ratio = Math.min(1, Math.max(0, (position - cue.from) / Math.max(1, cue.to - cue.from)));
    return +(cue.start + (cue.end - cue.start) * ratio).toFixed(3);
  };
  const segmenter = new Intl.Segmenter('es', { granularity: 'sentence' });
  return [...segmenter.segment(content)].map(({ segment, index }) => ({
    text: segment.trim(),
    start: at(index + (segment.length - segment.trimStart().length)),
    end: at(index + segment.trimEnd().length),
  })).filter((entry) => entry.text).map((entry, index) => ({ ...entry, id: prefix + '-s' + (index + 1) }));
}
function paragraphs(segmentCues, sectionId) {
  const sentences = timedSentences(segmentCues, sectionId);
  const results = [];
  for (let i = 0; i < sentences.length; i += 4) {
    results.push({
      id: sectionId + '-p' + (results.length + 1),
      kind: 'body',
      sentences: sentences.slice(i, i + 4),
    });
  }
  return results;
}
if (cues.length !== 320) {
  throw new Error('Los subtítulos verificados de Aisenstein deben contener 320 segmentos.');
}
const frontMatter = cues.slice(0, 3).map((cue, index) => ({
  id: 'aisenstein-portada-' + (index + 1),
  role: ['title', 'subtitle', 'author'][index],
  ...cue,
}));
const sections = [{ id: 'apertura', title: '¿Para qué estudiar historia?', shortTitle: 'La pregunta inicial', paragraphs: [] }];
let current = sections[0];
let buffer = [];
const flush = () => {
  current.paragraphs.push(...paragraphs(buffer, current.id));
  buffer = [];
};
for (const cue of cues.slice(3)) {
  const meta = headingFor(cue.text);
  if (meta) {
    flush();
    current = {
      id: meta[1], title: meta[2], shortTitle: meta[3],
      headingSentence: { id: meta[1] + '-titulo', text: cue.text, start: cue.start, end: cue.end, role: 'heading' },
      paragraphs: [],
    };
    sections.push(current);
  } else buffer.push(cue);
}
flush();

export const aisensteinReadingDocument = {
  id: 'aisenstein-tabla-rasa',
  title: '¿Hacemos tabla rasa del pasado?',
  subtitle: 'El saber histórico en la formación docente en Educación Física',
  author: 'Ángela Aisenstein',
  duration: cues.at(-1).end,
  frontMatter,
  sections,
  sourceNote: 'Lectura accesible preparada a partir de 320 subtítulos corregidos del audiolibro. El audio y la fuente textual fueron aportados al proyecto +TEC UNAHUR. Se conservaron las palabras de esa transcripción; los saltos de párrafo se reorganizaron para la lectura en pantalla. Los comienzos de oración se estimaron dentro de cada subtítulo para permitir el seguimiento y la navegación: queda pendiente una verificación fina contra el audio definitivo. La edición académica conserva el aparato crítico.',
};

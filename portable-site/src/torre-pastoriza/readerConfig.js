import prepared from './readingDocument.generated.json';

const assetBase = [import.meta.env.BASE_URL.replace(/\/$/, ''), 'assets', 'torre-pastoriza'].join('/') + '/';

export const sourceUrl = 'https://drive.google.com/file/d/1BJNJ5DyEJIylbX8E5EG6i2WMoFh5-1yx/view';
export const cover = assetBase + 'chapadmalal-1950.webp';
export const authors = 'Juan Carlos Torre · Elisa Pastoriza';

// Duración del MP3 disponible para la validación local de esta rama.
export const audioDuration = 8214.073469;
export const readingDocument = {
  ...prepared.document,
  duration: audioDuration,
  source: { finalCueEnd: prepared.lastCueEnd },
};
export const legacyPageMap = prepared.legacyPageMap;
const sourceTimings = new Map(prepared.paragraphTimings.map(timing => [timing.id, timing]));
const paragraphTimings = readingDocument.sections.flatMap(section => section.paragraphs.map(({ id }) => {
  const timing = sourceTimings.get(id);
  if (!timing || timing.start >= audioDuration) return { id, audioUnavailable: true };
  return { ...timing, end: Math.min(timing.end, audioDuration) };
}));

export const readerConfig = {
  workId: 'torre-pastoriza-bienestar',
  mark: 'TP',
  shortTitle: 'La democratización del bienestar',
  authorAndTitle: authors + ' · La democratización del bienestar',
  experienceName: 'La democratización del bienestar',
  editorialReferenceLabel: 'del capítulo de Juan Carlos Torre y Elisa Pastoriza',
  pageMeta: 'Juan Carlos Torre · Elisa Pastoriza · Sudamericana, 2002',
  audioMode: 'direct',
  audiobookUrl: assetBase + 'audiolibro.mp3',
  sync: {
    status: 'paragraph-preview',
    unit: 'paragraph',
    paragraphTimings,
    coverMessage: 'La lectura sonora acompaña el texto académico con seguimiento aproximado por párrafos.',
  },
  textUrl: assetBase + 'texto-academico.txt',
  sourceUrl,
  downloadTextName: 'torre-pastoriza-la-democratizacion-del-bienestar.txt',
  readingEntry: {
    author: authors,
    audioMinutes: Math.round(audioDuration / 60),
    title: 'La democratización del bienestar',
    synopsis: 'Torre y Pastoriza estudian cómo se amplió el acceso al bienestar durante el primer peronismo. Vinculan la movilidad social y las políticas públicas con cambios en la vida cotidiana, desde la vivienda y la educación hasta las vacaciones, y examinan los conflictos que suscitó la presencia popular en nuevos espacios.',
  },
  storage: {
    stateKey: 'torre-pastoriza-bienestar-reader-state-v1',
    notesKey: 'torre-pastoriza-bienestar-reader-notes-v1',
  },
  export: {
    jsonFileName: 'cuaderno-torre-pastoriza.json',
    textFileName: 'cuaderno-torre-pastoriza.txt',
    shareTitle: 'Cuaderno de lectura · La democratización del bienestar',
  },
};

export const authorImage = assetBase + 'autoria.webp';

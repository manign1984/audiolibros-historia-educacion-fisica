import prepared from './readingDocument.json';

export const workId = 'feiguin-aisenstein-sujetos';
export const assetBase = [import.meta.env.BASE_URL.replace(/\/$/, ''), 'assets', 'feiguin-aisenstein'].join('/') + '/';
export const sourceUrl = 'https://hdl.handle.net/20.500.12209/7554';
export const readingDocument = prepared.document;

export const readerConfig = {
  workId,
  mark: 'FA',
  shortTitle: 'Diseño de sujetos morales, sanos y patriotas',
  authorAndTitle: readingDocument.author + ' · ' + readingDocument.title,
  experienceName: readingDocument.title,
  editorialReferenceLabel: 'del artículo de Feiguin y Aisenstein',
  audiobookParts: Array.from({ length: 47 }, (_, index) =>
    assetBase + 'audio/audio-' + String(index).padStart(2, '0') + '.part'),
  expectedAudioBytes: 67562280,
  textUrl: assetBase + 'texto-academico.txt',
  pdfUrl: assetBase + 'articulo.pdf',
  sourceUrl,
  sync: {
    unit: 'paragraph',
    status: 'paragraph-preview',
    paragraphTimings: prepared.paragraphTimings,
    launcherTitle: 'Lectura y audio',
    launcherDescription: 'Leé y escuchá el artículo, consultá sus notas y guardá tus anotaciones.',
    featureTitle: 'Seguimiento aproximado por párrafos',
    featureDescription: 'Durante la reproducción se destaca el párrafo correspondiente del artículo.',
    coverMessage: 'La narración acompaña el cuerpo del artículo con seguimiento aproximado por párrafos.',
  },
  readingEntry: {
    author: readingDocument.author,
    title: readingDocument.title + '. ' + readingDocument.subtitle,
    audioMinutes: Math.round(readingDocument.duration / 60),
    synopsis: 'Feiguin y Aisenstein estudian cómo el Instituto Nacional de Educación Física General Belgrano formó profesores para todo el país. A través de normas y testimonios de egresados, reconstruyen el ingreso, la vida en el internado y sus rituales para explicar cómo convivieron la renovación pedagógica y la disciplina en un modelo de docencia.',
  },
  pageMeta: 'María Andrea Feiguin y Ángela Aisenstein · Pedagogía y Saberes · 2016',
  footerLabel: 'Texto académico · audiolibro · cuaderno de lectura',
  downloadTextName: 'feiguin-aisenstein-texto-academico.txt',
  storage: {
    notesKey: workId + '-reader-notes-v1',
    stateKey: workId + '-reader-state-v1',
  },
  export: {
    textFileName: 'cuaderno-feiguin-aisenstein.txt',
    jsonFileName: 'cuaderno-feiguin-aisenstein.json',
    shareTitle: 'Cuaderno de lectura · Diseño de sujetos morales, sanos y patriotas',
  },
};

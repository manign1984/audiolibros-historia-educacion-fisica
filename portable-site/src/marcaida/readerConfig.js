import { marcaidaParagraphTimings } from './paragraphSync.js';

export const marcaidaReaderConfig = {
  workId: 'marcaida-scaltritti-estado-nacional',
  mark: 'M·S',
  shortTitle: 'La construcción del Estado nacional',
  authorAndTitle: 'Elena Marcaida y Mabel Scaltritti · La construcción del Estado nacional argentino (1852–1880)',
  experienceName: 'La construcción del Estado nacional argentino',
  audiobookUrl: '/assets/marcaida-audiolibro.mp3',
  audiobookExternalUrl: 'https://drive.google.com/file/d/1OdJmzsqdlV-xaPx7uyYaej8PJBL6QZ9s/view',
  pdfUrl: '/assets/marcaida-scaltritti-estado-nacional.pdf',
  readingEntry: {
    author: 'Elena Marcaida / Mabel Scaltritti',
    title: 'La construcción del Estado nacional argentino (1852–1880)',
    audioMinutes: 34,
    synopsis: '¿Cómo se construye una autoridad nacional? Marcaida y Scaltritti recorren los conflictos, las alianzas y las transformaciones económicas que hicieron posible la formación del Estado argentino. La lectura invita a relacionar instituciones, coerción y consenso, y a interrogar el papel estatal en la organización de la sociedad y la educación.',
  },
  storage: {
    notesKey: 'marcaida-scaltritti-reader-notes-v1',
    stateKey: 'marcaida-scaltritti-reader-state-v1',
  },
  export: {
    jsonFileName: 'notas-marcaida-scaltritti.json',
    textFileName: 'cuaderno-marcaida-scaltritti.txt',
    shareTitle: 'Cuaderno de lectura · Marcaida y Scaltritti',
  },
  sync: {
    status: 'paragraph-preview',
    unit: 'paragraph',
    paragraphTimings: marcaidaParagraphTimings,
    coverMessage: 'El seguimiento acompaña la lectura por párrafos. Podés volver a escuchar desde el comienzo de cada párrafo.',
    launcherTitle: 'Leé, escuchá y anotá',
    launcherDescription: 'Seguí el texto por párrafos, retomá la escucha y guardá tus anotaciones.',
    featureTitle: 'Párrafo activo',
    featureDescription: 'Lectura acompañada por el audio y anotaciones vinculadas a párrafos completos.',
  },
};

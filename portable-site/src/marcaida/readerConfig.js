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
    status: 'pending',
    coverMessage: 'Edición en revisión: podés leer, escuchar y anotar. El audio y el texto se recorren por separado; la sincronización con la voz todavía no está verificada.',
    launcherTitle: 'Leé, escuchá y anotá',
    launcherDescription: 'Lectura, audio y cuaderno propio. La sincronización por oración permanece en revisión.',
    featureTitle: 'Lectura y anotaciones',
    featureDescription: 'Elegí un pasaje y escribí una nota; el audio conserva sus controles independientes.',
  },
};

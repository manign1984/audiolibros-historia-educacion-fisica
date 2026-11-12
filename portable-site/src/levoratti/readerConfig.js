// Datos propios de Levoratti. No personalizan la geometría del bloque 04 ni el lector.
const assetBase = [import.meta.env.BASE_URL.replace(/\/$/, ''), 'assets', 'levoratti-gimnasia-1958-1968'].join('/') + '/';
export const LEVORATTI_AUDIO_BYTES = 22197397;
export const LEVORATTI_AUDIO_PARTS = 17;

export const levorattiReaderConfig = {
  workId: 'levoratti-gimnasia-1958-1968',
  textOnly: false,
  mark: 'AL',
  shortTitle: 'Educación Física y gimnasia (1958–1968)',
  authorAndTitle: 'Alejo Levoratti · La educación física y la gimnasia',
  experienceName: 'La educación física y la gimnasia en la educación primaria y el nivel medio',
  editorialReferenceLabel: 'del artículo de Alejo Levoratti',
  audiobookExternalUrl: 'https://drive.google.com/file/d/1-DNXydWy3mr6aitsR6wOC6I5Kr-BT3jQ/view',
  audiobookParts: Array.from({ length: LEVORATTI_AUDIO_PARTS }, (_, index) =>
    assetBase + 'audio/audio-' + String(index).padStart(2, '0') + '.part'),
  expectedAudioBytes: LEVORATTI_AUDIO_BYTES,
  textUrl: assetBase + 'texto-academico.txt',
  sourceUrl: 'https://www.memoria.fahce.unlp.edu.ar/art_revistas/pr.15959/pr.15959.pdf',
  sync: {
    status: 'paragraph-preview',
    unit: 'paragraph',
    launcherTitle: 'Lectura y audio',
    launcherDescription: 'Leé, escuchá y reuní tus anotaciones en un mismo espacio.',
    featureTitle: 'Lectura con seguimiento aproximado',
    featureDescription: 'El párrafo correspondiente se destaca mientras se escucha la narración.',
    coverMessage: 'El seguimiento aproximado se basa en marcas temporales de la narración. Los resúmenes, notas y referencias conservan la lectura textual.',
  },
  readingEntry: {
    author: 'Alejo Levoratti',
    title: 'La educación física y la gimnasia en la educación primaria y el nivel medio. Un estudio sobre las perspectivas teóricas en circulación (Argentina, 1958–1968)',
    audioMinutes: 37,
    synopsis: "Alejo Levoratti analiza cómo se definió la Educación Física escolar argentina entre 1958 y 1968 a partir de dos documentos curriculares: el programa de enseñanza media de 1961 y el plan para la escuela primaria de 1968. Su comparación permite reconocer disputas entre tradiciones gimnásticas, pedagogías activas, psicología del desarrollo y movimiento.",
  },
  sections: [
    { title: 'Introducción', term: 'Introducción' },
    { title: 'La educación física en la escuela media', term: 'La educación física en la escuela media' },
    { title: 'Plan de Educación Física Infantil', term: 'Plan de Educación Física Infantil' },
    { title: 'Conclusión', term: 'Conclusión' },
    { title: 'Referencias', term: 'Referencias' },
  ],
  pageMeta: 'Alejo Levoratti · Revista da ALESDE, 14(2), 162–178 (2022)',
  footerLabel: 'Texto académico · audiolibro · cuaderno de lectura',
  downloadTextName: 'levoratti-texto-academico.txt',
  storage: {
    notesKey: 'levoratti-gimnasia-1958-1968-audio-notes-v1',
    stateKey: 'levoratti-gimnasia-1958-1968-audio-state-v1',
  },
  export: {
    textFileName: 'cuaderno-levoratti-gimnasia-1958-1968.txt',
    jsonFileName: 'cuaderno-levoratti-gimnasia-1958-1968.json',
    shareTitle: 'Cuaderno de lectura · Levoratti',
  },
};

// Claves originales de TextOnlyReader, conservadas sin sobrescribir.
export const levorattiLegacyStorage = {
  notesKey: 'levoratti-gimnasia-1958-1968-notes-v1',
  stateKey: 'levoratti-gimnasia-1958-1968-page-v1',
};

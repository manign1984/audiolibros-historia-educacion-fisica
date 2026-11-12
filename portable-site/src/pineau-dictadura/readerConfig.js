// Datos propios de Pineau (1976–1983). Sin modificar el lector compartido.
const assetBase = import.meta.env.BASE_URL + 'assets/pineau-reprimir-discriminar/';
export const pineauDictaduraReaderConfig = {
  workId: 'pineau-reprimir-discriminar',
  textOnly: false,
  mark: 'PP',
  shortTitle: 'Reprimir y discriminar (1976–1983)',
  authorAndTitle: 'Pablo Pineau · Reprimir y discriminar',
  experienceName: 'La educación en la última dictadura cívico-militar argentina (1976–1983)',
  editorialReferenceLabel: 'del artículo de Pablo Pineau (2014)',
  audiobookExternalUrl: 'https://drive.google.com/file/d/18QKaPPT2BpxX97KU4RbQK2m8_z1JI5Fi/view',
  audiobookParts: Array.from({ length: 12 }, (_, i) =>
    assetBase + 'audio/audio-' + String(i).padStart(2, '0') + '.part'),
  expectedAudioBytes: 30272629,
  textUrl: assetBase + 'texto-academico.txt',
  sourceUrl: 'https://drive.google.com/file/d/1vPYdIzNLMJNFLsZoK9z3EQED4mgGCdEt/view',
  sync: {
    status: 'paragraph-preview',
    unit: 'paragraph',
    launcherTitle: 'Lectura y audio',
    launcherDescription: 'Leé, escuchá y reuní tus anotaciones en un mismo espacio.',
    featureTitle: 'Lectura con seguimiento aproximado',
    featureDescription: 'El párrafo del artículo se destaca durante la narración.',
    coverMessage: 'El seguimiento es orientativo por párrafos, a partir de las marcas temporales de la narración.',
  },
  readingEntry: {
    author: 'Pablo Pineau',
    title: 'Reprimir y discriminar. La educación en la última dictadura cívico-militar en Argentina (1976–1983)',
    audioMinutes: 50,
    synopsis: 'Pablo Pineau analiza las políticas educativas de la última dictadura cívico-militar argentina a partir de dos estrategias complementarias: reprimir las experiencias de renovación pedagógica y discriminar mediante circuitos escolares desiguales. Su recorrido por censura, disciplinamiento, transferencias y segmentación permite interrogar las relaciones entre educación, autoritarismo y desigualdad social.',
  },
  sections: [
    { title: 'Introducción', term: 'Introducción' },
    { title: 'La estrategia represiva', term: 'La estrategia represiva' },
    { title: 'La estrategia discriminadora', term: 'La estrategia discriminadora' },
    { title: 'Conclusiones', term: 'Conclusiones' },
  ],
  pageMeta: 'Pablo Pineau · Educar em Revista, 51, 103–122 (2014)',
  footerLabel: 'Texto académico · audiolibro · cuaderno de lectura',
  downloadTextName: 'pineau-reprimir-discriminar-texto-academico.txt',
  storage: {
    notesKey: 'pineau-reprimir-discriminar-notes-v1',
    stateKey: 'pineau-reprimir-discriminar-audio-state-v1',
  },
  export: {
    textFileName: 'cuaderno-pineau-reprimir-discriminar.txt',
    jsonFileName: 'cuaderno-pineau-reprimir-discriminar.json',
    shareTitle: 'Cuaderno de lectura · Pablo Pineau · 1976–1983',
  },
};

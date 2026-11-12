import prepared from './readingDocument.generated.json';

export const { document: readingDocument, legacyPageMap } = prepared;

const base = import.meta.env.BASE_URL;
const audioParts = Array.from({ length: 17 }, (_, index) => {
  const filename = 'audio-' + String(index).padStart(2, '0') + '.part';
  return base + ['assets', 'thwaites-rey', 'audio', filename].join('/');
});

export const readerConfig = {
  workId: 'thwaites-rey-democracia-argentina',
  mark: 'TR',
  shortTitle: 'La democracia argentina',
  authorAndTitle: 'Mabel Thwaites Rey · La democracia argentina',
  experienceName: 'La democracia argentina',
  editorialReferenceLabel: 'del artículo de Mabel Thwaites Rey',
  audiobookExternalUrl: 'https://drive.google.com/file/d/1dvnG5HsLSYHnsXGKDN4JcY9ycRLddHsV/view',
  audiobookParts: audioParts,
  expectedAudioBytes: 16255595,
  sync: {
    status: 'paragraph-preview',
    unit: 'paragraph',
    paragraphTimings: prepared.paragraphTimings,
    coverMessage: 'La lectura sonora acompaña el texto académico con seguimiento aproximado por párrafos.',
  },
  textUrl: import.meta.env.BASE_URL + 'assets/thwaites-rey/texto-academico.txt',
  sourceUrl: 'https://www.economicas.uba.ar/extension/vocesenelfenix/la-democracia-argentina-bajo-el-largo-ciclo-de-hegemonia-neoliberal-1983-2013/',
  readingEntry: {
    author: 'Mabel Thwaites Rey',
    audioMinutes: 27,
    title: 'La democracia argentina bajo el largo ciclo de hegemonía neoliberal (1983–2013)',
    synopsis: 'El artículo examina cómo se afianzaron las instituciones democráticas argentinas en un período de expansión global del neoliberalismo. Thwaites Rey reconstruye los cambios en la intervención estatal desde 1983 y pregunta qué condiciones permiten a la democracia ampliar la participación y reducir la desigualdad.',
  },
  pageMeta: 'Mabel Thwaites Rey · Voces en el Fénix, 2013',
  footerLabel: 'Texto de cátedra · Audiolibro · Cuaderno de lectura',
  downloadTextName: 'thwaites-rey-democracia-argentina.txt',
  storage: {
    stateKey: 'thwaites-rey-democracia-argentina-reader-state-v1',
    notesKey: 'thwaites-rey-democracia-argentina-reader-notes-v1',
  },
  export: {
    textFileName: 'cuaderno-thwaites-rey.txt',
    jsonFileName: 'cuaderno-thwaites-rey.json',
    shareTitle: 'Cuaderno de lectura · Mabel Thwaites Rey',
  },
};

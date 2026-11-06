export const soaresPrivateAsset = name => `${(import.meta.env?.BASE_URL || '/')}${['assets', 'soares-private', name].join('/')}`;
export const soaresReaderConfig = {
  workId: 'soares-corrientes-gimnasticas', mark: 'CS',
  shortTitle: 'Las corrientes gimnásticas europeas',
  authorAndTitle: 'Carmen Lucia Soares · Las corrientes gimnásticas europeas y su contenido',
  experienceName: 'El gesto entre la norma y la expresión',
  audiobookUrl: soaresPrivateAsset('audiobook.mp3'),
  pdfUrl: soaresPrivateAsset('chapter.pdf'),
  editorialReferenceLabel: 'de la edición de Soares', modalAccessibility: true,
  readingEntry: {
    author: 'Carmen Lucia Soares', title: 'Las corrientes gimnásticas europeas y su contenido: una historia de rupturas y permanencias', audioMinutes: 52,
    synopsis: '¿Cómo se transformaron los movimientos corporales en objetos de conocimiento y educación? Soares recorre la constitución de las corrientes gimnásticas europeas, sus fundamentos científicos y sus tensiones internas. La lectura invita a reconocer rupturas, permanencias y alternativas, y a preguntar qué saberes orientan hoy la formación docente y la Educación Física escolar.',
  },
  storage: { notesKey: 'soares-corrientes-gimnasticas-reader-notes-v1', stateKey: 'soares-corrientes-gimnasticas-reader-state-v1' },
  export: { jsonFileName: 'notas-soares-corrientes-gimnasticas.json', textFileName: 'cuaderno-soares-corrientes-gimnasticas.txt', shareTitle: 'Cuaderno de lectura · Soares' },
  sync: {
    unit: 'sentence', status: 'pending', launcherTitle: 'Escuchá, leé y anotá',
    launcherDescription: 'Capítulo académico con notas y bibliografía. El audio narra el cuerpo del texto y abrevia referencias.',
    featureTitle: 'Lectura y cuaderno', featureDescription: 'Anotaciones por oración. Seguimiento automático no disponible.',
    coverMessage: 'El audio narra el cuerpo y abrevia referencias. Las notas y la bibliografía no se narran. Seguimiento automático por oración no disponible.',
  },
};

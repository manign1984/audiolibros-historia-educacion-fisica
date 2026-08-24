export const pineauReaderConfig = {
  workId: 'pineau-fresco-noble',
  mark: 'FN',
  shortTitle: 'Renovación, represión, cooptación',
  authorAndTitle: 'Pablo Pineau · Renovación, represión, cooptación',
  experienceName: 'Reforma Fresco–Noble',
  audiobookUrl: '/assets/pineau-audiolibro.mp3',
  audiobookExternalUrl: 'https://drive.google.com/file/d/17w1Pw25aGLXu_cR9mRBZgIOnCG2qNAEm/view',
  pdfUrl: '/assets/pineau-renovacion-represion-cooptacion.pdf',
  storage: {
    notesKey: 'fresco-noble-reader-notes-v1',
    stateKey: 'fresco-noble-reader-state-v1',
  },
  export: {
    jsonFileName: 'notas-fresco-noble.json',
    textFileName: 'cuaderno-lectura-fresco-noble.txt',
    shareTitle: 'Cuaderno de lectura · Fresco–Noble',
  },
  sync: {
    status: 'ready',
    launcherTitle: 'Leé, escuchá y anotá sin salir del recorrido',
    launcherDescription: 'El texto sigue el audiolibro oración por oración. Podés detenerte, dejar una nota y volver a escuchar exactamente desde ese lugar.',
    featureTitle: 'Oración activa',
    featureDescription: 'El resaltado acompaña la voz sin convertir la lectura en un karaoke.',
    coverMessage: 'El resaltado acompaña la oración que se está escuchando.',
  },
};

export const orbuchReaderConfig = {
  workId: 'orbuch-educar-al-cuerpo',
  mark: 'IO',
  shortTitle: 'Educar al cuerpo dentro y fuera del aula',
  authorAndTitle: 'Iván Pablo Orbuch · Educar al cuerpo dentro y fuera del aula',
  experienceName: 'Educar al cuerpo dentro y fuera del aula',
  audiobookUrl: '/assets/orbuch-audiolibro.mp3',
  audiobookExternalUrl: 'https://drive.google.com/file/d/19Hta6B0rct64BFT0dscs6fNL1215gFQ7/view',
  pdfUrl: '/assets/orbuch-educar-al-cuerpo.pdf',
  storage: {
    notesKey: 'orbuch-educar-cuerpo-reader-notes-v1',
    stateKey: 'orbuch-educar-cuerpo-reader-state-v1',
  },
  export: {
    jsonFileName: 'notas-orbuch-educar-al-cuerpo.json',
    textFileName: 'cuaderno-lectura-orbuch-educar-al-cuerpo.txt',
    shareTitle: 'Cuaderno de lectura · Iván Orbuch',
  },
  sync: {
    status: 'pending',
    launcherTitle: 'Leé, escuchá y anotá en un mismo espacio',
    launcherDescription: 'El texto accesible y el audiolibro están completos. La sincronización oración por oración queda pendiente hasta disponer de tiempos reales.',
    featureTitle: 'Texto y audio completos',
    featureDescription: 'La escucha y la lectura conviven sin marcas de tiempo inventadas.',
    coverMessage: 'Sincronización fina pendiente: el texto no se resalta automáticamente hasta contar con tiempos reales.',
  },
};

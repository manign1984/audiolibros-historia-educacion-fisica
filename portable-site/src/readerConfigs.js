export const pineauReaderConfig = {
  workId: 'pineau-fresco-noble',
  readingEntry: {
    "author": "Pablo Pineau",
    "title": "Renovación, represión, cooptación",
    "audioMinutes": 50,
    "synopsis": "Una escuela cuestionada y un gobierno conservador que promete renovarla. Pineau reconstruye la reforma Fresco–Noble a través de tres estrategias: renovar, reprimir y cooptar. Una trama de prácticas, apoyos y silencios que invita a descubrir cómo se disputó el sentido de la escuela y qué huellas dejó en nuestra educación."
  },
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
  readingEntry: {
    "author": "Iván Pablo Orbuch",
    "title": "Educar al cuerpo dentro y fuera del aula",
    "audioMinutes": 28,
    "textUrl": "/assets/orbuch-texto-accesible.txt",
    "synopsis": "La educación corporal desborda el aula y llega a las oficinas. Orbuch sigue dos experiencias del primer peronismo para reconstruir la distancia entre los proyectos del Estado y su puesta en práctica. Documentos, propuestas y tensiones revelan cómo se intentó transformar la vida cotidiana a través del movimiento.",
    "srtUrl": "/assets/orbuch-subtitulos.srt"
  },
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
    status: 'ready',
    launcherTitle: 'Leé, escuchá y anotá sin salir del recorrido',
    launcherDescription: 'El texto acompaña el audiolibro oración por oración. Podés detenerte, dejar una nota y volver a escuchar desde ese pasaje.',
    featureTitle: 'Oración activa',
    featureDescription: 'El resaltado y el desplazamiento acompañan el momento real del audio.',
    coverMessage: 'El resaltado acompaña la oración que se está escuchando.',
  },
};

export const hobsbawmReaderConfig = {
  workId: 'hobsbawm-historia-siglo-xx',
  readingEntry: {
    "author": "Eric Hobsbawm",
    "title": "Vista panorámica del siglo XX",
    "audioMinutes": 49,
    "textUrl": "/assets/hobsbawm-texto-accesible.txt",
    "synopsis": "Guerras y revoluciones, prosperidad y catástrofes: el siglo XX transformó la vida como nunca antes. Hobsbawm cruza las voces de quienes lo vivieron con la mirada del historiador para reconstruir ese mundo y descubrir cuánto de aquel pasado sigue latiendo en nuestro presente.",
    "notice": "El audio omite seis pasajes: están conservados y señalados en el lector."
  },
  mark: 'XX',
  shortTitle: 'Historia del siglo XX',
  authorAndTitle: 'Eric Hobsbawm · Vista panorámica del siglo XX',
  experienceName: 'Historia del siglo XX',
  audiobookUrl: '/assets/hobsbawm-audiolibro.mp3',
  audiobookExternalUrl: 'https://drive.google.com/file/d/1-6LoX2kQ48lU-api_8N4PzsV2Ueycb41/view?usp=drivesdk',
  pdfUrl: '/assets/hobsbawm-vista-panoramica.pdf',
  storage: {
    notesKey: 'hobsbawm-siglo-xx-reader-notes-v1',
    stateKey: 'hobsbawm-siglo-xx-reader-state-v1',
  },
  export: {
    jsonFileName: 'notas-hobsbawm-siglo-xx.json',
    textFileName: 'cuaderno-hobsbawm-siglo-xx.txt',
    shareTitle: 'Cuaderno de lectura · Eric Hobsbawm',
  },
  sync: {
    status: 'ready',
    launcherTitle: 'Leé, escuchá y construí tu cuaderno',
    launcherDescription: 'El texto acompaña el audio oración por oración. Podés elegir capítulos, escuchar desde un pasaje y construir tu cuaderno de lectura.',
    featureTitle: 'Oración activa',
    featureDescription: 'El resaltado sigue los pasajes presentes en la grabación.',
    coverMessage: 'El resaltado sigue la voz. El subrayado punteado señala los fragmentos sin audio.',
  },
};

// Configuración del lector de prueba: NO incluye materiales de la obra.
export const ARATA_AUDIO_BYTES = 36125008;
export const ARATA_AUDIO_PARTS = 17;
export function createArataMarinoReaderConfig(assetBase) {
  if (typeof assetBase !== 'string' || !assetBase.endsWith('/')) {
    throw Error('La ruta local de recursos debe terminar con /.');
  }
  return {
    workId: 'arata-marino-auroras-tempestades', textOnly: false,
    mark: 'AM', shortTitle: 'Auroras y tempestades',
    authorAndTitle: 'Nicolás Arata y Marcelo Mariño · Auroras y tempestades',
    experienceName: 'Auroras y tempestades: la educación entre golpes (1955–1976)',
    editorialReferenceLabel: 'de la lección 10 de Arata y Mariño',
    audiobookParts: Array.from({ length: ARATA_AUDIO_PARTS }, (_, index) =>
      assetBase + 'audio/audio-' + String(index).padStart(2, '0') + '.part'),
    expectedAudioBytes: ARATA_AUDIO_BYTES,
    sync: { status: 'paragraph-preview', unit: 'paragraph',
      launcherTitle: 'Lectura y audio',
      launcherDescription: 'Seguimiento aproximado por párrafos y cuaderno de estudio.',
      featureTitle: 'Lectura con seguimiento aproximado',
      featureDescription: 'El texto se resalta mediante las marcas temporales del SRT original.',
      coverMessage: 'El cuadro estadístico y las referencias permanecen disponibles, sin tiempos inventados.' },
    textUrl: assetBase + 'edicion-academica.txt',
    sourceUrl: 'https://digital.noveduc.com/library/publication/la-educacion-en-la-argentina',
    readingEntry: {
      author: 'Nicolás Arata y Marcelo Mariño', audioMinutes: 60,
      title: 'Auroras y tempestades: la educación entre golpes (1955–1976)',
      synopsis: 'Entre 1955 y 1976, la escuela argentina fue escenario de cambios, proyectos de modernización y disputas políticas. Nicolás Arata y Marcelo Mariño examinan el desarrollismo, la expansión educativa, las experiencias pedagógicas alternativas y los proyectos de liberación, hasta el giro represivo que anticipó el golpe de Estado de 1976.',
    },
    pageMeta: 'Arata y Mariño · Lección 10 · Ediciones Novedades Educativas',
    footerLabel: 'Texto académico · audiolibro · cuaderno de lectura',
    export: { shareTitle: 'Cuaderno de lectura · Arata y Mariño',
      textFileName: 'cuaderno-arata-marino.txt',
      jsonFileName: 'cuaderno-arata-marino.json' },
    downloadTextName: 'arata-marino-leccion-10-texto-academico.txt',
    storage: { stateKey: 'arata-marino-audio-state-v1', notesKey: 'arata-marino-audio-notes-v1' },
  };
}

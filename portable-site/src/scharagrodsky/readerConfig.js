export const scharagrodskyReaderConfig = {
  workId: 'scharagrodsky-constitucion-ef',
  mark: 'PS',
  shortTitle: 'La constitución de la Educación Física escolar',
  authorAndTitle: 'Pablo Ariel Scharagrodsky · La constitución de la educación física escolar en la Argentina',
  experienceName: 'Educación Física escolar y matriz militar',
  audiobookExternalUrl: 'https://drive.google.com/file/d/10Nn5BwCtK86uKCaummpvHjGcpXcbMh3r/view',
  // Se conectarán las partes exactas del MP3 cuando el commit de activos esté completo.
  audiobookParts: Array.from({length:31}, (_,i) => '/assets/scharagrodsky-audio-' + String(i+1).padStart(3,'0') + '.part'),
  pdfUrl: 'https://drive.google.com/file/d/1Jzlx94xUbOB0G06jOCwxouMfRYzfs3zo/view',
  readingEntry: {
    author:'Pablo Ariel Scharagrodsky',
    title:'La constitución de la educación física escolar en la Argentina',
    audioMinutes:51,
    synopsis:'A comienzos del siglo XX, distintas concepciones disputaron la enseñanza de los cuerpos en las escuelas argentinas. Scharagrodsky reconstruye los enfrentamientos entre el Sistema Argentino de Educación Física y la matriz militar. Un recorrido por saberes médicos, instituciones, modelos de ciudadanía y decisiones políticas que transformaron la asignatura.',
    notice:'La alineación por oración se encuentra en revisión editorial.',
  },
  storage: {
    notesKey:'scharagrodsky-constitucion-ef-reader-notes-v1',
    stateKey:'scharagrodsky-constitucion-ef-reader-state-v1',
  },
  export: {
    jsonFileName:'notas-scharagrodsky.json',
    textFileName:'cuaderno-scharagrodsky.txt',
    shareTitle:'Cuaderno de lectura · Scharagrodsky',
  },
  sync: {
    status:'review',
    launcherTitle:'Escuchá, leé y anotá',
    launcherDescription:'Lectura y anotaciones integradas. El resaltado temporal se habilitará tras la comprobación final de los subtítulos.',
    featureTitle:'Pasajes del texto',
    featureDescription:'Las anotaciones se vinculan a las oraciones; no se atribuyen tiempos de audio sin verificación.',
    coverMessage:'Sin resaltado por oración hasta completar el cotejo de audio y texto.',
  },
};

export const melanoReaderConfig = {
  workId: 'melano-militares-juramentados',
  textOnly: true,
  textUrl: import.meta.env.BASE_URL + 'assets/melano/texto-academico.txt',
  sourceUrl: 'https://drive.google.com/file/d/11kPIjFdMMIAwgfiukL0VenWDqloa10oB/view',
  readingEntry: {
    author: 'Ignacio Melano',
    title: 'Militares al gobierno, juramentados al poder: la reapertura del INEF Gral. Belgrano en la década del 70',
    synopsis: 'En 1977, durante la última dictadura, la formación de profesores regresó al predio del INEF General Belgrano en San Fernando. ¿Cómo se hizo posible? Ignacio Melano analiza las trayectorias de los Juramentados, sus relaciones con organismos militares y estatales y las disputas del campo de la Educación Física que dieron sentido a aquella reapertura.',
  },
  pageMeta: 'Ignacio Melano · Capítulo 6 · EdUNLu',
  export: {
    shareTitle: 'Cuaderno de lectura · Ignacio Melano',
    textFileName: 'cuaderno-ignacio-melano.txt',
  },
  downloadTextName: 'melano-capitulo-6-texto-academico.txt',
  sections: [
    { title: 'Apertura · Cultura escolar y formación', term: 'Más allá de los cambios producidos' },
    { title: 'La creación del INEF', term: 'La creación del INEF' },
    { title: 'El traslado', term: 'El traslado' },
    { title: 'Juramentados y redes de poder', term: 'Juramentados, actores y constelaciones de poder.' },
    { title: 'Militares al gobierno', term: 'Militares al gobierno, Juramentados al poder.' },
    { title: 'La reapertura', term: 'La reapertura' },
    { title: 'Conclusiones', term: 'Conclusiones' },
    { title: 'Notas del capítulo', term: 'Notas al pie de la edición original' },
  ],
  storage: {
    stateKey: 'melano-juramentados-text-page-v1',
    notesKey: 'melano-juramentados-text-notes-v1',
  },
};

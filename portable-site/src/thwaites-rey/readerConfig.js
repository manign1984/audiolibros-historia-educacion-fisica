export const readerConfig = {
  workId: 'thwaites-rey-democracia-argentina',
  textOnly: true,
  textUrl: import.meta.env.BASE_URL + 'assets/thwaites-rey/texto-academico.txt',
  sourceUrl: 'https://www.economicas.uba.ar/extension/vocesenelfenix/la-democracia-argentina-bajo-el-largo-ciclo-de-hegemonia-neoliberal-1983-2013/',
  readingEntry: {
    author: 'Mabel Thwaites Rey',
    title: 'La democracia argentina bajo el largo ciclo de hegemonía neoliberal (1983–2013)',
    synopsis: 'El artículo examina cómo se afianzaron las instituciones democráticas argentinas en un período de expansión global del neoliberalismo. Thwaites Rey reconstruye los cambios en la intervención estatal desde 1983 y pregunta qué condiciones permiten a la democracia ampliar la participación y reducir la desigualdad.',
  },
  sections: [
    { title: 'Apertura', term: 'Los 30 años de continuidad' },
    { title: 'El regreso de la democracia y la expansión neoliberal', term: 'El regreso de la democracia y la expansión neoliberal' },
    { title: 'La democracia en el nuevo siglo', term: 'La democracia en el nuevo siglo' },
    { title: 'Presente y futuro de la democracia', term: 'Presente y futuro de la democracia' },
  ],
  pageMeta: 'Mabel Thwaites Rey · Voces en el Fénix, 2013',
  footerLabel: 'Texto de cátedra · Biblioteca Digital +TEC UNAHUR',
  downloadTextName: 'thwaites-rey-democracia-argentina.txt',
  storage: {
    stateKey: 'thwaites-rey-democracia-argentina-text-page-v1',
    notesKey: 'thwaites-rey-democracia-argentina-text-notes-v1',
  },
  export: {
    textFileName: 'cuaderno-thwaites-rey.txt',
    shareTitle: 'Cuaderno de lectura · Mabel Thwaites Rey',
  },
};

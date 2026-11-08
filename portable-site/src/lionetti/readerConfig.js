export const lionettiReaderConfig = {
  workId: 'lionetti-escuela-republicana',
  textOnly: true,
  textUrl: `${import.meta.env.BASE_URL}assets/lionetti/texto-academico.txt`,
  sourceUrl: 'https://ojs.rmie.mx/index.php/rmie/article/view/1511',
  readingEntry: {
    author: 'Lucía Lionetti',
    title: 'La función republicana de la escuela pública: la formación del ciudadano en Argentina a fines del siglo XIX',
    synopsis: '¿Para qué se organizó la escuela común en la Argentina de fines del siglo XIX? Lionetti investiga cómo los discursos escolares procuraron formar ciudadanos, transmitir valores patrióticos y modelar conductas. El artículo permite reconocer las tensiones entre integración, disciplina, género y promesas de igualdad en la construcción de la ciudadanía.',
  },
  storage: {
    stateKey: 'lionetti-escuela-republicana-text-page-v1',
    notesKey: 'lionetti-escuela-republicana-text-notes-v1',
  },
};

export const levorattiReaderConfig = {
  workId: 'levoratti-gimnasia-1958-1968',
  textOnly: true,
  textUrl: import.meta.env.BASE_URL + 'assets/levoratti-gimnasia-1958-1968/texto-academico.txt',
  sourceUrl: 'https://www.memoria.fahce.unlp.edu.ar/art_revistas/pr.15959/pr.15959.pdf',
  readingEntry: {
    author: 'Alejo Levoratti',
    title: 'La educación física y la gimnasia en la educación primaria y el nivel medio. Un estudio sobre las perspectivas teóricas en circulación (Argentina, 1958–1968)',
    synopsis: "Alejo Levoratti analiza cómo se definió la Educación Física escolar argentina entre 1958 y 1968 a partir de dos documentos curriculares: el programa de enseñanza media de 1961 y el plan para la escuela primaria de 1968. Su comparación permite reconocer disputas entre tradiciones gimnásticas, pedagogías activas, psicología del desarrollo y movimiento.",
  },
  sections: [
    { title: 'Introducción', term: 'Introducción' },
    { title: 'La educación física en la escuela media', term: 'La educación física en la escuela media' },
    { title: 'Plan de Educación Física Infantil', term: 'Plan de Educación Física Infantil' },
    { title: 'Conclusión', term: 'Conclusión' },
    { title: 'Referencias', term: 'Referencias' },
  ],
  storage: {
    notesKey: 'levoratti-gimnasia-1958-1968-notes-v1',
    stateKey: 'levoratti-gimnasia-1958-1968-page-v1',
  },
  export: {
    textFileName: 'cuaderno-levoratti-gimnasia-1958-1968.txt',
    shareTitle: 'Cuaderno de lectura · Levoratti',
  },
};

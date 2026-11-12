export const workId = 'levoratti-debates-ef';
export const title = 'Los debates de la educación física y los enfoques de las ciencias sociales';
export const subtitle = 'Un análisis de los lineamientos curriculares nacionales destinados a la formación docente en Argentina (1993–2015)';

export const readerConfig = {
  workId,
  textOnly: true,
  textUrl: import.meta.env.BASE_URL + 'assets/levoratti-debates-ef/texto-academico.txt',
  sourceUrl: 'https://doi.org/10.5380/jlasss.v9i1.61189',
  readingEntry: {
    author: 'Alejo Levoratti',
    title: `${title}. ${subtitle}`,
    synopsis: 'A partir de documentos curriculares nacionales y entrevistas, Levoratti examina cómo los actores de la formación docente recurrieron a las ciencias sociales, humanas y de la educación para disputar qué debía enseñar la Educación Física y cómo concebir el cuerpo y el movimiento.',
  },
  sections: [
    {
      "title": "Introducción",
      "term": "Introducción"
    },
    {
      "title": "La sociología de la crítica",
      "term": "La sociología de la crítica"
    },
    {
      "title": "Las principales orientaciones conceptuales que organizaron la formación de los profesores de educación física en la Argentina",
      "term": "Las principales orientaciones conceptuales que organizaron la formación de los profesores de educación física en la Argentina"
    },
    {
      "title": "Las concepciones sobre la educación física en los debates curriculares realizados en el período 1993-2015",
      "term": "Las concepciones sobre la educación física en los debates curriculares realizados en el período 1993-2015"
    },
    {
      "title": "La Educación Física en los Contenidos Básicos Comunes para la formación docente",
      "term": "La Educación Física en los Contenidos Básicos Comunes para la formación docente"
    },
    {
      "title": "Las recomendaciones para la elaboración de diseños curriculares \"Profesorados de Educación Física\" 2009",
      "term": "Las recomendaciones para la elaboración de diseños curriculares \"Profesorados de Educación Física\" 2009"
    },
    {
      "title": "Conclusión",
      "term": "Conclusión"
    }
  ],
  pageMeta: 'Alejo Levoratti · Revista da ALESDE, 2018',
  footerLabel: 'Texto de cátedra · Biblioteca Digital +TEC UNAHUR',
  downloadTextName: 'levoratti-debates-ef.txt',
  storage: {
    stateKey: 'levoratti-debates-ef-text-page-v1',
    notesKey: 'levoratti-debates-ef-text-notes-v1',
  },
  export: {
    textFileName: 'cuaderno-levoratti-debates-ef.txt',
    shareTitle: 'Cuaderno de lectura · Los debates de la educación física',
  },
};

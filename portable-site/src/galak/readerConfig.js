export const workId = 'galak-del-dicho-al-hecho';
export const title = 'Del dicho al hecho';
export const subtitle = 'El largo trecho del nacimiento de la formación profesional en Educación Física en Argentina (1897–1909)';

export const readerConfig = {
  workId,
  textOnly: true,
  textUrl: import.meta.env.BASE_URL + 'assets/galak-del-dicho-al-hecho/texto-academico.txt',
  sourceUrl: 'https://eduardogalak.wordpress.com/wp-content/uploads/2012/10/del-dicho-al-hecho-galak-2012-ponencia-bariloche.pdf',
  readingEntry: {
    author: 'Eduardo Galak',
    title: `${title}. ${subtitle}`,
    synopsis: 'A partir de cartas, decretos y debates de la época, Galak reconstruye las disputas entre la formación militar y la formación civil por definir quiénes podían enseñar Educación Física en las escuelas argentinas, qué saberes legitimaban ese oficio y cómo se organizó la formación profesional.',
  },
  sections: [
    {
      "title": "Resumen",
      "term": "Resumen"
    },
    {
      "title": "1. La \"Escuela de Gimnasia y Esgrima\" del Ejército argentino como primera institucionalización de la formación en educación física",
      "term": "1. La \"Escuela de Gimnasia y Esgrima\" del Ejército argentino como primera institucionalización de la formación en educación física"
    },
    {
      "title": "2. La carta de Pizzurno para configurar el oficio desde el ámbito oficial-civil",
      "term": "2. La carta de Pizzurno para configurar el oficio desde el ámbito oficial-civil"
    },
    {
      "title": "3. Los Cursos temporarios de 1901, el nacimiento de la Educación Física en 1903 y la creación de los \"Cursos Normales\"",
      "term": "3. Los Cursos temporarios de 1901, el nacimiento de la Educación Física en 1903 y la creación de los \"Cursos Normales\""
    },
    {
      "title": "4. El \"Plan de Enseñanza y Educación Física Nacional\", los \"Cursos Normales\" y la apertura del \"Instituto Nacional\"",
      "term": "4. El \"Plan de Enseñanza y Educación Física Nacional\", los \"Cursos Normales\" y la apertura del \"Instituto Nacional\""
    },
    {
      "title": "5. La autorización oficial en 1909 a los egresados de la Escuela para que dicten clases en el Sistema Educativo y la consecuente lucha simbólica",
      "term": "5. La autorización oficial en 1909 a los egresados de la Escuela para que dicten clases en el Sistema Educativo y la consecuente lucha simbólica"
    },
    {
      "title": "Consideraciones transversales",
      "term": "Consideraciones transversales"
    }
  ],
  pageMeta: 'Eduardo Galak · II Congreso Patagónico de Educación Física y Formación Docente, 2012',
  footerLabel: 'Texto de cátedra · Biblioteca Digital +TEC UNAHUR',
  downloadTextName: 'galak-del-dicho-al-hecho.txt',
  storage: {
    stateKey: 'galak-del-dicho-al-hecho-text-page-v1',
    notesKey: 'galak-del-dicho-al-hecho-text-notes-v1',
  },
  export: {
    textFileName: 'cuaderno-galak-del-dicho-al-hecho.txt',
    shareTitle: 'Cuaderno de lectura · Del dicho al hecho',
  },
};

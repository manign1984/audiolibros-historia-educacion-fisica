export const almadaTextConfig = {
  workId: 'almada-privilegiados',
  textOnly: true,
  textUrl: import.meta.env.BASE_URL + 'assets/almada/texto-academico.txt',
  sourceUrl: 'https://doi.org/10.21680/2596-0113.2020v3n0ID21434',
  readingEntry: {
    author: 'Cecilia Almada',
    title: 'Los privilegiados en la Nueva Argentina. La cultura física y el deporte en la política del peronismo',
    synopsis: 'Cecilia Almada estudia cómo el primer peronismo convirtió la cultura física y el deporte en instrumentos de política pública. A partir de documentos y testimonios, examina el papel de la Fundación Eva Perón y muestra cómo los campeonatos infantiles combinaron ampliación de derechos, vigilancia sanitaria y formación ciudadana.',
  },
  sections: [
    { title: 'Resumen', term: 'El presente artículo describe el rol' },
    { title: 'Introducción', term: 'Introducción' },
    { title: 'La política pública peronista sobre cultura física', term: 'El gobierno peronista retoma la perspectiva planteada' },
    { title: 'El rol de la Fundación Eva Perón', term: 'El rol de la Fundación Eva Perón' },
    { title: 'Consideraciones finales', term: 'Consideraciones finales' },
    { title: 'Bibliografía', term: 'Aguirre, Alfredo. (2003)' },
  ],
  storage: {
    notesKey: 'almada-privilegiados-text-notes-v1',
    stateKey: 'almada-privilegiados-text-page-v1',
  },
  export: {
    textFileName: 'cuaderno-almada-privilegiados.txt',
    shareTitle: 'Cuaderno de lectura · Los privilegiados en la Nueva Argentina',
  },
};

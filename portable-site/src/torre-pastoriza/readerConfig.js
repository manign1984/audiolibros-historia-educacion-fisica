const assetBase = [import.meta.env.BASE_URL.replace(/\/$/, ''), 'assets', 'torre-pastoriza'].join('/') + '/';

export const sourceUrl = 'https://drive.google.com/file/d/1BJNJ5DyEJIylbX8E5EG6i2WMoFh5-1yx/view';
export const cover = assetBase + 'chapadmalal-1950.webp';
export const authors = 'Juan Carlos Torre · Elisa Pastoriza';

export const readerConfig = {
  workId: 'torre-pastoriza-bienestar',
  textOnly: true,
  textUrl: assetBase + 'texto-academico.txt',
  sourceUrl,
  downloadTextName: 'torre-pastoriza-la-democratizacion-del-bienestar.txt',
  readingEntry: {
    author: authors,
    title: 'La democratización del bienestar',
    synopsis: 'Torre y Pastoriza estudian cómo se amplió el acceso al bienestar durante el primer peronismo. Vinculan la movilidad social y las políticas públicas con cambios en la vida cotidiana, desde la vivienda y la educación hasta las vacaciones, y examinan los conflictos que suscitó la presencia popular en nuevos espacios.',
  },
  sections: [
    { title: 'Apertura' },
    { title: 'Un país más vertebrado', term: 'UN PAÍS MÁS VERTEBRADO' },
    { title: 'La sociedad móvil', term: 'LA SOCIEDAD MÓVIL' },
    { title: 'Las vías de acceso al bienestar social', term: 'LAS VÍAS DE ACCESO AL BIENESTAR SOCIAL' },
    { title: 'El desenlace conflictivo de la democratización del bienestar', term: 'EL DESENLACE CONFLICTIVO DE LA DEMOCRATIZACIÓN DEL BIENESTAR' },
    { title: 'Bibliografía', term: 'BIBLIOGRAFÍA' },
  ],
  storage: {
    stateKey: 'torre-pastoriza-bienestar-text-page-v1',
    notesKey: 'torre-pastoriza-bienestar-text-notes-v1',
  },
  export: {
    textFileName: 'cuaderno-torre-pastoriza.txt',
    shareTitle: 'Cuaderno de lectura · La democratización del bienestar',
  },
};

export const authorImage = assetBase + 'autoria.webp';

import { plannedWorks } from './plannedWorks.js';
import { programGroups, programGroupByWork } from './program.js';
export { programGroups };

export const LIBRARY_CONFIG = {
  name: 'Biblioteca de Historia de la Educación y de la Educación Física',
  subtitle: 'Textos académicos para leer y escuchar',
  description: 'Biblioteca académica de textos de Historia de la Educación y de la Educación Física para leer y escuchar.',
};

const publishedWorks = [
  {
    id: 'pineau-reprimir-discriminar',
    status: 'available',
    author: 'Pablo Pineau',
    shortTitle: 'Reprimir y discriminar',
    title: 'Reprimir y discriminar. La educación en la última dictadura cívico-militar en Argentina (1976–1983)',
    coverTone: 'sage',
    year: '2014',
    duration: 3027.226122,
    stateKey: 'pineau-reprimir-discriminar-audio-state-v1',
    artwork: 'assets/pineau-reprimir-discriminar/quema-libros-sarandi.webp',
    heroCaption: 'Quema de libros en Sarandí. El oscurantismo a plena luz del día.',
    description: 'Las estrategias represiva y discriminadora de la política educativa dictatorial: censura, disciplinamiento, segmentación y desigualdad.',
    authorDisplay: 'Pineau, P.',
    authorSearch: ['Pablo Pineau', 'Pineau, Pablo', 'Pineau, P.'],
    sortAuthor: 'Pineau, Pablo',
    reference: 'Pineau, P. (2014). Reprimir y discriminar. La educación en la última dictadura cívico-militar en Argentina (1976–1983). Educar em Revista, 51, 103–122.',
    path: 'textos/pineau-reprimir-discriminar/',
    readingDetail: 'Audiolibro con seguimiento aproximado por párrafos y cuaderno de lectura',
  },
  {
    id: 'scharagrodsky-constitucion-ef',
    status: 'available',
    author: 'Pablo Ariel Scharagrodsky',
    shortTitle: 'La constitución de la Educación Física escolar',
    title: 'La constitución de la Educación Física escolar en la Argentina. Tensiones, conflictos y disputas con la matriz militar en las primeras décadas del siglo XX',
    coverTone: 'blue',
    year: '2011',
    duration: 3083.755102,
    stateKey: 'scharagrodsky-constitucion-ef-reader-state-v1',
    artwork: 'assets/scharagrodsky-disputas.svg',
    heroArtwork: 'assets/scharagrodsky-ronda-carrusel.webp',
    heroCaption: 'Clase abierta del Sistema Argentino de Educación Física (SAEF) en el Instituto Nacional Superior de Educación Física (circa 1920).',
    description: 'Las disputas entre el Sistema Argentino de Educación Física y la matriz militar: saberes, instituciones, disciplina y ciudadanía en las primeras décadas del siglo XX.',
    authorDisplay: 'Scharagrodsky, P. A.',
    authorSearch: ['Pablo Ariel Scharagrodsky', 'Scharagrodsky, Pablo', 'Scharagrodsky, P. A.'],
    sortAuthor: 'Scharagrodsky, Pablo Ariel',
    reference: 'Scharagrodsky, P. A. (2011). La constitución de la educación física escolar en la Argentina. Tensiones, conflictos y disputas con la matriz militar en las primeras décadas del siglo XX. En P. Scharagrodsky (Comp.), La invención del homo gymnasticus: Fragmentos históricos sobre la educación de los cuerpos en movimiento en Occidente. Prometeo.',
    path: 'textos/scharagrodsky-constitucion-ef/',
  },
  {
    id: 'aisenstein-tabla-rasa',
    status: 'available',
    author: 'Ángela Aisenstein',
    shortTitle: '¿Hacemos tabla rasa del pasado?',
    title: '¿Hacemos tabla rasa del pasado? El saber histórico en la formación docente en Educación Física',
    coverTone: 'lilac',
    year: '2006',
    duration: 1493.19,
    stateKey: 'aisenstein-tabla-rasa-reader-state-v1',
    artwork: 'assets/aisenstein-inicio-prueba.png',
    heroCaption: 'Higia, diosa griega de la salud y la higiene. Un símbolo persistente del imaginario corporal moderno.',
    description: 'Tres formas de investigar el pasado de la Educación Física y una pregunta sobre la conciencia histórica y la formación de docentes.',
    authorDisplay: 'Aisenstein, Á.',
    authorSearch: ['Ángela Aisenstein', 'Angela Aisenstein', 'Aisenstein, Ángela', 'Aisenstein, A.'],
    sortAuthor: 'Aisenstein, Ángela',
    reference: 'Aisenstein, Á. (2006). ¿Hacemos tabla rasa del pasado? El saber histórico en la formación docente en Educación Física. En Á. Aisenstein y P. Scharagrodsky (coords.), Tras las huellas de la Educación Física escolar argentina. Cuerpo, género y pedagogía, 1880–1950 (pp. 237–246). Prometeo.',
    path: 'textos/aisenstein-tabla-rasa/',
  },
  {
    id: 'orbuch-educar-al-cuerpo',
    status: 'available',
    author: 'Iván Pablo Orbuch',
    shortTitle: 'Educar al cuerpo dentro y fuera del aula',
    coverTone: 'gold',
    year: '2020',
    duration: 1673.900408,
    stateKey: 'orbuch-educar-cuerpo-reader-state-v1',
    artwork: 'assets/orbuch-hero-mural-desktop.webp',
    heroCaption: 'Composición editorial. Aula y oficina: dos escenarios de educación del cuerpo.',
    description: 'Dos experiencias de educación corporal en la Nueva Argentina de Perón. Un recorrido entre la escuela, el trabajo y la vida cotidiana.',
    authorDisplay: 'Orbuch, I. P.',
    authorSearch: ['Iván Pablo Orbuch', 'Ivan Pablo Orbuch', 'Orbuch, Iván', 'Orbuch, I. P.'],
    sortAuthor: 'Orbuch, Iván Pablo',
    title: 'Educar al cuerpo dentro y fuera del aula. Análisis de dos experiencias en la Nueva Argentina de Perón',
    citation: {
      beforeItalic: 'Orbuch, I. P. (2020). Educar al cuerpo dentro y fuera del aula. Análisis de dos experiencias en la Nueva Argentina de Perón.',
      italic: 'History of Education in Latin America, 3',
      afterItalic: ', e21435.',
    },
    thumbnail: {
      src: 'assets/orbuch-gimnasia-compensatoria-portada.png',
      alt: 'Portada de Gimnasia compensatoria en el aula, uno de los documentos analizados por Iván Orbuch',
      year: '1949–1950',
      label: 'Aula y oficina',
      fit: 'contain',
    },
    path: 'textos/orbuch-educar-al-cuerpo/',
  },
  {
    id: 'pineau-fresco-noble',
    status: 'available',
    author: 'Pablo Pineau',
    shortTitle: 'Renovación, represión, cooptación',
    coverTone: 'coral',
    year: '1999',
    duration: 3005.727,
    stateKey: 'fresco-noble-reader-state-v1',
    artwork: 'assets/portada-pineau-fresco-noble.png',
    heroCaption: 'El expresionismo pampeano de Salamone. Estética del Estado bonaerense durante el gobierno de Manuel Fresco.',
    description: 'Las estrategias de la Reforma Fresco–Noble en la provincia de Buenos Aires. Educación, cultura física y política en la década de 1930.',
    authorDisplay: 'Pineau, P.',
    authorSearch: ['Pablo Pineau', 'Pineau, Pablo', 'Pineau, P.'],
    sortAuthor: 'Pineau, Pablo',
    title: 'Renovación, represión, cooptación: Las estrategias de la Reforma Fresco–Noble (Provincia de Buenos Aires, década del 30)',
    citation: {
      beforeItalic: 'Pineau, P. (1999). Renovación, represión, cooptación: Las estrategias de la Reforma Fresco–Noble (Provincia de Buenos Aires, década del 30). En A. Ascolani (Comp.),',
      italic: 'La educación en Argentina: Estudios de historia',
      afterItalic: '(pp. 223–239). Ediciones del Arca.',
    },
    thumbnail: {
      src: 'assets/pablo-pineau.webp',
      alt: 'Retrato de Pablo Pineau',
      year: '1937',
      label: 'Reforma Fresco–Noble',
    },
    path: 'textos/pineau-fresco-noble/',
  },
  {
    id: 'hobsbawm-historia-siglo-xx',
    status: 'available',
    author: 'Eric Hobsbawm',
    shortTitle: 'Historia del siglo XX',
    title: 'Historia del siglo XX. Vista panorámica del siglo XX',
    coverTone: 'lilac',
    year: '1999',
    duration: 2942.197551,
    stateKey: 'hobsbawm-siglo-xx-reader-state-v1',
    artwork: 'assets/portada-hobsbawm-historia-siglo-xx.png',
    heroCaption: 'Memorias del SXX. Composición editorial.',
    description: 'Doce testimonios y una vista panorámica del siglo corto: catástrofes, crecimiento y crisis entre 1914 y 1991. Una lectura sobre la memoria y las transformaciones del mundo contemporáneo.',
    authorDisplay: 'Hobsbawm, E.',
    authorSearch: ['Eric Hobsbawm', 'Hobsbawm, Eric', 'Hobsbawn', 'Hobsbawm, E.'],
    sortAuthor: 'Hobsbawm, Eric',
    reference: 'Hobsbawm, E. (1999). Vista panorámica del siglo XX. En Historia del siglo XX. Crítica.',
    path: 'textos/hobsbawm-historia-siglo-xx/',
  },
];

// Continuaciones editoriales de las 18 portadas de apertura: no duplicar
// autoría ni título principal, que ya están visibles dentro de la miniatura.
// El título bibliográfico íntegro permanece en entry.title, enlaces y fichas.
const cardContinuations = {
  'pineau-reprimir-discriminar': 'La educación en la última dictadura cívico-militar en Argentina (1976–1983)',
  'scharagrodsky-constitucion-ef': 'En la Argentina. Tensiones, conflictos y disputas con la matriz militar en las primeras décadas del siglo XX',
  'aisenstein-tabla-rasa': 'El saber histórico en la formación docente en Educación Física',
  'orbuch-educar-al-cuerpo': 'Análisis de dos experiencias en la Nueva Argentina de Perón',
  'pineau-fresco-noble': 'Las estrategias de la Reforma Fresco–Noble (Provincia de Buenos Aires, década del 30)',
  'hobsbawm-historia-siglo-xx': 'Vista panorámica del siglo XX',
  'marcaida-scaltritti-estado-nacional': 'Argentino (1852–1880)',
  'soares-corrientes-gimnasticas': 'Y su contenido: una historia de rupturas y permanencias',
  'lionetti-escuela-republicana': 'Pública. La formación del ciudadano en Argentina a fines del siglo XIX',
  'galak-del-dicho-al-hecho': 'El largo trecho del nacimiento de la formación profesional en Educación Física en Argentina (1897–1909)',
  'feiguin-aisenstein-sujetos': 'Formación de profesores de Educación Física. Argentina, 1938–1967',
  'torre-pastoriza-bienestar': '',
  'almada-privilegiados': 'La cultura física y el deporte en la política del peronismo',
  'arata-marino-auroras-tempestades': 'La educación entre golpes (1955–1976)',
  'melano-militares-juramentados': 'La reapertura del INEF Gral. Belgrano en la década del 70',
  'levoratti-gimnasia-1958-1968': 'En la educación primaria y el nivel medio. Un estudio sobre las perspectivas teóricas en circulación (Argentina, 1958–1968)',
  'levoratti-debates-ef': 'Y los enfoques de las ciencias sociales: un análisis de los lineamientos curriculares nacionales destinados a la formación docente en Argentina (1993–2015)',
  'thwaites-rey-democracia-argentina': 'Bajo el largo ciclo de hegemonía neoliberal (1983–2013)',
};

export const workRegistry = [
  ...publishedWorks,
  ...plannedWorks.filter((entry) => !publishedWorks.some((work) => work.id === entry.id)),
].map((entry) => ({
  ...entry,
  cardContinuation: cardContinuations[entry.id] ?? '',
  programGroup: programGroupByWork.get(entry.id) ?? 'complementaria',
}));

// Selección de apertura. El registro conserva las rutas y las claves guardadas
// de las fichas que podrán reincorporarse más adelante.
const openingIds = new Set([
  'hobsbawm-historia-siglo-xx',
  'aisenstein-tabla-rasa',
  'marcaida-scaltritti-estado-nacional',
  'soares-corrientes-gimnasticas',
  'lionetti-escuela-republicana',
  'scharagrodsky-constitucion-ef',
  'pineau-fresco-noble',
  'feiguin-aisenstein-sujetos',
  'torre-pastoriza-bienestar',
  'almada-privilegiados',
  'orbuch-educar-al-cuerpo',
  'arata-marino-auroras-tempestades',
  'levoratti-gimnasia-1958-1968',
  'pineau-reprimir-discriminar',
  'melano-militares-juramentados',
  'thwaites-rey-democracia-argentina',
  'levoratti-debates-ef',
  'galak-del-dicho-al-hecho',
]);

export const catalog = workRegistry.filter((entry) => openingIds.has(entry.id));

export const canReadAndListen = (entry) => entry.status === 'available' || entry.status === 'review';
export function matchesAvailability(entry, selected = 'all') {
  if (selected === 'all') return true;
  // «Leer y escuchar» incluye la escucha no sincronizada declarada como tal.
  if (selected === 'available') return canReadAndListen(entry);
  return entry.status === selected;
}

export function normalizeForSearch(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('es')
    .replace(/[^\p{Letter}\p{Number}]+/gu, ' ')
    .trim();
}

export function matchesCatalogEntry(entry, query) {
  const tokens = normalizeForSearch(query).split(/\s+/).filter(Boolean);
  if (!tokens.length) return true;

  const haystack = normalizeForSearch([
    ...entry.authorSearch,
    entry.authorDisplay,
    entry.title,
    entry.shortTitle,
    entry.historicalPeriod,
  ].join(' '));

  return tokens.every((token) => haystack.includes(token));
}

export function sortCatalog(entries = catalog) {
  return [...entries].sort((left, right) => {
    const leftSurname = left.sortAuthor.split(',')[0];
    const rightSurname = right.sortAuthor.split(',')[0];
    const authorOrder = leftSurname.localeCompare(rightSurname, 'es', { sensitivity: 'base' });
    if (authorOrder !== 0) return authorOrder;
    return left.title.localeCompare(right.title, 'es', { sensitivity: 'base' });
  });
}

export function filterCatalog(entries, query) {
  return sortCatalog(entries).filter((entry) => matchesCatalogEntry(entry, query));
}

export function alphabeticGroup(entry) {
  return normalizeForSearch(entry.sortAuthor).charAt(0).toLocaleUpperCase('es');
}

export function resolveSitePath(path, baseUrl = '/') {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}${String(path).replace(/^\/+/, '')}`;
}

export function citationAsPlainText(entry) {
  if (entry.reference) return entry.reference;
  const { beforeItalic, italic, afterItalic } = entry.citation;
  const separator = afterItalic.startsWith(',') ? '' : ' ';
  return `${beforeItalic} ${italic}${separator}${afterItalic}`;
}

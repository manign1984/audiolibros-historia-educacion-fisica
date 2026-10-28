import { plannedWorks, collections } from './plannedWorks.js';
export { collections };

export const LIBRARY_CONFIG = {
  name: 'Biblioteca de Historia de la Educación y de la Educación Física',
  subtitle: 'Textos académicos para leer y escuchar',
  description: 'Biblioteca académica de textos de Historia de la Educación y de la Educación Física para leer y escuchar.',
};

const publishedWorks = [
  {
    id: 'orbuch-educar-al-cuerpo',
    status: 'available',
    author: 'Iván Pablo Orbuch',
    shortTitle: 'Educar al cuerpo dentro y fuera del aula',
    collection: 'peronismo',
    year: '2020',
    duration: 1673.900408,
    stateKey: 'orbuch-educar-cuerpo-reader-state-v1',
    artwork: 'assets/orbuch-hero-mural-desktop.webp',
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
    collection: 'conservadurismo',
    year: '1999',
    duration: 3005.727,
    stateKey: 'fresco-noble-reader-state-v1',
    artwork: 'assets/portada-pineau-fresco-noble.png',
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
    collection: 'miradas',
    year: '1999',
    duration: 2942.197551,
    stateKey: 'hobsbawm-siglo-xx-reader-state-v1',
    artwork: 'assets/portada-hobsbawm-historia-siglo-xx.png',
    description: 'Doce testimonios y una vista panorámica del siglo corto: catástrofes, crecimiento y crisis entre 1914 y 1991. Una lectura sobre la memoria y las transformaciones del mundo contemporáneo.',
    authorDisplay: 'Hobsbawm, E.',
    authorSearch: ['Eric Hobsbawm', 'Hobsbawm, Eric', 'Hobsbawn', 'Hobsbawm, E.'],
    sortAuthor: 'Hobsbawm, Eric',
    reference: 'Hobsbawm, E. (1999). Vista panorámica del siglo XX. En Historia del siglo XX. Crítica.',
    path: 'textos/hobsbawm-historia-siglo-xx/',
  },
];

export const catalog = [...publishedWorks, ...plannedWorks];

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
    collections.find((collection) => collection.id === entry.collection)?.title,
  ].join(' '));

  return tokens.every((token) => haystack.includes(token));
}

export function sortCatalog(entries = catalog) {
  return [...entries].sort((left, right) => {
    const authorOrder = left.sortAuthor.localeCompare(right.sortAuthor, 'es', { sensitivity: 'base' });
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

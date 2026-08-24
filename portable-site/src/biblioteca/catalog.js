export const LIBRARY_CONFIG = {
  name: 'Biblioteca de Historia de la Educación y de la Educación Física',
  subtitle: 'Textos académicos para leer y escuchar',
  description: 'Biblioteca académica de textos de Historia de la Educación y de la Educación Física para leer y escuchar.',
};

export const catalog = [
  {
    id: 'orbuch-educar-al-cuerpo',
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
];

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
  const { beforeItalic, italic, afterItalic } = entry.citation;
  const separator = afterItalic.startsWith(',') ? '' : ' ';
  return `${beforeItalic} ${italic}${separator}${afterItalic}`;
}

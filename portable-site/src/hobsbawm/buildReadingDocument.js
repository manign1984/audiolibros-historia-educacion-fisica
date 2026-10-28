const HEADINGS = {
  Primero: ['memoria', 'I · Memoria y oficio del historiador', 'I · Memoria e historia'],
  Segundo: ['triptico', 'II · El siglo XX como tríptico', 'II · Un siglo en tres tiempos'],
  Tercero: ['transformaciones', 'III · Un mundo transformado', 'III · Un mundo transformado'],
};

export function buildHobsbawmReadingDocument(source, timings = {}) {
  const segmenter = new Intl.Segmenter('es', { granularity: 'sentence' });
  const lines = source.replace(/^\uFEFF/, '').split(/\r?\n/).map((line) => line.replace(/\s+/g, ' ').trim());
  const first = lines.findIndex((line) => line.startsWith('Isaiah Berlin'));
  if (first < 0) throw new Error('Falta el inicio de los doce testimonios.');
  const sections = [{ id: 'testimonios', title: 'Doce personas reflexionan sobre el siglo XX', shortTitle: 'Doce testimonios', paragraphs: [] }];
  let section = sections[0];
  for (const line of lines.slice(first)) {
    if (!line) continue;
    if (HEADINGS[line]) {
      const [id, title, shortTitle] = HEADINGS[line];
      section = { id, title, shortTitle, paragraphs: [] };
      sections.push(section);
      continue;
    }
    const id = `${section.id}-p${section.paragraphs.length + 1}`;
    section.paragraphs.push({
      id,
      kind: section.id === 'testimonios' ? 'quote' : 'body',
      sentences: [...segmenter.segment(line)].map(({ segment }, index) => {
        const sid = `${id}-s${index + 1}`;
        return { id: sid, text: segment.trim(), ...(timings[sid] || {}) };
      }),
    });
  }
  return {
    title: 'Historia del siglo XX',
    subtitle: 'Vista panorámica del siglo XX · Doce testimonios',
    author: 'Eric Hobsbawm',
    duration: 2942.197551,
    frontMatter: [
      { id: 'hobs-title', role: 'title', text: 'Historia del siglo XX', ...(timings['hobs-title'] || {}) },
      { id: 'hobs-author', role: 'author', text: 'Eric Hobsbawm', ...(timings['hobs-author'] || {}) },
      { id: 'hobs-subtitle', role: 'subtitle', text: 'Doce personas reflexionan sobre el siglo XX', ...(timings['hobs-subtitle'] || {}) },
    ],
    sections,
    sourceNote: 'Selección de cátedra: los doce testimonios y los apartados I, II y III de «Vista panorámica del siglo XX». El PDF conserva la versión del material compartido; el lector normaliza únicamente los espacios y saltos de línea del texto preparado para el audiolibro. Se conservan seis pasajes que la grabación omite, señalados con subrayado punteado y disponibles para anotar.',
  };
}

const SECTION_TITLES = new Map([
  ['Introducción', { id: 'introduccion', shortTitle: 'Introducción' }],
  ['Gimnasia compensatoria en el aula', { id: 'aula', shortTitle: 'En el aula' }],
  ['Gimnasia de Oficinas', { id: 'oficinas', shortTitle: 'En las oficinas' }],
  ['Conclusiones', { id: 'conclusiones', shortTitle: 'Conclusiones' }],
]);

function splitSentences(text) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    return [...new Intl.Segmenter('es', { granularity: 'sentence' }).segment(text)]
      .map(({ segment }) => segment.trim())
      .filter(Boolean);
  }

  return text.match(/[^.!?]+(?:[.!?]+(?=\s|$)|$)/g)?.map((sentence) => sentence.trim()).filter(Boolean) || [text];
}

function sentenceRecord(text, id, role) {
  return {
    id,
    text,
    ...(role ? { role } : {}),
  };
}

export function buildOrbuchReadingDocument(source) {
  const blocks = source
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);

  const [title, subtitle, author, ...body] = blocks;
  const sections = [];
  let currentSection = null;

  body.forEach((block) => {
    const sectionMeta = SECTION_TITLES.get(block);
    if (sectionMeta) {
      currentSection = {
        ...sectionMeta,
        title: block,
        paragraphs: [],
      };
      sections.push(currentSection);
      return;
    }

    if (!currentSection) return;
    const paragraphIndex = currentSection.paragraphs.length + 1;
    const paragraphId = `${currentSection.id}-p${paragraphIndex}`;
    const kind = block.length < 760 && currentSection.paragraphs.at(-1)?.text?.endsWith(':') ? 'quote' : 'body';
    currentSection.paragraphs.push({
      id: paragraphId,
      kind,
      text: block,
      sentences: splitSentences(block).map((sentence, index) => sentenceRecord(sentence, `${paragraphId}-s${index + 1}`)),
    });
  });

  return {
    id: 'orbuch-educar-al-cuerpo',
    title,
    subtitle,
    author,
    duration: 1673.900408,
    syncStatus: 'pending',
    frontMatter: [
      sentenceRecord(title, 'portada-titulo', 'title'),
      sentenceRecord(subtitle, 'portada-subtitulo', 'subtitle'),
      sentenceRecord(author, 'portada-autor', 'author'),
    ],
    sections,
    endnotes: [],
    bibliography: [],
    sourceNote: 'Versión textual accesible recuperada del proyecto original y adaptada para la narración. El PDF académico conserva el aparato crítico completo.',
  };
}

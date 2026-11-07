// Academic text and timing evidence are separate inputs. No inferred timing is activated here.
export function buildSoaresDocument(academic) {
  const segmenter = new Intl.Segmenter('es', { granularity: 'sentence' });
  const endnotes = structuredClone(academic.endnotes);
  endnotes.find(note => note.number === 1).sentenceId = 'soa-title';
  const sections = academic.sections.map(section => {
    const headingId = `soa-${section.id}-heading`;
    for (const number of section.headingNotes) endnotes.find(note => note.number === number).sentenceId = headingId;
    return {
      id: section.id, title: section.title, shortTitle: section.title,
      headingSentence: { id: headingId, text: section.title },
      paragraphs: section.paragraphs.map((paragraph, pi) => {
        const id = `soa-${section.id}-p${pi + 1}`;
        const references = [];
        let text = '', last = 0;
        for (const match of paragraph.text.matchAll(/\[\[note:(\d+)\]\]/g)) {
          text += paragraph.text.slice(last, match.index);
          references.push({ position: text.length, number: Number(match[1]) });
          last = match.index + match[0].length;
        }
        text += paragraph.text.slice(last);
        const parts = [];
        // Ellipses are omissions inside quotations, not standalone sentences.
        const segmentationText = text.replace(/\.{2,}/g, dots => '\uE000'.repeat(dots.length)).replace(/\[([\s.]+)\]/g, bracket => bracket.replaceAll('.', '\uE000'));
        for (const part of segmenter.segment(segmentationText)) {
          const previous = parts.at(-1);
          if (previous && (/(?:\b[A-ZÁÉÍÓÚ]\.|\b(?:Dr|Cf|vol|pp)\.)$/.test(previous.segment.trim()) || /^[^\p{L}\p{N}]*$/u.test(previous.segment.trim()) || /^[\"”]?\s*\([^)]*\d{4}[^)]*\)\.?$/.test(part.segment.trim()))) previous.segment += part.segment;
          else parts.push({ segment: part.segment, index: part.index });
        }
        const sentences = parts.map(({ segment, index }, si) => {
          const sentenceId = `${id}-s${si + 1}`;
          for (const ref of references.filter(ref => ref.position >= index && ref.position < index + segment.length)) endnotes.find(note => note.number === ref.number).sentenceId = sentenceId;
          // A call at the paragraph's end belongs to its last sentence.
          if (si === parts.length - 1) for (const ref of references.filter(ref => ref.position >= index + segment.length)) endnotes.find(note => note.number === ref.number).sentenceId = sentenceId;
          return { id: sentenceId, text: segment.replaceAll('\uE000', '.').trim() };
        }).filter(sentence => sentence.text);
        return { id, kind: paragraph.kind, page: paragraph.page, sentences };
      }),
    };
  });
  if (endnotes.some(note => !note.sentenceId)) throw new Error('Llamadas académicas incompletas');
  return {
    id: academic.id, title: academic.title, subtitle: academic.subtitle, author: academic.author,
    duration: 3113.377959,
    frontMatter: [
      { id: 'soa-title', role: 'title', text: `${academic.title} ${academic.subtitle}` },
      { id: 'soa-author', role: 'author', text: academic.author },
      { id: 'soa-location', role: 'text', text: 'Capítulo 12 · Campinas, Brasil', audioUnavailable: true },
    ],
    sections, endnotes, bibliography: academic.bibliography,
    sourceNote: `Capítulo de Apuntes de historia para profesores de Educación Física (2006), copia de cátedra de 16 páginas. El audio narra el cuerpo y abrevia referencias. Las 29 notas y la bibliografía no se narran. Seguimiento automático por oración no disponible. ${academic.editorialClarification.text} Fuente: ${academic.editorialClarification.url}`,
  };
}

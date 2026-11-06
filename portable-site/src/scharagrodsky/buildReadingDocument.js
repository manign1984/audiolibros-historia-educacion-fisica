// Academic edition, independent of the abridged narration and the original VTT.
export function buildScharagrodskyDocument(academic, alignment = {}) {
  const segmenter = new Intl.Segmenter('es', { granularity: 'sentence' });
  const endnotes = structuredClone(academic.endnotes);
  endnotes[0].sentenceId = 'sch-author';
  const sections = academic.sections.map(section => ({
    id: section.id,
    title: section.title,
    shortTitle: section.title,
    ...(section.id !== 'epigrafes' ? { headingSentence: {
      id: `sch-${section.id}-heading`, text: section.title,
      ...(alignment[`sch-${section.id}-heading`] || { audioUnavailable: true }),
    } } : {}),
    paragraphs: section.paragraphs.map((paragraph, pi) => {
      const id = `sch-${section.id}-p${pi + 1}`;
      const references = [];
      let text = '', last = 0;
      for (const match of paragraph.text.matchAll(/\[\[note:(\d+)\]\]/g)) {
        text += paragraph.text.slice(last, match.index);
        references.push({ position: text.length, number: Number(match[1]) });
        last = match.index + match[0].length;
      }
      text += paragraph.text.slice(last);
      const parts = [];
      for (const part of segmenter.segment(text)) {
        const previous = parts.at(-1);
        // Initials and abbreviated honorifics do not end a spoken sentence.
        // A detached bibliographical parenthesis belongs to the preceding quote.
        if (previous && (/(?:\b[A-ZÁÉÍÓÚ]\.|\bDr\.)$/.test(previous.segment.trim()) || /^\([^)]*\d{4}[^)]*\)\.$/.test(part.segment.trim()))) {
          previous.segment += part.segment;
        } else parts.push({ segment: part.segment, index: part.index });
      }
      const sentences = parts.map(({ segment, index }, si) => {
        const sentenceId = `${id}-s${si + 1}`;
        for (const ref of references.filter(ref => ref.position > index && ref.position <= index + segment.length)) {
          endnotes.find(note => note.number === ref.number).sentenceId = sentenceId;
        }
        return { id: sentenceId, text: segment.trim(), ...(alignment[sentenceId] || { audioUnavailable: true }) };
      });
      return { id, kind: paragraph.kind, page: paragraph.page, sentences };
    }),
  }));
  return {
    id: 'scharagrodsky-constitucion-ef', title: academic.title, subtitle: academic.subtitle,
    author: academic.author, duration: 3083.755102,
    frontMatter: [
      { id: 'sch-title', role: 'title', text: academic.title, ...(alignment['sch-title'] || { audioUnavailable: true }) },
      { id: 'sch-subtitle', role: 'subtitle', text: academic.subtitle, ...(alignment['sch-subtitle'] || { audioUnavailable: true }) },
      { id: 'sch-author', role: 'author', text: academic.author, ...(alignment['sch-author'] || { audioUnavailable: true }) },
    ],
    sections, endnotes, bibliography: academic.bibliography,
    sourceNote: 'Capítulo de La invención del homo gymnasticus (2011), copia de cátedra de 18 páginas. Los epígrafes, las 29 notas y la bibliografía no se narran. La grabación abrevia referencias entre paréntesis; el texto conserva la edición académica.',
  };
}

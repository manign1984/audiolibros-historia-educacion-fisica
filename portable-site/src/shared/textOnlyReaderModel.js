// Funciones puras del lector de textos sin audio: no modifican el documento original.
export function preparePages(raw) {
  return String(raw || '').split('\f')
    .map(text => text.replace(/\r/g, '').replace(/\n\s*\d+\s*$/, '').trim())
    .filter(Boolean);
}
export function paragraphsOf(pageText) {
  return String(pageText || '').split(/\n\s*\n/g)
    .map(text => text.replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ').trim())
    .filter(Boolean);
}
export function resolvePage(page, count) {
  if (!count) return 0;
  const n = Number(page);
  return Number.isFinite(n) ? Math.max(0, Math.min(count - 1, Math.floor(n))) : 0;
}
export function normalizeNotes(value) {
  return Array.isArray(value) ? value.filter(note =>
    note && typeof note.id === 'string' && Number.isInteger(note.page) &&
    note.page >= 0 && typeof note.text === 'string' && note.text.trim().length > 0
  ) : [];
}
export function getChapters(pages, sections = []) {
  return sections.map(section => {
    const page = section.term ? pages.findIndex(text => text.includes(section.term)) : 0;
    return { ...section, page };
  }).filter(section => section.page >= 0);
}
const fold = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('es').replace(/\s+/g, ' ').trim();
export function searchDocument(pages, query) {
  const term = fold(query);
  if (term.length < 2) return [];
  return pages.flatMap((text, page) => {
    if (!fold(text).includes(term)) return [];
    const paragraph = paragraphsOf(text).find(item => fold(item).includes(term)) || '';
    return [{ page, snippet: paragraph.length > 175 ? paragraph.slice(0, 172) + '…' : paragraph }];
  });
}

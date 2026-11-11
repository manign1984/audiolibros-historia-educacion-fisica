import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Download, FileText, NotebookPen, Pencil, Save, Search, Trash2, X } from 'lucide-react';
import CanonicalReadingEntry from './CanonicalReadingEntry.jsx';
import { getChapters, normalizeNotes, paragraphsOf, preparePages, resolvePage, searchDocument } from './textOnlyReaderModel.js';
import './text-only-reader.css';

const retrieve = (key, fallback) => {
  try { const raw = localStorage.getItem(key); return raw === null ? fallback : JSON.parse(raw); }
  catch { return fallback; }
};

function download(name, contents, type) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Texto académico con navegación por página y cuaderno local. No requiere
 * audio, no inicia reproducciones y no muestra controles de sonido.
 */
export default function TextOnlyReader({ config, showToast }) {
  const [raw, setRaw] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(() => Math.max(0, Number(retrieve(config.storage.stateKey, 0)) || 0));
  const [notes, setNotes] = useState(() => normalizeNotes(retrieve(config.storage.notesKey, [])));
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notice, setNotice] = useState('');
  const [fontScale, setFontScale] = useState(1);
  const dialog = useRef(null);
  const article = useRef(null);
  const openButton = useRef(null);
  const pages = useMemo(() => preparePages(raw), [raw]);
  // Evitar que la primera renderización (antes del fetch) borre el progreso previo.
  const safePage = pages.length ? resolvePage(page, pages.length) : page;
  const toc = useMemo(() => getChapters(pages, config.sections), [pages, config.sections]);
  const searchHits = useMemo(() => searchDocument(pages, searchTerm), [pages, searchTerm]);
  const currentNotes = notes.filter(note => note.page === safePage);

  useEffect(() => {
    const abort = new AbortController();
    fetch(config.textUrl, { signal: abort.signal }).then(response => {
      if (!response.ok) throw Error('No se pudo abrir el archivo de lectura');
      return response.text();
    }).then(setRaw).catch(err => {
      if (err.name !== 'AbortError') setError('No se pudo cargar el texto. Podés consultar la edición original.');
    });
    return () => abort.abort();
  }, [config.textUrl]);

  useEffect(() => {
    try { localStorage.setItem(config.storage.notesKey, JSON.stringify(notes)); }
    catch { /* El cuaderno sigue disponible durante esta visita. */ }
  }, [notes, config.storage.notesKey]);

  useEffect(() => {
    if (!pages.length) return;
    try { localStorage.setItem(config.storage.stateKey, JSON.stringify(safePage)); }
    catch { /* El progreso se mantiene en memoria. */ }
  }, [safePage, pages.length, config.storage.stateKey]);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = previous; };
  }, [open]);

  const notify = message => { setNotice(message); showToast?.(message); };
  const jump = index => {
    setPage(resolvePage(index, pages.length));
    article.current?.scrollTo({ top: 0 });
    article.current?.closest('.text-only-workspace')?.scrollTo({ top: 0 });
    setEditingId(null);
    setDraft('');
    setNotice('');
  };
  const save = () => {
    const value = draft.trim();
    if (!value) return;
    if (editingId) {
      setNotes(previous => previous.map(note => note.id === editingId ? { ...note, text: value, updatedAt: new Date().toISOString() } : note));
      notify('Nota actualizada en este navegador');
    } else {
      setNotes(previous => [...previous, { id: String(Date.now()) + Math.random().toString(36).slice(2), page: safePage, text: value, createdAt: new Date().toISOString() }]);
      notify('Nota guardada en este navegador');
    }
    setEditingId(null);
    setDraft('');
  };
  const edit = note => {
    setEditingId(note.id);
    setDraft(note.text);
    dialog.current?.querySelector('#lionetti-note')?.focus();
  };
  const remove = id => {
    setNotes(previous => previous.filter(note => note.id !== id));
    if (editingId === id) { setEditingId(null); setDraft(''); }
    notify('Nota eliminada');
  };
  const exportText = () => download(
    config.export?.textFileName || 'cuaderno-lionetti.txt',
    [config.export?.shareTitle || 'Cuaderno de lectura · Lucía Lionetti', ...[...notes].sort((a, b) => a.page - b.page).map((note, index) => `\n${index + 1}. Página ${note.page + 1}\n${note.text}\n`)].join('\n'),
    'text/plain;charset=utf-8',
  );
  const searchResults = searchHits.length
    ? searchHits.map(hit => <button key={hit.page} type="button" onClick={() => jump(hit.page)}>
        Página {hit.page + 1}<small>{hit.snippet}</small>
      </button>)
    : searchTerm.trim().length >= 2 ? <p>No hay coincidencias en las páginas del artículo.</p> : null;
  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => openButton.current?.querySelector('button')?.focus());
  };

  return <>
    <div ref={openButton} className="text-only-entry">
      <CanonicalReadingEntry
        onOpen={() => setOpen(true)}
        progress={{ currentTime: 0, currentPage: safePage + 1 }}
        noteCount={notes.length}
        config={config}
        buttonAriaLabel="Abrir lector de texto y cuaderno"
      />
    </div>
    <dialog ref={dialog} className="text-only-dialog" aria-label={`Lector de ${config.readingEntry.author}`}
      onCancel={event => { event.preventDefault(); close(); }}
      onClose={() => setOpen(false)}>
      <div className="text-only-shell">
        <header className="text-only-head">
          <div><small>Biblioteca +TEC UNAHUR · Lector integrado</small><h2>{config.readingEntry.title}</h2></div>
          <button type="button" onClick={close} aria-label="Cerrar lector"><X size={21}/></button>
        </header>
        <div className="text-only-workspace">
          <nav className="text-only-chapters" aria-label="Apartados del texto">
            <h3><BookOpen size={19}/> Recorrido</h3>
            <label htmlFor="lionetti-search-desktop"><Search size={15}/> Buscar en el artículo</label>
            <input id="lionetti-search-desktop" type="search" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Palabra o expresión"/>
            {searchTerm.trim().length >= 2 && <div className="text-only-search-results" aria-label="Resultados de búsqueda">{searchResults}</div>}
            {toc.map(item => <button key={item.term} type="button"
              className={safePage === item.page ? 'is-active' : ''}
              onClick={() => jump(item.page)}>{item.title}<small>Página {item.page + 1}</small></button>)}
            <a href={config.sourceUrl} target="_blank" rel="noreferrer">Consultar edición original</a>
          </nav>
          <div className="text-only-document" ref={article} role="region" tabIndex={0} aria-label="Texto académico íntegro">
            <div className="text-only-mobile-navigation">
              <label htmlFor="lionetti-sections">Apartados del artículo</label>
              <select id="lionetti-sections" value={toc.some(item => item.page === safePage) ? safePage : ''}
                onChange={event => { if (event.target.value !== '') jump(Number(event.target.value)); }}>
                <option value="">Elegí un apartado</option>
                {toc.map(item => <option key={item.title} value={item.page}>{item.title} · pág. {item.page + 1}</option>)}
              </select>
              <label htmlFor="lionetti-search-mobile">Buscar en todas las páginas</label>
              <input id="lionetti-search-mobile" type="search" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Palabra o expresión"/>
              {searchTerm.trim().length >= 2 && <div className="text-only-search-results" aria-label="Resultados de búsqueda">{searchResults}</div>}
            </div>
            {error && <p role="alert">{error} <a href={config.sourceUrl} target="_blank" rel="noreferrer">Ver fuente</a></p>}
            {!raw && !error && <p role="status">Cargando texto académico…</p>}
            {pages.length > 0 && <>
              <div className="text-only-page-meta">{config.pageMeta || 'Lucía Lionetti · Artículo de 2005'} <span>Página {safePage + 1} de {pages.length}</span></div>
              <progress className="text-only-progress" value={safePage + 1} max={pages.length} aria-label="Progreso de lectura por páginas">{safePage + 1} de {pages.length}</progress>
              <article style={{ '--text-scale': fontScale }}>
                {paragraphsOf(pages[safePage]).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              </article>
              <div className="text-only-page-actions">
                <button type="button" disabled={safePage === 0} onClick={() => jump(safePage - 1)}><ArrowLeft size={16}/> Anterior</button>
                <span>{safePage + 1} / {pages.length}</span>
                <button type="button" disabled={safePage === pages.length - 1} onClick={() => jump(safePage + 1)}>Siguiente <ArrowRight size={16}/></button>
              </div>
            </>}
          </div>
          <aside className="text-only-notes" aria-label="Cuaderno de anotaciones">
            <h3><NotebookPen size={18}/> Mi cuaderno <small>{notes.length}</small></h3>
            <label htmlFor="lionetti-note">Anotá sobre la página {safePage + 1}</label>
            <textarea id="lionetti-note" rows={5} value={draft} onChange={event => setDraft(event.target.value)} placeholder="Ideas, preguntas y relaciones para volver a pensar…"/>
            <button className="text-only-save" type="button" disabled={!draft.trim()} onClick={save}><Save size={16}/> {editingId ? 'Guardar cambios' : 'Guardar nota'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setDraft(''); }}>Cancelar edición</button>}
            <div className="text-only-notelist">
              {currentNotes.length ? currentNotes.map(note => <div key={note.id} className="text-only-note"><p>{note.text}</p><div className="text-only-note-actions"><button type="button" onClick={() => edit(note)} aria-label="Editar nota"><Pencil size={16}/></button><button type="button" onClick={() => remove(note.id)} aria-label="Eliminar nota"><Trash2 size={16}/></button></div></div>) : <p className="text-only-empty">Todavía no hay anotaciones en esta página.</p>}
            </div>
            <div className="text-only-tools">
              <label>Aumentar o reducir texto
                <select value={fontScale} onChange={event => setFontScale(Number(event.target.value))}>
                  <option value={0.9}>90 %</option><option value={1}>100 %</option><option value={1.15}>115 %</option><option value={1.3}>130 %</option>
                </select>
              </label>
              <button type="button" disabled={!notes.length} onClick={exportText}><Download size={17}/> Exportar cuaderno</button>
              <a href={config.textUrl} download={config.downloadTextName || 'lionetti-texto-academico.txt'}><FileText size={16}/> Descargar texto</a>
            </div>
          </aside>
        </div>
        <footer className="text-only-footer">
          <span>{notice || 'Las notas y el progreso se guardan solamente en este navegador.'}</span>
          <span>{config.footerLabel || 'Edición solo de lectura · Sin audio'}</span>
        </footer>
      </div>
    </dialog>
  </>;
}

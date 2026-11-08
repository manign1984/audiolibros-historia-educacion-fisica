import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Download, FileText, NotebookPen, Save, Trash2, X } from 'lucide-react';
import CanonicalReadingEntry from './CanonicalReadingEntry.jsx';
import './text-only-reader.css';

const retrieve = (key, fallback) => {
  try { const raw = localStorage.getItem(key); return raw === null ? fallback : JSON.parse(raw); }
  catch { return fallback; }
};

const TOC = [
  { title: 'Apertura · Educar al soberano', term: 'La Argentina a partir de 1880' },
  { title: 'Civilización y estabilidad republicana', term: 'Garantizar el triunfo de la civilización' },
  { title: 'Argentinizar a la sociedad civil', term: 'Educar para “argentinizar”' },
  { title: 'Virtud pública y moral cívica', term: 'Formar en la virtud pública y la moral cívica' },
  { title: 'Consideraciones finales', term: 'Consideraciones finales' },
  { title: 'Notas del artículo', term: '(*) Agradezco' },
  { title: 'Bibliografía', term: 'BIBLIOGRAFIA' },
];

function download(name, contents, type) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function preparePages(raw) {
  return raw.split('\f').map((text) => text.replace(/\r/g, '').replace(/\n\s*\d+\s*$/, '').trim()).filter(Boolean);
}

function paragraphsOf(pageText) {
  return pageText.split(/\n\s*\n/g).map(text => text.replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ').trim()).filter(Boolean);
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
  const [notes, setNotes] = useState(() => retrieve(config.storage.notesKey, []));
  const [draft, setDraft] = useState('');
  const [notice, setNotice] = useState('');
  const [fontScale, setFontScale] = useState(1);
  const dialog = useRef(null);
  const article = useRef(null);
  const openButton = useRef(null);
  const pages = useMemo(() => preparePages(raw), [raw]);
  const safePage = Math.min(page, Math.max(0, pages.length - 1));
  const toc = useMemo(() => TOC.map(item => ({ ...item, page: pages.findIndex(text => text.includes(item.term)) })).filter(item => item.page >= 0), [pages]);
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
    try { localStorage.setItem(config.storage.stateKey, JSON.stringify(safePage)); }
    catch { /* El progreso se mantiene en memoria. */ }
  }, [safePage, config.storage.stateKey]);

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
    setPage(Math.max(0, Math.min(pages.length - 1, index)));
    article.current?.scrollTo({ top: 0 });
    setNotice('');
  };
  const save = () => {
    const value = draft.trim();
    if (!value) return;
    setNotes(previous => [...previous, { id: String(Date.now()) + Math.random().toString(36).slice(2), page: safePage, text: value, createdAt: new Date().toISOString() }]);
    setDraft('');
    notify('Nota guardada en este navegador');
  };
  const remove = id => {
    setNotes(previous => previous.filter(note => note.id !== id));
    notify('Nota eliminada');
  };
  const exportText = () => download(
    'cuaderno-lionetti.txt',
    ['Cuaderno de lectura · Lucía Lionetti', ...notes.map((note, index) => `\n${index + 1}. Página ${note.page + 1}\n${note.text}\n`)].join('\n'),
    'text/plain;charset=utf-8',
  );
  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => openButton.current?.focus());
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
            {toc.map(item => <button key={item.term} type="button"
              className={safePage === item.page ? 'is-active' : ''}
              onClick={() => jump(item.page)}>{item.title}<small>Página {item.page + 1}</small></button>)}
            <a href={config.sourceUrl} target="_blank" rel="noreferrer">Consultar edición original</a>
          </nav>
          <main className="text-only-document" ref={article} tabIndex={0} aria-label="Texto académico íntegro">
            {error && <p role="alert">{error} <a href={config.sourceUrl} target="_blank" rel="noreferrer">Ver fuente</a></p>}
            {!raw && !error && <p role="status">Cargando texto académico…</p>}
            {pages.length > 0 && <>
              <div className="text-only-page-meta">Lucía Lionetti · Artículo de 2005 <span>Página {safePage + 1} de {pages.length}</span></div>
              <article style={{ '--text-scale': fontScale }}>
                {paragraphsOf(pages[safePage]).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              </article>
              <div className="text-only-page-actions">
                <button type="button" disabled={safePage === 0} onClick={() => jump(safePage - 1)}><ArrowLeft size={16}/> Anterior</button>
                <span>{safePage + 1} / {pages.length}</span>
                <button type="button" disabled={safePage === pages.length - 1} onClick={() => jump(safePage + 1)}>Siguiente <ArrowRight size={16}/></button>
              </div>
            </>}
          </main>
          <aside className="text-only-notes" aria-label="Cuaderno de anotaciones">
            <h3><NotebookPen size={18}/> Mi cuaderno <small>{notes.length}</small></h3>
            <label htmlFor="lionetti-note">Anotá sobre la página {safePage + 1}</label>
            <textarea id="lionetti-note" rows={5} value={draft} onChange={event => setDraft(event.target.value)} placeholder="Ideas, preguntas y relaciones para volver a pensar…"/>
            <button className="text-only-save" type="button" disabled={!draft.trim()} onClick={save}><Save size={16}/> Guardar nota</button>
            <div className="text-only-notelist">
              {currentNotes.length ? currentNotes.map(note => <div key={note.id} className="text-only-note"><p>{note.text}</p><button type="button" onClick={() => remove(note.id)} aria-label="Eliminar nota"><Trash2 size={16}/></button></div>) : <p className="text-only-empty">Todavía no hay anotaciones en esta página.</p>}
            </div>
            <div className="text-only-tools">
              <label>Aumentar o reducir texto
                <select value={fontScale} onChange={event => setFontScale(Number(event.target.value))}>
                  <option value={0.9}>90 %</option><option value={1}>100 %</option><option value={1.15}>115 %</option><option value={1.3}>130 %</option>
                </select>
              </label>
              <button type="button" disabled={!notes.length} onClick={exportText}><Download size={17}/> Exportar cuaderno</button>
              <a href={config.textUrl} download="lionetti-texto-academico.txt"><FileText size={16}/> Descargar texto</a>
            </div>
          </aside>
        </div>
        <footer className="text-only-footer">
          <span>{notice || 'Las notas y el progreso se guardan solamente en este navegador.'}</span>
          <span>Edición solo de lectura · Sin audio</span>
        </footer>
      </div>
    </dialog>
  </>;
}

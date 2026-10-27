import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, Bookmark, Check, ChevronLeft, ChevronRight, Clock3, Headphones, Library, Play, Search, X } from 'lucide-react';
import { catalog, collections, filterCatalog, resolveSitePath, citationAsPlainText } from './catalog.js';
import { formatDuration, readList, readProgress, saveList } from './libraryState.js';

const base = import.meta.env.BASE_URL;
const href = (path) => resolveSitePath(path, base);
const available = catalog.filter((entry) => entry.status === 'available');
const validIds = catalog.map((entry) => entry.id);

function usePersonalLibrary() {
  const [saved, setSaved] = useState(() => { try { return readList(window.localStorage, validIds); } catch { return []; } });
  const [notice, setNotice] = useState('');
  function toggle(entry) {
    const exists = saved.includes(entry.id);
    const next = exists ? saved.filter((id) => id !== entry.id) : [...saved, entry.id];
    setSaved(next);
    let persisted = false;
    try { persisted = saveList(window.localStorage, next); } catch { /* Browser storage may be unavailable. */ }
    setNotice(persisted ? `${exists ? 'Quitado de' : 'Agregado a'} Mi lista: ${entry.shortTitle}.` : 'La lista se mantiene en esta visita. Este navegador no permite guardarla.');
  }
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 4000);
    return () => clearTimeout(timer);
  }, [notice]);
  return { saved, toggle, notice };
}

export function Brand({ course = false }) {
  if (course) return <a className="brand brand--course" href={base} aria-label="Historia de la Educación Física, inicio"><span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span><span className="brand-course-title">Historia de la<span>Educación Física</span></span></a>;
  return <a className="brand" href={base} aria-label="Biblioteca +TEC, inicio"><span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span><span>Biblioteca<span className="brand-tec">+TEC</span></span></a>;
}

function Header({ view = 'home', onView }) {
  const items = [['home', 'Inicio'], ['explore', 'Explorar'], ['list', 'Mi lista']];
  return <header className="library-header"><div className="library-shell header-inner">
    <Brand course />
    <nav aria-label="Navegación principal">{items.map(([id, label]) => <a key={id} href={`${base}${id === 'home' ? '' : `?vista=${id}`}`} aria-current={view === id ? 'page' : undefined} onClick={onView ? (event) => { event.preventDefault(); onView(id); } : undefined}>{id === 'list' && <Bookmark size={15} aria-hidden="true" />}{label}</a>)}</nav>
    <a className="project-link" href={`${base}#proyecto`} aria-label="UNAHUR y +TEC: sobre el proyecto"><img className="project-logo project-logo--unahur" src={href('assets/logo-unahur.png')} width="1223" height="393" alt="Universidad Nacional de Hurlingham" /><img className="project-logo project-logo--tec" src={href('assets/logo-mas-tec.png')} width="1743" height="864" alt="+TEC" /></a>
  </div></header>;
}

function SaveButton({ entry, saved, toggle, label = false }) {
  const checked = saved.includes(entry.id);
  return <button type="button" className={`save-button ${label ? 'save-button--label' : ''} ${checked ? 'is-saved' : ''}`} aria-label={`${checked ? 'Quitar de' : 'Agregar a'} Mi lista: ${entry.shortTitle}`} aria-pressed={checked} onClick={() => toggle(entry)}>{checked ? <Check size={19} aria-hidden="true" /> : <Bookmark size={19} aria-hidden="true" />}{label && (checked ? 'En mi lista' : 'Mi lista')}</button>;
}

export function Cover({ entry, large = false }) {
  const collection = collections.find((item) => item.id === entry.collection);
  if (entry.artwork) return <div className={`cover cover--image ${large ? 'cover--large' : ''}`}><img src={href(entry.artwork)} alt="" loading="lazy" /><div className="cover-image-title"><span>{entry.author}</span><strong>{entry.shortTitle}</strong></div></div>;
  return <div className={`cover cover--type tone-${collection.color} variant-${entry.posterVariant} ${large ? 'cover--large' : ''}`} aria-hidden="true"><span className="cover-series">HISTORIA / EDUCACIÓN FÍSICA</span><span className="cover-shape" /><strong>{entry.shortTitle}</strong><span className="cover-bottom"><span>{entry.author.split(' · ')[0]}</span><span>{entry.year || 'LECTURAS'}</span></span></div>;
}

function WorkCard({ entry, saved, toggle, progress = 0 }) {
  const ready = entry.status === 'available';
  return <article className="work-card">
    <a className="work-card-cover" href={href(entry.path)} aria-label={`${ready ? 'Abrir recorrido' : 'Ver ficha'}: ${entry.title}`}><Cover entry={entry} /><span className={`status-badge ${ready ? 'status-badge--ready' : ''}`}>{ready ? <><Headphones size={12} aria-hidden="true" /> Leer + escuchar</> : 'En preparación'}</span><span className="cover-open" aria-hidden="true">{ready ? <Play size={19} fill="currentColor" /> : <ArrowRight size={20} />}</span></a>
    <div className="work-card-info"><div><p className="card-author">{entry.author}</p><h3><a href={href(entry.path)}>{entry.shortTitle}</a></h3></div><SaveButton entry={entry} saved={saved} toggle={toggle} /></div>
    <p className="card-meta">{ready ? <><Clock3 size={13} aria-hidden="true" /> {formatDuration(entry.duration)} de audio <span>·</span> Lectura sincronizada</> : <>{collections.find((item) => item.id === entry.collection).title}<span>·</span> Ficha bibliográfica</>}</p>
    {progress > 3 && <a className="card-progress" href={`${href(entry.path)}#lectura`} aria-label={`Continuar ${entry.shortTitle} desde ${formatDuration(progress)}`}><span><i style={{ width: `${progress / entry.duration * 100}%` }} /></span><small>Continuar desde {formatDuration(progress)} <ArrowRight size={13} aria-hidden="true" /></small></a>}
  </article>;
}

function Shelf({ title, eyebrow, entries, saved, toggle, progress = {}, id }) {
  const rail = useRef(null);
  const [limits, setLimits] = useState({ start: true, end: true });
  useEffect(() => {
    const element = rail.current;
    const update = () => setLimits({ start: element.scrollLeft < 2, end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 2 });
    update();
    element.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update); observer.observe(element);
    return () => { element.removeEventListener('scroll', update); observer.disconnect(); };
  }, [entries.length]);
  const move = (direction) => rail.current.scrollBy({ left: direction * rail.current.clientWidth * 0.85, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  return <section className={`shelf ${id === 'disponibles' ? 'shelf--featured' : ''}`} aria-labelledby={`${id}-title`}><div className="section-heading"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2 id={`${id}-title`}>{title}<span className="count" aria-label={`${entries.length} lecturas`}>{entries.length}</span></h2></div><div className="shelf-arrows"><button type="button" onClick={() => move(-1)} disabled={limits.start} aria-label={`Anteriores en ${title}`}><ChevronLeft size={19} /></button><button type="button" onClick={() => move(1)} disabled={limits.end} aria-label={`Siguientes en ${title}`}><ChevronRight size={19} /></button></div></div><div className="shelf-rail" ref={rail}>{entries.map((entry) => <WorkCard key={entry.id} entry={entry} saved={saved} toggle={toggle} progress={progress[entry.id]} />)}</div></section>;
}

function Hero({ saved, toggle }) {
  const [index, setIndex] = useState(0);
  const entry = available[index];
  return <section className={`hero hero--${entry.id}`} aria-labelledby="hero-title">
    <img className="hero-art" src={href(entry.artwork)} alt="" fetchPriority="high" />
    <div className="hero-shade" />
    <div className="library-shell hero-inner"><div className="hero-content" key={entry.id}><p className="eyebrow hero-eyebrow"><span /> HISTORIA DE LA EDUCACIÓN FÍSICA</p><p className="hero-author">UNA LECTURA CON {entry.author.toLocaleUpperCase('es')}</p><h1 id="hero-title">{index === 0 ? <>Educar al cuerpo<span>dentro y fuera del aula.</span></> : <>Renovación,<br />represión,<span>cooptación.</span></>}</h1><div className="hero-meta"><span className="available-dot">Disponible ahora</span><span>{formatDuration(entry.duration)} de audio</span><span>Texto + contexto</span></div><p className="hero-description">{entry.description}</p><div className="hero-actions"><a className="button button--primary" href={href(entry.path)}><Play size={17} fill="currentColor" aria-hidden="true" /> Leer y escuchar</a><SaveButton entry={entry} saved={saved} toggle={toggle} label /></div></div><div className="hero-bottom"><a href="#colecciones">Descubrí la biblioteca <ArrowDown size={15} aria-hidden="true" /></a><div className="hero-pagination" aria-label="Lecturas destacadas">{available.map((item, i) => <button type="button" key={item.id} aria-label={`Destacar ${item.shortTitle}`} aria-pressed={index === i} onClick={() => setIndex(i)}><span>{String(i + 1).padStart(2, '0')}</span><i /></button>)}</div></div></div>
  </section>;
}

export function ProjectFooter() {
  return <><section id="proyecto" className="project-section library-shell"><div><p className="eyebrow">UN PROYECTO +TEC · UNAHUR</p><h2>Otra forma de entrar<br />en la historia.</h2></div><div><p>Una biblioteca para leer, escuchar y volver a pensar la Educación Física. Cada recorrido reúne el texto, su autor y su contexto histórico, para acompañar el estudio a tu ritmo.</p><p className="muted">Los materiales se incorporan de manera progresiva. Las fichas marcadas “En preparación” todavía no tienen su recorrido de lectura y audio.</p></div></section><footer className="library-footer library-shell"><Brand /><p>Historia de la Educación y de la Educación Física</p><a href="#top">Volver arriba ↑</a></footer></>;
}

export default function LibraryHome() {
  const initialView = new URLSearchParams(window.location.search).get('vista');
  const [view, setView] = useState(['explore', 'list'].includes(initialView) ? initialView : 'home');
  const [query, setQuery] = useState('');
  const [collection, setCollection] = useState('all');
  const [status, setStatus] = useState('all');
  const { saved, toggle, notice } = usePersonalLibrary();
  const progress = useMemo(() => Object.fromEntries(available.map((entry) => { try { return [entry.id, readProgress(window.localStorage, entry)]; } catch { return [entry.id, 0]; } })), []);
  const continuing = available.filter((entry) => progress[entry.id] > 3 && progress[entry.id] < entry.duration - 3);
  const isFiltered = query.trim() || collection !== 'all' || status !== 'all' || view !== 'home';
  const entries = useMemo(() => filterCatalog(catalog, query).filter((entry) => (collection === 'all' || collection === entry.collection) && (status === 'all' || status === entry.status) && (view !== 'list' || saved.includes(entry.id))), [query, collection, status, view, saved]);
  function changeView(next) {
    setView(next); setQuery(''); setCollection('all'); setStatus('all');
    const url = new URL(window.location.href); url.hash = ''; next === 'home' ? url.searchParams.delete('vista') : url.searchParams.set('vista', next);
    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  useEffect(() => {
    const sync = () => { const next = new URLSearchParams(window.location.search).get('vista'); setView(['explore', 'list'].includes(next) ? next : 'home'); setQuery(''); setCollection('all'); setStatus('all'); };
    window.addEventListener('popstate', sync); return () => window.removeEventListener('popstate', sync);
  }, []);
  const resetFilters = () => { setQuery(''); setCollection('all'); setStatus('all'); };
  return <div className="library-page" id="top"><a className="skip-link" href="#catalogo">Saltar al catálogo</a><Header view={view} onView={changeView} /><main>
    {view === 'home' ? <Hero saved={saved} toggle={toggle} /> : <section className="library-shell page-intro"><p className="eyebrow">TU BIBLIOTECA DE HISTORIA</p><h1>{view === 'list' ? 'Mi lista.' : 'Cada lectura, un recorrido.'}</h1><p>{view === 'list' ? 'Tus lecturas guardadas en este navegador. Sin cuentas, a tu ritmo.' : 'Explorá autores, temas y períodos. Encontrá tu próxima lectura.'}</p></section>}
    <div className="library-shell catalog-area" id="catalogo">
      {view === 'home' && <section className="collections" id="colecciones" aria-label="Colecciones temáticas">{collections.map((item) => <button type="button" key={item.id} className={`collection-tile tone-${item.color} ${collection === item.id ? 'is-selected' : ''}`} aria-pressed={collection === item.id} onClick={() => setCollection(collection === item.id ? 'all' : item.id)}><span className="collection-period">{item.period}</span><strong>{item.title}</strong><span className="collection-number" aria-hidden="true">{item.mark}</span><ArrowRight size={16} aria-hidden="true" /></button>)}</section>}
      <section className="catalog-tools" aria-label="Buscar y filtrar lecturas"><div className="search-field"><Search size={19} aria-hidden="true" /><label className="sr-only" htmlFor="catalog-search">Buscar por título, autor o tema</label><input id="catalog-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscá un título, autor o tema" autoComplete="off" />{query && <button type="button" onClick={() => setQuery('')} aria-label="Limpiar búsqueda"><X size={17} /></button>}</div><div className="filter-selects"><label><span className="sr-only">Colección</span><select value={collection} onChange={(event) => setCollection(event.target.value)}><option value="all">Todos los períodos</option>{collections.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label><label><span className="sr-only">Disponibilidad</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">Todos los materiales</option><option value="available">Leer y escuchar</option><option value="preparation">En preparación</option></select></label></div></section>
      {isFiltered ? <section className="results" aria-labelledby="results-title"><div className="section-heading"><h2 id="results-title">{query ? `Resultados para “${query}”` : collection !== 'all' ? collections.find((item) => item.id === collection).title : view === 'list' ? 'Lecturas guardadas' : 'Todo el catálogo'}</h2><span className="result-count" role="status">{entries.length} {entries.length === 1 ? 'lectura' : 'lecturas'}</span></div>{(query || collection !== 'all' || status !== 'all') && <button type="button" className="reset-filters" onClick={resetFilters}><X size={14} /> Limpiar filtros</button>}{entries.length ? <div className="catalog-grid">{entries.map((entry) => <WorkCard key={entry.id} entry={entry} saved={saved} toggle={toggle} progress={progress[entry.id]} />)}</div> : <div className="empty-state"><Library size={36} aria-hidden="true" /><h3>{view === 'list' && !saved.length ? 'Tu próxima lectura empieza acá.' : 'No encontramos lecturas con esos filtros.'}</h3><p>{view === 'list' && !saved.length ? 'Usá el marcador de cualquier tarjeta para sumarla a tu lista.' : 'Probá con un apellido, parte del título u otro período.'}</p><button className="button button--primary" type="button" onClick={() => changeView('explore')}>Explorar el catálogo <ArrowRight size={16} /></button></div>}</section> : <>
        {continuing.length > 0 && <Shelf id="continuar" title="Seguí donde dejaste" entries={continuing} saved={saved} toggle={toggle} progress={progress} />}
        <Shelf id="disponibles" title="Para leer y escuchar" eyebrow="DALE PLAY A LA HISTORIA" entries={available} saved={saved} toggle={toggle} progress={progress} />
        <div className="catalog-divider"><p><span>{catalog.length}</span> lecturas, muchas formas de mirar.</p><button type="button" onClick={() => changeView('explore')}>Ver todo el catálogo <ArrowRight size={16} aria-hidden="true" /></button></div>
        {collections.map((item) => <Shelf key={item.id} id={item.id} title={item.title} eyebrow={item.period} entries={catalog.filter((entry) => entry.collection === item.id)} saved={saved} toggle={toggle} />)}
      </>}
    </div>
  </main><ProjectFooter /><div className={`toast ${notice ? 'is-visible' : ''}`} role="status" aria-live="polite">{notice}</div></div>;
}

export function WorkPage({ entry }) {
  const { saved, toggle, notice } = usePersonalLibrary();
  const collection = collections.find((item) => item.id === entry.collection);
  const related = catalog.filter((item) => item.collection === entry.collection && item.id !== entry.id).slice(0, 4);
  useEffect(() => { document.title = `${entry.shortTitle} · Biblioteca +TEC`; }, [entry]);
  return <div className="library-page" id="top"><a className="skip-link" href="#ficha">Saltar a la ficha</a><Header view="" /><main className="library-shell work-page"><a className="back-link" href={base}><ArrowLeft size={16} /> Volver a la biblioteca</a><section className="work-intro" id="ficha"><Cover entry={entry} large /><div><p className="eyebrow">{collection.title}</p><span className="detail-status">RECORRIDO EN PREPARACIÓN</span><h1>{entry.title}</h1><p className="detail-author">{entry.author}</p><p className="muted">{entry.year ? `Publicación · ${entry.year}` : 'Ficha bibliográfica'}</p><SaveButton entry={entry} saved={saved} toggle={toggle} label /></div></section><div className="work-details"><section><p className="eyebrow">SOBRE ESTA LECTURA</p><h2>Un espacio para volver al texto.</h2><p>Esta lectura ya tiene su lugar en la biblioteca. Su recorrido de autor, contexto histórico y lectura acompañada se irá incorporando a medida que los materiales estén disponibles.</p><p className="preparation-note"><Clock3 size={20} aria-hidden="true" /><span>El texto y el audiolibro todavía no están publicados en este espacio.</span></p></section><section className="reference-panel"><h2>Referencia bibliográfica</h2><p>{citationAsPlainText(entry)}</p></section></div>{related.length > 0 && <Shelf id="relacionadas" title="En la misma colección" entries={related} saved={saved} toggle={toggle} />}</main><ProjectFooter /><div className={`toast ${notice ? 'is-visible' : ''}`} role="status" aria-live="polite">{notice}</div></div>;
}

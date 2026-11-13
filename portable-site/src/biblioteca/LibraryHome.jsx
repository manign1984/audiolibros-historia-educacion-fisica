import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, BookOpen, Bookmark, Check, ChevronLeft, ChevronRight, Clock3, Headphones, Library, Pause, Play, Search, X } from 'lucide-react';
import { catalog, workRegistry, programGroups, filterCatalog, resolveSitePath, citationAsPlainText, canReadAndListen, matchesAvailability } from './catalog.js';
import { formatDuration, readList, readProgress, saveList } from './libraryState.js';

const base = import.meta.env.BASE_URL;
const href = (path) => resolveSitePath(path, base);
const readable = catalog.filter((entry) => canReadAndListen(entry) || entry.status === 'text');
const validIds = workRegistry.map((entry) => entry.id);

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
  const headerRef = useRef(null);
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return undefined;
    // El alto útil de Inicio se calcula a partir del encabezado real,
    // incluidas las dos filas de navegación en pantallas estrechas.
    const updateHeight = () => {
      document.documentElement.style.setProperty('--library-header-height', `${header.getBoundingClientRect().height}px`);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);
  const items = [['home', 'Inicio'], ['explore', 'Explorar'], ['list', 'Mi lista']];
  return <header className="library-header" ref={headerRef}><div className="library-shell header-inner">
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
  if (entry.artwork) return <div className={`cover cover--image ${large ? 'cover--large' : ''}`}><img src={href(entry.artwork)} alt="" loading="lazy" /><div className="cover-image-title"><span>{entry.author}</span><strong>{entry.shortTitle}</strong></div></div>;
  return <div className={`cover cover--type tone-${entry.coverTone} variant-${entry.posterVariant} ${large ? 'cover--large' : ''}`} aria-hidden="true"><span className="cover-series">HISTORIA / EDUCACIÓN FÍSICA</span><span className="cover-shape" /><strong>{entry.shortTitle}</strong><span className="cover-bottom"><span>{entry.author.split(' · ')[0]}</span><span>{entry.year || 'LECTURAS'}</span></span></div>;
}

function WorkCard({ entry, saved, toggle, progress = 0 }) {
  const ready = entry.status === 'available';
  const review = entry.status === 'review';
  const textOnly = entry.status === 'text';
  const readableWork = canReadAndListen(entry) || textOnly;
  const editorialLanding = entry.editorialLanding === true;
  const continuation = entry.cardContinuation?.trim() || '';
  return <article className="work-card">
    <a className="work-card-cover" href={href(entry.path)} aria-label={`${readableWork ? 'Abrir recorrido' : (editorialLanding ? 'Explorar recorrido' : 'Ver ficha')}: ${entry.author}. ${entry.title}`}>
      <Cover entry={entry} />
      <span className="status-badge status-badge--ready"><Headphones size={12} aria-hidden="true" /> Leer + escuchar</span>
      <span className="cover-open" aria-hidden="true">{textOnly ? <BookOpen size={19} /> : readableWork ? <Play size={19} fill="currentColor" /> : <ArrowRight size={20} />}</span>
    </a>
    <div className={`work-card-info ${continuation ? '' : 'work-card-info--no-continuation'}`}>
      <div className="work-card-title">
        {continuation
          ? <h3 className="card-continuation"><a href={href(entry.path)} aria-label={`Abrir ${entry.author}. ${entry.title}`}>{continuation}</a></h3>
          : <h3 className="sr-only">{entry.author}. {entry.title}</h3>}
      </div>
      <SaveButton entry={entry} saved={saved} toggle={toggle} />
    </div>
    <p className="card-meta">{ready ? <><Clock3 size={13} aria-hidden="true" /> {formatDuration(entry.duration)} de audio <span>·</span> {entry.readingDetail || 'Lectura sincronizada'}</> : review ? <><Clock3 size={13} aria-hidden="true" /> {entry.historicalPeriod} <span>·</span> {formatDuration(entry.duration)} de audio</> : textOnly ? <><BookOpen size={13} aria-hidden="true" /> Lectura completa <span>·</span> Cuaderno de notas</> : editorialLanding ? <><BookOpen size={13} aria-hidden="true" /> Contexto histórico <span>·</span> Acceso a edición editorial</> : <>Ficha bibliográfica</>}</p>
    {!textOnly && readableWork && progress > 3 && <a className="card-progress" href={`${href(entry.path)}#lectura`} aria-label={`Continuar ${entry.shortTitle} desde ${formatDuration(progress)}`}><span><i style={{ width: `${progress / entry.duration * 100}%` }} /></span><small>Continuar desde {formatDuration(progress)} <ArrowRight size={13} aria-hidden="true" /></small></a>}
  </article>;
}

function Shelf({ title, entries, saved, toggle, progress = {}, id }) {
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
  return <section className="shelf" aria-labelledby={`${id}-title`}><div className="section-heading"><div><h2 id={`${id}-title`}>{title}<span className="count" aria-label={`${entries.length} lecturas`}>{entries.length}</span></h2></div><div className="shelf-arrows"><button type="button" onClick={() => move(-1)} disabled={limits.start} aria-label={`Anteriores en ${title}`}><ChevronLeft size={19} /></button><button type="button" onClick={() => move(1)} disabled={limits.end} aria-label={`Siguientes en ${title}`}><ChevronRight size={19} /></button></div></div><div className="shelf-rail" ref={rail}>{entries.map((entry) => <WorkCard key={entry.id} entry={entry} saved={saved} toggle={toggle} progress={progress[entry.id]} />)}</div></section>;
}

const HERO_ROTATION_MS = 10_000;
const HERO_CROSSFADE_MS = 700;

// Cortes editoriales para títulos cuyo primer enunciado es largo o no tiene separador.
const heroTitleLead = {
  'levoratti-gimnasia-1958-1968': 'La educación física y la gimnasia',
  'levoratti-debates-ef': 'Los debates de la Educación Física y los enfoques de las ciencias sociales:',
  'thwaites-rey-democracia-argentina': 'La democracia argentina',
};

function HeroTitle({ entry }) {
  const title = entry.title;
  const lead = heroTitleLead[entry.id];
  const separator = /[.:?] (?=\S)/.exec(title);
  const split = lead && title.startsWith(lead + ' ')
    ? lead.length
    : separator ? separator.index + 1 : title.length;
  const subtitle = title.slice(split).trimStart();

  return <h1 id="hero-title" className={split > 46 ? 'hero-title--long' : undefined}>
    {title.slice(0, split)}{subtitle && <> <span>{subtitle}</span></>}
  </h1>;
}

function Hero({ saved, toggle }) {
  const [index, setIndex] = useState(0);
  const contentRef = useRef(null);
  const [contentOverflows, setContentOverflows] = useState(false);

  useEffect(() => {
    const content = contentRef.current;
    content.scrollTop = 0;
    const measure = () => setContentOverflows(content.scrollHeight > content.clientHeight + 1);
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    observer.observe(content.querySelector('.hero-copy'));
    observer.observe(content.querySelector('.hero-actions'));
    measure();
    return () => observer.disconnect();
  }, [index]);

  const [pausedByUser, setPausedByUser] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReducedMotion(media.matches);
    media.addEventListener('change', syncMotion);
    return () => media.removeEventListener('change', syncMotion);
  }, []);

  const rotating = catalog.length > 1 && !pausedByUser && !reducedMotion;

  useEffect(() => {
    if (!rotating) return undefined;
    const timer = window.setTimeout(
      () => setIndex((current) => (current + 1) % catalog.length),
      HERO_ROTATION_MS,
    );
    return () => window.clearTimeout(timer);
  }, [index, rotating]);

  const entry = catalog[index];
  const hasAudio = canReadAndListen(entry);
  const textOnly = entry.status === 'text';
  const action = entry.heroAction ?? (hasAudio ? 'Leer y escuchar' : textOnly ? 'Leer el texto' : 'Ver ficha bibliográfica');
  const ActionIcon = hasAudio ? Play : textOnly ? BookOpen : ArrowRight;
  return <section
    className={`hero hero--${entry.id} ${rotating ? 'hero--autoplay' : ''}`}
    aria-label="Lecturas destacadas"
    aria-roledescription="carrusel"
    style={{ '--hero-rotation-duration': `${HERO_ROTATION_MS}ms`, '--hero-fade-duration': `${HERO_CROSSFADE_MS}ms` }}
  >
    {catalog.map((item, i) => {
      const artwork = item.heroArtwork ?? item.artwork;
      const imageSrc = /^https?:\/\//i.test(artwork ?? '') ? artwork : href(artwork);
      const artClass = `hero-art ${i === index ? 'is-active' : ''}`;
      return artwork ? <img
        key={item.id}
        className={artClass}
        src={imageSrc}
        alt=""
        aria-hidden="true"
        loading={i === 0 ? 'eager' : 'lazy'}
        fetchPriority={i === 0 ? 'high' : 'low'}
      /> : <div key={item.id} className={`${artClass} hero-art--type tone-${item.coverTone}`} aria-hidden="true" />;
    })}
    <div className="hero-shade" />
    {entry.heroCaption && <p className="hero-image-caption hero-image-caption--photo"><span className="sr-only">Epígrafe de la imagen: </span>{entry.heroCaption}</p>}
    <div className="library-shell hero-inner">
      <div className="hero-content" ref={contentRef} tabIndex={contentOverflows ? 0 : undefined} aria-live={rotating ? 'off' : 'polite'} aria-atomic="true">
        <div className="hero-copy" key={entry.id}>
          <p className="hero-author">{entry.author.toLocaleUpperCase('es')}</p>
          <HeroTitle entry={entry} />
          <div className="hero-meta">
            {hasAudio ? <><span className="available-dot">Disponible ahora</span><span>{formatDuration(entry.duration)} de audio</span><span>Texto + contexto</span></>
              : textOnly ? <><span>Lectura completa</span><span>Cuaderno de notas</span></>
              : <span>{entry.year}</span>}
          </div>
          {entry.description && <p className="hero-description">{entry.description}</p>}
          {entry.heroCaption && <p className="hero-image-caption hero-image-caption--inline"><span className="sr-only">Epígrafe de la imagen: </span>{entry.heroCaption}</p>}
        </div>
        <div className="hero-actions">
          <a className="button button--primary" href={href(entry.path)}><ActionIcon size={17} fill={hasAudio ? "currentColor" : "none"} aria-hidden="true" /> {action}</a>
          <SaveButton entry={entry} saved={saved} toggle={toggle} label />
        </div>
      </div>
      <div className="hero-bottom">
        <a href="#catalogo">Descubrí la biblioteca <ArrowDown size={15} aria-hidden="true" /></a>
        <div className="hero-pagination" role="group" aria-label="Elegir lectura destacada y controlar la rotación">
          <div className="hero-pagination-pages">
            {catalog.map((item, i) => <button
              type="button"
              key={item.id}
              aria-label={`Mostrar ${item.shortTitle}`}
              aria-pressed={index === i}
              onClick={() => setIndex(i)}
            ><span>{String(i + 1).padStart(2, '0')}</span><i aria-hidden="true" /></button>)}
          </div>
          <button
            type="button"
            className="hero-rotation-toggle"
            aria-label={reducedMotion ? 'Rotación automática desactivada por preferencia de movimiento reducido' : pausedByUser ? 'Reanudar rotación automática' : 'Pausar rotación automática'}
            title={reducedMotion ? 'Rotación desactivada por movimiento reducido' : pausedByUser ? 'Reanudar rotación' : 'Pausar rotación'}
            disabled={reducedMotion}
            onClick={() => setPausedByUser((value) => !value)}
          >{pausedByUser || reducedMotion ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}</button>
        </div>
      </div>
    </div>
  </section>;
}

export function ProjectFooter() {
  return <><section id="proyecto" className="project-section library-shell"><div><p className="eyebrow">UN PROYECTO +TEC · UNAHUR</p><h2>Otra forma de entrar<br />en la historia.</h2></div><div><p>Una biblioteca para leer, escuchar y volver a pensar la Educación Física. Cada recorrido reúne el texto, su autor y su contexto histórico, para acompañar el estudio a tu ritmo.</p></div></section><footer className="library-footer library-shell"><Brand /><p>Historia de la Educación y de la Educación Física</p><a href="#top">Volver arriba ↑</a></footer></>;
}

export default function LibraryHome() {
  const initialView = new URLSearchParams(window.location.search).get('vista');
  const [view, setView] = useState(['explore', 'list'].includes(initialView) ? initialView : 'home');
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState('author');
  const [status, setStatus] = useState('all');
  const { saved, toggle, notice } = usePersonalLibrary();
  const progress = useMemo(() => Object.fromEntries(readable.map((entry) => { try { return [entry.id, readProgress(window.localStorage, entry)]; } catch { return [entry.id, 0]; } })), []);
  const continuing = readable.filter((entry) => progress[entry.id] > 3 && progress[entry.id] < entry.duration - 3);
  const entries = useMemo(
    () => filterCatalog(catalog, query).filter((entry) =>
      matchesAvailability(entry, status) && (view !== 'list' || saved.includes(entry.id))),
    [query, status, view, saved],
  );
  const renderCards = (works) => <div className="catalog-grid">
    {works.map((entry) => <WorkCard key={entry.id} entry={entry} saved={saved} toggle={toggle} progress={progress[entry.id]} />)}
  </div>;
  function changeView(next) {
    setView(next); setQuery(''); setStatus('all');
    const url = new URL(window.location.href); url.hash = ''; next === 'home' ? url.searchParams.delete('vista') : url.searchParams.set('vista', next);
    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  useEffect(() => {
    const sync = () => { const next = new URLSearchParams(window.location.search).get('vista'); setView(['explore', 'list'].includes(next) ? next : 'home'); setQuery(''); setStatus('all'); };
    window.addEventListener('popstate', sync); return () => window.removeEventListener('popstate', sync);
  }, []);
  const resetFilters = () => { setQuery(''); setStatus('all'); };
  return <div className="library-page" id="top"><a className="skip-link" href="#catalogo">Saltar al catálogo</a><Header view={view} onView={changeView} /><main>
    {view === 'home' ? <Hero saved={saved} toggle={toggle} /> : <section className="library-shell page-intro"><p className="eyebrow">TU BIBLIOTECA DE HISTORIA</p><h1>{view === 'list' ? 'Mi lista.' : 'Cada lectura, un recorrido.'}</h1><p>{view === 'list' ? 'Tus lecturas guardadas en este navegador. Sin cuentas, a tu ritmo.' : 'Explorá las lecturas por autor o unidad del programa.'}</p></section>}
    <div className="library-shell catalog-area" id="catalogo">
      {view === 'home' && continuing.length > 0 && <Shelf id="continuar" title="Seguí donde dejaste" entries={continuing} saved={saved} toggle={toggle} progress={progress} />}
      <section className="results" aria-labelledby="results-title">
        <div className="section-heading">
          <h2 id="results-title">{view === 'list' ? 'Lecturas guardadas' : 'Todo el catálogo'}</h2>
          <span className="result-count" role="status">{entries.length} {entries.length === 1 ? 'lectura' : 'lecturas'}</span>
        </div>
        <div className="catalog-tools">
          <div className="search-field">
            <Search size={19} aria-hidden="true" />
            <label className="sr-only" htmlFor="catalog-search">Buscar por título o autor</label>
            <input id="catalog-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscá por título o autor" autoComplete="off" />
            {query && <button type="button" onClick={() => setQuery('')} aria-label="Limpiar búsqueda"><X size={17} /></button>}
          </div>
          <div className="filter-selects">
            <label className="catalog-order">
              <span>Ordenar por</span>
              <select value={order} onChange={(event) => setOrder(event.target.value)}>
                <option value="author">Apellido del autor</option>
                <option value="program">Unidad del programa</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Disponibilidad</span>
              <select value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="all">Todos los materiales</option>
                <option value="available">Leer y escuchar</option>
                <option value="text">Solo lectura</option>
                <option value="review">Edición en revisión</option>
                <option value="preparation">En preparación</option>
              </select>
            </label>
          </div>
        </div>
        {(query || status !== 'all') && <button type="button" className="reset-filters" onClick={resetFilters}><X size={14} /> Limpiar filtros</button>}
        {entries.length === 0 ? <div className="empty-state">
          <Library size={36} aria-hidden="true" />
          <h3>{view === 'list' && !saved.length ? 'Tu próxima lectura empieza acá.' : 'No encontramos lecturas con esos filtros.'}</h3>
          <p>{view === 'list' && !saved.length ? 'Usá el marcador de cualquier tarjeta para sumarla a tu lista.' : 'Probá con un apellido o parte del título.'}</p>
          {view === 'list' && !saved.length && <button className="button button--primary" type="button" onClick={() => changeView('explore')}>Explorar el catálogo <ArrowRight size={16} /></button>}
        </div> : order === 'author' ? renderCards(entries) : programGroups.map((group) => {
          const works = entries.filter((entry) => entry.programGroup === group.id);
          return works.length > 0 && <section className="catalog-unit" key={group.id} aria-labelledby={`catalog-${group.id}`}>
            <h3 id={`catalog-${group.id}`}>{group.title}</h3>
            {group.subtitle && <p>{group.subtitle}</p>}
            {renderCards(works)}
          </section>;
        })}
      </section>
    </div>
  </main><ProjectFooter /><div className={`toast ${notice ? 'is-visible' : ''}`} role="status" aria-live="polite">{notice}</div></div>;
}

export function WorkPage({ entry }) {
  const { saved, toggle, notice } = usePersonalLibrary();
  const group = programGroups.find((item) => item.id === entry.programGroup);
  const relatedWork = catalog.find((item) => item.id === entry.relatedWorkId);
  const related = entry.programGroup === 'complementaria' ? [] : catalog.filter(
    (item) => item.programGroup === entry.programGroup && item.id !== entry.id,
  ).slice(0, 4);
  useEffect(() => { document.title = `${entry.shortTitle} · Biblioteca +TEC`; }, [entry]);

  return <div className="library-page" id="top">
    <a className="skip-link" href="#ficha">Saltar a la ficha</a>
    <Header view="" />
    <main className="library-shell work-page">
      <a className="back-link" href={base}><ArrowLeft size={16} /> Volver a la biblioteca</a>
      <section className="work-intro" id="ficha">
        <Cover entry={entry} large />
        <div>
          <p className="eyebrow">{group.title}</p>
          <span className="detail-status">{entry.publicationUrl ? 'EDICIÓN ORIGINAL' : 'RECORRIDO EN PREPARACIÓN'}</span>
          <h1>{entry.title}</h1>
          <p className="detail-author">{entry.author}</p>
          <p className="muted">{entry.year ? `Publicación · ${entry.year}` : 'Ficha bibliográfica'}</p>
          {entry.publicationUrl && <a className="button button--primary work-source-link" href={entry.publicationUrl}>
            <BookOpen size={17} aria-hidden="true" /> {entry.publicationLabel}
          </a>}
          <SaveButton entry={entry} saved={saved} toggle={toggle} label />
        </div>
      </section>
      <div className="work-details">
        {entry.publicationUrl ? <section>
          <p className="eyebrow">SOBRE ESTA LECTURA</p>
          <h2>Consultá el capítulo en su edición original</h2>
          <p>El enlace abre el libro completo. El capítulo comienza en la página 179 de la edición impresa.</p>
        </section> : <section>
          <p className="eyebrow">SOBRE ESTA LECTURA</p>
          <h2>Un espacio para volver al texto.</h2>
          <p>Esta lectura ya tiene su lugar en la biblioteca. Su recorrido de autor, contexto histórico y lectura acompañada se irá incorporando a medida que los materiales estén disponibles.</p>
          <p className="preparation-note"><Clock3 size={20} aria-hidden="true" /><span>Este recorrido de lectura todavía no está publicado.</span></p>
        </section>}
        <section className="reference-panel"><h2>Referencia bibliográfica</h2><p>{citationAsPlainText(entry)}</p></section>
      </div>
      {relatedWork && <Shelf id="lectura-relacionada" title="Otro recorrido sobre el INEF General Belgrano" entries={[relatedWork]} saved={saved} toggle={toggle} />}
      {related.length > 0 && <Shelf id="relacionadas" title="En la misma unidad" entries={related} saved={saved} toggle={toggle} />}
    </main>
    <ProjectFooter />
    <div className={`toast ${notice ? 'is-visible' : ''}`} role="status" aria-live="polite">{notice}</div>
  </div>;
}

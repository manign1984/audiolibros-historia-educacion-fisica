import { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Search, X } from 'lucide-react';
import {
  LIBRARY_CONFIG,
  alphabeticGroup,
  catalog,
  filterCatalog,
  resolveSitePath,
} from './catalog.js';

function ResultCount({ count, query }) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return <>{count} {count === 1 ? 'texto disponible' : 'textos disponibles'}</>;
  }

  return <>{count} {count === 1 ? 'resultado' : 'resultados'} para “{trimmedQuery}”</>;
}

function ApaReference({ entry }) {
  return (
    <p className="catalog-entry__citation">
      {entry.citation.beforeBook}{' '}
      <em>{entry.citation.bookTitle}</em>{' '}
      {entry.citation.afterBook}
    </p>
  );
}

function WorkThumbnail({ entry }) {
  return (
    <figure className="work-thumbnail">
      <img
        src={resolveSitePath(entry.thumbnail.src, import.meta.env.BASE_URL)}
        alt={entry.thumbnail.alt}
      />
      <figcaption>
        <span>{entry.thumbnail.year}</span>
        <strong>{entry.thumbnail.label}</strong>
      </figcaption>
    </figure>
  );
}

export default function LibraryHome() {
  const [query, setQuery] = useState('');
  const entries = useMemo(() => filterCatalog(catalog, query), [query]);

  return (
    <div className="library-page">
      <header className="library-header">
        <div className="library-shell library-header__inner">
          <a className="library-identity" href={import.meta.env.BASE_URL} aria-label="Página principal de la biblioteca">
            <span className="library-identity__mark" aria-hidden="true"><BookOpen size={22} /></span>
            <span>Biblioteca académica</span>
          </a>
          <p>Historia de la Educación · Historia de la Educación Física</p>
        </div>
      </header>

      <main className="library-shell">
        <section className="library-introduction" aria-labelledby="library-title">
          <p className="library-eyebrow">Catálogo abierto</p>
          <h1 id="library-title">{LIBRARY_CONFIG.name}</h1>
          <p>{LIBRARY_CONFIG.subtitle}</p>
        </section>

        <section className="library-search" aria-labelledby="catalog-search-label">
          <label id="catalog-search-label" htmlFor="catalog-search">Buscar en la biblioteca</label>
          <div className="library-search__field">
            <Search size={21} aria-hidden="true" />
            <input
              id="catalog-search"
              type="search"
              value={query}
              placeholder="Buscar por autor o título…"
              autoComplete="off"
              spellCheck="false"
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Limpiar búsqueda">
                <X size={18} aria-hidden="true" />
              </button>
            )}
          </div>
          <p className="library-search__count" role="status" aria-live="polite" aria-atomic="true">
            <ResultCount count={entries.length} query={query} />
          </p>
        </section>

        <section className="library-catalog" aria-labelledby="catalog-title">
          <header className="library-catalog__heading">
            <div>
              <p className="library-eyebrow">Listado bibliográfico</p>
              <h2 id="catalog-title">Textos disponibles</h2>
            </div>
            <p>Orden alfabético por apellido del primer autor.</p>
          </header>

          {entries.length > 0 ? (
            <ol className="catalog-list">
              {entries.map((entry, index) => {
                const letter = alphabeticGroup(entry);
                const previousLetter = index > 0 ? alphabeticGroup(entries[index - 1]) : null;

                return (
                  <li key={entry.id}>
                    {letter !== previousLetter && <h3 className="catalog-letter" aria-label={`Autores con ${letter}`}>{letter}</h3>}
                    <article className="catalog-entry">
                      <WorkThumbnail entry={entry} />
                      <div className="catalog-entry__content">
                        <p className="catalog-entry__author">{entry.authorDisplay}</p>
                        <ApaReference entry={entry} />
                        <a
                          className="catalog-entry__link"
                          href={resolveSitePath(entry.path, import.meta.env.BASE_URL)}
                          aria-label={`Leer y escuchar: ${entry.title}`}
                        >
                          Leer y escuchar <ArrowRight size={17} aria-hidden="true" />
                        </a>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="catalog-empty" role="status">
              <BookOpen size={27} aria-hidden="true" />
              <h3>No encontramos textos para esa búsqueda</h3>
              <p>Probá con otro autor, apellido o una parte del título.</p>
              <button type="button" onClick={() => setQuery('')}>Ver todo el catálogo</button>
            </div>
          )}
        </section>
      </main>

      <footer className="library-footer">
        <div className="library-shell">
          <p>{LIBRARY_CONFIG.name}</p>
          <span>Un proyecto académico en construcción.</span>
        </div>
      </footer>
    </div>
  );
}

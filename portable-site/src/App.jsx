'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileText,
  Headphones,
  History,
  Landmark,
  ShieldCheck,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { timeline } from './data.js';
import IntegratedReader from './IntegratedReader.jsx';
import { pineauReaderConfig } from './readerConfigs.js';
import { readingDocument } from './readingDocument.js';

const AUDIOBOOK_DRIVE_ID = '17w1Pw25aGLXu_cR9mRBZgIOnCG2qNAEm';
const AUDIOBOOK_DRIVE_URL = `https://drive.google.com/file/d/${AUDIOBOOK_DRIVE_ID}/view`;
const LIBRARY_HOME_URL = import.meta.env.BASE_URL;

const NAV_ITEMS = [
  ['inicio', 'Inicio'],
  ['autor', 'Autor'],
  ['contexto', 'Contexto'],
  ['lectura', 'Lectura'],
  ['creditos', 'Créditos'],
];

function useScrollState() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState('inicio');

  useEffect(() => {
    const updateScrollState = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);

      const readingLine = Math.min(Math.max(window.innerHeight * 0.18, 86), 160);
      let currentSection = NAV_ITEMS[0][0];

      NAV_ITEMS.forEach(([id]) => {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= readingLine) currentSection = id;
      });

      const creditsSection = document.getElementById('creditos');
      const creditsThreshold = Math.max(readingLine, window.innerHeight * 0.55);
      if (creditsSection && creditsSection.getBoundingClientRect().top <= creditsThreshold) {
        currentSection = NAV_ITEMS[NAV_ITEMS.length - 1][0];
      }

      setActive(currentSection);
    };

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    window.visualViewport?.addEventListener('resize', updateScrollState);

    return () => {
      window.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
      window.visualViewport?.removeEventListener('resize', updateScrollState);
    };
  }, []);

  return { progress, active };
}

function SectionHeading({ index, section, title, titleLines, mobileTitleLines, text, inverse = false }) {
  return (
    <header className={`section-heading ${inverse ? 'section-heading--inverse' : ''}`}>
      <p className="eyebrow section-label">Sección {index} · {section}</p>
      <h2 aria-label={title}>
        {titleLines ? (
          <span className="section-title-fixed">
            {titleLines.map((line) => <span key={line}>{line}</span>)}
          </span>
        ) : (
          <span className="section-title-full">{title}</span>
        )}
        {!titleLines && mobileTitleLines && (
          <span className="section-title-mobile" aria-hidden="true">
            {mobileTitleLines.map((line) => <span key={line}>{line}</span>)}
          </span>
        )}
      </h2>
      {text && <p className="section-lead">{text}</p>}
    </header>
  );
}

function TimelineTitle({ item }) {
  const lines = item.titleLines || [item.title];
  const longestLine = Math.max(...lines.map((line) => line.length));
  const fluidSize = `${Math.min(8, 130 / longestLine)}cqi`;

  return (
    <h3
      className="timeline-event__title"
      aria-label={item.title}
      style={{ '--timeline-title-fluid': fluidSize }}
    >
      {lines.map((line) => <span key={line}>{line}</span>)}
    </h3>
  );
}

function HistoricalCarousel() {
  const carouselRef = useRef(null);
  const trackRef = useRef(null);
  const yearsRef = useRef(null);
  const scrollFrameRef = useRef(null);
  const wheelDeltaRef = useRef(0);
  const wheelTimerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback((requestedIndex, behavior = 'smooth') => {
    const track = trackRef.current;
    if (!track) return;

    const index = Math.max(0, Math.min(timeline.length - 1, requestedIndex));
    const slide = track.querySelector(`[data-timeline-index="${index}"]`);
    if (!slide) return;

    track.scrollTo({ left: slide.offsetLeft, behavior });
    setActiveIndex(index);
  }, []);

  const updateActiveIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    window.cancelAnimationFrame(scrollFrameRef.current);
    scrollFrameRef.current = window.requestAnimationFrame(() => {
      const slides = Array.from(track.querySelectorAll('[data-timeline-index]'));
      if (!slides.length) return;

      const closest = slides.reduce(
        (best, slide, index) => {
          const distance = Math.abs(slide.offsetLeft - track.scrollLeft);
          return distance < best.distance ? { index, distance } : best;
        },
        { index: 0, distance: Number.POSITIVE_INFINITY },
      );

      setActiveIndex(closest.index);
    });
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    const track = trackRef.current;
    if (!carousel || !track) return undefined;

    const handleWheel = (event) => {
      const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const delta = horizontalIntent ? event.deltaX : event.deltaY;
      if (Math.abs(delta) < 1) return;

      const maxScroll = track.scrollWidth - track.clientWidth;
      const atStart = track.scrollLeft <= 1;
      const atEnd = track.scrollLeft >= maxScroll - 1;
      const leavingAtStart = delta < 0 && atStart;
      const leavingAtEnd = delta > 0 && atEnd;

      if (leavingAtStart || leavingAtEnd) return;

      event.preventDefault();
      wheelDeltaRef.current += delta;
      window.clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = window.setTimeout(() => {
        const slides = Array.from(track.querySelectorAll('[data-timeline-index]'));
        if (!slides.length) return;

        const closest = slides.reduce(
          (best, slide, index) => {
            const distance = Math.abs(slide.offsetLeft - track.scrollLeft);
            return distance < best.distance ? { index, distance } : best;
          },
          { index: 0, distance: Number.POSITIVE_INFINITY },
        );
        const direction = Math.sign(wheelDeltaRef.current);

        wheelDeltaRef.current = 0;
        if (direction) scrollToIndex(closest.index + direction);
      }, 90);
    };

    carousel.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      carousel.removeEventListener('wheel', handleWheel);
      window.cancelAnimationFrame(scrollFrameRef.current);
      window.clearTimeout(wheelTimerRef.current);
    };
  }, [scrollToIndex]);

  useEffect(() => {
    const years = yearsRef.current;
    const activeYear = years?.querySelector(`[data-year-index="${activeIndex}"]`);
    if (!years || !activeYear) return;

    const target = activeYear.offsetLeft - ((years.clientWidth - activeYear.offsetWidth) / 2);
    years.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [activeIndex]);

  const handleKeyDown = (event) => {
    const destinations = {
      ArrowLeft: activeIndex - 1,
      ArrowRight: activeIndex + 1,
      Home: 0,
      End: timeline.length - 1,
    };

    if (!(event.key in destinations)) return;
    event.preventDefault();
    scrollToIndex(destinations[event.key]);
  };

  const activeItem = timeline[activeIndex];
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === timeline.length - 1;

  return (
    <div
      ref={carouselRef}
      className="timeline-carousel"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Línea de tiempo histórica de 1929 a 1943"
    >
      <div className="timeline-carousel__viewport">
        <div
          id="historical-timeline-track"
          ref={trackRef}
          className="timeline-track"
          role="list"
          tabIndex="0"
          aria-label="Hitos históricos de 1929 a 1943"
          aria-describedby="timeline-navigation-hint"
          onScroll={updateActiveIndex}
          onKeyDown={handleKeyDown}
        >
          {timeline.map((item, index) => (
            <article
              key={item.id}
              role="listitem"
              aria-label={`${item.year}: ${item.title}`}
              data-timeline-index={index}
              className={`timeline-event ${item.id === 'reforma-1937' ? 'timeline-event--featured' : ''} ${item.id === 'golpe-1943' ? 'timeline-event--headline' : ''} ${item.cardClass || ''}`}
            >
              <div className="timeline-node" aria-hidden="true">
                <span className={item.year.length > 4 ? 'timeline-node__year timeline-node__year--range' : 'timeline-node__year'}>{item.year}</span>
                <i />
              </div>
              <figure className="timeline-event__visual">
                <img
                  className={item.imageClass || undefined}
                  src={item.image}
                  alt={item.imageAlt}
                  loading={index > 1 ? 'lazy' : 'eager'}
                />
                <figcaption>
                  <span>{item.imageCaption}</span>
                  <small>{item.imageCredit}</small>
                </figcaption>
              </figure>
              <div className="timeline-event__copy">
                <div className="timeline-event__meta">
                  <div className="timeline-event__tags">
                    <span className={`scope-tag scope-tag--${item.scope.toLowerCase()}`}>{item.scope}</span>
                    <span className="dimension-tag">{item.dimension}</span>
                  </div>
                  <div className="timeline-event__index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                <TimelineTitle item={item} />
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="timeline-controls" aria-label="Controles de la línea de tiempo">
        <button
          className="timeline-arrow"
          type="button"
          aria-label="Ir al hito anterior"
          aria-controls="historical-timeline-track"
          disabled={isFirst}
          onClick={() => scrollToIndex(activeIndex - 1)}
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </button>

        <div ref={yearsRef} className="timeline-years" aria-label="Elegir un hito por año">
          {timeline.map((item, index) => (
            <button
              key={`${item.id}-year`}
              type="button"
              data-year-index={index}
              className={`timeline-year ${index === activeIndex ? 'is-active' : ''}`}
              aria-label={`Ir a ${item.year}: ${item.title}`}
              aria-current={index === activeIndex ? 'step' : undefined}
              onClick={() => scrollToIndex(index)}
            >
              {item.year}
            </button>
          ))}
        </div>

        <button
          className="timeline-arrow"
          type="button"
          aria-label="Ir al hito siguiente"
          aria-controls="historical-timeline-track"
          disabled={isLast}
          onClick={() => scrollToIndex(activeIndex + 1)}
        >
          <ChevronRight size={22} aria-hidden="true" />
        </button>
      </div>

      <div className="timeline-carousel__status">
        <p aria-live="polite" aria-atomic="true">
          <strong>{activeItem.year}</strong>
          <span>{activeItem.title}</span>
          <small>{activeIndex + 1} / {timeline.length}</small>
        </p>
        <p id="timeline-navigation-hint" className={isLast ? 'is-exit-hint' : undefined}>
          {isLast
            ? 'Llegaste a 1943. Seguí desplazándote hacia abajo para continuar el recorrido.'
            : 'Deslizá hacia los costados o usá la rueda, el trackpad, las flechas o el teclado.'}
        </p>
      </div>
    </div>
  );
}

function TopBar({ soundOn, setSoundOn, progress, active }) {
  const roundedProgress = Math.round(progress);
  const activeLabel = NAV_ITEMS.find(([id]) => id === active)?.[1] || 'Inicio';

  return (
    <>
      <div className="reading-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Ir al inicio">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>
            <strong>1937</strong>
            <small>Reforma Fresco–Noble</small>
          </span>
        </a>
        <nav className="topnav topnav--desktop" aria-label="Secciones del recorrido">
          {NAV_ITEMS.map(([id, label]) => {
            const isActive = id === active;

            return (
              <a
                key={id}
                className={`topnav-link ${isActive ? 'is-active' : ''}`}
                href={`#${id}`}
                aria-current={isActive ? 'location' : undefined}
              >
                {label}
              </a>
            );
          })}
        </nav>
        <div
          className="topnav topnav--linear topnav--mobile"
          role="status"
          aria-live="polite"
          aria-label={`Sección actual: ${activeLabel}`}
        >
          <span className="topnav-current">{activeLabel}</span>
        </div>
        <button
          className="icon-button sound-button"
          type="button"
          onClick={() => setSoundOn((value) => !value)}
          aria-label={soundOn ? 'Desactivar sonidos' : 'Activar sonidos'}
          title={soundOn ? 'Sonidos activados' : 'Sonidos desactivados'}
        >
          {soundOn ? <Volume2 size={19} /> : <VolumeX size={19} />}
        </button>
      </header>
      <aside
        className="journey-progress"
        role="progressbar"
        aria-label={`Progreso del recorrido: ${roundedProgress}%`}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={roundedProgress}
        style={{ '--progress': `${roundedProgress * 3.6}deg` }}
      >
        <span className="journey-progress__dial">
          <strong>{roundedProgress}%</strong>
        </span>
        <span className="journey-progress__copy">
          <small>Recorrido</small>
          <b>{activeLabel}</b>
        </span>
      </aside>
    </>
  );
}

function Hero() {
  return (
    <section id="inicio" className="hero tracked-section">
      <div className="hero-radiance" aria-hidden="true" />
      <div className="hero-grid page-shell">
        <div className="hero-copy">
          <a className="work-library-link" href={LIBRARY_HOME_URL}>← Volver a la biblioteca</a>
          <p className="hero-kicker"><span>Provincia de Buenos Aires</span><span>1937</span></p>
          <h1>
            <span className="hero-title-line">La reforma educativa</span>
            {' '}
            <span className="hero-title-focus">Fresco–Noble</span>
          </h1>
          <p className="hero-subtitle">
            Renovación, represión y cooptación en la Reforma Fresco–Noble
          </p>
          <p className="hero-intro">
            Un recorrido para leer el trabajo de Pablo Pineau, reconstruir una época y poner en juego
            las tensiones de una reforma que quiso ser, al mismo tiempo, nueva, disciplinadora e
            inclusiva.
          </p>
          <div className="hero-meta" aria-label="Características de la experiencia">
            <span><Clock3 size={16} /> 35–50 min</span>
            <span><ShieldCheck size={16} /> Sin registro</span>
            <span><Volume2 size={16} /> Sonido opcional</span>
          </div>
        </div>
        <figure className="hero-monument">
          <div className="monument-frame">
            <img src="/assets/salamone-saldungaray.jpg" alt="Portal del Cementerio Municipal de Saldungaray, obra de Francisco Salamone" />
            <span className="monument-year" aria-hidden="true">37</span>
            <span className="monument-grid" aria-hidden="true" />
          </div>
          <figcaption>
            <strong>Una estética de Estado</strong>
            <span>
              Portal del Cementerio de Saldungaray: geometría, monumentalidad y futuro en la obra de Francisco Salamone.
              <small>Marcelo G. Morales · CC BY-SA 3.0</small>
            </span>
          </figcaption>
          <img
            className="hero-salamone-outline"
            src="/assets/salamone-cementerio-circular.png"
            alt=""
            aria-hidden="true"
            decoding="async"
          />
        </figure>
      </div>
      <a className="scroll-cue" href="#autor" aria-label="Continuar hacia el autor">
        <span>Comenzar recorrido</span>
        <ArrowDown size={18} />
      </a>
    </section>
  );
}

function AuthorSection() {
  return (
    <section id="autor" className="author-section tracked-section">
      <div className="page-shell author-grid">
        <div className="author-portrait-wrap">
          <div className="author-number" aria-hidden="true">P</div>
          <img className="author-portrait" src="/assets/pablo-pineau.webp" alt="Retrato de Pablo Pineau" />
          <p className="image-credit">Fotografía: Facultad de Filosofía y Letras, UBA.</p>
        </div>
        <div className="author-copy">
          <p className="eyebrow">El autor del texto</p>
          <h2>Pablo Pineau</h2>
          <p className="author-role">Historiador de la educación · Doctor en Educación</p>
          <p className="author-summary">
            Investiga la historia, la teoría y la política de la educación. Es profesor titular de
            Historia de la Educación Argentina y Latinoamericana en la Universidad de Buenos Aires y
            posee una extensa trayectoria en docencia, formación e investigación. Presidió la Sociedad
            Argentina de Historia de la Educación y dirigió el Departamento de Ciencias de la Educación
            de la UBA.
          </p>
          <div className="author-links">
            <a href="https://posgrado.filo.uba.ar/pineau-pablo" target="_blank" rel="noreferrer">
              Ver biografía académica <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContextSection() {
  return (
    <section id="contexto" className="context-section tracked-section">
      <div className="page-shell">
        <SectionHeading
          index="01"
          section="Contexto histórico"
          title="Situar la reforma educativa en su contexto histórico (1930-1943)"
          mobileTitleLines={['Situar la reforma', 'educativa en su', 'contexto histórico', '(1930-1943)']}
          text="La Reforma se inscribe en la restauración conservadora argentina y en un mundo de entreguerras. Para comprenderla, la política se cruza aquí con la economía, la vida cotidiana, la cultura, la ciencia y la tecnología."
          inverse
        />

        <div className="context-axes">
          <article>
            <span className="axis-icon"><Landmark size={24} /></span>
            <p className="eyebrow">Argentina · 1930–1943</p>
            <h3>Restauración conservadora</h3>
            <p>
              Golpe de Estado, fraude “patriótico”, restricciones democráticas y recomposición de las
              élites conviven con industrialización, obra pública y mayor intervención estatal.
            </p>
          </article>
          <article>
            <span className="axis-icon"><History size={24} /></span>
            <p className="eyebrow">Mundo · entreguerras</p>
            <h3>Crisis del orden liberal</h3>
            <p>
              La depresión iniciada en 1929, el ascenso de fascismos y nazismo, el militarismo y la
              expansión territorial tensan las democracias y anticipan la guerra mundial.
            </p>
          </article>
        </div>

        <div className="timeline-panel">
          <div className="timeline-legend">
            <div>
              <p className="eyebrow">Un recorrido por los principales eventos del período histórico</p>
              <p>Las tarjetas siguen el orden cronológico: cada año reúne su imagen, la fuente y la explicación del hito. Observá cómo procesos políticos, culturales, científicos y cotidianos se entrelazan alrededor de la Reforma.</p>
            </div>
            <div aria-label="Dimensiones de la línea de tiempo">
              <span>Política</span><span>Vida cotidiana</span><span>Cultura</span><span>Arte</span><span>Ciencia</span><span>Tecnología</span>
            </div>
          </div>
          <HistoricalCarousel />
        </div>

        <div className="actors-grid">
          <figure className="fresco-card">
            <img src="/assets/manuel-fresco.webp" alt="Retrato de Manuel Fresco" />
            <figcaption>
              <strong>Manuel A. Fresco</strong>
              <span>Gobernador bonaerense, 1936–1940</span>
              <small>Fotografía: Cámara de Diputados de la Nación, dominio público.</small>
            </figcaption>
          </figure>
          <figure className="fresco-card noble-card">
            <img src="/assets/roberto-noble.webp" alt="Roberto J. Noble leyendo un ejemplar del diario Clarín" />
            <figcaption>
              <strong>Roberto J. Noble</strong>
              <span>Ministro de Gobierno bonaerense · fundador del diario Clarín en 1945</span>
              <small>
                Figura central de la Reforma Fresco–Noble. Fotografía: Diario Clarín, 1945;
                dominio público en Argentina, vía Wikimedia Commons.
              </small>
            </figcaption>
          </figure>
          <aside className="salomone-note">
            <span className="vertical-word" aria-hidden="true">SALAMONE</span>
            <div>
              <p className="eyebrow">Arquitectura y narrativa</p>
              <h3>Un Estado que quiere hacerse visible</h3>
              <p>
                Entre 1936 y 1940, Francisco Salamone levantó decenas de municipalidades, mataderos y
                cementerios: torres, líneas rectas, simetría y escala monumental. Este sitio toma ese
                vocabulario como marco visual, no como celebración del régimen.
              </p>
              <a href="https://www.cultura.gob.ar/doce-monumentos-para-conocer-la-obra-de-francisco-salomone_3603/" target="_blank" rel="noreferrer">
                Conocer las obras <ExternalLink size={15} />
              </a>
            </div>
          </aside>
        </div>

        <section className="fresco-video" aria-labelledby="fresco-video-title">
          <div className="fresco-video__copy">
            <p className="eyebrow">Archivo audiovisual</p>
            <h3 id="fresco-video-title">Manuel Fresco, en Canal Encuentro</h3>
            <p>
              El audiovisual permite poner voz, gestos y conflicto político junto a la lectura. Miralo como una fuente de divulgación: registrá qué rasgos selecciona para construir al personaje y cuáles quedan fuera de cuadro.
            </p>
            <a href="https://www.youtube.com/watch?v=cbrqOu1pQU0" target="_blank" rel="noreferrer">
              Abrir video en YouTube <ExternalLink size={15} />
            </a>
          </div>
          <div className="fresco-video__frame">
            <iframe
              src="https://www.youtube-nocookie.com/embed/cbrqOu1pQU0?rel=0"
              title="Canal Encuentro: Manuel Fresco"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </section>
      </div>
    </section>
  );
}

function ReadingSection({ showToast }) {
  return (
    <section id="lectura" className="reading-section tracked-section">
      <div className="page-shell">
        <SectionHeading
          index="02"
          section="Lectura"
          title="El texto en el centro de los procesos de enseñanza y aprendizaje"
          titleLines={['El texto en el centro de', 'los procesos de', 'enseñanza y aprendizaje']}
          text="Leé el texto con la siguiente pregunta en mente: ¿cómo una reforma educativa nacida desde un gobierno conservador logra presentarse como la fundación de una pedagogía renovadora y reunir apoyos desde diferentes sectores de la comunidad educativa?"
        />

        <article className="reading-synopsis" aria-labelledby="reading-synopsis-title">
          <div className="reading-synopsis__label" aria-hidden="true">
            <span>Antes de abrir el texto</span>
            <b>01</b>
          </div>
          <div className="reading-synopsis__copy">
            <p className="eyebrow">Una entrada a la trama</p>
            <h3 id="reading-synopsis-title">Una promesa de renovación. Una disputa por el sentido de la escuela.</h3>
            <p>
              Una escuela acusada de haber olvidado el alma y el cuerpo del niño, de vivir de
              espaldas al trabajo y a la comunidad. Un gobierno conservador que promete fundarla de
              nuevo. Nuevas prácticas, apoyos inesperados y silencios impuestos entran en la escena
              de finales de la década del 30. Pineau reconstruye esa trama proponiendo abordar la
              reforma a partir de tres estrategias de acción complementarias: Renovar, Reprimir y
              Cooptar. Cada página obliga a mirar qué se renovó, quiénes fueron los “disciplinados” y
              cómo una combinación, que pareciera por momentos contradictoria, consiguió presentarse
              como sentido común y lograr una continuidad histórica con la cual actualmente convivimos.
            </p>
          </div>
        </article>

        <div className="reading-reader-stage">
          <IntegratedReader
            showToast={showToast}
            readingDocument={readingDocument}
            config={pineauReaderConfig}
          />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="creditos" className="site-footer credits-section tracked-section" aria-labelledby="credits-title">
      <div className="footer-salamone" aria-hidden="true">
        <img className="footer-salamone__inri" src="/assets/salamone-cementerio-inri.png" alt="" loading="lazy" decoding="async" />
        <img className="footer-salamone__frontal" src="/assets/salamone-dormitorio-frontal.png" alt="" loading="lazy" decoding="async" />
        <img className="footer-salamone__lateral" src="/assets/salamone-dormitorio-lateral.png" alt="" loading="lazy" decoding="async" />
        <img className="footer-salamone__matadero" src="/assets/salamone-matadero.png" alt="" loading="lazy" decoding="async" />
      </div>
      <div className="page-shell footer-grid">
        <div>
          <p className="eyebrow credits-label">Sección 03 · Créditos</p>
          <h2 id="credits-title">Leer el pasado para intervenir en el presente.</h2>
          <p>
            Este cierre reconoce los textos, archivos, instituciones y aportes que hicieron posible el
            recorrido. Las referencias siguen criterios de APA 7 y los créditos visuales conservan la
            procedencia y la licencia informadas por cada fuente.
          </p>
          <p className="footer-privacy">
            Experiencia educativa autónoma: no solicita datos personales ni envía respuestas.
          </p>
        </div>
        <div className="footer-links">
          <h3>Referencias bibliográficas y fuentes</h3>
          <a href="/assets/pineau-renovacion-represion-cooptacion.pdf" target="_blank" rel="noreferrer"><span>Pineau, P. (1999). Renovación, represión, cooptación: Las estrategias de la Reforma Fresco–Noble (Provincia de Buenos Aires, década del 30). En A. Ascolani (Comp.), <em>La educación en Argentina: Estudios de historia</em> (pp. 223–239). Ediciones del Arca.</span><FileText size={14} /></a>
          <a href={AUDIOBOOK_DRIVE_URL} target="_blank" rel="noreferrer"><span>Pineau, P. (1999). <em>Renovación, represión, cooptación</em> [Audiolibro].</span><Headphones size={14} /></a>
          <a href="https://revistas.unal.edu.co/index.php/hisysoc/article/view/28146" target="_blank" rel="noreferrer"><span>Cataño Balseiro, C. L. (2011). Jörn Rüsen y la conciencia histórica. <em>Historia y Sociedad</em>, (21), 223–245.</span><ExternalLink size={14} /></a>
          <a href="https://www.educ.ar/recursos/127077/1930-1943-la-decada-infame" target="_blank" rel="noreferrer"><span>Educ.ar. (2015). <em>1930–1943: La década infame</em> [Video].</span><ExternalLink size={14} /></a>
          <a href="https://posgrado.filo.uba.ar/pineau-pablo" target="_blank" rel="noreferrer"><span>Universidad de Buenos Aires, Facultad de Filosofía y Letras. (s. f.). <em>Pablo Pineau</em>.</span><ExternalLink size={14} /></a>
          <a href="https://history.state.gov/milestones/1921-1936/great-depression" target="_blank" rel="noreferrer"><span>Office of the Historian. (s. f.). <em>The Great Depression and U.S. foreign policy</em>.</span><ExternalLink size={14} /></a>
          <a href="https://encyclopedia.ushmm.org/content/en/article/the-nazi-rise-to-power" target="_blank" rel="noreferrer"><span>United States Holocaust Memorial Museum. (s. f.). <em>The Nazi rise to power</em>.</span><ExternalLink size={14} /></a>
          <a href="https://www.youtube.com/watch?v=cbrqOu1pQU0" target="_blank" rel="noreferrer"><span>Canal Encuentro. (s. f.). <em>Manuel Fresco</em> [Video].</span><ExternalLink size={14} /></a>
          <a href="https://ir.grupoclarin.com/historia/" target="_blank" rel="noreferrer"><span>Grupo Clarín. (s. f.). <em>Historia</em>.</span><ExternalLink size={14} /></a>
        </div>
        <div className="footer-credits">
          <h3>Derechos y agradecimientos</h3>
          <p>Cancha, banderas y jugadores: imágenes desarrolladas para la dinámica pedagógica original.</p>
          <p>Portal del Cementerio de Saldungaray: Marcelo G. Morales, CC BY-SA 3.0, Wikimedia Commons.</p>
          <p>Imágenes de la línea de tiempo: créditos y licencias indicados en cada hito.</p>
          <p>Portada de <em>La educación física: una innovación de mi gobierno</em> (1940): ejemplar aportado al proyecto.</p>
          <p>Manuel Fresco: Cámara de Diputados de la Nación, dominio público.</p>
          <p>Roberto Noble: Diario Clarín, 1945; dominio público en Argentina, vía Wikimedia Commons.</p>
          <p>Pablo Pineau: perfil académico de FFyL-UBA.</p>
          <p>Obras de Francisco Salamone en líneas: imágenes aportadas al proyecto para esta composición final.</p>
          <p>Agradecemos a quienes compartieron documentos, registros e imágenes para enriquecer esta experiencia pedagógica.</p>
        </div>
      </div>
      <div className="footer-bottom page-shell">
        <span>Diseño inspirado en la geometría monumental de Francisco Salamone.</span>
        <nav className="footer-bottom__links" aria-label="Enlaces de cierre">
          <a href={LIBRARY_HOME_URL}>← Volver a la biblioteca</a>
          <a href="#inicio">Volver arriba ↑</a>
        </nav>
      </div>
    </footer>
  );
}

export default function App() {
  const [soundOn, setSoundOn] = useState(true);
  const [toast, setToast] = useState('');
  const { progress, active } = useScrollState();
  const toastTimer = useRef(null);

  const showToast = useCallback((message) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2800);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  return (
    <>
      <TopBar soundOn={soundOn} setSoundOn={setSoundOn} progress={progress} active={active} />
      <main>
        <Hero />
        <AuthorSection />
        <ContextSection />
        <ReadingSection showToast={showToast} />
      </main>
      <Footer />
      <div className={`toast ${toast ? 'show' : ''}`} role="status" aria-live="polite">
        <CheckCircle2 size={18} /> {toast}
      </div>
    </>
  );
}

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clipboard,
  Clock3,
  Download,
  ExternalLink,
  FileText,
  Headphones,
  History,
  Landmark,
  Layers3,
  Lightbulb,
  LockKeyhole,
  Printer,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRound,
  Volume2,
  VolumeX,
  X,
  XCircle,
} from 'lucide-react';
import {
  diagnosisItems,
  genealogyThemes,
  players,
  strategies,
  timeline,
} from './data.js';
import IntegratedReader from './IntegratedReader.jsx';

const AUDIOBOOK_DRIVE_ID = '17w1Pw25aGLXu_cR9mRBZgIOnCG2qNAEm';
const AUDIOBOOK_DRIVE_URL = `https://drive.google.com/file/d/${AUDIOBOOK_DRIVE_ID}/view`;

const NAV_ITEMS = [
  ['inicio', 'Inicio'],
  ['autor', 'Autor'],
  ['contexto', 'Contexto'],
  ['lectura', 'Lectura'],
  ['partido', 'Partido'],
  ['genealogia', 'Conciencia histórica'],
  ['creditos', 'Créditos'],
];

const HYPOTHESIS_OPTIONS = [
  {
    id: 'importacion',
    text: 'La Reforma triunfó porque importó sin cambios un programa fascista europeo.',
  },
  {
    id: 'articulacion',
    text: 'La Reforma construyó una pedagogía hegemónica al combinar renovación, represión y cooptación.',
  },
  {
    id: 'fracaso',
    text: 'La Reforma fue un episodio aislado, sin capacidad de producir nuevas prácticas ni dejar huellas.',
  },
];

const BONUS_OPTIONS = [
  'reforma-deportes',
  'resiste-laicidad',
  'reforma-escalafon',
  'resiste-docente',
];

function useSound(enabled) {
  const contextRef = useRef(null);

  return useCallback(
    (kind = 'correct') => {
      if (!enabled || typeof window === 'undefined') return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!contextRef.current) contextRef.current = new AudioContext();
      const context = contextRef.current;
      if (context.state === 'suspended') context.resume();

      const now = context.currentTime;
      const master = context.createGain();
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(0.12, now + 0.015);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
      master.connect(context.destination);

      const notes = kind === 'correct' ? [523.25, 659.25, 783.99] : [196, 146.83];
      notes.forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = kind === 'correct' ? 'sine' : 'triangle';
        oscillator.frequency.setValueAtTime(frequency, now + index * 0.1);
        gain.gain.setValueAtTime(0.0001, now + index * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.7, now + index * 0.1 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.1 + 0.22);
        oscillator.connect(gain);
        gain.connect(master);
        oscillator.start(now + index * 0.1);
        oscillator.stop(now + index * 0.1 + 0.24);
      });
    },
    [enabled],
  );
}

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

function useLocalDraft() {
  const empty = { theme: 'deporte', past: '', present: '', future: '' };
  const [draft, setDraft] = useState(() => {
    if (typeof window === 'undefined') return empty;
    try {
      return JSON.parse(localStorage.getItem('fresco-noble-genealogia')) || empty;
    } catch {
      return empty;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fresco-noble-genealogia', JSON.stringify(draft));
    } catch {
      // La actividad sigue funcionando aunque el navegador bloquee el almacenamiento local.
    }
  }, [draft]);

  return [draft, setDraft];
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

function StrategyAtlas() {
  return (
    <div className="strategy-atlas">
      <div className="atlas-intro">
        <p className="eyebrow">La brújula del texto</p>
        <h3>Tres estrategias para la victoria</h3>
        <p>
          Las tres placas quedan abiertas para poder compararlas de un vistazo. Separarlas ayuda a estudiar; volver a articularlas permite comprender cómo producen una misma construcción hegemónica.
        </p>
      </div>
      <div className="strategy-cards">
        {strategies.map((strategy) => (
            <article
              key={strategy.id}
              className={`strategy-card strategy-card--${strategy.id}`}
              style={{ '--strategy-color': strategy.color }}
            >
              <header className="strategy-card__header">
                <span className="strategy-number">{strategy.number}</span>
                <span className="strategy-heading">
                  <strong>{strategy.title}</strong>
                </span>
              </header>
              <div className="strategy-body">
                <p>{strategy.definition}</p>
                <dl>
                  <div>
                    <dt>En el texto</dt>
                    <dd>{strategy.evidence}</dd>
                  </div>
                  <div>
                    <dt>Pregunta guía</dt>
                    <dd>{strategy.question}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
      </div>
      <div className="articulation-warning">
        <Layers3 size={25} />
        <div>
          <strong>Advertencia de lectura</strong>
          <p>
            Una misma práctica puede cumplir más de una función. La educación física, por ejemplo,
            puede renovar la formación, militarizar cuerpos y ampliar la acción social del Estado.
          </p>
        </div>
      </div>
    </div>
  );
}

function ReadingSection({ playSound, showToast }) {
  const [diagnosis, setDiagnosis] = useState(new Set());
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [hypothesis, setHypothesis] = useState('');
  const [hypothesisResult, setHypothesisResult] = useState(null);

  const toggleDiagnosis = (id) => {
    setDiagnosisResult(null);
    setDiagnosis((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const checkDiagnosis = () => {
    const correctIds = diagnosisItems.filter((item) => item.correct).map((item) => item.id);
    const correctSelected = correctIds.filter((id) => diagnosis.has(id));
    const wrongSelected = [...diagnosis].filter((id) => !correctIds.includes(id));
    const ok = correctSelected.length === correctIds.length && wrongSelected.length === 0;
    setDiagnosisResult({ ok, correctSelected: correctSelected.length, wrongSelected });
    playSound(ok ? 'correct' : 'incorrect');
  };

  const chooseHypothesis = (id) => {
    setHypothesis(id);
    const ok = id === 'articulacion';
    setHypothesisResult(ok);
    playSound(ok ? 'correct' : 'incorrect');
  };

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
          <IntegratedReader showToast={showToast} />
        </div>

        <StrategyAtlas />

        <div id="entrenamiento" className="training-zone">
          <div className="training-header">
            <div>
              <p className="eyebrow">Antes de salir a la cancha</p>
              <h3>Dos ejercicios de calentamiento</h3>
            </div>
            <span><CircleHelp size={18} /> Retroalimentación inmediata</span>
          </div>

          <div className="training-grid">
            <article className="activity-card">
              <div className="activity-number">A</div>
              <p className="eyebrow">Diagnóstico bajo la lupa</p>
              <h4>¿Qué problemas decía venir a resolver la Reforma?</h4>
              <p className="activity-instruction">Seleccioná las seis formulaciones que aparecen en el diagnóstico reconstruido por Pineau.</p>
              <div className="choice-cloud">
                {diagnosisItems.map((item) => {
                  const selected = diagnosis.has(item.id);
                  const wrong = diagnosisResult && selected && !item.correct;
                  const missed = diagnosisResult && !selected && item.correct;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`${selected ? 'selected' : ''} ${wrong ? 'wrong' : ''} ${missed ? 'missed' : ''}`}
                      onClick={() => toggleDiagnosis(item.id)}
                      aria-pressed={selected}
                    >
                      <span>{selected ? <Check size={14} /> : null}</span>{item.text}
                    </button>
                  );
                })}
              </div>
              <div className="activity-footer">
                <span>{diagnosis.size}/6 elegidas</span>
                <button className="button button--small" type="button" onClick={checkDiagnosis}>Comprobar</button>
              </div>
              {diagnosisResult && (
                <div className={`feedback ${diagnosisResult.ok ? 'feedback--correct' : 'feedback--incorrect'}`} role="status">
                  {diagnosisResult.ok ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                  <div>
                    <strong>{diagnosisResult.ok ? 'Lectura precisa' : 'Revisá el diagnóstico'}</strong>
                    <p>
                      {diagnosisResult.ok
                        ? 'Elegiste los seis problemas. Observá que el diagnóstico ya anticipa las respuestas: cuerpo, moral, trabajo y asistencia.'
                        : `Reconociste ${diagnosisResult.correctSelected} de 6. Las opciones sobre exceso de religión, deportes o inspección invierten el argumento de la Reforma.`}
                    </p>
                  </div>
                </div>
              )}
            </article>

            <article className="activity-card activity-card--hypothesis">
              <div className="activity-number">B</div>
              <p className="eyebrow">La tesis en una jugada</p>
              <h4>¿Cuál condensa mejor la hipótesis de Pineau?</h4>
              <p className="activity-instruction">Elegí una opción. La dificultad está en no reducir una articulación compleja a una etiqueta.</p>
              <div className="hypothesis-options">
                {HYPOTHESIS_OPTIONS.map((option, index) => {
                  const selected = hypothesis === option.id;
                  const evaluated = selected && hypothesisResult !== null;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={`${selected ? 'selected' : ''} ${evaluated ? (hypothesisResult ? 'correct' : 'wrong') : ''}`}
                      onClick={() => chooseHypothesis(option.id)}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>
                      <p>{option.text}</p>
                    </button>
                  );
                })}
              </div>
              {hypothesisResult !== null && (
                <div className={`feedback ${hypothesisResult ? 'feedback--correct' : 'feedback--incorrect'}`} role="status">
                  {hypothesisResult ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                  <div>
                    <strong>{hypothesisResult ? 'Esa es la clave' : 'La explicación queda corta'}</strong>
                    <p>
                      {hypothesisResult
                        ? 'Pineau explica el triunfo por una construcción hegemónica: negociación, incorporación y exclusión en una misma política.'
                        : 'El texto discute las explicaciones unívocas. Volvé a la pestaña “Hipótesis” y buscá la combinación de estrategias.'}
                    </p>
                  </div>
                </div>
              )}
            </article>
          </div>
        </div>

      </div>
    </section>
  );
}

function PlayerToken({ player, selected = false, wrong = false, inField = false, onClick, onDragStart }) {
  return (
    <button
      type="button"
      className={`player-token player-token--${player.team} ${selected ? 'selected' : ''} ${wrong ? 'wrong' : ''} ${inField ? 'in-field' : ''}`}
      onClick={onClick}
      draggable={!inField}
      onDragStart={onDragStart}
      title={`${player.title}: ${player.note}`}
      aria-label={`${inField ? 'Devolver' : 'Convocar'} jugador ${player.title}. ${player.note}`}
    >
      <span className="player-number">{player.number}</span>
      <span className="player-disc">
        {player.image ? <img src={player.image} alt="" /> : <span className="player-glyph">{player.glyph}</span>}
      </span>
      <span className="player-label">{player.short}</span>
      {wrong && <span className="wrong-mark" aria-hidden="true"><X size={14} /></span>}
    </button>
  );
}

function TeamBench({ team, available, selected, wrongIds, onToggle, onDragStart }) {
  const title = team === 'reforma' ? 'Equipo Fresco–Noble' : '100% Laicos';
  const subtitle = team === 'reforma' ? 'Once de la Reforma' : 'Resistencias y contramodelos';
  const teamPlayers = available.filter((player) => player.team === team && !selected.has(player.id));

  return (
    <div className={`team-bench team-bench--${team}`}>
      <header>
        <span className="team-shield" aria-hidden="true">{team === 'reforma' ? 'FN' : 'L'}</span>
        <div><strong>{title}</strong><small>{subtitle}</small></div>
        <span className="bench-count">{teamPlayers.length}</span>
      </header>
      <div className="bench-players">
        {teamPlayers.length ? (
          teamPlayers.map((player) => (
            <PlayerToken
              key={player.id}
              player={player}
              wrong={wrongIds.has(player.id)}
              onClick={() => onToggle(player.id)}
              onDragStart={(event) => onDragStart(event, player.id)}
            />
          ))
        ) : (
          <p className="empty-bench">Todos los jugadores de este tiempo están en la cancha.</p>
        )}
      </div>
    </div>
  );
}

function GameSection({ playSound, showToast }) {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState(new Set());
  const [completed, setCompleted] = useState(new Set());
  const [status, setStatus] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [bonus, setBonus] = useState('');
  const [bonusResult, setBonusResult] = useState(null);
  const current = strategies[round];
  const expected = useMemo(
    () => players.filter((player) => player.strategy === current.id),
    [current.id],
  );
  const available = players.filter((player) => !completed.has(player.id));
  const targetPerTeam = current.id === 'cooptativa' ? 3 : 4;
  const wrongIds = new Set(status?.wrong || []);
  const selectedPlayers = players.filter((player) => selected.has(player.id));

  const togglePlayer = (id) => {
    if (status?.ok) return;
    setStatus(null);
    setSelected((currentSelected) => {
      const next = new Set(currentSelected);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onDragStart = (event, id) => {
    event.dataTransfer.setData('text/player-id', id);
    event.dataTransfer.effectAllowed = 'move';
  };

  const dropPlayer = (event, team) => {
    event.preventDefault();
    if (status?.ok) return;
    const id = event.dataTransfer.getData('text/player-id');
    const player = players.find((item) => item.id === id);
    if (!player) return;
    if (player.team !== team) {
      playSound('incorrect');
      showToast(`Ese jugador pertenece al equipo ${player.team === 'reforma' ? 'Fresco–Noble' : '100% Laicos'}.`);
      return;
    }
    setStatus(null);
    setSelected((currentSelected) => new Set(currentSelected).add(id));
  };

  const checkRound = () => {
    const expectedIds = new Set(expected.map((player) => player.id));
    const wrong = [...selected].filter((id) => !expectedIds.has(id));
    const missing = [...expectedIds].filter((id) => !selected.has(id));
    const reformaCount = selectedPlayers.filter((player) => player.team === 'reforma').length;
    const resistenciaCount = selectedPlayers.filter((player) => player.team === 'resistencia').length;
    const ok = wrong.length === 0 && missing.length === 0;
    setStatus({ ok, wrong, missing, reformaCount, resistenciaCount });
    playSound(ok ? 'correct' : 'incorrect');
  };

  const nextRound = () => {
    const expectedIds = expected.map((player) => player.id);
    setCompleted((currentCompleted) => new Set([...currentCompleted, ...expectedIds]));
    setSelected(new Set());
    setStatus(null);
    if (round < strategies.length - 1) setRound((value) => value + 1);
    else setGameComplete(true);
  };

  const resetGame = () => {
    setRound(0);
    setSelected(new Set());
    setCompleted(new Set());
    setStatus(null);
    setGameComplete(false);
    setBonus('');
    setBonusResult(null);
  };

  const checkBonus = (id) => {
    setBonus(id);
    const ok = id === 'reforma-deportes';
    setBonusResult(ok);
    playSound(ok ? 'correct' : 'incorrect');
  };

  return (
    <section id="partido" className="game-section tracked-section">
      <div className="page-shell">
        <SectionHeading
          index="03"
          section="Partido"
          title="El partido de las estrategias"
          mobileTitleLines={['El partido de', 'las estrategias']}
          text="Veintidós jugadores, dos equipos y tres tiempos. Reconstruí la función dominante de cada acción y recibí una devolución basada en el argumento del texto."
          inverse
        />

        <div className="game-instructions">
          <div><span>1</span><p><strong>Leé el cartel del tiempo.</strong> Cada ronda trabaja una estrategia.</p></div>
          <div><span>2</span><p><strong>Convocá jugadores.</strong> Hacé clic o arrastrá desde cada banco.</p></div>
          <div><span>3</span><p><strong>Comprobá la formación.</strong> Son {targetPerTeam} por equipo en este tiempo.</p></div>
        </div>

        <div className="game-shell">
          <div className="scoreboard">
            <div className="score-team"><span>FN</span><strong>Fresco–Noble</strong></div>
            <div className="score-center">
              <small>LECTURA · TIEMPO {round + 1}/3</small>
              <strong>{completed.size / 2}<span>:</span>{completed.size / 2}</strong>
            </div>
            <div className="score-team score-team--right"><strong>100% Laicos</strong><span>L</span></div>
          </div>

          {!gameComplete ? (
            <>
              <div className={`strategy-plaque strategy-plaque--${current.id}`} style={{ '--strategy-color': current.color }}>
                <span>{current.number}</span>
                <div><small>ESTRATEGIA</small><strong>{current.title}</strong></div>
              </div>

              <div className="pitch-wrap">
                <img src="/assets/cancha-fresco-noble.webp" alt="Cancha escolar preparada para el partido pedagógico" />
                <div className="field-banner field-banner--reforma">FRESCO–NOBLE</div>
                <div className="field-banner field-banner--resistencia">100% LAICOS</div>
                <div
                  className="formation formation--reforma"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => dropPlayer(event, 'reforma')}
                  aria-label="Formación del equipo Fresco-Noble"
                >
                  {selectedPlayers.filter((player) => player.team === 'reforma').map((player) => (
                    <PlayerToken
                      key={player.id}
                      player={player}
                      inField
                      wrong={wrongIds.has(player.id)}
                      onClick={() => togglePlayer(player.id)}
                    />
                  ))}
                  {!selectedPlayers.some((player) => player.team === 'reforma') && <span className="drop-hint">Soltá o tocá jugadores</span>}
                </div>
                <div
                  className="formation formation--resistencia"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => dropPlayer(event, 'resistencia')}
                  aria-label="Formación del equipo 100% Laicos"
                >
                  {selectedPlayers.filter((player) => player.team === 'resistencia').map((player) => (
                    <PlayerToken
                      key={player.id}
                      player={player}
                      inField
                      wrong={wrongIds.has(player.id)}
                      onClick={() => togglePlayer(player.id)}
                    />
                  ))}
                  {!selectedPlayers.some((player) => player.team === 'resistencia') && <span className="drop-hint">Soltá o tocá jugadores</span>}
                </div>
              </div>

              <div className="round-console">
                <div>
                  <p className="eyebrow">Consigna del tiempo</p>
                  <p>{current.fieldHint}</p>
                </div>
                <div className="selection-counter" aria-label="Cantidad seleccionada por equipo">
                  <span className={selectedPlayers.filter((player) => player.team === 'reforma').length === targetPerTeam ? 'ready' : ''}>
                    FN {selectedPlayers.filter((player) => player.team === 'reforma').length}/{targetPerTeam}
                  </span>
                  <span className={selectedPlayers.filter((player) => player.team === 'resistencia').length === targetPerTeam ? 'ready' : ''}>
                    L {selectedPlayers.filter((player) => player.team === 'resistencia').length}/{targetPerTeam}
                  </span>
                </div>
                <button className="button button--primary" type="button" onClick={checkRound} disabled={selected.size === 0 || status?.ok}>
                  Revisar formación <Check size={17} />
                </button>
              </div>

              {status && (
                <div className={`game-feedback ${status.ok ? 'game-feedback--correct' : 'game-feedback--incorrect'}`} role="status">
                  <div className="feedback-medal">{status.ok ? <Trophy size={29} /> : <CircleHelp size={29} />}</div>
                  <div>
                    <p className="eyebrow">{status.ok ? 'Formación correcta' : 'El partido sigue'}</p>
                    <h3>{status.ok ? `${current.title}: lectura resuelta` : 'Hay que ajustar la formación'}</h3>
                    <p>
                      {status.ok
                        ? current.roundSummary
                        : status.wrong.length
                          ? `Hay ${status.wrong.length} jugador${status.wrong.length > 1 ? 'es' : ''} que cumple otra función dominante. ${current.fieldHint}`
                          : `Todavía faltan ${status.missing.length} jugador${status.missing.length > 1 ? 'es' : ''}. Completá ${targetPerTeam} por cada equipo.`}
                    </p>
                    {!status.ok && status.wrong.some((id) => players.find((player) => player.id === id)?.crossTags?.includes(current.id)) && (
                      <p className="nuance-note">
                        <Sparkles size={15} /> Detectaste un cruce válido. Para esta formación buscamos la función dominante; guardá esa relación para el tiempo suplementario.
                      </p>
                    )}
                  </div>
                  {status.ok && (
                    <button className="button button--dark" type="button" onClick={nextRound}>
                      {round < 2 ? 'Siguiente tiempo' : 'Cerrar el partido'} <ChevronRight size={17} />
                    </button>
                  )}
                </div>
              )}

              <div className="benches-grid">
                <TeamBench
                  team="reforma"
                  available={available}
                  selected={selected}
                  wrongIds={wrongIds}
                  onToggle={togglePlayer}
                  onDragStart={onDragStart}
                />
                <TeamBench
                  team="resistencia"
                  available={available}
                  selected={selected}
                  wrongIds={wrongIds}
                  onToggle={togglePlayer}
                  onDragStart={onDragStart}
                />
              </div>
            </>
          ) : (
            <div className="game-complete">
              <div className="trophy-rays" aria-hidden="true" />
              <Trophy size={54} />
              <p className="eyebrow">Los tres tiempos están resueltos</p>
              <h3>La clave no era elegir un ganador</h3>
              <p>
                Reconstruiste una disputa y, sobre todo, la forma en que el proyecto oficial combinó
                recursos heterogéneos para volverse hegemónico. Ahora falta volver a mezclarlos.
              </p>

              <div className="bonus-card">
                <span className="bonus-label">TIEMPO SUPLEMENTARIO</span>
                <h4>¿Qué jugador permite ver con mayor claridad las tres estrategias a la vez?</h4>
                <p>Elegí una pieza y justificá mentalmente qué función cumple en cada dimensión.</p>
                <div className="bonus-options">
                  {BONUS_OPTIONS.map((id) => {
                    const player = players.find((item) => item.id === id);
                    const selectedBonus = bonus === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        className={`${selectedBonus ? 'selected' : ''} ${selectedBonus && bonusResult !== null ? (bonusResult ? 'correct' : 'wrong') : ''}`}
                        onClick={() => checkBonus(id)}
                      >
                        <span>{player.glyph}</span>{player.title}
                      </button>
                    );
                  })}
                </div>
                {bonusResult !== null && (
                  <div className={`feedback ${bonusResult ? 'feedback--correct' : 'feedback--incorrect'}`} role="status">
                    {bonusResult ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                    <p>
                      {bonusResult
                        ? 'La educación física y el deporte renuevan la formación integral, pueden militarizar prácticas y expanden la acción social del Estado mediante campos, centros y colonias.'
                        : 'Esa pieza ilumina una tensión importante, pero no enlaza con igual claridad las tres funciones. Probá con una práctica corporal que atraviesa escuela, disciplina y asistencia.'}
                    </p>
                  </div>
                )}
              </div>
              <div className="complete-actions">
                <a className="button button--primary" href="#genealogia">Llevar la pregunta al presente <ChevronRight size={17} /></a>
                <button className="button button--ghost-light" type="button" onClick={resetGame}><RotateCcw size={17} /> Volver a jugar</button>
              </div>
            </div>
          )}
        </div>

        <p className="game-method-note">
          <Lightbulb size={17} /> La clasificación usa la función dominante acordada para esta dinámica. El propio texto advierte que las fronteras se superponen: detectar un cruce no es un error, siempre que puedas argumentarlo.
        </p>
      </div>
    </section>
  );
}

function GenealogySection({ playSound, showToast }) {
  const [draft, setDraft] = useLocalDraft();
  const [reviewed, setReviewed] = useState(false);
  const theme = genealogyThemes.find((item) => item.id === draft.theme) || genealogyThemes[1];

  const combined = `${draft.past} ${draft.present} ${draft.future}`.toLowerCase();
  const criteria = useMemo(
    () => [
      {
        id: 'times',
        label: 'Conecta pasado, presente y futuro',
        ok: draft.past.trim().length >= 55 && draft.present.trim().length >= 55 && draft.future.trim().length >= 55,
      },
      {
        id: 'change',
        label: 'Explica continuidad y transformación',
        ok: /(cambi|transform|persist|contin|ruptur|huella|difer)/i.test(draft.present),
      },
      {
        id: 'actors',
        label: 'Reconoce actores, poder y decisiones',
        ok: /(estado|gobierno|docente|niñ|famil|comunidad|sociedad|actor|poder|instituci)/i.test(combined),
      },
      {
        id: 'future',
        label: 'Orienta una acción o futuro posible',
        ok: draft.future.trim().length >= 55 && /(deber|podr|propon|garanti|imagino|futuro|decisi|acción|accion)/i.test(draft.future),
      },
    ],
    [combined, draft],
  );
  const score = criteria.filter((item) => item.ok).length;

  const update = (field, value) => {
    setReviewed(false);
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const review = () => {
    setReviewed(true);
    playSound(score >= 3 ? 'correct' : 'incorrect');
  };

  const output = `CÉDULA GENEALÓGICA — ${theme.title}\n\n1937 · PROCEDENCIA\n${draft.past}\n\nPRESENTE · HUELLAS Y TRANSFORMACIONES\n${draft.present}\n\nFUTURO · ORIENTACIÓN\n${draft.future}\n\nAutoevaluación: ${score}/4 criterios logrados.`;

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output);
      showToast('Cédula copiada al portapapeles.');
      playSound('correct');
    } catch {
      showToast('No se pudo copiar automáticamente. Podés seleccionar el texto de la cédula.');
    }
  };

  const downloadOutput = () => {
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cedula-genealogica-${theme.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setDraft({ theme: 'deporte', past: '', present: '', future: '' });
    setReviewed(false);
  };

  return (
    <section id="genealogia" className="genealogy-section tracked-section">
      <div className="page-shell">
        <SectionHeading
          index="04"
          section="Conciencia histórica"
          title="Gabinete de conciencia histórica"
          mobileTitleLines={['Gabinete de', 'conciencia histórica']}
          text="El cierre no pregunta si 1937 fue “bueno” o “malo”. Te propone rastrear procedencias, reconocer transformaciones y usar esa comprensión para orientar una decisión."
        />

        <div className="rusen-note">
          <div className="rusen-letter" aria-hidden="true">R</div>
          <div>
            <p className="eyebrow">Una precisión conceptual</p>
            <h3>De la repetición a la transformación</h3>
            <p>
              La <strong>conciencia histórica</strong> es la capacidad de interpretar la experiencia del
              tiempo —relacionando pasado, presente y futuro— para comprender los cambios, construir
              identidad y orientar nuestras decisiones y acciones.
            </p>
            <p>
              Rüsen distingue cuatro modos de construir esa orientación histórica:
            </p>
            <div className="rusen-types" aria-label="Cuatro tipos de conciencia histórica">
              <p><strong>Tradicional</strong><span>Recupera el pasado como origen y continuidad de valores, identidades y formas de vida que deben preservarse.</span></p>
              <p><strong>Ejemplar</strong><span>Extrae del pasado reglas, enseñanzas o modelos generales para interpretar situaciones del presente.</span></p>
              <p><strong>Crítica</strong><span>Cuestiona las narraciones heredadas y permite discutir o rechazar tradiciones, valores y relaciones de poder.</span></p>
              <p><strong>Genealógica</strong><span>Comprende el cambio temporal, reconstruye cómo el presente llegó a ser lo que es y orienta la acción hacia futuros posibles.</span></p>
            </div>
            <p>
              En este cierre trabajamos especialmente la mirada <strong>genealógica</strong>: buscamos
              reconocer qué alternativas quedaron relegadas y qué futuro puede abrirse. No se trata de
              demostrar que “todo sigue igual”, sino de explicar continuidades, rupturas y transformaciones.
            </p>
            <a href="https://revistas.unal.edu.co/index.php/hisysoc/article/view/28146" target="_blank" rel="noreferrer">
              Ampliar sobre Rüsen <ExternalLink size={15} />
            </a>
          </div>
        </div>

        <div className="genealogy-workbench">
          <div className="theme-selector">
            <p className="eyebrow">Paso 1 · Elegí una huella</p>
            <h3>¿Qué práctica querés seguir en el tiempo?</h3>
            <div className="theme-options">
              {genealogyThemes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={draft.theme === item.id ? 'selected' : ''}
                  onClick={() => update('theme', item.id)}
                >
                  <span>{item.title}</span>
                  <small>{item.subtitle}</small>
                </button>
              ))}
            </div>
            <div className="theme-hint">
              <Lightbulb size={19} />
              <div><strong>Pista de procedencia</strong><p>{theme.hint}</p></div>
            </div>
            <div className="theme-tags">
              {theme.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </div>

          <div className="writing-workbench">
            <div className="workbench-heading">
              <div><p className="eyebrow">Paso 2 · Construí la narrativa</p><h3>Tres ventanas temporales</h3></div>
              <span><LockKeyhole size={15} /> Se guarda solo en este dispositivo</span>
            </div>
            <label>
              <span><strong>1937 · Procedencia</strong><small>¿Qué problema se definía y qué respuesta desplegó la Reforma?</small></span>
              <textarea
                value={draft.past}
                onChange={(event) => update('past', event.target.value)}
                placeholder="En 1937, esta práctica buscaba... Intervinieron... La estrategia predominante fue..."
                rows={5}
              />
              <em>{draft.past.length} caracteres</em>
            </label>
            <label>
              <span><strong>Presente · Huellas y transformaciones</strong><small>¿Qué cambió? ¿Qué tensión o sedimento reconocés hoy?</small></span>
              <textarea
                value={draft.present}
                onChange={(event) => update('present', event.target.value)}
                placeholder="Desde entonces cambió... Sin embargo persiste... La diferencia principal es..."
                rows={5}
              />
              <em>{draft.present.length} caracteres</em>
            </label>
            <label>
              <span><strong>Futuro · Orientación</strong><small>¿Qué futuro educativo deseás y qué decisión presente puede acercarlo?</small></span>
              <textarea
                value={draft.future}
                onChange={(event) => update('future', event.target.value)}
                placeholder="Un futuro deseable debería... Para construirlo hoy propondría..."
                rows={5}
              />
              <em>{draft.future.length} caracteres</em>
            </label>
            <div className="workbench-actions">
              <button className="button button--primary" type="button" onClick={review}>Revisar mi narrativa <Sparkles size={17} /></button>
              <button className="text-button" type="button" onClick={reset}><RotateCcw size={15} /> Borrar borrador</button>
            </div>
          </div>

          <aside className="genealogy-rubric">
            <p className="eyebrow">Paso 3 · Retroalimentación</p>
            <h3>Radar genealógico</h3>
            <div className="radar-score" aria-label={`${score} de 4 criterios logrados`}>
              <span style={{ '--score': `${score * 25}%` }}><strong>{score}</strong><small>/4</small></span>
            </div>
            <ul>
              {criteria.map((criterion) => (
                <li key={criterion.id} className={reviewed ? (criterion.ok ? 'ok' : 'pending') : ''}>
                  {reviewed && criterion.ok ? <CheckCircle2 size={18} /> : <span />}
                  {criterion.label}
                </li>
              ))}
            </ul>
            {reviewed && (
              <div className={`rubric-feedback ${score >= 3 ? 'good' : 'develop'}`} role="status">
                <strong>{score === 4 ? 'Narrativa genealógica lograda' : score >= 3 ? 'La mirada genealógica está en marcha' : 'Todavía predomina la descripción'}</strong>
                <p>
                  {score === 4
                    ? 'Conectás temporalidades, explicás cambios, reconocés actores y orientás una acción futura.'
                    : score >= 3
                      ? 'La estructura temporal es sólida. Revisá el criterio pendiente para volver explícita esa dimensión.'
                      : 'Agregá transformaciones, actores concretos y una decisión de futuro. No alcanza con comparar “antes” y “ahora”.'}
                </p>
              </div>
            )}
          </aside>
        </div>

        {reviewed && score >= 3 && (
          <article className="genealogy-output">
            <header>
              <div><p className="eyebrow">Cédula genealógica</p><h3>{theme.title}</h3></div>
              <div>
                <button className="icon-button" type="button" onClick={copyOutput} aria-label="Copiar cédula" title="Copiar"><Clipboard size={18} /></button>
                <button className="icon-button" type="button" onClick={downloadOutput} aria-label="Descargar cédula" title="Descargar"><Download size={18} /></button>
                <button className="icon-button" type="button" onClick={() => window.print()} aria-label="Imprimir cédula" title="Imprimir"><Printer size={18} /></button>
              </div>
            </header>
            <div className="output-timeline">
              <section><span>1937</span><h4>Procedencia</h4><p>{draft.past}</p></section>
              <section><span>HOY</span><h4>Huellas y transformaciones</h4><p>{draft.present}</p></section>
              <section><span>→</span><h4>Orientación futura</h4><p>{draft.future}</p></section>
            </div>
          </article>
        )}
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
          <p className="eyebrow credits-label">Sección 05 · Créditos</p>
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
        <a href="#inicio">Volver arriba ↑</a>
      </div>
    </footer>
  );
}

export default function App() {
  const [soundOn, setSoundOn] = useState(true);
  const [toast, setToast] = useState('');
  const { progress, active } = useScrollState();
  const playSound = useSound(soundOn);
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
        <ReadingSection playSound={playSound} showToast={showToast} />
        <GameSection playSound={playSound} showToast={showToast} />
        <GenealogySection playSound={playSound} showToast={showToast} />
      </main>
      <Footer />
      <div className={`toast ${toast ? 'show' : ''}`} role="status" aria-live="polite">
        <CheckCircle2 size={18} /> {toast}
      </div>
    </>
  );
}

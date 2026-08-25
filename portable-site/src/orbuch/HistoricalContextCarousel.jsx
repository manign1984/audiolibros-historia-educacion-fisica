import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import './orbuch-context-carousel.css';

const commonsFile = (filename) =>
  `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(filename)}`;

const commonsPage = (filename) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(filename)}`;

const HISTORICAL_SCENE_EVENTS = [
  {
    id: 'golpe-1943',
    year: '1943',
    scope: 'Argentina',
    dimension: 'Política y Estado',
    title: 'El golpe del 4 de junio',
    text: 'El derrocamiento de Ramón Castillo clausura la Década Infame y abre un ciclo militar del que emergerá Juan D. Perón. La escena política se reorganiza alrededor de las Fuerzas Armadas, el trabajo y nuevas formas de intervención estatal.',
    image: commonsFile('Golpe de Estado 1943.jpg'),
    imageAlt: 'Escena del golpe de Estado del 4 de junio de 1943 en Buenos Aires',
    imageCaption: 'Buenos Aires durante el golpe del 4 de junio de 1943.',
    imageCredit: 'Autor desconocido · dominio público · Wikimedia Commons',
    sourceUrl: commonsPage('Golpe de Estado 1943.jpg'),
    sourceLabel: 'Ficha y procedencia de la imagen',
  },
  {
    id: 'industria-migraciones-1945',
    year: '1937–47',
    scope: 'Argentina',
    dimension: 'Sociedad, industria y migraciones',
    title: 'Una Argentina cada vez más urbana',
    text: 'La industrialización y las migraciones internas transforman las ciudades y, sobre todo, el Gran Buenos Aires. Entre 1936 y 1947 su población pasa de 3,46 a 4,62 millones: trabajo fabril, servicios y nuevos habitantes modifican la vida cotidiana.',
    image: commonsFile('Trabajadoras alpargatas 1945.jpg'),
    imageAlt: 'Trabajadoras en la fábrica Alpargatas de Buenos Aires hacia 1945',
    imageCaption: 'Trabajadoras de Alpargatas, Buenos Aires, hacia 1945.',
    imageCredit: 'Autor desconocido · dominio público · Wikimedia Commons',
    sourceUrl: commonsPage('Trabajadoras alpargatas 1945.jpg'),
    sourceLabel: 'Procedencia de la fotografía',
    evidence: 'Torre y Pastoriza: industrialización, urbanización y migraciones internas.',
  },
  {
    id: 'octubre-1945',
    year: '17 OCT 1945',
    scope: 'Argentina',
    dimension: 'Política, calle y cultura popular',
    title: 'La hora de las masas',
    text: 'Una movilización obrera ocupa el centro de Buenos Aires y exige la liberación de Perón. Para contemporáneos de muy distintos signos, el acontecimiento hace visible otra composición social y altera quiénes pueden apropiarse del espacio político urbano.',
    image: commonsFile('Plaza de Mayo el 17 de octubre de 1945.jpg'),
    imageAlt: 'Multitud reunida en Plaza de Mayo el 17 de octubre de 1945',
    imageCaption: 'Concentración popular en Plaza de Mayo, 17 de octubre de 1945.',
    imageCredit: 'Archivo General de la Nación · dominio público · Wikimedia Commons',
    sourceUrl: commonsPage('Plaza de Mayo el 17 de octubre de 1945.jpg'),
    sourceLabel: 'Archivo y licencia',
    evidence: 'Torre y Pastoriza reconstruyen el acontecimiento como una ruptura en la escena política porteña.',
  },
  {
    id: 'eniac-1946',
    year: 'FEB 1946',
    scope: 'Mundo',
    dimension: 'Ciencia, tecnología y trabajo',
    title: 'ENIAC y una nueva escala de cálculo',
    text: 'La computadora electrónica ENIAC es presentada públicamente en Estados Unidos. La imagen de sus programadoras permite mirar la posguerra también desde la tecnología, el trabajo especializado y la presencia —muchas veces invisibilizada— de mujeres en la historia de la computación.',
    image: commonsFile('Two women operating ENIAC (full resolution).jpg'),
    imageAlt: 'Betty Jennings y Frances Bilas operando el panel de control de ENIAC en 1946',
    imageCaption: 'Betty Jennings y Frances Bilas preparan ENIAC para una demostración, 1946.',
    imageCredit: 'U.S. Army · dominio público · Wikimedia Commons',
    sourceUrl: commonsPage('Two women operating ENIAC (full resolution).jpg'),
    sourceLabel: 'Ficha y licencia',
  },
  {
    id: 'peron-presidencia-1946',
    year: '4 JUN 1946',
    scope: 'Argentina',
    dimension: 'Política, trabajo y ciudadanía',
    title: 'Perón asume la Presidencia',
    text: 'El nuevo gobierno llega al poder después de una campaña atravesada por la movilización obrera y la polarización política. Desde allí se profundiza una agenda de regulación económica, ampliación social y centralización estatal que enmarca el problema estudiado por Orbuch.',
    visualLabel: '1946\nNUEVO GOBIERNO\nNUEVAS ESCALAS\nDE INTERVENCIÓN',
    evidence: 'Marco político del primer peronismo (1946–1955).',
  },
  {
    id: 'voto-femenino-1947',
    year: '9 SEP 1947',
    scope: 'Argentina',
    dimension: 'Género, derechos y ciudadanía',
    title: 'Derechos políticos para las mujeres',
    text: 'La Ley 13.010 reconoce a las mujeres argentinas los mismos derechos políticos y obligaciones electorales que a los varones. La ciudadanía se amplía en un período de fuerte redefinición de derechos y de presencia estatal en la vida social.',
    image: commonsFile('Manifestación por el voto femenino en Plaza de Mayo.jpg'),
    imageAlt: 'Mujeres en una manifestación por el voto femenino en Plaza de Mayo en 1947',
    imageCaption: 'Acto en Plaza de Mayo por la Ley 13.010, 1947.',
    imageCredit: 'Autor desconocido · dominio público · Wikimedia Commons',
    sourceUrl: 'https://www.argentina.gob.ar/normativa/nacional/ley-13010-47353/texto',
    sourceLabel: 'Ley 13.010 · texto oficial',
  },
  {
    id: 'radio-1947',
    year: '1947',
    scope: 'Argentina',
    dimension: 'Medios y cultura de masas',
    title: 'Una radio cada dos viviendas',
    text: 'El censo de 1947 registra aproximadamente una radio por cada dos viviendas. Las cadenas porteñas, el radioteatro, la música, la política y el deporte enlazan experiencias distantes y colaboran en la construcción cotidiana de una cultura de alcance nacional.',
    visualLabel: '1947\nUNA RADIO\nCADA DOS\nVIVIENDAS',
    evidence: 'Torre y Pastoriza: la radio como medio decisivo de vertebración y homogeneización cultural.',
  },
  {
    id: 'cnef-1947',
    year: '6 NOV 1947',
    scope: 'Argentina',
    dimension: 'Estado, educación y cuerpo',
    title: 'Nace el Consejo Nacional de Educación Física',
    text: 'Después de proyectos que expresaban perspectivas militares, sanitarias y educativas en disputa, el Decreto 34.817 crea el Consejo Nacional de Educación Física. Orbuch destaca la nueva escala: políticas pensadas para alcanzar a la población de todo el territorio.',
    image: '/assets/orbuch-gimnasia-compensatoria-portada.png',
    imageAlt: 'Portada del cuadernillo Gimnasia compensatoria en el aula, publicado por el Consejo Nacional de Educación Física en 1949',
    imageCaption: 'El Consejo creado en 1947 encabeza el cuadernillo escolar de 1949.',
    imageCredit: 'Consejo Nacional de Educación Física · fuente primaria del proyecto',
    evidence: 'Orbuch (2020): creación del organismo y disputa entre proyectos de intervención.',
    featured: true,
  },
  {
    id: 'ferrocarriles-1948',
    year: '1 MAR 1948',
    scope: 'Argentina',
    dimension: 'Industria, infraestructura y soberanía',
    title: 'Los ferrocarriles pasan al Estado',
    text: 'La transferencia de las líneas ferroviarias británicas al Estado se convierte en uno de los grandes símbolos de la política económica del período. Infraestructura, integración territorial y soberanía quedan condensadas en una escena de fuerte potencia pública.',
    image: commonsFile('Peron-NacionalizacionFA.jpg'),
    imageAlt: 'Juan Domingo Perón firma la escritura de transferencia de los ferrocarriles al Estado el 1 de marzo de 1948',
    imageCaption: 'Perón firma la escritura de transferencia de la red ferroviaria, 1 de marzo de 1948.',
    imageCredit: 'Autor desconocido · dominio público · Wikimedia Commons',
    sourceUrl: commonsPage('Peron-NacionalizacionFA.jpg'),
    sourceLabel: 'Procedencia de la fotografía',
  },
  {
    id: 'olimpicos-1948',
    year: '29 JUL 1948',
    scope: 'Mundo',
    dimension: 'Deporte y posguerra',
    title: 'Londres vuelve a reunir al deporte mundial',
    text: 'Los Juegos Olímpicos regresan después de doce años y de una guerra mundial. La ceremonia en Wembley vuelve a presentar al deporte como lenguaje internacional, espectáculo de masas y escenario simbólico de una posguerra todavía marcada por la austeridad.',
    image: commonsFile('Opening of the Olympic Games in London, 29 July, 1948. (7649948798).jpg'),
    imageAlt: 'Ceremonia de apertura de los Juegos Olímpicos de Londres de 1948',
    imageCaption: 'Apertura de los Juegos Olímpicos de Londres, 29 de julio de 1948.',
    imageCredit: 'Daily Herald Archive / National Media Museum · Flickr Commons',
    sourceUrl: commonsPage('Opening of the Olympic Games in London, 29 July, 1948. (7649948798).jpg'),
    sourceLabel: 'Archivo y condiciones de uso',
  },
  {
    id: 'buenos-aires-caracas-1948',
    year: '1948',
    scope: 'Región',
    dimension: 'Deporte, radio y territorio',
    title: 'Buenos Aires–Caracas: correr el continente',
    text: 'El Turismo Carretera une Buenos Aires con Caracas en un recorrido extraordinario. La radio permite seguir a los corredores a la distancia y convierte rutas, paisajes y fronteras en una experiencia colectiva: deporte, técnica y geografía se vuelven cultura popular.',
    image: commonsFile('Buenos Aires Caracas 1948 - Participantes.jpg'),
    imageAlt: 'Participantes de la carrera Buenos Aires-Caracas de 1948',
    imageCaption: 'Participantes de la Buenos Aires–Caracas, 1948.',
    imageCredit: 'Autor desconocido · dominio público · Wikimedia Commons',
    sourceUrl: commonsPage('Buenos Aires Caracas 1948 - Participantes.jpg'),
    sourceLabel: 'Procedencia de la fotografía',
    evidence: 'Torre y Pastoriza: automovilismo y radio como apropiación social de la geografía nacional y regional.',
  },
  {
    id: 'ddhh-1948',
    year: '10 DIC 1948',
    scope: 'Mundo',
    dimension: 'Derechos y debate ideológico',
    title: 'Una declaración universal de derechos',
    text: 'La Asamblea General de las Naciones Unidas proclama en París la Declaración Universal de los Derechos Humanos. La posguerra instala con nueva fuerza un vocabulario de dignidad, igualdad, libertad, derechos sociales y responsabilidades públicas.',
    visualLabel: '1948\nDIGNIDAD\nIGUALDAD\nDERECHOS',
    sourceUrl: 'https://www.un.org/es/about-us/universal-declaration-of-human-rights',
    sourceLabel: 'Naciones Unidas · texto e historia',
  },
  {
    id: 'constitucion-1949',
    year: '1949',
    scope: 'Argentina',
    dimension: 'Constitución, trabajo y salud',
    title: 'Los derechos sociales entran en la Constitución',
    text: 'La Constitución de 1949 incorpora derechos del trabajador, de la familia, de la ancianidad, de la educación y de la cultura. Entre ellos figura el derecho a la preservación de la salud: el mismo principio que el folleto de oficinas colocará en su apertura.',
    image: commonsFile('Perón Constitución 1949.JPG'),
    imageAlt: 'Juan Domingo Perón sostiene una versión de la Constitución argentina de 1949',
    imageCaption: 'Perón con una edición de la Constitución reformada, 1949.',
    imageCredit: 'Autor desconocido · dominio público · Wikimedia Commons',
    sourceUrl: 'https://www.argentina.gob.ar/sites/default/files/anm_-_constitucion_de_1949.pdf',
    sourceLabel: 'Constitución de 1949 · Archivo Nacional de la Memoria',
    featured: true,
  },
  {
    id: 'aleph-1949',
    year: '1949',
    scope: 'Argentina',
    dimension: 'Literatura y cultura',
    title: 'Borges publica El Aleph',
    text: 'Losada publica en Buenos Aires la primera edición de El Aleph, con trece relatos. En la misma sociedad que discute derechos, trabajo, educación y Estado, la literatura argentina produce una de sus obras más influyentes y ensaya otras maneras de imaginar tiempo, espacio y experiencia.',
    visualLabel: '1949\nEL ALEPH\nJORGE LUIS\nBORGES',
    sourceUrl: 'https://www.bn.gob.ar/web/bibliotecarios/rda/ejemplo-el-aleph-frbr.pdf',
    sourceLabel: 'Biblioteca Nacional · registro de la edición de 1949',
  },
  {
    id: 'aula-1949',
    year: '1949',
    scope: 'Argentina',
    dimension: 'Educación y vida cotidiana',
    title: 'Tres minutos para mover el aula',
    text: 'Gimnasia compensatoria en el aula propone ejercicios diarios, una vez por cada hora escolar y por no más de tres minutos. El cuerpo deja de quedar confinado a la clase de Educación Física: postura, atención, disciplina y movimiento ingresan en todas las asignaturas.',
    image: '/assets/orbuch-aula-generalidades.jpg',
    imageAlt: 'Páginas del cuadernillo Gimnasia compensatoria en el aula con estudiantes realizando ejercicios junto a sus pupitres',
    imageCaption: 'Alumnos realizan gimnasia compensatoria en escuelas de Buenos Aires y La Plata.',
    imageCredit: 'Consejo Nacional de Educación Física, 1949 · fuente primaria del proyecto',
    evidence: 'Orbuch (2020): 10.000 ejemplares, 2.º a 6.º grado y una práctica pensada para cada hora escolar.',
    featured: true,
  },
  {
    id: 'oficinas-1950',
    year: '1950',
    scope: 'Argentina',
    dimension: 'Trabajo, salud y productividad',
    title: 'La educación corporal sale de la escuela',
    text: 'Gimnasia de oficinas propone pausas de cinco a diez minutos dentro del tiempo de trabajo, con líderes entre los propios empleados y una adhesión presentada como voluntaria. Salud, camaradería, disciplina y productividad aparecen unidas en una política que intenta penetrar el ámbito laboral.',
    image: '/assets/orbuch-oficina-plan-ejercicios.jpg',
    imageAlt: 'Páginas del cuadernillo Gimnasia de oficinas con una fotografía y un plan guía de ejercicios',
    imageCaption: 'Plan guía de gimnasia para realizar junto al puesto de trabajo.',
    imageCredit: 'Consejo Nacional de Educación Física, 1950 · fuente primaria del proyecto',
    evidence: 'Orbuch (2020): 5.000 ejemplares y una intervención que buscó extenderse al ámbito privado.',
    featured: true,
  },
  {
    id: 'maracanazo-1950',
    year: '16 JUL 1950',
    scope: 'Región',
    dimension: 'Fútbol y cultura de masas',
    title: 'El Maracanazo',
    text: 'Uruguay derrota 2–1 a Brasil en el partido decisivo del Mundial de 1950, ante una multitud en el Maracaná. El acontecimiento muestra hasta qué punto el deporte ya forma parte de las grandes experiencias compartidas de la cultura de masas sudamericana.',
    visualLabel: '1950\nURUGUAY 2\nBRASIL 1\nMARACANÁ',
    sourceUrl: 'https://www.fifa.com/es/articles/cuantas-finales-mundial-participo-uruguay-historial',
    sourceLabel: 'FIFA · Brasil 1950',
  },
];

function HistoricalContextCarousel() {
  const carouselRef = useRef(null);
  const trackRef = useRef(null);
  const yearsRef = useRef(null);
  const frameRef = useRef(null);
  const wheelDeltaRef = useRef(0);
  const wheelTimerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback((requestedIndex, behavior = 'smooth') => {
    const track = trackRef.current;
    if (!track) return;

    const index = Math.max(0, Math.min(HISTORICAL_SCENE_EVENTS.length - 1, requestedIndex));
    const slide = track.querySelector(`[data-orbuch-history-index="${index}"]`);
    if (!slide) return;

    track.scrollTo({ left: slide.offsetLeft, behavior });
    setActiveIndex(index);
  }, []);

  const updateActiveIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    window.cancelAnimationFrame(frameRef.current);
    frameRef.current = window.requestAnimationFrame(() => {
      const slides = Array.from(track.querySelectorAll('[data-orbuch-history-index]'));
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
        const slides = Array.from(track.querySelectorAll('[data-orbuch-history-index]'));
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
      window.cancelAnimationFrame(frameRef.current);
      window.clearTimeout(wheelTimerRef.current);
    };
  }, [scrollToIndex]);

  useEffect(() => {
    const years = yearsRef.current;
    const activeYear = years?.querySelector(`[data-orbuch-year-index="${activeIndex}"]`);
    if (!years || !activeYear) return;

    const target = activeYear.offsetLeft - ((years.clientWidth - activeYear.offsetWidth) / 2);
    years.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [activeIndex]);

  const handleKeyDown = (event) => {
    const destinations = {
      ArrowLeft: activeIndex - 1,
      ArrowRight: activeIndex + 1,
      Home: 0,
      End: HISTORICAL_SCENE_EVENTS.length - 1,
    };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    scrollToIndex(destinations[event.key]);
  };

  const activeItem = HISTORICAL_SCENE_EVENTS[activeIndex];
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === HISTORICAL_SCENE_EVENTS.length - 1;

  return (
    <section className="orbuch-social-context" aria-labelledby="orbuch-social-context-title">
      <header className="orbuch-social-context__intro">
        <p>Escena ampliada · historia social</p>
        <h3 id="orbuch-social-context-title">Argentina y el mundo, 1943–1950</h3>
        <span>
          Política, trabajo, derechos, tecnología, literatura, deporte, medios y vida cotidiana se entrecruzan para reconstruir el clima histórico en el que aparecen las dos experiencias estudiadas por Orbuch.
        </span>
        <div className="orbuch-social-context__legend" aria-label="Alcance geográfico de los hitos">
          <i><b /> Argentina</i>
          <i><b /> Región</i>
          <i><b /> Mundo</i>
        </div>
      </header>

      <div
        ref={carouselRef}
        className="orbuch-history-carousel"
        role="region"
        aria-roledescription="carrusel"
        aria-label="Contexto histórico nacional, regional e internacional de 1943 a 1950"
      >
        <div className="orbuch-history-carousel__viewport">
          <div
            ref={trackRef}
            className="orbuch-history-track"
            role="list"
            tabIndex="0"
            aria-describedby="orbuch-history-navigation-hint"
            onScroll={updateActiveIndex}
            onKeyDown={handleKeyDown}
          >
            {HISTORICAL_SCENE_EVENTS.map((item, index) => (
              <article
                key={item.id}
                role="listitem"
                data-orbuch-history-index={index}
                className={`orbuch-history-event${item.featured ? ' is-featured' : ''}`}
                aria-label={`${item.year}: ${item.title}`}
              >
                <div className="orbuch-history-event__node" aria-hidden="true">
                  <span>{item.year}</span>
                  <i />
                </div>

                <div className="orbuch-history-event__card">
                  <figure className={`orbuch-history-event__visual${item.image ? '' : ' is-typographic'}`}>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.imageAlt}
                        loading={index > 1 ? 'lazy' : 'eager'}
                        decoding="async"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div aria-hidden="true">
                        {item.visualLabel.split('\n').map((line) => <span key={line}>{line}</span>)}
                      </div>
                    )}
                    {(item.imageCaption || item.imageCredit) && (
                      <figcaption>
                        {item.imageCaption && <span>{item.imageCaption}</span>}
                        {item.imageCredit && <small>{item.imageCredit}</small>}
                      </figcaption>
                    )}
                  </figure>

                  <div className="orbuch-history-event__copy">
                    <div className="orbuch-history-event__meta">
                      <div>
                        <span className={`orbuch-history-scope orbuch-history-scope--${item.scope.toLowerCase()}`}>{item.scope}</span>
                        <span className="orbuch-history-dimension">{item.dimension}</span>
                      </div>
                      <b aria-hidden="true">{String(index + 1).padStart(2, '0')}</b>
                    </div>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                    {item.evidence && <p className="orbuch-history-event__evidence">{item.evidence}</p>}
                    {item.sourceUrl && (
                      <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                        {item.sourceLabel || 'Ver fuente'} <ExternalLink size={13} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="orbuch-history-controls" aria-label="Controles del carrusel histórico">
          <button
            type="button"
            className="orbuch-history-arrow"
            aria-label="Ir al hito anterior"
            disabled={isFirst}
            onClick={() => scrollToIndex(activeIndex - 1)}
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>

          <div ref={yearsRef} className="orbuch-history-years" aria-label="Elegir un hito por fecha">
            {HISTORICAL_SCENE_EVENTS.map((item, index) => (
              <button
                key={`${item.id}-year`}
                type="button"
                data-orbuch-year-index={index}
                className={index === activeIndex ? 'is-active' : undefined}
                aria-label={`Ir a ${item.year}: ${item.title}`}
                aria-current={index === activeIndex ? 'step' : undefined}
                onClick={() => scrollToIndex(index)}
              >
                {item.year}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="orbuch-history-arrow"
            aria-label="Ir al hito siguiente"
            disabled={isLast}
            onClick={() => scrollToIndex(activeIndex + 1)}
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </div>

        <div className="orbuch-history-status">
          <p aria-live="polite" aria-atomic="true">
            <strong>{activeItem.year}</strong>
            <span>{activeItem.title}</span>
            <small>{activeIndex + 1} / {HISTORICAL_SCENE_EVENTS.length}</small>
          </p>
          <p id="orbuch-history-navigation-hint" className={isLast ? 'is-exit-hint' : undefined}>
            {isLast
              ? 'Llegaste a 1950. Seguí desplazándote hacia abajo para continuar con las claves de lectura y las fuentes primarias.'
              : 'Deslizá hacia los costados o usá la rueda, el trackpad, las flechas o el teclado.'}
          </p>
        </div>
      </div>
    </section>
  );
}

export default function HistoricalContextEnhancement() {
  const [host, setHost] = useState(null);

  useEffect(() => {
    const legacyTimeline = document.querySelector('#contexto .orbuch-timeline');
    if (!legacyTimeline) return undefined;

    const mount = document.createElement('div');
    mount.className = 'orbuch-history-carousel-host';
    mount.dataset.orbuchContextUpgrade = 'true';
    legacyTimeline.insertAdjacentElement('afterend', mount);
    legacyTimeline.hidden = true;
    setHost(mount);

    return () => {
      legacyTimeline.hidden = false;
      mount.remove();
    };
  }, []);

  return host ? createPortal(<HistoricalContextCarousel />, host) : null;
}

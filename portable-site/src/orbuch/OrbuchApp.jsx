import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Building2,
  ExternalLink,
  FileText,
  Headphones,
  Landmark,
  School,
} from 'lucide-react';
import IntegratedReader from '../IntegratedReader.jsx';
import { orbuchReaderConfig } from '../readerConfigs.js';
import { orbuchReadingDocument } from './orbuchReadingDocument.js';

const NAV_ITEMS = [
  ['inicio', 'Inicio'],
  ['autor', 'Autor'],
  ['contexto', 'Contexto'],
  ['lectura', 'Lectura'],
  ['creditos', 'Créditos'],
];

const CONTEXT_EVENTS = [
  {
    year: '1936–1938',
    tag: 'Continuidad',
    title: 'Organismos antes del peronismo',
    text: 'Distintas agencias estatales ya buscaban regular la cultura física. Orbuch parte de esas continuidades para evitar una historia con un comienzo absoluto en 1946.',
  },
  {
    year: '1946–1947',
    tag: 'Tensión',
    title: 'Tres proyectos en disputa',
    text: 'Las propuestas legislativas combinaron perspectivas militares, sanitarias y educativas. La coalición oficialista no actuó como un bloque homogéneo.',
  },
  {
    year: '6 NOV 1947',
    tag: 'Institución',
    title: 'Consejo Nacional de Educación Física',
    text: 'El decreto 34.817 creó el Consejo bajo la órbita del Ministerio de Guerra y amplió la escala nacional de las políticas de educación corporal.',
  },
  {
    year: '1949',
    tag: 'Aula',
    title: 'El cuerpo entra en cada clase',
    text: 'Gimnasia compensatoria en el aula propuso hasta tres minutos de ejercicios por hora escolar, bajo la conducción del maestro de grado.',
  },
  {
    year: '1950',
    tag: 'Oficina',
    title: 'El cuerpo entra en la oficina',
    text: 'Gimnasia de oficinas llevó la intervención al tiempo de trabajo con pausas de cinco a diez minutos, líderes internos y adhesión voluntaria.',
  },
];

const DOSSIERS = [
  {
    id: 'aula',
    label: 'Expediente A · 1949',
    title: 'Gimnasia compensatoria en el aula',
    count: '10.000 ejemplares',
    icon: School,
    cover: '/assets/orbuch-gimnasia-compensatoria-portada.png',
    coverAlt: 'Portada original del cuadernillo Gimnasia compensatoria en el aula, de 1949',
    facts: [
      ['Institución', 'Consejo Nacional de Educación Física'],
      ['Autor atribuido', 'Alejandro Amavet'],
      ['Destinatarios', 'Alumnado de 2.º a 6.º grado y maestros'],
      ['Propuesta', 'Hasta tres minutos en cada hora escolar'],
    ],
    images: [
      {
        src: '/assets/orbuch-aula-generalidades.jpg',
        alt: 'Doble página del folleto de 1949 con estudiantes ejercitándose en el aula',
        caption: 'Escuelas reconocidas funcionaban como legitimación visual de la propuesta.',
      },
      {
        src: '/assets/orbuch-aula-plan-ejercicios.jpg',
        alt: 'Indicaciones y dibujos de gimnasia compensatoria junto al pupitre',
        caption: 'El plan traducía la política en posturas, ritmos e instrucciones para el maestro.',
      },
    ],
    pdf: '/assets/orbuch-gimnasia-compensatoria-1949.pdf',
  },
  {
    id: 'oficina',
    label: 'Expediente B · 1950',
    title: 'Gimnasia de oficinas',
    count: '5.000 ejemplares',
    icon: Building2,
    cover: '/assets/orbuch-gimnasia-oficinas-portada.png',
    coverAlt: 'Portada original del cuadernillo Gimnasia de oficinas, de 1950',
    facts: [
      ['Institución', 'Consejo Nacional de Educación Física'],
      ['Marco', 'Derecho constitucional a preservar la salud'],
      ['Destinatarios', 'Empleados, empleadores y líderes de oficina'],
      ['Propuesta', 'Entre cinco y diez minutos durante la fatiga'],
    ],
    images: [
      {
        src: '/assets/orbuch-oficina-derecho-salud.jpg',
        alt: 'Página sobre el derecho a la preservación de la salud en el folleto de 1950',
        caption: 'La apertura vinculaba salud física y moral con las condiciones de trabajo.',
      },
      {
        src: '/assets/orbuch-oficina-plan-ejercicios.jpg',
        alt: 'Fotografía de oficinistas y plan guía de ejercicios junto al escritorio',
        caption: 'La práctica se presentaba como una pausa posible sin abandonar el puesto.',
      },
    ],
    pdf: '/assets/orbuch-gimnasia-oficinas-1950.pdf',
  },
];

function useScrollState() {
  const [active, setActive] = useState('inicio');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maximum > 0 ? Math.min(100, (window.scrollY / maximum) * 100) : 0);
      const readingLine = Math.min(Math.max(window.innerHeight * 0.2, 86), 150);
      let current = NAV_ITEMS[0][0];
      NAV_ITEMS.forEach(([id]) => {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= readingLine) current = id;
      });
      setActive(current);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return { active, progress };
}

function SectionHeader({ number, eyebrow, title, text }) {
  return (
    <header className="orbuch-section-heading">
      <span>{number}</span>
      <div>
        <p>{eyebrow}</p>
        <h2>{title}</h2>
        {text && <div className="orbuch-section-intro">{text}</div>}
      </div>
    </header>
  );
}

function SiteHeader({ active, progress }) {
  const activeIndex = Math.max(0, NAV_ITEMS.findIndex(([id]) => id === active));

  return (
    <header className="orbuch-header" data-section={active}>
      <div className="orbuch-header__inner">
        <a className="orbuch-library-link" href={import.meta.env.BASE_URL} aria-label="Volver a la biblioteca">
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Biblioteca</span>
        </a>
        <div className="orbuch-section-counter" aria-live="polite">
          <span>{String(activeIndex + 1).padStart(2, '0')} / {String(NAV_ITEMS.length).padStart(2, '0')}</span>
          <strong>{NAV_ITEMS[activeIndex]?.[1]}</strong>
        </div>
        <div
          className="orbuch-progress-track"
          role="progressbar"
          aria-label="Progreso del recorrido"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={Math.round(progress)}
        >
          <i style={{ width: `${progress}%` }} />
        </div>
        <nav aria-label="Secciones del recorrido">
          {NAV_ITEMS.map(([id, label]) => (
            <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined}>
              {label}
            </a>
          ))}
        </nav>
      </div>
      <div className="orbuch-mobile-progress" aria-hidden="true"><i style={{ width: `${progress}%` }} /></div>
    </header>
  );
}

function Hero() {
  return (
    <section id="inicio" className="orbuch-hero">
      <picture className="orbuch-hero__mural">
        <source media="(max-width: 700px)" srcSet="/assets/orbuch-hero-mural-mobile.webp" />
        <img
          src="/assets/orbuch-hero-mural-desktop.webp"
          alt="Mural alegórico con una escuela, una oficina, trabajadores y un cuadernillo de ejercicios bajo un amanecer"
        />
      </picture>
      <div className="orbuch-hero__veil" aria-hidden="true" />
      <div className="orbuch-hero__copy">
        <p className="orbuch-eyebrow">Recorrido documental e interactivo</p>
        <p className="orbuch-hero-period">Argentina · 1946–1950</p>
        <h1>
          <span>Educar el cuerpo</span>
          <span>dentro y fuera</span>
          <span>del aula</span>
        </h1>
        <p className="orbuch-subtitle">Análisis de dos experiencias en la Nueva Argentina de Perón</p>
        <p className="orbuch-hero-question">
          ¿Cómo intentó el Estado extender la educación corporal desde la escuela hacia otros espacios cotidianos?
        </p>
        <p className="orbuch-hero-intro">
          Un recorrido para reconstruir cómo una política estatal de educación corporal atravesó el aula y la oficina, y qué tensiones aparecieron al intentar llevarla a la práctica.
        </p>
        <a className="orbuch-primary-action" href="#autor">
          Comenzar el recorrido
          <svg aria-hidden="true" viewBox="0 0 42 20"><path d="M1 10h38M31 2l8 8-8 8" /></svg>
        </a>
        <p className="orbuch-use-note">
          <span>Audio 27:53</span>
          <span>Lectura individual o grupal</span>
          <span>Sin registro</span>
        </p>
      </div>

      <div className="orbuch-archive-stage" aria-label="Dos expedientes históricos">
        <article className="orbuch-folder orbuch-folder--aula">
          <div className="orbuch-folder__sheet">
            <img src="/assets/orbuch-gimnasia-compensatoria-portada.png" alt="Portada de Gimnasia compensatoria en el aula, Consejo Nacional de Educación Física, 1949" />
          </div>
          <div className="orbuch-folder__tab">Aula · 1949</div>
        </article>
        <article className="orbuch-folder orbuch-folder--oficina">
          <div className="orbuch-folder__sheet">
            <img src="/assets/orbuch-gimnasia-oficinas-portada.png" alt="Portada de Gimnasia de oficinas, Consejo Nacional de Educación Física, 1950" />
          </div>
          <div className="orbuch-folder__tab">Oficina · 1950</div>
        </article>
      </div>

      <ol className="orbuch-hero-operations" aria-label="Tres operaciones que organizan el recorrido">
        <li><b>1</b><span>Prescripción</span></li>
        <li><b>2</b><span>Implementación</span></li>
        <li><b>3</b><span>Tensiones</span></li>
      </ol>
    </section>
  );
}

function ContinueLink({ href, children }) {
  return (
    <a className="orbuch-continue-link" href={href}>
      {children}
      <svg aria-hidden="true" viewBox="0 0 42 20"><path d="M1 10h38M31 2l8 8-8 8" /></svg>
    </a>
  );
}

function AuthorSection() {
  return (
    <section id="autor" className="orbuch-author orbuch-section">
      <div className="orbuch-shell orbuch-author__grid">
        <figure className="orbuch-author__portrait-wrap">
          <div className="orbuch-author__initial" aria-hidden="true">I</div>
          <img
            className="orbuch-author__portrait"
            src="/assets/orbuch-ivan-orbuch.webp"
            alt="Retrato de Iván Pablo Orbuch"
          />
          <figcaption>Fotografía: Universidad Nacional de Hurlingham (UNAHUR), 2020.</figcaption>
        </figure>
        <div className="orbuch-author__copy">
          <p className="orbuch-author__eyebrow">El autor del texto</p>
          <h2>Iván Pablo Orbuch</h2>
          <p className="orbuch-author__role">Historiador de la educación · Doctor en Educación</p>
          <p className="orbuch-author__summary">
            Iván Pablo Orbuch es profesor de Historia, magíster en Ciencias Sociales y doctor en Educación. Docente e investigador de la Universidad Nacional de Hurlingham, estudia los vínculos entre educación, cultura física, ciudadanía y Estado. Sus trabajos reconstruyen políticas del primer peronismo y atienden especialmente a sus organismos, lenguajes, destinatarios, mediaciones y dificultades de implementación, tanto en espacios escolares como extraescolares.
          </p>
          <a className="orbuch-author__link" href="https://aulaabierta.unahur.edu.ar/index.php/2020/01/08/investigacion-sub-40-ivan-orbuch/" target="_blank" rel="noreferrer">
            Ver biografía académica <ExternalLink size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}

function Dossier({ source }) {
  const Icon = source.icon;
  return (
    <article className={`orbuch-dossier orbuch-dossier--${source.id}`}>
      <header>
        <div><p>{source.label}</p><h3>{source.title}</h3></div>
        <span>{source.count}</span>
      </header>
      <div className="orbuch-dossier__lead">
        <figure><img src={source.cover} alt={source.coverAlt} /></figure>
        <dl>
          {source.facts.map(([term, description]) => (
            <div key={term}><dt>{term}</dt><dd>{description}</dd></div>
          ))}
        </dl>
      </div>
      <div className="orbuch-dossier__gallery">
        {source.images.map((image) => (
          <figure key={image.src}>
            <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
            <figcaption>{image.caption}</figcaption>
          </figure>
        ))}
      </div>
      <a className="orbuch-document-link" href={source.pdf} target="_blank" rel="noreferrer">
        <Icon size={18} /> Abrir PDF completo <ExternalLink size={14} />
      </a>
    </article>
  );
}

function ContextSection() {
  return (
    <section id="contexto" className="orbuch-context orbuch-section">
      <div className="orbuch-shell">
        <SectionHeader
          number="03"
          eyebrow="Contexto histórico y documental"
          title="Un Estado que busca ampliar su radio de acción"
          text="La pregunta, la cronología y las fuentes primarias reúnen los elementos necesarios para comprender la aparición de ambos cuadernillos y las tensiones que los atraviesan."
        />
        <div className="orbuch-context__problem">
          <div className="orbuch-question-card">
            <span>Pregunta que organiza el recorrido</span>
            <p>¿Cómo intentó el Consejo Nacional de Educación Física extender la educación corporal desde la escuela hacia otros espacios cotidianos, y qué revela esa expansión sobre el Estado peronista?</p>
          </div>
          <aside className="orbuch-reading-warning">
            <strong>No busques una historia de éxito lineal.</strong>
            <p>Los cuadernillos permiten conocer lo que se quiso prescribir. Para comprender qué ocurrió al implementarlo hay que leer también las resistencias, negociaciones y límites reconstruidos por Iván Orbuch.</p>
          </aside>
        </div>
        <ol className="orbuch-timeline" aria-label="Cronología selectiva de 1936 a 1950">
          {CONTEXT_EVENTS.map((event) => (
            <li key={event.year}>
              <div className="orbuch-timeline__date">
                <time>{event.year}</time>
                <small>{event.tag}</small>
              </div>
              <div className="orbuch-timeline__content">
                <h3>{event.title}</h3>
                <p>{event.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="orbuch-context__statement">
          <Landmark size={30} aria-hidden="true" />
          <div>
            <p>Advertencia historiográfica</p>
            <strong>El primer peronismo no fue un bloque homogéneo.</strong>
            <span>La creación del Consejo bajo dependencia castrense resolvió institucionalmente una disputa, pero no eliminó la coexistencia de lenguajes sanitarios, pedagógicos, productivos y disciplinarios.</span>
          </div>
        </div>
        <div className="orbuch-context__subheading">
          <p>Claves de lectura</p>
          <h3>Cuatro movimientos del argumento</h3>
        </div>
        <div className="orbuch-argument-map">
          <article><span>01</span><h3>Antecedentes</h3><p>Reconstruye organismos y proyectos previos para evitar pensar 1946 como un comienzo absoluto.</p></article>
          <article><span>02</span><h3>Escala estatal</h3><p>Señala una ruptura en la masividad, la centralización y la voluntad de alcanzar todo el territorio.</p></article>
          <article><span>03</span><h3>Dos experiencias</h3><p>Analiza los cuadernillos para el aula y la oficina como estrategias emparentadas, pero no idénticas.</p></article>
          <article><span>04</span><h3>Prescripción y práctica</h3><p>La insistencia persuasiva de las fuentes se interpreta como indicio de resistencias y límites.</p></article>
        </div>
        <div className="orbuch-context__subheading orbuch-context__subheading--archive">
          <p>Archivo comparado</p>
          <h3>Dos documentos, una expansión y diferentes mediaciones</h3>
          <span>Cada expediente reúne el cuadernillo original, una selección visual y las claves analíticas reconstruidas por el texto de Orbuch.</span>
        </div>
        <div className="orbuch-dossiers">
          {DOSSIERS.map((source) => <Dossier key={source.id} source={source} />)}
        </div>
        <ContinueLink href="#lectura">Preparar la lectura</ContinueLink>
      </div>
    </section>
  );
}

function ReadingSection() {
  return (
    <section id="lectura" className="orbuch-reading orbuch-section">
      <div className="orbuch-shell">
        <SectionHeader
          number="04"
          eyebrow="Mesa de lectura"
          title="Leer con una pregunta y el texto completo"
          text="El artículo académico sigue siendo el centro. El lector reúne texto accesible, audiolibro y anotaciones, y ahora acompaña la narración oración por oración."
        />
        <aside className="orbuch-reading-question">
          <span>Pregunta que acompaña la lectura</span>
          <p>¿Cómo intentó el Consejo Nacional de Educación Física extender la educación corporal a toda la población y qué tensiones aparecen entre las prescripciones estatales y su implementación?</p>
        </aside>
        <div className="orbuch-reader-stage">
          <IntegratedReader readingDocument={orbuchReadingDocument} config={orbuchReaderConfig} />
        </div>
        <div className="orbuch-resource-strip" aria-label="Recursos de lectura y escucha">
          <a href="/assets/orbuch-educar-al-cuerpo.pdf" target="_blank" rel="noreferrer"><FileText size={19} /><span>Artículo académico</span><ExternalLink size={13} /></a>
          <a href="/assets/orbuch-texto-accesible.txt" target="_blank" rel="noreferrer"><BookOpen size={19} /><span>Texto accesible</span><ExternalLink size={13} /></a>
          <a href="/assets/orbuch-audiolibro.mp3" target="_blank" rel="noreferrer"><Headphones size={19} /><span>MP3 · 27:53</span><ExternalLink size={13} /></a>
          <a href="/assets/orbuch-subtitulos.srt" target="_blank" rel="noreferrer"><FileText size={19} /><span>Subtítulos SRT</span><ExternalLink size={13} /></a>
        </div>
        <ContinueLink href="#creditos">Consultar créditos y procedencias</ContinueLink>
      </div>
    </section>
  );
}

function CreditsSection() {
  return (
    <footer id="creditos" className="orbuch-credits orbuch-section">
      <div className="orbuch-shell">
        <SectionHeader
          number="05"
          eyebrow="Créditos y procedencias"
          title="Cada recurso conserva su historia"
          text="Las referencias siguen APA 7. Los documentos primarios se publican para uso educativo con la procedencia disponible y sin atribuirles una licencia no consignada."
        />
        <div className="orbuch-credits__grid">
          <article>
            <h3>Texto académico</h3>
            <p className="orbuch-citation">Orbuch, I. P. (2020). Educar al cuerpo dentro y fuera del aula. Análisis de dos experiencias en la Nueva Argentina de Perón. <em>History of Education in Latin America, 3</em>, e21435.</p>
            <a href="https://periodicos.ufrn.br/histela/article/view/21435" target="_blank" rel="noreferrer">Publicación original <ExternalLink size={13} /></a>
          </article>
          <article>
            <h3>Fuente primaria · 1949</h3>
            <p><em>Gimnasia compensatoria en el aula</em>. Consejo Nacional de Educación Física. Autor atribuido: Alejandro Amavet. Copia digital completa aportada a las fuentes del proyecto.</p>
            <p>Licencia no consignada en el ejemplar digital.</p>
          </article>
          <article>
            <h3>Fuente primaria · 1950</h3>
            <p><em>Gimnasia de oficinas</em>. Consejo Nacional de Educación Física. Procedencia: Biblioteca César Vázquez; copia digital completa aportada a las fuentes del proyecto.</p>
            <p>Licencia no consignada en el ejemplar digital.</p>
          </article>
          <article>
            <h3>Contexto historiográfico</h3>
            <p>Torre, J. C., &amp; Pastoriza, E. (2002). La democratización del bienestar. En J. C. Torre (Dir.), <em>Los años peronistas (1943–1955)</em> (pp. 257–312). Sudamericana.</p>
          </article>
          <article>
            <h3>Audio y subtítulos</h3>
            <p>El audiolibro definitivo y el archivo SRT fueron aportados por el proyecto. Sus 410 cues coinciden íntegramente con el guion accesible; las marcas se normalizan a la duración técnica del MP3 para evitar deriva durante la escucha.</p>
          </article>
          <article>
            <h3>Identidad visual</h3>
            <p>El mural cívico-popular fue creado para el Site original. Evoca la cultura gráfica institucional del primer peronismo; no reproduce un afiche histórico ni representa personas identificables.</p>
            <p>Retrato de Iván Pablo Orbuch: Universidad Nacional de Hurlingham, perfil institucional <em>Investigación Sub 40</em> (2020).</p>
            <a href="https://aulaabierta.unahur.edu.ar/index.php/2020/01/08/investigacion-sub-40-ivan-orbuch/" target="_blank" rel="noreferrer">Fuente de la fotografía <ExternalLink size={13} /></a>
          </article>
          <article>
            <h3>Datos y privacidad</h3>
            <p>No se solicitan datos personales ni se envían notas a un servidor. El progreso y el cuaderno de esta obra permanecen en este navegador, separados de los de Pineau.</p>
          </article>
        </div>
        <div className="orbuch-credits__bottom">
          <a href={import.meta.env.BASE_URL}><ArrowLeft size={16} /> Volver a la biblioteca</a>
          <p>Fuente Primaria · Historia de la Educación y de la Educación Física</p>
        </div>
      </div>
    </footer>
  );
}

export default function OrbuchApp() {
  const { active, progress } = useScrollState();

  return (
    <div className="orbuch-page">
      <SiteHeader active={active} progress={progress} />
      <main>
        <Hero />
        <AuthorSection />
        <ContextSection />
        <ReadingSection />
      </main>
      <CreditsSection />
    </div>
  );
}

import { useEffect, useState } from 'react';
import {
  ArrowDown,
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
    title: 'Organismos antes del peronismo',
    text: 'Distintas agencias estatales ya buscaban regular la cultura física. Orbuch parte de esas continuidades para evitar una historia con un comienzo absoluto en 1946.',
  },
  {
    year: '1946–1947',
    title: 'Tres proyectos en disputa',
    text: 'Las propuestas legislativas combinaron perspectivas militares, sanitarias y educativas. La coalición oficialista no actuó como un bloque homogéneo.',
  },
  {
    year: '6 NOV 1947',
    title: 'Consejo Nacional de Educación Física',
    text: 'El decreto 34.817 creó el Consejo bajo la órbita del Ministerio de Guerra y amplió la escala nacional de las políticas de educación corporal.',
  },
  {
    year: '1949',
    title: 'El cuerpo entra en cada clase',
    text: 'Gimnasia compensatoria en el aula propuso hasta tres minutos de ejercicios por hora escolar, bajo la conducción del maestro de grado.',
  },
  {
    year: '1950',
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
  return (
    <header className="orbuch-header">
      <div className="orbuch-progress" aria-hidden="true"><i style={{ width: `${progress}%` }} /></div>
      <div className="orbuch-header__inner">
        <a className="orbuch-library-link" href={import.meta.env.BASE_URL}>
          <ArrowLeft size={16} aria-hidden="true" /> Biblioteca
        </a>
        <a className="orbuch-brand" href="#inicio" aria-label="Ir al inicio de Educar al cuerpo">
          <span aria-hidden="true">FP</span>
          <strong>Fuente Primaria</strong>
        </a>
        <nav aria-label="Secciones del recorrido">
          {NAV_ITEMS.map(([id, label]) => (
            <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined}>
              {label}
            </a>
          ))}
        </nav>
        <p className="orbuch-current" aria-live="polite">{NAV_ITEMS.find(([id]) => id === active)?.[1]}</p>
      </div>
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
      <div className="orbuch-shell orbuch-hero__content">
        <p className="orbuch-kicker">Historia de la educación física · Argentina, 1946–1955</p>
        <h1>
          <span>Educar al cuerpo</span>
          <span>dentro y fuera del aula</span>
        </h1>
        <p className="orbuch-subtitle">Análisis de dos experiencias en la Nueva Argentina de Perón</p>
        <div className="orbuch-byline">
          <strong>Iván Pablo Orbuch</strong>
          <span>Artículo académico · audiolibro · archivo primario</span>
        </div>
        <div className="orbuch-hero__actions">
          <a className="orbuch-button orbuch-button--gold" href="#lectura"><Headphones size={18} /> Leer y escuchar</a>
          <a className="orbuch-button orbuch-button--ghost" href="/assets/orbuch-educar-al-cuerpo.pdf" target="_blank" rel="noreferrer">
            <FileText size={18} /> Artículo original
          </a>
        </div>
      </div>
      <a className="orbuch-scroll" href="#autor" aria-label="Continuar hacia el autor"><ArrowDown size={22} /></a>
    </section>
  );
}

function AuthorSection() {
  return (
    <section id="autor" className="orbuch-author orbuch-section">
      <div className="orbuch-shell">
        <SectionHeader
          number="01"
          eyebrow="Autor y lugar de enunciación"
          title="Una historia de la educación corporal atenta a las tensiones"
          text="Conocer al autor no reemplaza el análisis: permite reconocer qué preguntas orientan la selección de fuentes y la interpretación."
        />
        <div className="orbuch-author__grid">
          <div className="orbuch-author__monogram" aria-hidden="true">
            <span>IO</span>
            <small>HISTORIA<br />EDUCACIÓN<br />CUERPO</small>
          </div>
          <article>
            <p className="orbuch-lede">
              Iván Pablo Orbuch es profesor de Historia, Magíster en Ciencias Sociales y Doctor en Educación. Es docente e investigador en la Universidad Nacional de Hurlingham.
            </p>
            <p>
              Su trabajo estudia las relaciones entre educación, cultura física, ciudadanía y Estado. En este artículo reconstruye dos políticas del primer peronismo sin tratarlas como una aplicación uniforme: sigue las prescripciones, sus mediaciones y los límites de su puesta en práctica.
            </p>
            <blockquote>
              La escala estatal se amplía, pero la directiva no se convierte automáticamente en práctica. Entre ambas aparecen docentes, empleados, instituciones, resistencias y persuasiones.
            </blockquote>
            <a className="orbuch-text-link" href="https://aulaabierta.unahur.edu.ar/index.php/2020/01/08/investigacion-sub-40-ivan-orbuch/" target="_blank" rel="noreferrer">
              Perfil institucional en UNAHUR <ExternalLink size={14} />
            </a>
          </article>
          <aside className="orbuch-author__lens">
            <p>Clave de lectura</p>
            <strong>Evitar una historia binaria</strong>
            <span>Ni un Estado omnipotente ni una sociedad pasiva: el texto muestra proyectos rivales, continuidades previas y resultados incompletos.</span>
          </aside>
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
          number="02"
          eyebrow="Contexto y archivo"
          title="Del proyecto estatal a dos escenas cotidianas"
          text="El artículo conecta la formación ciudadana con espacios y tiempos concretos: el pupitre escolar y el escritorio de oficina."
        />
        <div className="orbuch-context__statement">
          <Landmark size={28} aria-hidden="true" />
          <p>
            Leídas junto a la “democratización del bienestar”, estas iniciativas muestran otra dimensión de la expansión estatal: intervenir sobre salud, postura, atención y rendimiento. Orbuch subraya, a la vez, que esa expansión encontró mediaciones y límites.
          </p>
        </div>
        <ol className="orbuch-timeline" aria-label="Cronología selectiva de 1936 a 1950">
          {CONTEXT_EVENTS.map((event, index) => (
            <li key={event.year}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <time>{event.year}</time>
              <h3>{event.title}</h3>
              <p>{event.text}</p>
            </li>
          ))}
        </ol>

        <div className="orbuch-archive-heading">
          <p>Archivo comparado</p>
          <h2>Dos documentos, una expansión y diferentes mediaciones</h2>
          <span>Las reproducciones siguientes pertenecen a los cuadernillos originales de 1949 y 1950.</span>
        </div>
        <div className="orbuch-dossiers">
          {DOSSIERS.map((source) => <Dossier key={source.id} source={source} />)}
        </div>
      </div>
    </section>
  );
}

function ReadingSection() {
  return (
    <section id="lectura" className="orbuch-reading orbuch-section">
      <div className="orbuch-shell">
        <SectionHeader
          number="03"
          eyebrow="Lectura y audiolibro"
          title="El texto vuelve a reunir aula, oficina y política"
          text="La versión accesible conserva la adaptación preparada para la narración; el PDF abre el artículo académico con su aparato crítico completo."
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
        </div>
      </div>
    </section>
  );
}

function CreditsSection() {
  return (
    <footer id="creditos" className="orbuch-credits orbuch-section">
      <div className="orbuch-shell">
        <SectionHeader
          number="04"
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
            <h3>Identidad visual</h3>
            <p>El mural cívico-popular fue creado para el Site original. Evoca la cultura gráfica institucional del primer peronismo; no reproduce un afiche histórico ni representa personas identificables.</p>
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

import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Building2,
  ExternalLink,
  Landmark,
  School,
} from 'lucide-react';
import IntegratedReader from '../IntegratedReader.jsx';
import { AuthorBiography, PineauLayoutReference } from '../shared/CanonicalLayout.jsx';
import JourneyHeader, { useJourneyNavigation } from '../shared/JourneyHeader.jsx';
import JourneyBlockLabel from '../shared/JourneyBlockLabel.jsx';
import JourneyCredits from '../shared/JourneyCredits.jsx';
import { orbuchReaderConfig } from '../readerConfigs.js';
import { orbuchReadingDocument } from './orbuchReadingDocument.js';

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

function SectionHeader({ sectionId, title, text }) {
  return (
    <header className="orbuch-section-heading journey-section-heading">
      <div>
        <JourneyBlockLabel sectionId={sectionId} />
        <h2>{title}</h2>
        {text && <div className="orbuch-section-intro">{text}</div>}
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="inicio" aria-label="Inicio del recorrido" className="orbuch-hero">
      <picture className="orbuch-hero__mural">
        <source media="(max-width: 700px)" srcSet="/assets/orbuch-hero-mural-mobile.webp" />
        <img
          src="/assets/orbuch-hero-mural-desktop.webp"
          alt="Mural alegórico con una escuela, una oficina, trabajadores y un cuadernillo de ejercicios bajo un amanecer"
        />
      </picture>
      <div className="orbuch-hero__veil" aria-hidden="true" />
      <div className="orbuch-hero__copy">
        <JourneyBlockLabel sectionId="inicio" />
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
  return <section id="autor" className="orbuch-author orbuch-section">
    <AuthorBiography name="Iván Pablo Orbuch" initial="I" role="Historiador de la educación · Doctor en Educación"
      summary="Iván Pablo Orbuch es profesor de Historia, magíster en Ciencias Sociales y doctor en Educación. Docente e investigador de la Universidad Nacional de Hurlingham, estudia los vínculos entre educación, cultura física, ciudadanía y Estado. Sus trabajos reconstruyen políticas del primer peronismo y atienden especialmente a sus organismos, lenguajes, destinatarios, mediaciones y dificultades de implementación, tanto en espacios escolares como extraescolares."
      image="/assets/orbuch-ivan-orbuch.webp" imageAlt="Retrato de Iván Pablo Orbuch"
      credit="Fotografía: Universidad Nacional de Hurlingham (UNAHUR), 2020."
      biographyUrl="https://aulaabierta.unahur.edu.ar/index.php/2020/01/08/investigacion-sub-40-ivan-orbuch/" />
  </section>;
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
    <section id="contexto" aria-label="Contexto histórico" className="orbuch-context orbuch-section">
      <div className="orbuch-shell">
        <SectionHeader
          sectionId="contexto"
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
    <section id="lectura" className="journey-reading" aria-labelledby="journey-reading-title">
      <IntegratedReader readingDocument={orbuchReadingDocument} config={orbuchReaderConfig} />
    </section>
  );
}

export default function OrbuchApp() {
  const { active, progress } = useJourneyNavigation();

  return (
    <div className="orbuch-page canonical-page">
      <PineauLayoutReference />
      <JourneyHeader author="Orbuch" title="Educar al cuerpo" active={active} progress={progress} />
      <main>
        <Hero />
        <AuthorSection />
        <ContextSection />
        <ReadingSection />
      </main>
      <JourneyCredits workId="orbuch" />
    </div>
  );
}

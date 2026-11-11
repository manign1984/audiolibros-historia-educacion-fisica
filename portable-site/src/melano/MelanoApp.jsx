import { useState } from 'react';
import { ArrowDown, ArrowUpRight, BookOpenText, FileText, Quote, Layers3 } from 'lucide-react';
import JourneyHeader, { useJourneyNavigation } from '../shared/JourneyHeader.jsx';
import JourneyBlockLabel from '../shared/JourneyBlockLabel.jsx';
import JourneyCredits from '../shared/JourneyCredits.jsx';
import { AuthorBiography } from '../shared/CanonicalLayout.jsx';
import TextOnlyReader from '../shared/TextOnlyReader.jsx';
import { melanoReaderConfig } from './readerConfig.js';
import './melano.css';

const PORTRAIT = import.meta.env.BASE_URL + 'assets/melano/ignacio-melano-retrato.jpeg';
const RESOLUTION_URL = 'https://drive.google.com/file/d/15bo6oZeE9vhYWFbytFNyZCCSvcQGIg0f/view';
const CHAPTER_URL = 'https://drive.google.com/file/d/11kPIjFdMMIAwgfiukL0VenWDqloa10oB/view';
const BIO = 'Ignacio Emmanuel Melano es profesor y licenciado en Educación Física y magíster en Ciencias Sociales y Humanidades por la Universidad Nacional de Quilmes. Su producción académica aborda la historia de la formación de profesores, las culturas escolares y las relaciones entre educación, política y poder. Ha investigado especialmente la trayectoria del Instituto Nacional de Educación Física General Belgrano y sus transformaciones durante la última dictadura y la recuperación democrática.';

const stages = [
  { year: '1967', name: 'El traslado', body: 'El curso de varones del INEF General Belgrano se trasladó a la Capital Federal. La residencia de becarios en San Fernando continuó hasta 1972.' },
  { year: '1977', name: 'El regreso', body: 'La Resolución 543/77 autorizó que divisiones del INEF Buenos Aires funcionaran en San Fernando como anexo.' },
  { year: '1981', name: 'La recreación', body: 'Una resolución ministerial restituyó formalmente el Instituto Nacional de Educación Física General Manuel Belgrano.' },
];

const groups = [
  { name: 'Modernos', desc: 'Vinculados con la Gimnasia Moderna y propuestas pedagógicas abiertas.' },
  { name: 'San Fernandistas', desc: 'Identificados con las tradiciones formativas del instituto de San Fernando.' },
  { name: 'Juramentados', desc: 'Egresados que ampliaron su formación en ámbitos militares y ocuparon posiciones de poder.' },
];

function Inicio() {
  return <section id="inicio" className="melano-screen melano-hero" aria-labelledby="melano-title">
    <div className="melano-container melano-hero__layout">
      <div className="melano-hero__copy">
        <JourneyBlockLabel sectionId="inicio" />
        <p className="melano-eyebrow">Ignacio Melano <span aria-hidden="true">/</span> Capítulo 6 · EdUNLu</p>
        <h1 id="melano-title">Militares al gobierno,<span>juramentados al poder</span></h1>
        <p className="melano-hero__subtitle">La reapertura del INEF Gral. Belgrano en la década del 70</p>
        <p className="melano-hero__intro">En 1967, el curso de varones del INEF General Belgrano fue trasladado a Capital Federal. Diez años después la formación de profesores regresó al predio de San Fernando, esta vez como anexo del INEF Buenos Aires y durante la última dictadura. ¿Qué actores, tradiciones y vínculos de poder hicieron posible ese retorno?</p>
        <a className="melano-hero__next" href="#autor">Comenzar el recorrido <ArrowDown size={19} aria-hidden="true" /></a>
      </div>
      <div className="melano-hero__art" role="img" aria-label="Composición editorial contemporánea con los años 1967, 1977 y 1981, que distingue traslado, regreso y recreación formal. No es una fuente histórica.">
        <div className="melano-hero__art-top"><span>Archivo de una institución</span><span>1967—1981</span></div>
        <div className="melano-hero__art-center"><span className="melano-hero__art-numeral">77</span><span className="melano-hero__art-rule" /><strong>UN REGRESO<br />EN DISPUTA</strong></div>
        <div className="melano-hero__art-bottom"><span>Formación docente</span><span>Redes de poder</span><span>Cultura escolar</span></div>
      </div>
    </div>
    <div className="melano-hero__stripes" aria-hidden="true"><i/><i/><i/><i/><i/></div>
  </section>;
}

function Autor() {
  return <section id="autor" className="melano-screen melano-author" aria-label="Sobre Ignacio Melano">
    <AuthorBiography
      name="Ignacio Melano"
      initial="I"
      role="Historia de la Educación Física · Formación docente"
      summary={BIO}
      image={PORTRAIT}
      imageAlt="Retrato fotográfico de Ignacio Melano, facilitado por el autor"
      credit="Fotografía facilitada por Ignacio Melano para esta página."
      biographyUrl="https://periodicos.uepa.br/index.php/cocar/article/view/4871"
    />
  </section>;
}

function Contexto() {
  return <section id="contexto" className="melano-contexto" aria-label="Coordenadas históricas y lectura de fuentes">
    <div className="melano-screen melano-context-screen melano-context-one">
      <div className="melano-container melano-context-inner">
        <div className="melano-context-top">
          <JourneyBlockLabel sectionId="contexto" />
          <span>01 / 02 · Coordenadas históricas</span>
        </div>
        <div className="melano-context-heading">
          <p className="melano-eyebrow">Una institución, tres momentos diferentes</p>
          <h2>¿Qué significó <em>volver</em> a San Fernando?</h2>
          <p>El regreso al antiguo predio no fue un simple movimiento de estudiantes. Para comprenderlo hay que distinguir los cambios administrativos de las tradiciones y las redes de poder.</p>
        </div>
        <div className="melano-stages">
          {stages.map((stage, index) => <article key={stage.year} className="melano-stage">
            <div className="melano-stage__head"><span>{stage.year}</span><small>0{index + 1}</small></div>
            <h3>{stage.name}</h3>
            <p>{stage.body}</p>
          </article>)}
        </div>
        <div className="melano-groups" aria-label="Tres denominaciones presentes en el capítulo">
          {groups.map(group => <div key={group.name}><strong>{group.name}</strong><span>{group.desc}</span></div>)}
        </div>
        <p className="melano-question">¿Por qué el regreso no puede explicarse únicamente como una decisión administrativa?</p>
      </div>
    </div>
    <div className="melano-screen melano-context-screen melano-context-two">
      <div className="melano-container melano-context-inner">
        <div className="melano-context-top">
          <JourneyBlockLabel sectionId="contexto" />
          <span>02 / 02 · Interrogar las fuentes</span>
        </div>
        <div className="melano-context-heading">
          <p className="melano-eyebrow">Dos registros sobre un mismo proceso</p>
          <h2>Dos fuentes, <em>una reapertura</em></h2>
          <p>El documento administrativo señala qué se autorizó. Un testimonio de época permite aproximarnos a cómo algunos protagonistas recordaban y justificaban el retorno.</p>
        </div>
        <div className="melano-sources">
          <article className="melano-source-card">
            <div className="melano-source-card__head"><FileText size={22} aria-hidden="true"/><span>Documento estatal · 1977</span></div>
            <p className="melano-source-card__number">543/77</p>
            <h3>La resolución ministerial</h3>
            <p>El 11 de abril de 1977 se autorizó el funcionamiento de divisiones del INEF Buenos Aires en las instalaciones del Centro Nacional de Educación Física N.º 13, en San Fernando.</p>
            <a href={RESOLUTION_URL} target="_blank" rel="noreferrer">Consultar documento original <ArrowUpRight size={16} aria-hidden="true"/></a>
          </article>
          <article className="melano-source-card melano-source-card--quote">
            <div className="melano-source-card__head"><Quote size={22} aria-hidden="true"/><span>Testimonio · 1978</span></div>
            <blockquote>«¡No volvemos a un lugar, volvemos a un espíritu!»</blockquote>
            <h3>Juan Carlos Cutrera</h3>
            <p>Fragmento de la entrevista publicada en <em>En Movimiento</em> y reproducida en el capítulo de Melano. Expresa una memoria institucional situada, no una descripción neutral de los hechos.</p>
            <a href={CHAPTER_URL} target="_blank" rel="noreferrer">Consultar capítulo, pág. 146 <ArrowUpRight size={16} aria-hidden="true"/></a>
          </article>
        </div>
        <div className="melano-reading-key">
          <div><Layers3 size={23} aria-hidden="true"/><strong>Documento, testimonio e interpretación</strong></div>
          <p>Una autorización no demuestra por sí sola que se haya reconstruido la antigua cultura escolar. Esa relación es una pregunta histórica que el autor investiga a partir de varias fuentes.</p>
        </div>
        <p className="melano-question">¿Qué diferencia hay entre autorizar una institución y reconstruir su identidad?</p>
      </div>
    </div>
  </section>;
}

export default function MelanoApp() {
  const { active, progress } = useJourneyNavigation();
  const [toast, setToast] = useState('');

  return <div className="melano-page">
    <a className="melano-skip" href="#lectura">Saltar a la lectura</a>
    <JourneyHeader author="Melano" title="Juramentados al poder" active={active} progress={progress} />
    <main className="melano-main">
      <Inicio />
      <Autor />
      <Contexto />
      <section id="lectura" className="melano-screen melano-reading hb-material-reading" aria-labelledby="journey-reading-title">
        <TextOnlyReader config={melanoReaderConfig} showToast={setToast} />
      </section>
    </main>
    <JourneyCredits workId="melano" />
    <span className="melano-toast" role="status" aria-live="polite">{toast}</span>
  </div>;
}

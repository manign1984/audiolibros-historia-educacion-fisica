import { ArrowDown, Landmark, Users } from 'lucide-react';
import JourneyHeader, { useJourneyNavigation } from '../shared/JourneyHeader.jsx';
import JourneyBlockLabel from '../shared/JourneyBlockLabel.jsx';
import { AuthorBiography } from '../shared/CanonicalLayout.jsx';
import JourneyCredits from '../shared/JourneyCredits.jsx';
import IntegratedReader from '../IntegratedReader.jsx';
import CanonicalReadingEntry from '../shared/CanonicalReadingEntry.jsx';
import { arataReaderConfig, arataReadingDocument } from './readerContract.js';
import './arata-marino.css';

const EDITORIAL_IMAGE = import.meta.env.BASE_URL + 'assets/arata-marino/autor-editorial.svg';

const INTRO = 'En 1955, un golpe de Estado abrió dos décadas de proscripciones, proyectos de modernización y conflictos sociales. La educación fue escenario de políticas estatales, resistencias y experiencias que imaginaron transformaciones profundas. ¿Cómo convivieron las promesas de progreso con las búsquedas de liberación y el avance de la represión hasta 1976?';
const BIO = 'Nicolás Arata es doctor en Educación e investigador en historia de la educación argentina y latinoamericana. Marcelo Mariño es profesor de Historia, docente e investigador en el mismo campo. Juntos escribieron La educación en la Argentina. Una historia en 12 lecciones, una obra orientada a la formación docente que recorre las disputas, las instituciones y las experiencias educativas del país.';
const timeline = [
  { year: '1955', label: 'Golpe y proscripción', body: 'El derrocamiento de Perón inaugura un período de inestabilidad y confrontación que atraviesa la escuela.' },
  { year: '1958–63', label: 'Modernizar y planificar', body: 'El desarrollismo impulsa la formación de recursos humanos y amplía el lugar de los expertos en la política educativa.' },
  { year: '1966', label: 'Autoritarismo', body: 'Un nuevo golpe militar redefine el escenario político y las disputas dentro del sistema educativo.' },
  { year: '1973', label: 'Educación y liberación', body: 'La educación de adultos y la campaña CREAR expresan proyectos de participación y transformación social.' },
  { year: '1974–76', label: 'El giro represivo', body: 'La persecución política en el campo educativo antecede al terrorismo de Estado instalado en marzo de 1976.' },
];

function Inicio() {
  return <section id="inicio" className="am-screen am-hero" aria-labelledby="am-title">
    <div className="am-shell am-hero__layout">
      <div className="am-hero__copy">
        <JourneyBlockLabel sectionId="inicio" />
        <p className="am-eyebrow">Nicolás Arata · Marcelo Mariño <span aria-hidden="true">/</span> Lección 10</p>
        <h1 id="am-title"><span>Auroras</span><em>y tempestades</em></h1>
        <p className="am-hero__subtitle">La educación entre golpes <strong>1955–1976</strong></p>
        <p className="am-hero__intro">{INTRO}</p>
        <a href="#autor" className="am-hero__next">Comenzar recorrido <ArrowDown size={18} aria-hidden="true" /></a>
      </div>
      <div className="am-hero__art" role="img" aria-label="Composición tipográfica original con dos planos de luz y tormenta y los años 1955 a 1976. No es una imagen histórica.">
        <div className="am-art__upper"><small>HISTORIA DE LA EDUCACIÓN ARGENTINA</small><span>12 / 10</span></div>
        <div className="am-art__light" aria-hidden="true"><i/><i/><i/><i/></div>
        <div className="am-art__center"><b>55</b><span>ENTRE<br/>PROGRESO<br/>Y CONFLICTO</span><b>76</b></div>
        <div className="am-art__lower"><span>MODERNIZACIÓN</span><span>LIBERACIÓN</span><span>AUTORITARISMO</span></div>
      </div>
    </div>
  </section>;
}

function Autor() {
  return <section id="autor" className="am-screen am-author" aria-label="Sobre Nicolás Arata y Marcelo Mariño">
    <AuthorBiography
      name="Nicolás Arata y Marcelo Mariño"
      initial="A / M"
      role="Historia de la educación argentina y latinoamericana"
      summary={BIO}
      image={EDITORIAL_IMAGE}
      imageAlt="Gráfica editorial con las iniciales A y M de Nicolás Arata y Marcelo Mariño. No representa un retrato fotográfico."
      credit="Composición tipográfica original +TEC UNAHUR. No es una fotografía de los autores."
      biographyUrl="https://www.saiehe.org.ar/anuario/revista/article/view/360"
    />
  </section>;
}

function Contexto() {
  return <section id="contexto" className="am-contexto" aria-label="Contexto histórico y claves de lectura">
    <div className="am-screen am-context-screen am-context-one">
      <div className="am-shell am-context-stack">
        <div className="am-context-head"><JourneyBlockLabel sectionId="contexto" /><span>01 / 02 · Coordenadas históricas</span></div>
        <div className="am-context-intro"><p className="am-eyebrow">Entre golpes y proyectos educativos</p><h2>¿Qué se disputaba <em>en la escuela?</em></h2><p>De 1955 a 1976, el sistema educativo fue escenario de políticas enfrentadas y también de experiencias que convivieron en tensión. Estos momentos permiten ingresar a la lección sin reducirla a una sucesión de gobiernos.</p></div>
        <div className="am-timeline" role="list" aria-label="Cinco coordenadas de la educación entre 1955 y 1976">
          {timeline.map(item => <article role="listitem" className="am-timeline__item" key={item.year}>
            <strong>{item.year}</strong><h3>{item.label}</h3><p>{item.body}</p>
          </article>)}
        </div>
        <p className="am-context-question">¿Por qué la modernización educativa fue, al mismo tiempo, un terreno de conflicto político?</p>
      </div>
    </div>
    <div className="am-screen am-context-screen am-context-two">
      <div className="am-shell am-context-stack">
        <div className="am-context-head"><JourneyBlockLabel sectionId="contexto" /><span>02 / 02 · Claves para interpretar</span></div>
        <div className="am-context-intro"><p className="am-eyebrow">Dos horizontes en tensión</p><h2>¿Desarrollo <em>o liberación?</em></h2><p>La lección pone en relación proyectos que asignaban sentidos diferentes a la educación. No fueron bloques homogéneos ni etapas perfectamente sucesivas: sus disputas atravesaron instituciones, prácticas y sujetos.</p></div>
        <div className="am-perspectives">
          <article className="am-perspective am-perspective--plan">
            <div className="am-perspective__head"><Landmark size={25} aria-hidden="true"/><span>01 · Planear el progreso</span></div>
            <h3>Educación para el desarrollo</h3>
            <p>La formación de recursos humanos, la teoría del capital humano, la planificación y la figura del experto ganaron centralidad como instrumentos de modernización.</p>
            <div className="am-perspective__terms"><span>CONADE</span><span>Planeamiento</span><span>Capital humano</span></div>
          </article>
          <article className="am-perspective am-perspective--free">
            <div className="am-perspective__head"><Users size={25} aria-hidden="true"/><span>02 · Transformar la sociedad</span></div>
            <h3>Educación y liberación</h3>
            <p>La participación, el diálogo pedagógico y la educación de personas adultas impulsaron experiencias que buscaron vincular el aprendizaje con la transformación social.</p>
            <div className="am-perspective__terms"><span>CREAR</span><span>Educación popular</span><span>Participación</span></div>
          </article>
        </div>
        <p className="am-context-question">¿Qué tipo de sociedad —y de sujetos— imaginaba cada proyecto educativo?</p>
      </div>
    </div>
  </section>;
}

function Lectura() {
  return <section id="lectura" className="am-screen am-reading hb-material-reading" aria-labelledby="journey-reading-title">
    <IntegratedReader readingDocument={arataReadingDocument} config={arataReaderConfig} Launcher={CanonicalReadingEntry} />
  </section>;
}

export default function ArataMarinoApp() {
  const { active, progress } = useJourneyNavigation();
  return <div className="arata-marino-page">
    <a className="am-skip" href="#inicio">Saltar al recorrido</a>
    <JourneyHeader author="Arata · Mariño" title="Auroras y tempestades" active={active} progress={progress} />
    <main className="am-main">
      <Inicio /><Autor /><Contexto /><Lectura />
    </main>
    <JourneyCredits workId="arataMarino" />
  </div>;
}

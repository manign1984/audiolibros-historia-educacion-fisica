import JourneyHeader, { useJourneyNavigation } from '../shared/JourneyHeader.jsx';
import JourneyBlockLabel from '../shared/JourneyBlockLabel.jsx';
import JourneyCredits from '../shared/JourneyCredits.jsx';
import { AuthorBiography } from '../shared/CanonicalLayout.jsx';
import IntegratedReader from '../IntegratedReader.jsx';
import CanonicalReadingEntry from '../shared/CanonicalReadingEntry.jsx';
import { pineauDictaduraReader, pineauDictaduraReadingDocument } from './readerContract.js';
import './pineau-dictadura.css';

const BIO = 'Investiga la historia, la teoría y la política de la educación. Es profesor titular de Historia de la Educación Argentina y Latinoamericana en la Universidad de Buenos Aires y posee una extensa trayectoria en docencia, formación e investigación. Presidió la Sociedad Argentina de Historia de la Educación y dirigió el Departamento de Ciencias de la Educación de la UBA.';

function Inicio() {
  return (
    <section id="inicio" className="pd-screen pd-hero" aria-labelledby="pd-title">
      <div className="pd-container pd-hero-layout">
        <div className="pd-hero-copy">
          <JourneyBlockLabel sectionId="inicio" />
          <p className="pd-kicker">Pablo Pineau <span aria-hidden="true">/</span> artículo académico · 2014</p>
          <h1 id="pd-title">Reprimir <span className="pd-hero-amp">y</span><br />discriminar<span className="pd-hero-dot">.</span></h1>
          <p className="pd-subtitle">La educación en la última dictadura cívico-militar en Argentina <strong>(1976–1983)</strong></p>
          <p className="pd-hero-question">¿Cómo se transformó el sistema educativo mediante la represión y la producción de desigualdades?</p>
          <p className="pd-hero-detail">Dos estrategias complementarias para estudiar las políticas educativas de la dictadura y sus efectos sobre la escuela pública.</p>
        </div>
      </div>
      <div className="pd-hero-document">
        <img
          src={import.meta.env.BASE_URL + 'assets/pineau-reprimir-discriminar/subversion-ambito-educativo-1977-fondo.webp'}
          alt="Tapa de Subversión en el ámbito educativo (Conozcamos a nuestro enemigo), Ministerio de Cultura y Educación, Buenos Aires, 1977"
          width={1924}
          height={1283}
          fetchPriority="high"
        />
      </div>
    </section>
  );
}

function Autor() {
  return (
    <section id="autor" className="pd-author">
      <AuthorBiography
        name="Pablo Pineau"
        initial="P"
        role="Historiador de la educación · Doctor en Educación"
        summary={BIO}
        image={import.meta.env.BASE_URL + 'assets/pablo-pineau.webp'}
        imageAlt="Retrato de Pablo Pineau."
        credit="Fotografía: Facultad de Filosofía y Letras, UBA."
        biographyUrl="https://posgrado.filo.uba.ar/pineau-pablo"
      />
    </section>
  );
}

function Contexto() {
  return (
    <section id="contexto" aria-label="Claves para leer Reprimir y discriminar">
      <div className="pd-screen pd-context pd-context-first">
        <div className="pd-container">
          <JourneyBlockLabel sectionId="contexto" />
          <p className="pd-context-index">01 / LA ESTRATEGIA REPRESIVA</p>
          <h2>Cuando la escuela se vuelve <em>objeto de vigilancia</em></h2>
          <p className="pd-context-lead">Pineau analiza la represión de docentes, estudiantes, libros y prácticas pedagógicas. En la lógica del régimen, la definición imprecisa de «subversión» extendía la sospecha incluso a las actividades escolares cotidianas.</p>
          <div className="pd-chain" aria-label="Cadena de inferencias que Pineau identifica en el dispositivo represivo">
            <div><span>01</span><strong>Todo hecho social</strong><small>es un hecho político</small></div>
            <span className="pd-arrow" aria-hidden="true">→</span>
            <div><span>02</span><strong>Todo hecho político</strong><small>es un hecho subversivo</small></div>
            <span className="pd-arrow" aria-hidden="true">→</span>
            <div><span>03</span><strong>Todo hecho subversivo</strong><small>debe ser reprimido</small></div>
          </div>
          <div className="pd-context-footer">
            <p><b>Para observar en la lectura:</b> censura de libros, control del trabajo docente, persecución y disciplinamiento de la vida escolar.</p>
            <p className="pd-question">¿Qué prácticas educativas podían resultar sospechosas bajo esa cadena de inferencias?</p>
          </div>
        </div>
      </div>
      <div className="pd-screen pd-context pd-context-second">
        <div className="pd-container">
          <p className="pd-context-index">02 / LA ESTRATEGIA DISCRIMINADORA</p>
          <h2>Modernizar para <em>diferenciar</em></h2>
          <p className="pd-context-lead">La dictadura no actuó únicamente prohibiendo. Pineau estudia medidas que reordenaron la organización y el financiamiento de la educación y favorecieron trayectorias escolares desiguales según los recursos de cada sector social.</p>
          <div className="pd-measures">
            <article><span>1978</span><h3>Transferencias educativas</h3><p>El Estado nacional transfirió escuelas a jurisdicciones con capacidades económicas y administrativas desiguales.</p></article>
            <article><span>FINANCIAMIENTO</span><h3>Subsidiarismo y cooperadoras</h3><p>El repliegue del financiamiento estatal desplazó responsabilidades hacia familias e instituciones.</p></article>
            <article><span>TRAYECTORIAS</span><h3>Selección y segmentación</h3><p>Exámenes, circuitos diferenciados y desigual acceso a saberes socialmente significativos reforzaron distancias.</p></article>
          </div>
          <div className="pd-context-footer">
            <p><b>Una clave del argumento:</b> el autor muestra la articulación entre un proyecto autoritario y medidas presentadas como racionalización o modernización.</p>
            <p className="pd-question">¿Por qué la discriminación educativa no se reduce a los actos explícitos de represión?</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PineauDictaduraApp() {
  const { active, progress } = useJourneyNavigation();
  return (
    <div className="pineau-dictadura-page">
      <a className="pd-skip" href="#lectura">Saltar a la lectura</a>
      <JourneyHeader author="Pineau" title="Reprimir y discriminar (1976–1983)" active={active} progress={progress} />
      <main className="pd-main">
        <Inicio />
        <Autor />
        <Contexto />
        <section id="lectura" className="journey-reading hb-material-reading" aria-labelledby="journey-reading-title">
          <IntegratedReader
            readingDocument={pineauDictaduraReadingDocument}
            config={pineauDictaduraReader}
            Launcher={CanonicalReadingEntry}
          />
        </section>
      </main>
      <JourneyCredits workId="pineauDictadura" />
    </div>
  );
}

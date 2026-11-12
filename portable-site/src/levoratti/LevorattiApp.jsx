import JourneyHeader, { useJourneyNavigation } from '../shared/JourneyHeader.jsx';
import JourneyBlockLabel from '../shared/JourneyBlockLabel.jsx';
import JourneyCredits from '../shared/JourneyCredits.jsx';
import { AuthorBiography } from '../shared/CanonicalLayout.jsx';
import TextOnlyReader from '../shared/TextOnlyReader.jsx';
import { levorattiReaderConfig } from './readerConfig.js';
import './levoratti.css';

const BIO = "Alejo Levoratti es profesor y licenciado en Educación Física por la Universidad Nacional de La Plata, magíster en Antropología Social y doctor en Ciencias Sociales y Humanas. Investiga la historia de la formación docente en Educación Física, los debates disciplinares y las políticas públicas sobre deporte y cuerpos. Es investigador del CONICET en el IdIHCS y docente de la UNLP.";

function Inicio() {
  return (
    <section id="inicio" className="lv-screen lv-hero" aria-labelledby="lv-title">
      <div className="lv-shell lv-hero-layout">
        <div className="lv-hero-copy">
          <JourneyBlockLabel sectionId="inicio" />
          <p className="lv-eyebrow">Alejo Levoratti <span aria-hidden="true">·</span> Artículo académico · 2022</p>
          <h1 id="lv-title">La educación física <em>y la gimnasia</em></h1>
          <p className="lv-hero-subtitle">En la educación primaria y el nivel medio. Perspectivas teóricas en circulación en Argentina, <strong>1958–1968</strong>.</p>
          <p className="lv-hero-hook">¿Quiénes definieron qué debía enseñarse en Educación Física y con qué argumentos se presentó una disciplina como «moderna»?</p>
          <p className="lv-hero-note">Una investigación sobre políticas curriculares, formación docente y debates acerca del movimiento.</p>
        </div>
        <div className="lv-cover-art" role="img" aria-label="Composición editorial contemporánea con los años 1961 y 1968 y los conceptos gimnasia, movimiento y escuela. No es una fuente histórica.">
          <div className="lv-art-top">DOCUMENTOS CURRICULARES <span>ARGENTINA</span></div>
          <div className="lv-art-year">1961 <span>—</span> 1968</div>
          <div className="lv-art-axis"><span>GIMNASIA</span><b>↔</b><span>MOVIMIENTO</span></div>
          <div className="lv-art-bottom">ESCUELA MEDIA <span>+</span> ESCUELA PRIMARIA</div>
        </div>
      </div>
    </section>
  );
}

function Autor() {
  return (
    <section id="autor" className="lv-author">
      <AuthorBiography
        name="Alejo Levoratti"
        initial="L"
        role="Educación Física · Historia de la formación y políticas educativas"
        summary={BIO}
        image={import.meta.env.BASE_URL + 'assets/levoratti-gimnasia-1958-1968/autor-editorial.svg'}
        imageAlt="Composición tipográfica editorial con las iniciales AL. No es un retrato fotográfico de Alejo Levoratti."
        credit="Composición editorial de +TEC UNAHUR; no es una fotografía del autor."
        biographyUrl="https://idihcs.fahce.unlp.edu.ar/integrante_idihcs/levoratti-alejo/"
      />
    </section>
  );
}

function Contexto() {
  return (
    <section id="contexto" aria-label="Claves históricas para leer a Levoratti">
      <div className="lv-screen lv-context lv-context-one">
        <div className="lv-shell">
          <JourneyBlockLabel sectionId="contexto" />
          <p className="lv-context-index">01 / DOS DOCUMENTOS, UN PROBLEMA</p>
          <h2>La Educación Física <em>se escribe en el currículum</em></h2>
          <p className="lv-context-lead">Levoratti estudia dos documentos estatales relacionados: uno organiza la enseñanza media y la formación en las escuelas normales; el otro busca orientar la Educación Física infantil. Leerlos juntos permite reconocer continuidades, cambios y disputas.</p>
          <div className="lv-comparison">
            <article>
              <p className="lv-comparison-date">1961</p>
              <p className="lv-comparison-type">Enseñanza media</p>
              <h3>Programas de Educación Física</h3>
              <p>Articulan formación corporal, rendimiento y educación del movimiento. La gimnasia mantiene un lugar destacado entre los llamados «agentes» de la disciplina.</p>
            </article>
            <div className="lv-comparison-connector" aria-hidden="true">↔</div>
            <article>
              <p className="lv-comparison-date">1968</p>
              <p className="lv-comparison-type">Escuela primaria</p>
              <h3>Educación Física Infantil</h3>
              <p>Profundiza las referencias a la psicología infantil, la actividad y la creatividad, y enfatiza el movimiento en los procesos de enseñanza.</p>
            </article>
          </div>
          <p className="lv-context-question">¿Qué relación había entre la formación de maestras y maestros normales y la enseñanza de Educación Física en la escuela primaria?</p>
        </div>
      </div>
      <div className="lv-screen lv-context lv-context-two">
        <div className="lv-shell">
          <p className="lv-context-index">02 / SABERES QUE DISPUTAN SENTIDO</p>
          <h2>¿Qué significa llamar <em>«moderna»</em> a una Educación Física?</h2>
          <p className="lv-context-lead">La idea de modernización no designa una ruptura simple: en los programas se encuentran y superponen tradiciones y perspectivas diferentes. El artículo analiza quiénes lograron inscribir sus enfoques en los documentos oficiales.</p>
          <div className="lv-perspectives">
            <article><span>01 · TRADICIONES</span><h3>Gimnasias y formación corporal</h3><p>Las corrientes gimnásticas y los discursos médicos no desaparecen: conservan espacios y son reinterpretados en nuevas propuestas.</p></article>
            <article><span>02 · PEDAGOGÍAS</span><h3>Métodos activos</h3><p>Las referencias a la experiencia, la actividad y autores como John Dewey participan de la legitimación de los enfoques.</p></article>
            <article><span>03 · PSICOLOGÍA</span><h3>Desarrollo y movimiento</h3><p>Las categorías psicológicas ganan protagonismo para organizar objetivos, edades y prácticas; el movimiento adquiere mayor centralidad conceptual.</p></article>
          </div>
          <p className="lv-context-question">Al leer, observá qué conocimientos se citan para justificar el programa de 1961 y cuáles para fundamentar el plan de 1968.</p>
        </div>
      </div>
    </section>
  );
}

export default function LevorattiApp() {
  const { active, progress } = useJourneyNavigation();
  return (
    <div className="levoratti-page">
      <a className="lv-skip" href="#lectura">Saltar a la lectura</a>
      <JourneyHeader
        author="Levoratti"
        title="Educación Física y gimnasia (1958–1968)"
        active={active}
        progress={progress}
      />
      <main className="lv-main">
        <Inicio />
        <Autor />
        <Contexto />
        <section id="lectura" className="journey-reading hb-material-reading" aria-labelledby="journey-reading-title">
          <TextOnlyReader config={levorattiReaderConfig} />
        </section>
      </main>
      <JourneyCredits workId="levorattiGimnasia" />
    </div>
  );
}

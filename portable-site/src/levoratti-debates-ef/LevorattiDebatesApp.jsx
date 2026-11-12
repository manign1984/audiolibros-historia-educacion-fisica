import JourneyHeader, { useJourneyNavigation } from '../shared/JourneyHeader.jsx';
import JourneyBlockLabel from '../shared/JourneyBlockLabel.jsx';
import JourneyCredits from '../shared/JourneyCredits.jsx';
import { AuthorBiography } from '../shared/CanonicalLayout.jsx';
import TextOnlyReader from '../shared/TextOnlyReader.jsx';
import { readerConfig, subtitle, title, workId } from './readerConfig.js';
import './debates.css';

export default function LevorattiDebatesApp() {
  const { active, progress } = useJourneyNavigation();

  return (
    <div className="levoratti-debates">
      <a className="ld-skip" href="#lectura">Saltar a la lectura</a>
      <JourneyHeader author="Levoratti" title="Los debates de la Educación Física" active={active} progress={progress} />
      <main>
        <section id="inicio" className="ld-screen ld-hero" aria-labelledby="ld-title">
          <div className="ld-shell ld-hero-grid">
            <div>
              <JourneyBlockLabel sectionId="inicio" />
              <p className="ld-byline"><a href="#autor">Alejo Levoratti</a></p>
              <h1 id="ld-title">{title}</h1>
              <p className="ld-subtitle">{subtitle}</p>
              <p className="ld-lead">¿Cómo cambiaron los saberes con los que se justificaba la formación de profesoras y profesores de Educación Física?</p>
              <p className="ld-edition">Versión de cátedra del artículo publicado en <cite>Revista da ALESDE</cite> · 2018</p>
            </div>
            <figure className="ld-cover">
              <div className="ld-cover-sheet">
                <div><strong>1997</strong><span>Contenidos Básicos Comunes</span></div>
                <p>Disponibilidad corporal</p>
              </div>
              <div className="ld-cover-sheet">
                <div><strong>2009</strong><span>Recomendaciones del INFD</span></div>
                <p>Corporeidad y motricidad</p>
              </div>
              <figcaption>Dos documentos curriculares que analiza Levoratti.</figcaption>
            </figure>
          </div>
        </section>

        <section id="autor" className="ld-author" aria-label="Alejo Levoratti">
          <AuthorBiography
            name="Alejo Levoratti"
            initial="L"
            role="Educación Física · Historia de la formación docente"
            summary="Alejo Levoratti es profesor y licenciado en Educación Física por la Universidad Nacional de La Plata, magíster en Antropología Social por la UNSAM y doctor con mención en Ciencias Sociales y Humanas por la Universidad Nacional de Quilmes. Es docente de la UNLP e investigador del CONICET. Estudia la formación docente en Educación Física y los saberes que orientan sus prácticas."
            image={import.meta.env.BASE_URL + 'assets/levoratti-gimnasia-1958-1968/autor-editorial.svg'}
            imageAlt="Iniciales AL en una composición tipográfica."
            credit="Composición editorial · Biblioteca Digital +TEC UNAHUR."
            biographyUrl="https://idihcs.fahce.unlp.edu.ar/integrante_idihcs/levoratti-alejo/"
          />
        </section>

        <section id="contexto" className="ld-screen ld-context" aria-labelledby="ld-context-title">
          <div className="ld-shell">
            <JourneyBlockLabel sectionId="contexto" />
            <h2 id="ld-context-title">¿Quién define qué se enseña en Educación Física?</h2>
            <p className="ld-context-lead">Levoratti se vale de la sociología de la crítica de Luc Boltanski para leer los documentos curriculares junto con las entrevistas. Así reconstruye cómo quienes participaron de su elaboración justificaron sus decisiones.</p>
            <div className="ld-comparison">
              <article>
                <p className="ld-date">1997</p>
                <h3>Contenidos Básicos Comunes</h3>
                <p>En los CBC para la formación docente, la noción de disponibilidad corporal acompaña una discusión sobre el carácter educable del cuerpo y el movimiento.</p>
              </article>
              <article>
                <p className="ld-date">2009</p>
                <h3>Recomendaciones del INFD</h3>
                <p>La corporeidad y la motricidad organizan una concepción pedagógica de la disciplina que incorpora los contextos socioculturales de las prácticas corporales.</p>
              </article>
            </div>
            <p className="ld-question">Al leer, identificá qué cuestionan ambos documentos de la concepción llamada «biologicista» y qué autores o saberes moviliza cada equipo para sostener su propuesta.</p>
          </div>
        </section>

        <section id="lectura" className="journey-reading hb-material-reading" aria-labelledby="journey-reading-title">
          <TextOnlyReader config={readerConfig} />
        </section>
      </main>
      <JourneyCredits workId={workId} />
    </div>
  );
}

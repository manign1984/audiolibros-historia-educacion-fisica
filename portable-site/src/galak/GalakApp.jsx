import JourneyHeader, { useJourneyNavigation } from '../shared/JourneyHeader.jsx';
import JourneyBlockLabel from '../shared/JourneyBlockLabel.jsx';
import JourneyCredits from '../shared/JourneyCredits.jsx';
import { AuthorBiography } from '../shared/CanonicalLayout.jsx';
import TextOnlyReader from '../shared/TextOnlyReader.jsx';
import { readerConfig, subtitle, title, workId } from './readerConfig.js';
import './galak.css';

const milestones = [
  { year: '1897', title: 'Formación militar', summary: 'Se conforma la Escuela Militar de Esgrima. En la trayectoria que reconstruye Galak, la formación de especialistas en esgrima y gimnasia se institucionaliza primero en el Ejército.' },
  { year: '1901–1906', title: 'Formación civil', summary: 'Pablo Pizzurno propone capacitar a docentes para enseñar ejercicios físicos. A los cursos temporarios de 1901 les siguen el Plan de 1905 y el dictado de los Cursos Normales desde 1906.' },
  { year: '1909', title: 'Disputa por la escuela pública', summary: 'La autorización para que egresados de la Escuela militar den clases en el sistema educativo civil agudiza la disputa por los puestos docentes y por la orientación de la enseñanza.' },
];

export default function GalakApp() {
  const { active, progress } = useJourneyNavigation();

  return (
    <div className="galak-journey">
      <JourneyHeader author="Galak" title={title} active={active} progress={progress} />
      <main>
        <section id="inicio" className="galak-screen galak-hero" aria-labelledby="galak-title">
          <div className="galak-shell galak-hero-grid">
            <div>
              <JourneyBlockLabel sectionId="inicio" />
              <p className="galak-byline"><a href="#autor">Eduardo Galak</a></p>
              <h1 id="galak-title">{title}<span>{subtitle}</span></h1>
              <p className="galak-lead">¿Cómo llegó a definirse quién podía enseñar Educación Física en las escuelas argentinas? Las disputas entre el Ejército y las autoridades educativas permiten reconstruir el nacimiento de la formación profesional.</p>
              <p className="galak-edition">Ponencia del II Congreso Patagónico de Educación Física y Formación Docente · 2012</p>
            </div>
            <figure className="galak-cover">
              <img src="/assets/portada-galak-del-dicho-al-hecho.png" alt="" />
              <figcaption>Portada editorial de la Biblioteca Digital +TEC UNAHUR.</figcaption>
            </figure>
          </div>
        </section>

        <section id="autor" className="galak-author" aria-label="Eduardo Galak">
          <AuthorBiography
            name="Eduardo Galak"
            initial="G"
            role="Educación Física · Historia y sociología del cuerpo"
            summary="Eduardo Galak es profesor en Educación Física, magíster en Educación Corporal y doctor en Ciencias Sociales por la Universidad Nacional de La Plata. Es docente de grado y posgrado en esa universidad e investigador del CONICET en el Centro Interdisciplinario Cuerpo, Educación y Sociedad. Estudia las relaciones entre educación del cuerpo y política, con especial atención a la formación profesional y a la historia de las prácticas corporales."
            image="https://www.memoria.fahce.unlp.edu.ar/perfiles/fotos/0554.jpg"
            imageAlt="Retrato de Eduardo Galak"
            credit="Retrato publicado en Memoria Académica · FaHCE, UNLP."
            biographyUrl="https://www.memoria.fahce.unlp.edu.ar/perfiles/0554GalakE.html"
          />
        </section>

        <section id="contexto" className="galak-screen galak-context" aria-labelledby="galak-context-title">
          <div className="galak-shell">
            <JourneyBlockLabel sectionId="contexto" />
            <h2 id="galak-context-title">¿Quién podía enseñar Educación Física?</h2>
            <p className="galak-lead">Tres momentos de la disputa que estudia Galak entre la formación militar y el proyecto civil ligado a Pablo Pizzurno y Enrique Romero Brest.</p>
            <ol className="galak-milestones">
              {milestones.map(({ year, title, summary }) => (
                <li key={year}>
                  <p className="galak-year">{year}</p>
                  <h3>{title}</h3>
                  <p>{summary}</p>
                </li>
              ))}
            </ol>
            <p className="galak-question">Al leer la carta de Pizzurno de 1901 y el apartado sobre la autorización de 1909, ¿qué saberes y credenciales se invocan para justificar el derecho a enseñar?</p>
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

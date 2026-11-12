import JourneyHeader, { useJourneyNavigation } from '../shared/JourneyHeader.jsx';
import JourneyBlockLabel from '../shared/JourneyBlockLabel.jsx';
import JourneyCredits from '../shared/JourneyCredits.jsx';
import { AuthorBiography } from '../shared/CanonicalLayout.jsx';
import CanonicalReadingEntry from '../shared/CanonicalReadingEntry.jsx';
import IntegratedReader from '../IntegratedReader.jsx';
import { assetBase, readerConfig, readingDocument, sourceUrl } from './readerConfig.js';
import './feiguin-aisenstein.css';

const context = [
  {
    title: 'Ingreso',
    text: 'El Instituto, creado en 1938 en San Fernando, convocó a varones de distintas provincias. Las becas ampliaron el alcance del reclutamiento y los exámenes de admisión definieron quiénes podían ingresar.',
  },
  {
    title: 'Internado',
    text: 'Los horarios, las tareas compartidas y las competencias entre grupos extendían la formación más allá de las clases. La vida cotidiana era parte del aprendizaje del oficio docente.',
  },
  {
    title: 'Liderazgo',
    text: 'Los estudiantes asumían responsabilidades y supervisaban a sus compañeros. Las autoras examinan cómo esas prácticas articulaban iniciativa, disciplina y pertenencia.',
  },
];

export default function FeiguinAisensteinApp() {
  const { active, progress } = useJourneyNavigation();

  return (
    <div className="fa-page">
      <a className="fa-skip" href="#lectura">Saltar a la lectura</a>
      <JourneyHeader author="Feiguin y Aisenstein" title="Diseño de sujetos" active={active} progress={progress} />
      <main>
        <section id="inicio" className="fa-hero" aria-labelledby="fa-title">
          <div className="fa-shell fa-hero-grid">
            <div>
              <JourneyBlockLabel sectionId="inicio" />
              <p className="fa-authorline">María Andrea Feiguin · Ángela Aisenstein</p>
              <h1 id="fa-title">Diseño de sujetos <em>morales, sanos y patriotas</em></h1>
              <p className="fa-subtitle">{readingDocument.subtitle}</p>
              <p className="fa-intro">¿Cómo se formaba a un profesor de Educación Física en el INEF General Belgrano? El artículo sigue a los estudiantes desde el ingreso hasta la vida cotidiana en el internado.</p>
              <p className="fa-edition">Artículo completo · <i>Pedagogía y Saberes</i>, 2016</p>
            </div>
            <figure className="fa-cover">
              <img src={assetBase + 'portada.webp'} alt="Primera página del artículo, con su título, autoría y resúmenes en tres idiomas." width="828" height="882" fetchPriority="high" />
              <figcaption><a href={sourceUrl} target="_blank" rel="noreferrer">Consultar la edición original</a></figcaption>
            </figure>
          </div>
        </section>

        <section id="autor" className="fa-author" aria-label="María Andrea Feiguin y Ángela Aisenstein">
          <AuthorBiography
            name="María Andrea Feiguin y Ángela Aisenstein"
            initial="F / A"
            role="Historia de la Educación Física y formación docente"
            summary="María Andrea Feiguin investigó la cultura escolar del INEF General Belgrano en su maestría en Ciencias Sociales, con mención en Historia Social, en la Universidad Nacional de Luján. Ángela Aisenstein, profesora de Educación Física y doctora en Educación, estudia la historia de los saberes corporales en la escuela y la formación de quienes los enseñan."
            image={assetBase + 'autoras.webp'}
            imageAlt="Composición tipográfica con las iniciales de María Andrea Feiguin y Ángela Aisenstein."
            credit="Composición tipográfica de +TEC UNAHUR."
            biographyUrl="https://udesa.edu.ar/cuerpo-docente/angela-aisenstein"
          />
        </section>

        <section id="contexto" className="fa-context" aria-labelledby="fa-context-title">
          <div className="fa-shell fa-context-inner">
            <JourneyBlockLabel sectionId="contexto" />
            <h2 id="fa-context-title">Formarse en el internado</h2>
            <p className="fa-context-lead">Para reconstruir la cultura escolar del INEF General Belgrano, las autoras leen las normas institucionales junto con las memorias de sus egresados. Estos tres aspectos orientan la lectura de ambas fuentes.</p>
            <dl className="fa-lenses">
              {context.map(({ title, text }) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}
            </dl>
            <p className="fa-question">Al leer, elegí una regla del Instituto y un testimonio. ¿Qué muestra cada fuente sobre la manera de formar profesores?</p>
          </div>
        </section>

        <section id="lectura" className="journey-reading hb-material-reading" aria-labelledby="journey-reading-title">
          <IntegratedReader readingDocument={readingDocument} config={readerConfig} Launcher={CanonicalReadingEntry} />
        </section>
      </main>
      <JourneyCredits workId="feiguinAisenstein" />
    </div>
  );
}

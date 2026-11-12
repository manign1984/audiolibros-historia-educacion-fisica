import JourneyHeader, { useJourneyNavigation } from '../shared/JourneyHeader.jsx';
import JourneyBlockLabel from '../shared/JourneyBlockLabel.jsx';
import JourneyCredits from '../shared/JourneyCredits.jsx';
import { AuthorBiography } from '../shared/CanonicalLayout.jsx';
import IntegratedReader from '../IntegratedReader.jsx';
import CanonicalReadingEntry from '../shared/CanonicalReadingEntry.jsx';
import { readerConfig, readingDocument } from './readerConfig.js';
import './thwaites-rey.css';

const milestones = [
  {
    period: '1983',
    title: 'Recuperación democrática',
    description: 'El regreso de las elecciones libres abre una etapa de ampliación de derechos civiles. La deuda externa y la herencia económica de la dictadura condicionan al gobierno de Alfonsín.',
  },
  {
    period: '1989–2001',
    title: 'Reformas de mercado y crisis',
    description: 'Las privatizaciones, la apertura económica y la convertibilidad modifican la intervención del Estado. La recesión y la protesta social desembocan en la crisis de 2001.',
  },
  {
    period: '2003–2013',
    title: 'Disputas por el papel del Estado',
    description: 'La recuperación del empleo y la ampliación de políticas públicas conviven con la concentración económica. La autora examina qué márgenes gana el Estado y qué límites persisten.',
  },
];

export default function ThwaitesReyApp() {
  const { active, progress } = useJourneyNavigation();

  return (
    <div className="thwaites-page">
      <a className="thwaites-skip" href="#lectura">Saltar a la lectura</a>
      <JourneyHeader author="Thwaites Rey" title="La democracia argentina" active={active} progress={progress} />
      <main>
        <section id="inicio" className="thwaites-hero thwaites-screen" aria-labelledby="thwaites-title">
          <div className="thwaites-shell thwaites-hero-grid">
            <div>
              <JourneyBlockLabel sectionId="inicio" />
              <p className="thwaites-byline"><a href="#autor">Mabel Thwaites Rey</a></p>
              <h1 id="thwaites-title">La democracia argentina <span>bajo el largo ciclo de hegemonía neoliberal (1983–2013)</span></h1>
              <p className="thwaites-lead">¿Qué posibilidades tuvo la democracia argentina de transformar la desigualdad en un período de expansión del neoliberalismo?</p>
              <p className="thwaites-edition">Artículo completo · <cite>Voces en el Fénix</cite>, n.º 31 · 2013</p>
            </div>
            <figure className="thwaites-cover">
              <img src={import.meta.env.BASE_URL + 'assets/thwaites-rey/plaza-de-mayo-1983.webp'} alt="Una multitud con banderas ocupa la Plaza de Mayo frente al Cabildo." width="1200" height="1000" fetchPriority="high" />
              <figcaption>Plaza de Mayo durante la asunción de Raúl Alfonsín, 10 de diciembre de 1983. Archivo General de la Nación.</figcaption>
            </figure>
          </div>
        </section>

        <section id="autor" className="thwaites-author" aria-label="Mabel Thwaites Rey">
          <AuthorBiography
            name="Mabel Thwaites Rey"
            initial="T"
            role="Teoría del Estado · Administración y políticas públicas"
            summary="Mabel Thwaites Rey es doctora por la Universidad de Buenos Aires y magíster en Administración Pública. Enseñó Sociología Política y Administración y Políticas Públicas en la carrera de Ciencia Política de la UBA. Dirigió el Instituto de Estudios de América Latina y el Caribe y coordinó el grupo de trabajo de CLACSO sobre el Estado en América Latina. Sus investigaciones abordan la reforma estatal y las privatizaciones."
            image={import.meta.env.BASE_URL + 'assets/thwaites-rey/mabel-thwaites-rey.webp'}
            imageAlt="Mabel Thwaites Rey habla ante un micrófono en la Universidad Nacional de Colombia."
            credit="Fotografía de Periódico UNAL · Universidad Nacional de Colombia."
            biographyUrl="https://cienciapolitica.sociales.uba.ar/wp-content/uploads/sites/6/2011/04/MABELTHWAITESREY.pdf"
          />
        </section>

        <section id="contexto" className="thwaites-context thwaites-screen" aria-labelledby="thwaites-context-title">
          <div className="thwaites-shell">
            <JourneyBlockLabel sectionId="contexto" />
            <h2 id="thwaites-context-title">Democracia y Estado desde 1983</h2>
            <p className="thwaites-lead">Leé los tres momentos con la misma pregunta en mente. ¿Qué podía decidir el Estado argentino en cada coyuntura y cómo incidían las presiones internacionales y las disputas locales?</p>
            <ol className="thwaites-timeline">
              {milestones.map(({ period, title, description }) => (
                <li key={period}>
                  <p>{period}</p>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </li>
              ))}
            </ol>
            <p className="thwaites-question">Elegí dos momentos y compará una política de cada uno. ¿Cómo afectó la capacidad del Estado para intervenir sobre la desigualdad?</p>
          </div>
        </section>

        <section id="lectura" className="journey-reading hb-material-reading" aria-labelledby="journey-reading-title">
          <IntegratedReader readingDocument={readingDocument} config={readerConfig} Launcher={CanonicalReadingEntry} />
        </section>
      </main>
      <JourneyCredits workId="thwaitesRey" />
    </div>
  );
}

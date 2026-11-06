import { useState } from 'react';
import JourneyHeader, { useJourneyNavigation } from '../shared/JourneyHeader.jsx';
import JourneyBlockLabel from '../shared/JourneyBlockLabel.jsx';
import { AuthorBiography } from '../shared/CanonicalLayout.jsx';
import CanonicalReadingEntry from '../shared/CanonicalReadingEntry.jsx';
import JourneyCredits from '../shared/JourneyCredits.jsx';
import IntegratedReader from '../IntegratedReader.jsx';
import { scharagrodskyReaderConfig } from './readerConfig.js';
import { scharagrodskyReadingDocument } from './readingDocument.js';
import './scharagrodsky.css';

const scenes = [
  { date: '1910', title: 'El Centenario y los batallones', text: 'La conmemoración reactivó proyectos de gimnasia militar, desfiles y batallones escolares. Romero Brest impugnó su valor educativo desde la fisiología y una concepción civil de la escuela.', question: '¿Qué idea de nación se enseñaba al ejercitar el cuerpo?' },
  { date: '1924', title: 'La orientación de la enseñanza', text: 'Una comisión técnica examinó métodos, planes y formación docente. Las críticas al Instituto y a su director pusieron en disputa quién podía definir una Educación Física legítima.', question: '¿Quiénes estaban autorizados a enseñar y a decidir?' },
  { date: '1930–1938', title: 'Cambios en las relaciones de fuerza', text: 'El golpe de 1930 abrió otra coyuntura. La jubilación forzada de Romero Brest en 1931 y la supresión del Sistema Argentino en 1938 marcaron el avance de otras orientaciones.', question: '¿Cómo se enlazan política, instituciones y pedagogía?' },
];

export default function ScharagrodskyApp() {
  const { active, progress } = useJourneyNavigation();
  const [toast, setToast] = useState('');
  return <div className="scharagrodsky-page">
    <a className="sch-skip" href="#lectura">Saltar a la lectura</a>
    <JourneyHeader author="Scharagrodsky" title="La constitución de la Educación Física escolar" active={active} progress={progress} />
    <main className="sch-main">
      <section id="inicio" className="sch-screen sch-hero" aria-labelledby="sch-title">
        <div className="sch-inner sch-hero-inner">
          <div className="sch-top"><JourneyBlockLabel sectionId="inicio" /><span>Capítulo académico · 2011</span></div>
          <div className="sch-hero-grid">
            <div><p className="sch-byline">Pablo Ariel Scharagrodsky</p>
              <h1 id="sch-title">La constitución de la <em>Educación Física</em> escolar en la Argentina.</h1>
              <p className="sch-subtitle">Tensiones, conflictos y disputas con la matriz militar en las primeras décadas del siglo XX</p>
              <p className="sch-hero-question">¿Qué cuerpos y qué ciudadanía debía formar la escuela?</p>
            </div>
            <figure><img src="/assets/scharagrodsky-disputas.svg" alt="Dos tramas se entrecruzan alrededor de la escuela: composición conceptual de un campo en disputa." width="680" height="640" fetchPriority="high" /><figcaption>Un campo en disputa · Composición editorial del proyecto.</figcaption></figure>
          </div>
          <div className="sch-hero-bottom"><p><strong>1898–1938</strong><span>Saberes · Instituciones · Ciudadanía</span></p><p>Texto académico, audiolibro y cuaderno de lectura.<br />Incluye 29 notas y bibliografía.</p></div>
        </div>
      </section>
      <section id="autor" className="sch-screen sch-author" aria-label="Sobre Pablo Ariel Scharagrodsky">
        <AuthorBiography name="Pablo Ariel Scharagrodsky" initial="PS" role="Historia de la educación · Cuerpo y género"
          summary="Doctor en Ciencias Sociales y Humanas por la Universidad Nacional de Quilmes, docente e investigador en esa universidad y en la Universidad Nacional de La Plata. Estudia la historia de la educación, el cuerpo, las pedagogías feministas y los estudios de género. Sus trabajos permiten interrogar cómo las prácticas educativas producen y disputan sentidos sobre los cuerpos y las diferencias."
          image="/assets/scharagrodsky-retrato-unq.jpg" imageAlt="Retrato de Pablo Ariel Scharagrodsky" credit="Fuente del retrato y la biografía: Agencia de Noticias Científicas de la UNQ, 2022." biographyUrl="https://agencia.unq.edu.ar/?p=8369" />
      </section>
      <section id="contexto" aria-label="Contexto: dos perspectivas para la lectura">
        <div className="sch-screen sch-context" aria-labelledby="sch-context-title">
          <div className="sch-inner sch-context-inner">
            <header><div className="sch-top"><JourneyBlockLabel sectionId="contexto" /><span>Perspectiva 1 de 2</span></div><h2 id="sch-context-title">Educar el cuerpo.<br /><em>Disputar la escuela.</em></h2><p className="sch-lead">La Educación Física escolar se constituyó entre propuestas enfrentadas. El capítulo estudia qué saberes las legitimaban y qué sentidos de disciplina, nación y ciudadanía ponían en circulación.</p></header>
            <div className="sch-comparison">
              <div className="sch-comparison-head"><h3>Sistema Argentino</h3><h3>Matriz militar</h3></div>
              <div className="sch-comparison-row"><p><strong>Autoridad del saber</strong>Fisiología del ejercicio, medicina e higiene.</p><p><strong>Autoridad del saber</strong>Tradición castrense, gimnasia militar y preparación del soldado.</p></div>
              <div className="sch-comparison-row"><p><strong>Disciplina escolar</strong>Autodominio y responsabilidad individual en una escuela civil.</p><p><strong>Disciplina escolar</strong>Jerarquía, obediencia y orden colectivo de inspiración militar.</p></div>
            </div>
            <footer className="sch-context-foot"><p className="sch-question">¿Qué relaciones entre saber, autoridad y ciudadanía aparecen en cada propuesta?</p><p className="sch-source">Síntesis didáctica del capítulo. Las posiciones tuvieron matices y coincidencias, entre ellas la formación de una masculinidad normativa; no fueron conjuntos homogéneos.</p></footer>
          </div>
        </div>
        <div className="sch-screen sch-context sch-scenes" aria-labelledby="sch-scenes-title">
          <div className="sch-inner sch-context-inner">
            <header><div className="sch-top"><JourneyBlockLabel sectionId="contexto" /><span>Perspectiva 2 de 2</span></div><h2 id="sch-scenes-title">Tres escenas.<br /><em>Una disputa que cambia.</em></h2><p className="sch-lead">Los conflictos no ocurrieron solo en los libros. Se desplegaron en conmemoraciones, comisiones oficiales y decisiones sobre la formación docente.</p></header>
            <ol className="sch-scene-grid">{scenes.map(scene => <li key={scene.date}><span className="sch-date">{scene.date}</span><h3>{scene.title}</h3><p>{scene.text}</p><p className="sch-scene-question">{scene.question}</p></li>)}</ol>
            <footer className="sch-context-foot"><p className="sch-question">Las prácticas corporales también son decisiones políticas y pedagógicas.</p><p className="sch-source">Síntesis didáctica basada en Introducción, El «combate» por el Instituto y Doble golpe. Las escenas seleccionadas orientan la lectura; no reemplazan su argumentación.</p></footer>
          </div>
        </div>
      </section>
      <section id="lectura" className="sch-screen hb-material-reading" aria-labelledby="journey-reading-title">
        <IntegratedReader readingDocument={scharagrodskyReadingDocument} config={scharagrodskyReaderConfig} showToast={setToast} Launcher={CanonicalReadingEntry} />
      </section>
      <JourneyCredits workId="scharagrodsky" />
    </main>
    <span className="sch-toast" role="status" aria-live="polite">{toast}</span>
  </div>;
}

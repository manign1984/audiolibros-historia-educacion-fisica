import { useState } from 'react';
import JourneyHeader, { useJourneyNavigation } from '../shared/JourneyHeader.jsx';
import JourneyBlockLabel from '../shared/JourneyBlockLabel.jsx';
import { AuthorBiography } from '../shared/CanonicalLayout.jsx';
import CanonicalReadingEntry from '../shared/CanonicalReadingEntry.jsx';
import JourneyCredits from '../shared/JourneyCredits.jsx';
import IntegratedReader from '../IntegratedReader.jsx';
import { soaresReaderConfig, soaresPrivateAsset } from './readerConfig.js';
import './soares.css';

const currents = [
  { name:'Francesa', knowledge:'De la sistematización de Amorós a la experimentación y el modelo energético en Demeny', aims:'Disciplina, utilidad y patriotismo; también salvamento y asistencia', tensions:'Continuidades y cambios entre utilidad, espectáculo y experimentación' },
  { name:'Sueca', knowledge:'Anatomía, simetría y corrección; ejercicios graduados y observación de sus efectos', aims:'Regeneración colectiva y alcance declarado a distintas edades y condiciones corporales', tensions:'Amplitud de destinatarios dentro de una norma de cuerpo armónico' },
  { name:'Alemana', knowledge:'Propuestas pedagógicas, patrióticas y escolares con fundamentos y destinatarios diferentes', aims:'Formación integral, defensa patriótica y lugar escolar del ejercicio y sus docentes', tensions:'Diferencias entre Guts Muths, Jahn y Spiess; prescripciones diferenciadas para mujeres y varones' },
];
const bio='Carmen Lucia Soares fue profesora titular de la Universidad Estadual de Campinas y doctora en Educación. Investigó la historia de la educación del cuerpo, la gimnasia y la higiene, relacionando prácticas corporales, saberes científicos y pedagogías. Sus trabajos permiten comprender cómo se construyeron formas de educar el cuerpo y cómo esas historias interpelan la formación docente y las prácticas del presente.';
export default function SoaresApp({ readingDocument }) {
  const { active, progress } = useJourneyNavigation();
  const [toast,setToast]=useState('');
  return <div className="soares-page">
    <a className="so-skip" href="#lectura">Saltar a la lectura</a>
    <JourneyHeader author="Soares" title="Las corrientes gimnásticas europeas" active={active} progress={progress}/>
    <main className="so-main">
      <section id="inicio" className="so-screen so-hero" aria-labelledby="so-title">
        <div className="so-inner so-unit">
          <div className="so-top"><JourneyBlockLabel sectionId="inicio"/><span>Capítulo académico · 2006</span></div>
          <div className="so-hero-grid">
            <div><p className="so-byline">Carmen Lucia Soares</p><h1 id="so-title">Las corrientes <em>gimnásticas europeas</em> y su contenido</h1><p className="so-subtitle">Una historia de rupturas y permanencias</p><p className="so-question">¿Cómo se volvió educable, medible y expresivo el gesto?</p></div>
            <figure><img src="/assets/soares-demeny-1906.jpg" width="1200" height="801" alt="Cronofotografía de un esgrimista: varias posiciones del cuerpo y del arma quedan registradas en una misma imagen" fetchPriority="high"/><figcaption>Georges Demeny, [Fencer], 1906. The Metropolitan Museum of Art, 2010.1. Dominio público.</figcaption></figure>
          </div>
          <div className="so-bottom"><p>El gesto entre la norma y la expresión</p><p>Capítulo · Audiolibro 51:53 · Cuaderno de lectura</p></div>
        </div>
      </section>
      <section id="autor" className="so-screen so-author" aria-label="Sobre Carmen Lucia Soares">
        <AuthorBiography name="Carmen Lucia Soares" initial="CS" role="Historia de la educación del cuerpo · Gimnasia e higiene" summary={bio}
          image={soaresPrivateAsset('portrait.jpeg')} imageAlt="Retrato de Carmen Lucia Soares" credit="Retrato: Facultad de Educación, UNICAMP. Biografía: FEF y Rectoría, UNICAMP, 2026." biographyUrl="https://www.fef.unicamp.br/graduacao/corpodocente/"/>
      </section>
      <section id="contexto" aria-label="Contexto: tres perspectivas de estudio">
        <div className="so-screen so-context" aria-labelledby="so-calculable">
          <div className="so-inner so-unit">
            <header><div className="so-top"><JourneyBlockLabel sectionId="contexto"/><span>Perspectiva 1 de 3</span></div><h2 id="so-calculable">El gesto se vuelve <em>calculable</em></h2><p className="so-lead">Un movimiento puede dividirse, medirse y compararse. En las ciudades del siglo XIX, estas operaciones se enlazaron con proyectos de higiene, educación y orden. La gimnasia organizó ejercicios, espacios y tiempos; también definió qué gestos y qué cuerpos se consideraban adecuados.</p></header>
            <div className="so-operations" aria-label="Tres relaciones para estudiar la educación del gesto">
              <article><span aria-hidden="true">01</span><h3>Medir</h3><p>Hacer comparable el gesto</p><div className="so-measure" aria-hidden="true"/></article>
              <article><span aria-hidden="true">02</span><h3>Prescribir</h3><p>Graduar esfuerzos y secuencias</p><div className="so-sequence" aria-hidden="true"><i/><i/><i/><i/></div></article>
              <article><span aria-hidden="true">03</span><h3>Educar</h3><p>Formar hábitos y modos de convivencia</p><div className="so-relations" aria-hidden="true"><i/><i/><i/></div></article>
            </div>
            <footer><p className="so-question">¿Qué hace posible medir un gesto y qué queda fuera de esa medida?</p><p className="so-source">Síntesis didáctica del capítulo. Los esquemas expresan relaciones; no representan mediciones históricas.</p></footer>
          </div>
        </div>
        <div className="so-screen so-context so-comparison" aria-labelledby="so-currents">
          <div className="so-inner so-unit">
            <header><div className="so-top"><JourneyBlockLabel sectionId="contexto"/><span>Perspectiva 2 de 3</span></div><h2 id="so-currents">Corrientes distintas,<br/><em>tensiones compartidas</em></h2><p className="so-lead">Las denominaciones nacionales ayudan a orientarse, pero cada corriente cambió y reunió propuestas diferentes. Comparar sus saberes, finalidades y destinatarios permite reconocer encuentros, conflictos y exclusiones.</p></header>
            <div className="so-current-grid">{currents.map(c=><article key={c.name}><h3>{c.name}</h3><dl><dt>Saberes</dt><dd>{c.knowledge}</dd><dt>Fines y sujetos</dt><dd>{c.aims}</dd><dt>Tensiones</dt><dd>{c.tensions}</dd></dl></article>)}</div>
            <footer><p className="so-question">¿Qué se pierde cuando una corriente se resume en una sola característica?</p><p className="so-source">Síntesis didáctica de Soares, apartados sobre las corrientes francesa, sueca y alemana.</p></footer>
          </div>
        </div>
        <div className="so-screen so-context so-expression" aria-labelledby="so-alternatives">
          <div className="so-inner so-unit">
            <header><div className="so-top"><JourneyBlockLabel sectionId="contexto"/><span>Perspectiva 3 de 3</span></div><h2 id="so-alternatives">Otras formas de<br/><em>educar el cuerpo</em></h2></header>
            <div className="so-expression-grid">
              <article><h3>Gesto · Ritmo · Expresión</h3><div className="so-constellation"><span>Teatro</span><span>Música</span><span>Danza</span></div><p>Dentro de estas tradiciones también se buscaron gestos menos mecánicos. El teatro, la música y la danza ofrecieron caminos para pensar el cuerpo como expresión. Estas experiencias permiten preguntar qué finalidades quedaron en primer plano y cuáles fueron relegadas.</p><p className="so-people">MacKaye · Delsarte · Jaques-Dalcroze · Bode</p></article>
              <article><h3>¿Qué saberes autorizan una intervención sobre el cuerpo?</h3><p>Soares lleva la pregunta a la formación docente. Relacionar ciencias biológicas, pedagogía, historia y artes abre problemas que una explicación única no alcanza a resolver.</p><ul className="so-fields"><li>Ciencias biológicas</li><li>Pedagogía</li><li>Historia</li><li>Artes</li></ul></article>
            </div>
            <footer><p className="so-question">Elegí una práctica que conozcas. ¿Cómo se justifica? ¿Qué relación con el pasado investigarías y qué fuente necesitarías para sostenerla?</p><p className="so-source">Elaboración didáctica basada en los apartados sobre movimientos minoritarios e ideas finales.</p></footer>
          </div>
        </div>
      </section>
      <section id="lectura" className="so-screen hb-material-reading" aria-labelledby="journey-reading-title"><IntegratedReader readingDocument={readingDocument} config={soaresReaderConfig} showToast={setToast} Launcher={CanonicalReadingEntry}/></section>
      <JourneyCredits workId="soares"/>
    </main>
    <span className="so-toast" role="status" aria-live="polite">{toast}</span>
  </div>;
}

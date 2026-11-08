import { useState } from 'react';
import JourneyHeader, { useJourneyNavigation } from '../shared/JourneyHeader.jsx';
import JourneyBlockLabel from '../shared/JourneyBlockLabel.jsx';
import JourneyCredits from '../shared/JourneyCredits.jsx';
import TextOnlyReader from '../shared/TextOnlyReader.jsx';
import { lionettiReaderConfig } from './readerConfig.js';
import './lionetti.css';

const biography = 'Lucía Lionetti es historiadora y profesora de la Facultad de Ciencias Humanas de la UNICEN. Doctora en Filosofía y Letras por la Universidad Autónoma de Madrid, investiga la historia social de la educación, la infancia, la ciudadanía y el género. Sus trabajos estudian las instituciones escolares, los discursos educativos y sus relaciones con la sociedad argentina entre los siglos XIX y XX.';

export default function LionettiApp() {
  const { active, progress } = useJourneyNavigation();
  const [toast, setToast] = useState('');
  return <div className="lionetti-page">
    <a className="ln-skip" href="#lectura">Saltar a la lectura</a>
    <JourneyHeader author="Lionetti" title="La función republicana de la escuela pública" active={active} progress={progress}/>
    <main className="ln-main">
      <section id="inicio" className="ln-screen ln-hero" aria-labelledby="ln-hero-title">
        <div className="ln-inner ln-unit">
          <div className="ln-top"><JourneyBlockLabel sectionId="inicio"/><span>Artículo académico · 2005 · Argentina, fines del siglo XIX</span></div>
          <div className="ln-hero-layout">
            <div className="ln-title-block">
              <p className="ln-kicker">Lucía Lionetti</p>
              <h1 id="ln-hero-title">La función <em>republicana</em> de la escuela pública</h1>
              <p className="ln-subtitle">La formación del ciudadano en Argentina a fines del siglo XIX</p>
              <p className="ln-intro-question">¿Cómo se educaba a quienes debían convertirse en ciudadanos de la República?</p>
            </div>
            <div className="ln-graphic" role="img" aria-label="Composición tipográfica contemporánea sobre escuela pública, ciudadanía y el período histórico 1880–1900. No es un documento de época.">
              <span>ARCHIVO DE IDEAS</span><strong>1880</strong><div className="ln-graphic-rule"></div><p>ESCUELA<br/>PÚBLICA</p><small>CIUDADANÍA · CIVILIZACIÓN · INFANCIA</small>
            </div>
          </div>
          <div className="ln-bottom"><span>Una lectura sobre educación y política</span><span>Texto completo · Anotaciones personales · Sin audiolibro</span></div>
        </div>
      </section>

      <section id="autor" className="ln-screen ln-author" aria-labelledby="ln-author-title">
        <div className="ln-inner ln-author-grid">
          <figure className="ln-author-photo"><img src={`${import.meta.env.BASE_URL}assets/lionetti/lionetti.jpg`} width="487" height="429" alt="Retrato fotográfico de Lucía Lionetti" loading="lazy"/><figcaption>Fotografía facilitada para el proyecto desde la carpeta WEBs.</figcaption></figure>
          <div className="ln-author-copy">
            <JourneyBlockLabel sectionId="autor" />
            <h2 id="ln-author-title">Lucía Lionetti</h2>
            <p className="ln-author-role">Historiadora · Educación, ciudadanía e infancias</p>
            <p>{biography}</p>
            <a href="https://iehs.unicen.edu.ar/LuciaLionetti.html" target="_blank" rel="noreferrer">Consultar trayectoria académica · IEHS / UNICEN ↗</a>
            <small>Retrato aportado al proyecto. Se conserva la imagen original sin modificaciones.</small>
          </div>
        </div>
      </section>

      <section id="contexto" aria-label="Tres perspectivas para estudiar el artículo">
        <div className="ln-screen ln-context">
          <div className="ln-inner ln-unit">
            <div className="ln-top"><JourneyBlockLabel sectionId="contexto"/><span>Perspectiva 1 de 3</span></div>
            <div><p className="ln-index">01 / El proyecto político</p><h2>Educar al <em>soberano</em></h2><p className="ln-lead">En la Argentina de fines del siglo XIX, la escuela pública fue presentada como una herramienta para integrar a la población y formar ciudadanos. La promesa de escolarización común convivió con proyectos de disciplina y regulación de las conductas.</p></div>
            <div className="ln-context-row">
              <article><span>ORDEN</span><h3>Organizar el Estado</h3><p>La escolarización primaria participó del proyecto de construcción estatal y de un orden social considerado moderno.</p></article>
              <article><span>PROGRESO</span><h3>Extender la escuela</h3><p>La educación común se pensó como instrumento para ampliar la alfabetización e incorporar sectores populares.</p></article>
              <article><span>CIUDADANÍA</span><h3>Modelar conductas</h3><p>Los discursos educativos promovieron autocontrol, obediencia, virtud cívica y prácticas de convivencia.</p></article>
            </div>
            <footer><p className="ln-question">¿Qué tensiones aparecen entre la promesa democratizadora y la función disciplinadora de la escuela?</p><small>Síntesis didáctica del planteo introductorio de Lionetti.</small></footer>
          </div>
        </div>
        <div className="ln-screen ln-context ln-context-alt">
          <div className="ln-inner ln-unit">
            <div className="ln-top"><JourneyBlockLabel sectionId="contexto"/><span>Perspectiva 2 de 3</span></div>
            <div><p className="ln-index">02 / Pertenencia y nacionalidad</p><h2>Educar para <em>argentinizar</em></h2><p className="ln-lead">La autora examina cómo los discursos de civilización, la preocupación por la inmigración y la construcción de una identidad nacional convirtieron a la escuela en un espacio decisivo para imaginar una comunidad política.</p></div>
            <div className="ln-context-focus">
              <div className="ln-focus-word" aria-hidden="true">PATRIA</div>
              <div><h3>La nacionalidad también se enseñaba</h3><p>El aprendizaje de símbolos, relatos y valores patrióticos se vinculó con el ideal de formar a los «pequeños patriotas» que habitarían las aulas de la República.</p><p>Pero la diversidad social y cultural planteó preguntas acerca de quiénes podían reconocerse plenamente como integrantes de esa comunidad.</p></div>
            </div>
            <footer><p className="ln-question">¿Cómo podía una escuela común construir pertenencia y, al mismo tiempo, establecer diferencias?</p><small>Síntesis didáctica del apartado «Educar para “argentinizar” a la sociedad civil».</small></footer>
          </div>
        </div>
        <div className="ln-screen ln-context">
          <div className="ln-inner ln-unit">
            <div className="ln-top"><JourneyBlockLabel sectionId="contexto"/><span>Perspectiva 3 de 3</span></div>
            <div><p className="ln-index">03 / Saberes y cuerpos</p><h2>Virtud pública, <em>moral cívica</em> y educación del cuerpo</h2><p className="ln-lead">La construcción del ciudadano se proyectó mediante contenidos escolares y pautas corporales. Lionetti analiza la enseñanza de la moral, la instrucción cívica, la higiene y la gimnasia dentro de un programa que también establecía diferencias entre niñas y niños.</p></div>
            <div className="ln-context-row">
              <article><span>CONDUCTAS</span><h3>Moral y urbanidad</h3><p>Se buscaron hábitos de respeto, obediencia, autocontrol y comportamiento considerado virtuoso.</p></article>
              <article><span>PARTICIPACIÓN</span><h3>Instrucción cívica</h3><p>Conocer derechos, deberes y símbolos de la patria debía acompañar el aprendizaje de la pertenencia política.</p></article>
              <article><span>CUERPOS</span><h3>Higiene y gimnasia</h3><p>La salud y los ejercicios corporales integraron el proyecto educativo, con prescripciones y expectativas diferenciadas según género.</p></article>
            </div>
            <footer><p className="ln-question">¿Qué ciudadanía buscaba formar la escuela y qué lugar ocupaba allí la Educación Física?</p><small>Síntesis didáctica de «Formar en la virtud pública y la moral cívica» y los apartados sobre formación corporal.</small></footer>
          </div>
        </div>
      </section>
      <section id="lectura" className="ln-screen ln-reading hb-material-reading" aria-labelledby="journey-reading-title">
        <TextOnlyReader config={lionettiReaderConfig} showToast={setToast}/>
      </section>
      <JourneyCredits workId="lionetti"/>
    </main>
    <span role="status" aria-live="polite" className="ln-toast">{toast}</span>
  </div>;
}

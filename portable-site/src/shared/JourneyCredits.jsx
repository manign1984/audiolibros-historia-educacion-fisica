import '@fontsource/archivo/latin-400.css';
import '@fontsource/archivo/latin-700.css';
import '@fontsource/bebas-neue/latin-400.css';
import JourneyBlockLabel from './JourneyBlockLabel.jsx';
import { creditsContent } from './creditsContent.jsx';
import './journey-credits.css';

export default function JourneyCredits({ workId }) {
  const { references, rights } = creditsContent[workId];
  return <footer id="creditos" className="journey-credits tracked-section" aria-labelledby="journey-credits-title">
    <div className="journey-credits__inner">
      <header className="journey-credits__heading">
        <JourneyBlockLabel sectionId="creditos" />
        <h2 id="journey-credits-title"><span>Estudiar el pasado</span><span>Soñar futuros</span><span>Accionar en presente.</span></h2>
      </header>
      <div className="journey-credits__columns">
        <section aria-labelledby="credits-references-title">
          <h3 id="credits-references-title">Referencias bibliográficas y fuentes</h3>
          <ul>{references.map((text, index) => <li key={index}>{text}</li>)}</ul>
        </section>
        <section aria-labelledby="credits-rights-title">
          <h3 id="credits-rights-title">Derechos y agradecimientos</h3>
          <ul>{rights.map((text, index) => <li key={index}>{text}</li>)}</ul>
        </section>
      </div>
      <div className="journey-credits__bottom">
        <div className="journey-credits__logos" aria-label="Proyecto +TEC · UNAHUR">
          <img src="/assets/logo-unahur.png" alt="Universidad Nacional de Hurlingham" width="1223" height="393" />
          <img src="/assets/logo-mas-tec.png" alt="+TEC" width="1743" height="864" />
        </div>
        <p>No se solicitan datos personales. Las notas y el progreso se guardan en este navegador; podés exportarlos desde el lector.</p>
        <nav aria-label="Enlaces de cierre">
          <a href={import.meta.env.BASE_URL}>← Volver a la biblioteca</a>
          <a href="#inicio">Volver al inicio ↑</a>
        </nav>
      </div>
    </div>
  </footer>;
}

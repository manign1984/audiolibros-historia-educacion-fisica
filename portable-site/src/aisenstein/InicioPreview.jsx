import JourneyHeader, { useJourneyNavigation } from '../shared/JourneyHeader.jsx';
import './inicio-preview.css';

// Portada aprobada: mantenemos estructura, imagen y estilos originales.
export default function AisensteinInicioPreview({ children }) {
  const { active, progress } = useJourneyNavigation();
  return (
    <div className="aisenstein-preview">
      <a className="aisenstein-preview__skip" href="#inicio">Saltar al inicio</a>
      <JourneyHeader
        author="Aisenstein"
        title="¿Hacemos tabla rasa del pasado?"
        active={active}
        progress={progress}
      />
      <main>
        <section id="inicio" className="aisenstein-preview__hero" aria-labelledby="aisenstein-hero-title">
          <img className="aisenstein-preview__art" src="/assets/aisenstein-inicio-prueba.png"
            alt="Collage de óleo y espátula con fragmentos de papel histórico y una escena clásica en torno a una figura alegórica."
            width="1086" height="611" fetchPriority="high" />
          <div className="aisenstein-preview__veil" aria-hidden="true" />
          <div className="aisenstein-preview__copy">
            <p className="aisenstein-preview__eyebrow">01 · Inicio <span aria-hidden="true">/</span> Ángela Aisenstein</p>
            <p className="aisenstein-preview__year">2006 · Pensar la historia</p>
            <h1 id="aisenstein-hero-title">¿Hacemos<br />tabla rasa<br /><em>del pasado?</em></h1>
            <p className="aisenstein-preview__subtitle">El saber histórico en la formación docente en Educación Física</p>
            <p className="aisenstein-preview__question">¿Para qué me sirve estudiar historia en el profesorado?</p>

          </div>
          <p className="aisenstein-preview__source-note">
            <span className="aisenstein-preview__source-label">Una imagen, una historia · 1793</span>
            <span>Esta composición retoma el <a href="https://wellcomecollection.org/works/wxnc8jhk" target="_blank" rel="noreferrer">frontispicio de <cite>Gymnastik für die Jugend</cite></a>, de J. C. F. GutsMuths. La figura es <strong>Higía</strong>, diosa griega de la salud, cuyo nombre dio origen a «higiene».</span>
          </p>
        </section>
        {children}
      </main>
    </div>
  );
}

import { ArrowLeft, ArrowRight } from 'lucide-react';
import './inicio-preview.css';

// Vista de prueba del bloque 01; los demás bloques no están publicados.
export default function AisensteinInicioPreview() {
  const libraryUrl = import.meta.env.BASE_URL;
  return (
    <div className="aisenstein-preview">
      <a className="aisenstein-preview__skip" href="#inicio">Saltar al inicio</a>
      <header className="aisenstein-preview__header">
        <div className="aisenstein-preview__identity">
          <a className="aisenstein-preview__back" href={libraryUrl} aria-label="Volver a la biblioteca">
            <ArrowLeft size={18} aria-hidden="true" />
          </a>
          <span>Historia de la Educación Física</span>
        </div>
        <div className="aisenstein-preview__logos" aria-label="UNAHUR y +TEC">
          <img src="/assets/logo-unahur.png" alt="Universidad Nacional de Hurlingham" />
          <img src="/assets/logo-mas-tec.png" alt="+TEC" />
        </div>
      </header>
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
            <a className="aisenstein-preview__action" href="#criterio">
              Conocer el enfoque <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </section>
        <section id="criterio" className="aisenstein-preview__development" aria-labelledby="aisenstein-preview-note-title">
          <div className="aisenstein-preview__development-inner">
            <p className="aisenstein-preview__development-label">Prueba de diseño · Bloque 01</p>
            <h2 id="aisenstein-preview-note-title">El pasado deja huellas.</h2>
            <p>Esta primera prueba utiliza sin alteraciones la imagen adjunta: óleo de fuerte textura, documentación histórica integrada a la pintura y protagonismo del grabado en el centro-derecha. Los títulos y controles son elementos web independientes de la imagen.</p>
            <p>Los bloques Autor, Contexto, Lectura y Créditos siguen en preparación.</p>
            <a href={libraryUrl}>Volver a la biblioteca <ArrowRight size={17} aria-hidden="true" /></a>
          </div>
        </section>
      </main>
    </div>
  );
}

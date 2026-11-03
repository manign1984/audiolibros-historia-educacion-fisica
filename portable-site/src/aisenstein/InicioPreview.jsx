import { ArrowLeft, ArrowRight } from 'lucide-react';
import './inicio-preview.css';

// Portada aprobada: mantenemos estructura, imagen y estilos originales.
export default function AisensteinInicioPreview({ children }) {
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
          <img src="/assets/logo-unahur-oscuro.svg" alt="Universidad Nacional de Hurlingham" />
          <img src="/assets/logo-mas-tec-oscuro.svg" alt="+TEC" />
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
            <a className="aisenstein-preview__action" href="#autor">
              Conocer el enfoque <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </section>
        {children}
      </main>
    </div>
  );
}

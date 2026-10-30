import { useEffect, useRef } from 'react';
import { ArrowRight, Headphones } from 'lucide-react';
import JourneyBlockLabel from '../shared/JourneyBlockLabel.jsx';
import './hobsbawm-reading.css';

// Pilot: the reading section is the entry, with no card nested inside it.
export default function HobsbawmReadingEntry({ onOpen, progress, noteCount, config }) {
  const content = useRef(null);
  useEffect(() => {
    let cancelled = false;
    const alignReading = () => document.fonts.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!cancelled && ['#lectura', '#lector'].includes(window.location.hash)) {
        content.current?.closest('section').scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    })));
    if (document.readyState === 'complete') alignReading();
    else window.addEventListener('load', alignReading, { once: true });
    return () => { cancelled = true; window.removeEventListener('load', alignReading); };
  }, []);

  const hasProgress = progress.currentTime > 3;
  const time = `${Math.floor(progress.currentTime / 60)}:${String(Math.floor(progress.currentTime % 60)).padStart(2, '0')}`;
  return <div ref={content} id="lector" className="hb-reading-content">
    <header className="hb-reading-heading">
      <JourneyBlockLabel sectionId="lectura" />
      <h2 id="hb-reading-title">El texto en el centro de los procesos de enseñanza y aprendizaje</h2>
    </header>

    <div className="hb-reading-invitation">
      <div className="hb-reading-story">
        <p className="hb-reading-work">Eric Hobsbawm <span>·</span> Vista panorámica del siglo XX</p>
        <p className="hb-reading-synopsis">Guerras y revoluciones, prosperidad y catástrofes: el siglo XX transformó la vida como nunca antes. Hobsbawm cruza las voces de quienes lo vivieron con la mirada del historiador para reconstruir ese mundo y descubrir cuánto de aquel pasado sigue latiendo en nuestro presente.</p>
      </div>
      <div className="hb-reading-access">
        <button className="hb-reading-open" type="button" onClick={onOpen} aria-haspopup="dialog">
          <Headphones aria-hidden="true" /><span>Abrir lector integrado</span><ArrowRight aria-hidden="true" />
        </button>
        <p className="hb-reading-help">Leé, escuchá y anotá. Audio de 49 minutos.</p>
        {(hasProgress || noteCount > 0) && <p className="hb-reading-resume">
          {hasProgress ? `Retomá desde ${time}.` : 'Tu cuaderno está guardado.'}{noteCount > 0 && ` ${noteCount} ${noteCount === 1 ? 'nota guardada' : 'notas guardadas'}.`}
        </p>}
      </div>
    </div>

    <footer className="hb-reading-foot">
      <nav aria-label="Materiales de la lectura">
        <a href={config.pdfUrl} target="_blank" rel="noreferrer">PDF del texto</a>
        <a href={config.audiobookExternalUrl} target="_blank" rel="noreferrer">Audio original</a>
        <a href="/assets/hobsbawm-texto-accesible.txt" download>Texto accesible</a>
      </nav>
      <p>El audio omite seis pasajes: están conservados y señalados en el lector.</p>
    </footer>
  </div>;
}

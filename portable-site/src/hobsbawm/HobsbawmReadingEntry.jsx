import { useEffect, useRef } from 'react';
import { ArrowRight, Headphones } from 'lucide-react';
import '@fontsource/archivo/latin-900.css';
import JourneyBlockLabel from '../shared/JourneyBlockLabel.jsx';
import './hobsbawm-reading.css';

// Presentation-only pilot. onOpen, progress and notes belong to IntegratedReader.
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

  const entry = config.readingEntry;
  const hasProgress = progress.currentTime > 3;
  const time = `${Math.floor(progress.currentTime / 60)}:${String(Math.floor(progress.currentTime % 60)).padStart(2, '0')}`;

  return <div ref={content} id="lector" className="hb-material-content">
    <div className="hb-material-copy">
      <JourneyBlockLabel sectionId="lectura" />
      <h2 id="journey-reading-title" className="hb-material-title">
        <span>LEÉ</span>{' '}<span>ESCUCHÁ</span>{' '}<span>ANOTÁ</span>
      </h2>
      <div className="hb-material-work">
        <p className="hb-material-author">{entry.author}</p>
        <h3>{entry.title}</h3>
      </div>
      <p className="hb-material-synopsis">{entry.synopsis}</p>
    </div>

    <div className="hb-material-access">
      <div className="hb-material-geometry" aria-hidden="true">
        <span className="hb-material-quadrant" />
        <span className="hb-material-lines" />
        <span className="hb-material-plate" />
        <span className="hb-material-dots" />
      </div>
      <p className="hb-material-concept">El texto en el centro<br />de los procesos<br />de enseñanza y aprendizaje</p>
      <button className="hb-material-open" type="button" onClick={onOpen} aria-haspopup="dialog">
        <Headphones aria-hidden="true" />
        <span>ABRIR EL LECTOR INTEGRADO</span>
        <ArrowRight aria-hidden="true" />
      </button>
      {(hasProgress || noteCount > 0) && <p className="hb-material-resume">
        {hasProgress ? `Retomá desde ${time}.` : ''}{noteCount > 0 && ` ${noteCount} ${noteCount === 1 ? 'nota guardada' : 'notas guardadas'}.`}
      </p>}
    </div>
    <div className="hb-material-rule" aria-hidden="true" />
  </div>;
}

import { useEffect, useRef } from 'react';
import { ArrowRight, Headphones } from 'lucide-react';
import '@fontsource/archivo/latin-900.css';
import JourneyBlockLabel from '../shared/JourneyBlockLabel.jsx';
import './canonical-reading.css';

// Canonical visual entry for every work. Player, progress and notes belong to IntegratedReader.
export default function CanonicalReadingEntry({ onOpen, progress, noteCount, config, buttonLabel = 'ABRIR EL LECTOR', buttonAriaLabel = 'Abrir lector integrado' }) {
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
  const synopsisLines = entry.synopsis.split(/ (?=transformó la vida|de quienes lo vivieron|ese mundo y descubrir)/);
  const textOnly = config.textOnly === true;
  const hasProgress = textOnly ? progress.currentPage > 1 : progress.currentTime > 3;
  const time = `${Math.floor(progress.currentTime / 60)}:${String(Math.floor(progress.currentTime % 60)).padStart(2, '0')}`;

  return <div ref={content} id="lector" className="hb-material-content">
    <div className="hb-material-hero">
      <JourneyBlockLabel sectionId="lectura" />
      <h2 id="journey-reading-title" className="hb-material-title" aria-label="Escuchá, leé y anotá">
        <span className="hb-material-word hb-material-word--listen" aria-hidden="true">ESCUCHÁ</span>
        <span className="hb-material-word hb-material-word--read" aria-hidden="true">{'LEÉ'}</span>
        <span className="hb-material-word hb-material-word--note" aria-hidden="true">ANOTÁ</span>
      </h2>
      <div className="hb-material-access">
        <div className="hb-material-geometry" aria-hidden="true">
          <span className="hb-material-dots" />
        </div>
        <button className="hb-material-open" type="button" onClick={onOpen} aria-haspopup="dialog" aria-label={buttonAriaLabel} aria-describedby={hasProgress || noteCount > 0 ? "hb-material-resume" : undefined}>
          <Headphones aria-hidden="true" />
          <span aria-hidden="true">{buttonLabel}</span>
          <ArrowRight aria-hidden="true" />
        </button>
      {(hasProgress || noteCount > 0) && <p id="hb-material-resume" className="hb-material-resume">
        {hasProgress ? (textOnly ? `Retomá desde la página ${progress.currentPage}.` : `Retomá desde ${time}.`) : ''}{noteCount > 0 && ` ${noteCount} ${noteCount === 1 ? 'nota guardada' : 'notas guardadas'}.`}
      </p>}
      </div>
    </div>

    <div className="hb-material-copy">
      <div className="hb-material-work">
        <p className="hb-material-author">{entry.author}</p>
        <h3>{entry.title}</h3>
      </div>
      <p className="hb-material-synopsis">{synopsisLines.map((line, index) => <span className="hb-material-synopsis-line" key={line}>{line}{index < synopsisLines.length - 1 ? ' ' : ''}</span>)}</p>
    </div>
    <div className="hb-material-rule" aria-hidden="true" />
  </div>;
}

import { useEffect, useRef } from 'react';
import { ArrowRight, Headphones } from 'lucide-react';
import JourneyBlockLabel from './JourneyBlockLabel.jsx';
import './journey-reading.css';

// Shared reading entry: the section itself is the visual container.
export default function JourneyReadingEntry({ onOpen, progress, noteCount, config }) {
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
  return <div ref={content} id="lector" className="journey-reading-content">
    <header className="journey-reading-heading">
      <JourneyBlockLabel sectionId="lectura" />
      <h2 id="journey-reading-title">El texto en el centro de los procesos de enseñanza y aprendizaje</h2>
    </header>

    <div className="journey-reading-invitation">
      <div className="journey-reading-story">
        <p className="journey-reading-work">{entry.author} <span>·</span> {entry.title}</p>
        <p className="journey-reading-synopsis">{entry.synopsis}</p>
      </div>
      <div className="journey-reading-access">
        <button className="journey-reading-open" type="button" onClick={onOpen} aria-haspopup="dialog">
          <Headphones aria-hidden="true" /><span>Abrir lector integrado</span><ArrowRight aria-hidden="true" />
        </button>
        <p className="journey-reading-help">Leé, escuchá y anotá. Audio de {entry.audioMinutes} minutos.</p>
        {(hasProgress || noteCount > 0) && <p className="journey-reading-resume">
          {hasProgress ? `Retomá desde ${time}.` : 'Tu cuaderno está guardado.'}{noteCount > 0 && ` ${noteCount} ${noteCount === 1 ? 'nota guardada' : 'notas guardadas'}.`}
        </p>}
      </div>
    </div>

    <footer className="journey-reading-foot">
      <nav aria-label="Materiales de la lectura">
        <a href={config.pdfUrl} target="_blank" rel="noreferrer">PDF del texto</a>
        <a href={config.audiobookExternalUrl} target="_blank" rel="noreferrer">Audio original</a>
        {entry.textUrl && <a href={entry.textUrl} download>Texto accesible</a>}
        {entry.srtUrl && <a href={entry.srtUrl} download>Subtítulos SRT</a>}
      </nav>
      {entry.notice && <p>{entry.notice}</p>}
    </footer>
  </div>;
}

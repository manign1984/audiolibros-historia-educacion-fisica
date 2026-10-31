import { useEffect, useRef } from 'react';
import { ArrowRight, BookAudio } from 'lucide-react';
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
        <div className="journey-reading-work">
          <p className="journey-reading-author">{entry.author}</p>
          <h3>{entry.title}</h3>
        </div>
        <p className="journey-reading-synopsis">{entry.synopsis}</p>
      </div>
      <div className="journey-reading-access">
        <svg className="journey-reading-motif" viewBox="0 0 300 160" fill="none" aria-hidden="true" focusable="false">
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M28 38c27-8 51-5 75 10v86c-24-15-48-18-75-10V38Z" />
            <path d="M103 48c22-15 45-18 67-10v86c-22-8-45-5-67 10" />
            <path d="M40 27c24-4 45 0 63 12 18-12 38-16 56-13" opacity=".35" />
            <path d="M43 61c15-2 28 0 44 7M43 79c15-2 28 0 44 7M43 97c15-2 28 0 44 7" opacity=".5" />
            <path d="M119 65c12-4 23-5 35-3M119 83c12-4 23-5 35-3M119 101c12-4 23-5 35-3" opacity=".5" />
          </g>
          <path d="M174 84h18m12-13v26m14-43v60m14-77v94m14-65v36m14-50v66m14-41v16" stroke="#b68b38" strokeWidth="4" strokeLinecap="round" />
        </svg>
        <button className="journey-reading-open" type="button" onClick={onOpen} aria-haspopup="dialog">
          <BookAudio aria-hidden="true" /><span>Abrir lector integrado</span><ArrowRight aria-hidden="true" />
        </button>
        <p className="journey-reading-help">Leé, escuchá y anotá · Audio de {entry.audioMinutes} min</p>
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

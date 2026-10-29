import { useEffect, useRef } from 'react';
import { ArrowRight, BookOpen, Check, Download, FileText, Headphones, Pencil, ShieldCheck } from 'lucide-react';
import './reader-launcher.css';

const FEATURES = [
  [BookOpen, 'Texto que acompaña la voz'],
  [Pencil, 'Anotaciones propias'],
  [Download, 'Cuaderno para descargar'],
];

function Features({ checks = false }) {
  return (
    <ul className="reader-entry__features" aria-label="Funciones del lector">
      {FEATURES.map(([Icon, label]) => (
        <li key={label}>{checks ? <Check aria-hidden="true" /> : <Icon aria-hidden="true" />}<span>{label}</span></li>
      ))}
    </ul>
  );
}

function PaperLines() {
  return <div className="reader-entry__paper-lines">{Array.from({ length: 9 }, (_, index) => <i key={index} />)}</div>;
}

function EditorialArt() {
  return (
    <div className="reader-entry__illustration" aria-hidden="true">
      <div className="reader-entry__audio-sheet"><Headphones /><div className="reader-entry__wave">{[20, 34, 60, 28, 46, 72, 32, 50, 24, 58, 40, 20].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div></div>
      <div className="reader-entry__text-sheet"><strong>Texto + audiolibro</strong><PaperLines /></div>
      <div className="reader-entry__sticky-note"><span>Tu nota</span><i /><i /><i /></div>
    </div>
  );
}

function ReaderPreview({ readingDocument, config }) {
  const paragraph = readingDocument.sections.find(section => section.paragraphs?.length)?.paragraphs[0];
  const sentences = paragraph?.sentences?.slice(0, 2) || [];
  return (
    <div className="reader-entry__preview" aria-hidden="true">
      <p className="reader-entry__preview-label">Una mirada al texto</p>
      <div className="reader-entry__preview-page">
        <p className="reader-entry__preview-author">{config.launcher.author}</p>
        <h4>{config.shortTitle}</h4>
        <div className="reader-entry__excerpt">
          {sentences.map((sentence, index) => <span key={sentence.id}>{index === 0 ? <mark>{sentence.text}</mark> : sentence.text}{' '}</span>)}
        </div>
        <div className="reader-entry__note-example"><Pencil size={16} /> Acá podés dejar tu nota</div>
        <div className="reader-entry__preview-audio"><Headphones /><div className="reader-entry__wave">{[22, 42, 65, 30, 72, 48, 92, 44, 58, 32, 76, 50, 28, 62, 86, 46, 70, 40, 24, 52, 74, 32, 48, 20].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></div>
      </div>
    </div>
  );
}

export default function ReaderLauncher({ onOpen, progress, noteCount, readingDocument, config }) {
  const panelRef = useRef(null);
  useEffect(() => {
    let cancelled = false;
    // A direct comparison link arrives before React has created the panel.
    const alignPanel = () => document.fonts.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!cancelled && window.location.hash === '#lector') panelRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    })));
    if (window.location.hash === '#lector') {
      if (document.readyState === 'complete') alignPanel();
      else window.addEventListener('load', alignPanel, { once: true });
    }
    return () => { cancelled = true; window.removeEventListener('load', alignPanel); };
  }, []);
  const variant = config.launcher.variant;
  const titleId = `${config.workId}-reader-entry-title`;
  const hasProgress = progress.currentTime > 3;
  const time = `${Math.floor(progress.currentTime / 60)}:${String(Math.floor(progress.currentTime % 60)).padStart(2, '0')}`;

  const action = (
    <div className="reader-entry__action">
      <button className="reader-entry__open" type="button" onClick={onOpen} aria-haspopup="dialog">
        <span>Abrir lector integrado</span><ArrowRight aria-hidden="true" />
      </button>
      {(hasProgress || noteCount > 0) && <p className="reader-entry__resume">
        {hasProgress ? `Retomá desde ${time}.` : 'Tu cuaderno está guardado.'}{noteCount > 0 && ` ${noteCount} ${noteCount === 1 ? 'nota guardada' : 'notas guardadas'}.`}
      </p>}
    </div>
  );

  return (
    <aside id="lector" ref={panelRef} className={`reader-entry reader-entry--${variant}`} aria-labelledby={titleId}>
      <div className="reader-entry__topline"><span>Texto + audiolibro</span><span>+TEC · UNAHUR</span></div>

      {variant === 'editorial' && <div className="reader-entry__editorial-grid">
        <div className="reader-entry__editorial-copy">
          <p className="reader-entry__author">{config.launcher.author}</p>
          <p className="reader-entry__work">{config.shortTitle}</p>
          <h3 id={titleId} className="reader-entry__title"><span>Leé.</span><span>Escuchá.</span><span>Anotá.</span></h3>
          <p className="reader-entry__lead">El texto, la voz y tus ideas, en un mismo lugar.</p>
          {action}
        </div>
        <div className="reader-entry__editorial-visual"><EditorialArt /><Features /></div>
      </div>}

      {variant === 'portal' && <div className="reader-entry__portal">
        <p className="reader-entry__author">{config.launcher.author}</p>
        <p className="reader-entry__work">{config.shortTitle}</p>
        <h3 id={titleId} className="reader-entry__title"><span>Leé. Escuchá.</span><span>Pensá. Anotá<span className="reader-entry__accent">.</span></span></h3>
        <div className="reader-entry__emblem" aria-hidden="true"><Headphones /><BookOpen /></div>
        <p className="reader-entry__lead">Seguí el texto con la voz y construí tu cuaderno.</p>
        {action}
        <Features />
      </div>}

      {variant === 'desk' && <>
        <h3 id={titleId} className="reader-entry__title">Tu mesa de lectura</h3>
        <p className="reader-entry__lead">Leé, escuchá y guardá tus ideas.</p>
        <div className="reader-entry__desk">
          <ReaderPreview readingDocument={readingDocument} config={config} />
          <div className="reader-entry__desk-action">
            <p className="reader-entry__desk-heading">Todo listo<br />para leer</p>
            <Features checks />
            {action}
          </div>
        </div>
      </>}

      <footer className="reader-entry__footer">
        <nav aria-label="Recursos originales de la lectura">
          <a href={config.pdfUrl} target="_blank" rel="noreferrer"><FileText aria-hidden="true" />PDF original</a>
          <a href={config.audiobookExternalUrl} target="_blank" rel="noreferrer"><Headphones aria-hidden="true" />Audio original</a>
        </nav>
        <p className="reader-entry__privacy"><ShieldCheck aria-hidden="true" /><span>Sin registro. Tus notas se guardan en este navegador.</span></p>
      </footer>
    </aside>
  );
}

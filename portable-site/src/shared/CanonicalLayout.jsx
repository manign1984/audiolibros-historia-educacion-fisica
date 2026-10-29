import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import JourneyBlockLabel from './JourneyBlockLabel.jsx';
import './canonical-layout.css';

const BLOCKS = ['inicio', 'autor', 'contexto', 'lectura', 'creditos'];

export function PineauLayoutReference() {
  const frame = useRef(null);
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
  useEffect(() => {
    const resize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);
  useEffect(() => {
    const iframe = frame.current;
    let observer;
    let cancelled = false;
    let animation;
    const measure = () => {
      cancelAnimationFrame(animation);
      animation = requestAnimationFrame(() => {
        const doc = iframe.contentDocument;
        if (cancelled || !doc?.getElementById('creditos')) return;
        const root = iframe.closest('.canonical-page');
        for (const id of BLOCKS) {
          const height = doc.getElementById(id).getBoundingClientRect().height;
          if (height > 0) root.style.setProperty(`--height-${id}`, `${height}px`);
        }
        root.dataset.layoutReady = 'true';

      });
    };
    const ready = async () => {
      await Promise.all([iframe.contentDocument?.fonts.ready, document.fonts.ready]);
      if (cancelled) return;
      observer?.disconnect();
      observer = new ResizeObserver(measure);
      for (const id of BLOCKS) {
        const section = iframe.contentDocument?.getElementById(id);
        if (section) observer.observe(section);
      }
      measure();
    };
    iframe.addEventListener('load', ready);
    if (iframe.contentDocument?.readyState === 'complete') ready();
    return () => { cancelled = true; observer?.disconnect(); cancelAnimationFrame(animation); iframe.removeEventListener('load', ready); };
  }, []);
  return <iframe ref={frame} className="canonical-layout-reference" src={`${import.meta.env.BASE_URL}layout/pineau-reference.html`} style={viewport} title="Referencia de medidas" aria-hidden="true" tabIndex={-1} sandbox="allow-same-origin" />;
}

export function AuthorBiography({ name, initial, role, summary, image, imageAlt, credit, biographyUrl }) {
  return <div className="canonical-author-grid">
    <figure className="canonical-author-photo">
      <span className="canonical-author-initial" aria-hidden="true">{initial}</span>
      <div className="canonical-author-image"><img src={image} alt={imageAlt} /></div>
      <figcaption>{credit}</figcaption>
    </figure>
    <div className="canonical-author-copy">
      <JourneyBlockLabel sectionId="autor" />
      <h2>{name}</h2>
      <p className="canonical-author-role">{role}</p>
      <p className="canonical-author-summary">{summary}</p>
      <a className="canonical-author-link" href={biographyUrl} target="_blank" rel="noreferrer">Ver biografía académica <ExternalLink size={15} /></a>
    </div>
  </div>;
}

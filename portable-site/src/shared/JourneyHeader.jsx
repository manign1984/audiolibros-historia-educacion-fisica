import { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import '@fontsource/archivo/latin-600.css';
import '@fontsource/archivo/latin-700.css';
import './journey-header.css';

export const JOURNEY_SECTIONS = [
  ['inicio', 'Inicio'],
  ['autor', 'Autor'],
  ['contexto', 'Contexto'],
  ['lectura', 'Lectura'],
  ['creditos', 'Créditos'],
];

export function useJourneyNavigation() {
  const [state, setState] = useState({ active: 'inicio', progress: 0 });
  useEffect(() => {
    let frame;
    let cancelled = false;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (cancelled) return;
        const header = document.querySelector('.journey-header');
        const readingLine = (header?.getBoundingClientRect().bottom || 80) + 24;
        const maximum = document.documentElement.scrollHeight - window.innerHeight;
        let active = 'inicio';
        for (const [id] of JOURNEY_SECTIONS) {
          if (document.getElementById(id)?.getBoundingClientRect().top <= readingLine) active = id;
        }
        if (window.scrollY > 0 && maximum - window.scrollY <= 2) active = 'creditos';
        const progress = maximum > 0 ? Math.max(0, Math.min(100, window.scrollY / maximum * 100)) : 0;
        setState(previous => previous.active === active && previous.progress === progress ? previous : { active, progress });
      });
    };
    const observer = new ResizeObserver(update);
    observer.observe(document.documentElement);
    const header = document.querySelector('.journey-header');
    if (header) observer.observe(header);
    document.fonts.ready.then(() => { if (!cancelled) update(); });
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);
  return state;
}

export default function JourneyHeader({ author, title, active, progress }) {
  const header = useRef(null);
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.getPropertyValue('--journey-header-height');
    const measure = () => root.style.setProperty('--journey-header-height', `${header.current.getBoundingClientRect().height}px`);
    const observer = new ResizeObserver(measure);
    observer.observe(header.current);
    measure();
    return () => {
      observer.disconnect();
      if (previous) root.style.setProperty('--journey-header-height', previous);
      else root.style.removeProperty('--journey-header-height');
    };
  }, []);

  return <header ref={header} className="journey-header">
    <div className="journey-header__inner">
      <a className="journey-header__library" href={import.meta.env.BASE_URL}>
        <ArrowLeft size={17} aria-hidden="true" /><span>Biblioteca</span>
      </a>
      <div className="journey-header__identity">
        <span className="journey-header__author">{author}</span>
        <span className="journey-header__separator" aria-hidden="true">·</span>
        <span className="journey-header__title">{title}</span>
      </div>
      <nav className="journey-header__nav" aria-label="Secciones del recorrido">
        {JOURNEY_SECTIONS.map(([id, label]) => <a className="journey-header__link" key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined}>{label}</a>)}
      </nav>
    </div>
    <div className="journey-header__progress" role="progressbar" aria-label="Progreso del recorrido" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
      <span style={{ width: `${progress}%` }} />
    </div>
  </header>;
}

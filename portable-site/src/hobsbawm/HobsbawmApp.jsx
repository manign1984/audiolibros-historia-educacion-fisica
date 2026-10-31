import { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Clock3, Headphones } from 'lucide-react';
import IntegratedReader from '../IntegratedReader.jsx';
import HobsbawmReadingEntry from './HobsbawmReadingEntry.jsx';
import { AuthorBiography, PineauLayoutReference } from '../shared/CanonicalLayout.jsx';
import JourneyHeader, { useJourneyNavigation } from '../shared/JourneyHeader.jsx';
import JourneyBlockLabel from '../shared/JourneyBlockLabel.jsx';
import JourneyCredits from '../shared/JourneyCredits.jsx';
import { hobsbawmReaderConfig } from '../readerConfigs.js';
import { hobsbawmReadingDocument } from './hobsbawmReadingDocument.js';

const PERIODS = [
  { years: '1914—1945', number: '01', title: 'La era de las catástrofes', kicker: 'Guerra · revolución · crisis', text: 'Dos guerras mundiales, la revolución rusa, la crisis económica y el ascenso de los fascismos desarticulan el mundo del siglo XIX. El progreso deja de parecer una promesa segura.', question: '¿Cómo comprender una época que combina transformación social y destrucción masiva?', events: [['1914', 'La Primera Guerra Mundial abre el siglo corto.'], ['1917', 'La Revolución de Octubre plantea una alternativa al capitalismo.'], ['1929', 'La Gran Depresión sacude la economía mundial.'], ['1945', 'El fin de la guerra reorganiza las relaciones de poder.']], position: '10% 50%', color: 'red' },
  { years: '1947—1973', number: '02', title: 'La edad de oro', kicker: 'Crecimiento · cambios sociales · Guerra Fría', text: 'Una expansión económica sin precedentes transforma el trabajo, la vida cotidiana y las relaciones sociales. El enfrentamiento entre Estados Unidos y la Unión Soviética convive con profundas transformaciones en todo el mundo.', question: '¿Por qué Hobsbawm considera decisiva la velocidad de estos cambios?', events: [['Posguerra', 'El capitalismo inicia una expansión que sorprende a sus contemporáneos.'], ['Transformación', 'La urbanización y los cambios del trabajo modifican la vida social.'], ['Mundo bipolar', 'Las superpotencias ordenan el conflicto político internacional.'], ['1973', 'Se cierra el gran ciclo de crecimiento de la posguerra.']], position: '50% 45%', color: 'gold' },
  { years: '1973—1991', number: '03', title: 'El derrumbamiento', kicker: 'Incertidumbre · desigualdad · fin de un orden', text: 'Las crisis económicas, sociales y políticas afectan a países de distintos sistemas. La disolución de la Unión Soviética cierra el siglo corto y deja un futuro sin mapas seguros.', question: '¿Qué termina en 1991 y qué problemas siguen abiertos?', events: [['Crisis', 'El desempleo y la desigualdad vuelven al centro de la escena.'], ['Interdependencia', 'Una economía cada vez más integrada atraviesa las fronteras.'], ['1989—1991', 'Se desmorona el bloque soviético.'], ['Después', 'El cierre del siglo abre preguntas sobre el futuro.']], position: '90% 50%', color: 'blue' },
];

function Heading({ sectionId, title, children }) {
  return <div className="hb-section-heading journey-section-heading"><div><JourneyBlockLabel sectionId={sectionId} /><h2>{title}</h2>{children && <p className="hb-section-lead">{children}</p>}</div></div>;
}

function ContextCarousel() {
  const [index, setIndex] = useState(0);
  const item = PERIODS[index];
  return <div className="hb-context-carousel">
    <div className="hb-period-tabs" role="group" aria-label="Períodos del siglo XX corto">{PERIODS.map((period, i) => <button key={period.number} type="button" aria-pressed={i === index} onClick={() => setIndex(i)}><span>{period.number}</span><strong>{period.years}</strong><small>{period.title}</small></button>)}</div>
    <article className={`hb-period hb-period--${item.color}`} aria-live="polite" aria-atomic="true">
      <div className="hb-period-visual"><img src="/assets/portada-hobsbawm-historia-siglo-xx.png" alt="" style={{ objectPosition: item.position }} loading="lazy" /><span>{item.years}</span><small>Ilustración del proyecto</small></div>
      <div className="hb-period-copy"><p className="hb-eyebrow">{item.kicker}</p><h3>{item.title}</h3><p>{item.text}</p><ol>{item.events.map(([year, text]) => <li key={year}><strong>{year}</strong><span>{text}</span></li>)}</ol><p className="hb-period-question">{item.question}</p></div>
    </article>
    <div className="hb-carousel-footer"><span>{String(index + 1).padStart(2, '0')} / 03 <span>Una periodización para interpretar el siglo.</span></span><div><button type="button" aria-label="Período anterior" disabled={index === 0} onClick={() => setIndex(index - 1)}><ChevronLeft size={20} /></button><button type="button" aria-label="Período siguiente" disabled={index === PERIODS.length - 1} onClick={() => setIndex(index + 1)}><ChevronRight size={20} /></button></div></div>
  </div>;
}

export default function HobsbawmApp() {
  const { active, progress } = useJourneyNavigation();
  const [toast, setToast] = useState('');
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 3500); return () => clearTimeout(timer); }, [toast]);
  return <div className="hobsbawm-page canonical-page">
    <PineauLayoutReference />
    <a className="hb-skip" href="#lectura">Saltar a la lectura</a>
    <JourneyHeader author="Hobsbawm" title="Historia del siglo XX" active={active} progress={progress} />
    <main>
      <section id="inicio" className="hb-hero"><img className="hb-hero-art" src="/assets/portada-hobsbawm-historia-siglo-xx.png" alt="Collage de guerras, industria, movilizaciones y exploración espacial que representa las tensiones del siglo XX" fetchPriority="high" /><div className="hb-hero-veil" /><div className="hb-hero-copy"><JourneyBlockLabel sectionId="inicio" /><span className="hb-hero-stamp">1914—1991 / EL SIGLO CORTO</span><h1>Historia del<br /><span>siglo XX.</span></h1><p className="hb-hero-subtitle">Vista panorámica del siglo XX</p><p className="hb-hero-question">¿Cómo se cuenta un siglo que transformó el mundo?</p><p className="hb-hero-intro">Doce miradas, tres tiempos y una pregunta por nuestro vínculo con el pasado. Un recorrido para situar al autor, reconstruir su época y leer con el audiolibro.</p><div className="hb-hero-actions"><a className="hb-button" href="#autor">Comenzar el recorrido <ArrowRight size={18} /></a><a className="hb-hero-listen" href="#lectura"><Headphones size={18} /> Ir a la lectura</a></div><div className="hb-hero-meta"><span><Clock3 size={15} /> Audio 49:02</span><span>Texto + contexto</span><span>Sin registro</span></div></div><p className="hb-hero-caption">Una historia de contrastes.<br /><span>Catástrofes, crecimiento e incertidumbre.</span></p></section>
      <section id="autor" className="hb-section hb-author">
        <AuthorBiography name="Eric Hobsbawm" initial="E" role="Historiador · Historia social y económica"
          summary="Historiador británico nacido en Alejandría en 1917. Se formó en Cambridge y enseñó en Birkbeck desde 1947. Sus investigaciones abordaron el capitalismo, las clases trabajadoras y las transformaciones sociales. Su obra enlaza el largo siglo XIX con el corto siglo XX. Vivió los acontecimientos que estudió: una experiencia que vuelve explícita al reflexionar sobre el oficio de historiador y la memoria."
          image="/assets/hobsbawm-retrato-joven.jpg" imageAlt="Retrato de Eric Hobsbawm reproducido en Años interesantes, con encuadre cercano del rostro"
          credit="Retrato reproducido en Años interesantes (Crítica, 2003). Fuente: Wikimedia Commons."
          biographyUrl="https://www.bbk.ac.uk/about-us/obituaries/eric-hobsbawm-magnificent-historian-and-colleague" />
      </section>
      <section id="contexto" className="hb-section hb-context"><div className="hb-shell"><Heading sectionId="contexto" title={<>Un siglo.<br />Tres tiempos.</>}>El siglo corto comienza en 1914 y termina en 1991. Sus límites no siguen el calendario: señalan rupturas históricas.</Heading><ContextCarousel /><div className="hb-author-lens"><span>Una clave de lectura</span><h4>La experiencia personal también tiene historia.</h4><p>Hobsbawm escribe como investigador y como testigo de su tiempo. Reconocer ese lugar ayuda a leer sus preguntas, sus decisiones y su interpretación del pasado.</p></div><aside className="hb-memory-note"><span>1914 <i>↔</i> 1992</span><div><h3>Una fecha, dos Sarajevos.</h3><p>La introducción enlaza el atentado de 1914 con la visita de François Mitterrand a Sarajevo el 28 de junio de 1992. La alusión que muchos no reconocen abre la pregunta del texto: ¿qué sucede cuando se debilitan los vínculos entre presente y pasado?</p><small>Síntesis didáctica a partir de «Vista panorámica del siglo XX».</small></div></aside></div></section>
      <section id="lectura" className="journey-reading hb-material-reading" aria-labelledby="journey-reading-title">
        <IntegratedReader readingDocument={hobsbawmReadingDocument} config={hobsbawmReaderConfig} showToast={setToast} Launcher={HobsbawmReadingEntry} />
      </section>
      <JourneyCredits workId="hobsbawm" />
    </main><div className={`hb-toast ${toast ? 'is-visible' : ''}`} role="status" aria-live="polite">{toast}</div>
  </div>;
}

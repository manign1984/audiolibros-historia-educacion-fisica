import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUpRight, BookOpenText, FileText, Quote, Layers3 } from 'lucide-react';
import JourneyHeader, { useJourneyNavigation } from '../shared/JourneyHeader.jsx';
import JourneyBlockLabel from '../shared/JourneyBlockLabel.jsx';
import JourneyCredits from '../shared/JourneyCredits.jsx';
import { AuthorBiography } from '../shared/CanonicalLayout.jsx';
import TextOnlyReader from '../shared/TextOnlyReader.jsx';
import IntegratedReader from '../IntegratedReader.jsx';
import CanonicalReadingEntry from '../shared/CanonicalReadingEntry.jsx';
import { buildMelanoReadingDocument } from './buildMelanoReadingDocument.js';
import { melanoReaderConfig } from './readerConfig.js';
import './melano.css';

const PORTRAIT = import.meta.env.BASE_URL + 'assets/melano/ignacio-melano-retrato-20261111.jpg';
const HERO_IMAGE = import.meta.env.BASE_URL + 'assets/melano/inicio-archivo-1977.png';
const RESOLUTION_URL = 'https://drive.google.com/file/d/15bo6oZeE9vhYWFbytFNyZCCSvcQGIg0f/view';
const CHAPTER_URL = 'https://drive.google.com/file/d/11kPIjFdMMIAwgfiukL0VenWDqloa10oB/view';
const BIO = 'Ignacio Emmanuel Melano es profesor y licenciado en Educación Física y magíster en Ciencias Sociales y Humanidades por la Universidad Nacional de Quilmes. Su producción académica aborda la historia de la formación de profesores, las culturas escolares y las relaciones entre educación, política y poder. Ha investigado especialmente la trayectoria del Instituto Nacional de Educación Física General Belgrano y sus transformaciones durante la última dictadura y la recuperación democrática.';

const stages = [
  { year: '1967', name: 'El traslado', body: 'El curso de varones del INEF General Belgrano se trasladó a la Capital Federal. La residencia de becarios en San Fernando continuó hasta 1972.' },
  { year: '1977', name: 'El regreso', body: 'La Resolución 543/77 autorizó que divisiones del INEF Buenos Aires funcionaran en San Fernando como anexo.' },
  { year: '1981', name: 'La recreación', body: 'Una resolución ministerial restituyó formalmente el Instituto Nacional de Educación Física General Manuel Belgrano.' },
];

const groups = [
  { name: 'Modernos', desc: 'Vinculados con la Gimnasia Moderna y propuestas pedagógicas abiertas.' },
  { name: 'San Fernandistas', desc: 'Identificados con las tradiciones formativas del instituto de San Fernando.' },
  { name: 'Juramentados', desc: 'Egresados que ampliaron su formación en ámbitos militares y ocuparon posiciones de poder.' },
];

function Inicio() {
  return <section id="inicio" className="melano-screen melano-hero" aria-labelledby="melano-title">
    <div className="melano-hero__layout">
      <img
        className="melano-hero__image"
        src={HERO_IMAGE}
        alt="Composición con la Resolución 543 de 1977, una fotografía del predio de San Fernando y el distintivo del INEF General Belgrano"
        width={2048}
        height={841}
        fetchPriority="high"
      />
      <div className="melano-hero__copy">
        <JourneyBlockLabel sectionId="inicio" />
        <p className="melano-eyebrow">Ignacio Melano <span aria-hidden="true">/</span> Capítulo 6 · EdUNLu</p>
        <h1 id="melano-title">Militares al gobierno,<span>juramentados al poder</span></h1>
        <p className="melano-hero__subtitle">La reapertura del INEF Gral. Belgrano en la década del 70</p>
        <p className="melano-hero__intro">En 1967, el curso de varones del INEF General Belgrano fue trasladado a Capital Federal. Diez años después la formación de profesores regresó al predio de San Fernando, esta vez como anexo del INEF Buenos Aires y durante la última dictadura. ¿Qué actores, tradiciones y vínculos de poder hicieron posible ese retorno?</p>
        <a className="melano-hero__next" href="#autor">Comenzar el recorrido <ArrowDown size={19} aria-hidden="true" /></a>
      </div>
    </div>
  </section>;
}

function Autor() {
  return <section id="autor" className="melano-screen melano-author" aria-label="Sobre Ignacio Melano">
    <AuthorBiography
      name="Ignacio Melano"
      initial="I"
      role="Historia de la Educación Física · Formación docente"
      summary={BIO}
      image={PORTRAIT}
      imageAlt="Retrato de Ignacio Melano"
      credit="Retrato facilitado para esta página."
      biographyUrl="https://periodicos.uepa.br/index.php/cocar/article/view/4871"
    />
  </section>;
}

function Contexto() {
  return <section id="contexto" className="melano-contexto" aria-label="Coordenadas históricas y lectura de fuentes">
    <div className="melano-screen melano-context-screen melano-context-one">
      <div className="melano-container melano-context-inner">
        <div className="melano-context-top">
          <JourneyBlockLabel sectionId="contexto" />
          <span>01 / 02 · Coordenadas históricas</span>
        </div>
        <div className="melano-context-heading">
          <p className="melano-eyebrow">Una institución, tres momentos diferentes</p>
          <h2>¿Qué significó <em>volver</em> a San Fernando?</h2>
          <p>El regreso al antiguo predio no fue un simple movimiento de estudiantes. Para comprenderlo hay que distinguir los cambios administrativos de las tradiciones y las redes de poder.</p>
        </div>
        <div className="melano-stages">
          {stages.map((stage, index) => <article key={stage.year} className="melano-stage">
            <div className="melano-stage__head"><span>{stage.year}</span><small>0{index + 1}</small></div>
            <h3>{stage.name}</h3>
            <p>{stage.body}</p>
          </article>)}
        </div>
        <div className="melano-groups" aria-label="Tres denominaciones presentes en el capítulo">
          {groups.map(group => <div key={group.name}><strong>{group.name}</strong><span>{group.desc}</span></div>)}
        </div>
        <p className="melano-question">¿Por qué el regreso no puede explicarse únicamente como una decisión administrativa?</p>
      </div>
    </div>
    <div className="melano-screen melano-context-screen melano-context-two">
      <div className="melano-container melano-context-inner">
        <div className="melano-context-top">
          <JourneyBlockLabel sectionId="contexto" />
          <span>02 / 02 · Interrogar las fuentes</span>
        </div>
        <div className="melano-context-heading">
          <p className="melano-eyebrow">Dos registros sobre un mismo proceso</p>
          <h2>Dos fuentes, <em>una reapertura</em></h2>
          <p>El documento administrativo señala qué se autorizó. Un testimonio de época permite aproximarnos a cómo algunos protagonistas recordaban y justificaban el retorno.</p>
        </div>
        <div className="melano-sources">
          <article className="melano-source-card">
            <div className="melano-source-card__head"><FileText size={22} aria-hidden="true"/><span>Documento estatal · 1977</span></div>
            <p className="melano-source-card__number">543/77</p>
            <h3>La resolución ministerial</h3>
            <p>El 11 de abril de 1977 se autorizó el funcionamiento de divisiones del INEF Buenos Aires en las instalaciones del Centro Nacional de Educación Física N.º 13, en San Fernando.</p>
            <a href={RESOLUTION_URL} target="_blank" rel="noreferrer">Consultar documento original <ArrowUpRight size={16} aria-hidden="true"/></a>
          </article>
          <article className="melano-source-card melano-source-card--quote">
            <div className="melano-source-card__head"><Quote size={22} aria-hidden="true"/><span>Testimonio · 1978</span></div>
            <blockquote>«¡No volvemos a un lugar, volvemos a un espíritu!»</blockquote>
            <h3>Juan Carlos Cutrera</h3>
            <p>Fragmento de la entrevista publicada en <em>En Movimiento</em> y reproducida en el capítulo de Melano. Expresa una memoria institucional situada, no una descripción neutral de los hechos.</p>
            <a href={CHAPTER_URL} target="_blank" rel="noreferrer">Consultar capítulo, pág. 146 <ArrowUpRight size={16} aria-hidden="true"/></a>
          </article>
        </div>
        <div className="melano-reading-key">
          <div><Layers3 size={23} aria-hidden="true"/><strong>Documento, testimonio e interpretación</strong></div>
          <p>Una autorización no demuestra por sí sola que se haya reconstruido la antigua cultura escolar. Esa relación es una pregunta histórica que el autor investiga a partir de varias fuentes.</p>
        </div>
        <p className="melano-question">¿Qué diferencia hay entre autorizar una institución y reconstruir su identidad?</p>
      </div>
    </div>
  </section>;
}


// Conservar las notas y el progreso del lector textual anterior sin sobrescribirlos.
// La nueva modalidad usa claves independientes y migra una sola vez si hace falta.
function migrateMelanoTextReaderState(data) {
  try {
    const oldNotes = JSON.parse(localStorage.getItem('melano-juramentados-text-notes-v1') || '[]');
    const newNotesKey = melanoReaderConfig.storage.notesKey;
    if (localStorage.getItem(newNotesKey) === null && Array.isArray(oldNotes) && oldNotes.length) {
      const firstParagraph = data.document.sections[0]?.paragraphs[0]?.id;
      const converted = oldNotes.filter(note => typeof note?.text === 'string' && Number.isInteger(note.page))
        .map(note => ({
          id: note.id,
          sentenceId: data.legacyPageMap[note.page] || firstParagraph,
          text: note.text,
          originalPage: note.page + 1,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
        })).filter(note => note.sentenceId);
      if (converted.length) localStorage.setItem(newNotesKey, JSON.stringify(converted));
    }
    if (localStorage.getItem(melanoReaderConfig.storage.stateKey) === null) {
      const previousPage = JSON.parse(localStorage.getItem('melano-juramentados-text-page-v1') || '0');
      const paragraphId = data.legacyPageMap[previousPage];
      const timing = data.paragraphTimings.find(item => item.id === paragraphId);
      if (Number.isFinite(timing?.start)) {
        localStorage.setItem(melanoReaderConfig.storage.stateKey, JSON.stringify({
          currentTime: timing.start, playbackRate: 1, volume: 1, followText: true, fontScale: 1,
        }));
      }
    }
  } catch {
    // El modo de lectura continúa funcionando si se bloquea el almacenamiento.
  }
}

export default function MelanoApp() {
  const { active, progress } = useJourneyNavigation();
  const [toast, setToast] = useState('');
  const [readerData, setReaderData] = useState(null);
  const [audioReaderError, setAudioReaderError] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    const fetchText = async (path) => {
      const response = await fetch(import.meta.env.BASE_URL + path, { signal: controller.signal });
      if (!response.ok) throw new Error('No se pudo cargar ' + path);
      return response.text();
    };
    Promise.all([
      fetchText('assets/melano/texto-academico.txt'),
      fetchText('assets/melano/subtitulos.srt'),
    ]).then(([academic, subtitles]) => {
      if (controller.signal.aborted) return;
      const data = buildMelanoReadingDocument(academic, subtitles);
      migrateMelanoTextReaderState(data);
      setReaderData(data);
    }).catch(error => {
      if (error.name !== 'AbortError') setAudioReaderError(true);
    });
    return () => controller.abort();
  }, []);

  const integratedConfig = readerData ? {
    ...melanoReaderConfig,
    sync: { ...melanoReaderConfig.sync, paragraphTimings: readerData.paragraphTimings },
  } : null;

  return <div className="melano-page">
    <a className="melano-skip" href="#lectura">Saltar a la lectura</a>
    <JourneyHeader author="Melano" title="Juramentados al poder" active={active} progress={progress} />
    <main className="melano-main">
      <Inicio />
      <Autor />
      <Contexto />
      <section id="lectura" className="melano-screen melano-reading hb-material-reading" aria-labelledby="journey-reading-title">
        {readerData
          ? <IntegratedReader
              config={integratedConfig}
              readingDocument={readerData.document}
              Launcher={CanonicalReadingEntry}
              showToast={setToast}
            />
          : <TextOnlyReader
              config={{ ...melanoReaderConfig, textOnly: true,
                storage: { notesKey: 'melano-juramentados-text-notes-v1', stateKey: 'melano-juramentados-text-page-v1' } }}
              showToast={setToast}
            />}
        {audioReaderError && <p className="melano-reader-error" role="status">No se pudo iniciar la reproducción integrada. La lectura del texto y el cuaderno siguen disponibles.</p>}
      </section>
    </main>
    <JourneyCredits workId="melano" />
    <span className="melano-toast" role="status" aria-live="polite">{toast}</span>
  </div>;
}

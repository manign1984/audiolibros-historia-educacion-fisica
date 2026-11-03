import { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import AisensteinInicioPreview from './InicioPreview.jsx';
import IntegratedReader from '../IntegratedReader.jsx';
import CanonicalReadingEntry from '../shared/CanonicalReadingEntry.jsx';
import { AuthorBiography } from '../shared/CanonicalLayout.jsx';
import JourneyBlockLabel from '../shared/JourneyBlockLabel.jsx';
import JourneyCredits from '../shared/JourneyCredits.jsx';
import { aisensteinReaderConfig } from '../readerConfigs.js';
import { aisensteinReadingDocument } from './aisensteinReadingDocument.js';
import './aisenstein.css';

const LENSES = [
  {
    number: '01', label: 'Prácticas corporales', tag: 'Historia social',
    title: 'Las actividades físicas también tienen historia.',
    detail: 'El primer objeto de estudio que presenta Aisenstein son las actividades físicas lúdicas, competitivas o vinculadas al trabajo. Su análisis requiere situarlas en los diferentes grupos sociales, tiempos y culturas.',
    question: '¿Qué prácticas encontramos, quiénes podían realizarlas y qué diferencias sociales dejan ver?',
    clues: ['Juegos, ejercicios y deportes', 'Trabajo, ocio y relaciones sociales', 'Continuidades y transformaciones'],
  },
  {
    number: '02', label: 'El campo de saberes', tag: 'Historia de una disciplina',
    title: 'Nada nace como una disciplina terminada.',
    detail: 'Una segunda perspectiva estudia cómo la Educación Física se constituyó como disciplina: un conjunto de conocimientos y teorías que explican, organizan y justifican las actividades físicas y deportivas.',
    question: '¿Cómo se construyen los saberes que llegan a considerarse legítimos?',
    clues: ['Teorías y discursos en disputa', 'Instituciones y especialistas', 'Definiciones cambiantes del campo'],
  },
  {
    number: '03', label: 'La asignatura escolar', tag: 'Historia del currículum',
    title: 'La escuela selecciona qué cuerpos educar y cómo hacerlo.',
    detail: 'La tercera vía de investigación se centra en la Educación Física como materia escolar: sus propósitos, programas, contenidos y las disputas que contribuyeron a darle un lugar en la escuela.',
    question: '¿Quién decide qué se enseña y qué intereses entran en juego en esa elección?',
    clues: ['Planes y programas de enseñanza', 'Estado, escuela y actores sociales', 'Tensiones entre propuestas y prácticas'],
  },
];

function ContextLenses() {
  const [active, setActive] = useState(0);
  const item = LENSES[active];
  return <section id="contexto" className="aisenstein-context tracked-section" aria-labelledby="aisenstein-context-title">
    <div className="aisenstein-context__inner">
      <div className="aisenstein-context__heading">
        <JourneyBlockLabel sectionId="contexto" />
        <p className="aisenstein-context__kicker">Tres maneras de estudiar la historia</p>
        <h2 id="aisenstein-context-title">El pasado no se borra.<br /><em>Se interroga.</em></h2>
        <p>El texto no propone una sucesión de fechas: distingue objetos de investigación y plantea para qué sirve construir conocimiento histórico en la formación docente.</p>
      </div>
      <div className="aisenstein-context__stage">
        <div className="aisenstein-context__tabs" role="tablist" aria-label="Perspectivas de investigación histórica">
          {LENSES.map((lens, index) => <button key={lens.number} id={'aisenstein-tab-' + index} role="tab" type="button"
            aria-selected={active === index} aria-controls="aisenstein-tab-panel"
            className={active === index ? 'is-active' : undefined} onClick={() => setActive(index)}>
            <span>{lens.number}</span><strong>{lens.label}</strong><ArrowRight size={17} aria-hidden="true" />
          </button>)}
        </div>
        <article id="aisenstein-tab-panel" className="aisenstein-context__panel" role="tabpanel"
          aria-labelledby={'aisenstein-tab-' + active} key={active}>
          <span className="aisenstein-context__panel-index" aria-hidden="true">{item.number}</span>
          <p className="aisenstein-context__panel-tag">{item.tag}</p>
          <h3>{item.title}</h3>
          <p>{item.detail}</p>
          <div className="aisenstein-context__question"><small>Una pregunta para leer</small><strong>{item.question}</strong></div>
          <ul>{item.clues.map((clue) => <li key={clue}>{clue}</li>)}</ul>
          <div className="aisenstein-context__switch">
            <span>Perspectiva {active + 1} de 3</span>
            <div><button type="button" aria-label="Perspectiva anterior" disabled={active === 0} onClick={() => setActive((value) => value - 1)}><ChevronLeft size={20}/></button>
            <button type="button" aria-label="Perspectiva siguiente" disabled={active === LENSES.length - 1} onClick={() => setActive((value) => value + 1)}><ChevronRight size={20}/></button></div>
          </div>
        </article>
      </div>
      <div className="aisenstein-context__reflection">
        <div><span>Una idea para llevar a la lectura</span><h3>Conciencia histórica</h3></div>
        <p>Aprender historia no consiste solamente en acumular datos del pasado. Aisenstein retoma la noción de conciencia histórica para pensar cómo interpretamos las experiencias anteriores, comprendemos el presente y nos orientamos hacia el futuro.</p>
        <p className="aisenstein-context__reflection-question">¿Qué ideas sobre la Educación Física consideramos naturales porque olvidamos cómo llegaron a construirse?</p>
      </div>
    </div>
  </section>;
}

export default function AisensteinApp() {
  const [toast, setToast] = useState('');
  useEffect(() => { if (!toast) return undefined; const timer = window.setTimeout(() => setToast(''), 3200); return () => window.clearTimeout(timer); }, [toast]);
  return <AisensteinInicioPreview>
    <div className="aisenstein-sections canonical-page">
      <section id="autor" className="aisenstein-author tracked-section">
        <AuthorBiography
          name="Ángela Aisenstein" initial="A"
          role="Investigadora · Historia de la Educación Física y formación docente"
          summary="Profesora de Educación Física y licenciada en Ciencias de la Educación por la UBA. Es magíster en Ciencias Sociales con orientación en Educación por FLACSO Argentina y doctora en Educación por la Universidad de San Andrés. Sus investigaciones abordan la historia de la Educación Física escolar, la construcción de sus saberes y la formación de docentes."
          image="https://images.udesa.edu.ar/sites/default/files/styles/square_l/public/migrated/professor/professor_aed0e000f1b9c21c4e29df193941dcd3.jpg?itok=5CPwhbRf"
          imageAlt="Retrato de Ángela Aisenstein, profesora e investigadora"
          credit="Fotografía: perfil académico de la Universidad de San Andrés. Imagen en blanco y negro por presentación CSS."
          biographyUrl="https://udesa.edu.ar/cuerpo-docente/angela-aisenstein"
        />
      </section>
      <ContextLenses />
      <section id="lectura" className="aisenstein-reading journey-reading hb-material-reading tracked-section" aria-labelledby="journey-reading-title">
        <IntegratedReader readingDocument={aisensteinReadingDocument} config={aisensteinReaderConfig}
          showToast={setToast} Launcher={CanonicalReadingEntry} />
      </section>
      <JourneyCredits workId="aisenstein" />
      <div className={'aisenstein-toast' + (toast ? ' is-visible' : '')} role="status" aria-live="polite">{toast}</div>
    </div>
  </AisensteinInicioPreview>;
}

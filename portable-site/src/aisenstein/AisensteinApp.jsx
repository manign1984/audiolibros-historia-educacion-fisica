import { useEffect, useState } from 'react';
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
  return <section id="contexto" className="aisenstein-context tracked-section" aria-label="Contexto de la obra">
    <div className="aisenstein-context__screen aisenstein-context__screen--research" aria-labelledby="aisenstein-context-title">
      <div className="aisenstein-context__screen-inner">
        <div className="aisenstein-context__heading">
          <div className="aisenstein-context__heading-primary">
            <JourneyBlockLabel sectionId="contexto" />
            <p className="aisenstein-context__kicker">Primera mirada · Objetos de investigación</p>
            <h2 id="aisenstein-context-title">Tres objetos<br /><em>de investigación.</em></h2>
          </div>
          <div className="aisenstein-context__heading-secondary">
            <p>Aisenstein propone tres objetos para investigar históricamente la Educación Física. Cada uno permite formular preguntas diferentes sobre las prácticas, los saberes y la escuela.</p>
          </div>
        </div>
        <div className="aisenstein-context__objects" aria-label="Tres objetos de investigación histórica">
          {LENSES.map((item) => <article className="aisenstein-context__object" key={item.number}>
            <div className="aisenstein-context__object-top">
              <span className="aisenstein-context__object-number">{item.number}</span>
              <span className="aisenstein-context__object-tag">{item.tag}</span>
            </div>
            <p className="aisenstein-context__object-name">{item.label}</p>
            <h3>{item.title}</h3>
            <p className="aisenstein-context__object-detail">{item.detail}</p>
            <div className="aisenstein-context__object-question">
              <span>Para pensar</span>
              <p>{item.question}</p>
            </div>
          </article>)}
        </div>
      </div>
    </div>
    <div className="aisenstein-context__screen aisenstein-context__screen--conscience" aria-labelledby="aisenstein-conscience-title">
      <div className="aisenstein-context__screen-inner">
        <div className="aisenstein-context__conscience-top">
          <div>
            <p className="aisenstein-context__kicker">Segunda mirada · Conciencia histórica</p>
            <h2 id="aisenstein-conscience-title">Conciencia<br /><em>histórica.</em></h2>
          </div>
          <div className="aisenstein-context__conscience-intro">
            <p>Aprender historia no consiste solamente en acumular datos del pasado. Aisenstein retoma la noción de conciencia histórica para pensar cómo interpretamos las experiencias anteriores, comprendemos el presente y nos orientamos hacia el futuro.</p>
          </div>
        </div>
        <div className="aisenstein-context__time-axes" aria-label="Relación entre pasado, presente y futuro">
          <div><span>01</span><h3>Pasado</h3><p>Interpretar experiencias y procesos históricos.</p></div>
          <div><span>02</span><h3>Presente</h3><p>Interrogar lo que hoy consideramos natural.</p></div>
          <div><span>03</span><h3>Futuro</h3><p>Reconocer posibilidades de transformación.</p></div>
        </div>
        <div className="aisenstein-context__conscience-question">
          <p>Una pregunta para llevar a la lectura</p>
          <blockquote>¿Qué ideas sobre la Educación Física consideramos naturales porque olvidamos cómo llegaron a construirse?</blockquote>
        </div>
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
          credit="Fotografía: perfil académico de la Universidad de San Andrés."
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

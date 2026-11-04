import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import JourneyHeader, { useJourneyNavigation } from '../shared/JourneyHeader.jsx';
import JourneyBlockLabel from '../shared/JourneyBlockLabel.jsx';
import CanonicalReadingEntry from '../shared/CanonicalReadingEntry.jsx';
import JourneyCredits from '../shared/JourneyCredits.jsx';
import IntegratedReader from '../IntegratedReader.jsx';
import { marcaidaReaderConfig } from './readerConfig.js';
import readingDocument from './reading-document.json';
import './marcaida.css';

const authors = [
  { initials: 'EM', name: 'Elena Marcaida', field: 'Historia económica y social · Docencia universitaria', summary: 'Profesora de Historia Económica y Social General y de Conocimiento de la Sociedad y el Estado en el Ciclo Básico Común de la UBA, donde desarrolló su actividad docente desde 1985. Coordinó equipos de enseñanza y participó en publicaciones de historia económica y social, incluida la coordinación de Estudios de historia económica y social.', url: 'https://www.pagina12.com.ar/diario/universidad/10-195385-2012-06-01.html', source: 'Reseña de su trayectoria docente · Página/12, 2012' },
  { initials: 'MS', name: 'Mabel Scaltritti', field: 'Historia y enseñanza de las ciencias sociales', summary: 'Licenciada en Historia por la Universidad de París VII y docente del Ciclo Básico Común de la UBA. Integró el área de Ciencias Sociales del Ministerio de Educación, dedicada a la producción curricular y a la formación docente. Participó en la elaboración y supervisión pedagógica de Cuadernos para el aula y publicó trabajos sobre historia argentina.', url: 'https://www.bnm.me.gov.ar/giga1/documentos/EL001102.pdf', source: 'Cuadernos para el aula · Ministerio de Educación' },
];

const mechanisms = [
  { label: 'Fuerza', detail: 'Ejército y control territorial.', evidence: 'Rebeliones provinciales y campañas contra pueblos indígenas.', tone: 'rust' },
  { label: 'Alianzas', detail: 'Subsidios, cargos y cooptación.', evidence: 'Apoyos selectivos de dirigentes provinciales.', tone: 'petrol' },
  { label: 'Instituciones', detail: 'Recursos fiscales, justicia e infraestructura.', evidence: 'Normas, ferrocarril y telégrafo.', tone: 'petrol' },
  { label: 'Legitimidad', detail: 'Educación y pertenencia nacional.', evidence: 'Un proceso que el texto desarrolla también después de 1880.', tone: 'petrol' },
];

function ContextHeader({ number, title, children, id }) {
  return <header className="ms-context-heading">
    <div className="ms-context-top"><JourneyBlockLabel sectionId="contexto" /><p>Mirada {number} de 3</p></div>
    <h2 id={id}>{title}</h2><p className="ms-lead">{children}</p>
  </header>;
}

function ContextQuestion({ children, source }) {
  return <footer className="ms-context-foot"><p className="ms-question">{children}</p><p className="ms-source">Elaboración didáctica basada en {source}. No es una cita textual.</p></footer>;
}

export default function MarcaidaApp() {
  const { active, progress } = useJourneyNavigation();
  const [toast, setToast] = useState('');
  return <div className="marcaida-page">
    <a className="ms-skip" href="#lectura">Saltar a la lectura</a>
    <JourneyHeader author="Marcaida · Scaltritti" title="La construcción del Estado nacional" active={active} progress={progress} />
    <main className="ms-main">
      <section id="inicio" className="ms-screen ms-hero" aria-labelledby="ms-title">
        <div className="ms-inner ms-hero-inner">
          <div className="ms-hero-top"><JourneyBlockLabel sectionId="inicio" /><span className="ms-edition-state">Edición en revisión</span></div>
          <div className="ms-hero-grid">
            <div className="ms-hero-copy">
              <p className="ms-byline">Elena Marcaida / Mabel Scaltritti</p>
              <h1 id="ms-title">La construcción<br />del Estado<br /><em>nacional argentino.</em></h1>
              <p className="ms-hero-question">¿Cómo se construye una autoridad nacional?</p>
              <p className="ms-hero-intro">Conflictos, alianzas y transformaciones económicas en la formación del Estado. Un recorrido para situar el problema, leer el capítulo y construir preguntas propias.</p>
            </div>
            <figure className="ms-hero-figure">
              <img src="/assets/marcaida-tramas.svg" alt="Diagrama editorial de líneas que convergen y se entrecruzan: una representación conceptual de conflictos, alianzas e instituciones." width="640" height="610" fetchPriority="high" />
              <figcaption>Tramas de una construcción · Ilustración editorial del proyecto.</figcaption>
            </figure>
          </div>
          <div className="ms-hero-bottom"><p><strong>1852–1880</strong><span>Capítulo académico · Cuatro apartados y bibliografía</span></p><p>Lectura y anotaciones disponibles.<br />Sincronización con la voz en revisión.</p></div>
        </div>
      </section>

      <section id="autor" className="ms-screen ms-authors" aria-label="Autoría del capítulo">
        <div className="ms-inner ms-author-inner">
          <header className="ms-author-heading"><JourneyBlockLabel sectionId="autor" /><p>Dos trayectorias, una lectura compartida.</p></header>
          <div className="ms-author-grid">{authors.map(author => <article className="ms-author" key={author.initials}>
            <span className="ms-author-monogram" aria-hidden="true">{author.initials}</span>
            <h2>{author.name}</h2><p className="ms-author-field">{author.field}</p><p className="ms-author-summary">{author.summary}</p>
            <a href={author.url} target="_blank" rel="noreferrer">Ver fuente biográfica <ExternalLink size={15} aria-hidden="true" /></a><p className="ms-source">{author.source}</p>
          </article>)}</div>
        </div>
      </section>

      <section id="contexto" className="ms-context" aria-label="Contexto de la lectura: tres miradas">
        <div id="contexto-1" className="ms-screen ms-context-screen" aria-labelledby="ms-context-1">
          <div className="ms-inner ms-context-inner">
            <ContextHeader number="1" id="ms-context-1" title="Una unidad en disputa.">Después de Caseros, organizar un poder nacional siguió siendo un problema abierto. Los conflictos por recursos y dirección política atravesaron la construcción de la unidad.</ContextHeader>
            <div className="ms-process">
              <div className="ms-process-division"><h3>1852–1861</h3><div className="ms-lanes"><div><h4>Buenos Aires</h4><p>Puerto, aduana y mayor capacidad de recursos.</p></div><div><h4>Confederación</h4><p>Un proyecto nacional con recursos insuficientes y apoyos regionales.</p></div></div><p className="ms-early-dates"><strong>1852</strong> Caseros<br /><strong>1853</strong> Constitución y persistencia de la separación política.</p></div>
              <div className="ms-process-concentration"><h3>1861–1880</h3><ol className="ms-timeline">
                <li><strong>1861</strong><span>Pavón</span></li><li><strong>1862–1880</strong><span>Expansión de capacidades estatales</span></li><li><strong>1879</strong><span>Campaña militar contra pueblos indígenas</span></li><li><strong>1880</strong><span>Derrota de la resistencia bonaerense y federalización</span></li>
              </ol><p className="ms-process-reading">La concentración de autoridad encontró resistencias y se vinculó con alianzas y transformaciones económicas. La violencia contra los pueblos indígenas forma parte de este proceso.</p></div>
            </div>
            <ContextQuestion source="la introducción y los apartados 1–3">¿Qué permite pasar de un acuerdo sobre la unidad a un poder capaz de ejercerla?</ContextQuestion>
          </div>
        </div>
        <div id="contexto-2" className="ms-screen ms-context-screen ms-context-mechanisms" aria-labelledby="ms-context-2">
          <div className="ms-inner ms-context-inner">
            <ContextHeader number="2" id="ms-context-2" title="Construir autoridad.">La represión, las alianzas, las normas y las obras públicas actuaron de manera combinada. Reconocer sus relaciones permite preguntar cómo se impuso la autoridad y qué apoyos obtuvo.</ContextHeader>
            <div className="ms-mechanisms"><ul>{mechanisms.map(item => <li key={item.label} className={`ms-mechanism ms-mechanism--${item.tone}`}><h3>{item.label}</h3><p className="ms-mechanism-detail">{item.detail}</p><p>{item.evidence}</p></li>)}</ul><p className="ms-relations">Mecanismos combinados · No etapas sucesivas</p></div>
            <ContextQuestion source="el apartado 3">¿Por qué la fuerza, por sí sola, no explica la consolidación del Estado?</ContextQuestion>
          </div>
        </div>
        <div id="contexto-3" className="ms-screen ms-context-screen ms-context-interpretation" aria-labelledby="ms-context-3">
          <div className="ms-inner ms-context-inner">
            <ContextHeader number="3" id="ms-context-3" title="Modernizar desde arriba.">Las autoras reúnen interpretaciones sobre el Estado como organizador de la sociedad. La modernización económica convivió con una fuerte concentración del poder.</ContextHeader>
            <div className="ms-counterpoint"><div className="ms-counterpoint-head"><h3>Transformaciones</h3><h3>Distribución del poder</h3></div><dl>
              <div><dt>Infraestructura e instituciones</dt><dd>Concentración de tierra y decisiones</dd></div><div><dt>Pertenencia nacional</dt><dd>Desigual incorporación de grupos</dd></div><div><dt>Autoridad estatal</dt><dd>Conflicto y resistencia</dd></div>
            </dl></div>
            <p className="ms-education-bridge">La escuela aparece como un espacio de pertenencia y legitimación. Esta lectura prepara preguntas para estudiar luego la Educación Física escolar; no reconstruye por sí sola su historia.</p>
            <ContextQuestion source="el apartado 4 y los pasajes educativos del apartado 3">¿Qué relaciones entre Estado, sociedad y educación conviene investigar?</ContextQuestion>
          </div>
        </div>
      </section>

      <section id="lectura" className="ms-screen ms-reading hb-material-reading" aria-labelledby="journey-reading-title">
        <IntegratedReader readingDocument={readingDocument} config={marcaidaReaderConfig} showToast={setToast} Launcher={CanonicalReadingEntry} />
      </section>
      <JourneyCredits workId="marcaida" />
    </main>
    <span className="ms-toast" role="status" aria-live="polite">{toast}</span>
  </div>;
}

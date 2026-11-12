import JourneyHeader, { useJourneyNavigation } from '../shared/JourneyHeader.jsx';
import JourneyBlockLabel from '../shared/JourneyBlockLabel.jsx';
import JourneyCredits from '../shared/JourneyCredits.jsx';
import { AuthorBiography } from '../shared/CanonicalLayout.jsx';
import IntegratedReader from '../IntegratedReader.jsx';
import CanonicalReadingEntry from '../shared/CanonicalReadingEntry.jsx';
import { almadaReaderConfig, almadaReadingDocument, almadaLegacyPageMap } from './readerContract.js';
import './almada.css';


// Conservación no destructiva del cuaderno y progreso del lector textual previo.
// Ejecutar antes de montar IntegratedReader: el componente lee localStorage en su inicialización.
function migrateAlmadaTextReaderState() {
  try {
    const oldNotes = JSON.parse(localStorage.getItem('almada-privilegiados-text-notes-v1') || '[]');
    const newNotesKey = almadaReaderConfig.storage.notesKey;
    if (localStorage.getItem(newNotesKey) === null && Array.isArray(oldNotes) && oldNotes.length) {
      const first = almadaReadingDocument.sections[0].paragraphs[0]?.id;
      const converted = oldNotes.filter(note => typeof note?.text === 'string' && note.text.trim() && Number.isInteger(note.page))
        .map(note => ({
          id: typeof note.id === 'string' ? note.id : String(note.page) + '-' + String(note.createdAt || ''),
          sentenceId: almadaLegacyPageMap[note.page] || first,
          text: note.text,
          originalPage: note.page + 1,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
        })).filter(note => note.sentenceId);
      if (converted.length) localStorage.setItem(newNotesKey, JSON.stringify(converted));
    }
    const newStateKey = almadaReaderConfig.storage.stateKey;
    if (localStorage.getItem(newStateKey) === null) {
      const page = Number(JSON.parse(localStorage.getItem('almada-privilegiados-text-page-v1') || '0'));
      const timing = almadaReaderConfig.sync.paragraphTimings.find(item => item.id === almadaLegacyPageMap[page]);
      const currentTime = Number.isFinite(timing?.start) ? timing.start
        : page >= 14 ? 1423.316 : 0;
      localStorage.setItem(newStateKey, JSON.stringify({
        currentTime, playbackRate: 1, volume: 1, followText: true, fontScale: 1,
      }));
    }
  } catch {
    // El lector permanece disponible si el navegador restringe almacenamiento local.
  }
}
if (typeof window !== 'undefined') migrateAlmadaTextReaderState();

export default function AlmadaApp() {
  const { active, progress } = useJourneyNavigation();

  return (
    <div className="almada-page">
      <a className="almada-skip" href="#lectura">Saltar a la lectura</a>
      <JourneyHeader
        author="Almada"
        title="Los privilegiados en la Nueva Argentina"
        active={active}
        progress={progress}
      />
      <main>
        <section id="inicio" className="almada-hero" aria-labelledby="almada-title">
          <div className="almada-wrap almada-hero-grid">
            <div className="almada-hero-copy">
              <JourneyBlockLabel sectionId="inicio" />
              <p className="almada-author-name">Cecilia Almada</p>
              <h1 id="almada-title">Los privilegiados en la <em>Nueva Argentina</em></h1>
              <p className="almada-subtitle">La cultura física y el deporte en la política del peronismo</p>
              <p className="almada-hero-intro">Una lectura para comprender por qué el deporte infantil pasó a ocupar un lugar en las políticas de salud y ciudadanía del primer peronismo.</p>
              <p className="almada-edition">Artículo completo · HistELA, 2020</p>
            </div>
            <figure className="almada-hero-photo">
              <img
                src={import.meta.env.BASE_URL + 'assets/almada/campeonato-infantil.webp'}
                alt="Eva Perón da el puntapié inicial en un campeonato de fútbol infantil, rodeada por jugadores y asistentes."
                width="940"
                height="841"
                fetchPriority="high"
              />
              <figcaption>Campeonato de fútbol infantil. Archivo General de la Nación, Fondo Secretaría de Informaciones.</figcaption>
            </figure>
          </div>
        </section>

        <section id="autor" className="almada-author" aria-label="Cecilia Almada">
          <AuthorBiography
            name="Cecilia Almada"
            initial="C"
            role="Investigadora en Historia de la Educación"
            summary="Cecilia Almada es doctora en Educación por la Universidad de San Andrés. Sus investigaciones abordan la historia de la educación alimentaria, la cultura física y las políticas dirigidas a las infancias en la Argentina. En sus trabajos sobre el primer peronismo estudia la acción de la Fundación Eva Perón y la relación entre el deporte, la salud y la ampliación de derechos."
            image={import.meta.env.BASE_URL + 'assets/almada/almada-monograma.webp'}
            imageAlt="Composición tipográfica con las iniciales de Cecilia Almada."
            credit="Monograma editorial de +TEC UNAHUR."
            biographyUrl="https://www.memoria.fahce.unlp.edu.ar/perfiles/2087AlmadaC.html"
          />
        </section>

        <section id="contexto" aria-labelledby="almada-context-title">
          <div className="almada-context almada-context-policy">
            <div className="almada-wrap almada-context-content">
              <JourneyBlockLabel sectionId="contexto" />
              <h2 id="almada-context-title">La cultura física como política pública</h2>
              <p className="almada-context-lead">Durante el primer peronismo (1946–1955), la educación corporal se extendió a clubes, certámenes e instalaciones deportivas. Almada sigue a las instituciones que intervinieron y examina qué buscaba cada una.</p>
              <dl className="almada-institutions">
                <div><dt>Educación</dt><dd>La escuela vinculó los ejercicios corporales con la higiene y la formación de hábitos.</dd></div>
                <div><dt>Salud Pública</dt><dd>Los controles médicos y la medicina del deporte ampliaron el alcance de la política sanitaria.</dd></div>
                <div><dt>Fundación Eva Perón</dt><dd>Las obras y los campeonatos extendieron la práctica deportiva fuera de la escuela.</dd></div>
              </dl>
              <p className="almada-question">¿Cómo se vinculó la ampliación del acceso al deporte con el tipo de ciudadanía que se buscaba formar?</p>
            </div>
          </div>

          <div className="almada-context almada-context-tournaments">
            <div className="almada-wrap almada-context-content">
              <h2>Campeonatos Evita</h2>
              <p className="almada-context-lead">La revisación médica era un requisito para inscribirse. Almada analiza esa práctica a partir de los testimonios de participantes y de las ideas sanitarias de la época.</p>
              <div className="almada-perspectives">
                <article>
                  <h3>Acceso a la salud</h3>
                  <p>El examen acercó la atención médica a niñas, niños y jóvenes de sectores que habían tenido poco contacto con los servicios sanitarios.</p>
                </article>
                <article>
                  <h3>Evaluación y seguimiento</h3>
                  <p>Los controles permitieron reunir datos sobre la población infantil. La autora vincula ese interés con las ideas eugenésicas que circulaban entre funcionarios y médicos.</p>
                </article>
              </div>
              <p className="almada-question">Al leer los testimonios, identificá qué valor le daban las familias al examen y cómo lo interpreta Almada.</p>
            </div>
          </div>
        </section>

        <section id="lectura" className="journey-reading hb-material-reading" aria-labelledby="journey-reading-title">
          <IntegratedReader readingDocument={almadaReadingDocument} config={almadaReaderConfig} Launcher={CanonicalReadingEntry} />
        </section>
      </main>
      <JourneyCredits workId={almadaReaderConfig.workId} />
    </div>
  );
}

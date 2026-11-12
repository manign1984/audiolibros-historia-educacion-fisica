import JourneyHeader, { useJourneyNavigation } from '../shared/JourneyHeader.jsx';
import JourneyBlockLabel from '../shared/JourneyBlockLabel.jsx';
import JourneyCredits from '../shared/JourneyCredits.jsx';
import { AuthorBiography } from '../shared/CanonicalLayout.jsx';
import TextOnlyReader from '../shared/TextOnlyReader.jsx';
import { authorImage, authors, cover, readerConfig } from './readerConfig.js';
import './torre-pastoriza.css';

const access = [
  ['Trabajo e ingresos', 'La industrialización amplió el empleo urbano. La redistribución de ingresos y la extensión de derechos laborales modificaron las posibilidades de consumo.'],
  ['Bienes y servicios', 'El capítulo recorre la vivienda, la salud y la educación para observar cómo se amplió el acceso y qué diferencias subsistieron entre los grupos sociales.'],
  ['Vida cotidiana', 'Viajar, estudiar o pasar vacaciones en lugares antes reservados a otros sectores cambió las formas de encuentro entre grupos sociales y generó resistencias.'],
];

export default function TorrePastorizaApp() {
  const { active, progress } = useJourneyNavigation();

  return (
    <div className="tp-page">
      <a className="tp-skip" href="#lectura">Saltar a la lectura</a>
      <JourneyHeader author="Torre y Pastoriza" title="La democratización del bienestar" active={active} progress={progress} />
      <main>
        <section id="inicio" className="tp-hero tp-screen" aria-labelledby="tp-title">
          <div className="tp-shell tp-hero-grid">
            <div>
              <JourneyBlockLabel sectionId="inicio" />
              <p className="tp-authors">{authors}</p>
              <h1 id="tp-title">La democratización <em>del bienestar</em></h1>
              <p className="tp-intro">¿Cómo cambió la vida cotidiana cuando más familias trabajadoras pudieron acceder a la vivienda, la educación y las vacaciones?</p>
              <p className="tp-edition">Capítulo V de <i>Los años peronistas (1943–1955)</i> · Sudamericana, 2002</p>
            </div>
            <figure className="tp-photo">
              <img src={cover} alt="Vista de la colonia de vacaciones de Chapadmalal en 1950." width="1500" height="916" fetchPriority="high" />
              <figcaption>Colonia de vacaciones de Chapadmalal, 1950. Archivo General de la Nación.</figcaption>
            </figure>
          </div>
        </section>

        <section id="autor" className="tp-author" aria-label="Juan Carlos Torre y Elisa Pastoriza">
          <AuthorBiography
            name="Juan Carlos Torre y Elisa Pastoriza"
            initial="T / P"
            role="Sociología política e historia social"
            summary="Juan Carlos Torre es sociólogo y docente de la Universidad Torcuato Di Tella. Sus investigaciones estudian el sindicalismo, el movimiento obrero y el peronismo. Elisa Pastoriza es historiadora y profesora emérita de la Universidad Nacional de Mar del Plata. Investiga la historia social del turismo y del ocio. En coautoría publicaron también Mar del Plata. Un sueño de los argentinos."
            image={authorImage}
            imageAlt="Composición tipográfica con las iniciales de Juan Carlos Torre y Elisa Pastoriza."
            credit="Composición tipográfica de +TEC UNAHUR."
            biographyUrl="https://www.utdt.edu/ver_nota_prensa.php?id_item_menu=6&id_nota_prensa=22592"
          />
        </section>

        <section id="contexto" aria-labelledby="tp-context-title">
          <div className="tp-context tp-screen">
            <div className="tp-shell tp-context-inner">
              <JourneyBlockLabel sectionId="contexto" />
              <h2 id="tp-context-title">¿Cómo se amplió el bienestar?</h2>
              <p className="tp-lead">La movilidad social venía transformando el país antes de 1946. El capítulo examina cómo las políticas del primer peronismo aceleraron ese proceso y lo hicieron visible en distintos ámbitos.</p>
              <dl className="tp-lenses">
                {access.map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}
              </dl>
              <p className="tp-question">Al leer, elegí una vía de acceso al bienestar. ¿Qué cambios venían de antes y qué efectos tuvieron las políticas del período?</p>
            </div>
          </div>
          <div className="tp-holiday tp-screen">
            <div className="tp-shell tp-context-inner">
              <h2>El derecho a vacacionar</h2>
              <p className="tp-lead">La ampliación del turismo permite seguir un derecho desde su reconocimiento hasta las condiciones concretas para ejercerlo.</p>
              <dl className="tp-lenses">
                <div><dt>Tiempo disponible</dt><dd>En 1945 se generalizaron las vacaciones pagas a los asalariados. Algunos gremios ya habían conquistado ese derecho.</dd></div>
                <div><dt>Lugares para descansar</dt><dd>Chapadmalal y Embalse Río Tercero ampliaron la oferta de alojamiento del turismo social. También actuaron sindicatos y gobiernos provinciales.</dd></div>
                <div><dt>Acceso desigual</dt><dd>Los sectores asalariados con mayor organización y recursos aprovecharon primero muchas de esas oportunidades. Viajar seguía dependiendo de las posibilidades de cada hogar.</dd></div>
              </dl>
              <p className="tp-question">¿Qué hizo falta para transformar las vacaciones pagas en la posibilidad efectiva de viajar?</p>
            </div>
          </div>
        </section>

        <section id="lectura" className="journey-reading hb-material-reading" aria-labelledby="journey-reading-title">
          <TextOnlyReader config={readerConfig} />
        </section>
      </main>
      <JourneyCredits workId="torrePastoriza" />
    </div>
  );
}

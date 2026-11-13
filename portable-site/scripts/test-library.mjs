import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import {
  alphabeticGroup,
  catalog as allCatalog,
  workRegistry,
  programGroups,
  citationAsPlainText,
  filterCatalog,
  canReadAndListen,
  matchesAvailability,
  matchesCatalogEntry,
  normalizeForSearch,
  resolveSitePath,
  sortCatalog,
} from '../src/biblioteca/catalog.js';
import { orbuchReaderConfig, pineauReaderConfig } from '../src/readerConfigs.js';
import { buildOrbuchReadingDocument } from '../src/orbuch/buildReadingDocument.js';

// Freeze the four legacy fixtures for their existing search/citation regressions.
const legacyIds = ['aisenstein-tabla-rasa', 'hobsbawm-historia-siglo-xx', 'orbuch-educar-al-cuerpo', 'pineau-fresco-noble'];
const catalog = allCatalog.filter((entry) => entry.status === 'available' && legacyIds.includes(entry.id));
const orbuch = catalog.find((entry) => entry.id === 'orbuch-educar-al-cuerpo');
const pineau = catalog.find((entry) => entry.id === 'pineau-fresco-noble');
const orbuchAccessibleText = await readFile(new URL('../src/orbuch/orbuch-texto-accesible.txt', import.meta.url), 'utf8');
const orbuchReadingDocument = buildOrbuchReadingDocument(orbuchAccessibleText);
const expectedOrbuchCitation = 'Orbuch, I. P. (2020). Educar al cuerpo dentro y fuera del aula. Análisis de dos experiencias en la Nueva Argentina de Perón. History of Education in Latin America, 3, e21435.';
const expectedPineauCitation = 'Pineau, P. (1999). Renovación, represión, cooptación: Las estrategias de la Reforma Fresco–Noble (Provincia de Buenos Aires, década del 30). En A. Ascolani (Comp.), La educación en Argentina: Estudios de historia (pp. 223–239). Ediciones del Arca.';

assert.equal(catalog.length, 4, 'La biblioteca debe contener las cuatro obras integradas.');

const aisenstein = catalog.find((entry) => entry.id === 'aisenstein-tabla-rasa');
const hobsbawm = catalog.find((entry) => entry.id === 'hobsbawm-historia-siglo-xx');
assert.equal(aisenstein?.shortTitle, '¿Hacemos tabla rasa del pasado?', 'El título de Aisenstein debe ser propio y coincidir con su recorrido.');
assert.equal(hobsbawm?.shortTitle, 'Historia del siglo XX', 'El título de Hobsbawm debe quedar asociado exclusivamente a su obra.');
const libraryHome = await readFile(new URL('../src/biblioteca/LibraryHome.jsx', import.meta.url), 'utf8');
const cardSection = libraryHome.slice(libraryHome.indexOf('function WorkCard('), libraryHome.indexOf('function Shelf('));
assert.match(cardSection, /<span className="status-badge status-badge--ready"><Headphones[^>]*\/> Leer \+ escuchar<\/span>/,
  'Todas las tarjetas usan el cartel verde Leer + escuchar.');
assert.doesNotMatch(cardSection, /En preparación|Edición en revisión|Solo lectura|Sincronización pendiente|Sin audio/,
  'Las tarjetas no muestran estados internos de producción.');
const heroSection = libraryHome.slice(libraryHome.indexOf('function Hero({ saved, toggle })'), libraryHome.indexOf('export function ProjectFooter()'));
assert.match(heroSection, /'aisenstein-tabla-rasa': <>¿Hacemos tabla<span>rasa del pasado\?<\/span><\/>/, 'El carrusel debe mostrar el título correcto de Aisenstein.');
assert.match(heroSection, /'hobsbawm-historia-siglo-xx': <>Historia del<span>siglo XX\.<\/span><\/>/, 'La portada de Hobsbawm conserva su título.');
assert.match(heroSection, /heroTitles\[entry\.id\] \?\? entry\.shortTitle/, 'Ninguna obra futura debe heredar el título de Hobsbawm.');
assert.match(heroSection, /id="hero-title" aria-label=\{entry\.shortTitle\}/, 'El título accesible debe corresponder a la obra seleccionada.');

assert.equal(new Set(catalog.map((entry) => entry.id)).size, catalog.length, 'Los identificadores deben ser únicos.');
assert.ok(orbuch && pineau, 'Las dos obras deben estar identificadas en el catálogo.');
assert.equal(citationAsPlainText(orbuch), expectedOrbuchCitation, 'La referencia APA de Orbuch no debe alterarse.');
assert.equal(citationAsPlainText(pineau), expectedPineauCitation, 'La referencia APA de Pineau no debe alterarse.');
assert.equal(alphabeticGroup(orbuch), 'O');
assert.equal(alphabeticGroup(pineau), 'P');
assert.equal(normalizeForSearch('Renovación – COOPTACIÓN'), 'renovacion cooptacion');
assert.deepEqual(sortCatalog(catalog).map((entry) => entry.id), ['aisenstein-tabla-rasa', 'hobsbawm-historia-siglo-xx', 'orbuch-educar-al-cuerpo', 'pineau-fresco-noble']);

for (const query of [
  'Pineau',
  'reforma',
  'Pineau reforma',
  'renovacion',
  'COOPTACIÓN',
  'Pine refor',
  'provincia buenos aires',
]) {
  assert.equal(matchesCatalogEntry(pineau, query), true, `La búsqueda debe encontrar la obra con “${query}”.`);
  assert.deepEqual(filterCatalog(catalog, query).map((entry) => entry.id), ['pineau-fresco-noble']);
}

assert.deepEqual(
  filterCatalog(catalog, 'pablo').map((entry) => entry.id),
  ['orbuch-educar-al-cuerpo', 'pineau-fresco-noble'],
  'La búsqueda por un nombre compartido debe devolver ambas obras en orden bibliográfico.',
);

for (const query of [
  'Orbuch',
  'ivan',
  'educar cuerpo',
  'nueva argentina peron',
  'Orbu aula',
]) {
  assert.equal(matchesCatalogEntry(orbuch, query), true, `La búsqueda debe encontrar Orbuch con “${query}”.`);
  assert.deepEqual(filterCatalog(catalog, query).map((entry) => entry.id), ['orbuch-educar-al-cuerpo']);
}

assert.equal(filterCatalog(catalog, 'Sarmiento civilización').length, 0, 'Una búsqueda ajena no debe devolver resultados.');
assert.deepEqual(filterCatalog(catalog, '').map((entry) => entry.id), ['aisenstein-tabla-rasa', 'hobsbawm-historia-siglo-xx', 'orbuch-educar-al-cuerpo', 'pineau-fresco-noble'], 'Sin consulta se conserva el catálogo ordenado.');

const mockEntries = [
  { ...pineau, id: 'z', sortAuthor: 'Zeta, Ana', title: 'B' },
  { ...pineau, id: 'a2', sortAuthor: 'Álvarez, Ana', title: 'Z' },
  { ...pineau, id: 'a1', sortAuthor: 'Alvarez, Ana', title: 'A' },
];
assert.deepEqual(sortCatalog(mockEntries).map((entry) => entry.id), ['a1', 'a2', 'z']);

assert.equal(resolveSitePath(pineau.path, '/'), '/textos/pineau-fresco-noble/');
assert.equal(resolveSitePath(orbuch.path, '/'), '/textos/orbuch-educar-al-cuerpo/');
assert.equal(
  resolveSitePath(pineau.path, '/audiolibros-historia-educacion-fisica/'),
  '/audiolibros-historia-educacion-fisica/textos/pineau-fresco-noble/',
);
assert.equal(
  resolveSitePath(pineau.thumbnail.src, '/audiolibros-historia-educacion-fisica'),
  '/audiolibros-historia-educacion-fisica/assets/pablo-pineau.webp',
);
assert.equal(
  resolveSitePath(orbuch.path, '/audiolibros-historia-educacion-fisica/'),
  '/audiolibros-historia-educacion-fisica/textos/orbuch-educar-al-cuerpo/',
);

assert.notEqual(orbuchReaderConfig.storage.notesKey, pineauReaderConfig.storage.notesKey, 'Las notas deben tener espacios locales independientes.');
assert.notEqual(orbuchReaderConfig.storage.stateKey, pineauReaderConfig.storage.stateKey, 'El progreso debe tener espacios locales independientes.');
assert.equal(orbuchReaderConfig.sync.status, 'ready');
assert.equal(pineauReaderConfig.sync.status, 'ready');
assert.equal(orbuchReadingDocument.duration, 1673.900408);
assert.equal(orbuchReadingDocument.sections.length, 4);
const orbuchSentences = orbuchReadingDocument.sections.flatMap((section) => section.paragraphs.flatMap((paragraph) => paragraph.sentences));
assert.ok(orbuchSentences.length > 100, 'El texto accesible de Orbuch debe conservar segmentación suficiente para anotar.');
assert.ok(orbuchSentences.every((sentence) => Number.isFinite(sentence.start) && Number.isFinite(sentence.end)), 'Todas las oraciones de Orbuch deben usar tiempos del SRT validado.');
assert.ok(orbuchReadingDocument.frontMatter.every((sentence) => Number.isFinite(sentence.start) && Number.isFinite(sentence.end)));
assert.ok(orbuchReadingDocument.sections.every((section) => Number.isFinite(section.headingSentence?.start) && Number.isFinite(section.headingSentence?.end)));
assert.equal(orbuchReadingDocument.syncMetadata.status, 'source-srt-validated');
assert.equal(orbuchReadingDocument.syncMetadata.units, 154);

await Promise.all([
  access(new URL('../textos/orbuch-educar-al-cuerpo/index.html', import.meta.url)),
  access(new URL('../textos/pineau-fresco-noble/index.html', import.meta.url)),
]);

// New catalog entries have stable physical routes; their availability is explicit.
assert.deepEqual(new Set(allCatalog.map(({ id }) => id)), new Set([
  'hobsbawm-historia-siglo-xx', 'aisenstein-tabla-rasa',
  'marcaida-scaltritti-estado-nacional', 'soares-corrientes-gimnasticas',
  'lionetti-escuela-republicana', 'scharagrodsky-constitucion-ef',
  'pineau-fresco-noble', 'feiguin-aisenstein-sujetos',
  'torre-pastoriza-bienestar', 'almada-privilegiados',
  'orbuch-educar-al-cuerpo', 'arata-marino-auroras-tempestades',
  'levoratti-gimnasia-1958-1968', 'pineau-reprimir-discriminar',
  'melano-aisenstein-ultima-dictadura', 'thwaites-rey-democracia-argentina',
  'levoratti-debates-ef', 'galak-del-dicho-al-hecho',
]));
assert.equal(allCatalog.find(({ id }) => id === 'lionetti-escuela-republicana').programGroup, 'unidad-2');
assert.deepEqual(filterCatalog(allCatalog, 'Levoratti').map(({ id }) => id), [
  'levoratti-gimnasia-1958-1968', 'levoratti-debates-ef',
]);
assert.equal(filterCatalog(allCatalog, 'militares al gobierno').length, 0);
assert.ok(workRegistry.some(({ id }) => id === 'melano-militares-juramentados'));

assert.equal(new Set(allCatalog.map((entry) => entry.id)).size, allCatalog.length);
for (const entry of allCatalog) {
  assert.ok(programGroups.some((group) => group.id === entry.programGroup));
  assert.ok(citationAsPlainText(entry).length > 30);
  assert.ok(['available', 'review', 'text', 'preparation'].includes(entry.status));
  await access(new URL(`../${entry.path}index.html`, import.meta.url));
  if (entry.status === 'preparation') {
    assert.equal(entry.duration, undefined, 'No inventar duración para audios pendientes.');
    assert.equal(entry.stateKey, undefined, 'Una ficha sin audio no puede mostrar progreso.');
  }
}

const arataMarino = allCatalog.find((entry) => entry.id === 'arata-marino-auroras-tempestades');
assert.ok(arataMarino, 'Arata y Mariño deben figurar en el catálogo.');
assert.equal(arataMarino.editorialLanding, undefined);
assert.equal(arataMarino.status, 'available', 'Arata y Mariño debe ofrecer lector canónico con audio.');
assert.equal(arataMarino.duration, 3612.447347, 'Usar la duración del MP3 original.');
assert.equal(arataMarino.stateKey, 'arata-marino-audio-state-v1');
assert.equal(canReadAndListen(arataMarino), true);
assert.match(arataMarino.reference, /Novedades Educativas/);
const marcaida = allCatalog.find((entry) => entry.id === 'marcaida-scaltritti-estado-nacional');
assert.ok(marcaida);
assert.equal(marcaida.status, 'review');
assert.equal(marcaida.duration, 1878.909388);
assert.equal(marcaida.historicalPeriod, '1852–1880');
assert.equal(marcaida.stateKey, 'marcaida-scaltritti-reader-state-v2');
assert.deepEqual(programGroups.map(({ id }) => id), [
  'unidad-1', 'unidad-2', 'unidad-3', 'unidad-4', 'unidad-5', 'complementaria',
]);
assert.deepEqual(programGroups.map(({ id }) => allCatalog.filter((entry) => entry.programGroup === id).length), [1, 3, 2, 2, 3, 7]);
assert.equal(marcaida.programGroup, 'unidad-2');
assert.equal(pineau.programGroup, 'unidad-4');
assert.equal(orbuch.programGroup, 'complementaria');
assert.equal(aisenstein.programGroup, 'complementaria');
assert.ok(sortCatalog(allCatalog).findIndex((entry) => entry.id === 'thwaites-rey-democracia-argentina') >
  sortCatalog(allCatalog).findIndex((entry) => entry.id === 'tedesco-educacion-sociedad'));
assert.equal(canReadAndListen(marcaida), true, 'La edición en revisión tiene texto, audio y anotaciones.');
assert.equal(matchesAvailability(marcaida, 'available'), true, 'Aparecer en filtro Leer y escuchar.');
assert.equal(matchesAvailability(marcaida, 'review'), true, 'Aparecer en filtro Edición en revisión.');
assert.equal(matchesAvailability(marcaida, 'preparation'), false, 'Nunca aparecer como ficha sin materiales.');
assert.equal(matchesAvailability(orbuch, 'review'), false);
assert.equal(matchesAvailability(orbuch, 'available'), true);
assert.equal(filterCatalog(allCatalog, 'Braudel').length, 0);
assert.equal(matchesAvailability(workRegistry.find((entry) => entry.id === 'braudel-historia-duraciones'), 'preparation'), true);
const soares = allCatalog.find((entry) => entry.id === 'soares-corrientes-gimnasticas');
assert.ok(soares);
assert.equal(soares.status, 'available', 'Soares figura como Leer + escuchar, con el lector publicado.');
assert.equal(soares.readingDetail, 'Seguimiento aproximado por párrafos', 'El catálogo informa el grado real de sincronización.');
assert.equal(matchesAvailability(soares, 'review'), false, 'Soares ya no aparece bajo Edición en revisión.');
assert.equal(canReadAndListen(soares), true, 'Soares figura entre los lectores con texto y audiolibro.');
const torrePastoriza = allCatalog.find((entry) => entry.id === 'torre-pastoriza-bienestar');
assert.ok(torrePastoriza);
assert.equal(canReadAndListen(torrePastoriza), true);
assert.equal(allCatalog.filter(canReadAndListen).length, 13, 'Trece recorridos del catálogo tienen estado audiovisual validado.');
assert.match(libraryHome, /const readable = catalog\.filter/, 'La biblioteca obtiene el progreso de los recorridos existentes.');
assert.match(libraryHome, /matchesAvailability\(entry, status\)/, 'Los filtros distinguen capacidades de estado editorial.');
assert.match(heroSection, /const entry = catalog\[index\]/, 'El carrusel recorre toda la selección de apertura.');
assert.match(heroSection, /catalog\.map\(\(item, i\) => <button/, 'Cada ficha tiene un selector de portada.');
assert.match(heroSection, /item\.heroArtwork \?\? item\.artwork/, 'El carrusel admite una imagen distinta de la tarjeta.');
const thwaites = allCatalog.find(({ id }) => id === 'thwaites-rey-democracia-argentina');
assert.equal(thwaites.heroArtwork, 'assets/thwaites-rey/buenos-aires-2001.jpg');
await access(new URL('../public/' + thwaites.heroArtwork, import.meta.url));
const feiguinResults = filterCatalog(allCatalog, 'FEIGUÍN');
assert.deepEqual(feiguinResults.map(({ id }) => id), ['feiguin-aisenstein-sujetos']);
assert.equal(canReadAndListen(feiguinResults[0]), true);
assert.equal(filterCatalog(allCatalog, 'galak dicho')[0].id, 'galak-del-dicho-al-hecho');
assert.equal(filterCatalog(allCatalog, 'zzzinexistente').length, 0);

const { LIST_KEY, readList, saveList, readProgress } = await import('../src/biblioteca/libraryState.js');
const values = new Map();
const storage = { getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) };
const ids = allCatalog.map((entry) => entry.id);
assert.deepEqual(readList(storage, ids), []);
assert.ok(saveList(storage, [pineau.id, orbuch.id]));
assert.deepEqual(readList(storage, ids), [pineau.id, orbuch.id]);
values.set(LIST_KEY, JSON.stringify([pineau.id, pineau.id, 'unknown']));
assert.deepEqual(readList(storage, ids), [pineau.id]);
values.set(LIST_KEY, 'broken-json');
assert.deepEqual(readList(storage, ids), []);
assert.equal(readProgress(storage, pineau), 0);
values.set(pineau.stateKey, JSON.stringify({ currentTime: 60 }));
assert.equal(readProgress(storage, pineau), 60);
values.set(pineau.stateKey, JSON.stringify({ currentTime: -20 }));
assert.equal(readProgress(storage, pineau), 0);
values.set(pineau.stateKey, JSON.stringify({ currentTime: 999999 }));
assert.equal(readProgress(storage, pineau), pineau.duration);
values.set(pineau.stateKey, JSON.stringify({ currentTime: '60' }));
assert.equal(readProgress(storage, pineau), 0);
const blocked = { getItem() { throw new Error('Blocked'); }, setItem() { throw new Error('Blocked'); } };
assert.deepEqual(readList(blocked, ids), []);
assert.equal(saveList(blocked, ids), false);
assert.equal(readProgress(blocked, pineau), 0);
console.log('Biblioteca: 18 fichas de apertura, 13 recorridos con estado audiovisual validado, búsqueda, APA, rutas, lista y progreso verificados.');


// Portada de la biblioteca = una pantalla útil bajo el encabezado real.
// Inicio muestra el catálogo completo debajo de las lecturas en curso.
const librarySource = await readFile(new URL('../src/biblioteca/LibraryHome.jsx', import.meta.url), 'utf8');
const libraryCss = await readFile(new URL('../src/biblioteca/library.css', import.meta.url), 'utf8');
assert.match(librarySource, /const headerRef = useRef\(null\)/, 'Medir el encabezado de la biblioteca sin presumir una altura fija.');
assert.match(librarySource, /observer\.observe\(header\)/, 'Responder a cambios de altura del encabezado en tablet y móvil.');
assert.match(librarySource, /--library-header-height/, 'Compartir la altura efectiva con la portada.');
assert.match(libraryCss, /\.library-page \.hero\s*\{\s*min-height:calc\(100svh - var\(--library-header-height, 88px\)\);/, 'La portada ocupa el viewport útil de escritorio.');
assert.match(libraryCss, /\.library-page \.hero-inner\s*\{[\s\S]*?flex-direction:column/, 'Distribuir el contenido de la portada verticalmente.');
assert.match(libraryCss, /\.library-page \.hero-bottom\s*\{\s*margin-top:auto;/, 'Anclar descubrimiento y paginación al pie de Inicio.');
assert.doesNotMatch(librarySource, /<section className="collections"/, 'Eliminar la fila de seis tarjetas temáticas del inicio.');
assert.doesNotMatch(librarySource, /id="colecciones"/, 'No conservar un ancla a la fila eliminada.');
assert.match(librarySource, /href="#catalogo">Descubrí la biblioteca/, 'El CTA de descubrimiento debe dirigirse al catálogo.');
assert.match(librarySource, /className="library-shell catalog-area" id="catalogo"/, 'El catálogo continúa disponible tras Inicio.');
assert.match(librarySource, /<select value=\{order\}/, 'Permitir alternar entre apellido y unidad.');
assert.match(librarySource, /title="Seguí donde dejaste"[\s\S]*?id="results-title"[\s\S]*?'Todo el catálogo'/, 'El catálogo completo sigue a las lecturas en curso.');
assert.doesNotMatch(librarySource, /Lecturas disponibles|Todos los períodos|collections\.map/, 'Retirar las estanterías temáticas del catálogo.');



// Destacados: rotación continua con pausa explícita y movimiento reducido.
assert.match(librarySource, /const HERO_ROTATION_MS = 10_000;/, 'Cada portada debe permanecer visible 10 segundos.');
assert.match(librarySource, /const HERO_CROSSFADE_MS = 700;/, 'El fundido de contenido debe durar 0,7 segundos.');
assert.match(librarySource, /window\.setTimeout\([\s\S]*?HERO_ROTATION_MS/, 'El avance temporizado debe ser cancelable y reiniciarse al cambiar de portada.');
assert.match(librarySource, /window\.clearTimeout\(timer\)/, 'La temporización debe limpiarse en desmontaje, pausa y cambio.');
assert.doesNotMatch(heroSection, /onMouseEnter|onMouseLeave|onFocusCapture|visibilitychange|IntersectionObserver/, 'El puntero, el foco y la visibilidad no deben pausar la rotación.');
assert.match(heroSection, /const rotating = catalog\.length > 1 && !pausedByUser && !reducedMotion;/, 'La rotación depende de la pausa explícita y de la preferencia de movimiento reducido.');
assert.match(heroSection, /onClick=\{\(\) => setPausedByUser\(\(value\) => !value\)\}/, 'El botón de reproducción alterna la pausa explícita.');
assert.match(heroSection, /className="hero-author">\{entry\.author\.toLocaleUpperCase\('es'\)\}<\/p>/, 'La autoría se muestra solo con el nombre del catálogo.');
assert.doesNotMatch(heroSection, /HISTORIA DE LA EDUCACIÓN FÍSICA|UNA LECTURA CON/, 'La portada omite los rótulos redundantes.');
assert.match(librarySource, /prefers-reduced-motion: reduce/, 'No activar rotación si el navegador pide movimiento reducido.');
assert.match(librarySource, /disabled=\{reducedMotion\}/, 'No forzar autoplay con movimiento reducido.');
assert.match(librarySource, /aria-roledescription="carrusel"/, 'Identificar el componente para tecnologías de asistencia.');
assert.match(librarySource, /aria-live=\{rotating \? 'off' : 'polite'\}/, 'Evitar anuncios espontáneos durante autoplay.');
assert.match(librarySource, /aria-label=\{reducedMotion \? [\s\S]*?'Reanudar rotación automática' : 'Pausar rotación automática'\}/, 'La pausa debe ser un control accesible y reversible.');
assert.match(heroSection, /onClick=\{\(\) => setIndex\(i\)\}/, 'La selección manual cambia de portada sin modificar la pausa.');
assert.match(libraryCss, /transition:opacity var\(--hero-fade-duration,700ms\)/, 'Las imágenes deben cambiar por fundido.');
assert.match(libraryCss, /animation:hero-content-fade var\(--hero-fade-duration,700ms\)/, 'Los textos deben acompañar el fundido.');
assert.match(libraryCss, /@media\(prefers-reduced-motion:reduce\)/, 'Debe existir variante sin animaciones.');
assert.match(libraryCss, /\.library-page \.hero-pagination \.hero-rotation-toggle\s*\{[\s\S]*?width:44px;/, 'La pausa debe tener un objetivo táctil visible.');

// Nueva modalidad legítima de lectura sin audiolibro: no se confunde con «Leer + escuchar».
const lionetti = allCatalog.find(entry => entry.id === 'lionetti-escuela-republicana');
assert.equal(lionetti.status, 'text');
assert.equal(canReadAndListen(lionetti), false);
assert.equal(matchesAvailability(lionetti, 'text'), true);
assert.equal(matchesAvailability(lionetti, 'available'), false);
await access(new URL('../src/shared/TextOnlyReader.jsx', import.meta.url));
await access(new URL('../public/assets/lionetti/texto-academico.txt', import.meta.url));

import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
const load = async (name) => readFile(resolve(root, name), 'utf8');

const vtt = await load('src/aisenstein/aisenstein_subtitulos_verificados.vtt');
assert.match(vtt, /^WEBVTT/);
const cues = [...vtt.matchAll(/(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})/g)];
assert.equal(cues.length, 320, 'La lectura debe partir de los 320 subtítulos verificados.');
const seconds = (value) => { const [h, m, s] = value.split(':'); return Number(h) * 3600 + Number(m) * 60 + Number(s); };
let previous = 0;
for (const cue of cues) {
  const start = seconds(cue[1]);
  const end = seconds(cue[2]);
  assert.ok(start >= previous - 0.005, 'Los segmentos no pueden retroceder temporalmente.');
  assert.ok(end >= start, 'Cada segmento debe tener duración no negativa.');
  previous = start;
}
assert.ok(Math.abs(seconds(cues.at(-1)[2]) - 1493.19) < 0.01, 'La duración VTT debe coincidir con 24:53.19.');
const source = await load('src/aisenstein/aisenstein_texto_fuente.txt');
for (const heading of [
  'La investigación en Historia', 'La enseñanza de la Historia',
  'Algunas pistas que nos da la Historia', 'De la utopía al pragmatismo',
]) assert.ok(source.includes(heading), 'Falta un capítulo de la obra fuente: ' + heading);
const config = await load('src/readerConfigs.js');
const reader = await load('src/IntegratedReader.jsx');
const app = await load('src/aisenstein/AisensteinApp.jsx');
const html = await load('textos/aisenstein-tabla-rasa/index.html');
assert.match(html, /src\/aisenstein\/main\.jsx/);
assert.match(app, /<IntegratedReader/);
assert.match(app, /Launcher=\{CanonicalReadingEntry\}/);
assert.match(app, /<JourneyCredits workId="aisenstein"/);
assert.match(app, /<AisensteinInicioPreview>/);
assert.match(reader, /config\.audiobookParts/);
assert.match(config, /aisenstein-tabla-rasa-reader-notes-v1/);
let total = 0;
for (let n = 1; n <= 16; n += 1) {
  const file = resolve(root, 'public/assets/aisenstein-audio-' + String(n).padStart(2, '0') + '.part');
  const info = await stat(file);
  assert.ok(info.size > 1000, 'Archivo incompleto: ' + file);
  total += info.size;
}
assert.equal(total, 35966683, 'Los 16 fragmentos deben conservar exactamente el tamaño del MP3 definitivo.');
console.log('Aisenstein: 320 VTT, fuente, entrada, lector y 16 fragmentos MP3 verificados.');


const page = await load('src/aisenstein/AisensteinApp.jsx');
const style = await load('src/aisenstein/aisenstein.css');
const cover = await load('src/aisenstein/InicioPreview.jsx');
assert.doesNotMatch(page, /PineauLayoutReference/, 'Aisenstein no debe adoptar las alturas de la cronología de Pineau.');
assert.match(style, /--height-contexto:\s*0px;/, 'Contexto debe ajustar su altura al contenido.');
assert.match(style, /#contexto\.aisenstein-context\s*\{[\s\S]*?min-height:\s*0/, 'Contexto no debe dejar una gran franja vacía.');
assert.match(style, /--height-lectura:\s*calc\(100svh - var\(--journey-header-height, 80px\)\)/, 'La altura mínima del bloque Lectura debe descontar el encabezado medido.');
assert.doesNotMatch(cover, /Conocer a la autora|href="#autor"/, 'La portada no debe incluir un botón de avance al bloque siguiente.');
assert.doesNotMatch(page, /aisenstein-context__continue|Pasar al texto y al audiolibro/, 'Contexto no debe duplicar el menú común con un botón hacia Lectura.');
assert.match(cover, /Una imagen, una historia/, 'La portada debe identificar su fuente histórica.');
assert.match(cover, /Gymnastik für die Jugend/, 'La portada debe identificar la obra de GutsMuths.');
assert.match(cover, /Higía/, 'La portada debe explicar la figura representada.');


const coverCss = await load('src/aisenstein/inicio-preview.css');
const sharedHeader = await load('src/shared/JourneyHeader.jsx');
const headerCss = await load('src/shared/journey-header.css');
assert.match(cover, /<JourneyHeader/, 'Aisenstein debe adoptar el encabezado compartido.');
assert.match(cover, /useJourneyNavigation\(\)/, 'Aisenstein debe mostrar sección activa y progreso de lectura.');
assert.doesNotMatch(cover, /aisenstein-preview__header/, 'No duplicar encabezado local.');
assert.match(headerCss, /#0c0e15/, 'El encabezado común debe conservar el fondo grafito.');
for (const item of ['Inicio', 'Autor', 'Contexto', 'Lectura', 'Créditos']) {
  assert.ok(sharedHeader.includes("'" + item + "'"), 'Falta la navegación común: ' + item);
}
assert.match(coverCss, /height:\s*var\(--hero-room/, 'Inicio debe usar el alto de pantalla menos encabezado.');
assert.match(coverCss, /min-height:\s*var\(--hero-room/, 'Inicio debe conservar un mínimo de pantalla.');
assert.match(coverCss, /max-height:\s*none/, 'No truncar el contenido de Inicio.');
assert.match(coverCss, /max-height:\s*580px/, 'Inicio debe crecer en ventanas excepcionalmente bajas.');
assert.match(coverCss, /margin:\s*0;/, 'La página no debe conservar los márgenes por defecto del navegador.');

assert.match(coverCss, /__source-note/, 'La nota histórica debe disponer de estilos propios.');
assert.match(headerCss, /box-sizing:border-box;\s*width:min\(1680px,100%\)/, 'El padding del encabezado no debe sumar ancho exterior.');
assert.match(headerCss, /@media\(max-width:420px\)/, 'Los cinco enlaces deben ajustarse también en celulares angostos.');
const credits = await load('src/shared/creditsContent.jsx');
assert.match(credits, /frontispicio de <em>Gymnastik für die Jugend<\/em>/, 'Los créditos deben identificar el frontispicio histórico.');


// Contexto se organiza en dos unidades de pantalla dentro del único bloque 03.
assert.match(page, /className="aisenstein-context__screen aisenstein-context__screen--research"/, 'Debe existir la primera pantalla con los tres objetos.');
assert.match(page, /className="aisenstein-context__screen aisenstein-context__screen--conscience"/, 'Debe existir la segunda pantalla de conciencia histórica.');
assert.match(page, /LENSES\.map\(\(item\) => <article/, 'Los tres objetos deben mostrarse simultáneamente, sin ocultarse en pestañas.');
assert.doesNotMatch(page, /role="tablist"|aria-selected=\{active === index\}/, 'Contexto no debe conservar el carrusel reemplazado.');
assert.match(style, /--aisenstein-context-room:\s*calc\(100svh - var\(--journey-header-height, 80px\)\)/, 'Cada unidad debe usar el alto visible menos el encabezado.');
assert.match(style, /\.aisenstein-context__screen\s*\{[\s\S]*?min-height:\s*var\(--aisenstein-context-room\)/, 'Ambas pantallas deben compartir una altura mínima de viewport.');
assert.match(style, /@media\(max-width:600px\)[\s\S]*?\.aisenstein-context__objects \{grid-template-columns:1fr;/, 'Los objetos deben poder apilarse en celular.');
assert.doesNotMatch(page, /Imagen en blanco y negro por presentación CSS\./, 'No publicar descripciones técnicas del retrato en Autoría.');
assert.doesNotMatch(credits, /mediante CSS|escala de grises mediante CSS/, 'Los créditos públicos no deben describir filtros CSS.');
assert.match(coverCss, /\.aisenstein-preview #inicio \.aisenstein-preview__source-note\s*\{[\s\S]*?right:clamp\(26px,5vw,88px\)/, 'Nota histórica al extremo inferior derecho.');
assert.match(coverCss, /\.aisenstein-preview #inicio \.aisenstein-preview__source-note\s*\{[\s\S]*?background:rgba\(9,29,40,\.83\)/, 'La nota sobre la imagen debe conservar un fondo de contraste.');


// Revisión proporcional del 03/11/2026: dos unidades visibles en escritorio
// con crecimiento accesible en celulares y portátiles de altura reducida.
assert.match(page, /Tres objetos<br \/><em>de investigación\.<\/em>/, 'El título de la primera unidad debe ser breve.');
assert.doesNotMatch(page, /01 \/ 02|02 \/ 02/, 'No duplicar las numeraciones de los objetos con contadores de pantalla.');
assert.match(style, /\.aisenstein-context__screen\s*\{[\s\S]*?min-height:var\(--aisenstein-context-room\)/, 'Ambas unidades deben conservar el alto visible como mínimo.');
assert.match(style, /\.aisenstein-context__objects\s*\{[\s\S]*?grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/, 'Las tres tarjetas deben aparecer en paralelo en escritorio.');
assert.match(style, /@media\(min-width:1121px\) and \(max-height:760px\)/, 'Debe existir una variante para portátiles de escasa altura.');
assert.match(style, /@media\(max-width:600px\)[\s\S]*?\.aisenstein-context__objects \{grid-template-columns:1fr;/, 'El contenido debe apilarse sin recorte en celular.');
assert.doesNotMatch(style, /padding:\s*68px 26px 88px/, 'El contenedor padre no debe sumar espacio vertical redundante en móvil.');
assert.match(page, /Conciencia<br \/><em>histórica\.<\/em>/, 'La segunda unidad conserva el concepto central.');
assert.match(page, /¿Qué ideas sobre la Educación Física consideramos naturales porque olvidamos cómo llegaron a construirse\?/, 'Preservar íntegra la pregunta de lectura.');


// Fidelidad al modelo canónico Hobsbawm: Aisenstein solo define colores,
// sin sobreescribir retícula, anchos, tamaños, márgenes o separación vertical.
const canonicalReadingCss = await load('src/shared/canonical-reading.css');
assert.match(canonicalReadingCss, /--hb-group-shift:/, 'El centrado óptico debe seguir definido en el componente canónico.');
assert.match(canonicalReadingCss, /width:\s*min\(100%,\s*2000px\)/, 'La composición común debe aprovechar el ancho del contenedor para calcular el centrado.');
assert.match(canonicalReadingCss, /margin:\s*calc\(30 \* var\(--hb-unit\)\)/, 'El botón conserva la separación vertical aprobada.');
assert.match(style, /#lectura\.hb-material-reading\s*\{[\s\S]*?--material-paper:#efe6d6;[\s\S]*?--material-ink:#243846;[\s\S]*?--material-rust:#915336;/, 'Aisenstein puede conservar su paleta propia.');
assert.doesNotMatch(style, /#lectura\s+\.hb-material-content\s*\{[^}]*width:/, 'No se debe limitar el ancho de la retícula común desde Aisenstein.');
assert.doesNotMatch(style, /#lectura\s+\.hb-material-copy\s*\{[^}]*width:/, 'No se deben imponer anchos de la ficha bibliográfica por obra.');
assert.doesNotMatch(style, /#lectura\s+\.hb-material-(?:work h3|synopsis)\s*\{/, 'La tipografía bibliográfica proviene del componente canónico.');
assert.doesNotMatch(style, /#lectura\.aisenstein-reading\s*\{[^}]*padding:/, 'El bloque canónico no debe agregar relleno vertical local.');
assert.doesNotMatch(style, /#lectura\.aisenstein-reading\s*\{[^}]*justify-content:/, 'El centrado pertenece al componente compartido.');


// Tipografía canónica: justificar líneas completas, dejar natural la última,
// y centrar la caja bibliográfica sin variar la geometría general del bloque.
for (const selector of [
  'hb-material-work h3',
  'hb-material-synopsis',
  'hb-material-synopsis-line'
]) {
  const cssRule = canonicalReadingCss.split('\n').find((line) => line.includes('.' + selector + ' {'));
  assert.ok(cssRule, 'Falta regla compartida de ' + selector);
  assert.match(cssRule, /text-align:\s*justify;/, 'Justificación completa requerida: ' + selector);
  assert.match(cssRule, /text-align-last:\s*start;/, 'La última línea debe conservar su espaciado natural: ' + selector);
}
assert.doesNotMatch(style, /#lectura\s+\.hb-material-(?:synopsis|work h3)\s*\{[^}]*text-align:/, 'Aisenstein no puede alterar la justificación canónica.');


// Lectura: la caja bibliográfica se centra, pero los renglones no.
const readingCopyRule = canonicalReadingCss.match(/\.hb-material-copy\s*\{([\s\S]*?)\}/);
assert.ok(readingCopyRule, 'Debe existir la ficha común.');
assert.match(readingCopyRule[1], /margin:\s*calc\(52 \* var\(--hb-unit\)\) auto 0;/, 'Centrar la ficha bibliográfica como bloque.');
assert.doesNotMatch(readingCopyRule[1], /var\(--hb-group-shift\)/, 'La ficha no debe heredar el desplazamiento de las acciones tipográficas.');
assert.match(canonicalReadingCss, /\.hb-material-copy\s*\{\s*width:\s*70%;\s*margin-inline:\s*auto;/, 'Mantener centrado en tabletas.');
// Créditos: Aisenstein no debe extender la altura y separación de la unidad
// canónica compartida con overrides de tipografía, ancho o padding.
const canonicalCreditsCss = await load('src/shared/journey-credits.css');
assert.match(canonicalCreditsCss, /min-height:calc\(100svh - var\(--journey-header-height,80px\)\)/, 'Créditos calculados desde el viewport útil.');
assert.doesNotMatch(style, /\.aisenstein-sections(?:\.canonical-page)?\s+#creditos/, 'No introducir métricas locales que desborden el cierre común.');
assert.match(canonicalCreditsCss, /@media\(min-width:1024px\) and \(max-height:720px\)/, 'Créditos compartidos se adaptan a ventanas de poca altura.');
assert.match(canonicalCreditsCss, /@media\(max-width:640px\)/, 'Créditos conservan la distribución móvil accesible.');


// Prueba editorial 03/11/2026: cierre compartido en tres columnas con
// lema a la izquierda, bibliografía al centro y derechos a la derecha.
const creditsComponent = await load('src/shared/JourneyCredits.jsx');
assert.match(creditsComponent, /className="journey-credits__main"/, 'Los tres componentes deben pertenecer a la misma retícula.');
const order = [
  creditsComponent.indexOf('className="journey-credits__heading"'),
  creditsComponent.indexOf('id="credits-references-title"'),
  creditsComponent.indexOf('id="credits-rights-title"'),
  creditsComponent.indexOf('className="journey-credits__bottom"')
];
assert.ok(order.every((x) => x > 0) && order.every((x, i) => i === 0 || x > order[i - 1]), 'Orden: lema, bibliografía, derechos y pie institucional.');
assert.match(canonicalCreditsCss, /--credits-surface:#1c1e20;/, 'Créditos debe utilizar el grafito neutro de la prueba.');
assert.match(canonicalCreditsCss, /\.journey-credits__main\s*\{[\s\S]*?grid-template-columns:minmax\(0,1\.03fr\) minmax\(0,1\.34fr\) minmax\(0,1\.26fr\)/, 'Retícula de tres columnas obligatoria en escritorio.');
assert.match(canonicalCreditsCss, /\.journey-credits__columns\s*\{display:contents;\}/, 'Las dos secciones deben ocupar las columnas segunda y tercera.');
assert.match(canonicalCreditsCss, /@media\(max-width:1100px\)/, 'La retícula debe reorganizarse en tableta.');
assert.match(canonicalCreditsCss, /@media\(max-width:640px\)/, 'Las tres secciones deben apilarse en celular.');
assert.match(canonicalCreditsCss, /\.journey-credits__bottom\s*\{[\s\S]*?border-top:/, 'Los logos y enlaces se ubican en un pie de ancho completo.');
assert.doesNotMatch(style, /\.aisenstein-sections(?:\.canonical-page)?\s+#creditos/, 'No se deben restituir overrides que alteren el diseño común de Créditos.');

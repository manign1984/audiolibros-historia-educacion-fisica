# Matriz de fidelidad y procedencia

## Criterios

- **Literal:** copiado byte a byte desde el commit publicado o extraído directamente de sus datos sin cambiar valores.
- **Reconstruido:** creado para permitir la migración o derivado de información exacta cuando el archivo original no estaba disponible.
- **Modificado por solicitud editorial:** parte de la copia literal migrada y luego incorpora un cambio explícitamente solicitado para la nueva versión GitHub.
- **Documentación:** análisis nuevo que describe el estado recuperado o sus cambios posteriores.

| Componente | Clasificación | Evidencia | Observación |
|---|---|---|---|
| `portable-site/src/App.jsx` | Modificado por solicitud editorial y estructural | Base literal del commit `7882327…`; historial Git | Además del recorte postlectura y el regreso a la biblioteca, conecta Pineau explícitamente con su documento y configuración. |
| `portable-site/src/IntegratedReader.jsx` | Modificado por solicitud estructural y funcional | Base literal SHA-256 `171d43db4e347d4529a915b20804405b3ebf7002526d484f285e1a0d3bf1b992`; ramas de integración y corrección | Único motor compartido. Identidad, recursos, almacenamiento y exportación pasan por configuración; los tiempos siguen viniendo del documento de cada obra. El selector común añade `0,9×` y `1,1×`. |
| `portable-site/src/readerConfigs.js` | Reconstruido por solicitud estructural | Rama `feat/orbuch-segunda-obra` | Dos configuraciones, recursos y namespaces de `localStorage` independientes. |
| `portable-site/src/data.js` | Literal respecto de la migración, con cambios editoriales posteriores registrados en Git | SHA-256 de la copia migrada `e74f7d64229ecaa562e0c78821bde5b99afa75ab56fd497312191b1828caf538` | Línea de tiempo, estrategias, jugadores y actividades; el historial Git conserva los cambios posteriores. |
| `portable-site/src/readingDocument.js` | Literal | SHA-256 `42743f60e54b7d247891ed49fe3271c9ebff1124fcdcbe45dd171fb63f152982` | Texto y tiempos que consume el Site |
| `portable-site/src/styles.css` | Modificado por solicitud estructural | Base literal SHA-256 `1233c47a46f497753c75f171d4954082d340b0190f58a441f8934929f1d3d1df`; cambio registrado en Git | Diseño general y responsive de la obra más estilos acotados para los enlaces de regreso. |
| `portable-site/src/reader.css` | Literal | SHA-256 `e428f6f34d306160330634d3d2951486a2f086a7b5b18a93faf93411aa7f4bc9` | Estilos del lector y sus breakpoints |
| `portable-site/src/main.jsx` | Literal | Comparación byte a byte con el commit | Entrada React ya presente en el Site |
| `portable-site/index.html` | Modificado por solicitud estructural | Cambio registrado en la rama de biblioteca | Documento raíz y metadatos de la nueva biblioteca. |
| `portable-site/textos/pineau-fresco-noble/index.html` | Literal respecto del estado previo a la biblioteca | Copia byte a byte del antiguo `portable-site/index.html` | Metadatos y contenedor de la primera obra, ahora en su ruta interna. |
| `portable-site/src/biblioteca/**` | Reconstruido y ampliado por solicitud estructural y visual | Historial Git y `CATALOGO_2026.md` | Portada, catálogo de 29 lecturas, seis colecciones, búsqueda, filtros, lista personal y fichas bibliográficas. Dos recorridos completos y 27 en preparación. |
| Recursos originales de Pineau en `portable-site/public/assets/` | Literal | Comparación completa y `data/assets-inventory.csv` | 36 recursos preservados |
| Recursos `orbuch-*` | Recuperados, aportados o derivados de fuentes verificadas | `data/orbuch-assets-inventory.csv` | MP3, SRT, tres PDF, texto accesible, retrato institucional, mural, tipografías y reproducciones documentales. |
| MP3 Pineau | Literal | SHA-256 `46b19c38a1b0d15db4010ab1dd002f72a99939f1486116595d257286deeeae2c` | Audiolibro y sincronización preservados. |
| MP3 Orbuch | Recuperado de Drive | SHA-256 `1ad70702ffd057916d20b17810713f0c8a26f1a076f4bd812a5bb327f5e2140c` | 1673.900408 s; sincronizado con el SRT aportado y validado. |
| `portable-site/src/orbuch/**` | Reconstruido desde el Site y corregido por solicitudes editoriales | Ramas `feat/orbuch-segunda-obra`, `fix/orbuch-fidelidad-visual` y `fix/orbuch-five-blocks-sync-speed` | Página singular, estilos, texto accesible y `readingDocument` con tiempos del SRT. Conserva la composición editorial sin restaurar actividades. |
| `portable-site/textos/orbuch-educar-al-cuerpo/index.html` | Reconstruido por solicitud estructural | Entrada física de Vite | URL refrescable de la segunda obra. |
| Generador desde SRT | Literal | Comparación byte a byte | Requiere el SRT externo, no incluido en el Site |
| `data/reading-sync_exact.json` | Extracción literal | Generado desde `readingDocument.js` | 201 unidades, textos e intervalos exactos |
| `data/content-structure_exact.json` | Extracción literal de la versión migrada | Generado desde `data.js` y `readingDocument.js` | Conserva la estructura extraída del estado migrado; no se regenera automáticamente tras cambios editoriales posteriores. |
| `portable-site/package.json` | Reconstruido | Declarado en el manifiesto técnico | Dependencias fijadas para Vite puro |
| `portable-site/package-lock.json` | Reconstruido mecánicamente | `npm install --package-lock-only` | Resolución reproducible de la capa portable |
| `portable-site/vite.config.js` | Reconstruido y ampliado por solicitud estructural | Historial Git | Adapta el base de Pages y compila biblioteca, Orbuch y Pineau como entradas multipágina. |
| `portable-site/.gitignore` | Reconstruido | Declarado en el manifiesto técnico | Higiene del paquete |
| `data/reading-sync_reconstructed-from-site.srt` | Reconstruido | Derivado de las 201 unidades exactas | No es el SRT de 561 cues de ElevenLabs |
| Documentación e inventarios | Documentación | Este paquete | Auditoría y guías nuevas |

## Validación de igualdad de la migración inicial

En la migración se compararon recursivamente `src/` y `public/assets/` entre la copia fresca del origen y la versión portable. También se compararon por separado `index.html` y el generador de lectura. En ese momento no se encontraron diferencias.

A partir de los cambios editoriales posteriores, Git pasa a ser la fuente de trazabilidad de las diferencias respecto de aquella copia literal. La versión de seguridad original continúa identificada por el commit `7882327b5bf619ba81335d136e9eddc96cf894c9`.

## Cambio editorial del 24/08/2026

Por decisión del proyecto, la página principal deja para una etapa futura todo el trabajo práctico posterior a la lectura. En la interfaz actual, la Sección 02 termina inmediatamente después del lector integrado y continúa directamente con Créditos. Se retiraron del componente de aplicación la brújula de estrategias, los ejercicios de calentamiento, el partido pedagógico y el gabinete de conciencia histórica, junto con su lógica de interacción y sus entradas de navegación. El lector, su sincronización audio-texto, las notas, el contexto histórico y el carrusel no fueron modificados por este recorte.

## Integración estructural de la biblioteca del 24/08/2026

La URL raíz pasa a presentar un catálogo académico y la experiencia Fresco–Noble se conserva como primera obra bajo `textos/pineau-fresco-noble/`. Esta integración añade una entrada de React independiente para la biblioteca, un catálogo manual, búsqueda local, compilación Vite multipágina y enlaces de retorno. No modifica `IntegratedReader.jsx`, `readingDocument.js`, `data.js`, `reader.css`, el generador desde SRT ni los recursos de `public/assets/`.

## Integración de Orbuch del 24/08/2026

La segunda obra se reconstruye desde el Site recuperado, el artículo académico, los cuadernillos de 1949/1950, el texto accesible y el MP3 definitivo. La primera integración conservó la identidad cívico-popular azul, dorada y roja, pero condensó la página a Inicio, Autor, Contexto/archivo, Lectura y Créditos. No se trasladaron cuestionarios, juegos ni actividades postlectura. El Site original no fue modificado.

La solicitud de compartir infraestructura habilita el cambio de `IntegratedReader.jsx`: Pineau y Orbuch importan una sola implementación. `readingDocument.js`, sus 201 tiempos y los recursos de Pineau permanecen literales. En esa primera etapa el documento de Orbuch no contenía campos `start`/`end`; la incorporación posterior del SRT real resuelve esa limitación sin alterar los tiempos de Pineau.

## Alcance de la reconstrucción del SRT

El SRT reconstruido:

- usa exactamente los textos visibles que consume el Site;
- conserva exactamente los tiempos de inicio y fin de las 201 unidades;
- permite intercambio y revisión externa;
- no recupera la segmentación original de 561 cues;
- no se presenta como archivo original ni como sustituto forense del SRT de ElevenLabs.

La fuente de verdad para reproducir el comportamiento del lector es `readingDocument.js`; la extracción JSON es su representación portátil sin pérdida.

## Corrección de fidelidad visual de Orbuch del 24/08/2026

La comparación directa entre la página publicada en GitHub Pages y el Site `educar-el-cuerpo.man-ign.chatgpt.site` mostró que la primera integración conservaba el mural y la paleta, pero no la composición editorial. El título ocupaba casi todo el primer pliegue y faltaban la pregunta-problema, la introducción, los dos expedientes, las tres operaciones, el contador de secciones y el ritmo gráfico de las secciones interiores.

La rama `fix/orbuch-fidelidad-visual` recupera esos elementos y reorganiza el recorrido público en siete estaciones: Inicio, Problema, Autor, Contexto, Lectura, Archivo y Créditos. Se restauran la retícula, la tipografía de afiche, los banderines, los marcos documentales, los fondos por sección, la línea de tiempo vertical y los enlaces de continuidad. Siguen excluidos los cuestionarios, la clasificación de evidencias y la producción final del Site original. El lector compartido, el MP3, los PDF, el texto accesible, las claves de almacenamiento y Pineau no se modifican.

## Unificación en cinco bloques y sincronización del 24/08/2026

La solicitud editorial siguiente adopta para Orbuch la misma navegación principal de Pineau: Inicio, Autor, Contexto, Lectura y Créditos. La pregunta-problema se distribuye entre Inicio y Contexto; el archivo comparado, los cuadernillos y sus reproducciones pasan a ser subsecciones de Contexto. La ficha de autor utiliza un retrato institucional de UNAHUR mostrado en blanco y negro, una síntesis de 60 palabras y un enlace de ampliación académica.

El SRT aportado por el proyecto contiene 410 cues y su texto hablado coincide completamente con el guion accesible. Como su duración declarada (`1668.456` s) difiere de la del MP3 (`1673.900408` s), `generate-orbuch-sync.mjs` aplica una escala uniforme, conserva hashes de las tres fuentes y controla la deriva contra las pausas observadas en los cuatro títulos de capítulo. El resultado asigna intervalos a 154 unidades y habilita `sync.status: 'ready'`. Esta sincronización no es inferida por reparto proporcional: parte del SRT real y explicita la única normalización temporal aplicada.

El lector compartido añade las velocidades `0,9×` y `1,1×`; no altera el documento temporizado ni los recursos de Pineau. El SRT y el retrato se publican con su procedencia en el inventario y en Créditos.

## Ampliación y renovación visual del 27/10/2026

Por solicitud del proyecto +TEC, la portada adopta una estética de catálogo audiovisual y se amplía a 29 lecturas, con dos recorridos completos y 27 fichas en preparación. Se incorporan seis colecciones temáticas, filtros, lista personal local y continuidad desde el progreso existente. La procedencia bibliográfica, los límites de cobertura del programa y la validación se detallan en `CATALOGO_2026.md`. No se alteran las dos experiencias publicadas, los documentos temporizados, el lector compartido ni los recursos originales.

## Identidad del encabezado del 27/10/2026

Por pedido explícito, el encabezado de la biblioteca y las fichas muestra “Historia de la Educación Física” a la izquierda y los logos de UNAHUR y +TEC a la derecha. `logo-unahur.png` y `logo-mas-tec.png` son copias byte a byte de los PNG transparentes adjuntados por el proyecto. Se conservan colores, proporciones y transparencias; solo cambia su tamaño de presentación mediante CSS. La navegación pasa a una segunda fila en pantallas menores y los logos se apilan en celulares estrechos. El cambio se limita al encabezado compartido y no modifica el pie, el catálogo ni los recorridos de lectura.

## Portadas de Pineau y Hobsbawm del 27/10/2026

Por solicitud del proyecto se incorporan las imágenes adjuntas como portadas de «Renovación, represión, cooptación» de Pablo Pineau y «Historia del siglo XX» de Eric Hobsbawm. `portada-pineau-fresco-noble.png` y `portada-hobsbawm-historia-siglo-xx.png` conservan byte a byte los PNG originales. Se muestran en las tarjetas del catálogo, búsquedas y lista personal; Pineau también usa su nueva imagen en el destacado de inicio y Hobsbawm en su ficha bibliográfica. No se alteran los recursos originales, las experiencias de lectura, el contenido bibliográfico ni el estado de disponibilidad.

## Portada de Eduardo Galak del 27/10/2026

Por solicitud del proyecto, «Del dicho al hecho» incorpora como portada la imagen adjunta «Collage vintage de educación física.png». El recurso `portada-galak-del-dicho-al-hecho.png` conserva byte a byte el PNG aportado y se utiliza en las tarjetas del catálogo, las búsquedas, la lista personal y la ficha bibliográfica, con el formato horizontal ya disponible. El estado de disponibilidad y el contenido bibliográfico se conservan.

## Integración de Hobsbawm del 28/10/2026

Por solicitud explícita se incorpora el tercer recorrido de autor, contexto y lectura con audio. La procedencia, el alcance de la selección, los hashes de los recursos, el procedimiento de alineación automática y las seis omisiones verificadas del audiolibro se documentan en `HOBSBAWM_2026.md`. Se añaden `src/hobsbawm/`, sus recursos, configuración y entrada multipágina. La biblioteca pasa a tres recorridos y 26 fichas en preparación. `IntegratedReader.jsx` conserva el motor común y añade indicadores para fragmentos sin audio y nombres accesibles de controles móviles; los textos, tiempos y recursos de Pineau y Orbuch se conservan. El workflow de validación incorpora la prueba de Hobsbawm.

## Parámetros comunes de los recorridos del 28/10/2026

Por solicitud explícita se aplican a Orbuch y Hobsbawm las directrices acordadas en el documento editorial: alturas de Pineau para los cinco bloques y una ficha de autor con Bebas Neue 400, Archivo 400/700, retrato en blanco y negro y resumen cercano a 60 palabras. La implementación y las comprobaciones se detallan en `PARAMETROS_COMUNES_2026.md`. No se modifican los componentes, estilos, textos, tiempos o recursos originales de Pineau ni el motor del lector. Se conserva el retrato anterior de Hobsbawm y se añade un retrato de procedencia documentada con encuadre de rostro.

## Eliminación de barras internas del 28/10/2026

Por solicitud explícita se corrige la implementación de alturas comunes que había introducido desplazamiento dentro de los bloques de Orbuch y Hobsbawm. La nueva regla D11 del acuerdo editorial establece una única barra vertical para el recorrido principal. Las alturas de Pineau pasan a ser mínimos de referencia; los bloques crecen cuando lo necesita su contenido. Se modifican los estilos compartidos y se retira el foco artificial de los contenedores. El contenido, las tipografías, los retratos y el lector compartido se conservan.

## Recomposición del espaciado de Hobsbawm del 28/10/2026

La solicitud posterior de recuperar la composición anterior se contrasta con el recorrido inicial de Hobsbawm (`9b46951667c394ead5e5339b5e03482d963d0dc1`, PR #18) y los ajustes de las PR #19 y #20. No faltan materiales en Contexto o Lectura: las alturas mínimas importadas de Pineau prolongaban artificialmente secciones más breves. Se recupera el flujo original de sus contenidos y se retira el mínimo importado únicamente de Contexto, Lectura y Créditos de Hobsbawm. Inicio y Autor mantienen la referencia común; se conservan la biografía normalizada, el retrato nuevo, los tres períodos, la clave de lectura, Sarajevo, el lector y todos los recursos. La excepción y las medidas se registran en `PARAMETROS_COMUNES_2026.md`. Pineau y Orbuch no cambian.

## Fondo plano de las biografías del 28/10/2026

Por solicitud explícita se retira la figura radial situada detrás de la biografía de Orbuch, tanto en escritorio como en celulares. El bloque Autor conserva su azul plano. Hobsbawm recibe un fondo crema opaco para que la textura del fondo general no atraviese su biografía. Pineau ya emplea un color plano. La regla común queda asentada en el documento editorial y en `PARAMETROS_COMUNES_2026.md`: el fondo de las biografías es un color plano y uniforme, sin figuras, rayos, tramas, texturas, imágenes ni degradados. Puede variar el color entre obras; se conservan los marcos del retrato y la composición de la ficha. Los demás bloques, los contenidos y el lector compartido no cambian.

## Continuidad directa de Inicio a Autor del 28/10/2026

Por solicitud explícita se elimina de Orbuch la franja «Prescripción · Implementación · Tensiones» situada al pie de Inicio. Se retiran su lista y los estilos exclusivos de escritorio y celular. Inicio continúa directamente con Autor; se conservan la composición de portada, la biografía y los contenidos de Contexto. El documento editorial incorpora esta continuidad como regla común en D4 y en el detalle de Inicio. La prueba de fidelidad deja de exigir los rótulos y los estilos de la franja retirada; los demás controles siguen vigentes.

## Encabezado común de los tres recorridos del 28/10/2026

Por aceptación explícita de la propuesta editorial, Pineau, Orbuch y Hobsbawm utilizan `shared/JourneyHeader.jsx`: acceso «← Biblioteca», apellido y título breve, las cinco opciones en el mismo orden, Archivo 600/700, fondo grafito, texto claro y verde lima. El encabezado mide como mínimo 80 px desde 1024 px de ancho y 112 px por debajo, incluida su barra de progreso de 2 px. El diseño permite crecer al ampliar texto y conserva las cinco opciones visibles sin barras internas.

Se unifican la indicación de sección activa y el avance, con un cálculo que contempla el alto real del encabezado y el final de la página. Los enlaces a secciones descuentan ese alto. Pineau conserva su indicador lateral y traslada el control de sonidos a Inicio, junto a «Sonido opcional». Esta solicitud autoriza expresamente los cambios acotados de `App.jsx` y `styles.css`; se preservan sus materiales y el lector. La referencia inerte de Pineau incorpora la hoja común para reflejar las mismas condiciones al medir. El acuerdo queda en la sección 2.2 y en D12 del documento editorial.

## Inicio completo al ingresar del 28/10/2026

La solicitud explícita de mostrar cada portada completa sin desplazamiento inicial autoriza los ajustes de presentación de Pineau, Orbuch y Hobsbawm mediante `shared/hero-viewport.css`. La nueva hoja calcula el espacio visible descontando el alto real del encabezado una sola vez y adapta títulos, imágenes y separaciones al ancho y al alto disponibles. Se importa en `JourneyHeader.jsx` y se incluye en la referencia inerte generada por `generate-layout-reference.mjs`. No modifica contenidos, recursos fuente, audiolibros, temporización, datos guardados ni motor del lector.

Se conservan la estética particular de las tres portadas y el paso directo a Autor, sin barras internas. En ventanas extremas o con ampliación de texto se permite el crecimiento natural para preservar la legibilidad y el acceso íntegro. Las comprobaciones de escritorio, portátil de poca altura y celular se registran en `PARAMETROS_COMUNES_2026.md`; el acuerdo queda en 2.3 y D13 del documento editorial y sustituye para Inicio el mínimo de pantalla completa que no descontaba el encabezado.

## Altura mínima de las biografías del 28/10/2026

Por solicitud explícita se modifica exclusivamente la presentación del bloque Autor de Pineau, Orbuch y Hobsbawm. `shared/author-viewport.css` fija como mínimo el alto visible menos el alto real del encabezado común y centra verticalmente la ficha. La altura sigue siendo automática y puede crecer según el contenido. Se importa la hoja desde `JourneyHeader.jsx` y se incluye en la referencia inerte generada por `generate-layout-reference.mjs`.

Se conservan los contenidos, tipografías, retratos, fondos planos, enlaces y recursos de las biografías. Inicio, Contexto, Lectura, Créditos y el motor del lector mantienen su configuración. Las comprobaciones se registran en `PARAMETROS_COMUNES_2026.md`; el documento editorial añade 2.4 y D14, con una aplicación gradual que limita esta etapa a Autor y requiere revisar los próximos cambios de a un bloque por página.

## Piloto de identificación de bloques en Pineau del 28/10/2026

Por solicitud explícita se prueba únicamente en Pineau la secuencia «01 · Inicio», «02 · Autor», «03 · Contexto», «04 · Lectura» y «05 · Créditos», derivada del orden del menú común. `PineauBlockLabel` y `pineau-block-labels.css` unifican la identificación en Archivo 700, 12 px, interlínea 1,4 y separación de 12 px antes del título. Se conservan los títulos editoriales, la estética de cada bloque, los materiales y el lector. El acceso a Biblioteca permanece en la portada y el «01» interno de la introducción a Lectura se reemplaza por un icono de documento para no competir con la numeración principal.

El generador renderiza `App` con `pilotBlockLabels: false` para mantener sin cambios la referencia estructural que utilizan Orbuch y Hobsbawm. Los hashes del HTML y CSS de esa referencia coinciden antes y después del piloto; sus páginas conservan su presentación. Esta prueba no modifica todavía el documento editorial de Google ni establece una directriz definitiva. Las comprobaciones y el alcance se detallan en `PARAMETROS_COMUNES_2026.md`.

## Generalización de la identificación de bloques del 28/10/2026

Por aprobación explícita del piloto se adopta `shared/JourneyBlockLabel.jsx` y `shared/journey-block-labels.css` en Pineau, Orbuch y Hobsbawm. La secuencia 01–05 deriva del menú común y emplea Archivo 700, 12 px, interlínea 1,4 y una identificación discreta sobre cada título. En Orbuch y Hobsbawm se sustituyen los números grandes y los rótulos particulares de los encabezados; se conservan los títulos editoriales, los contenidos y la identidad de cada obra. La biografía compartida incorpora 02 · Autor y los inicios incorporan 01 · Inicio.

Pineau conserva la presentación aprobada y elimina las ramas de código exclusivas del piloto. La referencia inerte ahora reproduce la versión aprobada con las hojas comunes. Se ajustan únicamente dos separaciones de Inicio de Hobsbawm en celulares de poca altura para conservar la portada completa. El lector, los recursos, las notas y los tiempos permanecen intactos. La prueba de dos obras y la verificación de compilación dejan de exigir los rótulos antiguos «Recorrido documental e interactivo» y «El autor del texto», sustituidos por la identificación común.

El documento editorial incorpora 2.5 y D15 para la numeración, y 2.6 y C6 para resolver Contexto de textos teóricos como una preparación conceptual e intelectual. Se conservan los cinco bloques y la adaptación de sus recursos al problema y a la versión de cada lectura. La implementación y comprobaciones se registran en `PARAMETROS_COMUNES_2026.md`.

## Créditos comunes de los tres recorridos del 29/10/2026

Por solicitud explícita se sustituye exclusivamente el bloque 05 de Pineau, Orbuch y Hobsbawm por `shared/JourneyCredits.jsx`, con contenidos particulares en `creditsContent.jsx`. El cierre comparte el lema exacto «Estudiar el pasado / Soñar futuros / Accionar en presente.», fondo plano #202A3C, Bebas Neue 400 y Archivo 400/700, las columnas «Referencias bibliográficas y fuentes» y «Derechos y agradecimientos», logos originales de UNAHUR y +TEC, nota de guardado local y enlaces de regreso. Se preservan las referencias, procedencias y licencias ya documentadas, incluidos el alcance y las omisiones del audio de Hobsbawm. No se atribuye el lema como cita de Rüsen.

La altura mínima corresponde al espacio visible menos el alto real del encabezado. Se ajustan espacios y composición para mostrar el cierre completo en escritorio; en celular o ventanas excepcionalmente pequeñas crece en el flujo general, sin recortes ni barras internas. El indicador lateral de Pineau se sitúa en el espacio libre junto al lema cuando Créditos está activo para no tapar la columna derecha. El generador de la referencia inerte incluye la nueva hoja. Las pruebas existentes apuntan al componente compartido para comprobar el identificador de Créditos. Los restantes bloques, el lector, los recursos fuente, los tiempos y los datos guardados se conservan.

El documento editorial incorpora 2.7 y D16, actualiza a 856 px la referencia de Créditos para 1363×936 y resuelve las menciones anteriores que lo vinculaban a la altura antigua. Las comprobaciones se detallan en `PARAMETROS_COMUNES_2026.md`.


## Piloto de tres accesos al lector del 29/10/2026

Por solicitud explícita se aplican las tres propuestas visuales para compararlas en uso: Entrada directa en Pineau, Portal de lectura en Hobsbawm y Mesa de estudio en Orbuch. `ReaderLauncher.jsx` y `reader-launcher.css` separan exclusivamente la presentación de entrada del motor común de `IntegratedReader.jsx`; `readerConfigs.js` selecciona la variante y el autor. Se agranda la acción «Abrir lector integrado», se distinguen los enlaces a originales y se conserva una indicación contextual de progreso y notas cuando existen. La vista previa de Orbuch toma texto real de su documento de lectura y sus elementos gráficos son ilustrativos, sin controles de reproducción simulados.

Se conservan los documentos, tiempos, archivos, claves de almacenamiento, restauración de lectura, anotaciones, exportación y controles del lector. La referencia inerte de Pineau incorpora la nueva hoja de estilos. Los paneles crecen naturalmente en celular, sin barras internas, y el acceso de Orbuch precede a su vista previa en pantallas pequeñas. No se establece todavía una directriz visual definitiva ni se modifica el documento de Google: la selección se realizará después de probar los tres diseños.

El indicador flotante de Pineau se oculta mientras Lectura está activa para no superponerse al panel; el encabezado común mantiene el progreso. Los enlaces directos `#lector` se alinean al panel tras cargar la página y sus fuentes. En celular, la acción de Orbuch también precede a la lista de funciones.

Validación: las tres entradas abren y cierran el lector existente; una nota y el punto de lectura de Pineau persisten después de recargar y no aparecen en Hobsbawm. Los paneles y sus botones no presentan desbordamiento horizontal a 360 y 768 px, con revisión visual adicional en escritorio. Pasan `test:library`, `test:two-works`, `test:hobsbawm` y las compilaciones verificadas tanto para la raíz como para la base de GitHub Pages.


## 2026-10-30 · Piloto de Lectura como composición única (Hobsbawm)

Pedido: rehacer solamente el bloque 04 de Hobsbawm; el propio bloque constituye el contenedor visual. Se retiran el portal interior, los encabezados superpuestos, la ruta previa y la pregunta orientadora.

- Título común propuesto: «El texto en el centro de los procesos de enseñanza y aprendizaje».
- Sinopsis breve de invitación al texto y botón destacado «Abrir lector integrado», integrados sobre un fondo crema plano. Bebas Neue para el título y Archivo para texto y controles.
- PDF, audio original y texto accesible como enlaces secundarios; se conserva la advertencia de los seis pasajes sin audio.
- Altura mínima: ventana visible menos el encabezado; espaciado y tamaño tipográfico adaptados también a la altura. Sin recortes ni barras internas. Se permite crecimiento natural en condiciones excepcionales de ampliación de texto.
- IntegratedReader admite un componente Launcher opcional, conservando su entrada predeterminada en Pineau y Orbuch. El motor, las fuentes, sincronización, notas y almacenamiento no cambian.
- Verificación visual: 1363×936, 1280×720, 768×1024, 390×844, 360×780 y 360×640. En la ventana compacta el bloque mide 528 px, debajo del encabezado de 112 px. Sin desbordamiento horizontal.
- Verificación funcional: abrir/cerrar lector, seleccionar capítulo, crear nota y recuperar posición y nota tras recargar. Pruebas library, two-works y hobsbawm aprobadas; compilación y verificación tanto en raíz como en la base de GitHub Pages.

Esta propuesta permanece como piloto en Hobsbawm; no se extiende aún a las demás páginas ni se establece como directriz definitiva en Google Docs.


## Formato común de Lectura aprobado el 30/10/2026

Por aprobación explícita del piloto de Hobsbawm se generaliza el bloque 04 a Pineau y Orbuch. `shared/JourneyReadingEntry.jsx` y `shared/journey-reading.css` contienen la única composición: título «El texto en el centro de los procesos de enseñanza y aprendizaje», sinopsis propia, botón destacado y materiales secundarios sobre fondo crema plano. El bloque es el contenedor; se retiran los paneles anidados, la pregunta orientadora obligatoria y los encabezados previos. Hobsbawm conserva su presentación aprobada mediante el componente común.

`readerConfigs.js` reúne las sinopsis y enlaces por obra, sin modificar las claves de almacenamiento, los textos ni los tiempos. Pineau conserva sus originales PDF/audio; Orbuch conserva además texto accesible y SRT. Hobsbawm conserva la advertencia de los seis pasajes sin audio. El motor de IntegratedReader no cambia; solo se sustituye su entrada predeterminada. La referencia inerte incorpora la hoja compartida y la prueba de fidelidad verifica el rótulo SRT en el nuevo componente.

El documento editorial de Google incorpora 2.8 y D17, actualiza Lectura a 856 px en la referencia 1363×936 y resuelve las menciones antiguas de su altura y composición. El conjunto calcula la ventana visible menos el encabezado y crece naturalmente ante ampliaciones excepcionales, sin recortes ni barras internas.

Validación: pruebas library, two-works y hobsbawm; compilación y verificación en raíz y base de Pages. Revisión de Pineau y Orbuch en escritorio, 1280×720, tablet 768×1024 y celular 360×640; apertura/cierre del lector en ambas obras y nota local en Orbuch. Bloques de 856, 640, 912 y 528 px según ventana y encabezado; sin desbordamiento horizontal. Se conserva el progreso en el encabezado y se oculta el indicador flotante de Pineau mientras Lectura está activa.


## Afinación visual de Lectura del 31/10/2026

Por aprobación de los seis ajustes propuestos a partir de la maqueta editorial se afina el componente común del bloque 04 en las tres obras. El botón adopta una cápsula azul con relieve moderado y sombra corta; no lleva una envolvente ni un panel adicional. Un único motivo vectorial de páginas y onda sonora acompaña el acceso en escritorio. En tablet y celular se simplifica al icono de libro y audio del botón, sin ocupar altura adicional. El motivo es decorativo y no representa controles activos.

Se reduce moderadamente el título común y se separa la autoría del título de la obra, ahora en Archivo 700 de mayor tamaño. Título, identificación y sinopsis ocupan la columna izquierda; motivo y acción ocupan la derecha. Se conserva la frase «Leé, escuchá y anotá · Audio de … min» y el aviso de progreso/notas. Se añaden estados táctiles y de teclado, movimiento reducido y compatibilidad con colores forzados. El fondo sigue plano y la identificación se mantiene como 04 · Lectura; el menú conserva Contexto.

Se preservan las sinopsis, fuentes, duración configurada de cada obra, omisiones del audio de Hobsbawm, almacenamiento y motor de IntegratedReader. La actualización editorial queda en 2.8 y D17 del documento de directrices.

Validación: test:library, test:two-works y test:hobsbawm; compilación verificada en raíz y en la base de Pages. Revisión visual en escritorio 1363×936, portátil 1280×720, tablet 768×1024 y móvil 360×640. Los bloques conservan 856, 640, 912 y 528 px respectivamente; sin desbordamiento horizontal. Apertura del lector en las tres obras, apertura por teclado en Hobsbawm, cierre y recuperación del foco, y nota de Orbuch persistente tras recargar. La vista móvil de Orbuch con nota guardada conserva todos sus elementos visibles.


## Nueva prueba de profundidad tipográfica del 31/10/2026

Por solicitud explícita posterior a la revisión de la primera afinación, el acceso común de Pineau, Orbuch y Hobsbawm reemplaza el dibujo del libro y la onda por «Leé / escuchá / anotá», en tres líneas. Georgia cursiva y tonos ocre complementan el título azul en Bebas Neue. Tamaño, posición y sombras progresivos sugieren distancia sin dibujar una escalera, plataformas ni un panel interior. El botón ocupa el plano más cercano: cápsula azul, doble borde, relieve y sombra más marcada siguiendo la nueva referencia, con auriculares blancos y flecha dorada. La duración y la continuidad se conservan debajo; se evita repetir la misma invitación.

La versión compacta reduce la escala de las palabras y agrupa duración y notas para conservar el bloque visible. Se preservan contenidos, recursos, sincronización y almacenamiento del lector. Esta revisión se registra como prueba visual solicitada; no se convierte aún en una nueva directriz definitiva de Google Docs.

Validación: pruebas library, two-works y hobsbawm; compilaciones verificadas para raíz y base de GitHub Pages. Revisión en escritorio, portátil 1280×720, tablet 768×1024 y móvil 360×640; los tres accesos caben en la ventana móvil, incluyendo Orbuch con una nota guardada. Apertura por teclado y cierre en Hobsbawm, y apertura/cierre en Pineau.

## Piloto material del bloque 04 de Hobsbawm del 31/10/2026

Por solicitud explícita y tomando como referencia la imagen «Leé, Escuchá, Anotá_ Lectura del Siglo XX(2).png», Hobsbawm utiliza ahora `hobsbawm/HobsbawmReadingEntry.jsx` como Launcher de presentación. El componente y su hoja `hobsbawm-reading.css` son exclusivos de esta obra. `HobsbawmApp.jsx` solo conecta esta variante y añade una clase al bloque 04. No se modifican el Launcher común, las otras páginas, IntegratedReader, readerConfigs, documentos, tiempos, recursos ni claves de almacenamiento.

La columna izquierda reúne «LEÉ / ESCUCHÁ / ANOTÁ» en Archivo 900, igual tamaño y alineación, con relieve tipográfico controlado, autor terracota, título bibliográfico azul y sinopsis original. La frase conceptual pasa a la derecha, en mayúsculas Bebas Neue, sobre el botón de auriculares y flecha dorada. La cápsula mantiene el callback onOpen original; su gradiente, bordes y sombra hacia abajo/derecha constituyen el plano más elevado. Cuadrante, líneas, contorno redondeado y puntos son formas CSS decorativas, sin interacción y ocultas a tecnologías de asistencia.

El crema original #f4e9d3 se conserva. Una pequeña textura vectorial procedural embebida aporta grano en el espacio libre sin descargar fotografías. Las superficies de texto usan ese mismo color pleno con bordes difuminados para evitar paneles visibles y ruido. Se retiran de esta entrada los tres enlaces inferiores y el aviso sobre omisiones, sin moverlos dentro del bloque. Las advertencias propias del lector y los créditos existentes permanecen intactos. Solo se muestra información de continuidad cuando ya existe progreso o alguna nota.

Adaptaciones técnicas respecto de la imagen: se utiliza una fuente web real de la familia de la biblioteca; relieve, geometrías y volumen se resuelven con CSS. La información bibliográfica ocupa dos renglones por pedido expreso. En móvil se apilan las columnas y el bloque puede superar la ventana visible para conservar tamaños legibles, sin recortar ni introducir desplazamiento interno. Se mantiene el mínimo de altura común, la numeración y el encabezado. El botón conserva estados de teclado/táctiles, movimiento reducido y colores forzados.

Validación: npm ci, test:library, test:two-works, test:hobsbawm, build y verify:build aprobados; compilación y rutas verificadas también con GITHUB_PAGES_BASE=/audiolibros-historia-educacion-fisica/. Revisión visual en navegador de escritorio (1363×936) y con viewports CSS reales dentro de un marco temporal de QA: 320×640, 360×640, 390×844, 768×936, 1024×844, 1280×640 y 1840×936. Sin desbordamiento horizontal, textos cortados ni contenedores de scroll dentro del bloque. Alturas del botón de 82 px en móvil y 100–110 px en escritorio. Apertura por teclado en escritorio, cierre con foco restituido, apertura/cierre en móvil, selección del capítulo «II · Un siglo en tres tiempos» y carga del audio comprobadas. El marco temporal de QA no forma parte del sitio publicado. Captura completa del bloque en escritorio entregada por separado.

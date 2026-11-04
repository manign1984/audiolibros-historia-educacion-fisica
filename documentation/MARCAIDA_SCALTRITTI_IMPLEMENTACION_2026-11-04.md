# Marcaida y Scaltritti · Implementación para revisión

Fecha: 4 de noviembre de 2026. Directrices canónicas v2.0. Continuación de la propuesta aprobada y de la auditoría conservada en esta rama.

## Resultado editorial

Se implementó el recorrido en `portable-site/textos/marcaida-scaltritti-estado-nacional/`: Inicio, Autor, Contexto (tres miradas), Lectura y Créditos. En 1363 × 936 CSS, con encabezado de 80 px, cada una de las siete unidades mide 856 px. Contexto aborda unidad política en disputa, mecanismos combinados de autoridad y modernización desde arriba. Se distingue la elaboración didáctica de las citas y se explicita el alcance del vínculo con la historia de la Educación Física.

La identidad propia emplea papel claro, tinta petróleo y óxido, tipografía editorial y un diagrama original de tramas. La ilustración no se presenta como fuente histórica ni mapa. El bloque Autor reúne dos perfiles equivalentes y fuentes biográficas; utiliza iniciales identificadas como recurso tipográfico hasta verificar retratos y atribuciones.

Se reutilizan `JourneyHeader`, `CanonicalReadingEntry`, `IntegratedReader` y `JourneyCredits`. El bloque 04 conserva la geometría canónica y adapta contenido y paleta. El lector compartido agrega únicamente una etiqueta de versión opcional y un mensaje de carga que no promete saltos sincronizados cuando la obra está pendiente; las otras obras conservan sus valores predeterminados. Los estilos nuevos quedan bajo `.marcaida-page`, salvo la incorporación explícita de esta raíz a los selectores canónicos.

## Fuentes e integridad

El texto accesible conserva el cuerpo y las 18 entradas bibliográficas del TXT cotejado con el PDF. Sólo se normalizan espacios y se reorganizan párrafos; la puntuación se conserva. Incluye introducción y cuatro apartados. El lector contiene 123 oraciones del cuerpo y tres unidades de portada. Esta copia de cátedra no contiene las notas al pie del volumen editorial; se advierte en lectura y créditos.

PDF de cátedra: 445284 bytes, 9 páginas, SHA256 `9311da9f8094f07322e06c907409b03f6cbba4e9b69fd685a3457ab58490818c`. Su descarga anónima desde Drive requiere inicio de sesión, aunque el acceso autenticado fue posible. Se incluye la copia exacta en los recursos del repositorio para que el enlace de la web funcione sin esa barrera.

MP3: 64845012 bytes, 2026.374625 segundos (33:46.375), SHA256 `cc324ffa8999233c94a76521b097eb6c7e81d43182d9df5ef49a46413b76b5ba`. Se comprobó la descarga anónima y su identidad con el original autenticado. El archivo grande se materializa al compilar mediante `scripts/prepare-marcaida-assets.mjs`, que verifica tamaño y hash y detiene la compilación ante un cambio. No queda enlazado a Drive para la reproducción del sitio publicado. La compilación limpia depende de la disponibilidad de esa fuente pública y de curl. El PDF sí se versiona directamente.

## Sincronización: hallazgo y límite

El VTT original tiene 361 cues y termina en 1878.531 segundos, antes del cierre del audio. Se conserva sin alteración en `data/marcaida-scaltritti-original.vtt`. Se prepara, por separado, una copia de texto corregido con los tiempos originales explícitamente NO validados; elimina un cue exclusivamente SSML y no se sirve al lector.

Un reconocimiento automático del MP3 completo con faster-whisper base identifica el cierre del cuerpo hasta 2020.14 segundos: el tramo final continúa el capítulo y no corresponde a la bibliografía. Reconoce «Rusia y China» en torno a 1917–1924 segundos, frente a «Europa y China» en el VTT y su marca temporal anterior. Esta evidencia automática orienta el cotejo; no equivale a una escucha humana ni certifica exactitud temporal.

`data/marcaida-scaltritti-alineacion-revision.json` conserva el procedimiento y los resultados para revisión: coincidencias léxicas en 123 oraciones, con límites coincidentes en 110. No se interpolan tiempos de las restantes. El resultado no se importa al lector y declara `humanAuditoryReview: false`.

El recorrido público permanece «Edición en revisión», con estado de catálogo `preparation` y sincronización `pending`. Leer, escuchar y anotar son acciones independientes; no hay resaltado automático, reproducción desde oración ni promesa de sincronización verificada. Las notas exportadas distinguen el momento de reproducción al anotarlas de una marca sincronizada de la oración. Las tarjetas del cuaderno también identifican esa posición como «audio al anotar». Quedan pendientes el cotejo auditivo fino y los retratos acreditados.

## Validación realizada

- `test:marcaida`: estructura, bibliografía, identidad de pasajes, ausencia de tiempos en el documento de lectura, claves aisladas de almacenamiento, título 1852–1880, estado de revisión y hashes de audio/PDF.
- Regresión: `test:library`, `test:two-works`, `test:hobsbawm`, `test:aisenstein`.
- Compilación y `verify:build` para raíz y para `/audiolibros-historia-educacion-fisica/`.
- Navegador: navegación por teclado, apertura y cierre del lector, reproducción y pausa, desplazamiento manual, velocidad 1.25×, selección de pasaje, nota vinculada, recuperación de nota/posición/velocidad tras recarga.
- Descargas TXT y JSON verificadas fuera del iframe de pruebas: contenido y obra correctos; JSON declara `audioTimeBasis: playback-position-at-annotation`. El capturador de descargas no respondió dentro del iframe, por lo que se repitió con éxito en la página directa.
- Responsive en viewports CSS 1363×936, 1280×720, 768×1024, 390×844 y 320×640. Sin desbordamiento horizontal: anchos cliente/documento iguales (1348/1348, 1265/1265, 753/753, 375/375 y 305/305 respectivamente). En móvil el contenido crece en altura para conservar legibilidad. Las cinco secciones siguen accesibles en el encabezado.
- Comprobación adicional del tamaño raíz al 200% sin desbordamiento; no sustituye una prueba de zoom real del navegador. No se declara auditoría exhaustiva WCAG ni prueba con lector de pantalla.
- Capturas de Inicio, Autor, tres miradas de Contexto, entrada de Lectura, Créditos y lector móvil. La página temporal `layout-qa.html`, las dependencias ASR y los datos locales de prueba no forman parte del sitio versionado.

## Integración

Trabajo iniciado sobre `research/marcaida-scaltritti-auditoria-2026-11-04` y recuperado tras la interrupción en `feat/marcaida-scaltritti-recorrido-20261104`, conservando los archivos originales. La integración se realiza mediante pull request después de los controles. GitHub Actions agrega la prueba específica de Marcaida/Scaltritti. El despliegue usa el flujo existente de GitHub Pages. La edición queda disponible para evaluar su aplicación real sin convertir la sincronización pendiente en una prestación aprobada.


## Complemento editorial · Notas de la edición original (04/11/2026)

Se incorporan las **diez llamadas numeradas** que aparecen en el capítulo de la primera edición, segunda reimpresión de 2013 (pp. 49–60), tomando como referencia [el ejemplar editorial de CEDINPE-UNSAM](https://cedinpe.unsam.edu.ar/sites/default/files/pdfs/scaltritti-historia_reciente.pdf).

- Las llamadas son números diferenciados de las anotaciones personales, con acceso por teclado. Al activarlas se abre el apartado de notas académicas del lector y se puede volver al pasaje original.
- Cada nota incluye página impresa y enlace a la edición original, para cotejarla en su fuente.
- Las **notas 1 y 4**, explicativas, se presentan como **síntesis editoriales**, no como transcripciones textuales de la edición.
- La **nota 2** ya había sido incorporada al cuerpo del apartado 2 en el material de cátedra; se mantiene esa ubicación y su referencia informa del traslado, sin duplicar el contenido.
- Las **notas 3 y 5–10** recuperan los datos bibliográficos correspondientes. La nota 5 conserva la variante de título del aparato original y advierte que la bibliografía final usa otra formulación.
- Todas son **solo textuales**: no se agrega locución, no se asignan inicios o finales temporales y no se activa ninguna sincronización. El MP3, el documento fuente y las claves de notas personales conservan sus valores originales.
- El aviso de los créditos identifica que el PDF de cátedra carece de las notas y que las referencias del lector se reconstruyen, con acceso al original.

Esta mejora hace visible el aparato de notas sin modificar silenciosamente el cuerpo de la edición de cátedra. La decisión sobre una eventual restitución *literal* de todas las notas deberá tramitarse con el material y las autorizaciones editoriales correspondientes; las síntesis actuales no deben presentarse como transcripción fiel.


## Auditoría de autorías y catálogo (04/11/2026)

**Retratos:** La búsqueda pública por nombres completos y variantes en catálogos bibliográficos, páginas académicas y educativas, repertorios y resultados de imágenes no proporcionó una pareja de fotografías cuya identidad personal y permiso de reproducción se puedan verificar. No se incorporan fotografías ajenas, ilustraciones antropomórficas generadas ni atribuciones supuestas. Se conservan los monogramas EM/MS como recurso tipográfico y se retira de la interfaz pública la nota sobre una búsqueda pendiente, según CAN-01.

**Biografías:** Elena Marcaida: la reseña de [Página/12, 2012](https://www.pagina12.com.ar/diario/universidad/10-195385-2012-06-01.html) verifica su docencia y coordinación en el CBC desde 1985; [Dialnet](https://dialnet.unirioja.es/servlet/libro?codigo=4557) y catálogos documentan la coordinación de obras de historia económica y social. Mabel Scaltritti: la [Escuela Normal Nº 1, 2011](https://centroderecursosnormal1.blogspot.com/2011/05/) documenta su licenciatura en Historia (Université Paris VII), docencia en CBC y trabajo curricular; [Ministerio de Educación, Cuadernos para el aula](https://www.bnm.me.gov.ar/giga1/documentos/EL001102.pdf) acredita sus funciones de autoría/coordinación/supervisión. Ambos perfiles se reformulan sin inventar trayectorias personales.

**Semántica de disponibilidad:** Marcaida/Scaltritti recibe estado `review`, distinto de `available` (destacados consolidados) y `preparation` (solo ficha bibliográfica). El filtro «Leer y escuchar» y la estantería correspondiente incluyen tanto `available` como `review`; hay también filtro exclusivo «Edición en revisión». La ficha declara audio 33:46, lectura y anotaciones, y sincronización pendiente. El carrusel de portada continúa limitado a cuatro obras `available`; la ficha de Marcaida sigue siendo accesible desde catálogo y la ruta física del sitio.

**Cronología:** La colección «Cuerpos, escuela y nación» abarca ahora 1852–1930; la tarjeta de la obra precisa 1852–1880. Se evita asignar una obra de 1852–1880 a una estantería titulada exclusivamente 1880–1930.

**Conservación:** Sin modificaciones en texto académico, audio, VTT, anotaciones ni alineación. Enlace, claves de almacenamiento y estructura de las cinco secciones estables. No declarar sincronización validada ni permisos fotográficos inexistentes.

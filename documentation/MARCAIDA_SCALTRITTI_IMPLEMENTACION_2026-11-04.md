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

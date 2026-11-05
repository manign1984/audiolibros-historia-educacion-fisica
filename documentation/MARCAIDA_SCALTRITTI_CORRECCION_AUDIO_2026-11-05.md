# Corrección de la grabación de Marcaida y Scaltritti · 5 de noviembre de 2026

## Incidencia comprobada

Se identificaron **dos versiones distintas** de `La construcción del Estado nacional argentino (1852–1880)` en Google Drive:

| Atributo | Audio anterior de la web | Archivo correcto de la carpeta AUDIOS |
|---|---:|---:|
| Drive | `1OdJmzsqdlV-xaPx7uyYaej8PJBL6QZ9s` | `1eDUqSynrr3sdVx3ik-NFHiQncqX-AbGk` |
| Duración ffprobe | 2026.374625 s (33:46.375) | **1878.909388 s (31:18.909)** |
| Tamaño | 64,845,012 bytes | **45,231,840 bytes** |
| SHA-256 | cc324ffa8999233c94a76521b097eb6c7e81d43182d9df5ef49a46413b76b5ba | **e5b586268ac633f814e898003baf7e8de690fce605db7dd708954613267deedf** |

El archivo correcto, **03 Marcaida & Scaltriti, La construcción del Estado Nacional Argentino.mp3**, se incorporó a AUDIOS el 4/11/2026. La identificación de la voz correcta surge de la indicación del usuario, que había escuchado en el sitio una versión con otra voz.

El **VTT original de 361 segmentos termina en 1878.531 segundos**, a solo **0.378388 segundos** del nuevo MP3. A diferencia de la grabación anterior, la escala temporal del VTT coincide con la nueva grabación.

## Fuente de publicación y derechos de acceso

Se conserva **sin modificaciones** el archivo de trabajo en la carpeta AUDIOS. Se creó una copia de publicación idéntica byte a byte en la carpeta de recursos públicos Audiolibros, con acceso de lectura heredado de esa carpeta.

- Fuente editorial: https://drive.google.com/file/d/1eDUqSynrr3sdVx3ik-NFHiQncqX-AbGk/view
- **Copia exacta para compilación:** https://drive.google.com/file/d/1j-Y41ElgZfLe0Lkp5bdFWmOcx3ktGiEz/view
- Se comprobó igualdad de bytes/tamaño y SHA-256 entre ambas copias.
- Recurso público de la web: `/assets/marcaida-audiolibro-2026-11.mp3`, nombre distinto para evitar que los navegadores recuperen la grabación antigua de caché.
- El build detiene la compilación si el material recuperado no coincide con los 45.231.840 bytes y el SHA-256 indicados.

## Reconstrucción del seguimiento por párrafos

El cuerpo del lector conserva **42 párrafos**, los mismos IDs y exactamente las mismas palabras. Se alinearon sus **3.980 palabras** por orden con los tokens del VTT original; **3.976** coincidieron exactamente. Las cuatro discordancias léxicas se documentan en la investigación previa (incluyendo `Rusia` frente a `Europa` en VTT), sin corregir el texto académico por sustituciones de audio.

Los 42 intervalos nuevos de `src/marcaida/paragraphSync.js` toman inicio/fin del VTT y, cuando una frontera de párrafo cae dentro de un cue, calculan su posición según la cantidad y el orden de palabras de ese cue. **No son mediciones acústicas por fonema**. La concordancia completa de duración y contenido elimina la necesidad de transferir la sincronización del MP3 anterior. Los tiempos se revisan como seguimiento orientativo por párrafo; no se declara un cotejo auditivo exhaustivo.

Los cuatro huecos mayores a 5 s se encuentran en transiciones de apartados con rótulos/pausas, no se rellenaron artificialmente. La última oración termina en 31:18.531, antes del cierre del MP3.

## Alcance y prevención de regresiones

- **Nueva grabación**, duración y enlace de fuente, intervalos de 42 párrafos y configuración de Marcaida.
- Nueva clave `marcaida-scaltritti-reader-state-v2` para reiniciar el progreso basado en segundos de la voz anterior. La clave de notas personales **se conserva** en `marcaida-scaltritti-reader-notes-v1`, sin eliminar anotaciones.
- Mantener `paragraph-preview` y el catálogo en revisión hasta la validación perceptiva de la nueva voz.
- Actualizar contrato transversal `validation/works.json` con hashes y tamaños reales, pruebas y controles de publicación.
- **No tocar** las otras cuatro obras, las diez notas académicas, la bibliografía, el PDF, los apartados, la fidelidad textual ni las Directrices canónicas 2.0.
- Los informes automáticos sobre la grabación de 33:46.375 quedan como evidencia histórica: **no deben utilizarse como tiempos de publicación actuales**.

## Criterios de verificación

Comprobar la descarga del MP3 desde Drive en una compilación limpia, comparar SHA/tamaño, ejecutar pruebas de las cinco obras y validaciones raíz/Pages, verificar el sitio publicado, y controlar perceptualmente al menos la voz inicial, un pasaje intermedio y el final, con su resaltado correspondiente. Una prueba de integridad o la coincidencia de duración no sustituye la escucha humana.

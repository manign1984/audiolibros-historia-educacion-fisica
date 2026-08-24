# Matriz de fidelidad y procedencia

## Criterios

- **Literal:** copiado byte a byte desde el commit publicado o extraído directamente de sus datos sin cambiar valores.
- **Reconstruido:** creado para permitir la migración o derivado de información exacta cuando el archivo original no estaba disponible.
- **Modificado por solicitud editorial:** parte de la copia literal migrada y luego incorpora un cambio explícitamente solicitado para la nueva versión GitHub.
- **Documentación:** análisis nuevo que describe el estado recuperado o sus cambios posteriores.

| Componente | Clasificación | Evidencia | Observación |
|---|---|---|---|
| `portable-site/src/App.jsx` | Modificado por solicitud editorial | Base literal del commit `7882327…`; cambio posterior del 24/08/2026 | Se retiró el contenido visible desde “La brújula del texto” hasta la antigua Sección 04 · Conciencia histórica inclusive; se eliminaron Partido y Conciencia histórica de la navegación y Créditos pasó a ser Sección 03. |
| `portable-site/src/IntegratedReader.jsx` | Literal | SHA-256 `171d43db4e347d4529a915b20804405b3ebf7002526d484f285e1a0d3bf1b992` | Reproductor, notas, exportación y sincronización |
| `portable-site/src/data.js` | Literal respecto de la migración, con cambios editoriales posteriores registrados en Git | SHA-256 de la copia migrada `e74f7d64229ecaa562e0c78821bde5b99afa75ab56fd497312191b1828caf538` | Línea de tiempo, estrategias, jugadores y actividades; el historial Git conserva los cambios posteriores. |
| `portable-site/src/readingDocument.js` | Literal | SHA-256 `42743f60e54b7d247891ed49fe3271c9ebff1124fcdcbe45dd171fb63f152982` | Texto y tiempos que consume el Site |
| `portable-site/src/styles.css` | Literal | SHA-256 `1233c47a46f497753c75f171d4954082d340b0190f58a441f8934929f1d3d1df` | Diseño general y responsive |
| `portable-site/src/reader.css` | Literal | SHA-256 `e428f6f34d306160330634d3d2951486a2f086a7b5b18a93faf93411aa7f4bc9` | Estilos del lector y sus breakpoints |
| `portable-site/src/main.jsx` | Literal | Comparación byte a byte con el commit | Entrada React ya presente en el Site |
| `portable-site/index.html` | Literal | SHA-256 `9937b866ed78617bdb74e5c0ad06879a1ff467e5387b8b283928608e84cbe61c` | Metadatos y contenedor raíz |
| `portable-site/public/assets/**` | Literal | Comparación completa y `data/assets-inventory.csv` | 36 recursos preservados |
| MP3 | Literal | SHA-256 `46b19c38a1b0d15db4010ab1dd002f72a99939f1486116595d257286deeeae2c` | Audiolibro usado por el Site |
| Generador desde SRT | Literal | Comparación byte a byte | Requiere el SRT externo, no incluido en el Site |
| `data/reading-sync_exact.json` | Extracción literal | Generado desde `readingDocument.js` | 201 unidades, textos e intervalos exactos |
| `data/content-structure_exact.json` | Extracción literal de la versión migrada | Generado desde `data.js` y `readingDocument.js` | Conserva la estructura extraída del estado migrado; no se regenera automáticamente tras cambios editoriales posteriores. |
| `portable-site/package.json` | Reconstruido | Declarado en el manifiesto técnico | Dependencias fijadas para Vite puro |
| `portable-site/package-lock.json` | Reconstruido mecánicamente | `npm install --package-lock-only` | Resolución reproducible de la capa portable |
| `portable-site/vite.config.js` | Reconstruido | Declarado en el manifiesto técnico | Sustituye Vinext/Cloudflare, no la aplicación |
| `portable-site/.gitignore` | Reconstruido | Declarado en el manifiesto técnico | Higiene del paquete |
| `data/reading-sync_reconstructed-from-site.srt` | Reconstruido | Derivado de las 201 unidades exactas | No es el SRT de 561 cues de ElevenLabs |
| Documentación e inventarios | Documentación | Este paquete | Auditoría y guías nuevas |

## Validación de igualdad de la migración inicial

En la migración se compararon recursivamente `src/` y `public/assets/` entre la copia fresca del origen y la versión portable. También se compararon por separado `index.html` y el generador de lectura. En ese momento no se encontraron diferencias.

A partir de los cambios editoriales posteriores, Git pasa a ser la fuente de trazabilidad de las diferencias respecto de aquella copia literal. La versión de seguridad original continúa identificada por el commit `7882327b5bf619ba81335d136e9eddc96cf894c9`.

## Cambio editorial del 24/08/2026

Por decisión del proyecto, la página principal deja para una etapa futura todo el trabajo práctico posterior a la lectura. En la interfaz actual, la Sección 02 termina inmediatamente después del lector integrado y continúa directamente con Créditos. Se retiraron del componente de aplicación la brújula de estrategias, los ejercicios de calentamiento, el partido pedagógico y el gabinete de conciencia histórica, junto con su lógica de interacción y sus entradas de navegación. El lector, su sincronización audio-texto, las notas, el contexto histórico y el carrusel no fueron modificados por este recorte.

## Alcance de la reconstrucción del SRT

El SRT reconstruido:

- usa exactamente los textos visibles que consume el Site;
- conserva exactamente los tiempos de inicio y fin de las 201 unidades;
- permite intercambio y revisión externa;
- no recupera la segmentación original de 561 cues;
- no se presenta como archivo original ni como sustituto forense del SRT de ElevenLabs.

La fuente de verdad para reproducir el comportamiento del lector es `readingDocument.js`; la extracción JSON es su representación portátil sin pérdida.

# Arata y Mariño · Lector integrado canónico

**Estado:** COMPLETA · código en `main`, PR #120 y despliegue GitHub Pages verificados el 11/11/2026.

## Entrada pública y arquitectura única

- Página: https://manign1984.github.io/audiolibros-historia-educacion-fisica/textos/arata-marino-auroras-tempestades/#lectura .
- `src/arata-marino/ArataMarinoApp.jsx`: cinco bloques y entrada directa `IntegratedReader` + `Launcher={CanonicalReadingEntry}`.
- `src/arata-marino/readerContract.js`: comparte el documento `arataReadingDocument` y `arataReaderConfig`, con rutas compatibles con raíz/GitHub Pages.
- `src/arata-marino/readerConfig.js`: fuente de audio, duración esperada, seguimiento por párrafos, notas, exportación y claves locales únicas.
- `src/arata-marino/buildArataMarinoReadingDocument.js`: construye un modelo fiel desde el texto académico y las marcas SRT, sin inventar tiempos.
- **No hay formulario de carga de TXT/SRT/MP3 ni otro diálogo de acceso.** El botón conserva «ABRIR EL LECTOR» y abre una sola ventana del motor compartido.

## Preparación reproducible y archivos

Los 17 fragmentos binarios consecutivos del MP3 se conservan en `public/assets/arata-marino/audio/audio-00.part` … `audio-16.part`. El SRT original en `public/assets/arata-marino/subtitulos.srt`; el PDF académico en `source-assets/arata-marino/edicion-academica.pdf`.

`scripts/prepare-arata-marino-assets.mjs` verifica las huellas SHA-256 del PDF y SRT, ejecuta `pdftotext -layout` para el TXT exacto (66.827 bytes) y genera `readingDocument.generated.json`. El modelo incorpora apertura y ocho apartados, 79 párrafos, 78 anclajes aproximados, 13 referencias bibliográficas y dos recursos complementarios. El único cuadro estadístico no tiene tiempo fabricado. El MP3 completo tiene 36.125.008 bytes (duración 3612,447 s), y el SRT termina a 3616,800 s; ambas fuentes se conservan intactas y su diferencia está documentada en el validador común.

**Construcción y controles desde `portable-site/`:**

```sh
npm ci
# En entornos Linux sin Poppler: instalar poppler-utils previamente.
npm run test:arata-marino
npm run build
npm run verify:build
npm run validate:works -- --dist dist
```

Los workflows de CI y Pages instalan Poppler y ejecutan compilaciones con la base correcta. `validation/works.json` registra 21 recursos y los hashes originales. La reproducción de los fragmentos se realiza sin transcodificación por `IntegratedReader`, con validación de tamaño total.

## Resultado de aceptación

PR #120 fusionada (`8fb1920c4ded202cd68404e1f5443c46e0e5c555`), CI [43121250309](https://github.com/manign1984/audiolibros-historia-educacion-fisica/actions/runs/43121250309) y Pages [43121465571](https://github.com/manign1984/audiolibros-historia-educacion-fisica/actions/runs/43121465571) **SUCCESS**. Prueba DOM: apertura del modal con un clic, 79 párrafos renderizados, 17 partes reconstruidas, controles compartidos, ausencia de selector de archivos y de franja de subtítulos independiente. El guardado/exportación usa el motor común y sus regresiones están cubiertas por CI.

**Límite de evidencia:** no se ha confirmado manualmente la experiencia visual/audio completa en Chrome del usuario; atender únicamente un fallo concreto que pueda mostrar esa comprobación, sin repetir auditorías acústicas ni rediseñar el lector.

Las observaciones editoriales detectadas históricamente se conservan en `documentation/OBSERVACIONES_DERECHOS_PENDIENTES.md` para tratamiento institucional separado, conforme a las Directrices canónicas vigentes.

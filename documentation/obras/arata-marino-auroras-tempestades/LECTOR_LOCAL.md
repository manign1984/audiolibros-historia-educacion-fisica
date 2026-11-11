# Arata y Mariño · Preparación y prueba local del lector

**Estado:** candidato técnico de desarrollo, sin redistribución pública de texto, PDF, MP3 o SRT. La página editorial publicada permanece intacta.

## Implementación recuperable

- `portable-site/src/arata-marino/buildArataMarinoReadingDocument.js`: adapta el texto académico extraído en modo *layout* (folios 182–201), conserva ocho apartados, bibliografía de la lección y referencias multimedia. El cuadro estadístico 1955–1975 se representa de manera accesible, sin tiempo inventado.
- `portable-site/src/arata-marino/readerConfig.js`: configuración de 17 fragmentos consecutivos del MP3 (suma esperada de 36.125.008 bytes), claves propias para progreso y anotaciones.
- `portable-site/src/arata-marino/ArataMarinoReaderPreview.jsx`: usa `IntegratedReader` y `CanonicalReadingEntry` existentes, con seguimiento aproximado por párrafos. No agrega una segunda franja de subtítulos.
- `ArataMarinoApp.jsx` conserva la experiencia editorial abierta en producción. La vista integrada solo se habilita localmente con la bandera explícita `VITE_ARATA_MARINO_READER_PREVIEW=1`.

## Recursos necesarios solo en la computadora de desarrollo

**No subir materiales académicos ni derivados a un repositorio público.** La carpeta `portable-site/public/assets/arata-marino-local/` queda excluida de Git. Antes de ejecutar cualquier build de despliegue, asegurarse de que el entorno usado no esté incluyendo esta carpeta.

Guardar dentro de ese directorio local:

- `edicion-academica.txt`, preparado mediante extracción `pdftotext -layout` del PDF académico facilitado, no desde el texto de narración que carece de la bibliografía.
- `subtitulos.srt`, el SRT original, sin modificar las marcas temporales.
- `audio/audio-00.part` a `audio/audio-16.part`, fragmentos binarios consecutivos de la **misma** exportación MP3 original, sin transcodificación.

La concatenación debe corresponder exactamente al MP3 original. Comparar SHA-256 del MP3 con la concatenación antes de atribuirle identidad binaria; el tamaño por sí solo no lo demuestra.

El comando implementado para efectuar esa comprobación local, una vez disponible el MP3 original, es:

```sh
cd portable-site
node scripts/verify-arata-audio.mjs /ruta/segura/original.mp3 public/assets/arata-marino-local/audio
```

El programa lee el original y las 17 partes consecutivas sin modificar archivos; compara la longitud y el SHA-256 de ambas secuencias de bytes. La prueba automatizada utiliza binarios ficticios para comprobar la detección de corrupción. Los nombres y tamaños esperados están registrados en `documentation/PRODUCCION_ACTIVA.md`.

Para activar la vista de desarrollo, configurar `VITE_ARATA_MARINO_READER_PREVIEW=1` y `VITE_ARATA_MARINO_ASSET_PREFIX=assets/arata-marino-local/`, y ejecutar `npm run dev` desde `portable-site/`. Sin esa bandera, incluso en desarrollo, el bloque 04 conserva el diálogo de acceso a la edición digital oficial.

## Pruebas y límites

`npm run test:arata-marino` utiliza solo texto ficticio y comprueba contratos de SRT, estructura, metadatos, almacenamiento y rutas de audio.

Validación local realizada con el PDF y SRT originales (sin versionar su contenido): 79 párrafos académicos, 78 con referencia temporal aproximada; un cuadro estadístico conservado **sin** tiempo; 13 entradas bibliográficas y dos registros de recursos multimedia; SRT 796 cues, última marca 01:00:16,800. El SRT del Drive y el de la rama histórica tienen el mismo SHA de blob Git `7900c9b1583e26b9a87235f313350cdbaf0c2037`.

**Pendiente:** reconstruir y cotejar binariamente MP3 contra una copia original verificable y realizar la comprobación perceptiva local del lector. No hubo prueba acústica ni navegación con medios reales. Esta preparación no acredita licencia para distribuir públicamente el libro o sus derivados.

**Nota de exposición:** una rama en un repositorio público también es pública, aunque no se fusione a `main`. Por eso esta implementación nueva excluye los materiales; el historial de la rama anterior con activos protegidos requiere tratamiento aparte si se quiere revocar su acceso público.

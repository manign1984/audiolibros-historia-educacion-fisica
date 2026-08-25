# Lector compartido

## Regla de arquitectura

`src/IntegratedReader.jsx` es la única implementación funcional del lector. Pineau lo importa desde `src/App.jsx` y Orbuch desde `src/orbuch/OrbuchApp.jsx`. No debe crearse una copia por obra.

El motor resuelve apertura/cierre, audio, play/pausa, seek, ±10 segundos, velocidad, volumen, mute, capítulos, selección de oración, seguimiento cuando hay tiempos, tamaño tipográfico, notas, persistencia, navegación desde notas, exportación y Web Share.

Cada obra conserva su página, estilos, texto, audio, PDF, metadatos y almacenamiento. La configuración vive en `src/readerConfigs.js`.

## Configuración por obra

| Campo | Uso |
|---|---|
| `workId`, `mark`, `shortTitle`, `authorAndTitle`, `experienceName` | Identidad y exportación |
| `audiobookUrl`, `audiobookExternalUrl`, `pdfUrl` | Recursos locales y respaldo externo |
| `storage.notesKey`, `storage.stateKey` | Namespaces estables y exclusivos |
| `export.*` | Nombres de archivo y título de compartir |
| `sync.status` | `ready` solo con tiempos reales; `pending` si no existen |
| `sync.*Title`, `sync.*Description`, `sync.coverMessage` | Copia honesta sobre el estado de la obra |

Las claves actuales son:

- Pineau: `fresco-noble-reader-notes-v1` y `fresco-noble-reader-state-v1`.
- Orbuch: `orbuch-educar-cuerpo-reader-notes-v1` y `orbuch-educar-cuerpo-reader-state-v1`.

## Contrato de `readingDocument`

El componente recibe un objeto con `title`, `subtitle`, `author`, `duration`, `frontMatter`, `sections`, `endnotes`, `bibliography` y, cuando corresponde, `sourceNote`.

Cada sección tiene `id`, `title`, `shortTitle` y `paragraphs`. Cada párrafo contiene `id`, `kind` y `sentences`. Toda oración requiere `id` y `text`. `start` y `end` solo se agregan cuando provienen de una sincronización real verificada.

El documento de Pineau conserva 201 unidades temporizadas. El de Orbuch se construye desde su texto accesible y contiene 154 unidades temporizadas a partir del SRT aportado por el proyecto. El generador exige igualdad completa del texto normalizado, ajusta la duración del SRT a la del MP3 definitivo y registra hashes y controles contra la onda de audio en `orbuch-timings.json`.

## Audio, PDF y sincronización

El audio y el PDF se sirven como assets locales; el audio puede declarar además una URL externa de respaldo. La duración declarada debe verificarse contra el archivo real.

Con `sync.status: 'ready'`, el motor habilita oración activa, reproducción desde una oración, salto temporal por capítulo y seguimiento automático. Con `pending`, esas funciones dependientes de tiempos quedan ocultas o inactivas. El resto del lector sigue disponible.

En una obra no sincronizada, una nota guarda la posición real del reproductor al crearse. La exportación la etiqueta como `playback-position-at-annotation`: permite volver a ese punto sin presentarlo como alineación oración–audio.

El selector de reproducción vive en el motor común. Las velocidades publicadas son `0,75×`, `0,9×`, `1×`, `1,1×`, `1,25×`, `1,5×` y `2×`, por lo que cualquier cambio controlado allí afecta a ambas obras.

## Exportación

TXT y JSON toman autor, título, sección, posición del audio, texto seleccionado, nota y fecha desde la configuración, el documento y el estado real. El JSON conserva `version: 1` y el arreglo histórico `notes`, y agrega una vista enriquecida en `entries` para mantener compatibilidad.

## Incorporar una tercera obra

1. Preparar página, estilos y recursos singulares.
2. Crear su `readingDocument` sin inventar tiempos.
3. Agregar una configuración con claves de almacenamiento únicas.
4. Importar el mismo `IntegratedReader.jsx` y pasar `readingDocument` y `config`.
5. Incorporar catálogo y entrada HTML física de Vite.
6. Extender pruebas de catálogo, recursos, aislamiento, build raíz y Pages.

No hace falta un CLI, CMS, formulario ni generador automático de páginas.

# Biblioteca académica — versión estática portable

Esta carpeta contiene la biblioteca académica y su primera obra, la migración ejecutable de la Reforma Fresco–Noble.

## Rutas

- `/`: biblioteca, buscador y catálogo.
- `/textos/pineau-fresco-noble/`: experiencia Fresco–Noble completa.

Vite compila ambas rutas como documentos HTML físicos, sin servidor, base de datos ni servicios propios de Sites. El nombre provisional de la biblioteca y el catálogo se editan en `src/biblioteca/catalog.js`. La explicación de arquitectura y continuidad está en `../documentation/BIBLIOTECA_ACADEMICA.md`.

## Fidelidad

La obra se originó en el estado respaldado `FN-PREMIG-20260823-SITEV57-7882327`, commit `7882327b5bf619ba81335d136e9eddc96cf894c9`. Permanecen sin cambios en esta integración:

- `textos/pineau-fresco-noble/index.html`, copia del antiguo documento raíz;
- `src/IntegratedReader.jsx`;
- `src/data.js`;
- `src/main.jsx`;
- `src/reader.css`;
- `src/readingDocument.js`;
- todo `public/assets/`
- `scripts/generate-reading-document-from-srt.mjs`

La biblioteca agrega `src/biblioteca/` y reemplaza el documento raíz. `App.jsx` y `styles.css` solo incorporan enlaces de regreso; `vite.config.js` suma las entradas multipágina. La capa portable continúa compuesta por:

- `package.json`
- `vite.config.js`
- este `README.md`
- `.gitignore`

No se reescribieron el contenido, la lógica del carrusel, el lector, la sincronización, las notas ni los recursos de la obra.

## Requisitos

- Node.js `20.19+` o `22.12+`
- npm

## Uso local

```bash
npm install
npm run dev
```

## Compilación

```bash
npm ci
npm run build
```

El resultado queda en `dist/` y puede alojarse en cualquier servicio de archivos estáticos.

## Condición de alojamiento

La versión preserva en sus fuentes las rutas absolutas originales (`/assets/...`). Por defecto se compila para la raíz de un dominio o subdominio.

Para GitHub Pages, `vite.config.js` acepta `GITHUB_PAGES_BASE`. Los workflows calculan ese valor desde el nombre vigente del repositorio y transforman las rutas únicamente durante la compilación. De ese modo la publicación funciona dentro del subdirectorio y conserva la ubicación pública de los recursos.

La versión pública se encuentra en:

<https://manign1984.github.io/biblioteca-historia-educacion-fisica/>

## Datos y privacidad

No existe backend. El navegador guarda únicamente:

- `fresco-noble-reader-notes-v1`
- `fresco-noble-reader-state-v1`

Las notas y el progreso de lectura permanecen en `localStorage` del dispositivo. No se envían a un servidor. La clave histórica `fresco-noble-genealogia` puede persistir en navegadores que usaron la actividad eliminada, pero la interfaz actual no la consulta.

## Dependencias externas durante la navegación

Cuatro imágenes de la línea de tiempo se cargan directamente desde Wikimedia Commons. El video se incrusta desde YouTube sin cookies y algunos botones abren Google Drive o fuentes externas. El inventario completo está en la documentación de la migración.

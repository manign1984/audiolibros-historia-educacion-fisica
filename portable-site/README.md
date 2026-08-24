# La reforma educativa Fresco–Noble — versión portable

Esta carpeta contiene una migración ejecutable fuera de ChatGPT Sites. La aplicación se entrega como una SPA estática de React y Vite, sin servidor, base de datos ni servicios propios de Sites.

## Fidelidad

Los siguientes elementos fueron copiados literalmente del estado respaldado `FN-PREMIG-20260823-SITEV57-7882327`, commit `7882327b5bf619ba81335d136e9eddc96cf894c9`:

- `index.html`
- todo `src/`
- todo `public/assets/`
- `scripts/generate-reading-document-from-srt.mjs`

Solo se reconstruyó la capa de arranque y compilación para eliminar la dependencia técnica de ChatGPT Sites/Vinext/Cloudflare:

- `package.json`
- `vite.config.js`
- este `README.md`
- `.gitignore`

No se reescribieron el contenido, la interfaz, la lógica del carrusel, las actividades, el lector, la sincronización, las notas ni los estilos.

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

Para GitHub Pages, `vite.config.js` acepta `GITHUB_PAGES_BASE=/reforma-fresco-noble/` y transforma esas rutas únicamente durante la compilación. De ese modo la publicación funciona dentro del subdirectorio sin modificar el código literal recuperado.

La versión pública se encuentra en:

<https://manign1984.github.io/reforma-fresco-noble/>

## Datos y privacidad

No existe backend. El navegador guarda únicamente:

- `fresco-noble-reader-notes-v1`
- `fresco-noble-reader-state-v1`
- `fresco-noble-genealogia`

Las notas, el progreso de lectura y el borrador genealógico permanecen en `localStorage` del dispositivo. No se envían a un servidor.

## Dependencias externas durante la navegación

Cuatro imágenes de la línea de tiempo se cargan directamente desde Wikimedia Commons. El video se incrusta desde YouTube sin cookies y algunos botones abren Google Drive o fuentes externas. El inventario completo está en la documentación de la migración.

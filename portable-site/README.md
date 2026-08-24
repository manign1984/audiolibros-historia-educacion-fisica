# Biblioteca académica — versión estática portable

Esta carpeta contiene la biblioteca académica y dos obras ejecutables: Iván Orbuch y la educación corporal en aula/oficina, y Pablo Pineau sobre la Reforma Fresco–Noble.

## Rutas

- `/`: biblioteca, buscador y catálogo.
- `/textos/orbuch-educar-al-cuerpo/`: experiencia Orbuch, fuentes primarias, texto y audiolibro.
- `/textos/pineau-fresco-noble/`: experiencia Fresco–Noble completa.

Vite compila las tres rutas como documentos HTML físicos, sin servidor, base de datos ni servicios propios de Sites. El nombre provisional de la biblioteca y el catálogo se editan en `src/biblioteca/catalog.js`. La explicación de arquitectura y continuidad está en `../documentation/BIBLIOTECA_ACADEMICA.md`.

## Fidelidad

Pineau se originó en el estado respaldado `FN-PREMIG-20260823-SITEV57-7882327`, commit `7882327b5bf619ba81335d136e9eddc96cf894c9`. Permanecen sin cambios en esta integración:

- `textos/pineau-fresco-noble/index.html`, copia del antiguo documento raíz;
- `src/data.js`;
- `src/main.jsx`;
- `src/reader.css`;
- `src/readingDocument.js`;
- los 36 recursos originales de Pineau en `public/assets/`;
- `scripts/generate-reading-document-from-srt.mjs`

`src/IntegratedReader.jsx` ahora es un único motor parametrizado que importan Pineau y Orbuch. La configuración por obra está en `src/readerConfigs.js`; cada una conserva documento, recursos, estilos y almacenamiento propios. La guía para una tercera obra está en `../documentation/LECTOR_COMPARTIDO.md`.

La envoltura portable continúa compuesta por:

- `package.json`
- `vite.config.js`
- este `README.md`
- `.gitignore`

La sincronización de Pineau permanece intacta. Orbuch usa el MP3 real de 27:53, pero queda marcado como no sincronizado hasta recuperar un SRT/VTT auténtico.

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

<https://manign1984.github.io/audiolibros-historia-educacion-fisica/>

## Datos y privacidad

No existe backend. El navegador guarda únicamente:

- `fresco-noble-reader-notes-v1`
- `fresco-noble-reader-state-v1`
- `orbuch-educar-cuerpo-reader-notes-v1`
- `orbuch-educar-cuerpo-reader-state-v1`

Las notas y el progreso de lectura permanecen en `localStorage` del dispositivo. No se envían a un servidor. La clave histórica `fresco-noble-genealogia` puede persistir en navegadores que usaron la actividad eliminada, pero la interfaz actual no la consulta.

## Dependencias externas durante la navegación

Cuatro imágenes de la línea de tiempo se cargan directamente desde Wikimedia Commons. El video se incrusta desde YouTube sin cookies y algunos botones abren Google Drive o fuentes externas. El inventario completo está en la documentación de la migración.

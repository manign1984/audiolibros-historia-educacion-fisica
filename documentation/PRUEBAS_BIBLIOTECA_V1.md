# Pruebas de la biblioteca académica — etapa 1

## Alcance

Estas comprobaciones corresponden a la rama `feat/biblioteca-academica-v1`. La referencia de integridad es el SHA inicial de `main` `bbc447efd2b7f0b9ef77807123b3808f45694381`.

## Comandos ejecutados

Desde `portable-site/` se ejecutaron correctamente:

```bash
npm ci
npm run test:library
npm run build
npm run verify:build
GITHUB_PAGES_BASE=/reforma-fresco-noble/ npm run build
GITHUB_PAGES_BASE=/reforma-fresco-noble/ npm run verify:build
```

`test:library` comprueba el catálogo, la referencia APA 7 revisada, el orden por autor y título, la normalización de mayúsculas, tildes y signos, las búsquedas parciales y combinadas, el caso sin resultados y la construcción de rutas con y sin el `base` de GitHub Pages.

`verify:build` comprueba que la salida contenga documentos HTML físicos para la biblioteca y para Fresco–Noble, que ambas entradas carguen bundles distintos con el `base` correcto, que el enlace de regreso esté presente y que se conserven los selectores, recursos y marcadores funcionales del lector y la obra.

## Navegación y recursos

La salida para GitHub Pages se sirvió localmente bajo `/reforma-fresco-noble/`. Respondieron con HTTP 200:

- la biblioteca;
- la URL directa de `textos/pineau-fresco-noble/`;
- la miniatura de catálogo;
- el PDF;
- el MP3.

La existencia de un `index.html` físico en cada ruta permite abrir y recargar la obra sin depender de un fallback de SPA.

## Integridad de Fresco–Noble

Se compararon por SHA-256 con el estado inicial y permanecen idénticos:

- `src/IntegratedReader.jsx`;
- `src/data.js`;
- `src/readingDocument.js`;
- `src/reader.css`;
- `scripts/generate-reading-document-from-srt.mjs`;
- todos los archivos de `public/assets/`, incluidos audio y PDF.

El documento HTML interno de Fresco–Noble es idéntico al antiguo documento raíz. Las únicas modificaciones dentro de `App.jsx` y `styles.css` agregan el enlace discreto de retorno y su presentación. La verificación de build también impide la reaparición de las secciones posteriores a la lectura que habían sido retiradas.

## Responsive y accesibilidad

La hoja de estilos usa un diseño fluido y ajustes específicos a 720 px y 390 px, sin alturas fijas en las entradas. La referencia bibliográfica admite envoltura natural, la miniatura conserva su proporción, el buscador tiene etiqueta accesible, los resultados se anuncian mediante una región de estado y los enlaces y controles conservan foco visible.

El navegador remoto del entorno bloqueó la URL de previsualización local (`ERR_BLOCKED_BY_CLIENT`). Por esa razón no se registra como realizada una inspección visual interactiva en 360, 390, 768, 1024 y 1366 px. Esa revisión visual y la interacción manual completa con audio, selección y anotaciones quedan señaladas para la revisión de la Pull Request; las comprobaciones automatizadas y de integridad sí se completaron.

## Resultado

Las pruebas automatizadas, las dos compilaciones, la verificación de rutas y recursos y los controles de integridad finalizaron correctamente. El resultado del workflow remoto de CI se documentará en la Pull Request.

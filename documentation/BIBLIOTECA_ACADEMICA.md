# Biblioteca académica — arquitectura de la primera etapa

## Propósito

El repositorio dejó de representar conceptualmente una sola página y pasó a contener una biblioteca académica estática. La primera versión reúne una obra real: el recorrido dedicado al artículo de Pablo Pineau sobre la Reforma Fresco–Noble.

La biblioteca funciona sin backend, base de datos, autenticación ni CMS. El catálogo se edita manualmente y toda la búsqueda ocurre en el navegador.

## Rutas públicas

| Ruta conceptual | GitHub Pages | Contenido |
|---|---|---|
| `/` | `/audiolibros-historia-educacion-fisica/` | Biblioteca y catálogo |
| `/textos/pineau-fresco-noble/` | `/audiolibros-historia-educacion-fisica/textos/pineau-fresco-noble/` | Obra Fresco–Noble |

La aplicación usa una compilación multipágina de Vite. Cada ruta pública tiene un archivo `index.html` físico dentro de `dist/`, por lo que una apertura directa o una recarga de la obra no dependen de un router del navegador ni producen el 404 típico de una SPA en GitHub Pages.

`import.meta.env.BASE_URL` construye los enlaces entre biblioteca y obra. Los workflows obtienen el subdirectorio desde `GITHUB_REPOSITORY`, y `vite.config.js` adapta además los recursos `/assets/` al `base` resultante de GitHub Pages.

## Estructura

```text
portable-site/
├── index.html                              # biblioteca
├── textos/
│   └── pineau-fresco-noble/
│       └── index.html                      # documento HTML de la obra
├── src/
│   ├── biblioteca/
│   │   ├── LibraryHome.jsx                 # interfaz del catálogo
│   │   ├── catalog.js                      # configuración y fuente única de obras
│   │   ├── library.css                     # identidad neutral de la biblioteca
│   │   └── main.jsx                        # entrada React de la biblioteca
│   ├── App.jsx                             # recorrido Fresco–Noble
│   ├── IntegratedReader.jsx                # lector de la primera obra
│   ├── readingDocument.js                  # texto y sincronización de la primera obra
│   └── ...
└── vite.config.js                          # base público y entradas multipágina
```

## Catálogo

`src/biblioteca/catalog.js` es la única fuente del catálogo y también centraliza el nombre provisional de la biblioteca. Cada entrada conserva por separado:

- identidad y nombres de autor usados para búsqueda;
- apellido usado para ordenar;
- título completo;
- segmentos editoriales de la referencia APA 7, incluido el título que requiere cursiva;
- miniatura y texto alternativo;
- ruta pública de la obra.

La búsqueda normaliza mayúsculas, tildes y signos; divide la consulta en términos y exige que todos aparezcan en el conjunto autor–título. El filtrado se aplica después del orden bibliográfico, por lo que no reorganiza resultados.

## Qué se comparte y qué permanece singular

En esta etapa solo se comparte la infraestructura inequívocamente común: portada de biblioteca, catálogo, búsqueda, construcción de URLs y compilación estática. Fresco–Noble conserva su componente `App`, sus estilos Art Déco, el carrusel, el lector, el reproductor, la sincronización, el audio, las notas y el almacenamiento local.

No se creó todavía una abstracción universal del lector. Podrá evaluarse cuando una segunda obra permita comprobar qué parte de su contrato es verdaderamente común.

## Integración frente a edición

Los cambios de esta etapa son estructurales:

- la antigua portada raíz se trasladó a una ruta interna;
- se agregó la biblioteca;
- se añadieron enlaces discretos de regreso;
- Vite pasó a compilar dos documentos HTML.

No se modificaron el texto narrado, `readingDocument.js`, los tiempos, `IntegratedReader.jsx`, el MP3, el PDF ni los demás recursos de la obra. La miniatura reutiliza el retrato de Pablo Pineau ya existente.

## Incorporar una obra futura

Mientras el proyecto siga siendo pequeño, una nueva obra requiere deliberadamente acciones explícitas y revisables:

1. crear su ruta física bajo `textos/`;
2. agregar su entrada HTML a `vite.config.js`;
3. incorporar una entrada bibliográfica revisada en `catalog.js`;
4. preparar su página y sus recursos singulares;
5. probar búsqueda, enlace directo, retorno, compilación raíz y compilación para Pages.

No deben inventarse metadatos para completar una entrada ni copiarse automáticamente el lector y el reproductor de Fresco–Noble.

## Trazabilidad

- SHA inicial de `main`: `bbc447efd2b7f0b9ef77807123b3808f45694381`.
- Rama de implementación: `feat/biblioteca-academica-v1`.
- La publicación sobre `main` queda fuera de esta etapa hasta revisión y autorización de la Pull Request.

# Biblioteca académica — arquitectura con dos obras

## Propósito

El repositorio contiene una biblioteca académica estática con dos obras reales: el recorrido dedicado al artículo de Iván Pablo Orbuch sobre educación corporal durante el primer peronismo y la experiencia sobre Pablo Pineau y la Reforma Fresco–Noble.

La biblioteca funciona sin backend, base de datos, autenticación ni CMS. El catálogo se edita manualmente y toda la búsqueda ocurre en el navegador.

## Rutas públicas

| Ruta conceptual | GitHub Pages | Contenido |
|---|---|---|
| `/` | `/audiolibros-historia-educacion-fisica/` | Biblioteca y catálogo |
| `/textos/orbuch-educar-al-cuerpo/` | `/audiolibros-historia-educacion-fisica/textos/orbuch-educar-al-cuerpo/` | Obra de Iván Orbuch |
| `/textos/pineau-fresco-noble/` | `/audiolibros-historia-educacion-fisica/textos/pineau-fresco-noble/` | Obra Fresco–Noble |

La aplicación usa una compilación multipágina de Vite. Cada ruta pública tiene un archivo `index.html` físico dentro de `dist/`, por lo que una apertura directa o una recarga de la obra no dependen de un router del navegador ni producen el 404 típico de una SPA en GitHub Pages.

`import.meta.env.BASE_URL` construye los enlaces entre biblioteca y obra. Los workflows obtienen el subdirectorio desde `GITHUB_REPOSITORY`, y `vite.config.js` adapta además los recursos `/assets/` al `base` resultante de GitHub Pages.

## Estructura

```text
portable-site/
├── index.html                              # biblioteca
├── textos/
│   ├── orbuch-educar-al-cuerpo/index.html  # documento HTML de Orbuch
│   └── pineau-fresco-noble/index.html      # documento HTML de Pineau
├── src/
│   ├── biblioteca/
│   │   ├── LibraryHome.jsx                 # interfaz del catálogo
│   │   ├── catalog.js                      # configuración y fuente única de obras
│   │   ├── library.css                     # identidad neutral de la biblioteca
│   │   └── main.jsx                        # entrada React de la biblioteca
│   ├── orbuch/                             # página, estilos y documento de Orbuch
│   ├── App.jsx                             # recorrido Fresco–Noble
│   ├── IntegratedReader.jsx                # único motor de lectura
│   ├── readerConfigs.js                    # configuración separada por obra
│   ├── readingDocument.js                  # texto y tiempos de Pineau
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

Ambas obras importan directamente el mismo `IntegratedReader.jsx`. El motor concentra diálogo, reproducción, seek, velocidad, volumen, capítulos, selección de oración, seguimiento cuando existen tiempos, anotaciones, persistencia y exportación. `readerConfigs.js` aporta identidad, recursos, textos de interfaz, nombres de exportación y claves de almacenamiento. Cada obra conserva su propia página, estilos, `readingDocument`, audio, PDF y demás fuentes.

Pineau mantiene su documento sincronizado de 201 unidades y sus claves históricas. Orbuch usa un documento propio construido desde la versión accesible recuperada, un MP3 real de 27:53 y claves exclusivas. Como no se recuperó SRT/VTT ni otra fuente temporal, Orbuch se declara `pending`: permite leer, escuchar, buscar capítulos y anotar, pero no inventa resaltado, reproducción desde una oración ni saltos de capítulo al audio. Las notas de Orbuch registran la posición real del reproductor al crearse, diferenciada expresamente de una sincronización oración–audio.

El contrato operativo está en `documentation/LECTOR_COMPARTIDO.md`.

## Integración de la segunda obra

Los cambios de esta etapa son estructurales y editoriales:

- se incorporó una tercera entrada física de Vite, además de biblioteca y Pineau;
- se parametrizó el lector existente sin duplicarlo;
- se añadió Orbuch con identidad propia, autor, contexto, fuentes de 1949/1950, lectura y créditos;
- el catálogo pasó a dos referencias APA 7 en orden Orbuch → Pineau;
- se conservaron separados textos, recursos, progreso y notas.

No se modificaron `readingDocument.js`, los tiempos, el MP3, el PDF ni los estilos de Pineau. `App.jsx` solo conecta Pineau explícitamente con su documento y configuración; el cambio funcional se concentra en el motor común.

## Incorporar una tercera obra

Mientras el proyecto siga siendo pequeño, una nueva obra requiere deliberadamente acciones explícitas y revisables:

1. crear su ruta física bajo `textos/`;
2. agregar su entrada HTML a `vite.config.js`;
3. incorporar una entrada bibliográfica revisada en `catalog.js`;
4. preparar su página, estilos, recursos, configuración y `readingDocument` singulares;
5. usar tiempos únicamente si existe una fuente real verificada;
6. asignar claves estables y únicas a notas y progreso;
7. probar catálogo, lector, enlace directo, retorno, build raíz y build de Pages.

No deben inventarse metadatos ni tiempos, copiarse el lector o construirse un generador industrial de obras.

## Trazabilidad

- SHA inicial de `main`: `bbc447efd2b7f0b9ef77807123b3808f45694381`.
- Rama de implementación: `feat/biblioteca-academica-v1`.
- SHA de `main` antes de la segunda obra: `aad25a75c159e7a65e78c799f4877d6ec7175bd1`.
- Rama de la segunda obra: `feat/orbuch-segunda-obra`.
- El Site original de Orbuch se inspeccionó como fuente y no fue modificado.
- La publicación sobre `main` queda fuera de esta etapa hasta revisión y autorización de la Pull Request.

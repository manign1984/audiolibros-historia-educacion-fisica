# Renovación de la biblioteca +TEC · 27/10/2026

## Solicitud y resultado

La solicitud del proyecto fue ampliar los espacios para los textos de la asignatura y renovar la estética con referencias a los catálogos de Netflix y Disney+. La portada adopta un fondo azul oscuro, un destacado de gran formato, filas de portadas desplazables y seis colecciones temáticas. Sora y Manrope se distribuyen localmente mediante Fontsource, sin solicitar fuentes a terceros durante la visita.

El catálogo contiene 29 lecturas: las dos experiencias completas existentes y 27 fichas con URL propia, autoría, título, referencia y materiales relacionados. Las nuevas fichas muestran “En preparación”; no ofrecen audios, textos completos, biografías o tiempos inventados.

La búsqueda admite tildes y combina título, autor y colección. Los filtros permiten seleccionar colección y disponibilidad. “Mi lista” guarda identificadores localmente en el navegador; no utiliza cuentas ni servidores. “Seguí donde dejaste” consulta las claves de progreso existentes, sin modificarlas. La portada destacada cambia únicamente por acción del usuario.

## Fuente bibliográfica y límites

Se consultaron los documentos del proyecto titulados **Programa historia UNAHUR 2024** y **Programa historia UNAHUR 2024-2025.txt**. La bibliografía recuperada contiene 18 entradas obligatorias y siete optativas; se incorporaron las 25, incluida la obra de Pineau ya publicada.

Se añadieron cuatro lecturas identificadas en los materiales y el trabajo del proyecto: el artículo de Orbuch de 2020 ya publicado, *Prácticas corporales: historia de lo diverso y lo homogéneo* de Soares, *Los privilegiados en la Nueva Argentina* de Almada y el capítulo de Melano *Militares al gobierno, juramentados al poder*. Para este último no se completa año ni edición hasta verificarlos.

El programa **35012 HEYEF 2026-2027** localizado corresponde a otra universidad; no se empleó como programa de UNAHUR. Su referencia del capítulo de Melano y Aisenstein permite registrar la edición de 2018, frente al año 2019 del listado más antiguo. La fecha de Narodowski conserva la del programa consultado y lo declara en la ficha. Las referencias incompletas mantienen expresamente esa condición.

La autoría de Feiguin se conserva como María Andrea, tal como figura en el artículo publicado y en el repositorio de la Universidad Pedagógica Nacional: <https://revistas.pedagogica.edu.co/index.php/PYS/article/view/4056>. No se reemplaza por el nombre de una persona entrevistada.

Esta ampliación **no certifica la cobertura de un programa vigente posterior a 2024–2025**. Las seis colecciones son una organización editorial para explorar el catálogo, no una reproducción de las unidades oficiales. Los números 01–06 identifican esas colecciones. `plannedWorks.js` registra la procedencia de cada ficha (`programa`, `programa-optativa`, `materiales` o `entrevistas`).

## Alcance técnico y fidelidad

- Se modifican la portada y los componentes de `src/biblioteca/`, el color de tema de `index.html`, la configuración multipágina y las pruebas del catálogo/build.
- Se agregan 27 entradas HTML físicas para permitir acceso directo y recarga en GitHub Pages, incluso sin rutas SPA.
- Se agregan las dependencias fijadas `@fontsource/manrope` y `@fontsource/sora`.
- Se reutilizan los murales existentes como ilustraciones de las dos obras publicadas; las fichas nuevas usan portadas tipográficas en CSS.
- No se modifican las páginas originales de Pineau u Orbuch, sus recursos, textos, notas, sincronización ni `IntegratedReader.jsx`.
- No se modifican los workflows ni la configuración de alojamiento: la publicación utiliza el despliegue automático de `main` ya existente.

## Validación

Las pruebas del catálogo comprueban identificadores y rutas únicos, estados de disponibilidad, referencias, colecciones, búsqueda normalizada, persistencia y tolerancia a almacenamiento bloqueado o corrupto. Las comprobaciones de las dos obras verifican la integridad de recursos y el lector común. `verify:build` verifica también las 27 rutas nuevas y su base pública.

Se revisaron en navegador la portada de escritorio, las composiciones de 390 y 768 píxeles, las fichas, búsqueda, filtros combinados, estado vacío, guardado persistente y navegación a los recorridos existentes. Las vistas responsive se inspeccionaron en marcos del ancho indicado; no constituyen una prueba en dispositivos físicos.

Comandos de validación desde `portable-site/`:

```bash
npm ci
npm run test:library
npm run test:two-works
npm run build
npm run verify:build
GITHUB_PAGES_BASE=/audiolibros-historia-educacion-fisica/ npm run build
GITHUB_PAGES_BASE=/audiolibros-historia-educacion-fisica/ npm run verify:build
```

## Actualización del 28/10/2026

La incorporación del recorrido de Hobsbawm lleva el catálogo a tres experiencias disponibles y 26 fichas en preparación, manteniendo sus 29 identificadores y URLs. Su entrada identifica la selección «Vista panorámica del siglo XX», la edición de 1999 indicada por el material aportado y la duración real de la grabación. La portada principal puede destacar cualquiera de los tres recorridos. Véase `HOBSBAWM_2026.md` para fuentes, sincronización y validación.

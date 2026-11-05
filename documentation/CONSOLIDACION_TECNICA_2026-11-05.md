# Consolidación técnica de la biblioteca · 5 de noviembre de 2026

## Base comprobada y alcance

Se inspeccionó `main` en `3b72722cbfd6249c061f471b792b9db1db3355ae`, posterior a la PR 74. Tanto [CI](https://github.com/manign1984/audiolibros-historia-educacion-fisica/actions/runs/41955034063) como [GitHub Pages](https://github.com/manign1984/audiolibros-historia-educacion-fisica/actions/runs/41955034254) terminaron correctamente para ese commit. Se abrió la biblioteca pública y se probaron búsqueda, disponibilidad y acceso a un lector. No se toma una descripción histórica como prueba del estado actual.

Las [Directrices canónicas 2.0](https://docs.google.com/document/d/1z0HqT7WR1A4u-RZRaFRINm9TWH5XWX8Lc_Vdj5q0aKM/edit) se recuperaron del documento vigente, modificado el 4/11/2026. Se mantienen SR-05 (insumos comprobados), SR-06 (fidelidad y guardado independiente), el protocolo 6 y CAN-01. La excepción de Marcaida —párrafos para selección, seguimiento y notas— procede de la decisión expresa del proyecto; no cambia la norma de las otras obras ni se convierte automáticamente en norma para la próxima.

Esta intervención añade herramientas internas, pruebas y documentación. No cambia `src/`, entradas HTML, materiales académicos/audiovisuales, IDs, claves, tiempos, estilos ni directrices. No contiene una nueva colación editorial ni escucha perceptual del capítulo completo.

## Diagnóstico del estado real

La aplicación es estática, multipágina, con React 19 y Vite 8; no necesita backend, cuentas ni base de datos. El catálogo tiene **29 fichas: cuatro `available`, una `review` y 24 `preparation`**. Los cinco primeros estados de lectura reales no equivalen a cinco sincronizaciones certificadas: Aisenstein conserva interpolación por oración y Marcaida seguimiento orientativo por párrafo.

| Recorrido | Documento cargado por el lector | Unidades de audio | Estado comprobable |
| --- | --- | ---: | --- |
| Pineau | 4 apartados, 62 párrafos | 201 oraciones/unidades, todas temporizadas | `ready`; texto y tiempos integrados en JS; SRT original fuera del checkout |
| Orbuch | 4 apartados, 59 párrafos | 154, todas temporizadas | `ready`; constructor usa TXT y tiempos derivados del SRT real |
| Hobsbawm | 4 apartados, 46 párrafos | 241, de las cuales 235 temporizadas | Se conservan seis unidades `audioUnavailable`, sin saltos ficticios |
| Aisenstein | 3 apartados del lector, 29 párrafos | 117, todas temporizadas | `ready` técnico; oraciones interpoladas desde 320 cues, revisión fina pendiente |
| Marcaida y Scaltritti | Introducción y 4 apartados, 42 párrafos | 42 párrafos | `paragraph-preview`; seis intervalos con algún límite estimado |

Los apartados son los que **efectivamente expone el objeto de lectura**, no una nueva interpretación del índice académico. La referencia bibliográfica de la obra puede estar en catálogo/créditos aunque `document.bibliography` esté vacío; esa lista interna no se completa con datos inventados.

| Audio web | Duración del contenedor medida con ffprobe | Duración declarada por el documento |
| --- | ---: | ---: |
| Pineau | 3005.727347 s | 3005.727 s |
| Orbuch | 1673.900408 s | 1673.900408 s |
| Hobsbawm | 2942.223673 s | 2942.197551 s |
| Aisenstein, 16 partes concatenadas en el orden configurado | 1493.681633 s | 1493.19 s |
| Marcaida y Scaltritti | 2026.374625 s | 2026.374625 s |

Hobsbawm utiliza una copia web comprimida distinta del original: sus hashes diferentes ya están documentados en `HOBSBAWM_2026.md`. No se confundió el hash del original con el del recurso servido. En Aisenstein se registra la diferencia existente de 0.491633 s entre contenedor y final de VTT; no se cambia el tiempo ni se presume que esa cola sea silencio. La medición se realizó sobre copias locales de los mismos archivos identificados por SHA-256; el validador no instala ffprobe ni intenta escuchar el audio en CI.

## Inventario reutilizable

| Capa | Componente/mecanismo actual | Reutilización recomendada |
| --- | --- | --- |
| Navegación | `JourneyHeader`, `useJourneyNavigation`, `JourneyBlockLabel` | Cinco bloques, altura real del encabezado, anclas, sección activa y progreso |
| Entrada a lectura | `CanonicalReadingEntry` y `canonical-reading.css` | Modelo aprobado de Lectura; cambiar solo datos y paleta permitida |
| Créditos | `JourneyCredits`, `creditsContent`, `journey-credits.css` | Tres columnas y pie compartidos; referencias y derechos verificados por obra |
| Autoría | `AuthorBiography` | Retrato, crédito, biografía y fuente; la alternativa tipográfica de Marcaida es una decisión particular |
| Lector | Un único `IntegratedReader.jsx` | Diálogo, capítulos, audio, selección, seguimiento, notas, exportación y restauración |
| Configuración | `readerConfigs.js` y `marcaida/readerConfig.js` | Identidad, archivos, claves, exportaciones y modalidad de sincronización |
| Documentos | Objeto `readingDocument`; constructores de Orbuch/Hobsbawm y adaptador de VTT de Aisenstein | Reutilizar el contrato, sin copiar un constructor cuyo algoritmo no corresponda a la fuente nueva |
| Estado | `localStorage` por obra y `biblioteca/libraryState.js` | Claves de notas y progreso exclusivas; lista general independiente |
| Catálogo | `catalog.js`, `plannedWorks.js` y `resolveSitePath` | Metadatos, búsqueda, colecciones, estados y resolución con base de Pages |
| Compilación | Vite multipágina y transformación de `/assets/` | HTML físico por ruta, recarga directa, build raíz y subdirectorio |
| Fuentes binarias | Recursos locales; `prepare-marcaida-assets.mjs` | Materializar la copia exacta de Marcaida desde Drive, comprobando tamaño y SHA-256 |
| Regresión | Pruebas por obra y `test-reader-runtime.mjs` | Comprobar materiales específicos e interacciones en DOM simulado |
| Nueva capa interna | `validation/works.json` y `validate-works.mjs` | Registro transversal independiente de la interfaz y del lector |

El audio se descarga completo antes de crear su URL de Blob; Aisenstein descarga sus 16 partes y las concatena en memoria. Esto favorece los saltos locales, pero hace que conexión y memoria condicionen el inicio. No se modifica ese comportamiento aprobado.

## Duplicaciones y dependencias frágiles

1. Identidad, duración y guardado aparecen en catálogo y configuración; los materiales y reglas se repiten en pruebas por obra. El registro nuevo **contrasta** esas copias, sin sustituir las fuentes de la aplicación ni mantener otra transcripción.
2. El build de rutas mezcla cuatro entradas explícitas con las entradas derivadas de estados distintos de `available`. Marcaida se incluye por ser `review`: cambiar solo ese estado puede retirarla del build. La nueva comprobación verifica que las 29 rutas lleguen a `dist` y detiene la publicación si falta una.
3. Orbuch y Hobsbawm siguen usando `PineauLayoutReference`, un iframe de medición generado por `generate-layout-reference.mjs`. Es una dependencia de diseño heredada que no debe copiarse automáticamente en una obra futura ni retirarse de las actuales sin revisión visual.
4. `JourneyReadingEntry` permanece como launcher predeterminado del motor, aunque las cinco páginas pasan explícitamente la entrada canónica. `ReaderLauncher.jsx` es otra alternativa histórica. No se eliminan exportaciones ni se cambia el valor predeterminado en esta tarea.
5. Los workflows de CI y Pages son independientes. Se añade un control de integridad, contratos y referencias **dentro del build de Pages, antes de subir el artefacto**. Eso no equivale a hacer que todas las pruebas de CI sean una dependencia entre workflows; en cada PR hay que esperar también su resultado.
6. Las pruebas históricas contienen bastantes contratos de texto y CSS específicos. Se conservan para evitar regresiones; la validación común se prueba además mediante fallos deliberados, no únicamente mediante coincidencias de código.
7. La inspección de un `dist` reutilizado encontró bundles obsoletos con referencias inválidas de otra base. Una compilación con limpieza explícita eliminó esos restos y pasó el control de referencias. Se fija `vite build --emptyOutDir` en el script de build, únicamente sobre su salida generada, para hacer explícita la limpieza entre raíz y Pages. No se eliminan fuentes ni recursos originales.

## Herramientas implementadas y comprobación

`validation/works.json` registra 38 materiales principales y de alineación, las claves históricas, la duración medida, el hash del audio completo/en orden y la huella del documento producido por los módulos reales. No es un catálogo alternativo ni se importa desde `src/`.

`npm run validate:works` comprueba registro de todos los recorridos accesibles, archivos no vacíos, tamaños/SHA-256, cabeceras PDF, recursos configurados, copias TXT declaradas iguales, referencias bibliográficas, rutas de catálogo, importación de módulos en las páginas, claves exclusivas —incluida la clave reservada de la lista—, IDs y texto no vacíos, cobertura por párrafos, intervalos válidos, orden, solapamientos y límites. También inspecciona los SRT/VTT registrados. Los huecos se informan; no se rellenan ni se prohíben las pausas narrativas.

El cargador usa Vite solo para resolver los mismos módulos, JSON y `?raw` de la aplicación, sin servidor ni copia del texto. No carga el motor ni datos de navegadores. Los archivos temporales de compilación se eliminan al terminar.

Con `--dist dist` también se comprueban las 29 rutas emitidas y las referencias locales literales de HTML, CSS y bundles JS, incluidas sus dependencias y las rutas del catálogo relativas al sitio. No se promete interpretar cualquier URL calculada dinámicamente ni verificar enlaces externos o anclas de React sin renderizado.

`npm run test:work-validation` prueba casos adversos: corrupción, archivo ausente, partes de audio desordenadas, notas/progreso cruzados, referencia bibliográfica ausente, documento alterado, tiempos inválidos, falta de cobertura de párrafos y recursos/bases de build incorrectos. Todos los datos de estas pruebas son ficticios y viven en un directorio temporal.

Se ejecutaron con resultado satisfactorio instalación limpia, suites anteriores, runtime de los cinco lectores, pruebas adversas y build/verificación de raíz y de Pages. El control nuevo recorrió 96 referencias locales de fuente y 529 referencias del artefacto en cada base, con cero errores y seis avisos documentados. La evidencia resumida está en `evidence/CONSOLIDACION_TECNICA_2026-11-05.json`. Los avisos previstos quedan explícitos: PDF no disponible e interpolación de Aisenstein, su diferencia de duración, seguimiento orientativo de Marcaida y huecos mayores a 5 s en Hobsbawm/Marcaida. **Cero errores técnicos no certifica alineación auditiva, conformidad visual integral ni autorización de uso.**

## Pendientes priorizados, sin intervención pública

| Prioridad | Evidencia y recomendación | Por qué queda como propuesta |
| --- | --- | --- |
| 1 | Escuchar los seis intervalos estimados de Marcaida y muestras de principio, transiciones y final; completar control fino de Aisenstein | Necesita contraste perceptual, no una interpolación adicional |
| 2 | Revisar cómo el catálogo comunica `review` y `available`: Marcaida dice «Sincronización pendiente» aunque ya tiene seguimiento orientativo; Aisenstein figura como sincronizada aunque su configuración declara revisión fina | Es una decisión de comunicación editorial; no se cambian estados o textos aprobados |
| 2 | Revisión puntual de CAN-01: `aisensteinReadingDocument.sourceNote` y créditos describen reorganización/interpolación; otros créditos conservan explicaciones de alineación | Distinguir información funcional necesaria de relato de producción requiere revisión editorial; no retirar fuentes ni limitaciones |
| 3 | Decidir si se incorpora un PDF académico verificable de Aisenstein | No hay PDF local ni `pdfUrl`; no se fabrica uno a partir del VTT |
| 3 | Planificar después una mejora de descarga/memoria del audio completo y la dependencia del iframe de medición | Cambiaría comportamientos o alturas aprobadas; necesita una tarea de regresión visual específica |
| 3 | En la próxima obra, extender también la prueba de interacción, no solo el registro estático | El runtime actual cubre los cinco lectores concretos; el validador nuevo no reemplaza esa prueba |

La guía de próxima incorporación está en [GUIA_INCORPORACION_OBRAS.md](GUIA_INCORPORACION_OBRAS.md); el contrato del registro se explica en [validation/README.md](../validation/README.md). Las fuentes normativas permanecen sin cambios.

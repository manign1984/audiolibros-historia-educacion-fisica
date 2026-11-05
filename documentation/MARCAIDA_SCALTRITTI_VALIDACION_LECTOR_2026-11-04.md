# Marcaida y Scaltritti · Validación del lector por párrafos

Fecha de registro: 4 de noviembre de 2026, Argentina.

## Estado y alcance

**Validación funcional y revisión visual de la rama completadas. Contraste auditivo pendiente.** La PR 74 incorpora las correcciones revisadas. La publicación se confirma separadamente con el resultado de Actions/Pages.

Versión pública inspeccionada: PR 73, commit `d9952f3d7c19f62b08b6f826688d96cead414f11`.

- [Página pública](https://manign1984.github.io/audiolibros-historia-educacion-fisica/textos/marcaida-scaltritti-estado-nacional/)
- [Implementación de partida · PR 73](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/73)
- [Correcciones y cierre visual · PR 74](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/74)
- [Directrices canónicas vigentes](https://docs.google.com/document/d/1z0HqT7WR1A4u-RZRaFRINm9TWH5XWX8Lc_Vdj5q0aKM/edit)

Se conserva la decisión específica del proyecto: párrafo como unidad de seguimiento, selección y anotación de esta obra. Las otras cuatro mantienen su modalidad por oración. La indicación general de las directrices sobre oraciones no se traslada a Marcaida ni se modifica durante esta auditoría.

## Comprobaciones en la página publicada

Se abrió el recorrido real y el lector, se revisaron controles y contenido accesible, se seleccionó un apartado, se abrió el editor y se guardó una nota de prueba vinculada a un párrafo. Posteriormente se inició la reproducción desde el primer párrafo: el elemento de audio informó `paused: false`, `readyState: 4`, duración `2026.374625` y tiempo de reproducción creciente desde `13.26` s. El párrafo activo era `ms-introduccion-p1`.

Estos datos prueban carga, reproducción y activación lógica del resaltado. **No prueban que se haya escuchado o contrastado perceptualmente la voz.**

La carga inicial fue lenta en la conexión de prueba: el lector permaneció preparando el archivo completo antes de habilitar la reproducción. El MP3 tiene 64.845.012 bytes. Finalmente cargó correctamente, sin error del elemento de audio. Se conserva el mecanismo de carga y el archivo original; no se atribuye el tiempo de espera a una falla del material.

Se inspeccionó el diseño de escritorio con ambas columnas de notas y la vista móvil solicitada de 390 × 844 px. En la vista móvil se observó un párrafo completo resaltado con línea lateral y fondo tenue; el texto conserva su desplazamiento propio. También quedó visible el desplazamiento de la página detrás del lector y el extremo derecho de los controles resultaba comprometido. Las medidas DOM registraban un diálogo de 390 px de ancho y una zona de texto de aproximadamente 604 px de alto, con reproductor de 122 px.

La conexión del navegador dejó de responder durante la siguiente interacción. Se detuvo la inspección tras varios intentos de recuperar su estado. Por ello **no se certifican tableta, 320 px, ventanas bajas, zoom ni el resultado visual posterior a los ajustes**. Tampoco se pudo confirmar la restitución de la configuración temporal de viewport. La nota creada en esa sesión está identificada como «Prueba de auditoría: relación entre Estado y sociedad.»; no se tocaron anotaciones personales preexistentes.

## Problemas y correcciones

| Problema | Evidencia | Corrección acotada a párrafos | Verificación alcanzada |
| --- | --- | --- | --- |
| «Portada» no responde | En la web, seleccionar `frontmatter` dejaba el selector en Introducción. El conjunto de unidades por párrafo excluye la portada y `jumpToSection` retornaba sin actuar. | Regreso al inicio del texto y estado propio de la opción Portada; desactiva el seguimiento para conservar esa consulta. | Aprobado en DOM y en navegador: selector Portada y desplazamiento al inicio. |
| Página desplazable detrás del lector | Barra externa visible en capturas; diálogo dimensionado con `100vw`. | Bloquear el desplazamiento del documento mientras el lector está abierto y limitar su ancho al espacio disponible; restaurar la propiedad al cerrar. | Apertura/cierre probados en DOM; diálogo sin desborde horizontal en navegador a 320, 390, 768 y 1280 px. |
| Riesgo de editor demasiado alto | El editor imprimía el párrafo completo sin límite de altura de cita en escritorio. Hay un párrafo de 167 segundos. | Limitar la altura de cita y campo; permitir desplazar el editor dentro del área visible. | Editor comprobado en navegador con el párrafo de 167 s: cita desplazable y acciones accesibles a 320 × 640 y 1280 × 480 px. |
| Espacio sobre controles interfería con su acción | El manejador global de teclado procesaba Espacio aun cuando el foco estaba en botones; podía reproducir en vez de activar el control. | Reservar la tecla para el control enfocado y evitar atajos detrás del editor/cuaderno. | Prueba de teclado aprobada. |
| Escape cerraba todo el lector desde una anotación | `onCancel` cerraba siempre el diálogo principal. | Cerrar primero editor o cuaderno; contener Tab y restituir foco. | Editor/cuaderno y conservación del lector aprobados. |
| Regreso de nota académica sin foco útil | El destino era un elemento `p` sin capacidad de recibir foco. | Regresar al control del párrafo; suspender seguimiento al consultar una nota para evitar que el audio aparte al usuario. | Las diez referencias y sus retornos aprobados. |
| Recuperación de tiempo sin recuperar pasaje pausado | El desplazamiento requería `playing` aun con un progreso guardado. | En esta modalidad, ubicar el párrafo al abrir con seguimiento activo, aun sin reproducir. | Remontaje, progreso y párrafo activo aprobados en DOM; cierre/reapertura reales conservan 1652.76 s sin reproducción automática. |
| Avisos del funcionamiento anterior | Créditos decía que el audio se controlaba por separado; Inicio no describía la modalidad actual. | Frases breves sobre lectura, escucha y anotación por párrafo; seguimiento orientativo. | Código y compilación verificados. |

No se cambian paleta, tipografías, arquitectura del recorrido ni diseño editorial. La interfaz no narra esta auditoría ni sus fundamentos (CAN-01).

## Matriz funcional

| Función solicitada | Resultado y tipo de evidencia |
| --- | --- |
| Reproducción del MP3 | Comprobada en la web mediante estado y avance del audio. Sin validación perceptual. |
| Correspondencia de voz y párrafo | La aplicación elige el párrafo previsto por los 42 intervalos. La correspondencia auditiva sigue pendiente. |
| Transición y desplazamiento | Prueba lógica: cambia al párrafo previsto y no recentra repetidamente dentro del mismo párrafo. Resaltado y desplazamiento revisados visualmente; se puede recorrer el párrafo largo manualmente sin recentrado continuo. Correspondencia con la voz pendiente. |
| Escuchar desde un párrafo | Activado en la web desde Introducción. Prueba aislada y navegación real adicional sobre `ms-apartado-4-p3`, con salto a `1775.5` s y reproducción (`paused: false`, `readyState: 4`). |
| Activar/desactivar seguimiento | Aprobado en DOM: sin desplazamiento mientras está desactivado y reanudación explícita. |
| Crear, editar, eliminar notas | Creación y edición también comprobadas en navegador aislado de QA con datos ficticios; eliminación aprobada en DOM simulado. |
| Exportar TXT y JSON | Se ejecutan los botones y se inspeccionan los Blob: comentarios, párrafo completo, IDs y obra correctos. Descargas TXT y JSON recibidas y confirmadas por el navegador en la página de QA abierta directamente, sin iframe. |
| Conservar notas anteriores | Tres notas ficticias anteriores, incluida una de portada, migran sin pérdida de texto y con trazabilidad del ID anterior. No se auditaron notas reales de estudiantes. |
| Diez notas académicas | Presencia y texto conservados; las diez aperturas/retornos aprobados en DOM. La nota 7 se comprobó además en navegador: retorno con foco en el control del párrafo. |
| Recuperar progreso | Cierre, desmontaje y reapertura recuperan `1260.9` s, notas y párrafo; sin iniciar reproducción automáticamente. |

## Sincronización: seis párrafos prioritarios

Los tiempos se conservan exactamente. Cada uno de estos intervalos contiene algún límite estimado; eso no implica que ambos lo sean. Se probó que el lector cambia a la unidad correcta en el instante indicado. **La prueba es de navegación temporal, no una aprobación de la alineación auditiva.**

| Párrafo | Inicio (s) | Fin (s) | Pasaje de referencia |
| --- | ---: | ---: | --- |
| Introducción · 1 | 13.260 | 55.388 | Luego de la Revolución de mayo de 1810… |
| Introducción · 2 | 55.900 | 91.560 | Un nuevo intento de organización nacional… |
| Apartado 2 · 6 | 582.086 | 615.460 | Paradójicamente, esos consensos básicos… |
| Apartado 3 · 4 | 788.420 | 849.619 | Luego de Pavón… |
| Apartado 3 · 10 | 1056.511 | 1111.420 | La fuerza represiva del Ejército nacional… |
| Apartado 3 · 15 | 1260.783 | 1315.240 | Es de notar que muchas de esas élites locales… |

El intervalo más largo es Apartado 4 · 3: `1775.5–1942.5` s (167 s). Se verifica que la nota recupera su texto completo. Debe revisarse su lectura y edición en ventanas bajas y celulares, sin convertirlo en oraciones ni alterar el texto.

La muestra lógica cubre todos los intervalos y excluye portada y cola del MP3: no se resalta antes del primer inicio ni después del último final. Entre intervalos se conserva el párrafo anterior hasta comenzar el siguiente, como en la implementación de partida.

## Pruebas reproducibles y fidelidad

Desde `portable-site/`:

```bash
npm ci
npm run test:library
npm run test:two-works
npm run test:hobsbawm
npm run test:aisenstein
npm run test:marcaida
npm run test:reader-runtime
npm run build
npm run verify:build
GITHUB_PAGES_BASE=/audiolibros-historia-educacion-fisica/ npm run build
GITHUB_PAGES_BASE=/audiolibros-historia-educacion-fisica/ npm run verify:build
```

Pruebas y compilaciones aprobadas localmente. Se añade la prueba de interacción a CI. Utiliza React y jsdom, simula el elemento de audio y las operaciones de desplazamiento, e inspecciona las exportaciones generadas. **No genera píxeles ni reproduce una voz real.**

La regresión adicional monta los documentos reales de Pineau, Orbuch, Hobsbawm y Aisenstein: comprueba ausencia de unidades por párrafo, resaltado por oración, creación/exportación de una nota e independencia del almacenamiento. Las ramas funcionales nuevas y los estilos adicionales se activan solo con `paragraph`. Se complementa con la inspección visual de los cuatro lectores en escritorio y 320 px, conservando su modalidad por oración.

Los hashes del MP3 (`cc324ffa8999233c94a76521b097eb6c7e81d43182d9df5ef49a46413b76b5ba`) y del PDF (`9311da9f8094f07322e06c907409b03f6cbba4e9b69fd685a3457ab58490818c`) se verifican en la prueba de materiales. No se modifica el documento académico, los tiempos, las diez notas, las 18 referencias ni los namespaces de guardado.

## Revisión visual completada tras recuperar el navegador

Se examinó la rama `fix/marcaida-validacion-lector-parrafos` en Chrome mediante una vista previa local del mismo código. Para comparar tamaños se usó un marco de revisión temporal con iframe de dimensiones CSS reales. Las capturas se inspeccionaron a 1280 × 800, 768 × 1024, 390 × 844, 320 × 640 y 1280 × 480 px. El marco no forma parte de la aplicación ni de la PR. Las interacciones de clic, reproducción y descarga se contrastaron además en una pestaña directa, sin marco, para evitar atribuir a la aplicación limitaciones del instrumento de revisión.

| Comprobación | Resultado observado |
| --- | --- |
| Escritorio | Lectura central, ambos márgenes de notas y controles del reproductor completos. |
| Tableta | Texto en columna única, capítulo, cuaderno, reproducción y anotación disponibles. |
| Celular 390 px | Encabezado en dos filas, texto legible y botones de seguimiento/anotación completos. Diálogo sin desborde horizontal. |
| Celular 320 px | Controles completos; editor del párrafo largo de 516.6 px de alto dentro de 640 px. Cita desplazable, comentario y acciones accesibles. |
| Ventana baja | Editor de 448 px dentro de 480 px; desplazamiento interno para alcanzar las acciones. Escape cierra el editor y conserva abierto el lector. |
| Ampliación de texto | Se probó el máximo ofrecido por el lector (132 %). A 320 px apareció un desborde de 15 px en la palabra «construcción» de la portada. Se corrigió `overflow-wrap` solo dentro de `.integrated-reader--paragraph`; medición final del documento: 310 px de ancho y 310 px de `scrollWidth`. |
| Clic y teclado | La pestaña directa seleccionó `ms-apartado-4-p3` mediante clic. Enter selecciona el mismo párrafo; Portada retorna a `scrollTop: 0`; Escape cierra solo el editor; el regreso de la nota 7 recupera el foco del párrafo. |
| Párrafo extenso | El salto inicia el audio en 1775.5 s y resalta el párrafo completo. Durante la reproducción se puede avanzar manualmente por su texto; no se recentra con cada actualización del tiempo. |
| Cuaderno y descargas | Nota ficticia creada, editada y conservada tras cierre/reapertura. TXT y JSON producen descargas efectivas en el navegador. No se inspeccionaron ni alteraron notas personales reales. |
| Otras obras | Pineau, Orbuch, Hobsbawm y Aisenstein abiertos visualmente en escritorio y 320 px. Conservan clase `integrated-reader` y etiqueta «Oración activa»; Marcaida usa la clase adicional `integrated-reader--paragraph` y «Párrafo activo». |

La comparación dejó visibles limitaciones de los lectores por oración ajenas a esta intervención: barra externa y borde derecho ajustado en Pineau y Aisenstein a 320 px, y título de portada de Aisenstein más ancho que su columna. Los estilos nuevos se aplican únicamente a la clase por párrafos, ausente en esas obras. No se amplía el alcance para corregir esos diseños, conforme a la indicación de conservarlos.

La prueba responsive utiliza el motor de escritorio a distintos tamaños de viewport de iframe; **no equivale a una prueba en dispositivos físicos ni certifica Safari/iOS, teclado virtual, gestos táctiles o zoom del navegador al 200 %**. Sí se comprobó la ampliación interna máxima de texto y la geometría de las cinco dimensiones indicadas.

## Pendiente auditivo y publicación

La validación visual permite integrar la corrección de la PR 74. La sincronización permanece orientativa: siguen pendientes la escucha y el contraste de los seis párrafos prioritarios y la muestra distribuida por el capítulo. No se cambiaron los 42 intervalos ni se declara precisión auditiva comprobada.

La publicación se realiza mediante la integración de la PR 74 y el flujo habitual de GitHub Pages. Se debe confirmar el despliegue de su commit y volver a abrir la página publicada; el resultado final del flujo se registra en la PR.

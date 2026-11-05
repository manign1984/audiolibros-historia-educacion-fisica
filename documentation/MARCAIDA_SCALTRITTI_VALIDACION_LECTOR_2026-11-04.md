# Marcaida y Scaltritti · Validación del lector por párrafos

Fecha de registro: 4 de noviembre de 2026, Argentina.

## Estado y alcance

**Validación funcional automatizada aprobada. Revisión visual parcial y escucha pendientes.** Las correcciones se preparan mediante PR; no se consideran publicadas en Pages hasta que se integren y se compruebe el despliegue.

Versión pública inspeccionada: PR 73, commit `d9952f3d7c19f62b08b6f826688d96cead414f11`.

- [Página pública](https://manign1984.github.io/audiolibros-historia-educacion-fisica/textos/marcaida-scaltritti-estado-nacional/)
- [Implementación de partida · PR 73](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/73)
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
| «Portada» no responde | En la web, seleccionar `frontmatter` dejaba el selector en Introducción. El conjunto de unidades por párrafo excluye la portada y `jumpToSection` retornaba sin actuar. | Regreso al inicio del texto y estado propio de la opción Portada; desactiva el seguimiento para conservar esa consulta. | Prueba de interacción aprobada; revisión visual posterior pendiente. |
| Página desplazable detrás del lector | Barra externa visible en capturas; diálogo dimensionado con `100vw`. | Bloquear el desplazamiento del documento mientras el lector está abierto y limitar su ancho al espacio disponible; restaurar la propiedad al cerrar. | Apertura/cierre y restauración probados en DOM; comprobar geometría en navegador. |
| Riesgo de editor demasiado alto | El editor imprimía el párrafo completo sin límite de altura de cita en escritorio. Hay un párrafo de 167 segundos. | Limitar la altura de cita y campo; permitir desplazar el editor dentro del área visible. | Interacción con el párrafo más extenso aprobada; distribución visual pendiente. |
| Espacio sobre controles interfería con su acción | El manejador global de teclado procesaba Espacio aun cuando el foco estaba en botones; podía reproducir en vez de activar el control. | Reservar la tecla para el control enfocado y evitar atajos detrás del editor/cuaderno. | Prueba de teclado aprobada. |
| Escape cerraba todo el lector desde una anotación | `onCancel` cerraba siempre el diálogo principal. | Cerrar primero editor o cuaderno; contener Tab y restituir foco. | Editor/cuaderno y conservación del lector aprobados. |
| Regreso de nota académica sin foco útil | El destino era un elemento `p` sin capacidad de recibir foco. | Regresar al control del párrafo; suspender seguimiento al consultar una nota para evitar que el audio aparte al usuario. | Las diez referencias y sus retornos aprobados. |
| Recuperación de tiempo sin recuperar pasaje pausado | El desplazamiento requería `playing` aun con un progreso guardado. | En esta modalidad, ubicar el párrafo al abrir con seguimiento activo, aun sin reproducir. | Remontaje, progreso y párrafo activo aprobados. |
| Avisos del funcionamiento anterior | Créditos decía que el audio se controlaba por separado; Inicio no describía la modalidad actual. | Frases breves sobre lectura, escucha y anotación por párrafo; seguimiento orientativo. | Código y compilación verificados. |

No se cambian paleta, tipografías, arquitectura del recorrido ni diseño editorial. La interfaz no narra esta auditoría ni sus fundamentos (CAN-01).

## Matriz funcional

| Función solicitada | Resultado y tipo de evidencia |
| --- | --- |
| Reproducción del MP3 | Comprobada en la web mediante estado y avance del audio. Sin validación perceptual. |
| Correspondencia de voz y párrafo | La aplicación elige el párrafo previsto por los 42 intervalos. La correspondencia auditiva sigue pendiente. |
| Transición y desplazamiento | Prueba lógica: cambia al párrafo previsto y no recentra repetidamente dentro del mismo párrafo. Comodidad perceptual pendiente. |
| Escuchar desde un párrafo | Activado en la web desde Introducción. Prueba aislada adicional sobre `ms-apartado-4-p3`, con salto a `1775.5` s y reproducción. |
| Activar/desactivar seguimiento | Aprobado en DOM: sin desplazamiento mientras está desactivado y reanudación explícita. |
| Crear, editar, eliminar notas | Nota creada en la web. Ciclo completo probado con datos ficticios en DOM aislado. |
| Exportar TXT y JSON | Se ejecutan los botones y se inspeccionan los Blob: comentarios, párrafo completo, IDs y obra correctos. Descarga real del navegador pendiente. |
| Conservar notas anteriores | Tres notas ficticias anteriores, incluida una de portada, migran sin pérdida de texto y con trazabilidad del ID anterior. No se auditaron notas reales de estudiantes. |
| Diez notas académicas | Presencia y texto conservados; apertura y retorno de las diez comprobados en DOM. |
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

La regresión adicional monta los documentos reales de Pineau, Orbuch, Hobsbawm y Aisenstein: comprueba ausencia de unidades por párrafo, resaltado por oración, creación/exportación de una nota e independencia del almacenamiento. Las ramas funcionales nuevas y los estilos adicionales se activan solo con `paragraph`. Esto no sustituye la regresión visual pendiente.

Los hashes del MP3 (`cc324ffa8999233c94a76521b097eb6c7e81d43182d9df5ef49a46413b76b5ba`) y del PDF (`9311da9f8094f07322e06c907409b03f6cbba4e9b69fd685a3457ab58490818c`) se verifican en la prueba de materiales. No se modifica el documento académico, los tiempos, las diez notas, las 18 referencias ni los namespaces de guardado.

## Cierre pendiente

1. Recuperar acceso al navegador de revisión y completar 320, 390 y 768 px, escritorio y ventana baja, incluyendo teclado, ampliación de texto, editor del párrafo extenso y controles del borde derecho.
2. Comprobar en navegador el resultado de esta rama, exportación efectiva y estabilidad del desplazamiento. Revisar también las otras cuatro obras por el cambio del motor compartido.
3. Escuchar y contrastar los seis intervalos prioritarios y muestras de todos los apartados y del final. No se exige precisión por palabra.
4. Integrar solo después de cerrar la revisión visual, comprobar Actions/Pages y abrir la versión publicada. El estado auditivo seguirá siendo orientativo mientras no se complete la escucha.

La auditoría permite revisar una corrección concreta y probada funcionalmente, pero no afirmar que la validación integral ni la nueva publicación hayan terminado.

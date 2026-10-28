# Parámetros comunes de los recorridos · 28/10/2026

## Alcance autorizado

Aplicación a Orbuch y Hobsbawm de los parámetros acordados en [Directrices para crear nuevos recorridos de lectura](https://docs.google.com/document/d/1z0HqT7WR1A4u-RZRaFRINm9TWH5XWX8Lc_Vdj5q0aKM): cinco alturas de Pineau como referencias mínimas, tipografías de su biografía, foto en blanco y negro y síntesis próxima a sesenta palabras. Sustitución del retrato de Hobsbawm por uno anterior y con encuadre cercano.

## Infraestructura y fidelidad

- `AuthorBiography` comparte la presentación entre las dos obras: nombre en Bebas Neue 400, resumen en Archivo 400, rótulos y enlace en Archivo 700. Se conservan los resúmenes completos: Orbuch, 60 palabras; Hobsbawm, 61. El nombre de Hobsbawm pasa a ser el encabezado principal de Autor; la clave de lectura se traslada a Contexto.
- `generate-layout-reference.mjs` renderiza los componentes actuales de Pineau con React en el servidor antes de cada desarrollo/compilación. Produce una referencia inerte y sin JavaScript, diálogo de lectura, audio ni video activo. Copia sus estilos y fuentes locales; los recursos usan direcciones relativas compatibles con la raíz y GitHub Pages.
- Un marco inaccesible a la navegación, sin permisos para ejecutar scripts, mide esa referencia al mismo ancho y alto de ventana. `ResizeObserver` actualiza las cinco alturas mínimas tras cargar las fuentes y al cambiar de pantalla. No se montan dos lectores ni se leen notas/progreso desde el marco. Así se evita aproximar alturas con interpolaciones o convertir el dato de escritorio en una constante para todos los celulares.
- Las dos obras conservan sus contenidos y su identidad cromática. Desde la corrección solicitada posteriormente el 28/10/2026, los bloques usan altura automática, mínimo de referencia y desbordamiento visible: si el contenido necesita más espacio, crecen en el flujo general. No añaden áreas con desplazamiento interno ni paradas de tabulación destinadas a recorrerlas. Se conserva la navegación de cinco bloques en el encabezado móvil. Las miniaturas decorativas de expedientes se omiten en Inicio móvil; los documentos y reproducciones completos permanecen en Contexto.
- Pineau, `IntegratedReader.jsx`, los documentos temporizados, los MP3, PDF, subtítulos, identificadores y claves de almacenamiento no cambian. Los archivos generados y la página temporal de QA no se versionan.

## Retrato de Hobsbawm

- Recurso añadido: `public/assets/hobsbawm-retrato-joven.jpg`; copia sin alterar del archivo descargado.
- [Ficha de Wikimedia Commons](https://commons.wikimedia.org/wiki/File:A%C3%B1os_interesantes,_Eric_Hobsbawm_(cropped).jpg).
- [Archivo de origen](https://upload.wikimedia.org/wikipedia/commons/c/c3/A%C3%B1os_interesantes%2C_Eric_Hobsbawm_%28cropped%29.jpg).
- La ficha identifica un retrato reproducido en *Años interesantes. Una vida en el siglo XX* (Crítica, 2003) y declara CC BY-SA 4.0. La fecha de edición del libro no se atribuye a la toma fotográfica; la autoría fotográfica no está consignada. Los créditos de la página expresan estas limitaciones y enlazan la ficha y la licencia, sin atribuir la foto al autor del libro.
- La presentación emplea escala de grises y un encuadre de rostro mediante CSS. Se conserva el archivo anterior de Rob Ward (2011) para trazabilidad.

## Comprobaciones

Se midieron las tres páginas en marcos de un navegador Chrome, con fuentes cargadas y lector cerrado. Estos son los valores medidos en Pineau que se utilizan como mínimos de referencia en Orbuch y Hobsbawm, en px CSS (redondeados a dos decimales):

| Área de visualización | Inicio | Autor | Contexto | Lectura | Créditos |
|---|---:|---:|---:|---:|---:|
| 1363 × 936 | 936,00 | 582,70 | 2783,25 | 1841,36 | 711,86 |
| 768 × 1024 | 1024,00 | 601,41 | 3482,11 | 1688,88 | 986,11 |
| 390 × 844 | 774,00 | 1127,20 | 4299,56 | 2123,05 | 1548,78 |
| 320 × 740 | 760,00 | 1123,70 | 4350,66 | 2218,50 | 1634,64 |

La corrección posterior elimina la igualdad forzada de alturas: los bloques igualan o superan su referencia según su contenido. Las biografías y los materiales completos permanecen en el desplazamiento general, sin barras verticales internas. Son pruebas de marcos de navegador, no de dispositivos físicos.

Esta medición describe la primera corrección. La excepción posterior para las secciones breves de Hobsbawm y el nuevo cálculo de Inicio se detallan a continuación y prevalecen sobre sus mínimos anteriores. Los valores de Inicio de esta tabla son históricos.

Se verificaron las familias y pesos calculados de la biografía, ausencia de desbordamiento horizontal, apertura del lector de Orbuch a 320 px, y reproducción, pausa y cambio al segundo apartado de Hobsbawm (audio aproximadamente en el segundo 706). El retrato se inspeccionó visualmente. La batería del catálogo, lector compartido y sincronización, además de las compilaciones y comprobaciones de recursos en raíz y subruta, debe pasar antes de integrar.

## Corrección de barras internas · 28/10/2026

La regla editorial D11 prohíbe añadir barras internas en los cinco bloques. Tiene prioridad sobre la coincidencia exacta de alturas. Se sustituye `height` por `min-height`, se permite el crecimiento natural con `height: auto` y `overflow: visible`, y se retira el foco artificial de las secciones que antes tenían desplazamiento propio. No se ocultan barras ni se recorta texto para simular la corrección. El lector a pantalla completa conserva su espacio de lectura independiente.

Verificación de la corrección: inspección de Orbuch y Hobsbawm en Chrome a 1363×936, 768×1024, 390×844 y 320×740. No se encontraron contenedores visibles de contenido con `overflow-y: auto/scroll` y desbordamiento vertical dentro del recorrido principal, ni desbordamiento horizontal de la página. Los cinco bloques tienen `overflow: visible`; Contexto y Créditos de Orbuch crecen y su contenido permanece en el flujo general. Se comprobó visualmente la barra única y la apertura/cierre del lector independiente. Pasaron las pruebas existentes y la compilación con verificación de recursos en raíz y en la base de GitHub Pages.

## Recomposición de Hobsbawm sin espacios vacíos · 28/10/2026

Por solicitud de recuperar la composición previa, se comparó el recorrido inicial de Hobsbawm del commit `9b46951667c394ead5e5339b5e03482d963d0dc1` (PR #18) con las PR #19 y #20. Contexto y Lectura conservan sus contenidos; la clave de lectura solo había pasado de Autor a Contexto al normalizar la biografía. Los grandes espacios se debían al mínimo de Pineau aplicado a secciones cuyo contenido es más breve.

Se registra una excepción acotada: **Contexto, Lectura y Créditos de Hobsbawm recuperan su altura natural**, con sus márgenes originales y sin un mínimo tomado de otra obra. Se elimina también el reparto vertical artificial de sus contenedores. Inicio y Autor conservan las referencias de Pineau y la ficha biográfica común. La regla de no añadir barras internas sigue vigente. No se reducen fuentes, recortan textos ni añaden materiales para rellenar espacio. La excepción no modifica Orbuch o Pineau.

La inspección visual detecta además que la «clave de lectura», trasladada de Autor a Contexto, había heredado texto claro sobre su fondo crema. Se restituye el color de tinta oscuro del diseño original para que el contenido vuelva a leerse con claridad.

## Fondo plano de las biografías · 28/10/2026

El bloque Autor utiliza un color de fondo plano, opaco y uniforme, sin figuras decorativas, rayos, tramas, texturas, imágenes ni degradados. El color puede responder a la identidad de cada obra y debe sostener el contraste con los textos. Los marcos puntuales del retrato, la inicial y la jerarquía tipográfica de la ficha se conservan; la regla se refiere al fondo de la sección.

La implementación retira `orbuch-author::after` de las reglas que generaban la figura radial en escritorio y celular. Se mantiene el azul `#2f78a6`. Hobsbawm utiliza el crema `#eee3cb` opaco, que cubre la trama del fondo general; Pineau conserva su rojo plano `#a84434` sin cambios de código. Los fondos de Contexto, Lectura y los demás bloques quedan fuera de esta modificación.

Se verificó en Chrome a 1363, 768, 390 y 320 px que los tres bloques Autor tienen color opaco, `background-image: none` y ningún pseudoelemento de fondo. Se inspeccionó visualmente Orbuch en escritorio y celular. La regla se incorporó a D10, al detalle del bloque Autor y a la salvedad sobre texturas del documento editorial, preservando sus demás párrafos.

## Continuidad directa entre Inicio y Autor · 28/10/2026

Inicio debe dar paso directamente a la biografía del bloque Autor. Entre ambos no se intercalan franjas, separadores, menús, tarjetas, consignas ni otros elementos. Los materiales complementarios se integran en el bloque que corresponda y no ocupan esa transición. El cambio de color entre los dos bloques y sus espacios internos forman parte de la composición de cada sección.

La aplicación a Orbuch retira la franja «Prescripción · Implementación · Tensiones» del componente de Inicio y sus estilos exclusivos, incluidos los ajustes responsive. Los conceptos desarrollados en Contexto, la biografía y el lector se conservan. Se actualizan las comprobaciones antiguas que obligaban a mantener la franja, ya retirada por decisión editorial.

La revisión en Chrome a 1363, 768, 390 y 320 px confirma que Autor sigue inmediatamente a Inicio, con cero píxeles entre los límites de ambos bloques, sin la franja ni bordes separadores añadidos y sin desbordamiento horizontal. Se conservan el fondo azul plano y la biografía completa. El documento editorial se verificó tras actualizar D4 e Inicio, sin cambios en sus demás párrafos.

## Encabezado común · 28/10/2026

El componente `shared/JourneyHeader.jsx` y su hoja `journey-header.css` reúnen la navegación de los tres recorridos. El enlace «← Biblioteca» lleva a la raíz pública; el apellido y el título breve identifican la obra en escritorio. En pantallas menores de 1024 px se muestra solo el apellido y los cinco enlaces pasan a una segunda fila: Inicio, Autor, Contexto, Lectura y Créditos. Se emplean Archivo 600 y 700, fondo `#0c0e15`, texto `#f5f5f8`/`#c6cad5` y acento `#c2f973`. La opción activa incorpora subrayado además del color.

La altura mínima, incluida la barra inferior de 2 px, es de 80 px desde 1024 px de ancho y 112 px por debajo. El contenedor y los enlaces pueden redistribuirse y crecer para evitar recortes o barras internas. Un observador mide la altura real; los saltos de navegación dejan libre el contenido bajo el encabezado. El estado activo y el progreso utilizan la misma lógica para las tres obras, incluido el acceso a Créditos al llegar al final de la página.

Pineau traslada su control de sonidos a Inicio y conserva el indicador lateral existente. Los controles del lector, sus documentos, sincronización y almacenamiento no se modifican. Su referencia estructural incluye la hoja del encabezado para medir en las mismas condiciones; en móvil se actualiza el espacio superior que antes compensaba el encabezado antiguo. Se conserva el fondo plano de las biografías y el paso directo entre Inicio y Autor.

La revisión en Chrome confirma la igualdad de alturas, familias, pesos, colores y opciones a 1363, 768, 390 y 320 px. También se comprueba el umbral: 80 px a 1024 px de ancho y 112 px a 1023 px, en las tres obras. La barra inferior mide 2 px y las cinco opciones permanecen visibles, sin desbordamiento horizontal en los encabezados. Se verifican los saltos a Autor, Contexto y Lectura dejando aproximadamente 16 px bajo el encabezado, la apertura y cierre de los tres lectores a 320 px, el control reubicado de sonidos y el foco de teclado común de 2 px verde lima. El documento editorial incorpora 2.2 y D12, con lectura de verificación y conservación de todos sus párrafos anteriores.

Se comprueban además el acceso a Créditos, el progreso del 100 % al llegar al final y el regreso a Biblioteca. Pasan las pruebas existentes y las compilaciones limpias con verificación de recursos en raíz y en la base pública de GitHub Pages.

En Chrome a 1363×936, Contexto pasa de 2783,25 a 1599,53 px, Lectura de 1841,36 a 1285,59 px y Créditos de 711,86 a 678,50 px. En los marcos de 768×1024, 390×844 y 320×740, estas tres secciones se ajustan igualmente al contenido. La diferencia entre cada sección y su contenedor equivale solo al relleno previsto: 180 px en Contexto/Lectura de escritorio y tableta, 110 px en celular, y 120 px en Créditos. No quedan alturas vacías añadidas debajo del contenido, desbordamiento horizontal ni contenedores de contenido con desplazamiento vertical interno.

## Inicio completo en la primera vista · 28/10/2026

Por solicitud explícita, las tres portadas muestran su contenido completo al ingresar al comienzo del recorrido. La altura disponible es el alto visible del navegador menos el alto real del encabezado común. Se cuenta ese encabezado una sola vez: con una ventana de 1363×936 y encabezado de 80 px, Inicio dispone de 856 px. Este criterio reemplaza para Inicio las alturas mínimas anteriores, incluido el mínimo de 100svh de Pineau; los demás bloques conservan sus criterios y excepciones vigentes.

`shared/hero-viewport.css`, importada por el encabezado común, adapta la composición al ancho y al alto disponibles. Se ajustan espacios, títulos e imagen de Pineau; banderines, título, pregunta y acciones de Orbuch; y título, presentación y controles de Hobsbawm. Se conservan los textos, imágenes fuente, familias tipográficas, paletas e identidad de cada obra. No se aplica zoom o transformación global ni se ocultan textos o controles para simular el ajuste. Las miniaturas decorativas de documentos de Orbuch se omiten bajo 1024 px y la foto monumental de Pineau se omite en ese mismo umbral; los documentos completos de Orbuch siguen en Contexto y las imágenes fuente permanecen intactas.

Las secciones mantienen altura automática y pueden crecer ante ampliación de texto o ventanas excepcionalmente pequeñas o bajas: prevalecen la legibilidad y el acceso completo al contenido. No se añaden barras internas ni se recorta material. La página completa conserva el desplazamiento general y el paso directo de Inicio a Autor. La referencia estructural inerte incluye la nueva hoja para medir bajo las mismas condiciones.

Se comprobó en Chrome, con fuentes cargadas y lector cerrado, que encabezado más Inicio terminan en el borde visible, con todos los textos y controles dentro de la ventana y sin desbordamiento horizontal. Se revisaron las tres obras en marcos de 1707×773, 1536×695, 1366×768, 1366×600, 1920×870, 1024×768, 768×1024, 390×844, 320×740 y 320×568. Son áreas de navegador en px CSS, no pruebas en dispositivos físicos ni un requisito de zoom del 90 %. Se inspeccionó la composición visual en escritorio y se verificaron a 320×568 la transición sin espacio añadido a Autor, los enlaces con margen de 16 px debajo del encabezado y la apertura/cierre de los tres lectores.

El documento editorial incorpora la sección 2.3 y D13, actualiza la fila de Inicio a 856 px para la referencia 1363×936 y elimina la indicación anterior de 100svh sin descontar el encabezado. Se verificó la conservación de todos los párrafos ajenos al cambio. Pasaron las pruebas del catálogo, las dos obras y Hobsbawm, y las compilaciones limpias con verificación de recursos en raíz y en la base pública de GitHub Pages.

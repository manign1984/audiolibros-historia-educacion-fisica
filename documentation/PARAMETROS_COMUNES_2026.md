# Parámetros comunes de los recorridos · 28/10/2026

## Alcance autorizado

Aplicación a Orbuch y Hobsbawm de los parámetros acordados en [Directrices para crear nuevos recorridos de lectura](https://docs.google.com/document/d/1z0HqT7WR1A4u-RZRaFRINm9TWH5XWX8Lc_Vdj5q0aKM): cinco alturas de Pineau, tipografías de su biografía, foto en blanco y negro y síntesis próxima a sesenta palabras. Sustitución del retrato de Hobsbawm por uno anterior y con encuadre cercano.

## Infraestructura y fidelidad

- `AuthorBiography` comparte la presentación entre las dos obras: nombre en Bebas Neue 400, resumen en Archivo 400, rótulos y enlace en Archivo 700. Se conservan los resúmenes completos: Orbuch, 60 palabras; Hobsbawm, 61. El nombre de Hobsbawm pasa a ser el encabezado principal de Autor; la clave de lectura se traslada a Contexto.
- `generate-layout-reference.mjs` renderiza los componentes actuales de Pineau con React en el servidor antes de cada desarrollo/compilación. Produce una referencia inerte y sin JavaScript, diálogo de lectura, audio ni video activo. Copia sus estilos y fuentes locales; los recursos usan direcciones relativas compatibles con la raíz y GitHub Pages.
- Un marco inaccesible a la navegación, sin permisos para ejecutar scripts, mide esa referencia al mismo ancho y alto de ventana. `ResizeObserver` actualiza las cinco alturas tras cargar las fuentes y al cambiar de pantalla. No se montan dos lectores ni se leen notas/progreso desde el marco. Así se evita aproximar alturas con interpolaciones o convertir el dato de escritorio en una constante para todos los celulares.
- Las dos obras conservan sus contenidos y su identidad cromática. Los bloques que exceden la altura acordada admiten desplazamiento interno; en Orbuch reciben nombre accesible y foco de teclado. Se conserva la navegación de cinco bloques en el encabezado móvil. Las miniaturas decorativas de expedientes se omiten en Inicio móvil; los documentos y reproducciones completos permanecen en Contexto.
- Pineau, `IntegratedReader.jsx`, los documentos temporizados, los MP3, PDF, subtítulos, identificadores y claves de almacenamiento no cambian. Los archivos generados y la página temporal de QA no se versionan.

## Retrato de Hobsbawm

- Recurso añadido: `public/assets/hobsbawm-retrato-joven.jpg`; copia sin alterar del archivo descargado.
- [Ficha de Wikimedia Commons](https://commons.wikimedia.org/wiki/File:A%C3%B1os_interesantes,_Eric_Hobsbawm_(cropped).jpg).
- [Archivo de origen](https://upload.wikimedia.org/wikipedia/commons/c/c3/A%C3%B1os_interesantes%2C_Eric_Hobsbawm_%28cropped%29.jpg).
- La ficha identifica un retrato reproducido en *Años interesantes. Una vida en el siglo XX* (Crítica, 2003) y declara CC BY-SA 4.0. La fecha de edición del libro no se atribuye a la toma fotográfica; la autoría fotográfica no está consignada. Los créditos de la página expresan estas limitaciones y enlazan la ficha y la licencia, sin atribuir la foto al autor del libro.
- La presentación emplea escala de grises y un encuadre de rostro mediante CSS. Se conserva el archivo anterior de Rob Ward (2011) para trazabilidad.

## Comprobaciones

Se midieron las tres páginas en marcos de un navegador Chrome, con fuentes cargadas y lector cerrado. Estos son los valores comunes obtenidos para Pineau, Orbuch y Hobsbawm, en px CSS (redondeados a dos decimales):

| Área de visualización | Inicio | Autor | Contexto | Lectura | Créditos |
|---|---:|---:|---:|---:|---:|
| 1363 × 936 | 936,00 | 582,70 | 2783,25 | 1841,36 | 711,86 |
| 768 × 1024 | 1024,00 | 601,41 | 3482,11 | 1688,88 | 986,11 |
| 390 × 844 | 774,00 | 1127,20 | 4299,56 | 2123,05 | 1548,78 |
| 320 × 740 | 760,00 | 1123,70 | 4350,66 | 2218,50 | 1634,64 |

La comparación no detectó diferencias entre los cinco altos de las tres obras. La redistribución interna mantiene las biografías completas; el contenido más extenso de Orbuch puede requerir desplazarse dentro de su bloque, especialmente en Contexto y Créditos. Son pruebas de marcos de navegador, no de dispositivos físicos.

Se verificaron las familias y pesos calculados de la biografía, ausencia de desbordamiento horizontal, apertura del lector de Orbuch a 320 px, y reproducción, pausa y cambio al segundo apartado de Hobsbawm (audio aproximadamente en el segundo 706). El retrato se inspeccionó visualmente. La batería del catálogo, lector compartido y sincronización, además de las compilaciones y comprobaciones de recursos en raíz y subruta, debe pasar antes de integrar.

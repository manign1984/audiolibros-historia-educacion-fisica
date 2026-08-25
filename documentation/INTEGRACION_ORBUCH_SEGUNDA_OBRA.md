# Integración de Iván Orbuch como segunda obra

## Recuperación previa

Antes de editar GitHub se recuperó e inspeccionó el Site original **Educar el cuerpo dentro y fuera del aula**, publicado en <https://educar-el-cuerpo.man-ign.chatgpt.site>. Se usó como fuente diagnóstica y no se modificó ni se volvió a publicar.

También se revisaron el artículo académico de Orbuch, los cuadernillos completos de 1949 y 1950, el texto accesible de la adaptación para audiolibro, materiales editoriales del proyecto y el informe de aprendizajes de Fresco–Noble. La filiación pública del autor se verificó en [UNAHUR](https://aulaabierta.unahur.edu.ar/index.php/2020/01/08/investigacion-sub-40-ivan-orbuch/) y la referencia del artículo en [HistELA](https://periodicos.ufrn.br/histela/article/view/21435).

## Conservado, modificado y excluido

Se conservaron la identidad cívico-popular azul, dorada y roja; el mural “Amanecer alegórico”; las tipografías; el eje aula–oficina; las reproducciones documentales; el texto accesible; los PDF auténticos y el MP3 definitivo.

La integración inicial condensó la arquitectura editorial en cinco destinos. Tras comparar visualmente la publicación con el Site de referencia, la corrección `fix/orbuch-fidelidad-visual` recuperó siete estaciones informativas. La solicitud editorial posterior vuelve a unificar la navegación con Pineau en cinco bloques exactos: Inicio, Autor, Contexto, Lectura y Créditos. La pregunta-problema permanece en Inicio/Contexto y los dos expedientes primarios se integran dentro de Contexto, por lo que no se pierde contenido al retirar esas estaciones independientes.

La ficha de autor adopta la estructura de Pineau: retrato institucional en blanco y negro, nombre, titulación, síntesis de 60 palabras y enlace de ampliación. La fotografía procede del perfil institucional de UNAHUR *Investigación Sub 40 – Iván Orbuch* (2020) y se acredita tanto junto a la imagen como en Créditos.

No se trasladaron cuestionarios, juegos, actividades prácticas o postlectura, cuentas, backend, CMS ni el CSS acumulado del Site. Tampoco se reutilizó la identidad Art Déco de Pineau. Estas exclusiones responden al alcance editorial y evitan confundir infraestructura compartida con identidad singular.

La corrección de fidelidad no revierte esa decisión. Recupera la composición visual del primer pliegue, el contador y progreso del encabezado, la pregunta que organiza el recorrido, el perfil documental del autor, la cronología vertical, la separación entre lectura y archivo, y los fondos y marcos gráficos propios de cada sección. No reincorpora evaluación ni producción estudiantil.

## Fuentes y fidelidad

- Artículo: 14 páginas, SHA-256 `726b877620519d8b2ad3f2444dfcf04cfed7d68fedae91e4bbcb7a6671ad4ca2`.
- *Gimnasia compensatoria en el aula* (1949): 14 páginas, SHA-256 `c16511428cd149dd4454981b85647dc2dc4be2a2bc417becb6e72edd271ebef2`.
- *Gimnasia de oficinas* (1950): 17 páginas, SHA-256 `52828ca1f89422f0dba788e32566402718a99238a676efdf53087539ef0f5aa2`.
- Texto accesible: SHA-256 `40257bd3e7aeff620cdb0dff1bcf7d51de7c00d134b92b1dda7c622bb7638f3e`.

El PDF es el artículo académico con notas y bibliografía. El texto del lector es la versión accesible preparada para la narración y recuperada del proyecto; no se presenta como extracción literal del PDF. El lector informa esta diferencia y enlaza ambos recursos.

## Audio y sincronización

El MP3 definitivo se recuperó de Drive. Tiene 40.174.404 bytes, MPEG Layer III mono a 44,1 kHz y 192 kb/s, duración `1673.900408` segundos (27:53) y SHA-256 `1ad70702ffd057916d20b17810713f0c8a26f1a076f4bd812a5bb327f5e2140c`.

El proyecto aportó posteriormente el SRT original de 410 cues (406 hablados), SHA-256 `682613e2319592787e38bb5fd426da21803085d20549f0f2c57bd81bed224d87`. Su texto hablado normalizado coincide exactamente con los 22.528 caracteres del guion accesible. La línea temporal del SRT termina en `1668.456` s y el MP3 definitivo en `1673.900408` s; el generador aplica un factor uniforme `1.003263141` y verifica el resultado contra las pausas reales de los cuatro títulos de capítulo, con un error máximo inferior a 0,45 s.

`orbuchReadingDocument` contiene ahora 154 unidades temporizadas —portada, cuatro títulos y 147 oraciones— y la configuración declara `sync.status: 'ready'`. Quedan habilitados resaltado, desplazamiento automático, seguimiento optativo, salto desde una oración y salto temporal desde el selector de capítulos. El SRT se publica también como recurso descargable.

## Arquitectura y aislamiento

Pineau y Orbuch importan el mismo `IntegratedReader.jsx`. Pineau conserva `readingDocument.js`, su MP3, PDF, estilos y claves históricas. Orbuch usa `src/orbuch/orbuchReadingDocument.js`, `orbuch-timings.json`, assets `orbuch-*` y claves propias. Los bundles de Vite extraen un chunk `reader-*` compartido y generan entradas distintas para ambas obras. El selector común de velocidad incorpora `0,9×` y `1,1×` para ambos reproductores, además de las velocidades preexistentes.

El inventario de recursos está en `data/orbuch-assets-inventory.csv` y el contrato para futuras obras en `documentation/LECTOR_COMPARTIDO.md`.

## Limitaciones de verificación

El navegador remoto bloqueó la previsualización local con `ERR_BLOCKED_BY_CLIENT`; no se intentó eludir esa política. Las comprobaciones automatizadas cubren estructura responsive, accesibilidad, rutas, assets, hashes, base de Pages, motor único y ausencia de tiempos inventados. La inspección visual interactiva en los cinco anchos solicitados y la prueba manual completa de controles quedan identificadas para la revisión del PR.

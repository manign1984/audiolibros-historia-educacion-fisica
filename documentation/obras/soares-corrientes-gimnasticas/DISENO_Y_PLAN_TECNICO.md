# Soares · Identidad editorial y preparación técnica

Work 1 · 06-11-2026. Propuesta preparada para Work 2, sin código de página ni cambios de catálogo.

## 1. Concepto y sistema visual

**Concepto rector: «El gesto entre la norma y la expresión».** La cronofotografía ofrece una entrada concreta a la relación entre cuerpo, técnica y conocimiento. Una composición editorial abierta, con alineaciones claras y trazos finos, permite contrastar movimiento y codificación sin usar la estética de un gimnasio contemporáneo. El tratamiento no simula un manual histórico ni transforma las síntesis del proyecto en documentos de época.

| Uso | Color | Condición |
| --- | --- | --- |
| Papel de Inicio, Contexto y Lectura | `#EAE7DF` | Superficie plana, sin textura que reduzca legibilidad |
| Tinta principal | `#252B2F` | Texto corrido; contraste calculado sobre papel 11,60:1 |
| Acento vino | `#643444` | Preguntas, énfasis, encabezados de matriz y botón canónico; contraste sobre papel 8,03:1 |
| Cobre secundario | `#8A5C3B` | Detalles y rótulos puntuales; contraste sobre papel 4,62:1, revisar en render real |
| Autor | `#D8D2C7` | Fondo plano uniforme; retrato auténtico en blanco y negro |
| Encabezado y Créditos | `#0C0E15` | Invariables compartidos; texto y acentos canónicos, logos originales |

Los ratios son cálculo de luminancia de pares de colores sólidos; no certifican contraste de sombras, transparencia, foco o fotografía. El vino distingue a Soares de las combinaciones azul/óxido inspeccionadas en Marcaida y Scharagrodsky. No se colorea el documento histórico para hacerlo coincidir con la paleta.

**Tipografía:** Archivo 400/600/700/900 para contenido y jerarquías de Inicio/Contexto; Bebas Neue 400 para nombre de autora y piezas canónicas que ya la usan. No incorporar familias nuevas. Rótulos de bloque: Archivo 700, 12 px, 1,4 y 0,12 em según norma. Cuerpo propuesto de escritorio 18–20 px, con interlínea 1,45–1,55; las medidas definitivas se ajustarán a la retícula sin reducir lectura cómoda.

**Imágenes:** fotografía de Demeny con sus bordes y proporción completa como primera opción; no colocar texto sobre su zona de trazas. Retrato de Soares con encuadre que preserve cara y hombros; la versión web y el original deben diferenciarse. La conversión a blanco y negro del retrato será un derivado explícito con atribución de origen, sin cambiar rasgos. No hay recreaciones generadas ni imágenes actuales presentadas como documentos históricos.

## 2. Plan de los cinco bloques

| Bloque | Pantallas útiles | Contenido y composición |
| --- | ---: | --- |
| 01 · Inicio | 1 | Título completo y autora a la izquierda; Demeny a la derecha. Debajo del título, subtítulo de la obra y pregunta. Fuente y fecha junto a la fotografía. Pie breve: capítulo académico de 2006; audio 51:53. No agregar botón al bloque siguiente |
| 02 · Autor | 1 | `AuthorBiography`: fotografía auténtica B/N, nombre en Bebas Neue, especialidad, biografía 50–70 palabras, crédito y fuente. Fondo uniforme |
| 03 · Contexto | 3 | El gesto calculable / corrientes y tensiones / alternativas y formación. Composiciones, aprendizajes y microtextos en ANALISIS_Y_CONTEXTO.md |
| 04 · Lectura | 1 | `CanonicalReadingEntry` dentro de `IntegratedReader`: geometría, familias, tamaños, luces, relieves y botón compartidos. Solo paleta, bibliografía y sinopsis propias |
| 05 · Créditos | 1 | `JourneyCredits`, tres columnas y pie completo, fondo idéntico al encabezado, lema obligatorio y procedencias verificadas |

**Inicio, propuesta de pregunta:** «¿Cómo se volvió educable, medible y expresivo el gesto?» El título sigue siendo el de la obra: *Las corrientes gimnásticas europeas y su contenido*, con *Una historia de rupturas y permanencias* como subtítulo. La pregunta es elaboración didáctica, no cita.

**Biografía propuesta, 61 palabras:** «Carmen Lucia Soares fue profesora titular de la Universidad Estadual de Campinas y doctora en Educación. Investigó la historia de la educación del cuerpo, la gimnasia y la higiene, relacionando prácticas corporales, saberes científicos y pedagogías. Sus trabajos permiten comprender cómo se construyeron formas de educar el cuerpo y cómo esas historias interpelan la formación docente y las prácticas del presente.»

Fuentes: perfil académico de FEF/UNICAMP y comunicado de Rectoría del 23-05-2026. La biografía se redacta en pasado: UNICAMP informó su fallecimiento el 22-05-2026. No se copia el tiempo presente de perfiles desactualizados ni se inventa año de nacimiento. La especialidad propuesta es «Historia de la educación del cuerpo · Gimnasia e higiene».

**Sinopsis de Lectura propuesta, 52 palabras:** «¿Cómo se transformaron los movimientos corporales en objetos de conocimiento y educación? Soares recorre la constitución de las corrientes gimnásticas europeas, sus fundamentos científicos y sus tensiones internas. La lectura invita a reconocer rupturas, permanencias y alternativas, y a preguntar qué saberes orientan hoy la formación docente y la Educación Física escolar.»

**Información funcional breve prevista:** «Capítulo académico con notas y bibliografía. El audio narra el cuerpo del texto y abrevia referencias.» Solo después del cotejo acústico se anunciará la función de seguimiento realmente habilitada. Mientras falte, no se promete resaltado verificado. El proceso de colación, los hashes y las correcciones quedan en documentación interna (CAN-01).

## 3. Referencias publicadas efectivamente inspeccionadas

El 06-11-2026 se abrieron la biblioteca, Scharagrodsky y Marcaida–Scaltritti en Chrome mediante lectura del DOM y capturas. Ventana observada: **1707×772 CSS px**, sin emulación de 1363×936 ni prueba de dispositivo físico. Encabezado de Scharagrodsky medido: 80 px; unidades de 692,44 px; Contexto de 1384,89 px (dos unidades). Marcaida: mismas unidades; Contexto 2077,33 px (tres). Son observaciones de referencias existentes, **no aceptación de Soares**.

De Scharagrodsky se observaron portada, primera pantalla de Contexto, presentación canónica de Lectura y Créditos de tres columnas. De Marcaida, estructura pública y primera pantalla de Contexto. El contraste gráfico y las preguntas diferenciadas son aprovechables; sus temas, paletas y modalidades de seguimiento no son plantillas académicas intercambiables. La inspección del código completó la de las demás unidades de ambas obras. No se editaron notas, progreso ni configuración del navegador.

**Aprendizajes incorporados:** conservar las notas del texto aunque no se narren; separar elección editorial, identidad binaria y alineación; no convertir los 593 cues en 593 oraciones; persistir antes de transferir archivos voluminosos; no aplicar la excepción por párrafos de Marcaida. Reutilizar los componentes comunes, sin copiar un lector ni reconstruir Créditos.

## 4. Identidad y contratos del desarrollo futuro

El ID **`soares-corrientes-gimnasticas` ya existe en `plannedWorks.js`**. Se adopta exactamente ese identificador. No existía una implementación con lector ni una rama homónima antes de este Work; sí una ficha pública de preparación, que seguirá sin cambios. Rama creada desde main `8c2bbe4…`: `feature/soares-corrientes-gimnasticas`.

| Pieza prevista para Work 2 | Decisión |
| --- | --- |
| `portable-site/src/soares/` | Página y CSS propios; prefijo `so-` / raíz `.soares-page`; configuración y adaptación de datos separadas |
| `workId` y documento | `soares-corrientes-gimnasticas`; autoría completa; duración 3113,377959 s; siete apartados, notas y bibliografía |
| IDs de pasajes | Prefijo `soa-`; esquema estable de sección/párrafo/oración. Fijar antes de habilitar anotaciones |
| Guardado nuevo | `soares-corrientes-gimnasticas-reader-notes-v1` y `soares-corrientes-gimnasticas-reader-state-v1`; no reutilizar la obra *Prácticas corporales* ni cambiar claves existentes |
| Exportación | `notas-soares-corrientes-gimnasticas.json` y `cuaderno-soares-corrientes-gimnasticas.txt` |
| Lector | `IntegratedReader` compartido con launcher `CanonicalReadingEntry`; `modalAccessibility: true`; unidad objetivo oración, sin `ready` hasta verificar |
| Notas académicas | `endnotes` con llamadas correctas; no confundidas con anotaciones personales; bibliografía estructurada según contrato existente |
| Ruta | `portable-site/textos/soares-corrientes-gimnasticas/index.html`, reemplazando únicamente su ficha futura cuando corresponda |
| Catálogo | Promoción futura revisada; excluir duplicado mediante el filtro existente; duración y stateKey coincidentes; seguir `preparation` en este Work |
| Vite | Entrada explícita al habilitar `available`; la ficha depende ahora del filtro de obras no disponibles. Cambiar solo el estado puede eliminar la ruta construida |
| Registro transversal | Entrada nueva en `validation/works.json` únicamente cuando existan módulos y materiales reales; no registrar hashes previstos ni modificar huellas de otras obras |
| Créditos | Nueva clave `soares` en `creditsContent`, sin alterar referencias de otras obras |

**Dependencia compartida detectada:** `shared/canonical-reading.css` contiene listas explícitas `:is(.hobsbawm-page, …, .scharagrodsky-page)`. Importar el componente no basta para aplicar toda su geometría a `.soares-page`. Work 2 deberá extender esas listas con la nueva raíz de manera acotada, sin duplicar la hoja, cambiar sus medidas ni usar clases de otra obra como atajo. Esta modificación requiere regresión de todas las obras afectadas. `AuthorBiography` ya ofrece la estructura requerida; el iframe de medidas históricas de Pineau no se incorpora.

## 5. Estrategia de archivos binarios, antes de transferir

El MP3 mide 74,72 MB decimales (71,26 MiB). No fragmentar por precedentes: su tamaño admite un archivo íntegro según los [límites documentados de GitHub](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github), aunque supera el umbral de aviso de 50 MiB. **Opción preferida si se confirma la redistribución:** añadir una copia idéntica en `public/assets/soares-corrientes-gimnasticas-audiolibro.mp3`, junto al PDF y VTT originales con nombres estables. Congelar SHA, bytes y duración en el registro. El navegador recibiría un MP3 único, sin concatenación ni reconstrucción al abrir el lector.

La elección evita dependencia de URLs firmadas que caducan y de sesiones autenticadas de Drive. Antes de transferir, comprobar destino y rama; si el archivo ya existe y coincide, reutilizarlo. Si el transporte disponible rechaza 74,72 MB, evaluar primero un origen estable para descarga de build con verificación estricta; solo si no resulta viable, usar partes versionadas y manifiesto con orden y hash de concatenación. No transcodificar para pasar un límite ni aceptar un hash distinto sin revalidar dependencias. Una derivación comprimida sería una decisión separada y documentada.

En Work 1 se verificaron los originales descargados, pero **no se transfirió el MP3 al repositorio ni se probó el transporte de publicación**. La rama guarda enlaces estables, huellas y resultados; no depende de las descargas temporales de esta sesión.

## 6. Riesgos y plan de comprobación de Work 2/3

| Riesgo | Control concreto |
| --- | --- |
| Leer TXT linealmente e intercalar notas | Reconstrucción por página y llamadas; comprobar 29 notas, secuencia de siete apartados y bibliografía completa |
| Llevar correcciones del guion al texto sin registro | Tabla fuente/derivado/razón; conservar errores factuales de fuente con nota editorial diferenciada, especialmente Jahn |
| Tiempos plausibles pero desplazados | Comprobar inicio, mitad, siete encabezados, final y diferencias léxicas contra audio; ampliar ventanas donde haya desajustes; conservar evidencia acústica separada |
| Cues partidos frente a oraciones | Adaptador de alineación por oración; no usar interpolación como verificación; notas y referencias no narradas sin salto ficticio |
| CSS común que no se aplica o altera otras páginas | Extensión mínima de selectores y pruebas de las seis lecturas actuales más Soares |
| Texto largo de título desborda | Ajustar composición de Inicio dentro de su unidad y abreviación del encabezado; conservar título completo en la ficha |
| Derechos no acreditados | Registrar procedencia y límites; resolver permisos pertinentes antes de publicación, sin inventar licencia abierta |
| Cambio de archivo en Drive | Comparar con hashes del ingreso antes de continuar; si cambia, reabrir solo controles afectados |

Orden futuro: recuperar expediente → fijar documento académico y alineación → preparar assets según estrategia → construir página con componentes comunes → registro/catálogo/build → pruebas → corte de Work 2 sin publicación. Comandos completos en el protocolo de autonomía; incluir `npm ci`, suites de validación, catálogo, lector y obras, `validate:works`, build/verify y rutas de raíz/Pages. Añadir comprobaciones significativas de Soares para omisiones, notas, límites del audio e independencia de guardado; no cambiar expectativas de otras obras para ocultar fallos.

G7 requiere navegador con fuentes cargadas: 1363×936, portátil de poca altura, 320/390/768, zoom y movimiento reducido; anclas, foco, modal, Escape, Espacio, capítulos, audio, notas sintéticas, exportación y restauración sin autoplay. En Work 1 no se ejecuta una compilación de una página inexistente ni se declara ese control aprobado. Work 3 reserva publicación, CI/Pages del commit integrado, apertura de ruta directa y verificación de recursos/rangos.

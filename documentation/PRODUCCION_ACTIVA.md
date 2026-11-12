# BEYOND THE STARS · Producción activa y continuidad entre chats

**Fecha del primer registro:** 08/11/2026. **Rama de referencia:** `main`.  
**Propósito:** registrar el estado operativo de la biblioteca, no reconstruir la historia de los chats.  
**Norma superior:** [Directrices canónicas vigentes (v3.0)](https://docs.google.com/document/d/1z0HqT7WR1A4u-RZRaFRINm9TWH5XWX8Lc_Vdj5q0aKM/edit).  
**Estado del catálogo:** corroborar siempre con `portable-site/src/biblioteca/catalog.js` y `portable-site/src/biblioteca/plannedWorks.js`.
**Puerta técnica entre chats:** [Mapa operativo del lector integrado](MAPA_OPERATIVO_LECTOR_INTEGRADO.md). Es una guía de ubicación del código vigente, subordinada a las Directrices 3.0, no un segundo reglamento.

## OBRA ACTIVA · Alejo Levoratti (12/11/2026)

**Obra y workId:** *Los debates de la educación física y los enfoques de las ciencias sociales. Un análisis de los lineamientos curriculares nacionales destinados a la formación docente en Argentina (1993–2015)*, [Revista da ALESDE, 9(1), 45–63 (2018)](https://doi.org/10.5380/jlasss.v9i1.61189). `levoratti-debates-ef`.

**Unidad y estado interno:** unidad 1 · **EN DESARROLLO**. Cinco bloques, Contexto en una pantalla sobre los CBC de 1997 y las recomendaciones del INFD de 2009, y lector textual con navegación por siete apartados. Audio y SRT/VTT pendientes.

**Insumos:** [texto de cátedra](https://docs.google.com/document/d/13A6FQADf_wm9m1g2b6p8U7q6U6PUScpgwh1Td_l6nyk/edit) y [PDF de referencia](https://drive.google.com/file/d/1aUEe7Lr5bTdD4XpziC1PvjMIFfJkxs8b/view).

**Rama y ruta técnica:** [`feature/levoratti-debates-ef`](https://github.com/manign1984/audiolibros-historia-educacion-fisica/tree/feature/levoratti-debates-ef) · [GitHub Pages](https://manign1984.github.io/audiolibros-historia-educacion-fisica/textos/levoratti-debates-ef/).

**Próxima acción única:** comprobación de la página y del lector textual por el responsable tras el despliegue técnico.

---

## REGISTRO ANTERIOR · Mabel Thwaites Rey (12/11/2026)

**Obra y workId:** *La democracia argentina bajo el largo ciclo de hegemonía neoliberal (1983–2013)*, [Voces en el Fénix, 4(31), 32–41](https://www.economicas.uba.ar/extension/vocesenelfenix/la-democracia-argentina-bajo-el-largo-ciclo-de-hegemonia-neoliberal-1983-2013/). `thwaites-rey-democracia-argentina`.

**Unidad y estado interno:** unidades 2 y 3 · **EN DESARROLLO**. El lector integrado usa la [edición de cátedra](https://docs.google.com/document/d/1bpMEpjWIhFRf1NeSuFP0AsJiwoMzV0kewOUCmurCiMs/edit) y conserva cuatro apartados y 29 párrafos. Se migra el cuaderno y el avance del lector textual por página.

**Insumos:** [MP3 de 27:05](https://drive.google.com/file/d/1dvnG5HsLSYHnsXGKDN4JcY9ycRLddHsV/view), preservado en 17 partes consecutivas y verificado por SHA-256, y [SRT original de 366 marcas](https://drive.google.com/file/d/1LcoOQWKccvjINep6IwBokY15r_IvXQpy/view). Las marcas alimentan el resaltado aproximado por párrafos.

**Rama, PR, commit y ruta:** [PR #147](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/147) · `cf74a0b51cd1dced1ef6a8d9f415d6cb98d4b4f3` · [feature/thwaites-rey-lector-integrado](https://github.com/manign1984/audiolibros-historia-educacion-fisica/tree/feature/thwaites-rey-lector-integrado) · [Página textual original, PR #146](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/146) · [Ruta técnica de Pages](https://manign1984.github.io/audiolibros-historia-educacion-fisica/textos/thwaites-rey-democracia-argentina/).

**Próxima acción única:** comprobación del responsable de la reproducción, el resaltado y el cuaderno en el lector integrado desplegado.

---

## REGISTRO ANTERIOR · Juan Carlos Torre y Elisa Pastoriza (12/11/2026)

**Obra y workId:** *La democratización del bienestar*, capítulo V de *Los años peronistas (1943–1955)*, Sudamericana, 2002. `torre-pastoriza-bienestar`.

**Unidad y estado interno:** unidad 3 · **EN DESARROLLO**. Cinco bloques, Contexto en dos pantallas y [edición de cátedra](https://drive.google.com/file/d/1BJNJ5DyEJIylbX8E5EG6i2WMoFh5-1yx/view). [Ruta técnica](https://manign1984.github.io/audiolibros-historia-educacion-fisica/textos/torre-pastoriza-bienestar/).

**Integración audiovisual:** [PR #145](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/145), rama `feature/torre-pastoriza-lector-integrado`, sobre la página textual de la [PR #144](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/144). El lector canónico ofrece reproducción directa, resaltado aproximado de 97 párrafos y migración del cuaderno y progreso textuales.

**Material audiovisual:** el [MP3 base](https://drive.google.com/file/d/1UqzrhEcvscmPLuzWJ7xHnWzUrPVr4gNI/view) y la [narración de los cuatro párrafos finales](https://drive.google.com/file/d/1Toj2LfR_NR9zG0VVigXEe9G60JUC8lpp/view) se empalmaron sin recodificación. El [MP3 completo para publicación](https://drive.google.com/file/d/1F9nw482pxJHxQ_a4gmL4llpnROjgv9rn/view) dura 2:18:19,964 y la compilación verifica su tamaño y SHA-256. Se conserva el [SRT completo](https://drive.google.com/file/d/1bxeT-I4RAvOac9oSr0SJkKFCuYs4m953/view). El resaltado del cierre usa los tiempos del [SRT del fragmento](https://drive.google.com/file/d/1Gxs5Ks79D65NsrVG6S-UsQbAYT8WFK3H/view) desplazados al empalme.

**Comprobaciones locales:** catálogo, pruebas del lector, integridad y compuerta B04.11.2 en raíz y con la base de GitHub Pages.

**Próxima acción única:** tras el despliegue de la PR #145, comprobación personal del responsable en la ruta publicada, incluido el audio y el resaltado alrededor de 2:16:54.

---

## REGISTRO ANTERIOR · María Andrea Feiguin y Ángela Aisenstein (12/11/2026)

**Obra y workId:** *Diseño de sujetos morales, sanos y patriotas. Formación de profesores de Educación Física. Argentina, 1938–1967*. *Pedagogía y Saberes*, (44), 9–20 (2016). `feiguin-aisenstein-sujetos`.

**Unidad y estado interno:** unidades 1, 2 y 3 preparadas e integradas en la rama. **EN DESARROLLO** hasta que el responsable compruebe y acepte la experiencia desplegada.

**Rama, PR y commit de implementación:** `feature/feiguin-aisenstein-sujetos` · [PR #142](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/142) · `37c65f713082e78f6ee21d14d674818f6281e4f2`.

**Producto:** cinco bloques, Contexto de una pantalla sobre ingreso, internado y liderazgo, y `IntegratedReader` con `CanonicalReadingEntry`. Se conservan el [artículo original](https://hdl.handle.net/20.500.12209/7554), seis notas académicas, 47 referencias y el [MP3 original](https://drive.google.com/file/d/1pPrjiAFoQ5qGyza2yIDpTZgsvSG2Bowj/view) en 47 partes consecutivas (46:55). El [SRT aportado](https://drive.google.com/file/d/1aXyjKKg1WKa1D62tS1Cngr0OaJAYvAYH/view) contiene 565 marcas y sustenta el resaltado aproximado de 69 párrafos. Compilaciones locales, compuerta de CSS B04.11.2 y validación de la obra aprobadas para raíz y Pages.

**Próxima acción única:** comprobación del responsable en la [ruta técnica de Pages](https://manign1984.github.io/audiolibros-historia-educacion-fisica/textos/feiguin-aisenstein-sujetos/) una vez concluido el despliegue asociado a la PR.

---

## REGISTRO ANTERIOR · Cecilia Almada · Los privilegiados en la Nueva Argentina (12/11/2026)

**Obra y workId:** Cecilia Almada, *Los privilegiados en la Nueva Argentina. La cultura física y el deporte en la política del peronismo*, *History of Education in Latin America - HistELA*, 3, e21434 (2020). [Edición original](https://doi.org/10.21680/2596-0113.2020v3n0ID21434). `almada-privilegiados`.

**Unidad y estado interno:** unidades 1 (página), 2 (materiales del lector) y 3 (integración y despliegue técnico) realizadas. **EN DESARROLLO** hasta la comprobación y aceptación exclusiva del responsable. Los cinco bloques, el Contexto de dos pantallas y el bloque 04 canónico permanecen sin rediseños.

**Ramas, PR y commits:** página textual [PR #138](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/138) y registro inicial [PR #139](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/139); actualización audiovisual en `feature/almada-lector-audio`, [PR #140](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/140), fusionada en `main` mediante `5c4add995d501238595f38e78b3879e893d4a470`.

**Material académico y lector:** se conserva el [texto de cátedra de 16 páginas](https://drive.google.com/file/d/1t53oZ47OzCAcaJiBNkyZSTQSTOdk8oa3/view), su resumen/abstract, los apartados, 21 notas académicas y bibliografía. `src/almada/readingDocument.generated.json` contiene seis apartados con IDs estables, 29 párrafos narrados asociados a marcas temporales del SRT y el mapa de páginas del lector anterior. Se reutilizan `IntegratedReader` y `CanonicalReadingEntry` sin modificar componentes compartidos. Se migran de forma no destructiva las notas y el progreso del `TextOnlyReader` previo a claves únicas del lector audiovisual.

**Audio y seguimiento:** [MP3 institucional](https://drive.google.com/file/d/17hNcfspCj6AdsvNYtWiYOTMzgUEXam3j/view) de 14.237.103 bytes, duración 1.423,673469 s, distribuido en 24 fragmentos consecutivos bajo `public/assets/almada/audio/`; [SRT original](https://drive.google.com/file/d/1DQ5TBSzzM0hIf87hCJpj3kFukWvUwgqd/view) de 313 marcas, conservado bajo `public/assets/almada/subtitulos.srt`. Se utiliza SOLO para resaltar aproximadamente el párrafo académico correspondiente durante la reproducción; no se presentan subtítulos independientes. No se realizó auditoría acústica de oficio.

**CI y despliegue:** [CI de PR #140](https://github.com/manign1984/audiolibros-historia-educacion-fisica/actions/runs/43240010700) concluyó **SUCCESS**. La compuerta B04.11.2 confirmó CSS de modal, retícula y reproductor en 12 entradas tanto con base `/` como en GitHub Pages. [Despliegue GitHub Pages](https://github.com/manign1984/audiolibros-historia-educacion-fisica/actions/runs/43240495484) concluyó **SUCCESS**. URL técnica: https://manign1984.github.io/audiolibros-historia-educacion-fisica/textos/almada-privilegiados/ .

**Próxima acción única:** **COMPROBACIÓN EXCLUSIVA DEL RESPONSABLE** de la experiencia desplegada: abrir el lector, escuchar, pausar, recorrer el texto, apreciar el seguimiento por párrafos y las notas, utilizar el cuaderno, exportar y revisar en dispositivos de su elección. No declarar COMPLETA por el éxito técnico de CI ni efectuar verificaciones manuales de oficio.

---

## REGISTRO ANTERIOR · Pablo Pineau · Reprimir y discriminar (12/11/2026)

**Obra y workId:** Pablo Pineau, *Reprimir y discriminar. La educación en la última dictadura cívico-militar en Argentina (1976–1983)*, *Educar em Revista*, 51, 103–122 (2014). `pineau-reprimir-discriminar`.

**Unidad y estado interno:** unidades productivas 1, 2 y 3 implementadas, integradas y desplegadas técnicamente. **EN DESARROLLO** hasta la comprobación y aceptación del responsable. Cinco bloques; Contexto de dos pantallas; retrato y biografía anteriores de Pineau reutilizados con nuevo fondo; acceso a lector mediante CanonicalReadingEntry + IntegratedReader, sin editar componentes compartidos.

**Rama, PR y último commit:** `feature/pineau-reprimir-discriminar-1976-1983` · [PR #136](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/136) fusionada a `main` mediante `ee142e975a1d47cd783465241cc04ed9d067499d`.

**Material persistido:** cuatro apartados y 58 párrafos del [documento de cátedra](https://docs.google.com/document/d/12Zdn1aWkeeAZ4ByTPsfCh3aOrNCOM8z7oqB01MJNNyc/edit). El [PDF académico](https://drive.google.com/file/d/1vPYdIzNLMJNFLsZoK9z3EQED4mgGCdEt/view) conserva resúmenes, notas y aparato crítico externos al texto de locución. Audiolibro de 30.272.629 bytes (3.027,226122 s) conservado en 12 fragmentos consecutivos, a partir del [MP3 original](https://drive.google.com/file/d/18QKaPPT2BpxX97KU4RbQK2m8_z1JI5Fi/view). [SRT original](https://drive.google.com/file/d/1XcPU5qHkpkgtgpSpOw6YxBtCXqfU10kA/view) de 604 marcas usado solo como insumo temporal para seguimiento aproximado por párrafos. Sin subtítulos visibles ni auditoría acústica. Identificadores de anotación y progreso propios de la obra.

**CI y despliegue:** [CI de PR #136 · SUCCESS](https://github.com/manign1984/audiolibros-historia-educacion-fisica/actions/runs/43217548701), con validación de estilos CSS para raíz y Pages. [Build main · SUCCESS](https://github.com/manign1984/audiolibros-historia-educacion-fisica/actions/runs/43217817102) y [Pages · SUCCESS](https://github.com/manign1984/audiolibros-historia-educacion-fisica/actions/runs/43217817300). URL técnica: https://manign1984.github.io/audiolibros-historia-educacion-fisica/textos/pineau-reprimir-discriminar/ .

**Próxima acción única:** **COMPROBACIÓN EXCLUSIVA DEL RESPONSABLE** sobre la página desplegada: composición, apertura del lector, texto, audio, seguimiento, notas, exportación y accesibilidad. No declarar COMPLETA por el éxito técnico de CI ni iniciar pruebas perceptivas por parte del asistente.

---

## REGISTRO ANTERIOR · Alejo Levoratti (12/11/2026)

**Obra y workId:** Alejo Levoratti, *La educación física y la gimnasia en la educación primaria y el nivel medio. Un estudio sobre las perspectivas teóricas en circulación (Argentina, 1958–1968)*, *Revista da ALESDE*, 14(2), 162–178 (2022). `levoratti-gimnasia-1958-1968`.

**Unidad y estado interno:** unidades 1 y 2 finalizadas; unidad 3 integrada técnicamente en `main`. **EN DESARROLLO** hasta comprobación y aceptación del responsable. La página conserva cinco bloques, con Contexto en dos pantallas, un único bloque 04 rígido y el lector audiovisual común `IntegratedReader` + `Launcher={CanonicalReadingEntry}`.

**Rama, PR y último commit:** `feature/levoratti-integrated-reader-audio` · [PR #129](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/129), fusionada a `main` mediante commit `863d3abac562fda2d457103472ae8c9a0fbf2a73`. Página textual previa: [PR #123](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/123); herencia CSS común B04.10 resuelta con anterioridad en [PR #124](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/124), sin tocar piezas `shared/` en #129.

**Producto persistido y recursos:** edición de origen de 17 páginas; en el lector integrado se presentan cinco secciones desde «Introducción» hasta «Referencias», con cinco notas académicas vinculadas, sin el bloque de portada, resúmenes y abstracts (conservado en el TXT/PDF originales), `src/levoratti/readingDocument.generated.json`; 39 párrafos narrativos con seguimiento aproximado por párrafos derivado de **460 marcas SRT** originales, sin subtítulos visibles, y preliminares/notas/referencias sin marcas inventadas. Audiolibro **22.197.397 bytes** repartidos en **17 fragmentos**, que suman el tamaño reportado en Drive (sin afirmar igualdad criptográfica). Configuración `readerConfig.js`, `readerContract.js`, y migración no destructiva de notas/progreso del `TextOnlyReader` previo. [MP3 original](https://drive.google.com/file/d/1-DNXydWy3mr6aitsR6wOC6I5Kr-BT3jQ/view) · [SRT original](https://drive.google.com/file/d/1s7peb29sIXe_UxH0NmW3_38vmLBDjuxZ/view) · [PDF académico](https://drive.google.com/file/d/1HC1dr49ict6QNR1QUDmbi8ubKQqHqy2F/view) · [texto para narración](https://docs.google.com/document/d/1FDKS6tzTd4ZuyoehO0qyrKdjubq3A0M-XZnk_E1MuCY/edit). [CI PR #129](https://github.com/manign1984/audiolibros-historia-educacion-fisica/actions/runs/43151318198): **SUCCESS**. [GitHub Pages posterior a merge](https://github.com/manign1984/audiolibros-historia-educacion-fisica/actions/runs/43151597610): **SUCCESS**, incluida la publicación automática. URL técnica: https://manign1984.github.io/audiolibros-historia-educacion-fisica/textos/levoratti-gimnasia-1958-1968/ . No hay ficha nueva en catálogo general: es una acción editorial separada, no un impedimento para la ruta técnica.

**Corrección de infraestructura y prevención transversal (12/11/2026):** la captura del responsable mostró el modal de Levoratti sin diseño porque `src/levoratti/LevorattiMain.jsx` no importaba los estilos globales, `src/reader.css` ni las fuentes. Resuelto mediante [PR #131](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/131), siguiendo el antecedente de Arata–Mariño [PR #122](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/122). El fallo se convirtió en la **regla rígida B04.11.2** de las Directrices 3.0: antes de fusionar una obra con IntegratedReader, CI exige las importaciones del lector, las tipografías y el CSS emitido para raíz y GitHub Pages. Implementación [PR #133](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/133) (CSS) y [PR #134](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/134) (Archivo/Bebas Neue), integradas en `main`, último commit `a47625575c9ef0a8c6003ff8419dfffbae0e5985`. CI verificó **10 entradas con lector audiovisual en ambas bases** y [Pages #43205927136](https://github.com/manign1984/audiolibros-historia-educacion-fisica/actions/runs/43205927136) terminó SUCCESS. Esto prueba la inclusión técnica de estilos, no el aspecto visual real ni la aceptación personal de Levoratti.

**Próxima acción única:** **COMPROBACIÓN EXCLUSIVA DEL RESPONSABLE** de la página desplegada, apertura del modal, lectura, audio, resaltado temporal, cuaderno y progreso. Registrar únicamente incidencias concretas comunicadas. No efectuar pruebas manuales posteriores al despliegue ni declarar obra COMPLETA por éxito de CI.

---

## 0. Obra concluida · Arata y Mariño (11/11/2026)

**Estado interno: COMPLETA · incorporación técnica y despliegue verificados.** Nicolás Arata y Marcelo Mariño, *Auroras y tempestades: la educación entre golpes (1955–1976)*, lección 10 de *La educación en la Argentina. Una historia en 12 lecciones*. El recorrido conserva los cinco bloques públicos (Inicio, Autor, Contexto en dos pantallas, Lectura y Créditos) y la identidad editorial definitiva.

**Publicación:** [PR #120](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/120), fusionada en `main` con commit `8fb1920c4ded202cd68404e1f5443c46e0e5c555`. [CI #43121250309](https://github.com/manign1984/audiolibros-historia-educacion-fisica/actions/runs/43121250309) y [despliegue Pages #43121465571](https://github.com/manign1984/audiolibros-historia-educacion-fisica/actions/runs/43121465571): **SUCCESS**. Página: https://manign1984.github.io/audiolibros-historia-educacion-fisica/textos/arata-marino-auroras-tempestades/#lectura . El acceso HTTP mediante un navegador independiente de la sesión no pudo probarse desde la herramienta de consulta externa; el flujo DOM y la compilación publicada sí se verificaron en CI. Una observación perceptiva breve de escritorio/móvil es conveniente para detectar incidencias que los controles automáticos no aprecien; no reabrir tareas ya superadas sin un fallo concreto.

**Contrato canónico:** `ArataMarinoApp.jsx` renderiza directamente `<IntegratedReader ... Launcher={CanonicalReadingEntry} />` alimentado por `readerContract.js`. El bloque 04 mantiene «ESCUCHÁ · LEÉ · ANOTÁ» y el botón **ABRIR EL LECTOR**. Una pulsación abre el modal compartido; no hay formularios de archivos, pantallas previas ni alternativa editorial transitoria. Reutiliza reproducción/pausa, navegación, seguimiento por párrafos, notas, exportación y progreso almacenado con claves propias. El catálogo declara `available`, duración `3612.447347` s y `stateKey='arata-marino-audio-state-v1'`.

**Texto y audio fieles:** PDF académico original de 20 páginas; `pdftotext -layout` genera el TXT de **66.827 bytes** con SHA-256 comprobado y preserva ocho apartados, apertura, bibliografía y referencias complementarias. Modelo de **9 secciones, 79 párrafos**, con **78 anclajes** por el SRT original de **796 cues** y un cuadro estadístico no temporizado (sin marcas inventadas). Audiolibro de **36.125.008 bytes** con **17 fragmentos exactos**; SHA-256 del original `164eaa55ca2fc06232aae4cf80f2d3f3ddf8f7e97d4e4b55e4a63e2ba3929980`. Duración MP3 **3612,447 s**; final SRT **3616,800 s**: diferencia conocida de **4,353 s** documentada en `validation/works.json`, sin modificar el original ni investigar desfasajes de oficio. Un único cuadro estadístico permanece sin asociación de audio.

**Producción reproducible:** `portable-site/scripts/prepare-arata-marino-assets.mjs` verifica hashes PDF/SRT y genera `public/assets/arata-marino/edicion-academica.txt` más `src/arata-marino/readingDocument.generated.json` durante `prebuild/predev`. Los 17 fragmentos MP3 y el SRT ya están bajo `public/assets/arata-marino/`; el PDF fuente se conserva bajo `source-assets/arata-marino/`. El validador común registra **21 recursos**, duración y diferencia del SRT. Los workflows instalan `poppler-utils` antes de compilar. Las pruebas comprobaron apertura directa del modal, 79 párrafos, 17 partes, ausencia de formularios/subtítulos superpuestos, integridad y regresiones con otras obras. [Guía de recuperación](obras/arata-marino-auroras-tempestades/LECTOR_LOCAL.md).

**Continuidad:** La observación histórica sobre derechos sigue registrada una sola vez en [OBSERVACIONES_DERECHOS_PENDIENTES.md](OBSERVACIONES_DERECHOS_PENDIENTES.md) para tratamiento institucional, sin originar nuevas comprobaciones rutinarias ni variantes en la interfaz. PR #109–#119 son antecedentes conservados en el historial; no sustituir el contrato y código actuales por sus soluciones transitorias. **Próxima acción:** pasar a la siguiente obra o atender únicamente una incidencia visible que se observe al utilizar este lector.


---

## 1. Registro previo · Ignacio Melano

**Intervención visual de Inicio (12/11/2026):** diseño solicitado por el responsable en [PR #128](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/128). Se conserva la composición PNG original recibida (resolución ministerial 543/77 y fotografía institucional) en `portable-site/public/assets/melano/inicio-archivo-1977.png`, comprobada por identidad de bytes/Git blob SHA `dc73757ecbe1578762250646ced96c97497425df`. El bloque 01 emplea tipografía mecánica monoespaciada sobre la zona libre izquierda, con tratamiento adaptable a móvil; el encabezado, los bloques 02–05 y el lector no se modifican. La percepción editorial definitiva corresponde a la revisión del responsable sobre la página desplegada.


**Obra previa:** Ignacio Melano · *Militares al gobierno, juramentados al poder: la reapertura del INEF Gral. Belgrano en la década del 70* (capítulo 6, edición impresa 2025; archivo rotulado 2024).  
**Hito 10/11/2026:** Etapa A, depuración textual. PDF de 19 páginas impresas (131–149); se retiraron notas al pie 193–212, encabezados y folios y se integró el cuerpo en el [Google Docs de narración](https://docs.google.com/document/d/19xEmFfftckPYwctxTmZdGWFmLG6PIjxoF_evctmzQmA/edit). Conserva seis apartados, citas y contenido principal. [PDF original](https://drive.google.com/file/d/11kPIjFdMMIAwgfiukL0VenWDqloa10oB/view). Extensión aproximada inicial: 35.940 caracteres; luego se retiraron las citas parentéticas. En este hito aún no existían MP3/SRT/VTT ni página web construida; la página textual se implementó posteriormente en B.  
**Actualización 10/11/2026:** Versión para ElevenLabs depurada de 35 citas parentéticas, dos fragmentos de una referencia bibliográfica dividida y un año citado dentro de un paréntesis explicativo; se conservan fechas y aclaraciones históricas. Existe una [copia académica con citas](https://docs.google.com/document/d/19_QDXB4uo8kaAhUA8yDbWTokbdzSEPYAFwlrqroxWLk/edit) para el lector visual; la copia original PDF también se conserva. No usar el TXT de locución como sustituto del texto académico con referencias en el futuro lector.  
**Etapa B implementada en rama:** `feature/melano-militares-juramentados`, [PR #104](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/104). Página con `JourneyHeader`, `AuthorBiography` y retrato original, Contexto en dos pantallas, `CanonicalReadingEntry`/`TextOnlyReader`, `JourneyCredits`. Paleta enviada por usuario: #051e28, #3a8841, #40b5bc, #483df6, #86759f. El texto del sitio conserva las citas y notas 193–212; el texto de voz no incluye citas APA.  
**Tramo 1 audiovisual (11/11/2026):** en la rama `feature/melano-integrated-reader-audio`, PR #106 (borrador), ya se incorporaron el SRT de ElevenLabs (489 segmentos) y los ocho fragmentos consecutivos del MP3 (suman 23.492.550 bytes, exactamente el tamaño informado por Drive; todavía no se afirma identidad criptográfica). El nuevo generador reutiliza el capítulo académico completo (61 párrafos, 20 notas, citas) y las marcas de tiempo del SRT para un seguimiento **aproximado por párrafos**, sin investigación acústica. Se conectó `IntegratedReader` con `CanonicalReadingEntry`, subtítulos visibles opcionales, carga del audio por fragmentos, validación de tamaño y migración no destructiva de notas/progreso previos. La prueba `test:melano` y la batería general de CI terminaron correctamente (25 pasos, [ejecución 42961102679](https://github.com/manign1984/audiolibros-historia-educacion-fisica/actions/runs/42961102679)). En este primer tramo los cambios todavía no estaban fusionados; las pruebas de compilación tampoco sustituían una observación perceptiva/visual en navegador.  
**Tramo 2 técnico (11/11/2026):** la [PR #106](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/106) se fusionó a `main` con commit `c8142db3616c1b3a29d45d3930f6b1f367abe9cb`. La nueva prueba de interacción de Melano en DOM simulado y toda la batería de CI se aprobaron ([CI de PR](https://github.com/manign1984/audiolibros-historia-educacion-fisica/actions/runs/42962040969), [CI main](https://github.com/manign1984/audiolibros-historia-educacion-fisica/actions/runs/42962215517)). GitHub Pages confirmó build y despliegue exitosos ([ejecución 42962215568](https://github.com/manign1984/audiolibros-historia-educacion-fisica/actions/runs/42962215568)). La prueba DOM comprueba partes del audio, subtítulos alternables, reproducción simulada, 61 párrafos, 20 notas y progreso. **No equivale a escucha real ni a revisión visual responsive**; el acceso HTTP independiente desde este entorno no pudo corroborarse. La etapa C técnica está terminada y la obra sigue EN DESARROLLO solo hasta la revisión perceptiva breve.  
**Ajuste de consistencia (11/11/2026):** el SRT se había utilizado tanto para acompañar los párrafos como para mostrar una barra adicional de subtítulos, introducida sin acuerdo editorial. Se corrigió esa expansión: el archivo SRT, sus 489 segmentos y los intervalos de sincronización aproximada permanecen; se retira solo la nueva barra visible y sus pruebas, preservando el motor compartido. La arquitectura y el circuito de relevo quedan documentados en [MAPA_OPERATIVO_LECTOR_INTEGRADO.md](MAPA_OPERATIVO_LECTOR_INTEGRADO.md). La revisión perceptiva breve continúa pendiente.  

**Ficha editorial actualizada:** [MELANO_FICHA_ETAPA_A.md](MELANO_FICHA_ETAPA_A.md). Documento operativo de esta obra; no modifica Directrices v3.0.  
**Estado interno:** EN DESARROLLO. **Etapa:** C técnica completada; PR #104 (texto) y #106 (audiovisual) integradas en `main`, CI y despliegue Pages aprobados. Queda una comprobación visual y auditiva breve en navegador real.  
**Comprobación pendiente de Melano (no ejecutada en este hito):** abrir el lector publicado en escritorio y móvil, reproducir un fragmento real, observar el seguimiento por párrafos del texto y guardar una nota. Registrar solo incidencias perceptibles. Si todo funciona, marcar estado interno COMPLETA sin rehacer CI ni auditar acústicamente de oficio.  
**Criterio operativo:** trabajo proporcionado al objetivo; reutilizar componentes y no abrir auditorías acústicas, jurídicas ni investigaciones redundantes.

Cada página tiene tres etapas de trabajo, no tres Work ni tres chats obligatorios:
- **A · Preparar:** reunir recursos facilitados, identificar edición y autoría, y definir el Contexto (UNA o DOS pantallas útiles, máximo rígido de dos según las Directrices 3.0, sección 3.5).
- **B · Construir:** reutilizar los cinco bloques, el lector y las funciones comunes; integrar texto primero si es necesario, y MP3/SRT/VTT cuando estén disponibles. Los cinco bloques construidos pueden desplegarse técnicamente con estado EN DESARROLLO.
- **C · Comprobar y desplegar:** verificaciones funcionales mínimas, compilación, despliegue y URL real; registrar commit y estado interno. El despliegue técnico no equivale a COMPLETA ni a difusión institucional.

**Audio y subtítulos:** usar los tiempos recibidos. CERO investigaciones acústicas, CERO búsqueda de desfases o incompatibilidades. El responsable comunica el error perceptivo cuando exista; solo entonces se corrige el punto indicado. Prohibidas por defecto Whisper, CTC, alineación forzada, análisis de silencios y rondas de escucha.

## 2. Estados técnicos del catálogo observados el 08/11/2026 (histórico)

| Obra / grupo | Estado en código `main` | Acción pendiente asignada |
| --- | --- | --- |
| Carmen Lucia Soares, *Las corrientes gimnásticas europeas* | `available`; seguimiento aproximado por párrafos | Ninguna |
| Lucía Lionetti, *La función republicana de la escuela pública* | `text` («Solo lectura»), PR #87 y mejora #91 publicadas | Ninguna; lector textual de 32 páginas funcional en el código |
| Marcaida y Scaltritti, *La construcción del Estado nacional argentino* | `review` | Ninguna |
| Orbuch, Pineau/Fresco–Noble, Hobsbawm, Aisenstein/Tabla rasa y Scharagrodsky | `available` | Ninguna |
| Demás fichas de `plannedWorks.js` | `preparation` salvo las excepciones citadas | Elegir próximas obras solo con datos confirmados |

Los valores `available`, `review`, `text` y `preparation` de esta tabla son **valores técnicos históricos del código**, no los estados normativos 3.0. Los únicos estados internos de producción acordados son EN DESARROLLO y COMPLETA. `text` como en Lionetti no es COMPLETA; el lector textual sí está implementado. La identificación pública acordada para recorridos en construcción es «Leer + escuchar»; su adopción en el código debe verificarse cuando se intervenga el catálogo, sin presumir que ya se modificó. No se han re-auditado perceptivamente todas las páginas. La lista no establece un orden.

## 3. Ficha histórica de reanudación · Melano (conservada)

| Campo | Valor vigente |
| --- | --- |
| Obra anterior | Ignacio Melano · *Militares al gobierno, juramentados al poder* (capítulo 6, edición impresa 2025) |
| Etapa | C técnica completada; lector audiovisual integrado a `main` mediante PR #106, publicado técnicamente en GitHub Pages. |
| Estado interno | EN DESARROLLO: publicación técnica lograda; resta comprobación breve de experiencia visual/auditiva en navegador real. |
| Rama / PR | PR #104 y PR #106 fusionadas; código de producción en `main`. |
| Último commit de código reutilizable | `c8142db3616c1b3a29d45d3930f6b1f367abe9cb` (integración audiovisual PR #106). |
| Enlace al original | https://drive.google.com/file/d/11kPIjFdMMIAwgfiukL0VenWDqloa10oB/view |
| Texto para ElevenLabs (sin citas) | https://docs.google.com/document/d/19xEmFfftckPYwctxTmZdGWFmLG6PIjxoF_evctmzQmA/edit |
| Texto académico para lector (con citas) | https://docs.google.com/document/d/19_QDXB4uo8kaAhUA8yDbWTokbdzSEPYAFwlrqroxWLk/edit |
| Incidencia pendiente | No faltan MP3 ni SRT. CI y Pages aprobados; no se verificaron de manera perceptiva reproducción real ni diseño responsive. |
| **Próxima acción única** | Revisión visual/auditiva breve en escritorio y móvil, incluyendo resaltado de párrafos y notas; corregir solo incidentes reales; si está bien, marcar COMPLETA. |
| Ruta de publicación | `https://manign1984.github.io/audiolibros-historia-educacion-fisica/textos/melano-militares-juramentados/` (ruta compilada y verificada por CI, despliegue Pages exitoso; HTTP independiente no corroborado desde este entorno). |

Al iniciar una obra, completar únicamente estos campos y el estado interno EN DESARROLLO/COMPLETA. Al terminar una etapa A, B o C, **guardar un commit verificable y actualizar esta ficha antes de seguir**. No esperar al límite del chat. No crear un expediente nuevo para cada intercambio. Los materiales grandes permanecen en sus ubicaciones autorizadas; no poner texto académico, audio privado o credenciales en esta ficha.

## 4. Protocolo para iniciar o cambiar de chat

1. Leer este documento desde `main`, las Directrices vigentes enlazadas y el [mapa operativo del lector](MAPA_OPERATIVO_LECTOR_INTEGRADO.md); inspeccionar **solo los archivos de la obra activa o del cambio concreto**.
2. Contrastar rama, PR y último commit con GitHub. No repetir etapas completadas.
3. Continuar la **próxima acción única**; trabajar sobre el código existente y guardar por hito importante.
4. Actualizar esta ficha y el estado del catálogo solo cuando se haya comprobado el cambio real.
5. Si hay un límite del chat, la siguiente conversación comienza con esta ficha, **sin reconstruir el trabajo anterior desde mensajes**.

**Texto corto para un nuevo chat:**
> Continuemos BEYOND THE STARS. Recuperá `documentation/PRODUCCION_ACTIVA.md` de `main` en `manign1984/audiolibros-historia-educacion-fisica` y las Directrices canónicas enlazadas. Retomá la próxima acción única. No repitas trabajos confirmados, no hagas investigaciones acústicas ni busques desfases. Guardá el código y actualizá la ficha tras cada etapa.

## 5. Jerarquía de fuentes y documentación histórica

1. Directrices canónicas vigentes: reglas generales, arquitectura, funciones y restricciones.
2. Este documento: estado actual, obra activa, prioridad y siguiente acción.
3. GitHub (código, ramas, PR, commits): evidencia de lo implementado.
4. Expedientes anteriores: historial, **no instrucciones operativas superiores**.

Los documentos `documentation/PRODUCCION_POR_ETAPAS_2026-11-06.md` y `documentation/PROTOCOLO_AUTONOMIA_V1_2026-11-06.md` describen procesos anteriores de 2–3 Work y estudios acústicos que quedan **sustituidos en esos puntos**. Conservarlos como referencia histórica. No copiar sus puertas antiguas a una obra nueva.

**Regla de mantenimiento:** una única fuente de estado vigente, mínima y actualizada al cerrar cada etapa. No introducir fechas, avances, permisos o publicaciones que no estén confirmados.

## 6. Nota normativa del 10/11/2026

La v3.0 sustituye cuotas de tres páginas por jornada, exigencia de audiolibro antes de comenzar, Work 1/2/3 obligatorios y auditorías de oficio. Las pruebas proporcionales y el registro único de observaciones sobre derechos rigen según las Directrices; véase [OBSERVACIONES_DERECHOS_PENDIENTES.md](OBSERVACIONES_DERECHOS_PENDIENTES.md). Este registro no declara que todas las obras históricamente marcadas `available` estén cerradas editorialmente: su estado se comprobará cuando corresponda intervenirlas.

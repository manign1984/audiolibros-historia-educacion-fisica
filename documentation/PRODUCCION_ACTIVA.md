# BEYOND THE STARS · Producción activa y continuidad entre chats

**Fecha del primer registro:** 08/11/2026. **Rama de referencia:** `main`.  
**Propósito:** registrar el estado operativo de la biblioteca, no reconstruir la historia de los chats.  
**Norma superior:** [Directrices canónicas vigentes (v3.0)](https://docs.google.com/document/d/1z0HqT7WR1A4u-RZRaFRINm9TWH5XWX8Lc_Vdj5q0aKM/edit).  
**Estado del catálogo:** corroborar siempre con `portable-site/src/biblioteca/catalog.js` y `portable-site/src/biblioteca/plannedWorks.js`.
**Puerta técnica entre chats:** [Mapa operativo del lector integrado](MAPA_OPERATIVO_LECTOR_INTEGRADO.md). Es una guía de ubicación del código vigente, subordinada a las Directrices 3.0, no un segundo reglamento.

## 0. Obra activa · Arata y Mariño (11/11/2026)

**Corrección del flujo público · 11/11/2026:** la captura compartida mostró que «ABRIR EL LECTOR» seguía abriendo solamente el diálogo de edición editorial. Corregido en [PR #116](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/116), fusionada a `main` con commit `40c1621b46a8338d96ee20d50eb465b9756e6778`, tras pruebas sintéticas de navegación del modal `IntegratedReader`. **Flujo público actual:** `CanonicalReadingEntry` → selección en el navegador de tres archivos personales del usuario (`edicion-academica.txt` extraído con `pdftotext -layout`, `subtitulos.srt`, `audio.mp3`) → `IntegratedReader` compartido, con seguimiento aproximado por párrafos y anotaciones. Los archivos se leen mediante File API y URL `blob:` del navegador; no se almacenan ni se publican en el repositorio, y no se envían a un servidor. El modo de desarrollo con archivos locales existentes permanece disponible. 

**Alcance de publicación y estado:** el lector funcional puede usarse desde la web con ejemplares aportados por quien estudia, pero **NO** hay distribución automática del libro, MP3 o SRT ni incorporación de los originales a `main`. Por la restricción editorial expresa registrada, no interpretar este cambio como permiso de redistribución. **EN DESARROLLO** hasta satisfacer las condiciones institucionales de la obra completa. Comprobación posterior requerida: flujo real en Chrome escritorio/móvil con archivos de origen, especialmente carga, reproducción, selección de apartado, resaltado de párrafos, notas, exportación y recuperación del progreso. No repetir cotejo binario o análisis acústico. Enlaces: [LECTOR_LOCAL.md](obras/arata-marino-auroras-tempestades/LECTOR_LOCAL.md) y [restricciones conocidas](OBSERVACIONES_DERECHOS_PENDIENTES.md).

**Actualización operativa · 11/11/2026 (adaptador local integrado):** la [PR #112](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/112) fue fusionada a `main` con commit `b73118988a7cf7c6b022047d8deb26bb235ede79`, tras CI satisfactoria [43101211431](https://github.com/manign1984/audiolibros-historia-educacion-fisica/actions/runs/43101211431). Su rama de origen fue `feature/arata-marino-lector-preparacion-local`. Incluye `buildArataMarinoReadingDocument.js`, `readerConfig.js`, `ArataMarinoReaderPreview.jsx`, activación exclusiva en desarrollo mediante `VITE_ARATA_MARINO_READER_PREVIEW=1`, prueba sintética `test:arata-marino` y exclusión Git de `assets/arata-marino-local/`. **No se incorporaron recursos protegidos, y el comportamiento público de la página permanece editorial, sin lector audiovisual habilitado.** Instrucciones en [LECTOR_LOCAL.md](obras/arata-marino-auroras-tempestades/LECTOR_LOCAL.md) ahora incorporadas a `main`.

**Prueba local con materiales de origen:** extracción `pdftotext -layout` del PDF de 20 páginas, 79 párrafos (entre ellos un cuadro estadístico), ocho apartados, 13 referencias bibliográficas y dos referencias a recursos multimedia; 78 párrafos encontraron anclaje textual aproximado en el SRT. El cuadro académico conserva sus datos y **no recibe tiempo de audio**. SRT de Drive vs GitHub: coincidencia binaria por SHA de objeto Git `7900c9b1583e26b9a87235f313350cdbaf0c2037`; 88.272 bytes, 796 intervalos ordenados, final en 01:00:16,800. Esto no es prueba acústica.

**Verificador disponible:** `portable-site/scripts/verify-arata-audio.mjs` coteja tamaños y SHA-256 de un MP3 original frente a partes locales; su prueba sintética está incluida en `npm run test:arata-marino`. La verificación efectiva de las 17 partes históricas se efectuó por coincidencia de los SHA-1 de objetos Git calculados sobre los fragmentos de origen (véase comprobación posterior).

**Comprobación del MP3 original · 11/11/2026:** se obtuvo desde [Drive el archivo fuente MP3](https://drive.google.com/file/d/1VDx21Jv3R32WhiafyPGEslLji5lRPjCD/view) (36.125.008 bytes; SHA-256 `164eaa55ca2fc06232aae4cf80f2d3f3ddf8f7e97d4e4b55e4a63e2ba3929980`). Se calcularon localmente los SHA-1 de objeto Git de sus 17 fragmentos consecutivos con cabecera `blob <tamaño>\0`, comparándolos contra los SHA publicados por GitHub para `audio-00.part` a `audio-16.part` en la rama histórica: **17/17 coincidencias exactas y 0 bytes sobrantes**. Esto comprueba identidad binaria de esos fragmentos con el MP3 fuente, sin descargarlos ni modificarlos. `ffprobe` identifica audio MP3 mono, 44.100 Hz, 80 kb/s, duración **3612,447347 s** (60:12,447). Decodificación completa por `ffmpeg` sin errores (código 0). El SRT finaliza a 3616,800 s (60:16,800); se conserva sin corregir ni reinterpretar esta diferencia de 4,353 s. Esta verificación es **técnica**, no una escucha perceptiva ni una autorización editorial.

**Próxima acción única:** prueba breve de interacción visual/funcional del lector canónico **en entorno local** con el MP3, texto académico y SRT de origen, conservados fuera de recursos públicos; comprobar apertura del modal, reproducción y pausa, seguimiento aproximado por párrafos, navegación, progreso, notas y exportación, sin auditoría acústica ni alterar SRT. Corregir únicamente fallos observables. La rama histórica `feature/arata-marino-lector-integrado` sigue exponiendo materiales en un repositorio **público**; no fusionarla no los hace privados. Mantener la publicación abierta de texto, PDF, audio y derivados bloqueada mientras conste la restricción editorial expresamente conocida. Estado de la obra: **EN DESARROLLO**.


**Relevo técnico adicional · 11/11/2026, recuperación del trabajo interrumpido:** la rama separada `feature/arata-marino-lector-integrado` está **dos commits por delante de `main`**: `1c89d7a43e57d06daefdaaf9618c8e884433ec37` (17 fragmentos del audio original) y `44f2e0d4d1b7885ef05bc9f124d48fa32b88a07c` (PDF académico y SRT). Los 17 archivos `audio-00.part` a `audio-16.part` suman **36.125.008 bytes** según tamaños informados por GitHub: 16 partes de 2.250.000 bytes y una de 125.008 bytes. **Esto acredita presencia y suma de tamaños, NO identidad binaria, reconstrucción/reproducción correcta ni calidad acústica.** El SRT aportado tiene 796 intervalos y llega a 01:00:16,800; el MP3 se había identificado aproximadamente en 60:12. No iniciar búsquedas de desfases ni alineaciones.

**Alcance vigente de esa rama:** solo se añadieron recursos; `ArataMarinoApp.jsx` todavía presenta el diálogo a la edición oficial y no se incorporaron modelo académico, lector integrado ni anotaciones. La publicación en `main` no fue alterada. **No fusionar ni desplegar los archivos protegidos de esa rama**: la restricción editorial expresa que ya consta en `OBSERVACIONES_DERECHOS_PENDIENTES.md` sigue vigente; la autorización del responsable del proyecto para trabajar técnicamente no es constancia de permiso de redistribución del editor. Conservar este trabajo como candidato técnico separado.

**Nota histórica de relevo:** la comparación MP3 y la preparación del adaptador, pendientes en este momento inicial, fueron superadas por los hitos anteriores. La próxima acción vigente es únicamente la prueba funcional local descrita arriba.


**Obra:** Nicolás Arata y Marcelo Mariño, *Auroras y tempestades: la educación entre golpes (1955–1976)*, lección 10 de *La educación en la Argentina. Una historia en 12 lecciones*.

**Estado interno:** EN DESARROLLO. **Etapa:** C de publicación editorial completada; lector integrado expresamente excluido del alcance. Se construyeron los cinco bloques públicos de presentación/contexto sin desarrollar ni activar el lector integrado, conforme al alcance solicitado. No declarar COMPLETA ni audio/texto incorporado.

**Rama:** `feature/arata-marino-auroras-tempestades`. **PR:** [#109](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/109). **Ficha:** [FICHA_ETAPA_A.md](obras/arata-marino-auroras-tempestades/FICHA_ETAPA_A.md).

**Código:** `portable-site/src/arata-marino/ArataMarinoApp.jsx`, CSS local, entrada `textos/arata-marino-auroras-tempestades/index.html`, ilustración editorial original; tarjeta del catálogo. Se reutilizan `JourneyHeader`, `AuthorBiography`, `CanonicalReadingEntry` y `JourneyCredits`. La entrada de Lectura abre un diálogo breve con enlaces a la edición digital oficial y a la ficha editorial; **NO** abre un lector +TEC ni tiene audio, subtítulos, anotaciones ni progreso de lectura. En catálogo, la entrada visible permite «Explorar recorrido» en vez de prometer un lector inexistente.

**Contexto:** dos unidades, (1) coordenadas 1955–1976 y (2) contraste de desarrollo, capital humano y planeamiento con experiencias de educación y liberación. No se copiaron obras originales ni el SRT a los assets públicos.

**Fuentes localizadas:** [PDF académico original](https://drive.google.com/file/d/1t1hPnCaYo3PEhfGM9Ej9FMokg6kwX4q7/view); [Doc de narración](https://docs.google.com/document/d/1VT5sB3JxpHtA0gd8ZKs2g7SaCyj2psUhWfvESy-BDUI/edit); [TXT](https://drive.google.com/file/d/1ycEDaCEwo0gXUo90gQBhSmM7rmqRGDVP/view); [SRT](https://drive.google.com/file/d/1qa4ypdD3Xu9hE8x3NaqvtvngQZyIagLW/view); [ElevenLabs](https://elevenlabs.io/app/audiobooks/uCBThksNlAPKZB3YCZnG?chapterId=rHaATz1nUvWo9YYR857c). En esta entrega estos materiales no se distribuyen públicamente.

**Nota editorial:** se conserva la observación de condición expresa de reproducción en [OBSERVACIONES_DERECHOS_PENDIENTES.md](OBSERVACIONES_DERECHOS_PENDIENTES.md). La página nueva solamente publica contenido original y enlace a edición oficial.

**Publicación verificada:** [PR #109 fusionada](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/109) en `main` con commit `251007d6f7e4f9d9a477069dcedf0e340d847651`. CI de PR [42973089797](https://github.com/manign1984/audiolibros-historia-educacion-fisica/actions/runs/42973089797) aprobada y GitHub Pages [42973261065](https://github.com/manign1984/audiolibros-historia-educacion-fisica/actions/runs/42973261065) con build y despliegue exitosos. URL técnica: https://manign1984.github.io/audiolibros-historia-educacion-fisica/textos/arata-marino-auroras-tempestades/ . El acceso HTTP independiente no pudo corroborarse desde el entorno del asistente; la ruta física y sus assets se validaron en CI.

**Nota histórica (PR #109):** esta era la siguiente acción al publicar la primera versión editorial. El estado operativo vigente está indicado al principio de este apartado; no se declara COMPLETA la obra.

La obra **Ignacio Melano** conserva su estado EN DESARROLLO y la comprobación perceptiva breve pendiente, tal como se documenta a continuación; el cambio de obra activa no declara su cierre.

---

## 1. Registro previo · Ignacio Melano

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

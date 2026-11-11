# BEYOND THE STARS · Producción activa y continuidad entre chats

**Fecha del primer registro:** 08/11/2026. **Rama de referencia:** `main`.  
**Propósito:** registrar el estado operativo de la biblioteca, no reconstruir la historia de los chats.  
**Norma superior:** [Directrices canónicas vigentes (v3.0)](https://docs.google.com/document/d/1z0HqT7WR1A4u-RZRaFRINm9TWH5XWX8Lc_Vdj5q0aKM/edit).  
**Estado del catálogo:** corroborar siempre con `portable-site/src/biblioteca/catalog.js` y `portable-site/src/biblioteca/plannedWorks.js`.

## 1. Qué se está haciendo

**Obra activa:** Ignacio Melano · *Militares al gobierno, juramentados al poder: la reapertura del INEF Gral. Belgrano en la década del 70* (capítulo 6, edición impresa 2025; archivo rotulado 2024).  
**Hito 10/11/2026:** Etapa A, depuración textual. PDF de 19 páginas impresas (131–149); se retiraron notas al pie 193–212, encabezados y folios y se integró el cuerpo en el [Google Docs de narración](https://docs.google.com/document/d/19xEmFfftckPYwctxTmZdGWFmLG6PIjxoF_evctmzQmA/edit). Conserva seis apartados, citas y contenido principal. [PDF original](https://drive.google.com/file/d/11kPIjFdMMIAwgfiukL0VenWDqloa10oB/view). Extensión aproximada inicial: 35.940 caracteres; luego se retiraron las citas parentéticas. En este hito aún no existían MP3/SRT/VTT ni página web construida; la página textual se implementó posteriormente en B.  
**Actualización 10/11/2026:** Versión para ElevenLabs depurada de 35 citas parentéticas, dos fragmentos de una referencia bibliográfica dividida y un año citado dentro de un paréntesis explicativo; se conservan fechas y aclaraciones históricas. Existe una [copia académica con citas](https://docs.google.com/document/d/19_QDXB4uo8kaAhUA8yDbWTokbdzSEPYAFwlrqroxWLk/edit) para el lector visual; la copia original PDF también se conserva. No usar el TXT de locución como sustituto del texto académico con referencias en el futuro lector.  
**Etapa B implementada en rama:** `feature/melano-militares-juramentados`, [PR #104](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/104). Página con `JourneyHeader`, `AuthorBiography` y retrato original, Contexto en dos pantallas, `CanonicalReadingEntry`/`TextOnlyReader`, `JourneyCredits`. Paleta enviada por usuario: #051e28, #3a8841, #40b5bc, #483df6, #86759f. El texto del sitio conserva las citas y notas 193–212; el texto de voz no incluye citas APA.  
**Ficha editorial actualizada:** [MELANO_FICHA_ETAPA_A.md](MELANO_FICHA_ETAPA_A.md). Documento operativo de esta obra; no modifica Directrices v3.0.  
**Estado interno:** EN DESARROLLO. **Etapa:** B construida como candidata textual, pendiente comprobación/depliegue y futura etapa audiovisual cuando el usuario aporte MP3/SRT-VTT.  
**Próxima acción única:** verificar CI y publicación real de la PR #104; luego, con los recursos provistos, integrar audio y subtítulos sin rehacer los bloques.  
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

## 3. Ficha de reanudación (una obra activa por vez)

| Campo | Valor vigente |
| --- | --- |
| Obra activa | Ignacio Melano · *Militares al gobierno, juramentados al poder* (capítulo 6, edición impresa 2025) |
| Etapa | B construida como página textual candidata en PR #104; pendiente CI/despliegue de C técnica. Integración audiovisual en siguiente etapa. |
| Estado interno | EN DESARROLLO: recorrido web textual implementado en rama; audio y subtítulos por entregar. |
| Rama / PR | `feature/melano-militares-juramentados` · PR #104 |
| Último commit de código reutilizable | `04cdf36054cc9f9796c360a92fdc3bc955d0c335` (Lionetti, antecedente; no es implementación de Melano). |
| Enlace al original | https://drive.google.com/file/d/11kPIjFdMMIAwgfiukL0VenWDqloa10oB/view |
| Texto para ElevenLabs (sin citas) | https://docs.google.com/document/d/19xEmFfftckPYwctxTmZdGWFmLG6PIjxoF_evctmzQmA/edit |
| Texto académico para lector (con citas) | https://docs.google.com/document/d/19_QDXB4uo8kaAhUA8yDbWTokbdzSEPYAFwlrqroxWLk/edit |
| Incidencia pendiente | Retrato auténtico incorporado y notas 193–212 en texto web; pendientes CI, URL efectiva y MP3/SRT. |
| **Próxima acción única** | Verificar y publicar PR #104; integrar MP3 y SRT/VTT cuando el usuario comparta archivos. |
| Ruta de publicación prevista | `https://manign1984.github.io/audiolibros-historia-educacion-fisica/textos/melano-militares-juramentados/` (confirmar después de Pages). |

Al iniciar una obra, completar únicamente estos campos y el estado interno EN DESARROLLO/COMPLETA. Al terminar una etapa A, B o C, **guardar un commit verificable y actualizar esta ficha antes de seguir**. No esperar al límite del chat. No crear un expediente nuevo para cada intercambio. Los materiales grandes permanecen en sus ubicaciones autorizadas; no poner texto académico, audio privado o credenciales en esta ficha.

## 4. Protocolo para iniciar o cambiar de chat

1. Leer este documento desde `main`, las Directrices vigentes enlazadas y **solo los archivos de la obra activa**.
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

# Protocolo operativo de autonomía · Biblioteca +TEC UNAHUR · v1.0

**Versión:** 1.0 / 06-11-2026. **Carácter:** protocolo de aplicación y aceptación, complementario y subordinado a las [Directrices canónicas 2.0](https://docs.google.com/document/d/1z0HqT7WR1A4u-RZRaFRINm9TWH5XWX8Lc_Vdj5q0aKM/edit), sin reformarlas.  
**Origen empírico:** [auditoría de causas raíz Marcaida–Scaltritti / Scharagrodsky](AUDITORIA_CAUSAS_RAIZ_2026-11-06.md).  
**Ámbito:** nueva incorporación o cambio sustantivo de fuente, lector, sincronización y/o disponibilidad. No automatiza permisos humanos ni modifica la interfaz pública.

## 0. Principio rector y reglas innegociables

**Prioridad de decisiones:** (1) SR-01 a SR-06; (2) componentes canónicos; (3) fidelidad, derechos y accesibilidad; (4) adaptación documentada; (5) excepciones expresas. El protocolo no crea un sexto bloque, no modifica la composición de Lectura/Créditos y no convierte la excepción por párrafos de Marcaida en regla general.

**Cuatro aprobaciones distintas:**
- **M — Materiales e identidad editorial:** sabemos qué edición, alcance, voz y binarios se eligieron.
- **T — Contratos técnicos:** archivos, rutas, datos, integridad, pruebas, compilación y regresión funcionan.
- **P — Correspondencia perceptiva/documental:** cotejo del contenido fuente y muestra real de voz/tiempos, indicando honestamente su cobertura.
- **U — Experiencia pública:** se comprobó en navegador la obra efectivamente desplegada, navegación, accesibilidad básica, catálogo y recursos.

Una «T = aprobado» **no implica** que M, P o U también lo estén. Ningún hash verifica por sí solo que una voz es la aprobada. Ningún ASR por sí solo constituye escucha humana.

## 1. Estados del expediente (distintos de estados del catálogo)

- **INVENTARIO**: búsqueda, identificación, revisión no invasiva; no edición pública nueva.
- **INCIDENCIA_DE_INSUMOS**: falta, ambigüedad o contradicción; se permite investigación y prototipos privados explícitamente identificados, pero se detiene la aprobación de la fuente dependiente.
- **INSUMOS_VERIFICADOS**: material académico y voz seleccionados y referenciados, con evidencia suficiente para comenzar el trabajo dependiente.
- **EN_IMPLEMENTACION**: diseño, código, alineación o pruebas sobre una fuente establecida.
- **CANDIDATO_DE_ACEPTACION**: pruebas automáticas realizadas y evidencias perceptivas/visuales revisadas.
- **PUBLICACION_PARCIAL_EXPRESA**: excepción SR-05 acordada, con prestaciones y límites públicos precisos. No equivale automáticamente al valor «review» del catálogo: requiere decisión editorial separada.
- **PUBLICADO_VERIFICADO**: integración, CI, despliegue, catálogo y verificación pública documentados; las limitaciones subsistentes se consignan.

El expediente no se «promueve» por completar un formulario: cada transición necesita pruebas y un responsable funcional. La automatización asiste; no inventa autorización editorial.

## 2. Puertas de control (G0–G8)

| Puerta y producto | Evidencia mínima y comprobación | Bloqueo / decisión |
| --- | --- | --- |
| **G0 · Congelación del alcance** | Obra, año/edición, capítulo/selección, uso pedagógico, número de pantallas Contexto previsto, responsables y materiales esperados. | Si el alcance es contradictorio, permanecer INVENTARIO. |
| **G1 · Identidad de insumos** | Lista de TODOS los PDF/TXT/MP3/VTT candidatos con Drive ID/ruta, tamaño, SHA-256, fecha, voz/versión conocida, duración real, comparación con el último VTT y elección explícita de fuente. Escucha del inicio, punto medio y cierre de la grabación elegida; transiciones si corresponde. | Dos voces sin arbitraje, VTT incompatible o permisos/procedencia indefinidos → INCIDENCIA_DE_INSUMOS. Investigar no equivale a habilitar sincronización. |
| **G2 · Fidelidad académica** | Edición base y diferencias respecto de copia de cátedra, transcripción y guion; cuerpo, secciones, notas, epígrafes, citas, bibliografía, referencias, pasajes omitidos y qué se narra/no narra. Fuentes biográficas, visuales y derechos conocidos. | Si el lector promete una edición íntegra pero faltan segmentos o las fuentes son inciertas, corregir o registrar publicación parcial expresa. Nunca inventar notas o permisos. |
| **G3 · Temporalidad y voz** | Duración del medio, primer/último punto y transiciones, VTT/SRT de origen, cobertura y huecos, intervalos por unidad, discrepancias léxicas, muestras de audio escuchadas y límites humanos. Separar marcas acústicas, VTT, interpolación e inferencias. | No activar etiqueta «verificado»/«ready» únicamente por tiempo o tokens coincidentes. Los segmentos no narrados no llevan tiempos ficticios. |
| **G4 · Plan pedagógico y visual** | Esquema 5 bloques; Inicio 1, Autor 1, Contexto 1–3 justificado, Lectura 1, Créditos 1; dossier de Contexto y fuentes; portada/retrato auténtico o alternativa identificada; excepción y paleta. | No iniciar diseño de páginas definitivas si la estructura contradice SR-01/02 o no se han resuelto decisiones esenciales. |
| **G5 · Desarrollo recuperable** | Rama de trabajo, commits por hitos, componentes compartidos usados, distinción código/archivos originales, estrategia binaria documentada y checkpoint con commit/pendientes. | No dejar como único soporte un entorno temporal o URL efímera; no sobrescribir originales. |
| **G6 · Pruebas de contratos y regresión** | Suite por obra, runtime de lector, test de catálogo, validación adversa, hashes, rutas, build limpio raíz/Pages, simulaciones de fallo y CI del commit. | Si falla cualquier prueba aplicable, bloquear integración. Avisos deben evaluarse; «0 errores» no certifica derechos/diseño/voz. |
| **G7 · Aceptación del recorrido real** | Navegador con fuentes cargadas: 1363×936, portátil de poca altura, 320/390/768, anclas, modal, foco/Escape, espacio, notas, exportación, guardado, audio, teclado, móvil y movimiento reducido según recursos disponibles. Cotejo perceptivo explícito. | Lo no probado se declara «pendiente»; no se presenta captura en iframe como prueba de dispositivo físico. |
| **G8 · Publicación y lectura de vuelta** | PR, diff revisado, CI y Pages del commit integrado, URL de obra y catálogo, HTTP de recursos, audio/rangos donde aplique, estado real, manifiesto y acta final; plan de reversión. | No anunciar «publicado y validado» sin confirmar Pages y ruta directa. La publicación parcial debe quedar identificada como tal. |

**Regla de parada fuerte:** una incidencia en G1–G3 bloquea declarar completo un trabajo dependiente; permite investigación, inventario y prototipo privado. Si se autoriza publicar parcialmente conforme a SR-05, dejar quién lo decidió, qué prestación se habilita, qué quedó desactivado y qué evidencia faltó.

## 3. Control especializado contra el fallo de Marcaida

**Al inicio y antes de publicar nuevamente:**
1. Enumerar todos los audios del título en las carpetas de origen y publicación, por **ID y no solo por nombre**.
2. Medir todos los candidatos. Anotar bytes y SHA-256. Comparar duración con último cue de cada VTT sin asumir que el desfase es silencio.
3. Registrar voz/versionado con una muestra audible identificada por un referente académico. Si hay variantes de narración o edición, elegir expresamente y dejar la alternativa como histórica.
4. Verificar inicio, punto medio, cambios de capítulo y final contra la edición. Documentar frases ausentes o diferentes.
5. Congelar el binario elegido y su vínculo con el recurso público. Cualquier sustitución exige **reiniciar G1 y G3**.
6. Al cambiar el MP3, revisar duración, enlaces, caché, capítulos, VTT, tiempos, progreso guardado y catálogo. Preservar notas personales si la identidad del texto lo permite; no reutilizar tiempos anteriores automáticamente.

**Prueba de aceptación adversa A1:** introducir en una copia de ensayo dos MP3 válidos con hashes correctos pero voces/duraciones distintas. Resultado esperado: G1 queda pendiente hasta aprobar el **archivo correcto**, aunque el validador estructural pase. No se declara que los tests actuales implementen esa verificación semántica.

## 4. Control especializado contra el fallo de continuidad de Scharagrodsky

Al finalizar **cada puerta G1, G2, G3, G5, G6 y G8**, guardar un checkpoint legible y persistente con: fecha, rama, SHA de commit o ubicación del expediente, recursos ya verificados, comando reproducible siguiente, riesgos, tareas cerradas, tareas pendientes y lo que **no** se debe repetir. Un checkpoint no es una promesa: debe existir fuera del entorno temporal.

**Procedimiento de reanudación:**
1. Leer el acta de la obra y el último checkpoint.
2. Identificar rama/HEAD y comprobar qué archivos están realmente versionados, no inferirlo de una conversación previa.
3. Confirmar si una PR ya fue integrada o está abierta. Comparar manifest, checksums y cambios.
4. No duplicar una transferencia si el binario existente y sus partes ya coinciden con el manifiesto.
5. Ejecutar comprobaciones desde el último hito persistente, documentar diferencias y continuar solo sobre lo que falta.

**Estrategia binaria previa:** decidir entre (a) fuente pública estable recuperada en build con hash estricto, o (b) partes de repositorio con manifiesto y reconstrucción idempotente. Considerar permisos, disponibilidad, tamaño, costo de mantenimiento y experiencia real de carga. No añadir particiones simplemente porque se utilizaron en Scharagrodsky; el navegador debe recibir el audio previsto y no dependen de URLs temporales.

**Prueba adversa A2:** suspender una simulación tras registrar mitad de las partes; iniciar entorno nuevo; comprobar cuáles están en rama, reconstruir solo faltantes, comparar hash del MP3 y reanudar sin reescribir fuentes válidas. Esta prueba requiere un entorno de ejecución real y no está aprobada por esta documentación.

## 5. Pruebas automatizadas existentes: ejecución verificable

Desde **portable-site/**, con Node compatible con package.json y dependencias instalables:

| Orden | Comando | Qué contrasta |
| --- | --- | --- |
| 1 | npm ci | Instalación reproducible del lockfile |
| 2 | npm run test:work-validation | Rechazos deliberados de corrupción/contratos |
| 3 | npm run test:library | Catálogo y estados conocidos |
| 4 | npm run test:two-works | Lector compartido y regresiones históricas |
| 5 | npm run test:reader-runtime | Interacciones React/jsdom y regresiones, **sin escucha ni render de píxeles** |
| 6 | npm run test:hobsbawm | Materiales y reglas de Hobsbawm |
| 7 | npm run test:aisenstein | Recursos y lectura de Aisenstein |
| 8 | npm run test:marcaida | Materiales y seguimiento de Marcaida |
| 9 | npm run test:scharagrodsky | Edición y límites acústicos de Scharagrodsky |
| 10 | npm run validate:works | Contratos de obras, hashes y referencias de origen |
| 11 | npm run build | Build limpio para raíz (preparadores incluidos) |
| 12 | npm run verify:build | Verificación de estructura construida |
| 13 | npm run validate:works -- --dist dist | Referencias y rutas de raíz |
| 14 | GITHUB_PAGES_BASE=/audiolibros-historia-educacion-fisica/ npm run build | Build en subruta de Pages |
| 15 | GITHUB_PAGES_BASE=/audiolibros-historia-educacion-fisica/ npm run verify:build | Validación de recursos en base Pages |
| 16 | GITHUB_PAGES_BASE=/audiolibros-historia-educacion-fisica/ npm run validate:works -- --dist dist | Rutas y referencias del artefacto Pages |

Anotar **commit**, hora y resultado. Los scripts específicos se agregan o actualizan al incorporar una obra: el validador transversal no los genera automáticamente. Las pruebas requieren acceso a los recursos reales y pueden fallar por disponibilidad externa; no sustituir silenciosamente archivos para lograr verde.

**Importante:** CI y Pages son workflows independientes. Una PR no queda aceptada por el éxito de Pages únicamente; no se debe presumir que una aprobación de revisión o un resultado técnico cubren el resto de las puertas.

## 6. Matriz de regresión de interfaz y accesibilidad

| Escenario | Qué observar | Evidencia |
| --- | --- | --- |
| Portada/primer/último pasaje | Opciones navegables; sin salto a unidad errónea | Interacción y captura/registro de estado |
| Audio pausado, reproduciendo y al reabrir | El progreso vuelve sin autoplay; sincronización orientativa o verificada según corresponda | Reapertura con marca de tiempo |
| Nota personal crear/editar/eliminar | Nota conserva texto, ID y obra; exportación TXT/JSON; no toca notas de otras obras | Prueba sintética, nunca notas reales estudiantiles |
| Referencia académica | Abrir/volver, restaurar foco, evitar pérdida del pasaje de referencia | Teclado y ratón |
| Escape, Tab, Espacio | Escape cierra la capa superior, Tab se contiene cuando corresponde, Espacio respeta el botón enfocado | Test de interacción y navegador |
| Lector modal | Sin desplazamiento del fondo; apertura/cierre restituye estado | 320, 390, 768 y escritorio |
| Párrafo muy largo y ventana baja | No se ocultan editor, botones ni cierre; crecimiento accesible sin recortar | 320×640 y 1280×480, si disponibles |
| Zoom y reduced motion | Sin contenido truncado ni animaciones forzadas | Inspección y límite registrado |
| Cambio de componente común | Se mantienen lectores previos, notas, claves, tiempos y catálogo | Regresión de todas las obras afectadas |
| Transición review/available/preparation | La ruta está en dist y abre directamente, no solo desde navegación cliente | Build raíz/Pages, enlace directo |

Las pruebas de DOM simulado y de viewport no sustituyen una prueba en dispositivos físicos, lector de pantalla o una inspección perceptiva. Registrar siempre **qué sí se hizo**, no «responsive comprobado» sin medidas.

## 7. Pruebas adversas que el expediente debe superar

| ID | Situación simulada | Resultado correcto |
| --- | --- | --- |
| A1 | Dos grabaciones íntegras con voces distintas | G1 bloqueado hasta selección editorial verificable |
| A2 | Sesión interrumpida durante la transferencia | Reanudación con checkpoint, sin duplicación, hash final igual |
| A3 | El VTT acaba antes/después del MP3 | Incidencia temporal; investigar cola, cambio de voz o distinta edición; no estirar tiempos |
| A4 | Cuerpo completo, notas académicas ausentes | Advertir y cotejar con edición; no declarar integridad académica total |
| A5 | ASR/VTT coincide en palabras pero no hay escucha | No afirmar correspondencia auditiva certificada |
| A6 | Cambiar solo catálogo de review a available | Comprobar entrada explícita y ruta emitida; bloquear si falta |
| A7 | Añadir modalidad por párrafos | Probar Portada, atajos, foco, notas y lectores previos |
| A8 | Compilar con dist de otra base | Build limpio y validador deben evitar o detectar residuos |
| A9 | Retrato auténtico sin permiso demostrable | No adjudicar licencia abierta; resolver tratamiento o alternativa |
| A10 | Pipeline pasa, recurso público falla | No cerrar G8; registrar HTTP, ruta, error y plan de corrección |

**Alcance actual:** estos diez escenarios son **casos de aceptación para ejecutar**, no un informe de que se hayan corrido en esta intervención. A6/A8 y parte de A7 tienen controles automatizados incorporados en PR 74–75; A1/A2/A5 requieren validación adicional y criterio editorial humano.

## 8. Hitos y control de cambios

- **H1 (insumos):** acta con versión elegida + anomalías + hashes y voz; si hay bloqueo, no se fuerza «aprobado».
- **H2 (diseño):** ficha de obra, cinco bloques, Contexto justificable y fuentes.
- **H3 (implementación):** rama y commits; copia web de recursos; aislamiento de claves, sin cambios globales innecesarios.
- **H4 (aceptación):** reportes de tests y navegador + muestras escuchadas + pendientes.
- **H5 (publicación):** PR integrada, CI y Pages, URL real, recurso y checklist de usuario.
- **H6 (transferencia de experiencia):** bitácora de incidentes, modificación de la guía de incorporación solo si el aprendizaje es generalizable.

Cambio de audio → repetir G1/G3/G6/G7/G8. Cambio de texto académico → G2/G3/G6/G7. Cambio del motor compartido → G5/G6/G7 en **todas** las obras afectadas. Cambio visual → G4/G7 y revisar la construcción. Cambio de estado/ruta → G6/G8, especialmente Vite.

## 9. Condiciones de cierre y responsabilidad

**Publicación normal:** M y T aprobadas; P documentada con alcance honesto y criterios adecuados a la función pública que se anuncia; U verificada. La vigencia de permisos y la autorización editorial no se deducen de las pruebas técnicas.

**Publicación parcial:** requiere decisión expresa conforme a SR-05, desactivación o comunicación de funciones no verificadas y registro público honesto; no convierte una incidencia en «aprobado».

**No publicar:** identidad de fuente contradictoria, obra incompleta presentada como íntegra, rutas o recursos fallidos, timestamps ficticios, riesgos de pérdida de notas o ausencia de aceptación fundamental no autorizada.

Las funciones —curaduría editorial, implementación técnica, revisión perceptiva, revisión visual/accesibilidad y autorización de publicación— pueden distribuirse entre distintas personas o equipos; el expediente registra quién ejerció cada función, sin inventar firmas ni permisos.

## 10. Uso de la plantilla y métricas de mejora

Para cada obra copiar [ACTA_OBRA_AUTONOMIA_V1.md](plantillas/ACTA_OBRA_AUTONOMIA_V1.md), completarla progresivamente y mantenerla en una ruta de documentación propia del recorrido. Nunca sustituirla por la memoria de una conversación.

En cada incorporación medir: 
- número de versiones candidatas y discrepancias detectadas en G1;
- cantidad de fallos descubiertos **antes** vs **después** de publicación;
- reversiones de audio/texto que obligan a rehacer alineación;
- checkpoints recuperables y retrabajo por interrupciones (si se registra tiempo real);
- incidencias de accesibilidad, integridad, rutas y pruebas humanas pendientes;
- proporción de obras con evidencia diferenciada M/T/P/U.

**Objetivo de la v1:** prevenir los fallos observados y poder demostrar que se siguió el procedimiento. La automatización adicional de estas puertas puede ser una fase posterior: no se declara desarrollada ni probada en esta PR documental.

## 11. Auditoría del propio protocolo

Al iniciar la próxima obra, ejecutar una revisión de mesa con A1, A3, A6 y A7, y al menos una simulación de reanudación A2 sobre datos de prueba; registrar resultados en el acta. Si alguna puerta resulta impracticable, documentar el obstáculo, ajustar el procedimiento con trazabilidad y, si fuera necesario modificar una regla canónica, tramitar esa decisión en el documento normativo y no aquí de manera silenciosa.

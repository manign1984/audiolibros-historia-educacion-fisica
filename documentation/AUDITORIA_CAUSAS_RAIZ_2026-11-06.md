# BEYOND THE STARS · Auditoría de causas raíz de dos incorporaciones

**Fecha:** 06/11/2026. **Alcance:** Marcaida–Scaltritti (PR 66–76) y Pablo Scharagrodsky (PR 77).  
**Base inspeccionada:** main, commit b27b814b6b0aff21c0cd1e320165f2ca63f10b8b.  
**Naturaleza:** diagnóstico retrospectivo y propuestas, **no modificación de las Directrices canónicas 2.0** ni certificación editorial/perceptiva.

## 1. Preguntas, método y límites de la evidencia

Preguntas: (a) ¿qué incidentes ocurrieron y qué efectos demostrables tuvieron? (b) ¿por qué no se detectaron o resolvieron antes? (c) ¿qué controles existentes sirvieron y cuáles no cubren el riesgo? (d) ¿cómo impedir recurrencia sin degradar la autonomía?

Se contrastaron las PR, sus cambios y descripciones, la auditoría inicial de Marcaida, su corrección de audio, la validación del lector por párrafos, la consolidación técnica del 05/11, la ficha de aceptación de Scharagrodsky, las configuraciones del lector, el registro transversal y los workflows de CI/Pages. La jerarquía normativa se tomó del documento [Directrices canónicas v2.0](https://docs.google.com/document/d/1z0HqT7WR1A4u-RZRaFRINm9TWH5XWX8Lc_Vdj5q0aKM/edit), especialmente SR-05, SR-06 y capítulo 6.

**Criterio epistemológico:**
- **H = hecho comprobado:** figura expresamente en archivos, códigos, historial o reportes contrastados.
- **C = causa sustentada:** inferencia causal con mecanismo identificado y evidencia directa; no implica conocimiento de decisiones internas no registradas.
- **P = hipótesis plausible:** requiere corroboración adicional antes de atribuir causa definitiva.
- **N = no demostrado:** no hay evidencia suficiente para afirmarlo.

No se ejecutó una nueva escucha humana exhaustiva, auditoría formal WCAG ni una nueva prueba instrumental de todos los dispositivos públicos. La ausencia de comentarios en una PR no prueba ausencia de revisión fuera de GitHub. La interrupción de conexión no demuestra por sí sola que GitHub, Pages o el código hayan fallado.

## 2. Línea de tiempo relevante

| Fecha (Argentina) | Registro | Significado |
| --- | --- | --- |
| 04/11 | Auditoría inicial Marcaida | **H:** MP3 2026,374625 s; VTT finaliza en 1878,531 s. Desfase 147,843625 s (2:27,844). Se clasifica INCIDENCIA DE INSUMOS. |
| 04/11 | [PR 66](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/66) | **H:** publicación parcial en estado de revisión, sin sincronización pública. El trabajo no se anunció como alineación auditivamente certificada. |
| 04/11 | [PR 67–69](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/67) | **H:** notas de la edición, CAN-01 (mostrar la obra, no el proceso), autorías, retratos y catálogo se revisaron después de la primera integración. |
| 04/11 | [PR 70–73](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/73) | **H:** se investigaron tiempos y se habilitó un seguimiento orientativo por 42 párrafos sobre la grabación inicial. |
| 05/11 | [PR 74](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/74) | **H:** corrección de navegación Portada, bloqueo del fondo, foco, teclado/Escape, párrafos extensos, notas y recuperación. |
| 05/11 | [PR 75](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/75) | **H:** validador transversal, pruebas adversas, registro de integridad, control de rutas/artefactos y limpieza de dist. |
| 05/11 | [PR 76](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/76) | **H:** corrección de versión vocal. Audio correcto: 1878,909388 s; diferencia respecto del VTT 0,378388 s. Reposición de 42 tiempos y nueva clave de progreso. |
| 06/11 | [PR 77](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/77) | **H:** Scharagrodsky publicado tras recuperación y transferencia; 106 partes verificadas del audio se reconstruyen como un MP3; CI/Pages y comprobación pública documentados. |

La grabación correcta de Marcaida fue incorporada a la carpeta AUDIOS el 04/11; **no está demostrada su disponibilidad a la hora exacta de la PR 66**. No corresponde afirmar que se la pudo haber elegido desde el comienzo. Sí es comprobable que el desfase detectado exigía investigar las versiones y revalidar la fuente antes de consolidar sincronización y publicación final.

## 3. Incidentes, cadena causal y medidas preventivas

### RCA-01 · Identidad de la grabación de Marcaida (CRÍTICO)

**H — Síntoma:** la persona responsable reconoció en la web una voz distinta de la correcta. En Drive coexistían MP3 de 33:46,375 (64.845.012 bytes) y de 31:18,909 (45.231.840 bytes); la segunda duración coincide con el VTT original dentro de 0,379 s. La [corrección documentada](MARCAIDA_SCALTRITTI_CORRECCION_AUDIO_2026-11-05.md) identifica la segunda como fuente editorial válida.

**C — Mecanismo:** los controles de integridad certificaron que el archivo seleccionado era reproducible e idéntico a la referencia elegida; **no certificaron que esa referencia fuera la versión aprobada**. La señal de incompatibilidad temporal ya estaba en la auditoría, pero no detuvo todo desarrollo dependiente de esa versión. Las pruebas de hashes no pueden descubrir esta clase de error semántico.

**P — Detalle por corroborar:** si el archivo correcto apareció antes, durante o después de la primera implementación, y quién lo seleccionó editorialmente antes de la observación pública. No se atribuyen personas ni acciones no registradas.

**Impacto observado:** sustitución de recurso, reconstrucción de 42 intervalos, ajuste de catálogo y duración, renovación de clave de progreso; se conservó la clave de notas. Retrabajo cierto, pero no se cuantifican horas sin registro.

**Control preventivo:** inventario de *todas* las versiones candidatas, decisión editorial de voz/edición/alcance documentada, comparación duración–VTT y comprobación perceptiva de inicio/medio/final; revalidar contra el recurso vigente inmediatamente antes de publicación. **Cortafuego:** si hay varias voces/versiones sin arbitraje, no habilitar seguimiento como comprobado ni pasar a disponible. Una vista parcial de investigación solo se admite con decisión expresa SR-05.

### RCA-02 · Reconstruir tiempos antes de resolver la incompatibilidad (ALTO)

**H:** PR 71–73 investigaron 123 oraciones y activaron 42 párrafos orientativos de la primera versión; PR 76 los sustituyó a partir de la grabación válida.

**C:** la cadena de dependencia audio → VTT → alineación → lector se ejecutó parcialmente sobre un candidato todavía disputado. El etiquetado «orientativo» fue correcto como advertencia, pero insuficiente para evitar el costo de la posterior sustitución.

**Control:** separar **estudio exploratorio** de **congelación de fuente**. Se pueden explorar VTT/ASR sin perder datos, pero sus resultados no se convierten en referencia de producción hasta la firma de G1 (identidad) y G3 (correspondencia temporal).

### RCA-03 · Integración escalonada del aparato académico (MEDIO)

**H:** la copia remaquetada de cátedra de Marcaida carecía de notas de la edición; PR 67 recuperó diez llamadas, distinguiendo síntesis editoriales y pasajes narrados. En Scharagrodsky el PDF fue fuente de los 85 párrafos, 29 notas y 86 referencias; el guion de voz era abreviado.

**C:** varias versiones del mismo texto cumplen funciones diferentes: PDF académico, copia de cátedra, TXT editable, guion de locución y subtítulos. Si no se fija la jerarquía de fuentes y el alcance editorial antes de programar, notas y bibliografía se incorporan tardíamente o quedan expuestas a omisiones.

**Matiz:** las notas de Marcaida estaban advertidas como ausentes desde la PR 66; no se documenta una falsificación o pérdida silenciosa. El resultado inicial estaba presentado «en revisión».

**Control:** inventario de edición, índice, cuerpo, notas, epígrafes, bibliografía y pasajes no narrados; colación por secciones; registro de cambios de transcripción y de lo que queda deliberadamente fuera del audio.

### RCA-04 · Contrato funcional incompleto para la excepción por párrafos (ALTO)

**H:** PR 74 resolvió selector de Portada, desplazamiento de la página tras el modal, atajos de teclado, foco y Escape, citas largas, referencias y restauración. Incorporó prueba de interacción React/jsdom y regresión de lectores por oración.

**C:** el motor compartido tenía supuestos asociados a la unidad «oración»; la modalidad «párrafo» introdujo estados y combinaciones nuevas que las pruebas existentes no cubrían. No es demostración de que toda la arquitectura compartida fuera defectuosa.

**Control:** antes de implementar otra modalidad, construir matriz de estados/transiciones y ensayar Portada, primer/último pasaje, pausado/reanudado, notas y foco, ventana baja, teclado, selección, exportación y recuperación. Ejecutar regresión de todas las obras tocadas.

### RCA-05 · Sesiones interrumpidas y transporte binario de Scharagrodsky (ALTO)

**H:** la ficha técnica relata reconstrucción después de interrupción; el transporte Git directo carecía de autenticación en ese entorno. Se cargaron **106 partes** de hasta 700.000 bytes y un preparador comprueba hash por parte y del MP3 total de 74.010.901 bytes. El reproductor sirve **un único MP3**, no 106 peticiones.

**C:** el trabajo en entorno temporal y el transporte grande dependían de mecanismos sin punto de recuperación robusto antes de cada salto de sesión. La solución fragmentada resolvió la limitación presente, al costo de mayor complejidad de mantenimiento.

**N:** no hay prueba suficiente para determinar una causa única de la interrupción («GitHub caído», pérdida de rama, error de Pages, etc.).

**Control:** puntos de control persistentes en rama/PR, evidencia de commit, archivos pequeños de estado y manifiestos, y procedimiento de reanudación idempotente. Evaluar estrategia de distribución binaria por obra **antes** de transferir: descarga pública validada vs partes versionadas; prohibido depender de URL temporal del navegador. No aplicar automáticamente la fragmentación de Scharagrodsky a otras obras.

### RCA-06 · Sobreinterpretación de pruebas automáticas (ALTO)

**H:** el validador transversal comunica explícitamente que no certifica voz, fidelidad editorial, diseño, derechos ni enlaces externos. Scharagrodsky tiene 252 intervalos acústicos y pruebas muestrales, pero su ficha declara que no hubo escucha humana exhaustiva. Marcaida mantiene estado técnico «paragraph-preview».

**C:** «pruebas verdes» puede interpretarse erróneamente como «obra plenamente validada», si los ámbitos técnico, editorial, perceptivo y de publicación no se separan.

**Control:** cuatro constancias independientes: (i) integridad y contratos, (ii) auditoría editorial, (iii) escucha/sincronización y (iv) experiencia publicada. El estado del catálogo es un dato de producto, **no reemplaza** esas constancias ni puede inferirse de un único test.

### RCA-07 · Riesgos heredados de catálogo, build y artefactos (MEDIO)

**H:** Vite enumera explícitamente entradas de obras «available» y deriva las demás del catálogo; cambiar solamente el estado puede dejar una ruta sin entrada explícita. PR 75 documentó esa dependencia y añadió control de rutas en dist; además corrigió restos de bundles antiguos con build que limpia su salida.

**Clasificación:** riesgo de regresión **comprobado en el código**, no falla pública nueva atribuida a Scharagrodsky. La cobertura agregada reduce el riesgo de publicar una ruta ausente, pero no reemplaza una prueba directa del enlace.

**Control:** tras toda transición de estado, comprobar entrada HTML, ruta de catálogo y carga de URL directa; build limpio en raíz y Pages; bloquear el despliegue ante ausencias.

### RCA-08 · Información interna expuesta al estudiante (MEDIO, corregido)

**H:** PR 68 retiró explicaciones de cotejo/producción de la interfaz de Marcaida conforme a CAN-01.

**C:** no había separación suficientemente estricta entre documentación de investigación y contenido editorial destinado a estudiantes.

**Control:** antes de publicar, revisar textos públicos con la regla «mostrar la obra, no el proceso»; conservar procedimientos y pruebas solo en documentación interna, sin omitir información realmente relevante sobre alcance, derechos o uso.

## 4. Distinción entre controles resueltos y límites aún abiertos

| Riesgo | Mitigación ya existente (verificada en código/historial) | Pendiente |
| --- | --- | --- |
| Corrupción o alteración de recursos | Bytes/SHA, manifest, preparadores, pruebas adversas | Aprobar la **versión editorial**; la integridad sola no basta |
| Texto/obra/IDs/estado | Validación de contratos y pruebas por obra | Colación editorial y cadena de autoridad de los insumos |
| Errores de modal y párrafo | PR 74 y prueba runtime con regresiones | Comprobación perceptiva y en dispositivos reales según disponibilidad |
| Despliegue incompleto | CI, Pages, validación previa a upload, rutas y referencias | Evidencia de aceptación visual/auditiva en la versión pública final |
| Sesión interrumpida | Ramas, PR y preparadores por obra | Acta de estado persistente y procedimiento formal de reanudación |
| Contaminación entre obras | Claves de guardado exclusivas y regresión | Prueba específica ante cada modalidad nueva o componente compartido |
| Uso de imágenes/audio | Créditos y advertencias | Verificar las autorizaciones y condiciones de reproducción caso por caso |

## 5. Las cinco preguntas de fondo

1. **¿Por qué se publicó la voz equivocada?** El sistema entregó correctamente el archivo que se había seleccionado, pero esa selección no estaba cerrada editorialmente. **Causa sustentada**.
2. **¿Por qué hubo retrabajo de sincronización?** Se avanzó en una dependencia que requería congelar primero la fuente sonora. **Causa sustentada**.
3. **¿Por qué emergieron fallos de interfaz en la PR 74?** El contrato de pruebas anterior no contemplaba todos los estados de la modalidad por párrafos. **Causa sustentada**.
4. **¿Por qué fue costosa la continuidad de Scharagrodsky?** El estado intermedio no quedó íntegramente disponible al comenzar la siguiente sesión y el binario era grande para el mecanismo de transferencia disponible. **Mecanismo sustentado; origen técnico exacto de la interrupción no demostrado**.
5. **¿Por qué los éxitos de CI no cerraron la auditoría?** Las pruebas validaban propiedades técnicas delimitadas, no identidad de voz, revisión editorial integral o escucha humana. **Limitación comprobada por diseño**.

## 6. Prioridades, responsables funcionales y señales de éxito

| Prioridad | Acción correctiva | Responsabilidad por función | Evidencia esperada |
| --- | --- | --- | --- |
| P0 | Acta de ingreso y selección de versión | Curaduría académica + asistencia técnica | Versión elegida, alternativas, duración, hash, voz y fecha; G1 aprobado o bloqueado |
| P0 | Separar aprobación técnica y perceptiva | Producción + revisión editorial | Registros de escucha con tiempo, texto y resultado; alcance de muestra explicitado |
| P0 | Punto de recuperación en cada hito | Responsable de implementación | Rama, commit SHA, archivos verificados, pendiente exacto y comando de reanudación |
| P1 | Matriz de interacción para nuevas modalidades | Desarrollo | Suite funcional + pruebas de teclado, foco, modal, notas y regresión |
| P1 | Doble control del artefacto publicado | Desarrollo + revisión visual | CI y Pages del commit, URL directa, catálogo, recurso, pantallas y límites |
| P1 | Inventario completo del aparato académico | Curaduría | Notas, bibliografía, epígrafes, omisiones y decisiones documentadas |
| P2 | Evaluación de estrategia binaria | Desarrollo | Costos, disponibilidad, reconstrucción idempotente, hashes y experiencia de carga |

## 7. No conclusiones

No concluimos que:
- las PR 66–77 fueran técnicamente inválidas por haber requerido correcciones;
- el audio correcto estuviera disponible desde el inicio de la PR 66;
- GitHub provocara la interrupción de Scharagrodsky;
- una revisión en DOM simulado equivalga a una prueba de lector de pantalla, dispositivo táctil real o escucha de voz;
- el estado técnico «ready» sea sinónimo de sincronización certificada por una persona;
- hayan existido pérdidas de anotaciones estudiantiles: las pruebas conocidas son sintéticas y los cambios conservaron claves cuando correspondía;
- la existencia de una obra en Drive equivalga a autorización de distribución.

## 8. Resultado y relación con los próximos documentos

**Hallazgo principal:** la puerta de entrada SR-05 ya existía conceptualmente; necesitamos volverla un **punto de decisión verificable**, con revalidación al publicar, sin convertirla en un permiso genérico para eliminar la investigación preliminar. La segunda mejora es que los avances sean recuperables por evidencia persistente; la tercera, separar claramente integridad, funcionamiento, fidelidad y experiencia real.

**Aplicación:** [Protocolo de autonomía v1](PROTOCOLO_AUTONOMIA_V1_2026-11-06.md) y [plantilla de acta de obra](plantillas/ACTA_OBRA_AUTONOMIA_V1.md). Son instrumentos auxiliares. No alteran las normas, las obras ni el catálogo.

**Fuentes principales:** [auditoría inicial](MARCAIDA_SCALTRITTI_AUDITORIA_PROPUESTA_2026-11-04.md), [validación del lector](MARCAIDA_SCALTRITTI_VALIDACION_LECTOR_2026-11-04.md), [corrección de voz](MARCAIDA_SCALTRITTI_CORRECCION_AUDIO_2026-11-05.md), [consolidación técnica](CONSOLIDACION_TECNICA_2026-11-05.md), [ficha de Scharagrodsky](SCHARAGRODSKY_2026.md), [registro de validación](../validation/README.md) y PR 66–77.

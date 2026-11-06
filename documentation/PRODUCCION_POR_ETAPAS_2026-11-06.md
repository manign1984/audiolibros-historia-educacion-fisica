# Producción por etapas y cortes planificados · Biblioteca +TEC UNAHUR

**Versión:** 1.0 · 06/11/2026. **Aplicación:** nuevas páginas de BEYOND THE STARS.  
**Norma superior:** [Directrices canónicas v2.0](https://docs.google.com/document/d/1z0HqT7WR1A4u-RZRaFRINm9TWH5XWX8Lc_Vdj5q0aKM/edit), especialmente SR-05/SR-06 y protocolo 6.  
**Marco operativo:** [Protocolo de autonomía v1](PROTOCOLO_AUTONOMIA_V1_2026-11-06.md), [guía de incorporación](GUIA_INCORPORACION_OBRAS.md) y [acta de obra](plantillas/ACTA_OBRA_AUTONOMIA_V1.md). Este documento **no reemplaza** esos textos ni habilita cambios en las obras existentes.

## 1. Decisión: trabajo segmentado, no una sola ejecución prolongada

Cada nueva obra se realizará habitualmente en **2 o 3 Work separados**, elegidos *antes* de comenzar según el volumen y los riesgos. «Work» significa aquí una sesión de trabajo acotada con un resultado persistente; un corte es deliberado y queda documentado. No significa que la sesión o la plataforma continúen ejecutando acciones mientras el usuario está ausente.

La separación reduce la superficie de pérdida ante «Conexión interrumpida», pero **no previene ni diagnostica por sí misma la causa** de ese mensaje. La verdadera unidad de recuperación es el commit verificable y el archivo de estado en GitHub; un resumen solo en el chat no basta.

**Selección de modalidad:**

| Modalidad | Elegir cuando | Etapas |
| --- | --- | --- |
| **2 Work** | Texto breve o mediano; MP3 y VTT definitivos confirmados por el responsable; edición académica clara; sincronización directa; sin rediseño importante ni necesidad de transporte excepcional | Work 1: preparación **y** desarrollo, con puerta de insumos dentro de la misma sesión. Work 2: auditoría integral, ajustes y publicación |
| **3 Work (recomendado para obras complejas)** | Texto largo, notas o bibliografía abundantes, discrepancias editoriales, VTT complejo, muchas unidades de sincronización, imágenes o Contexto singulares, archivo binario voluminoso, modalidad nueva o cambios compartidos | Work 1: auditoría de insumos y diseño. Work 2: implementación y pruebas locales. Work 3: validación integral, correcciones y publicación |
| **1 Work** | Solo correcciones acotadas de una página existente y con pruebas/alcance claramente limitados | Aplicar puertas afectadas, guardar cambios y verificar; **no** utilizar como modalidad ordinaria de página nueva |

La selección por complejidad no se decide solamente por la duración del audio; también importa el aparato crítico, el transporte de archivos, el lector y el diseño. Si surgen bloqueos o el Work crece más de lo previsto, se permite **un corte adicional justificado**, sin forzar una implementación incompleta. No subdividir por cada microtarea.

## 2. Responsabilidades sin duplicación

**Antes del Work 1, responsable del proyecto:** aporta el texto fuente y confirma cuál es el MP3 y cuál es el VTT/SRT **definitivos emitidos por él con ElevenLabs**. No necesita enviar la historia de versiones ni realizar una auditoría extra de voces. La confirmación puede estar en el mensaje de inicio junto a los enlaces.

**Durante todos los Work, IA:** verifica los archivos confirmados, colaciona textos, programa, ejecuta pruebas, conserva ramas, checkpoints y documentación, y comunica anomalías específicas. No elige unilateralmente una voz diferente. Reabre el control afectado si cambia la pareja definitiva.

**Criterios de autorización:** los cortes normales entre Work **no exigen al usuario aprobar cada operación**; el siguiente Work comienza verificando lo persistido. La aprobación de decisiones editoriales extraordinarias, permisos y publicación parcial se rige por las Directrices 2.0.

## 3. Flujo para tres Work

### Work 1 · Preparación académica, documental y didáctica

**Entrada:** título, alcance, PDF/texto fiel y pareja MP3/VTT confirmada por el responsable, o incidencia identificada.

**Acciones autónomas:** inspección de acceso e integridad; G0/G1/G2/G3 exploratorio; cotejo del aparato académico; identificación de segmentos narrados/no narrados; propuesta de Contexto (1–3 pantallas), paleta y plan canónico de cinco bloques; riesgos y estrategia de archivos binarios. No se presenta un VTT como sincronización humanamente certificada ni se inicia implementación definitiva si G1 sigue bloqueado.

**Salida persistida:** acta de obra; `documentation/obras/<slug>/ESTADO_DE_TRABAJO.md`; recursos verificados/contratos o enlaces estables y hashes; ficha pedagógica y plan visual; rama de obra y commit. La documentación puede elaborarse en rama sin tocar sitio público.

**Corte formal 1:** estado G0/G1/G2/G3/G4 con aprobaciones y pendientes; el estado indica **Work 2** como siguiente, con ruta y SHA. Si existe incidencia de insumos, el siguiente paso es resolverla, no simular un G1 aprobado.

### Work 2 · Implementación controlada y validación técnica

**Entrada:** recuperar y contrastar Work 1 en GitHub, no depender de la conversación anterior. Confirmar que la edición/MP3/VTT no cambiaron.

**Acciones autónomas:** crear/continuar código singular reutilizando componentes canónicos; preparar MP3 web según estrategia verificada (sin introducir fragmentación porque sí); texto y tiempo; catálogo/entrada Vite; pruebas específicas, contratos, runtime, build y regresiones. Hacer commits por hitos coherentes, **antes** de una transferencia pesada, compilación extensa o cambio importante del lector. Preferir PR de implementación en borrador mientras no exista autorización de publicación.

**Salida persistida:** página candidata en rama; pruebas automatizadas realizadas con commit/resultado; documentos e incidencias actualizados; estado de trabajo con resumen exacto de archivos, dependencias y lo que no debe repetirse.

**Corte formal 2:** G5/G6 documentados, G7/G8 pendientes. Si hay fallo, conservar último commit válido y un estado explícito; no afirmar que la página está lista solo porque la PR existe.

### Work 3 · Auditoría final, ajustes y publicación

**Entrada:** reabrir estado, PR, rama y commits del Work 2; comprobar que los cambios siguen en la rama y no se fusionaron ya.

**Acciones autónomas:** terminar G3 perceptivo en el alcance demostrable; revisar G7 en navegador, zoom, móvil, navegación, teclado y controles; corregir regresiones; comprobar G6 de nuevo tras cambios; revisar fuente pública/derechos/catálogo; publicar conforme a la autorización vigente; verificar CI/Pages y URL pública de la versión exacta.

**Salida persistida:** evidencia de pruebas, PR integrada o impedimento concreto, URL pública comprobada, estado G8, acta de cierre y pendientes explícitos para mantener.

**Corte final:** estado `PUBLICADO_VERIFICADO` solo si lo documentado permite afirmarlo; de lo contrario queda como candidato o publicación parcial expresa, sin inventar aceptación.

## 4. Flujo abreviado para dos Work

- **Work 1 = Work 1 + Work 2 del esquema completo.** G0–G4 deben aprobarse **antes de tocar la implementación definitiva**, aunque todo ocurra en una misma sesión. Termina en rama con página candidata, pruebas y estado persistente.
- **Work 2 = Work 3 completo.** Auditoría perceptiva/funcional, corrección, regresión y publicación verificada.

**Escalamiento:** si el Work 1 evidencia un lector nuevo, reconstrucción de audio, conflictos de edición o dependencia sensible, dividirlo en el corte de preparación y pasar a tres Work. El criterio es el riesgo, no terminar una cantidad arbitraria de acciones.

## 5. Checkpoints dentro de cada Work: la defensa ante interrupciones imprevistas

Mantener un único expediente activo por obra en `documentation/obras/<slug>/ESTADO_DE_TRABAJO.md`, basado en [la plantilla](plantillas/ESTADO_DE_TRABAJO.md). La **acta completa** conserva las pruebas detalladas; el **estado** es la puerta de entrada concisa de cualquier sesión.

**Crear o actualizar el archivo de estado:**
1. Al comienzo de Work 1, después de fijar obra y rama.
2. Tras cerrar G1/G2/G3/G4, y **antes** del corte Work 1→2.
3. Durante Work 2, tras cada cambio sustantivo ya guardado en commit; **antes** de transferencias grandes o refactorizaciones.
4. Antes del corte Work 2→3, consignando PR, HEAD, pruebas y riesgos.
5. Al publicar, consignando commit de main, evidencias CI/Pages y URL real.
6. Si aparece incidencia o cambia una fuente confirmada, inmediatamente que sea posible, antes de continuar con trabajo dependiente.

**Contenido mínimo verificable:** obra/slug, modalidad y etapa actual; rama y SHA exactos; PR y estado; últimas puertas G0–G8 realmente aprobadas; archivos fuente confirmados y sus enlaces/hashes; cambios guardados frente a trabajo no persistido; comandos de prueba ejecutados y pendientes; bloqueos; **siguiente acción ejecutable y explícita**; elementos que no deben reescribirse o repetir.

Guardar el estado **en el mismo branch de la obra**, versionado mediante commit. No registrar secretos ni notas reales estudiantiles. No copiar MP3 a documentación; referenciar el material exacto.

**Después de cada checkpoint** comprobar que GitHub devuelve el archivo actualizado desde la rama y que el SHA del commit existe. Si el guardado falla, el texto no constituye un checkpoint duradero: informar el límite.

## 6. Arranque obligatorio del Work siguiente, sin depender de la memoria del chat

1. Identificar obra y consultar `documentation/obras/<slug>/ESTADO_DE_TRABAJO.md` en la rama indicada. Si se desconoce la rama, localizar la PR abierta y el último checkpoint.
2. Comprobar que la rama, el commit y los cambios existen; verificar si la PR fue fusionada, cerrada o continúa abierta.
3. Leer el acta y únicamente los documentos de referencia que correspondan al próximo paso. **No repetir investigaciones ya cerradas** salvo contradicción, cambio de fuentes o evidencia de corrupción.
4. Si el estado difiere de GitHub, prevalece lo verificable en el repositorio; registrar discrepancia y reconstruir solamente lo faltante. Una conversación puede orientar, **no** sustituir evidencia.
5. Ejecutar los controles de entrada de la etapa y avanzar de forma autónoma. Al cerrar, actualizar el estado con el siguiente corte.

**Si aparece «Conexión interrumpida»:** recuperar desde el último commit; identificar qué quedó sin guardar; no asumir que una operación sin respuesta fue exitosa ni repetir una transferencia hasta inspeccionar su destino. Si no existe ningún commit nuevo, explicar qué trabajo se perdió y recomenzar solo desde el último punto persistido.

## 7. Reglas para cerrar un Work

Un corte planificado no debe convertirse en una publicación prematura. En el mensaje final de la etapa se informará de manera breve: **entregado**, **evidencia (rama/PR/commit/archivo)**, **pendiente real** y **primera acción del siguiente Work**. Escribir un texto corto de relevo que la persona pueda pegar en la siguiente sesión, pero **ese texto no reemplaza el checkpoint en GitHub**.

**Cierre fallido o incompleto:** si no se logró persistir la rama/estado, decirlo expresamente y no afirmar «listo para continuar sin pérdida». Si G1 sigue bloqueada, no autorizar por implicación G5. Si G6 o G7 están pendientes, no confundir PR de borrador con obra validada.

## 8. Pruebas de aceptación del método durante las primeras incorporaciones

La adopción será **piloto**, no se afirma que ya se haya observado su eficacia:
- **C1 · Recuperación:** abrir un Work nuevo sin releer el chat anterior; comprobar que puede recuperar rama, estado, pruebas y próxima acción exclusivamente desde GitHub.
- **C2 · Corte temprano:** ejecutar un corte al final de G4 y comprobar que el segundo Work puede implementar sin nueva auditoría completa.
- **C3 · Interrupción simulada:** detener una tarea en ejecución tras un commit y comprobar que no se rehace trabajo ya persistido.
- **C4 · Recursos grandes:** ante un MP3 voluminoso, comprobar manifiesto, hash y reanudación sin duplicar transporte.
- **C5 · Publicación separada:** Work 2 termina sin modificar `main` ni GitHub Pages y Work 3 valida lo que efectivamente se despliega.
- **C6 · Costo de coordinación:** comparar incidencias, repetición, cortes y trabajo reejecutado con obras anteriores sin atribuir duraciones no registradas.

**Éxito esperado:** una página futura podrá detenerse deliberadamente después de cada fase, iniciar la siguiente sesión desde el estado verificable y conservar la separación entre aprobación editorial (ElevenLabs), construcción y aceptación publicada.

## 9. Registro de revisión

Esta guía se incorpora como protocolo operativo auxiliar mediante la PR de auditoría; **no modifica Directrices canónicas 2.0**, no ejecuta ni programa una página nueva y **no introduce todavía automatizaciones del checkpoint en CI**. La escritura y verificación del estado constituyen parte del trabajo de la IA en cada nueva obra. Después de los primeros pilotos, registrar ajustes concretos de umbrales, evidencia y cantidad de cortes según resultados observados.

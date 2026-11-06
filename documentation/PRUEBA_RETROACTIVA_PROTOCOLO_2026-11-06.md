# Prueba retrospectiva de la v1 · Marcaida–Scaltritti y Scharagrodsky

**Fecha:** 06/11/2026. **Modalidad:** simulación documental (*desk test*) sobre PR 66–77 y documentación persistida, **sin reejecutar archivos multimedia, CI, navegador ni escucha humana en esta intervención**. La finalidad es comprobar si las puertas del [Protocolo v1](PROTOCOLO_AUTONOMIA_V1_2026-11-06.md) habrían señalado incidencias y qué evidencia falta.

**Códigos:** **D** = cumplimiento documentado; **P** = parcial, fue posterior o falta parte de la evidencia; **B** = bloqueo que la puerta habría indicado en ese momento; **ND** = no demostrable con lo examinado. Los códigos se refieren al período indicado, no a una declaración de falla actual del sitio.

## 1. Aplicación a Marcaida–Scaltritti

| Puerta | Al momento de PR 66 | Tras PR 76 | Fundamento y evidencia faltante |
| --- | --- | --- | --- |
| G0 · Alcance | D | D | Obra y siete pantallas previstas en auditoría inicial |
| G1 · Identidad de versión | **B** | P/D | Desfase MP3–VTT de 147,844 s identificado al inicio; versión corregida por indicación de voz y hash 05/11. Para D completo: registrar evidencia independiente y muestras perceptivas de selección final |
| G2 · Aparato académico | P | P/D | PR 66 sabía que la copia de cátedra no tenía notas; PR 67 las recuperó, diferenciando síntesis de transcripción. Mantener distinción editorial |
| G3 · Audio y tiempos | **B para sincronización verificada** | P | PR 73 activó modalidad orientativa; PR 76 realineó 42 párrafos con nuevo MP3/VTT. Escucha fina no certificada |
| G4 · Pantallas y diseño | D | D | Inicio 1, Autor 1, Contexto 3, Lectura 1, Créditos 1; constan verificaciones de viewport |
| G5 · Recuperabilidad | P | P | Primera implementación recuperada tras interrupción; existen ramas/PR pero no un checkpoint normalizado en todas las puertas |
| G6 · Contratos y regresión | P | D documental | PR 74 agregó runtime; PR 75 contrato transversal/validación adversa; PR 76 actualizó tests y hashes. No se reejecutaron aquí |
| G7 · Revisión de navegador/voz | P | P | Correcciones visuales/funcionales documentadas, incluyendo 320/390; contraste perceptivo completo de versión final pendiente |
| G8 · Publicación | P (revisión declarada) | D documental / U por reconfirmar | PR 66 publicó revisión; PR 76 integrada con corrección. Recomendable volver a comprobar versión de audio en sitio público y su voz |

**Resultado contrafáctico:** G1 habría mantenido bloqueada la promoción de esa grabación como fuente definitiva mientras persistiera el desfase. **No** habría impedido la investigación preliminar ni necesariamente la publicación *parcial expresamente autorizada* bajo SR-05. El mayor beneficio habría sido evitar consolidar 42 tiempos sobre una versión aún no arbitrada y demandar revalidación G1 al aparecer el audio del 04/11. No se puede afirmar que el MP3 correcto estaba disponible antes de PR 66.

## 2. Aplicación a Scharagrodsky

| Puerta | Resultado retrospectivo | Fundamento y evidencia faltante |
| --- | --- | --- |
| G0 · Alcance | D | Cinco bloques y seis pantallas registrados antes de implementar |
| G1 · Identidad de insumos | D documental / P perceptivo | PDF 18 páginas, MP3 74.010.901 bytes, VTT 693 cues, hashes, ubicación de origen. Sin evidencia aquí de escucha humana completa |
| G2 · Aparato académico | D técnico / P editorial humano | 85 párrafos, 29 notas, 86 referencias, PDF cotejado por caracteres; guion narrado se conserva separado |
| G3 · Alineación | P | 252 intervalos basados en evidencia acústica; revisión por ventanas y modelos, pero no escucha humana exhaustiva. La ficha reconoce ese límite |
| G4 · Pantallas y diseño | D | Composición local y viewport 1363×936, 1280×720, 320/390/768. Crecimiento 21 px en Lectura a ventana baja documentado |
| G5 · Recuperabilidad | **B/P durante interrupción**, D al cierre | Se reanudó tras pérdida de continuidad y se reconstruyó MP3 mediante 106 partes con manifiesto exacto. Falta ensayo genérico de reanudación por checkpoint |
| G6 · Contratos y regresión | D documental | PR 77 agrega prueba propia, runtime de seis obras, CI y build raíz/Pages; no se repitieron aquí |
| G7 · Navegador/voz | P | Navegación local, audio, notas y responsive; no hay escucha humana exhaustiva ni prueba efectiva en hardware táctil. Captura móvil pública final terminó en timeout |
| G8 · Publicación | D documental | PR 77 y commit integrados; CI/Pages y comprobación HTTP pública 200/206 registradas; no se repitió una inspección nueva aquí |

**Resultado contrafáctico:** el checkpoint obligatorio en G5 habría creado una forma más previsible de retomar el trabajo en la nueva sesión. La fase binaria debería elegir y fijar antes el procedimiento de transferencia. G3/G7 seguirían necesitando aceptar explícitamente los límites de las pruebas acústicas y perceptivas.

## 3. Comprobaciones de escritorio de los diez escenarios adversos

| Escenario | Ensayo documental realizado | Resultado |
| --- | --- | --- |
| A1 · MP3 distinto aunque íntegro | Comparar las dos versiones de Marcaida y sus hashes | **Detecta riesgo semántico**: los hashes individuales pasan, pero la decisión editorial sigue siendo indispensable |
| A2 · Interrupción a mitad de partes | Revisar registro de 106 partes y preparador de Scharagrodsky | **Parcial:** manifiesto y preparador permiten integridad; no se simularon dos sesiones aquí |
| A3 · VTT/MP3 discordantes | Recalcular diferencia a partir de duraciones registradas de Marcaida | **Detecta incidencia:** 147,843625 s antes; 0,378388 s después |
| A4 · Notas ausentes en copia | Comparar las PR 66/67 con auditoría de edición original | **Detecta deuda editorial** y evita atribuir síntesis como transcripción literal |
| A5 · Coincidencia automática sin escuchar | Leer documentación de PR 71/73/77 | **Detecta límite**: datos acústicos/cues no equivalen a escucha humana exhaustiva |
| A6 · Estado de catálogo cambiado | Inspección de vite.config.js y validador tras PR 75 | **Riesgo mitigado parcialmente:** hay control de ruta emitida; no se ejecutó transición sintética |
| A7 · Nuevo modo por párrafos | Inspección PR 74 y script test:reader-runtime | **Casos reales resueltos**: Portada, foco, Escape, notas, regresión |
| A8 · dist con bundles antiguos | Registro de consolidación técnica 05/11 | **Mitigado:** vite build --emptyOutDir y validador de referencias |
| A9 · Retrato/autoría inciertos | PR 69 y ficha Scharagrodsky | **Mitigación editorial documentada:** monogramas en Marcaida, retrato acreditado en Scharagrodsky; derechos requieren tratamiento caso a caso |
| A10 · CI verde pero sitio inaccesible | PR 77 registra HTTP de recursos y lector público | **Cubierto documentalmente** para Scharagrodsky, no se repitió prueba en la sesión actual |

**Veredicto del desk test:** la v1 discrimina los riesgos realmente observados sin obligar a alterar el diseño canónico ni los seis lectores. Para considerarla **técnicamente validada como sistema automático** faltan simulaciones instrumentales A1, A2, A3, A6 y A10 en un checkout ejecutable, y un caso real nuevo; por eso la versión es **operativa en forma documental, no una automatización integrada en CI**.

## 4. Piloto propuesto para la siguiente obra

Antes de agregar la próxima página, copiar la [plantilla](plantillas/ACTA_OBRA_AUTONOMIA_V1.md) y probar el procedimiento en la **fase de insumos solamente**, sin empezar a programar ni publicar. Objetivos de aceptación:

- G1 decide sin ambigüedad qué MP3 pertenece a qué edición y qué VTT corresponde, con evidencia y sin depender del nombre del archivo.
- G2 conserva todas las unidades académicas incluidas en el alcance, o registra su ausencia.
- G3 separa de forma visible marcas automáticas, interpolaciones y muestras escuchadas.
- G5 deja un checkpoint recuperable desde otra sesión, incluso antes de grandes transferencias.
- La decisión de pasar a implementación tiene dictamen trazable: aprobado, incidencia o publicación parcial expresamente autorizada.

La adaptación del protocolo se evaluará con ese piloto y con las métricas de incidentes/retrabajo; **no se propone cambiar las Directrices 2.0 sin una decisión específica del proyecto**.

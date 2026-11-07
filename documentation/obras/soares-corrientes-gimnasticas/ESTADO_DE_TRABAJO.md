# Estado de trabajo · Soares · Seguimiento aproximado por párrafos (decisión 07-11-2026)

**Estado actual — prevalece sobre los checkpoints históricos que siguen debajo.** El responsable del proyecto decidió **adoptar directamente el resaltado por párrafos a partir del VTT, sin una nueva ronda de pruebas acústicas ni escucha de muestras**. Esa decisión no convierte los intervalos en tiempos auditivamente validados. La prueba de 4 escuchas y la validación por oración dejan de ser requisitos del desarrollo elegido.

- **Modalidad del candidato:** `paragraph-preview` (nombre técnico existente en el lector común); 70 párrafos, inicio/fin derivado de VTT. La interfaz informa «seguimiento aproximado por párrafos».
- **Límite conocido:** transición entre `soa-introduccion-p6` y `p7` en **318,107 s**, estimación por punto medio del cue 63 compartido. No escucha humana.
- **App:** `SoaresApp.jsx` utiliza `soaresParagraphPreviewConfig` **sin bandera VITE** cuando está construida como candidato. La vía ordinaria de biblioteca sigue en `preparation`; los materiales privados no se publican.
- **Anotaciones:** claves exclusivas `soares-corrientes-gimnasticas-paragraph-notes-v1` y `-paragraph-state-v1` (sin migración silenciosa de notas de ensayo). Los títulos y encabezados conservan las referencias a notas académicas.
- **Fidelidad:** siete apartados, 70 párrafos, 185 oraciones, 29 notas y 47 referencias; texto académico y MP3 originales intactos; notas y bibliografía sin tiempos de audio.
- **Permisos/publicación:** I04 sigue sin documentación de condiciones de uso para capítulo/traducción, narración y retrato. **No fusionar PR #79 a main ni desplegar archivos privados todavía.** No afirmar que la falta de registro demuestra ausencia de permiso.
- **Pruebas:** no se ejecuta ni se exige nueva comprobación acústica; los controles automáticos de integridad de GitHub son salvaguardas técnicas, no pruebas perceptivas. G3 de sincronización **por oración** permanece sin aprobar y ha sido descartado como requisito para esta modalidad; G7 perceptual no se certifica.
- **Referencia de implementación:** [EXPERIMENTO_PARRAFOS_VTT.md](EXPERIMENTO_PARRAFOS_VTT.md) registra la procedencia, decisiones y código. PR experimental #80 se integra a la rama de PR #79 como adopción de esta alternativa.

**Próximo paso:** verificar que la rama de Soares incluye los cambios; resolver únicamente el circuito de incorporación/publicación y la información de condiciones de uso. No retomar la revisión de 72 unidades CTC ni las cuatro escuchas salvo nueva indicación.

---

## Historial anterior a la decisión de usar párrafos


Actualizado **06-11-2026, Argentina**. **Candidato local corregido y evaluado. Publicación bloqueada, sin merge.** El cierre de Work 3 sigue pendiente: alineación final, dos controles de navegador y condiciones de redistribución. Este estado prevalece sobre los relevos históricos de Work 1/2.

## Versión única y commits comprobados

- ID: `soares-corrientes-gimnasticas`. Carmen Lucia Soares, *Las corrientes gimnásticas europeas y su contenido: una historia de rupturas y permanencias*.
- [Rama](https://github.com/manign1984/audiolibros-historia-educacion-fisica/tree/feature/soares-corrientes-gimnasticas): `feature/soares-corrientes-gimnasticas`.
- [PR #79](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/79): abierta en borrador. No fusionar con puertas pendientes.
- Work 1: `715bc4cd7e5a52b87776b94366b68ff99e056a6e`. Cierre Work 2: `8575c5301112939dce2a4a9d2b80a7aa88aba389`.
- Correcciones visuales guardadas: `b9945436159ea61e88daeaa146e950a8d17bfda0`.
- **Checkpoint técnico probado:** [`0f49702dc9fcaac2c13ffe6eea709f3a92e4a820`](https://github.com/manign1984/audiolibros-historia-educacion-fisica/commit/0f49702dc9fcaac2c13ffe6eea709f3a92e4a820). Evidencia acústica leída de vuelta y Git local/remoto coincidentes. CI remota completed/success, ejecución **42281356936**. Pruebas detalladas en [pruebas-work3.json](evidencia/pruebas-work3.json).
- El commit posterior de cierre guarda este estado, informes y una opción de revisión fija de modelos en el procedimiento ASR. No cambia la página ni el lector evaluados; consultar HEAD/historial para su SHA.
- Main continúa en `8c2bbe4fe3f95da0d79aa835738841fc8ef5fb53`; no se ejecutó despliegue de Soares.

## Estado real de las puertas

| Puerta | Resultado |
| --- | --- |
| G0/G1/G4 | Dossier y materiales preservados; hashes idénticos; cinco bloques, siete pantallas 1/1/3/1/1 |
| G2 | Reconstrucción y colación automática final aprobadas: 7 apartados, 70 párrafos, 185 oraciones del cuerpo, 29 llamadas/notas y 47 referencias. Censo PDF sin pérdida/duplicado; cuerpo/notas/bibliografía en el mismo orden léxico que TXT íntegro. No es declaración de escucha |
| G3 | **PENDIENTE.** CTC completo: 111 ventanas/6390 palabras, 194 intervalos candidatos. 122 unidades satisfacen la regla de corroboración con Whisper, 72 requieren revisión. Aparato sin tiempos; `sync.status=pending`, cero tiempos activos |
| G5 | Candidato local funcional, componentes comunes, ruta única, claves exclusivas. I04 impide incorporar públicamente materiales restringidos |
| G6 | Suites específicas y regresiones aprobadas, builds ordinarios/candidatos raíz y Pages, aislamiento de materiales privados, CI aprobada. 0 errores y 6 avisos preexistentes en registro activo de seis obras |
| G7 | Siete pantallas y lector inspeccionados; móvil 320/390, tablet 768, portátil bajo, teclado/foco, notas, exportación, guardado y audio. **Parcial:** falta zoom real y preferencia de movimiento reducido emulada; escucha final del paquete acústico pendiente |
| G8 | **NO EJECUTADA.** Catálogo y ruta ordinaria siguen en preparación. Sin merge ni publicación |

Detalles y límites en [WORK_3_VALIDACION.md](WORK_3_VALIDACION.md). Historial técnico de Work 2 en [WORK_2_TECNICO.md](WORK_2_TECNICO.md). Decisiones previas e incidencias en [ACTA_OBRA.md](ACTA_OBRA.md).

## Implementación conservada y correcciones de Work 3

Arquitectura: `portable-site/src/soares/{SoaresApp.jsx,soares.css,main.jsx,readerConfig.js,buildReadingDocument.js}`. Encabezado, biografía, `CanonicalReadingEntry`, `IntegratedReader` y créditos comunes. Contexto: «El gesto se vuelve calculable», «Corrientes distintas, tensiones compartidas», «Otras formas de educar el cuerpo». Identidad «El gesto entre la norma y la expresión».

Work 3 corrigió contraste de cursivas en Créditos, alineación de filas de la matriz de corrientes, fuente/desbordamiento del título del lector y paleta vino/cobre del botón canónico, conservando su geometría. Sin cambios nuevos al motor común, documentos, tiempos o claves de otras obras. Las expectativas de pruebas anteriores no fueron alteradas.

Guardado exclusivo: `soares-corrientes-gimnasticas-reader-notes-v1` y `soares-corrientes-gimnasticas-reader-state-v1`. Exportaciones: `notas-soares-corrientes-gimnasticas.json` / `cuaderno-soares-corrientes-gimnasticas.txt`. Notas académicas y anotaciones personales permanecen diferenciadas; notas y bibliografía no reciben tiempos ficticios. Jahn 1778–1825 se conserva; aclaración BnF 1778–1852 separada.

## Recuperación de materiales

| Insumo | Fuente estable | SHA-256 |
| --- | --- | --- |
| PDF, 247142 bytes | Drive `1xOnn6jLmUI5wj72noq18J53oh5-nkyOT` | `c81a7c039eb231ef183697761ea6e01fd7e0d4715309aff65ed769b5c8d10b45` |
| MP3, 74721926 bytes | Drive `1KAthUKiHsNqHg8sYIwPqzvJNgbGGbkt-` | `f9c4226ec5794a959d77d6f97b523eabadb0dcdc272bbec9c9e1b04d9a019b37` |
| VTT, 85242 bytes | Drive `1r8olHRVt-zWY_HjLlz2KYcnOxnPXCZKK` | `ec0beaea889464cd05328c6e73fb80f36f3f8899ae99cc463fcefb82bc1e294f` |
| TXT, 54958 bytes | Drive `1ubCfCwnzbGZMSbMDxHUQhfJfcmLOHlFv` | `52f8ef8fe5b41624dc8f51f844d247f0c9f962e47f78ca19e8967b792d4d5dae` |

Enlaces completos y retrato en [AUDITORIA_DOCUMENTAL.md](AUDITORIA_DOCUMENTAL.md) y [RECURSOS_Y_FUENTES.md](RECURSOS_Y_FUENTES.md). MP3 contenedor 3113,377959 s; decodificación/navegador 3113,331293 s; VTT final 3113,305 s. Originales sin modificar.

**Documento académico fijado:** [Soares_Work2_documento_academico.zip](https://chatgpt.com/library?file_id=libfile_31d84354c2b08191bec4d2f86fb3c122&account_id=personal), **versión 1**, ZIP SHA `f8412679982ac1ea15d20e19909242bfffc378087a3d661c6e692a983041de0b`. Contiene academic.json y document.json. Hash académico `291e552ae0348c77e1f15d60e8df046c7fe633a8942bdc75aa9f5a11f016adc1`; lector sin tiempos `7ae2eb3dc0384547ef1d03f4d441e8d1093587e07ed97d6c7929f359db5aa40b`. No reconstruir de nuevo si se recupera este ZIP.

**Evidencia acústica actual preservada:** [Soares_Work3_revision_acustica.zip](https://chatgpt.com/library?file_id=libfile_ba319db31dfc8191909a4b413edbfbc4&account_id=personal), **versión 4**, 26505697 bytes, SHA `d949093ed44df7fba86b353986cdfb1353b7ebf03174a337a635f3654161fd4c`. Incluye Whisper tiny/base anteriores y **CTC completo**, 194 candidatos, diferencias literales por unidad y **80 extractos nuevos** en `revision-ctc/` (abrir `revision-ctc/ABRIR_REVISION.html`). Conserva los 40 extractos históricos de v1 en `revision/`. No repetir reconstrucción, Whisper ni CTC completos. Registrar decisiones en copia de `revision-ctc/revision.json` o informe; los casilleros HTML no guardan solos. Ningún registro está aceptado por escucha humana. Los checkpoints parciales v2/v3 quedan superados por v4.

El entorno temporal se reinició durante Work 3; se recuperó el documento fijado y se regeneró la evidencia acústica completa con copia privada. Los materiales actuales y procedimientos ya son recuperables. Las observaciones previas realmente realizadas y sus límites se documentan sin afirmar que sus capturas temporales sigan disponibles.

## Pruebas y compilación local

[pruebas-work3.json](evidencia/pruebas-work3.json) registra 27 comprobaciones, con cero fallos: diez invocaciones de suites/validación, doce comandos de build/verificación/referencias, cuatro controles de aislamiento y `git diff --check`. Adicionalmente: sintaxis Python y censo del PDF reejecutados. CI remota para `0f49702…` aprobada. No se modifican expectativas de obras previas. Las observaciones de navegador y los límites perceptivos están separados de las pruebas automáticas.

La entrada ordinaria `portable-site/textos/soares-corrientes-gimnasticas/index.html` conserva la biblioteca. `SOARES_LOCAL_CANDIDATE=1 npm run build` materializa el candidato en la MISMA ruta; exige entradas con hashes correctos en `.local/soares/`, ignorada por Git. **No publicar ese dist mientras I04 siga abierta.** Builds ordinarios no copian esos materiales. `validation/soares-candidate.json` es independiente; `validation/works.json` mantiene seis obras activas. Restauración y comandos en WORK_2_TECNICO/WORK_3_VALIDACION.

## Próximo paso exacto y bloqueos

1. Comprobar HEAD y PR antes de editar; recuperar los dos ZIP por versión/hash y los originales cuando hagan falta. No repetir investigación, diseño, reconstrucción o ASR ya conservados.
2. **I04:** precisar si ya existe una condición de uso o autorización para publicar capítulo/traducción, narración y retrato en la web abierta. No se exige contrato de formato específico ni nueva aprobación de tareas. La información no figura en el expediente; eso no demuestra ausencia de permiso. Aclaración en RECURSOS_Y_FUENTES.md. No se contactó a terceros.
3. **I02/G3:** revisar el paquete CTC actual de 80 extractos, centrado en las 72 unidades sin corroboración suficiente según la regla; registrar límites observados, diferencias léxicas y decisiones. Las cifras anteriores de 35 alertas/40 extractos corresponden al control histórico y no se sustituyen por supuesta equivalencia. Mantener cero tiempos activos hasta que la evidencia permita aprobar la sincronización por oración. No usar la excepción por párrafos.
4. **G7:** comprobar zoom real del navegador y preferencia de movimiento reducido emulada. El intento de atajos no cambió dimensiones; solo hay inspección estática de movimiento reducido. No declarar esas pruebas aprobadas.
5. Solo al cerrar permisos, G3 y G7: incorporar materiales autorizados con hashes, actualizar entrada/Vite/catalogo/registro activo, repetir pruebas afectadas, integrar y verificar CI/Pages/ruta publicada. **No basta cambiar availability ni mergear este candidato.** I06 transporte público permanece sin ejecutar.

## Texto breve de reanudación

> Continuemos el cierre del Work 3 de Soares en la rama existente y PR #79. Verificá HEAD y ESTADO_DE_TRABAJO.md. Recuperá el documento académico privado v1 y el paquete acústico privado v4: están fijados y completos, no repetir reconstrucción, Whisper o CTC. El candidato visual y las regresiones están evaluados. Faltan revisar/registrar límites del paquete actual de 80 extractos y los 72 casos sin corroboración suficiente, completar zoom/movimiento reducido y precisar las condiciones de publicación de texto/traducción, narración y retrato. No activar sincronización ni publicar hasta cerrar esas puertas.


## Resultado de la reanudación · CTC completo

Ingreso `3052aec…`; checkpoints de procedimientos/recuperación `79feef5036f429007608a1a32def71734f60eb93` y `5e9c7fa2c36a6cf1d160ecfe332efc4961fc88d8`. La aplicación no cambió. Fuentes y ambos ZIP recuperados por hash; candidato recompilado. Se completó CTC y se guardó v4 antes de este cierre documental.

[ctc-work3.json](evidencia/ctc-work3.json): 360 extremos comparados por token idéntico con Whisper; 314 a <=300 ms, mediana absoluta 0,1048035 s. 122 unidades cumplen corroboración y ausencia de alertas; 72 requieren revisión (no son 72 errores acreditados). 10 unidades con puntuación de borde CTC baja; 2 con correspondencia léxica baja. Puntuaciones/umbrales de selección, sin aceptación humana. Cero intervalos activos.

[Controles](evidencia/controles-ctc-work3.json): salida parcial rechazada, escritor concurrente rechazado, informe reproducido byte a byte, sintaxis y prueba Soares con fuente real aprobadas, 80 clips nuevos decodificados; validación de seis obras sin errores y con seis avisos previos. El piloto de contexto 0,8 s fue descartado; análisis final usa 4 s. No hay tiempos de ese piloto incorporados como evidencia aceptada.

El entorno de navegador recuperó la página (1348/1348). La entrada nativa falló por AT-SPI y el acceso a configuración interna fue rechazado por política de URL; no se eludió. Zoom/movimiento reducido siguen sin aprobar. I04 sigue pendiente de información, no de una nueva autorización general de trabajo. PR abierta/draft, main sin cambios de Soares; sin merge ni despliegue. Próximo paso: usar exclusivamente el paquete v4 para resolver los 72 casos y registrar decisiones, completar G7 y las condiciones de publicación.

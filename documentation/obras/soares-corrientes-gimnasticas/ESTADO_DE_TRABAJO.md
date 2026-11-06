# Estado de trabajo · Soares · Checkpoint de Work 3

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
| G3 | **PENDIENTE.** 194 candidatos medidos por ASR; 135 fronteras comparadas entre dos tamaños de Whisper; 17 discrepancias >0,45 s y 35 unidades señaladas. Cero tiempos activos, `sync.status=pending` |
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

**ASR y revisión pendientes preservados:** [Soares_Work3_revision_acustica.zip](https://chatgpt.com/library?file_id=libfile_ba319db31dfc8191909a4b413edbfbc4&account_id=personal), **versión 1**, 8024291 bytes, SHA `f4b038751fe3ab6eb1eef941e4b5b5d81a60b0c6e4293bdc9b7fc7d13e804d06`. Tiny completo + base en 38 ventanas/806,471 s; transcripciones, candidatos, informes y **40 extractos**. Abrir `revision/ABRIR_REVISION.html`, registrar decisiones en una copia de `revision/revision.json` o informe. Los casilleros HTML no se guardan solos. No repetir ASR ni fabricar tiempos: todo permanece candidato. Las 159 unidades no señaladas tampoco tienen aceptación plena por descarte.

El entorno temporal se reinició durante Work 3; se recuperó el documento fijado y se regeneró la evidencia acústica completa con copia privada. Los materiales actuales y procedimientos ya son recuperables. Las observaciones previas realmente realizadas y sus límites se documentan sin afirmar que sus capturas temporales sigan disponibles.

## Pruebas y compilación local

[pruebas-work3.json](evidencia/pruebas-work3.json) registra 27 comprobaciones, con cero fallos: diez invocaciones de suites/validación, doce comandos de build/verificación/referencias, cuatro controles de aislamiento y `git diff --check`. Adicionalmente: sintaxis Python y censo del PDF reejecutados. CI remota para `0f49702…` aprobada. No se modifican expectativas de obras previas. Las observaciones de navegador y los límites perceptivos están separados de las pruebas automáticas.

La entrada ordinaria `portable-site/textos/soares-corrientes-gimnasticas/index.html` conserva la biblioteca. `SOARES_LOCAL_CANDIDATE=1 npm run build` materializa el candidato en la MISMA ruta; exige entradas con hashes correctos en `.local/soares/`, ignorada por Git. **No publicar ese dist mientras I04 siga abierta.** Builds ordinarios no copian esos materiales. `validation/soares-candidate.json` es independiente; `validation/works.json` mantiene seis obras activas. Restauración y comandos en WORK_2_TECNICO/WORK_3_VALIDACION.

## Próximo paso exacto y bloqueos

1. Comprobar HEAD y PR antes de editar; recuperar los dos ZIP por versión/hash y los originales cuando hagan falta. No repetir investigación, diseño, reconstrucción o ASR ya conservados.
2. **I04:** el responsable debe aportar constancia o referencia que acredite alcance/condiciones para redistribuir texto y traducción, narración y retrato. La selección de la voz o el enlace de Drive no resuelven esa condición. La ficha editorial consultada no añadió licencia abierta. No se contactó a terceros.
3. **I02/G3:** revisar los 40 extractos, comenzando por las 35 unidades señaladas; registrar límites observados, discrepancias léxicas y decisiones. Completar cobertura de las fronteras no corroboradas. Mantener cero tiempos activos hasta que la evidencia permita aprobar la sincronización por oración. No usar la excepción por párrafos.
4. **G7:** comprobar zoom real del navegador y preferencia de movimiento reducido emulada. El intento de atajos no cambió dimensiones; solo hay inspección estática de movimiento reducido. No declarar esas pruebas aprobadas.
5. Solo al cerrar permisos, G3 y G7: incorporar materiales autorizados con hashes, actualizar entrada/Vite/catalogo/registro activo, repetir pruebas afectadas, integrar y verificar CI/Pages/ruta publicada. **No basta cambiar availability ni mergear este candidato.** I06 transporte público permanece sin ejecutar.

## Texto breve de reanudación

> Continuemos el cierre del Work 3 de Soares en la rama existente y PR #79. Verificá HEAD y ESTADO_DE_TRABAJO.md. Recuperá el documento académico y el paquete acústico privados, ambos versión 1: ya están reconstruidos y guardados, no repetir ASR. El candidato visual y las regresiones están evaluados. Faltan revisar/registrar límites de los 40 extractos y la cobertura temporal restante, comprobar zoom/movimiento reducido y acreditar redistribución de texto/traducción, narración y retrato. No activar sincronización ni publicar hasta cerrar esas puertas.


## Reanudación actual en curso

Ingreso `3052aec…`, PR abierta/draft, fuentes y paquetes privados versión 1 recuperados por hash, candidato recompilado sin modificar aplicación. I04 se explica como consulta por condiciones de publicación ya existentes, no como exigencia de una nueva autorización de tareas ni de un contrato de formato específico. No se presume ausencia de permiso por ausencia de documentación.

Siguiente operación: completar y guardar privadamente alineación CTC adicional contra el VTT narrado (`force_align_audio.py`), comparar los límites con la evidencia Whisper preservada y evaluar las alertas. No repetir reconstrucción ni Whisper. Todavía `pending`; no activar ni publicar. El acceso a configuración interna del navegador fue rechazado por política de URL; no se elude. Zoom/movimiento reducido siguen pendientes. Ver detalles de esta reanudación en WORK_3_VALIDACION.md.


**Checkpoint privado actual de reanudación:** paquete acústico **versión 2**, 8076948 bytes, SHA `ed0c85bafdb9001bee9d9649b8301ce1921a7d126e744eb08b0799fc8cc01b8a`. Conserva todo lo de versión 1 y agrega CTC parcial (4/111 ventanas, padding 4 s). Las referencias de arriba a v1 describen la etapa anterior: para reanudar ahora usar v2. Recuperar `ctc.json` y ejecutar `force_align_audio.py` con los mismos argumentos para continuar; no empezar otra salida ni repetir Whisper. El checkpoint por ventana es atómico y hay bloqueo contra ejecuciones concurrentes.


**Checkpoint privado más reciente:** versión **3**, CTC parcial 53/111 ventanas; SHA `f1a00380cfbebcba5639203c411ade6c52aa7a167497103881a0e966b81c8569`, 8140435 bytes. Sustituye a v2 como punto actual de recuperación; conserva las transcripciones y 40 extractos de v1. La ejecución completa continúa localmente y aún no hay informe final CTC ni tiempos activos. `evaluate_ctc.py` rechazará este resultado hasta que `complete` sea verdadero.

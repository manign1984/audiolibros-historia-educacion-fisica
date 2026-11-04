# Marcaida y Scaltritti · Sincronización texto-audio

**Fecha:** 4 de noviembre de 2026. **Estado:** propuesta automática de sincronización, todavía NO aprobada para el lector público.

## Fuentes e integridad

- MP3 original, duración 33:46,375 y SHA-256 cc324ffa8999233c94a76521b097eb6c7e81d43182d9df5ef49a46413b76b5ba, confirmados con el archivo de Google Drive.
- VTT original: 361 fragmentos, termina a los 31:18,531. Contiene el texto del capítulo hasta su última oración; sus tiempos NO corresponden directamente al MP3 final.
- Reconocimiento de voz sobre el MP3, conservado en data/marcaida-scaltritti-alineacion-revision.json: 288 segmentos, coincidencia textual del 96,7348 %; último cierre de voz a los 33:40,140.
- Texto público: 123 oraciones, con sus identificadores estables, en portable-site/src/marcaida/reading-document.json.
- Datos de propuesta: data/marcaida-scaltritti-alineacion-propuesta-v2.json. No se importan al lector.

## Qué se consiguió

1. Alineación ordenada por palabras, después de normalizar las letras SOLO para comparar, sin alterar el texto publicado: **3.976 de 3.980 palabras** del lector coinciden exactamente con el VTT (**99,8995 %**).
2. Se recuperaron **110 intervalos de oración** con límites del reconocimiento directo del audio. Para las **13 oraciones restantes** se calcularon límites provisionales mediante posición textual en el VTT e interpolación LOCAL entre límites de audio ASR adyacentes. Ningún tiempo fue añadido sin una fuente de cálculo explícita.
3. Comprobación cruzada de **216 límites** de oraciones cronometradas: error absoluto mediano de **0,385 s**, percentil 90 de **0,661 s**, máximo de **4,431 s**. Estas métricas indican consistencia temporal, no certeza auditiva.
4. Los 123 intervalos propuestos conservan el orden y no presentan solapamientos superiores a 50 ms. La última oración termina en 2020,140 s, antes de que concluya el MP3.
5. Todos los rangos conservan el estado **auditory-check-required** y la nueva propuesta señala expresamente activeInReader=false. No se activaron ni el resaltado ni «escuchar desde aquí».

## Oraciones de revisión prioritaria

| ID | Inicio propuesto (s) | Fin propuesto (s) |
|---|---:|---:|
| ms-introduccion-p1-s2 | 26.100 | 40.866 |
| ms-introduccion-p1-s3 | 40.866 | 55.388 |
| ms-introduccion-p2-s3 | 84.020 | 91.560 |
| ms-apartado-2-p3-s5 | 501.140 | 522.300 |
| ms-apartado-2-p6-s1 | 582.086 | 598.800 |
| ms-apartado-3-p1-s3 | 661.100 | 679.140 |
| ms-apartado-3-p4-s5 | 846.520 | 849.619 |
| ms-apartado-3-p10-s1 | 1056.511 | 1065.840 |
| ms-apartado-3-p13-s3 | 1207.460 | 1214.800 |
| ms-apartado-3-p15-s1 | 1260.783 | 1286.720 |
| ms-apartado-3-p18-s2 | 1408.300 | 1421.140 |
| ms-apartado-3-p21-s3 | 1555.560 | 1567.180 |
| ms-apartado-4-p2-s3 | 1688.740 | 1703.460 |

Cinco cortes adicionales para comprobar mayores diferencias entre ambos métodos: ms-apartado-3-p1-s4 (4,431 s), ms-apartado-3-p22-s1 (2,347 s), ms-apartado-3-p1-s1 (2,229 s), ms-apartado-4-p1-s1 (2,224 s), ms-apartado-2-p7-s1 (2,204 s).

## Revisión auditiva focalizada

Se preparó, como archivo de entrega independiente del repositorio, **Marcaida_Scaltritti_revision_auditiva_18_pasajes.zip** (4,8 MB), con 22 recortes MP3 de control y tres segundos de contexto a cada lado. Contiene index.html con reproducción integrada, edición de tiempos y exportación CSV; también manifest.csv y manifest.json. No se versionaron los recortes en GitHub.

El siguiente control debe escuchar estos 22 pasajes y una muestra distribuida del resto de las 110 oraciones; verificar también comienzos/finales de apartados, portada y encabezados. La nota editorial número 2 aparece como contenido narrado en el cuerpo de la versión de cátedra; las diez notas editoriales, en tanto aparato separado, no tienen tiempos ni deben sincronizarse por sí mismas.

## Cuatro diferencias léxicas adicionales entre lector y VTT

La alineación exacta detectó solo cuatro oraciones con una palabra sin coincidencia exacta en los subtítulos: ms-apartado-2-p6-s2, ms-apartado-3-p9-s2, ms-apartado-3-p20-s3 y ms-apartado-4-p3-s11. La última contiene «Rusia y China» en el texto académico, frente a «Europa y China» en el VTT. El reconocimiento automático anterior identifica «Rusia y China» en el MP3, pero **la confirmación auditiva sigue pendiente**. Se prepararon cuatro recortes adicionales T01–T04 para cotejarlas, sin modificar texto ni audio.

## Criterios de cierre

- Validación auditiva y ajuste de los 18 límites prioritarios y del muestreo del resto del capítulo.
- Confirmar límites correctos en el audio, sin saltos falsos, tiempos fuera del MP3 ni alteraciones de palabras.
- Mantener los identificadores y las anotaciones personales existentes.
- Incorporar tiempos en el documento público y pasar la sincronización a ready **solo tras** superar esos controles, y ejecutar pruebas y regresión de las otras obras.
- No incluir en la página explicaciones sobre la metodología de producción; conservarlas aquí (CAN-01).

**La obra pública permanece en revisión.** Esta propuesta cuantifica y localiza el trabajo pendiente, pero no declara la sincronización validada.

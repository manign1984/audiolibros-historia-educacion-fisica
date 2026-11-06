# Work 2 · Construcción y controles

## Recuperación y condiciones de uso

06-11-2026: rama y PR #79 leídas antes de editar; HEAD `715bc4cd7e5a52b87776b94366b68ff99e056a6e`, PR abierta, draft, no fusionada. Nueve archivos del dossier presentes. Directrices v2.0 leídas en Drive, modifiedTime 04-11-2026 17:04:01Z, sin cambio frente a Work 1. Acta, auditoría, análisis, diseño, recursos y protocolos recuperados.

PDF, MP3, VTT y TXT recuperados: mismos bytes/SHA-256 que AUDITORIA_DOCUMENTAL.md. No se repitió el inventario ni la selección editorial.

**I04 permanece abierta:** la ficha editorial, el PDF y la documentación de ingreso no contienen una licencia/permiso de redistribución del capítulo, traducción, narración o retrato. Una selección editorial de MP3/VTT no prueba esa autorización. No se añadirá ninguno de esos materiales al repositorio público durante Work 2. El documento reconstruido y los datos de correspondencia se conservarán como checkpoint privado, con generadores reproducibles y huellas públicas. La ruta sigue en preparación; una compilación candidata local puede usar materiales ignorados. No se contactó a terceros ni se inventó una licencia.

## Reconstrucción académica

`tools/soares/reconstruct.py` consume exclusivamente el PDF con hash fijado. Usa tamaño, posición y orden de líneas para distinguir cuerpo, superíndices y notas. Une renglones y continuaciones de página, conserva léxico, citas, errores, fechas y lagunas. La bibliografía conserva los guiones de autor repetido y las fichas incompletas. Las entradas se separan por sus comienzos documentales, sin completar referencias.

Resultado inicial: siete apartados, 61 párrafos de lectura (agrupación de renglones), 29 notas, 47 entradas bibliográficas. Llamadas 1 en título, 9 y 22 en encabezados; las otras 26 en el cuerpo. Censo independiente de caracteres del PDF, sin blancos ni guiones discrecionales, idéntico al documento reconstruido incluyendo identificación, encabezados, llamadas, notas y bibliografía. Este censo controla pérdidas/duplicaciones, no sustituye el cotejo visual ni certifica por sí solo el orden.

`buildReadingDocument.js` crea IDs `soa-<apartado>-p<n>-s<n>` por oración con Intl.Segmenter español y tratamiento de abreviaturas. No toma el guion como texto académico. Fecha Jahn 1778-1825 conservada; aclaración editorial diferenciada y fuente BnF al final. Notas y bibliografía sin tiempos ficticios. Los tiempos candidatos quedarán fuera del documento activo hasta aprobar G3.

## Correspondencia y límite G3

`tools/soares/align.py` relaciona tokens del documento con los 593 cues mediante correspondencia monotónica, normalización explícita de mayúsculas/acentos y diagnóstico de silencios. No sustituye palabras del PDF ni calcula tiempos de palabra por interpolación. Evidencia numérica por ID en `evidencia/correspondencia-work2.json`, sin reproducción del texto académico.

194 unidades: 185 oraciones del cuerpo, siete encabezados, título y autoría. 6371/6508 tokens académicos encuentran correspondencia exacta normalizada; las diferencias incluyen referencias abreviadas, cifras y discrepancias léxicas ya auditadas. 52 unidades coinciden en ambos extremos con límites de cue; **ni siquiera estas se declaran acústicamente verificadas**. Las demás comparten cues o presentan diferencias. Todas conservan `acousticallyVerified:false`, `runtimeEnabled:false`; el documento activo no contiene `start/end`.

FFmpeg analizó el archivo real completo con `silencedetect=noise=-35dB:d=0.15`: 1053 pausas detectadas. Se registran pausas cercanas a los extremos propuestos. Este control prueba energía/silencio, no confirma palabras, voces o fronteras semánticas. No hubo ASR, alineación forzada ni escucha humana adicional. Inicio, encabezados, mitad y final se pueden localizar por ID y cue; G3 permanece pendiente para seguimiento. No se copia la modalidad por párrafos de Marcaida.

## Candidato local y resguardo de materiales

El documento académico completo está preservado privadamente: `Soares_Work2_documento_academico.zip` (`libfile_31d84354c2b08191bec4d2f86fb3c122`), SHA-256 del ZIP `33a526548bc467bc64fef576d15a690d770e15bc78963d66e7ba3fbb9946e842`. Contiene `academic.json` y `document.json`, sin MP3/PDF/retrato. No es una URL pública de redistribución. Los originales se recuperan de Drive y se comprueban con los hashes registrados. Los generadores evitan depender de un entorno temporal.

`prepare-local.mjs` comprueba los hashes antes de copiar materiales a `.local/soares/`, ignorado por Git. El plugin `soares-local-candidate.mjs` cambia la entrada de la MISMA ruta de Soares solo con `SOARES_LOCAL_CANDIDATE=1` y copia el conjunto privado a ese build local. Los builds ordinarios conservan la ficha de preparación y no copian materiales privados. No debe publicarse un dist candidato. No se añade un séptimo lector disponible al catálogo mientras I04/G3/G7 sigan pendientes.

Código de la obra en `src/soares/`; motor, biografía, encabezado, Lectura y Créditos compartidos. Solo extensión de raíces `.soares-page` en CSS canónico y nueva clave de Créditos. Ninguna clave o documento de las seis obras anteriores cambia. Retrato auténtico únicamente local; no se aprueba una alternativa tipográfica ni se inventa un rostro.

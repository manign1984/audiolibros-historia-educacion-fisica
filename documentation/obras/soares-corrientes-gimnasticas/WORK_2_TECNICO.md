# Work 2 · Construcción y controles

## Recuperación y condiciones de uso

06-11-2026: rama y PR #79 leídas antes de editar; HEAD `715bc4cd7e5a52b87776b94366b68ff99e056a6e`, PR abierta, draft, no fusionada. Nueve archivos del dossier presentes. Directrices v2.0 leídas en Drive, modifiedTime 04-11-2026 17:04:01Z, sin cambio frente a Work 1. Acta, auditoría, análisis, diseño, recursos y protocolos recuperados.

PDF, MP3, VTT y TXT recuperados: mismos bytes/SHA-256 que AUDITORIA_DOCUMENTAL.md. No se repitió el inventario ni la selección editorial.

**I04 permanece abierta:** la ficha editorial, el PDF y la documentación de ingreso no contienen una licencia/permiso de redistribución del capítulo, traducción, narración o retrato. Una selección editorial de MP3/VTT no prueba esa autorización. No se añadirá ninguno de esos materiales al repositorio público durante Work 2. El documento reconstruido y los datos de correspondencia se conservarán como checkpoint privado, con generadores reproducibles y huellas públicas. La ruta sigue en preparación; una compilación candidata local puede usar materiales ignorados. No se contactó a terceros ni se inventó una licencia.

## Reconstrucción académica

`tools/soares/reconstruct.py` consume exclusivamente el PDF con hash fijado. Usa tamaño, posición y orden de líneas para distinguir cuerpo, superíndices y notas. Une renglones y continuaciones de página, conserva léxico, citas, errores, fechas y lagunas. La bibliografía conserva los guiones de autor repetido y las fichas incompletas. Las entradas se separan por sus comienzos documentales, sin completar referencias.

Resultado inicial: siete apartados, 61 párrafos de lectura (agrupación de renglones), 29 notas, 47 entradas bibliográficas. Llamadas 1 en título, 9 y 22 en encabezados; las otras 26 en el cuerpo. Censo independiente de caracteres del PDF, sin blancos ni guiones discrecionales, idéntico al documento reconstruido incluyendo identificación, encabezados, llamadas, notas y bibliografía. Este censo controla pérdidas/duplicaciones, no sustituye el cotejo visual ni certifica por sí solo el orden.

`buildReadingDocument.js` crea IDs `soa-<apartado>-p<n>-s<n>` por oración con Intl.Segmenter español y tratamiento de abreviaturas. No toma el guion como texto académico. Fecha Jahn 1778-1825 conservada; aclaración editorial diferenciada y fuente BnF al final. Notas y bibliografía sin tiempos ficticios. Los tiempos candidatos quedarán fuera del documento activo hasta aprobar G3.

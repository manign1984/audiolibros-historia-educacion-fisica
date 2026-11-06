# Work 2 · Construcción y controles

## Recuperación y condiciones de uso

06-11-2026: rama y PR #79 leídas antes de editar; HEAD `715bc4cd7e5a52b87776b94366b68ff99e056a6e`, PR abierta, draft, no fusionada. Nueve archivos del dossier presentes. Directrices v2.0 leídas en Drive, modifiedTime 04-11-2026 17:04:01Z, sin cambio frente a Work 1. Acta, auditoría, análisis, diseño, recursos y protocolos recuperados.

PDF, MP3, VTT y TXT recuperados: mismos bytes/SHA-256 que AUDITORIA_DOCUMENTAL.md. No se repitió el inventario ni la selección editorial.

**I04 permanece abierta:** la ficha editorial, el PDF y la documentación de ingreso no contienen una licencia/permiso de redistribución del capítulo, traducción, narración o retrato. Una selección editorial de MP3/VTT no prueba esa autorización. No se añadirá ninguno de esos materiales al repositorio público durante Work 2. El documento reconstruido y los datos de correspondencia se conservarán como checkpoint privado, con generadores reproducibles y huellas públicas. La ruta sigue en preparación; una compilación candidata local puede usar materiales ignorados. No se contactó a terceros ni se inventó una licencia.

## Reconstrucción académica

`tools/soares/reconstruct.py` consume exclusivamente el PDF con hash fijado. Usa tamaño, posición y orden de líneas para distinguir cuerpo, superíndices y notas. Une renglones y continuaciones de página, conserva léxico, citas, errores, fechas y lagunas. La bibliografía conserva los guiones de autor repetido y las fichas incompletas. Las entradas se separan por sus comienzos documentales, sin completar referencias.

Resultado inicial: siete apartados, 70 párrafos de lectura (agrupación de renglones), 29 notas, 47 entradas bibliográficas. Llamadas 1 en título, 9 y 22 en encabezados; las otras 26 en el cuerpo. Censo independiente de caracteres del PDF, sin blancos ni guiones discrecionales, idéntico al documento reconstruido incluyendo identificación, encabezados, llamadas, notas y bibliografía. Este censo controla pérdidas/duplicaciones, no sustituye el cotejo visual ni certifica por sí solo el orden.

`buildReadingDocument.js` crea IDs `soa-<apartado>-p<n>-s<n>` por oración con Intl.Segmenter español y tratamiento de abreviaturas. No toma el guion como texto académico. Fecha Jahn 1778-1825 conservada; aclaración editorial diferenciada y fuente BnF al final. Notas y bibliografía sin tiempos ficticios. Los tiempos candidatos quedarán fuera del documento activo hasta aprobar G3.

## Correspondencia y límite G3

`tools/soares/align.py` relaciona tokens del documento con los 593 cues mediante correspondencia monotónica, normalización explícita de mayúsculas/acentos y diagnóstico de silencios. No sustituye palabras del PDF ni calcula tiempos de palabra por interpolación. Evidencia numérica por ID en `evidencia/correspondencia-work2.json`, sin reproducción del texto académico.

194 unidades: 185 oraciones del cuerpo, siete encabezados, título y autoría. 6371/6508 tokens académicos encuentran correspondencia exacta normalizada; las diferencias incluyen referencias abreviadas, cifras y discrepancias léxicas ya auditadas. 52 unidades coinciden en ambos extremos con límites de cue; **ni siquiera estas se declaran acústicamente verificadas**. Las demás comparten cues o presentan diferencias. Todas conservan `acousticallyVerified:false`, `runtimeEnabled:false`; el documento activo no contiene `start/end`.

FFmpeg analizó el archivo real completo con `silencedetect=noise=-35dB:d=0.15`: 1053 pausas detectadas. Se registran pausas cercanas a los extremos propuestos. Este control prueba energía/silencio, no confirma palabras, voces o fronteras semánticas. No hubo ASR, alineación forzada ni escucha humana adicional. Inicio, encabezados, mitad y final se pueden localizar por ID y cue; G3 permanece pendiente para seguimiento. No se copia la modalidad por párrafos de Marcaida.

## Candidato local y resguardo de materiales

El documento académico completo está preservado privadamente: `Soares_Work2_documento_academico.zip` (`libfile_31d84354c2b08191bec4d2f86fb3c122`), SHA-256 del ZIP `f8412679982ac1ea15d20e19909242bfffc378087a3d661c6e692a983041de0b`. Versión privada 1. Contiene `academic.json` y `document.json`, sin MP3/PDF/retrato. No es una URL pública de redistribución. Los originales se recuperan de Drive y se comprueban con los hashes registrados. Los generadores evitan depender de un entorno temporal.

`prepare-local.mjs` comprueba los hashes antes de copiar materiales a `.local/soares/`, ignorado por Git. El plugin `soares-local-candidate.mjs` cambia la entrada de la MISMA ruta de Soares solo con `SOARES_LOCAL_CANDIDATE=1` y copia el conjunto privado a ese build local. Los builds ordinarios conservan la ficha de preparación y no copian materiales privados. No debe publicarse un dist candidato. No se añade un séptimo lector disponible al catálogo mientras I04/G3/G7 sigan pendientes.

Código de la obra en `src/soares/`; motor, biografía, encabezado, Lectura y Créditos compartidos. Solo extensión de raíces `.soares-page` en CSS canónico y nueva clave de Créditos. Ninguna clave o documento de las seis obras anteriores cambia. Retrato auténtico únicamente local; no se aprueba una alternativa tipográfica ni se inventa un rostro.


Correcciones de control: el segmentador protege las elipsis y une cierres de cita; ninguna unidad queda reducida a puntuación. La reconstrucción coloca superíndices mediante coordenadas de glifos dentro del renglón, incluso cuando el extractor agrupó texto a ambos lados de una llamada en el mismo span. La llamada 2 se vincula a la oración que termina en «inexistentes», no a la siguiente. Se infieren espacios por distancias de glifos sin cambiar caracteres léxicos. Esta corrección reorganizó 70 párrafos; los IDs finales son los del checkpoint privado versión 1 y evidencia/documento-work2.json. No existían anotaciones públicas sobre los IDs provisionales.

## Pruebas y estado del candidato

Resultados completos y alcance en [evidencia/pruebas-work2.json](evidencia/pruebas-work2.json). `npm ci`, suites de catálogo, lector, seis obras, validación adversa y Soares finalizaron con código 0. Soares se probó con el documento privado real y, aparte, sin materiales privados para comprobar la vía sintética de CI. La prueba sintética anuncia expresamente que no audita la fuente real. Se añadieron comprobaciones contra llamadas desplazadas y contra material distinto del hash auditado.

Builds ordinarios de raíz y Pages, y builds candidatos de raíz y Pages: código 0; `verify:build` y referencias emitidas aprobados. Los ordinarios no contienen `assets/soares-private`; el último dist quedó como build ordinario sin materiales privados. `validate:works`: seis recorridos existentes, cero errores, seis avisos preexistentes conservados. Soares no se añadió falsamente al registro activo: ese contrato requiere audio público real y catálogo accesible. Su registro separado es `validation/soares-candidate.json`. No se modificaron expectativas de pruebas anteriores, hashes de obras previas, catálogo ni claves existentes. El CSS común, quitando exclusivamente `, .soares-page`, es idéntico al de ingreso.

**Navegador:** inspección inicial real de Chrome sobre build candidato local: 1363×936, encabezado 80; bloques 856/856/2568/856/856; Contexto 856/856/856; cuatro imágenes cargadas y sin desbordamiento horizontal. Se observaron Inicio y 03.1, DOM de las tres unidades, apertura/cierre del modal, metadatos del MP3, 29 notas y ausencia de autoplay/resaltado. Duración que comunica Chrome: 3113,331293 s, igual a la decodificación de ffmpeg; el contenedor ffprobe sigue siendo 3113,377959 s. La diferencia es de 0,046666 s y no cambia los binarios ni certifica fronteras de voz. Esta inspección precedió a la corrección final de llamadas en los datos; no se repitió la aceptación completa, reservada a Work 3. No hubo escucha humana. Preview temporal detenido.

**Recuperación exacta:** descargar los originales auditados a una carpeta local; recuperar la versión privada 1 del ZIP y extraer `academic.json` (o regenerarlo, sin necesidad de nueva investigación). Desde la raíz del repo:

```bash
python tools/soares/reconstruct.py /ruta/original.pdf /ruta/academic.json
node tools/soares/prepare-local.mjs /ruta/academic.json /ruta/original.pdf /ruta/original.mp3 /ruta/original.vtt /ruta/portrait.jpeg
cd portable-site
npm ci
npm run test:soares
SOARES_LOCAL_CANDIDATE=1 npm run build
```

El retrato debe coincidir con la fuente/hashes de RECURSOS_Y_FUENTES.md. La copia privada es solo local, no una aprobación de reproducción pública. Para publicar en Work 3 primero resolver I04 y G3/G7, promover conscientemente catálogo/ruta/entrada Vite y crear un registro activo con los materiales efectivamente autorizados. No basta cambiar `preparation` por `available`: desaparecería la entrada que ahora aporta el filtro de Vite. No usar `ready` ni copiar el modo por párrafos para sortear G3. No publicar un dist candidato local accidentalmente.

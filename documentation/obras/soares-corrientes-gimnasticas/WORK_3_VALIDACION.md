# Work 3 · Validación integral en curso

## Recuperación

PR #79 abierta en borrador, HEAD de ingreso `8575c5301112939dce2a4a9d2b80a7aa88aba389`; fuentes y checkpoint privado v1 recuperados. Este Work está autorizado para corregir, evaluar y publicar una vez resueltas las puertas pendientes. No implica que la selección editorial del MP3 pruebe derechos de redistribución. La ficha primaria de Miño y Dávila consultada no añadió una licencia de reproducción; I04 sigue abierta.

El entorno temporal se reinició durante el trabajo. Las correcciones siguientes se recuperan desde la trazabilidad del chat y se guardan en este checkpoint. El documento académico ya estaba preservado. La transcripción acústica temporal y comprobaciones parciales del segundo modelo no habían sido persistidas: **no se presentan como evidencia recuperable ni como G3 aprobado**. Se regeneran con procedimiento guardado y una copia privada al completar cada etapa.

## Correcciones observadas

- La cursiva del título bibliográfico en Créditos heredaba el vino de `.soares-page em`, con contraste inadecuado sobre fondo oscuro. El acento queda limitado a Inicio/Contexto; Créditos recupera `rgb(241,237,229)` sobre `rgb(12,14,21)`, comprobados en navegador.
- La matriz de 03.2 conserva los tres grupos nacionales, pero alinea Saberes/Fines/Tensiones mediante subgrid en escritorio. Los nueve rótulos coincidieron en tres alturas (395/511/601 px en la observación), sin cambiar contenido ni el apilamiento móvil.
- El lector no tenía la variable tipográfica `--display` y su título largo generaba desbordamiento horizontal: ancho del panel 750, scroll 803. Con Bebas Neue y corte accesible de palabras, 750/750 en tamaño normal y ampliación interna 132 %. No se cambia el motor común.
- La paleta vino/cobre se aplica al botón canónico de Lectura. Se conservan medidas, ángulos, distancias de sombras, animación, cápsula e iconos; cambian únicamente colores.

## Observaciones de navegador ya realizadas

Chrome local, marcos de 320×740, 390×844, 768×900 y 1280×650; escritorio 1363×936. Los anchos CSS interiores de los marcos fueron 305/375/753/1265 por la barra vertical del navegador. No se afirma hardware móvil físico.

- Sin desbordamiento horizontal de la página ni elementos esenciales fuera del ancho en esos marcos.
- A 1363×936: encabezado 80; bloques 856/856/2568/856/856. Tres unidades de Contexto de 856. Se observaron Inicio, Autor, los tres Contextos, Lectura y Créditos.
- Ventana baja: crecimiento natural y una barra general. Antes del ajuste de filas se midieron 588/570/2127/661/570 para los cinco bloques; es excepción de altura, no retícula de referencia.
- Lector abierto con Enter, capítulos, llamada 20 y retorno al pasaje, notas académicas diferenciadas, anotación sintética, descarga real JSON/TXT y Escape del cuaderno conservando el lector abierto.
- Audio real: avance a 20 s, reproducción a 1,1×, pausa a 32,571343 s; cierre por Escape devuelve foco al botón y reapertura conserva posición/velocidad sin autoplay.
- Aún debe terminarse revisión móvil del lector, zoom y movimiento reducido. Las capturas del navegador fueron de uso interno; no se guardan como entregables.

Los resultados anteriores se observaron en el entorno reiniciado. Se documentan como observaciones efectivamente realizadas, sin fingir que las capturas o descargas sigan disponibles. Las comprobaciones finales necesarias se repiten sobre la versión persistida.

## Colación documental completada

`collate_academic.py` compara de forma independiente el orden léxico del documento PDF reconstruido con el TXT íntegro auditado, no con el guion narrado. Resultado: 6422 tokens de cuerpo en el mismo orden; 29 notas iguales; 861 tokens de bibliografía en el mismo orden. El TXT concatena físicamente las notas 20/21 y 24/25: se separan solo en memoria para comparar, sin modificar fuentes. Esta comparación excluye cifras/puntuación, controladas separadamente por el censo de caracteres del PDF de Work 2. [Informe](evidencia/colacion-work3.json). No se corrigieron silenciosamente erratas.

## Evidencia acústica recuperable

Se ejecutó `faster-whisper 1.2.1` / `ctranslate2 4.8.5`, CPU int8, español, beam 5, palabras con tiempos, VAD, sin condicionamiento al texto previo. Se decodifica el MP3 mediante ffmpeg a 16 kHz mono float32 para análisis; el original conserva su hash. Se registran revisiones y hashes de pesos en [modelos-work3.json](evidencia/modelos-work3.json).

- Whisper **tiny**, grabación completa: 6435 palabras reconocidas. Correspondencia monótona documento → VTT → palabras medidas, sin interpolación. 194 candidatos, 26 unidades con alertas iniciales. No hubo intervalos candidatos invertidos, solapados ni fuera de su cue de referencia según la tolerancia registrada.
- Whisper **base**, 38 ventanas que suman **806,471 segundos**: comienzo, encabezados, mitad, final y extremos con alertas. Son dos tamaños de la misma familia, no dos métodos independientes.
- Comparación en la identidad exacta de tokens normalizados del VTT: **135 fronteras** comparadas, **50 unidades** con ambos extremos comparados. **17 discrepancias >0,45 s**, entre −0,92 y +0,92 s. El umbral solo selecciona revisión, no acredita una precisión del lector.
- **35 unidades señaladas** por la unión de alertas léxicas/probabilidad y discrepancias temporales. Las otras 159 no pasan por eso a estar verificadas. Las referencias abreviadas/no narradas explican parte de la cobertura baja; no se borra del texto académico ese contenido.
- [Resultado numérico completo](evidencia/acustica-work3.json). `humanListening:false`, `runtimeEnabled:false`. **G3 sigue pendiente y el lector mantiene `sync.status=pending`, sin tiempos activos.** Reconocimiento de palabras no equivale a alineación forzada ni a escucha humana.

**Paquete privado persistido:** [Soares_Work3_revision_acustica.zip](https://chatgpt.com/library?file_id=libfile_ba319db31dfc8191909a4b413edbfbc4&account_id=personal), **versión 1**, 8024291 bytes, SHA-256 `f4b038751fe3ab6eb1eef941e4b5b5d81a60b0c6e4293bdc9b7fc7d13e804d06`. Contiene los dos resultados ASR completos, 194 candidatos, auditoría inicial, ventanas, comparación y **40 extractos reales** (745,531 s con posibles repeticiones entre clips). Abrir `revision/ABRIR_REVISION.html`; `revision/revision.json` conserva el texto y origen temporal de cada clip. Casilleros de HTML orientativos, sin guardado automático. La revisión todavía no se realizó; todos los registros dicen `humanReviewed:false`. No contiene una voz nueva ni sustituye el MP3.

Procedimientos reproducibles, desde la raíz del repositorio (entradas privadas fuera del árbol):

```sh
python3 tools/soares/collate_academic.py ACADEMIC_JSON TXT INFORME_COLACION
python3 tools/soares/recognize_audio.py --audio MP3 --output TINY_JSON --model tiny --revision d90ca5fe260221311c53c58e660288d3deb8d356 --model-dir MODELOS --threads 4
python3 tools/soares/map_acoustic.py --document DOCUMENT_JSON --vtt VTT --asr TINY_JSON --outdir RESULTADOS
python3 tools/soares/recognize_audio.py --audio MP3 --output BASE_JSON --model base --revision ebe41f70d5b6dfa9166e2c581c45c9c0cfc57b66 --model-dir MODELOS --windows RESULTADOS/review-windows.json --threads 4
python3 tools/soares/compare_acoustic.py DOCUMENT_JSON VTT TINY_JSON BASE_JSON RESULTADOS/acoustic-audit.json INFORME_COMPARACION
python3 tools/soares/prepare_review.py DOCUMENT_JSON MP3 RESULTADOS/acoustic-candidate.json RESULTADOS/acoustic-audit.json INFORME_COMPARACION PAQUETE_PRIVADO
```

## Cierre de comprobaciones de navegador

Repetido sobre el código persistido `b994543…`: lector de **320×740** y **390×844**, ambos sin desbordamiento horizontal (diálogo 320/320 y 390/390; documento 310/310 y 380/380). Audio alcanza readyState 4; no autoplay. En 320 se cambió a Alemania, abrió nota académica 20 y volvió al pasaje; se guardó una anotación sintética, recargó realmente, reabrió y comprobó el comentario recuperado. Se eliminó exclusivamente esa anotación, confirmando cuaderno vacío. En 390 se navegó a Ideas finales y se inspeccionó su composición. Escritorio final: cuatro imágenes cargadas, ancho 1348/1348 sin overflow.

El intento de atajos de zoom no cambió las dimensiones CSS: **no se declara zoom del navegador validado**. El aumento interno del lector a 132 % fue comprobado antes del reinicio y está descrito arriba. Movimiento reducido: inspección estática de las reglas del botón común y consultas matchMedia del lector; **no se emuló la preferencia en navegador**. Se requieren esos dos controles de navegador para cerrar G7; no se sustituyen con una compilación ni se afirman pruebas de hardware táctil. Tampoco se declara escucha humana del paquete acústico.


## Pruebas finales guardadas

Código bajo prueba `0f49702dc9fcaac2c13ffe6eea709f3a92e4a820`. [pruebas-work3.json](evidencia/pruebas-work3.json): 27 comprobaciones con cero fallos. Incluye Soares con fuentes reales, lector DOM, seis regresiones, catálogo y validación adversa; builds ordinarios/candidatos raíz y Pages con verificación de rutas/referencias, presencia/ausencia de materiales privados y escaneo de hashes completos en los dist ordinarios. No es una prueba general de exfiltración. Registro activo: 6 recorridos, 29 fichas, 106 referencias, 0 errores y 6 avisos anteriores conservados. Censo PDF y sintaxis Python reejecutados. `npm ci` finalizó con código 0 (72 dependencias fijadas; lock sin cambios). Enlaces locales y JSON válidos.

CI remota del mismo checkpoint: **42281356936, completed/success**. El ajuste posterior de `recognize_audio.py` agrega `--revision` para fijar los pesos registrados y rechaza reutilizar resultados de ventanas/revisión diferentes; sintaxis y ruta de reutilización comprobadas. No altera los resultados ASR ya guardados ni el código de interfaz probado.

**Corte recuperable:** no se fusiona ni publica. Las condiciones de redistribución siguen sin acreditarse y G3/G7 no están cerradas. El siguiente paso no es recomenzar Work 1/2: es resolver esos pendientes con los materiales conservados.


## Reanudación posterior · 06-11-2026

Ingreso comprobado `3052aec06225e3cd9a8b5c94c1aa00868bd98d0c`; PR #79 abierta/draft, main `8c2bbe4…`. Entorno temporal reiniciado; ambos ZIP versión 1 recuperados con hashes idénticos, sin reconstruir el capítulo ni repetir Whisper. Originales recuperados y build candidato aprobado con controles de integridad.

Se precisa la consulta I04 ante la pregunta del responsable: se busca conocer una condición de uso/autorización ya existente para publicación abierta, no una nueva aprobación de tareas ni un contrato con formato obligatorio. Son tres alcances distintos: capítulo y traducción; narración aportada por el proyecto; retrato institucional sin licencia individual consignada. La ausencia de un documento en el expediente no se presenta como prueba de que el proyecto carezca de permiso. No se cambian las condiciones por suposición ni se contacta a terceros.

Se inicia un contraste acústico adicional mediante `torchaudio.pipelines.MMS_FA` (torch/torchaudio 2.8.0 CPU; API retirada en 2.9). Se utiliza el VTT fijado como transcripción de lo narrado; no se fuerza a pronunciar notas o referencias omitidas. El modelo aporta frames de tokens sobre la señal, en ventanas de cues con contexto y absorción lateral. No se interpola el tiempo de las palabras. La normalización de números y tildes opera solo en el análisis y queda registrada; ninguna fuente se modifica. Aún sin resultado final: mantener `pending`. Procedimiento: `tools/soares/force_align_audio.py`, con checkpoint privado por ventana.

Fuentes primarias del procedimiento: [tutorial multilingüe de TorchAudio 2.8](https://docs.pytorch.org/audio/2.8/tutorials/forced_alignment_for_multilingual_data_tutorial.html) y [MMS_FA](https://docs.pytorch.org/audio/2.8/generated/torchaudio.pipelines.MMS_FA.html). Modelo usado para análisis local de este proyecto educativo; pesos no se incorporan al repositorio.

Navegador recuperado: candidato carga y mantiene ancho 1348/1348. La interfaz nativa de Chromium se abrió pero la entrada falló por AT-SPI no disponible. El navegador remoto rechazó el acceso a su configuración interna por política de URL; no se intentó eludirla. Zoom real y emulación de movimiento reducido permanecen sin aprobar en esta reanudación.


Piloto CTC: padding 0,8 s descartado por recorte de palabras en bordes. La comparación global de 6120 tokens coincidentes con Whisper mostró adelantos de hasta 2,39 s y finales hasta 3,948 s fuera del cue. Se amplía contexto a 4 s; no se conservan intervalos del piloto como candidatos aceptados. Checkpoint privado v2 (4/111 ventanas amplias) ya guardado con SHA `ed0c85bafdb9001bee9d9649b8301ce1921a7d126e744eb08b0799fc8cc01b8a`; no es un resultado completo.


## Resultado completo de la reanudación · CTC

**Cálculo completado: 111/111 ventanas, 6390 palabras del VTT y 194 intervalos candidatos de unidades académicas.** Modelo MMS_FA, pesos SHA-256 `20ef12963ab4924bef49ac4fc7f58ad5da2ee43b2c11bc8c853c9b90ecdbc680`; torch/torchaudio 2.8.0 CPU, NumPy 2.2.6, num2words 0.5.14. No se repitió Whisper ni se alteraron los originales. El procedimiento comprueba fuentes, versiones y pesos; conserva checkpoint atómico por ventana y rechaza escrituras concurrentes. La reanudación retuvo los resultados de las ventanas previas.

[Informe numérico](evidencia/ctc-work3.json): se compararon **360 extremos de tokens idénticos** con Whisper tiny; **314** difieren a lo sumo 300 ms, mediana absoluta **0,1048035 s**; 35 difieren más de 450 ms. 27 unidades carecen de comparación Whisper en al menos un extremo. En **122 unidades** coinciden ambos extremos dentro de 300 ms y no hay alertas de la regla; **72 quedan para revisión** por falta de corroboración, diferencias temporales o alertas. No son 72 errores demostrados. Hay 10 unidades con puntuación de borde CTC menor a 0,5 y 2 con correspondencia académica/narrada menor a 0,75; no hubo intervalos inválidos, solapamientos superiores a 60 ms ni extremos próximos al recorte según los controles registrados.

Los 35 casos señalados en la etapa anterior y estos 72 responden a coberturas/reglas diferentes: antes se contrastaron dos tamaños de Whisper solo en ventanas seleccionadas y ahora se evalúa la grabación completa con otro método y un umbral más estricto. No se restan esas cifras ni se presenta la nueva cifra como deterioro o resolución automática de todos los casos. Las puntuaciones y umbrales solo seleccionan revisión. **G3 sigue pendiente; `sync.status=pending`, cero tiempos activos.** No se declara escucha humana ni aceptación perceptiva.

Se preservó una comparación privada por cada unidad entre texto académico y fragmento del VTT, con operaciones de diferencia literal. Las tildes/números se normalizan solo para el análisis; no se cambian el capítulo, sus llamadas, notas, bibliografía o la fecha fuente de Jahn. El VTT es la transcripción suministrada, no una declaración de escucha humana. El aparato de 29 notas y 47 referencias continúa sin tiempos.

**Paquete privado actual:** [Soares_Work3_revision_acustica.zip](https://chatgpt.com/library?file_id=libfile_ba319db31dfc8191909a4b413edbfbc4&account_id=personal), **versión 4**, 26505697 bytes, SHA `d949093ed44df7fba86b353986cdfb1353b7ebf03174a337a635f3654161fd4c`. Sustituye los checkpoints parciales v2/v3 para recuperación. Incluye CTC completo, informe, `academic-vtt-differences.json` y **80 extractos actuales** (1713,86 s con contexto/repeticiones) en `revision-ctc/`; abrir `revision-ctc/ABRIR_REVISION.html`. Conserva también las transcripciones y los 40 extractos originales de v1 en `revision/`. Todos los registros de escucha permanecen `humanReviewed:false`; los casilleros HTML no guardan decisiones automáticamente. El ZIP pasa CRC y los 80 clips nuevos se decodifican sin error.

Comandos desde la raíz, reutilizando las entradas privadas fijadas:

```sh
TORCH_HOME=MODELOS python tools/soares/force_align_audio.py --audio MP3 --vtt VTT --output CTC_JSON --model-dir MODELOS
python tools/soares/evaluate_ctc.py DOCUMENT_JSON CTC_JSON TINY_JSON INFORME_CTC DIFERENCIAS_PRIVADAS_JSON
python tools/soares/prepare_review.py --ctc DOCUMENT_JSON MP3 INFORME_CTC REVISION_PRIVADA
```

Una salida completa se reutiliza; no volver a calcularla al recuperar v4. El evaluador rechaza un CTC incompleto antes de escribir el informe. Un escritor concurrente fue rechazado por el bloqueo de salida. El informe numérico se regeneró byte a byte desde las entradas conservadas. Sintaxis Python y prueba específica Soares (fuente real, aparato, autonomía, guardado/exportación y ausencia de tiempos activos) aprobadas; se añaden contratos de integridad del informe CTC sin cambiar expectativas de otras obras. Validación activa de seis obras: 0 errores y 6 avisos anteriores. `npm ci` y build candidato con hashes también aprobados en este entorno recuperado. [Controles de esta reanudación](evidencia/controles-ctc-work3.json).

**Estado editorial y de navegador:** I04 se mantiene como información no consignada, no como prohibición acreditada ni exigencia de contrato de formato determinado. La aclaración al responsable está en RECURSOS_Y_FUENTES.md. Zoom real/movimiento reducido permanecen pendientes por las limitaciones de interfaz descritas; no se intentó eludir la política de URL. No se cambió la aplicación, el lector compartido, el catálogo, sus claves o materiales anteriores. Sin merge ni publicación.

# Soares · Experimento aislado de resaltado por párrafos desde el VTT

**Estado:** piloto en rama separada; NO publicado y SIN aprobación acústica.  
**Rama:** `experiment/soares-resaltado-parrafos-vtt` desde `feature/soares-corrientes-gimnasticas` / commit `5206606368f3ec979dbdca3a238734e45f95a50f`.  
**PR principal que NO se modifica:** [#79](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/79).  
**Referencia normativa:** Directrices canónicas 2.0; el estado de la obra y las condiciones de redistribución siguen pendientes. **La decisión de adoptar definitivamente el modo párrafos se tomará después de probarlo.**

## Hipótesis

Una lectura académica puede ofrecer un seguimiento visual útil de **párrafos** mediante tiempos ya presentes en el VTT de ElevenLabs, sin repetir la validación por oración mediante Whisper ni CTC. Esto **no equivale** a acreditar la sincronización acústica de todas las palabras o las oraciones.

La implementación conserva el documento fuente (7 apartados, 70 párrafos, 185 oraciones, 29 notas, 47 referencias), el audio y los VTT sin modificaciones. El modo habitual por oración continúa `pending`. El resaltado por párrafos se activa **solo durante una compilación local explícita**.

## Fuente, generación y anomalía registrada

- Evidencia: `documentation/obras/soares-corrientes-gimnasticas/evidencia/correspondencia-work2.json`, derivada de 593 cues del VTT original. Hash VTT esperado: `ec0beaea889464cd05328c6e73fb80f36f3f8899ae99cc463fcefb82bc1e294f`.
- Intervalos de 70 párrafos: `portable-site/src/soares/paragraphPreviewTimings.json`.
- Procedimiento reproducible: `portable-site/scripts/generate-soares-paragraph-preview.mjs` (`node scripts/generate-soares-paragraph-preview.mjs --check` desde `portable-site/`).
- Regla normal: comienzo del primer intervalo VTT asociado al párrafo y final del último, sin interpolar oraciones ni utilizar datos de CTC/Whisper.
- **Única superposición:** párrafos `soa-introduccion-p6` y `soa-introduccion-p7`, ambos tocan el cue 63. Intervalos candidatos comparten 315,608–320,606 s. Para garantizar una transición única del piloto se usa **318,107 s**, punto medio **provisional**. No es el resultado de una escucha ni debe proclamarse exacto.
- Otros límites coinciden mayoritariamente con inicios de cues; hay cambios que pueden adelantarse/retrasarse respecto de la voz. El tamaño de algunos párrafos produce resaltados prolongados.
- No se activan tiempos de portada, encabezados, aparato de notas ni bibliografía. La vista de párrafo se basa en los IDs de párrafo existentes; el documento académico original sigue desglosado en oraciones y con llamadas de nota.

## Aislamiento y seguridad de datos

La rama añade un `soaresParagraphPreviewConfig` que se usa solo cuando se construye la candidata con `VITE_SOARES_PARAGRAPH_PREVIEW=1`. La configuración original `soaresReaderConfig` permanece `sync.unit='sentence'`, `sync.status='pending'`. La biblioteca ordinaria continúa en preparación.

Claves aisladas de anotaciones/progreso del piloto:
- `soares-corrientes-gimnasticas-paragraph-preview-notes-v1`
- `soares-corrientes-gimnasticas-paragraph-preview-state-v1`

La etiqueta y las exportaciones indican claramente `PILOTO`. No se migran ni sobrescriben notas personales de la variante habitual. La corrección mínima compartida del lector usa `config.editorialReferenceLabel` al anunciar una nota académica en modo párrafo; evita identificar erróneamente a Soares como Marcaida y conserva la etiqueta por defecto para obras anteriores.

## Cómo probar sin publicar

Todos los comandos siguientes se ejecutan desde `portable-site/` y requieren un checkout de esta **rama experimental**:

```sh
npm ci
npm run test:soares
node scripts/generate-soares-paragraph-preview.mjs --check
# Solo si los materiales privados ya están en .local/soares/ y coinciden con sus hashes:
SOARES_LOCAL_CANDIDATE=1 VITE_SOARES_PARAGRAPH_PREVIEW=1 npm run build
```

El material privado que exige el build candidato sigue protegido por `soares-local-candidate.mjs`; no se descarga ni copia a la rama. El build de prueba genera un `dist` con materiales restringidos **solo localmente**: **NO desplegar, compartir ni publicar ese dist**. Sin `SOARES_LOCAL_CANDIDATE=1`, la ruta pública permanece en preparación.

Se pueden realizar pruebas de desarrollo en un entorno local autorizado con el candidato y las fuentes privadas, y contrastar los cambios de párrafo en inicio/mitad/final, en los límites cercanos a apartados y **particularmente en 05:18,107**. Registrar desajustes perceptivos, estabilidad de seguimiento/scroll, interacción de notas, teclado, móvil y continuidad de audio. Las pruebas DOM automatizadas son controles funcionales, no una escucha humana.

## Pruebas y aceptación

- `test:soares` incorpora la comprobación de los 70 intervalos, original intacto, aislamiento de notas y fidelidad de la tabla generada.
- `test-soares-runtime.mjs` agrega un montaje sintético para verificar que el lector resalte y cambie correctamente entre dos párrafos y anuncie las notas académicas atribuidas a Soares.
- **No se puede afirmar una prueba real de escucha/navegador de Soares hasta efectuarla.** No marcar `G3=APROBADO` ni `G7=APROBADO` por la sola creación del piloto.
- **No se modifica `validation/works.json`, el catálogo ni la URL pública.** Las condiciones de publicación del capítulo, traducción, voz y retrato siguen separadas del experimento.

## Reanudación y posible adopción

1. Verificar la rama experimental y su PR; leer este documento y `paragraphPreviewTimings.json`.
2. Ejecutar el generador con `--check` y `npm run test:soares`, registrar resultados reales. Si fallan, corregir **el piloto**, no la rama principal.
3. Recuperar únicamente las fuentes privadas necesarias para una revisión visual/acústica local; no repetir Whisper ni CTC.
4. Evaluar la experiencia completa y los 70 cambios; ajustar solo límites sustentados o dejar incertidumbres expresas.
5. Si se decide adoptar párrafos, documentar la excepción y preparar su integración en #79 **separadamente**, con pruebas/regresiones y sin publicación mientras falten derechos.

**Reversión:** descartar la rama experimental. #79 queda exactamente como estaba; sin migraciones de almacenamiento, sin archivos multimedia nuevos ni cambios públicos.


## Atajo de evaluación sin Work: cuatro escuchas de ocho segundos

Se agregó [visor HTML offline](../../../tools/soares/prueba-rapida-parrafos.html) en `tools/soares/prueba-rapida-parrafos.html`. El HTML **no contiene ningún fragmento del capítulo, el MP3 ni el VTT**: solo 70 ID/rangos temporales y cuatro puntos de verificación. Se abre como archivo local en un navegador y lee mediante `input[type=file]` los originales **desde la computadora del responsable**, sin transmitirlos.

1. Desde GitHub, abrir el HTML y elegir **Download raw / Descargar archivo sin procesar**; guardar el archivo `.html` y abrirlo en Chrome/Firefox.
2. Descargar los mismos MP3 y VTT ya identificados en el [estado de la obra](ESTADO_DE_TRABAJO.md) y seleccionar ambos en el visor. Los 593 cues se interpretan solo en el navegador.
3. Presionar «Escuchar 8 segundos» en cuatro marcas: **01:56,175** (primer cambio), **05:18,107** (cue 63 compartido, estimación provisional), **26:11,167** (Francia) y **51:35,333** (último párrafo).
4. Marcar «Coincide», «Se adelanta», «Se atrasa» o «No estoy seguro» en cada una y pulsar «Copiar o descargar resultado». Se exportan solo cuatro respuestas, sin audio ni texto.

Este atajo reduce la **evaluación acústica inicial a 32 segundos de reproducción** (más manejo de archivos e interacción); no pretende revisar 70 transiciones ni certificar G3/G7. **El visor muestra extractos del VTT, no el texto académico completo**. Si los cuatro puntos se perciben aceptables, el paso siguiente es una breve observación de la página candidata real en navegador local, priorizando el límite compartido y la navegación/notas. Solo las anomalías desencadenan revisión extendida.

**Control automatizado:** `npm run test:soares` incluye `test-soares-quickcheck.mjs`, que comprueba sintaxis JS, 70 intervalos, cuatro marcas y ausencia de transferencias de red en el visor. Una prueba de CI aprobada **no es escucha perceptiva**.

**Enlace de archivo en la rama:** https://github.com/manign1984/audiolibros-historia-educacion-fisica/blob/experiment/soares-resaltado-parrafos-vtt/tools/soares/prueba-rapida-parrafos.html

**Recuperación:** si una sesión se corta, continuar desde esta rama experimental y la PR #80. El expediente de Work 3 de la PR #79 sigue intacto. No convertir automáticamente estos cuatro resultados en autorización para publicar materiales del capítulo/traducción/audio/retrato.

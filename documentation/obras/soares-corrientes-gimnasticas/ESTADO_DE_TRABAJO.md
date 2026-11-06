# Estado de trabajo · Soares · Corte Work 2 → Work 3

Actualización: **06-11-2026, Argentina**. **CANDIDATO LOCAL IMPLEMENTADO Y EVALUADO TÉCNICAMENTE. Sin fusionar ni publicar.** Derechos de redistribución y alineación acústica pendientes. Este estado sustituye el relevo de Work 1; no repetir su investigación.

## Única versión de trabajo

- Obra / ID: Carmen Lucia Soares, *Las corrientes gimnásticas europeas y su contenido: una historia de rupturas y permanencias* / `soares-corrientes-gimnasticas`.
- [Rama feature/soares-corrientes-gimnasticas](https://github.com/manign1984/audiolibros-historia-educacion-fisica/tree/feature/soares-corrientes-gimnasticas).
- [PR #79](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/79): abierta en borrador; no fusionar automáticamente.
- Ingreso Work 2: HEAD remoto y local `715bc4cd7e5a52b87776b94366b68ff99e056a6e`; PR abierta/draft comprobada antes de editar.
- Checkpoint de reconstrucción leído de vuelta: `51dedc248d9386302cbdb4ecab01e53c25b0134c`.
- Checkpoint de candidato inicial leído de vuelta: `5b007d82d0ffb7c8c8592b9d773b71cec23ed2dd`.
- Commit con correcciones finales y pruebas: el contenedor de este estado y su historial; se verifica remotamente después de escribirlo, sin inventar un SHA futuro. El cierre añade el SHA de código comprobado.
- [Acta](ACTA_OBRA.md), [índice](README.md), [recuperación y pruebas detalladas](WORK_2_TECNICO.md).

## Entregado y estado de puertas

| Puerta | Resultado real |
| --- | --- |
| G0/G1/G4 | Decisiones del dossier preservadas; fuentes recuperadas con hashes idénticos; cinco bloques 1/1/3/1/1 |
| G2 | Documento candidato reconstruido desde PDF: siete apartados, 70 párrafos, 185 oraciones del cuerpo, 29 notas/llamadas, 47 referencias. Censo sin pérdidas/duplicados; corrección de posición de llamadas y segmentación. Cotejo final en Work 3 |
| G3 | 194 unidades candidatas frente a 593 cues. Correspondencia de tokens y pausas reproducible; 52 unidades con ambos extremos en límites de cue. Todas conservan incertidumbre acústica. `pending`, cero `start/end` activos |
| G5 | Página candidata local funcional, misma rama y misma ruta; componentes compartidos. Incorporación pública de materiales bloqueada por I04 |
| G6 | Pruebas locales específicas, seis regresiones y builds raíz/Pages aprobados. Validación activa de seis obras: 0 errores, 6 avisos preexistentes. Soares tiene registro candidato separado |
| G7 | Inspección inicial real 1363×936; no aceptación integral. Móvil/zoom/altura baja, teclado completo y percepción pendientes |
| G8 | NO EJECUTADA. Sin merge ni despliegue. Catálogo y ruta ordinaria siguen en preparación |

**Arquitectura candidata:** `portable-site/src/soares/{SoaresApp.jsx,soares.css,main.jsx,readerConfig.js,buildReadingDocument.js}`. Encabezado, biografía, entrada de Lectura, créditos y `IntegratedReader` comunes. CSS compartido solo agrega `.soares-page`, sin alterar valores. Nueva clave `soares` de créditos. Sin cambios a claves, documentos, tiempos o registro activo de otras obras.

Contexto conserva: «El gesto se vuelve calculable», «Corrientes distintas, tensiones compartidas», «Otras formas de educar el cuerpo». Identidad «El gesto entre la norma y la expresión». Demeny 1906, dominio público, guardado en assets con hash verificado; retrato auténtico solo local.

**Guardado independiente:** `soares-corrientes-gimnasticas-reader-notes-v1` / `soares-corrientes-gimnasticas-reader-state-v1`. Exportaciones JSON/TXT propias. Las 29 notas académicas no son anotaciones personales; no reciben tiempos ficticios. Jahn 1778–1825 se conserva y la aclaración BnF 1778–1852 aparece separada.

## Materiales y recuperación sin pérdida

| Insumo | Fuente estable | SHA-256 |
| --- | --- | --- |
| PDF de cátedra, 247142 bytes | Drive `1xOnn6jLmUI5wj72noq18J53oh5-nkyOT` | `c81a7c039eb231ef183697761ea6e01fd7e0d4715309aff65ed769b5c8d10b45` |
| MP3 entero, 74721926 bytes | Drive `1KAthUKiHsNqHg8sYIwPqzvJNgbGGbkt-` | `f9c4226ec5794a959d77d6f97b523eabadb0dcdc272bbec9c9e1b04d9a019b37` |
| VTT original, 85242 bytes | Drive `1r8olHRVt-zWY_HjLlz2KYcnOxnPXCZKK` | `ec0beaea889464cd05328c6e73fb80f36f3f8899ae99cc463fcefb82bc1e294f` |
| TXT auxiliar, 54958 bytes | Drive `1ubCfCwnzbGZMSbMDxHUQhfJfcmLOHlFv` | `52f8ef8fe5b41624dc8f51f844d247f0c9f962e47f78ca19e8967b792d4d5dae` |

Enlaces completos en [auditoría](AUDITORIA_DOCUMENTAL.md). Duración del contenedor 3113,377959 s; decodificación/Chrome 3113,331293 s; VTT termina en 3113,305 s. Archivos sin transcodificar ni fragmentar.

**Documento íntegro preservado privadamente:** [Soares_Work2_documento_academico.zip](https://chatgpt.com/library?file_id=libfile_31d84354c2b08191bec4d2f86fb3c122&account_id=personal), **versión 1**. SHA-256 ZIP `f8412679982ac1ea15d20e19909242bfffc378087a3d661c6e692a983041de0b`. Contiene academic.json y document.json corregidos. El documento académico tiene hash `291e552ae0348c77e1f15d60e8df046c7fe633a8942bdc75aa9f5a11f016adc1`; documento lector `7ae2eb3dc0384547ef1d03f4d441e8d1093587e07ed97d6c7929f359db5aa40b`. No depende de archivos temporales de este chat.

**Generadores públicos:** `tools/soares/reconstruct.py`, `audit_reconstruction.py`, `align.py`, `sample_evidence.py`, `prepare-local.mjs`. Consumen los originales verificados; no publican ni descargan voces nuevas. Procedimiento exacto en WORK_2_TECNICO.md. Datos privados a `.local/soares/`, excluidos de Git.

**Ruta y build:** la entrada ordinaria `textos/soares-corrientes-gimnasticas/index.html` conserva la ficha de biblioteca. `SOARES_LOCAL_CANDIDATE=1 npm run build` sustituye la entrada de esa MISMA ruta y materializa el candidato. Comprueba hashes de PDF/MP3/VTT/retrato/documento. **No publicar ese dist mientras I04 siga abierta.** Builds ordinarios excluyen materiales privados. Registro de candidato: `validation/soares-candidate.json`; `validation/works.json` sin cambios porque todavía no hay audio público ni catálogo disponible.

## Pruebas y límites

[Evidencia completa](evidencia/pruebas-work2.json). Ejecutados con código 0: `npm ci`, `test:library`, `test:two-works`, `test:reader-runtime`, `test:hobsbawm`, `test:aisenstein`, `test:marcaida`, `test:scharagrodsky`, `test:work-validation`, `test:soares`, `validate:works`, builds ordinarios y candidatos raíz/Pages con `verify:build` y validación de referencias. Soares comprobado con fuente real local y, aparte, con datos sintéticos sin materiales privados para CI. `git diff --check` aprobado.

La comprobación inicial de navegador observó encabezado 80 px, bloques 856/856/2568/856/856, Contexto 856/856/856, cuatro imágenes cargadas, sin overflow horizontal, lector abierto/cerrado, MP3 sin autoplay, 29 notas y cero resaltado. Fue anterior a la corrección final de llamadas; después se reejecutaron controles de fuente/runtime. No sustituye el cotejo visual/perceptivo final. No se declara escucha humana ni ASR. El análisis completo de pausas con ffmpeg detectó 1053 silencios; no prueba límites semánticos.

## Pendientes concretos de Work 3

1. **Primero:** comprobar HEAD/PR, leer este estado y recuperar checkpoint privado v1/originales; comparar hashes. No repetir investigación, diseño o reconstrucción ya fijados.
2. **I04:** acreditar condiciones de redistribución del texto/traducción/audio y retrato. No constan en el expediente; disponibilidad en Drive no las demuestra. No enviar solicitudes a terceros sin instrucción. Continuar con revisión local si siguen pendientes.
3. **I02/G3:** evaluar límites de oraciones contra voz, empezando por [muestras-work2.json](evidencia/muestras-work2.json), diferencias, encabezados, mitad y final. Los intervalos son envolventes de cues, no alineación forzada. No activar `ready` por la mera existencia del JSON; no adoptar la excepción por párrafos.
4. **G2/G7:** cotejo académico final y revisión integral de las siete pantallas, lector/notas, 320/390/768, portátil bajo, zoom, movimiento reducido, teclado y foco; corregir lo observado y repetir solo pruebas afectadas.
5. Si se resuelven derechos/sincronización/aceptación, preparar materiales públicos con hashes, promover catálogo conscientemente, sustituir entrada HTML y agregar entrada explícita Vite, crear registro activo y probar. **No basta cambiar disponibilidad en catálogo.** Después publicar solo conforme a la autorización de Work 3 y verificar el commit integrado/CI/Pages/ruta pública.

I01 resuelta en documento candidato; I03 implementada; I05 resuelta técnicamente; I06 transporte público no ejecutado. No hay publicaciones que revertir. No tocar notas reales ni materiales anteriores.

## Texto para iniciar Work 3

> Retomemos el Work 3 de Carmen Lucia Soares en `feature/soares-corrientes-gimnasticas`, PR #79. Verificá HEAD y leé `documentation/obras/soares-corrientes-gimnasticas/ESTADO_DE_TRABAJO.md`. El candidato local está implementado y probado; recuperá el checkpoint privado versión 1 y los originales por sus hashes. Priorizá derechos de redistribución, alineación acústica por oración y auditoría visual/perceptiva integral. No repitas Work 1 ni reconstruyas el texto fijado. Mantené bloqueada la publicación y el resaltado hasta resolver sus pendientes; después completá integración y publicación autorizadas para Work 3.

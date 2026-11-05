# Registro interno de validación

`works.json` describe los recorridos con lector, no las fichas futuras. Se contrasta con el catálogo real al ejecutar el validador. No se importa en la interfaz ni decide qué obra está publicada.

Los campos de cada entrada son:

| Campo | Contenido comprobado |
| --- | --- |
| `id` | El mismo ID estable que catálogo y `config.workId` |
| `config.module`, `config.export` | Módulo relativo a `portable-site/` y nombre de export de la configuración real |
| `document.module`, `document.export` | Módulo del documento real; `default` para JSON |
| `page`, `main`, `creditsKey` | Página singular, entrada React y clave de los créditos compartidos |
| `storage.notesKey`, `storage.stateKey` | Claves existentes congeladas, no nombres nuevos para una obra ya publicada |
| `sync.unit`, `sync.status`, `sync.review` | Unidad, estado técnico real y evidencia/limitaciones, sin homologar decisiones pedagógicas |
| `materials[]` | `path`, `kind`, `bytes` y `sha256`; rutas relativas a `portable-site/` |
| `documentSha256` | SHA-256 de `JSON.stringify(document)` del objeto producido por el módulo real; congela texto, IDs y tiempos |
| `audioDuration` | Duración medida del archivo web, con herramienta de medios y evidencia de ingreso |
| `audioSha256` | SHA-256 de los bytes del MP3, o de la concatenación de partes en el orden configurado |
| `equalTextFiles` | Pares que deben permanecer iguales byte a byte; no declarar igualdad cuando se trata de una adaptación |
| `durationDifference` | Solo si existe una diferencia documentada de más de 0.1 s entre contenedor y documento: `seconds` con signo (audio menos documento) y `reason`. Se informa como aviso, no como sincronización certificada |

Tipos de materiales: `pdf`, `audio`, `text`, `subtitles`, `alignment`. Un texto puede ser un TXT fiel o un documento estructurado ya auditado; no se exige inventar una copia TXT. El audio y el texto son obligatorios. Si una obra existente carece de PDF, el control lo informa explícitamente; no prueba por ello que cumpla todas las condiciones de ingreso de una obra nueva. La referencia bibliográfica de la obra se comprueba en catálogo y su entrada de créditos: no se inventa bibliografía interna para llenar una lista vacía.

La huella inicial registra los archivos web presentes en el commit indicado, contrastados con sus inventarios previos cuando están disponibles. Identidad respecto de esa línea base no es prueba independiente de fidelidad académica, voz, derechos ni legibilidad completa del PDF. Para nuevas obras esas verificaciones preceden al registro del hash.

Desde `portable-site/`:

```bash
npm run validate:works
npm run test:work-validation
node scripts/validate-works.mjs --json
node scripts/validate-works.mjs --manifest ../validation/works.json --json
GITHUB_PAGES_BASE=/audiolibros-historia-educacion-fisica/ node scripts/validate-works.mjs --dist dist --json
```

El código de salida es 1 si hay errores y 0 si solo hay avisos o todo pasó. Usar el comando `node` para JSON puro; `npm run` agrega su propio encabezado. Errores de carga/esquema también producen salida no exitosa. `--dist` debe recibir un build ya terminado y el mismo `GITHUB_PAGES_BASE` usado para compilar.

El validador es de lectura: no descarga ni repara archivos, no guarda notas, no cambia IDs ni rellena intervalos y no refresca hashes automáticamente. Puede crear y retirar su caché temporal bajo `node_modules/.cache/`. En una copia limpia, la compilación o `test:marcaida` materializan primero el MP3 de Marcaida usando su preparador existente.

Una diferencia de SHA requiere examinar la causa y su alcance; cambiar el valor esperado para hacer pasar la prueba anula la protección. Si se aprueba un cambio real, conservar evidencia y trazabilidad en la PR antes de actualizar la línea base.

La inspección de recursos cubre literales locales en fuentes y artefactos. En bundles JS, `assets/...` se interpreta como dato relativo a la raíz del sitio, según `resolveSitePath`; `./chunk.js` se resuelve respecto del bundle. Las URLs de CSS se resuelven respecto del CSS. Se omiten esquemas externos, datos embebidos y anclas: los enlaces externos y las expresiones dinámicas requieren revisión separada.

Para incorporar la próxima obra, seguir [la guía operativa](../documentation/GUIA_INCORPORACION_OBRAS.md). Los cinco registros existentes son ejemplos reales y no plantillas de contenido académico.

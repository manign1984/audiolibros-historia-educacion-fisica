# Estado de trabajo · Soares · Corte Work 1 → Work 2

Basado en la plantilla oficial `documentation/plantillas/ESTADO_DE_TRABAJO.md`. Actualización: 06-11-2026 (Argentina). **WORK 1 CONCLUIDO: preparación documentada. Página sin implementar ni publicar.** Norma: Directrices canónicas 2.0 y protocolos de autonomía/producción por etapas.

## Localización de la única versión de trabajo

- **Obra / ID:** Carmen Lucia Soares, *Las corrientes gimnásticas europeas y su contenido: una historia de rupturas y permanencias* / `soares-corrientes-gimnasticas`.
- **Modalidad:** tres Work; siguiente: Work 2.
- **Repositorio:** [manign1984/audiolibros-historia-educacion-fisica](https://github.com/manign1984/audiolibros-historia-educacion-fisica).
- **Rama:** [feature/soares-corrientes-gimnasticas](https://github.com/manign1984/audiolibros-historia-educacion-fisica/tree/feature/soares-corrientes-gimnasticas).
- **PR:** [#79](https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/79), abierta en borrador; sin integrar.
- **Base main:** `8c2bbe4fe3f95da0d79aa835738841fc8ef5fb53`.
- **HEAD del dossier comprobado antes de este checkpoint:** [1990a177e83cc05f75e5a916f1a283d01ab134ee](https://github.com/manign1984/audiolibros-historia-educacion-fisica/commit/1990a177e83cc05f75e5a916f1a283d01ab134ee); acta leída de vuelta.
- **Commit contenedor de este estado:** consultar HEAD/historial del archivo; se genera después de escribirlo y se verifica por lectura remota. El commit anterior identifica el dossier, no se lo presenta como SHA futuro del checkpoint.
- **Acta:** [ACTA_OBRA.md](ACTA_OBRA.md). **Índice completo:** [README.md](README.md).

## Resultado verificable del Work 1

| Puerta | Estado al corte | Evidencia / condición pendiente |
| --- | --- | --- |
| G0 | APROBADO | Capítulo 2006, copia recompuesta de cátedra de 16 páginas, alcance académico/narrado y tres Work definidos |
| G1 | APROBADO para identidad/binarios | Pareja MP3/VTT entregada; acceso, hashes y decodificación completa |
| G2 | PENDIENTE para lector; auditoría cerrada | Estructurar y comprobar documento con 29 notas y bibliografía en Work 2 |
| G3 | PENDIENTE para resaltado por oración | Diagnóstico temporal cerrado; cotejo acústico y asignación de tiempos pendientes |
| G4 | APROBADO como plan | Cinco bloques 1/1/3/1/1; tres funciones didácticas diferenciadas, paleta y fuentes; permisos no se dan por aprobados |
| G5 | Persistencia documental APROBADA; desarrollo NO INICIADO | Rama, commits y dossier; página y assets web reservados al Work 2 |
| G6 | PENDIENTE | Pruebas, regresión y builds de Work 2 |
| G7 | PENDIENTE | Aceptación de Soares en navegador, Work 3 |
| G8 | NO PUBLICAR en esta etapa | Sin integración ni despliegue; publicación reservada a Work 3 |

**Guardado:** auditoría, análisis académico/Contexto, diseño/plan técnico, recursos/fuentes, acta, índice, estado y evidencia JSON/script; nueve archivos dentro de esta carpeta. Aplicación, catálogo y componentes sin modificaciones.

**Controles ejecutados:** ffprobe; decodificación MP3 completa con ffmpeg (código 0, sin errores); extracción y lectura completa del PDF; render de su página inicial; parser de cues; colación A/B/VTT y PDF/TXT; huellas de originales y TXT idénticos; JSON válido, sintaxis Python, enlaces locales y diff de documentación. No se ejecutaron builds ni pruebas de una página inexistente.

**Navegador/escucha:** referencias publicadas de Scharagrodsky y Marcaida observadas con DOM/capturas a 1707×772; detalles en DISENO_Y_PLAN_TECNICO.md. No son aceptación de Soares. No hubo escucha humana adicional ni ASR.

## Materiales fijados

La entrega de Manuel en este Work identifica la pareja editorial autorizada. No volver a buscar voces históricas.

| Recurso | Drive ID | Bytes / SHA-256 |
| --- | --- | --- |
| PDF | `1xOnn6jLmUI5wj72noq18J53oh5-nkyOT` | 247142 / `c81a7c039eb231ef183697761ea6e01fd7e0d4715309aff65ed769b5c8d10b45` |
| MP3 | `1KAthUKiHsNqHg8sYIwPqzvJNgbGGbkt-` | 74721926 / `f9c4226ec5794a959d77d6f97b523eabadb0dcdc272bbec9c9e1b04d9a019b37` |
| VTT | `1r8olHRVt-zWY_HjLlz2KYcnOxnPXCZKK` | 85242 / `ec0beaea889464cd05328c6e73fb80f36f3f8899ae99cc463fcefb82bc1e294f` |
| TXT 1 / 2 | `1ubCfCwnzbGZMSbMDxHUQhfJfcmLOHlFv` / `1kRRm8XiSHtO4chZ9sbAmvchgXTDHV7WX` | 54958 cada uno / `52f8ef8fe5b41624dc8f51f844d247f0c9f962e47f78ca19e8967b792d4d5dae` |

Enlaces, editables A/B y diferencias: [AUDITORIA_DOCUMENTAL.md](AUDITORIA_DOCUMENTAL.md) y [evidencia/auditoria-insumos.json](evidencia/auditoria-insumos.json). MP3 **3113,377959 s**; VTT **593 cues**, último final **3113,305 s**; diferencia **0,072959 s**. Esos cues no equivalen a oraciones verificadas.

Originales en Drive; imágenes en fuentes institucionales con referencias/huellas guardadas. No se transfirieron binarios a assets web. Descargas locales, PNG y textos temporales son reproducibles; no son el soporte exclusivo del trabajo. No usar URLs firmadas efímeras como origen.

## Incidencias y precauciones

- **I01/I02:** guion sin notas/bibliografía y cues que parten oraciones; restaurar aparato y comprobar acústica, sin tiempos ficticios.
- **I03:** fecha Jahn 1778–1825 en fuente; BnF: 1778–1852. Conservar fuente con nota editorial diferenciada; no cambiar audio.
- **I04:** documentar condiciones de redistribución del capítulo/audio y del retrato antes de publicar; la imagen Demeny sí está declarada dominio público.
- **I05:** CSS de Lectura enumera raíces; extensión mínima para Soares con regresión de todas las obras.
- **I06:** MP3 71,26 MiB; estrategia de archivo entero preferida y alternativas en plan técnico. Transporte no probado.
- **I07 resuelta:** biografía en pasado tras información institucional de 2026.
- **No repetir:** inventario y búsquedas concluidas, elección de voz, investigación o plan de tres pantallas, salvo cambio/contradicción.
- **No sobrescribir:** originales ni notas, claves, hashes o tiempos de otras obras. No adoptar la excepción por párrafos de Marcaida.
- **No certificar:** permisos, acústica, dispositivos o publicación todavía pendientes.

## Instrucción concreta para reanudar

**Work 2. Primera acción:** recuperar este estado desde GitHub, comprobar HEAD y PR #79, verificar los archivos del dossier y leer el acta. Prevalece lo remoto sobre la memoria del chat.

1. Recuperar PDF/TXT/MP3/VTT y comprobar hashes. Si coinciden, no repetir inventario completo.
2. Construir documento fiel: siete apartados, 29 notas enlazadas, citas y bibliografía. Registrar normalizaciones y separar narración.
3. Comprobar inicio, mitad, encabezados, final y diferencias contra audio. Alinear oraciones con evidencia; aparato no narrado sin salto ficticio.
4. Resolver condiciones de uso aplicables, preparar assets y ejecutar plan 1/1/3/1/1 con componentes compartidos.
5. Registrar contrato, claves exclusivas, catálogo y entrada de build; probar Soares, regresión y raíz/Pages.
6. Guardar candidato y pruebas en rama; actualizar estado. **No publicar en Work 2; G7/G8 quedan para Work 3.**

**Cierre de Work 2:** implementación recuperable, pruebas técnicas y límites documentados. Comandos y riesgos: [DISENO_Y_PLAN_TECNICO.md](DISENO_Y_PLAN_TECNICO.md) y protocolo de autonomía.

## Historial de checkpoints

| Fecha | Hito | Commit comprobado |
| --- | --- | --- |
| 06-11-2026 | Inventario, estado leído de vuelta | `bcd37ca5759ea936344bd26ba6cd31a341d0bf5a` |
| 06-11-2026 | G1/auditoría, estado leído de vuelta | `9797f23fcfa7cf5c91f0fdff1989f4265f8dffbd` |
| 06-11-2026 | Dossier/G4, acta leída; PR borrador #79 | `1990a177e83cc05f75e5a916f1a283d01ab134ee` |
| 06-11-2026 | Corte Work 1→2 | Commit contenedor de este estado, consultable en historial de la rama |

### Texto breve de relevo

> Continuemos el Work 2 de Carmen Lucia Soares. Recuperá `documentation/obras/soares-corrientes-gimnasticas/ESTADO_DE_TRABAJO.md` en `feature/soares-corrientes-gimnasticas` y verificá HEAD y PR #79. El Work 1 contiene auditoría, investigación, tres pantallas de Contexto y diseño. Retomá el texto fiel y el cotejo acústico de la pareja fijada; luego implementá y probá con componentes compartidos. No repitas tareas cerradas ni publiques en Work 2. Actualizá el checkpoint al finalizar.

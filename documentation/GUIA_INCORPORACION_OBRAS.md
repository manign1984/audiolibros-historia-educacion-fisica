# Guía operativa para la próxima obra

Esta guía aplica las Directrices canónicas 2.0 sin sustituirlas. No genera contenido, diseño ni sincronización. Los controles técnicos se ejecutan sobre una obra cuyos materiales se verificaron previamente.

**Modalidad adoptada para nuevas páginas (06/11/2026):** realizar el proceso en [2 o 3 Work con cortes planificados](PRODUCCION_POR_ETAPAS_2026-11-06.md), según complejidad. En Work 1 crear la [acta por obra](plantillas/ACTA_OBRA_AUTONOMIA_V1.md) y un [ESTADO_DE_TRABAJO.md](plantillas/ESTADO_DE_TRABAJO.md) versionado en su rama. En cada corte verificar y registrar commit, puertas cerradas, pruebas, pendientes y primera acción del Work siguiente. No dependa exclusivamente del chat: al reanudar se inspecciona el estado real en GitHub.

**Acuerdo de materiales ElevenLabs:** el responsable del proyecto confirma personalmente el **MP3 y VTT/SRT definitivos** emitidos por él antes de la nueva página. La IA acepta esa elección editorial, revisa integridad y sincronización técnica y solo solicita consulta si hay una discrepancia concreta; no busca versiones históricas por defecto.

## 1. Reunir y comprobar los insumos

Identificar la edición y el alcance exactos: obra, capítulo o selección. Abrir el PDF y/o texto fiel; verificar legibilidad, orden, notas y bibliografía. Comprobar el audio completo con reproducción de comienzo, mitad, transiciones y final; medir su duración. Inspeccionar SRT/VTT o alineación: cantidad y orden, correspondencia con el texto y omisiones. Registrar procedencia de biografía, retratos, imágenes y derechos conocidos.

Calcular tamaño y SHA-256 **después** de esa inspección, para el archivo que efectivamente se servirá. Si existe una copia web derivada, conservar su relación con el original; no sustituir un hash por otro. Si falta o falla un insumo, registrar la incidencia según SR-05 y detener la publicación como lectura disponible. No inventar tiempos, fuentes, permisos ni un PDF a partir de subtítulos.

## 2. Fijar la ficha y las decisiones pedagógicas

Registrar título, autoría, referencia bibliográfica, edición, alcance y duración, fuentes, tipo de Contexto y su cantidad justificada de pantallas. Plan: Inicio 1; Autor 1; Contexto 1/2/3; Lectura 1; Créditos 1, con crecimiento accesible cuando corresponde.

La unidad de sincronización y anotación se decide conforme a la norma y a la autorización del proyecto. No copiar automáticamente la excepción por párrafos de Marcaida ni modificar la de otra obra. Distinguir una alineación existente de una comprobada auditivamente. No deducir `ready` de la mera presencia de VTT.

## 3. Crear las piezas singulares y conectar las comunes

| Pieza | Acción |
| --- | --- |
| `textos/<id>/index.html` | Entrada física y metadatos correctos; script de su `main.jsx` |
| `src/<obra>/` | Página, identidad visual, configuración y documento fiel con IDs estables |
| Documento | `title`, `author`, `duration`, apartados, párrafos y oraciones; intervalos solo con fuente verificable; conservar pasajes sin audio explícitamente |
| Configuración | `workId`, archivos, exportaciones, `storage` y `sync`; seguir el contrato actual del motor |
| Estado | Dos claves nuevas exclusivas; nunca reutilizar claves históricas ni la clave de la lista general |
| Compartidos | `JourneyHeader`, `JourneyBlockLabel`, `CanonicalReadingEntry`, `JourneyCredits` e `IntegratedReader` existentes |
| Créditos | Añadir datos verificados en `creditsContent`; CAN-01 deja el proceso en documentación interna |
| Materiales | Nombres estables y recursos accesibles en `public/assets/`; registrar tamaño, hash y original |

Pasar explícitamente el launcher canónico al lector. No duplicar `IntegratedReader`, recrear Lectura/Créditos ni adoptar el iframe de medidas de Pineau como requisito nuevo. Si un constructor existente no responde a la fuente recibida, crear un adaptador pequeño por obra manteniendo el mismo contrato; no modificar a ciegas el constructor de otra.

## 4. Incorporar catálogo y build

Agregar la referencia revisada en el catálogo sin duplicar su ID en `publishedWorks` y `plannedWorks`. La duración y la clave de progreso deben coincidir con el lector. Mantener una ficha `preparation` si no hay una lectura habilitada; un estado `review` requiere una decisión expresa de preparación/publicación parcial, no una excepción automática a SR-05.

Agregar explícitamente la ruta al build de Vite para un recorrido `available`. La configuración vigente incluye también fichas y `review` por filtro de catálogo: **cambiar solo `review` a `available` puede quitar una ruta que no tenga entrada explícita**. Comprobar siempre `dist/textos/<id>/index.html` y sus enlaces directos bajo la base real de Pages.

## 5. Registrar el contrato técnico

Añadir una entrada a `validation/works.json`, tomando la estructura de las existentes y cambiando sus datos por los comprobados. Consultar [el esquema operativo](../validation/README.md).

Los descriptores apuntan a los módulos reales; el cargador resuelve JSON y `?raw` con Vite. Para calcular la huella del documento se puede usar `loadWorkContracts` y `digest`, exportados por las herramientas internas. Verificar el objeto cargado antes de fijar `documentSha256`. No crear otra transcripción ni modificar los hashes de obras anteriores.

Registrar cada PDF, texto, audio/parte y alineación principal con ruta, tipo, bytes y SHA-256; para partes, calcular además la huella de su concatenación en el orden configurado. `audioDuration` procede del medio real. Una diferencia preexistente documentada se informa y evalúa; no se subsana cambiando silenciosamente la duración del catálogo o los tiempos.

## 6. Ejecutar controles y regresión

Desde `portable-site/`, en una rama nueva:

```bash
npm ci
npm run test:work-validation
npm run test:library
npm run test:two-works
npm run test:hobsbawm
npm run test:aisenstein
npm run test:marcaida
npm run test:reader-runtime
npm run validate:works
npm run build
npm run verify:build
npm run validate:works -- --dist dist
GITHUB_PAGES_BASE=/audiolibros-historia-educacion-fisica/ npm run build
GITHUB_PAGES_BASE=/audiolibros-historia-educacion-fisica/ npm run verify:build
GITHUB_PAGES_BASE=/audiolibros-historia-educacion-fisica/ npm run validate:works -- --dist dist
```

Extender la prueba de interacción para montar el documento y la configuración nuevos, probar reproducción/seguimiento, selección, anotaciones, exportación, recuperación e independencia del guardado. El registro transversal detecta contratos rotos, pero no añade automáticamente esa prueba de interacción para una sexta obra.

Algunas pruebas históricas fijan cantidades y datos concretos. Cambiar sus expectativas solo cuando la nueva incorporación lo justifica; no suprimir controles para hacerlas pasar. No instalar un sistema adicional de páginas ni un backend para agregar una obra.

## 7. Aceptación visual y auditiva

Revisar la página real con fuentes cargadas: cinco bloques, pantallas previstas, ausencia de recortes y barra vertical general. Comprobar 1363 × 936 CSS px de referencia, ventana baja y anchos 320/390/768, teclado, foco, contraste y movimiento reducido. Un emulador de tamaño no certifica gestos, teclado virtual ni navegadores de dispositivos físicos.

Abrir el lector y contrastar la voz en inicio, apartados, puntos dudosos y final. Distinguir navegación temporal correcta de coincidencia auditiva. Probar un pasaje largo, seguimiento activado/desactivado, notas con datos ficticios en entorno aislado, exportaciones reales y restauración del progreso. No usar ni editar notas personales de estudiantes para probar.

## 8. Publicación y cierre

Abrir una PR con archivos, fuentes, excepciones, pruebas y evidencias. Esperar los controles y revisar que los cambios compartidos no afecten a obras anteriores. Integrar únicamente dentro de la autorización del proyecto y del resultado de la revisión.

El workflow de Pages ahora vuelve a validar contratos, materiales, rutas y referencias antes de subir el artefacto; CI sigue incluyendo además las regresiones históricas y de interacción. Confirmar el despliegue del commit integrado y abrir catálogo y URL directa de la obra. Registrar limitaciones aún pendientes; no convertir un resultado técnico aprobado en una declaración de fidelidad, derechos o sincronización auditiva certificada.

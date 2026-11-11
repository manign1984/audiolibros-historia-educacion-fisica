# BEYOND THE STARS · Puerta de entrada al repositorio

**Norma general única:** [Directrices canónicas 3.0 · Google Docs](https://docs.google.com/document/d/1z0HqT7WR1A4u-RZRaFRINm9TWH5XWX8Lc_Vdj5q0aKM/edit). Este archivo NO las reproduce ni crea otras reglas.

**Estado del proyecto y próxima acción única:** [PRODUCCION_ACTIVA.md](documentation/PRODUCCION_ACTIVA.md).

**Mapa de arquitectura y relevo técnico del lector (vigente):** [MAPA_OPERATIVO_LECTOR_INTEGRADO.md](documentation/MAPA_OPERATIVO_LECTOR_INTEGRADO.md). Consultarlo antes de releer un motor compartido.

## Antes de comenzar
1. Leer las Directrices 3.0 y el registro de producción activa; contrastar la rama, PR y commit reales.
2. Usar el mapa operativo del lector para localizar directamente el contrato y la integración correspondiente; contrastar solo los archivos técnicos que hayan cambiado o que se vayan a modificar. No redescubrir el motor ni el despliegue desde cero.
3. Realizar la acción pendiente. No repetir investigaciones acústicas, pruebas superadas, expedientes de 2–3 Work ni comprobaciones jurídicas rutinarias.
4. Guardar un commit verificable por hito importante y actualizar el estado operativo.

## Arquitectura y seguridad técnica
- Código ejecutable: `portable-site/`. Catálogo: `portable-site/src/biblioteca/`.
- Pruebas: `portable-site/package.json`, `.github/workflows/ci.yml`; publicación: `.github/workflows/pages.yml`.
- Fidelidad y antecedentes de modificaciones: `documentation/MATRIZ_DE_FIDELIDAD.md`.
- Antes de modificar código o materiales originales, comprobar el alcance solicitado y preservar IDs, notas, progreso, rutas y funciones de otras obras. Si se toca un componente compartido, ejecutar regresiones pertinentes.
- No versionar `node_modules/`, `portable-site/dist/`, secretos, credenciales ni materiales privados.
- `main` activa automáticamente GitHub Pages; el despliegue técnico ordinario está incluido en el flujo de incorporación autorizado, pero no debe confundirse con el cierre de una obra ni la presentación institucional.

## Observaciones sobre derechos
Único registro: [OBSERVACIONES_DERECHOS_PENDIENTES.md](documentation/OBSERVACIONES_DERECHOS_PENDIENTES.md). Anotar únicamente una cuestión que aparezca durante el trabajo normal, sin investigar ni abrir nuevos expedientes. Respetar las prohibiciones expresas conocidas.

## Documentación anterior
Las guías de producción en 2–3 Work, las puertas G0–G8 y las investigaciones acústicas de oficio son históricas. No prevalecen sobre las Directrices 3.0. Archivo de la versión 2.3: https://docs.google.com/document/d/1FFha4jpvaqNbtqqc2OF6nIN0dKkQ5WP7abnYWgZtzTs/edit.

# Migración técnica completa — La reforma educativa Fresco–Noble

Entrega preparada a partir del estado publicado y respaldado antes de la auditoría.

## Identificación del estado preservado

- Identificador: `FN-PREMIG-20260823-SITEV57-7882327`
- Site informado por la plataforma: versión `57`
- Commit fuente: `7882327b5bf619ba81335d136e9eddc96cf894c9`
- Árbol Git: `dbb99c32a4b0bb8aaf46a959ef46cbb2ab9807e2`
- Estado del repositorio: limpio, sin modificaciones locales

El Site publicado no fue modificado, guardado como una nueva versión ni desplegado durante este trabajo.

## Contenido de la entrega

- `portable-site/`: código ejecutable fuera de ChatGPT Sites.
- `documentation/AUDITORIA_TECNICA_EXHAUSTIVA.md`: arquitectura, estructura, diseño, comportamiento, recursos y riesgos.
- `documentation/MATRIZ_DE_FIDELIDAD.md`: clasificación literal/reconstruido y evidencia de cada componente.
- `documentation/PRUEBAS_Y_RESULTADOS.md`: pruebas funcionales, responsive, persistencia y compilación.
- `documentation/GUIA_DE_MIGRACION_Y_DESPLIEGUE.md`: ejecución, compilación, despliegue y continuidad de datos.
- `data/`: inventarios, estructura exacta y sincronización audio–texto.
- `evidence/`: captura de referencia del estado publicado.
- `tools/`: generador reproducible de inventarios y extracciones.

## Resultado principal

La interfaz, el contenido, los estilos, el carrusel, las actividades, el lector, la sincronización audio–texto y los recursos locales se recuperaron literalmente del commit publicado. La migración reemplaza únicamente la envoltura específica de Sites/Vinext/Cloudflare por una compilación estática de React y Vite.

El archivo `data/reading-sync_reconstructed-from-site.srt` está marcado como reconstruido: conserva las 201 unidades y los tiempos exactos que consume el Site, pero no pretende ser el SRT original de ElevenLabs. La representación literal extraída está en `data/reading-sync_exact.json`.

## Ejecutar el proyecto

La aplicación está en `portable-site/` y requiere Node.js `20.19+` o `22.12+`.

```bash
cd portable-site
npm ci
npm run dev
```

Para generar la versión estática:

```bash
cd portable-site
npm ci
npm run build
```

La salida queda en `portable-site/dist/`. No se versionan `node_modules/` ni `dist/`.

## Estado de publicación

Este repositorio conserva el código y la documentación de la migración. No activa GitHub Pages ni realiza despliegues automáticos. La aplicación mantiene rutas absolutas `/assets/...`; una futura publicación fiel debe ubicarse en la raíz de un dominio o subdominio.

## Desarrollo futuro

Leé `AGENTS.md` antes de modificar la aplicación. Los archivos clasificados como literales en `documentation/MATRIZ_DE_FIDELIDAD.md` no deben alterarse sin una solicitud explícita y una nueva verificación de fidelidad.

No se incorpora una licencia porque el estado recuperado no contenía una licencia explícita.

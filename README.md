# Biblioteca de Historia de la Educación y de la Educación Física

Este repositorio contiene una biblioteca académica estática para leer textos y escuchar sus audiolibros. Reúne dos obras: Iván Pablo Orbuch sobre educación corporal en el primer peronismo y Pablo Pineau sobre la Reforma Fresco–Noble.

## Arquitectura pública incorporada por esta etapa

- Biblioteca y catálogo: `/audiolibros-historia-educacion-fisica/`.
- Orbuch: `/audiolibros-historia-educacion-fisica/textos/orbuch-educar-al-cuerpo/`.
- Pineau: `/audiolibros-historia-educacion-fisica/textos/pineau-fresco-noble/`.
- Catálogo manual, búsqueda local y orden bibliográfico: `portable-site/src/biblioteca/`.
- Documentación de esta etapa: `documentation/BIBLIOTECA_ACADEMICA.md`.
- Transición del nombre y de la URL: `documentation/RENOMBRADO_REPOSITORIO.md`.

La compilación es estática y multipágina. No utiliza backend, base de datos, autenticación ni CMS. Las obras conservan identidades editoriales propias y comparten un único motor de lectura parametrizado.

## Antecedente: migración técnica de Fresco–Noble

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
- `documentation/INTEGRACION_ORBUCH_SEGUNDA_OBRA.md`: recuperación y decisiones de la segunda obra.
- `documentation/LECTOR_COMPARTIDO.md`: contrato operativo del motor común.
- `documentation/PRUEBAS_ORBUCH_SEGUNDA_OBRA.md`: verificaciones y límites conocidos.
- `data/`: inventarios, estructura exacta y sincronización audio–texto.
- `evidence/`: captura de referencia del estado publicado.
- `tools/`: generador reproducible de inventarios y extracciones.

## Resultado de la migración inicial

En la migración inicial, la interfaz, el contenido, los estilos, el carrusel, las actividades, el lector, la sincronización audio–texto y los recursos locales se recuperaron literalmente del commit publicado. El historial Git conserva esa referencia. Etapas posteriores retiraron las actividades por decisión editorial, incorporaron la biblioteca y parametrizaron el lector para sumar Orbuch sin alterar el documento temporizado de Pineau.

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

La versión pública se despliega automáticamente desde `main` mediante GitHub Pages:

<https://manign1984.github.io/audiolibros-historia-educacion-fisica/>

La compilación de Pages obtiene automáticamente el subdirectorio público desde el nombre del repositorio. `vite.config.js` aplica ese valor durante el build y conserva intactos los archivos recuperados literalmente.

## Desarrollo futuro

Leé `AGENTS.md` antes de modificar la aplicación. Los archivos clasificados como literales en `documentation/MATRIZ_DE_FIDELIDAD.md` no deben alterarse sin una solicitud explícita y una nueva verificación de fidelidad.

No se incorpora una licencia porque el estado recuperado no contenía una licencia explícita.

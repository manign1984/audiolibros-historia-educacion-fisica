# Pruebas de Orbuch como segunda obra

## Referencias

- Ramas: `feat/orbuch-segunda-obra` y corrección `fix/orbuch-fidelidad-visual`.
- SHA de `main` al iniciar: `aad25a75c159e7a65e78c799f4877d6ec7175bd1`.
- Fecha: 24/08/2026.

## Instalación y comandos

Se intentó `npm ci` con el lockfile vigente. El entorno local no puede acceder al registro npm y su caché disponible está incompleto, por lo que la instalación no finalizó. Para continuar las verificaciones se restauró una copia local de `node_modules` resuelta con el mismo `package-lock.json` y las versiones fijadas. La ejecución reproducible de `npm ci` queda a cargo del runner limpio de CI de GitHub.

Con esas dependencias exactas se ejecutaron correctamente:

```bash
npm run test:library
npm run test:two-works
npm run build
npm run verify:build
GITHUB_PAGES_BASE=/audiolibros-historia-educacion-fisica/ npm run build
GITHUB_PAGES_BASE=/audiolibros-historia-educacion-fisica/ npm run verify:build
```

## Comparación visual que originó la corrección

Se inspeccionaron directamente, en el mismo navegador y con el mismo ancho de escritorio, la URL pública de GitHub Pages y el Site `educar-el-cuerpo.man-ign.chatgpt.site`. La primera versión de GitHub conservaba el mural, pero presentaba un título sobredimensionado, un velo mucho más oscuro y un primer pliegue sin pregunta-problema, introducción, expedientes ni operaciones de lectura. El encabezado tampoco conservaba el contador y la barra central del recorrido. En las secciones interiores se había perdido la alternancia de papeles coloreados, marcos documentales y cronología vertical.

La corrección recupera esos contratos visuales con CSS propio y componentes semánticos, sin copiar la lógica evaluativa del Site. Las pruebas de contrato exigen ahora siete `id` de sección, las piezas editoriales recuperadas, la altura y composición del hero, los expedientes, las tres operaciones, los breakpoints y la ausencia de actividades excluidas.

## Resultado automatizado

| Área | Comprobación | Resultado |
|---|---|---|
| Catálogo | Dos obras; orden O → P; APA 7; búsquedas Orbuch/cuerpo/Pineau/reforma; rutas y caso vacío | Correcto |
| Motor común | Un solo `IntegratedReader.jsx`; ambos imports y ambos bundles apuntan al mismo chunk `reader-*` | Correcto |
| Aislamiento | Claves distintas para notas/progreso y recursos configurados por obra | Correcto |
| Orbuch | Siete estaciones informativas, documentos, imágenes, créditos, texto accesible y recursos existentes | Correcto tras la corrección de fidelidad visual |
| Audio | MP3 real de 40.174.404 bytes; SHA y duración 1673.900408 s verificados con `ffprobe` | Correcto |
| Sincronización | Cero campos `start`/`end` en el documento Orbuch; cero SRT/VTT publicado; estado `pending` | Correcto y pendiente por fuente |
| Pineau | SHA de `readingDocument.js` y MP3 sin cambios; estado `ready`; controles compartidos presentes | Correcto |
| Exportación | Metadatos por obra; TXT/JSON; posición real de audio diferenciada en Orbuch | Correcto por contrato |
| Responsive | Breakpoints de obra 1040/780/520 y lector 1220/900/640; ancho fluido, navegación móvil y `overflow` controlado | Correcto por análisis estático |
| Accesibilidad | HTML semántico, `alt`, labels, foco visible, teclado, `aria-current`, estados y movimiento reducido | Correcto por análisis estático |
| Build raíz | Biblioteca y dos `index.html` físicos; assets y chunk común | Correcto |
| Build Pages | Base `/audiolibros-historia-educacion-fisica/`, tres entradas y assets | Correcto |

`pdfinfo` confirmó 14 páginas para el artículo, 14 para el cuadernillo de 1949 y 17 para el de 1950. Los hashes completos están en `data/orbuch-assets-inventory.csv`.

## Regresión de Pineau

Antes de la refactorización se registró una línea base correcta de pruebas y builds. Después del cambio se conservaron sin modificaciones el documento sincronizado, sus 201 intervalos, el audio, el PDF, `reader.css`, la página y los assets de Pineau. El diff de `App.jsx` se limita a pasar explícitamente el documento y la configuración al lector común. Las verificaciones posteriores confirman rutas, selectores, recursos, claves históricas, texto de los controles y bundle compartido.

No se presenta como realizada una prueba manual posrefactor de play/pausa, seek, notas o Web Share: el navegador remoto bloqueó la URL local con `ERR_BLOCKED_BY_CLIENT` y se respetó esa restricción.

## Responsive e interacción manual pendiente

Los anchos de referencia 360, 390, 768, 1024 y 1366 px quedan cubiertos por el diseño base y sus breakpoints, y el código evita anchos rígidos, deformación de miniaturas y navegación móvil oculta. Sin embargo, la inspección visual interactiva en esos cinco viewports y la prueba manual completa de audio, notas, persistencia, exportación y compartir deben realizarse en el preview del PR o en un entorno con navegador habilitado.

La sincronización fina de Orbuch seguirá pendiente aun después de esa revisión hasta recuperar el SRT/VTT correspondiente al MP3 definitivo.

## CI

El estado del workflow remoto se comprobará en la Pull Request. Ese runner debe validar `npm ci`, los dos scripts de pruebas y ambos builds desde cero.

# BEYOND THE STARS · Mapa operativo del lector integrado

**Referencia técnica breve para continuar entre chats convencionales.** Actualizado: 11/11/2026.

Este archivo **no contiene nuevas Directrices**. Fuente editorial/normativa: [Directrices canónicas 3.0](https://docs.google.com/document/d/1z0HqT7WR1A4u-RZRaFRINm9TWH5XWX8Lc_Vdj5q0aKM/edit). Fuente del trabajo pendiente: [PRODUCCION_ACTIVA.md](PRODUCCION_ACTIVA.md). Fuente de la implementación real: el código de la rama vigente. El [LECTOR_COMPARTIDO.md](LECTOR_COMPARTIDO.md) anterior es histórico y no se usa para decidir modalidades actuales.

## 1. Arquitectura existente: se reutiliza, no se descubre nuevamente

| Responsabilidad | Fuente actual |
| --- | --- |
| Pantalla 04 · Lectura (acceso visual canónico) | `portable-site/src/shared/CanonicalReadingEntry.jsx` y `canonical-reading.css` |
| Motor modal compartido (audio, navegación, notas, exportación, progreso) | `portable-site/src/IntegratedReader.jsx` y `portable-site/src/reader.css` |
| Lector sin audio mientras se prepara una obra | `portable-site/src/shared/TextOnlyReader.jsx` |
| Modelo académico por obra | `portable-site/src/<obra>/*ReadingDocument*` o adaptador específico; no reutilizar un parser de otra obra sin comprobar su formato |
| Configuración de obra y almacenamiento | `portable-site/src/<obra>/readerConfig.js` o `portable-site/src/readerConfigs.js` |
| Ejemplos de integración | `portable-site/src/orbuch/OrbuchApp.jsx`, `portable-site/src/melano/MelanoApp.jsx` |
| Portada/navegación/créditos | `portable-site/src/shared/JourneyHeader.jsx`, `JourneyBlockLabel.jsx`, `JourneyCredits.jsx` |
| Build y publicación | `portable-site/package.json`, `.github/workflows/ci.yml`, `.github/workflows/pages.yml` |
| Reglas técnicas de integridad | `validation/works.json`, `portable-site/scripts/validate-works.mjs` |

El punto de integración canónico de una obra **con audio** es:
```jsx
<IntegratedReader
  readingDocument={documentoDeLaObra}
  config={configuracionDeLaObra}
  Launcher={CanonicalReadingEntry}
/>
```
Se conserva el `<section id="lectura">` de la página y la geometría de los componentes compartidos. La entrada visual se configura con autoría, título, sinopsis y colores; no se fabrica otro reproductor.

## 2. Contratos útiles antes de tocar código

- `readingDocument`: título, subtítulo, autoría, duración, `frontMatter`, `sections`, `endnotes` y bibliografía cuando existe. En cada sección hay párrafos con IDs estables y oraciones con IDs y texto. Las notas académicas se distinguen de las anotaciones personales.
- `config`: `workId`, identidad, `audiobookUrl` o `audiobookParts`, vínculos externos cuando existen, `storage.notesKey` y `storage.stateKey` **únicos y estables**, `export`, `readingEntry` y `sync`. Las partes MP3 se descargan y reagrupan como `Blob` por el motor; no volver a implementar esa función.
- Si hay SRT/VTT recibido, sus tiempos pueden utilizarse para el **seguimiento del texto**. Melano utiliza `buildMelanoReadingDocument.js` para derivar 61 intervalos aproximados de 489 cues SRT, con `sync.unit: 'paragraph'` y `sync.status: 'paragraph-preview'`. No implica prueba perceptiva de correspondencia acústica.
- **Diferencia funcional importante:** incorporar un archivo SRT para tiempos/seguimiento **no habilita por sí solo una interfaz adicional de subtítulos visibles**. Esa franja fue incorporada excepcionalmente en Melano y retirada para recuperar el lector canónico; el archivo de origen y los tiempos se preservan. Si en el futuro se desea un panel de subtítulos, es una **decisión de producto transversal** por acordar, no una opción local que se inaugura automáticamente.
- La lectura textual previa puede tener notas y progreso guardados. Antes de pasar al lector audiovisual, revisar migración preservando los datos previos; nunca sobrescribir las claves de otras obras.

## 3. Circuito mínimo para una página nueva

1. **Recuperar estado, no investigar todo otra vez:** abrir `AGENTS.md`, Directrices 3.0, `PRODUCCION_ACTIVA.md` y este mapa; confirmar con GitHub la rama, PR y último commit. Consultar únicamente archivos de la obra y el pequeño tramo del componente compartido que se usa.
2. **Implementar la parte singular:** preparar lectura académica fiel, contexto didáctico y recursos propios. Conectar las piezas comunes mediante las props existentes, sin rediseñar Lectura ni cambiar el motor para una sola obra. Los SRT/VTT son insumos temporales; no agregan funcionalidades visuales no solicitadas.
3. **Comprobar lo modificado:** test específico de la obra (por ejemplo `npm run test:melano`), `npm run test:reader-runtime` si se tocó el motor compartido, `npm run validate:works`, `npm run build` y CI de PR. El workflow de Pages se ejecuta con `push` a `main`; las reglas actuales exigen incorporar cambios mediante PR. Para la ruta real importan el `BASE_URL` y la validación de recursos del build de Pages.
4. **Distinguir evidencias:** CI y despliegue exitosos acreditan integración técnica; no demuestran calidad perceptiva de audio ni comportamiento visual en un dispositivo real. La escucha/observación mínima debe identificarse como tal, sin auditorías acústicas nuevas de oficio.
5. **Cerrar con relevo corto:** actualizar `PRODUCCION_ACTIVA.md` con estado interno, rama/PR/commit, enlaces de recursos, pruebas efectuadas y **una única acción siguiente**. Evitar actas extensas o recuperaciones desde el texto de chats anteriores.

## 4. Ficha de relevo entre chats (cinco datos, no otro expediente)

```text
Obra y estado (EN DESARROLLO / COMPLETA):
Rama, PR y último commit verificados:
Recursos y componentes incorporados:
Pruebas realizadas y limitaciones reales:
Próxima acción única:
```

**Principio de continuidad:** conocer el contrato estable de antemano; comprobar brevemente el estado cambiante de GitHub antes de editar. La comprobación no es volver a descubrir cómo funciona el proyecto.

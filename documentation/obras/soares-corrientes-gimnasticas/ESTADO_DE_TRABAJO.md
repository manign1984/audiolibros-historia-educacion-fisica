## Corrección del despliegue de audio · Etapa 1/2 · 07-11-2026

**Incidencia recuperada:** el commit `90c1ffcf` introdujo correctamente los 12 fragmentos del audio y la configuración `audiobookParts` de Soares, pero **GitHub Pages no los publicó**: su job de validación falló por conservar en `validation/works.json` la declaración antigua de audio remoto (`externalAudioUrl`). El CI falló en `test:library` por contar seis recorridos cuando el catálogo ya tenía siete lecturas accesibles o en revisión. No debe interpretarse que la existencia de fragmentos en `main` implique su despliegue.

**Solución Etapa 1:** actualizar los contratos en `validation/works.json` para registrar los 12 fragmentos MP3 de 1.572.864 bytes (el último 1.379.316 bytes), sus SHA-256 individuales, el SHA-256 de concatenación `fd5f7e36249373334f19127212121ebc9df44ebbb56686d2d94c2952579c56d5`, la duración de la copia web `3113.4` s y quitar exclusivamente la URL remota del contrato de publicación. El enlace de Drive se conserva en el lector solo como recurso externo opcional. Actualizar `test-library` al total real de siete lecturas, sin alterar el resto del catálogo ni las unidades de lectura.

**Etapa 2:** entregar el despliegue de GitHub Pages que contenga las 12 partes del mismo origen, abrir la URL real del audio por fragmentos y confirmar que el lector se ofrece con las fuentes del repositorio. Si el responsable mantiene la decisión «sin pruebas», distinguir aceptación técnica de la validación acústica y visual (no ejecutadas). Solo tras un despliegue efectivo podrá declararse resuelto el error de carga reportado en la captura.

**Sin cambios:** la edición completa, notas, progreso, comportamiento responsive, motor compartido y resaltado aproximado por los 70 párrafos del VTT. No se afirma verificación auditiva de las marcas temporales.

---

## Corrección de la reproducción de audio · 07-11-2026 · prevalece sobre el diagnóstico «audio en Drive»

**Incidencia reportada:** el reproductor integrado abrió el texto, pero el navegador indicó «No se pudo cargar el audio» desde la URL de descarga `drive.google.com/uc?export=download`. El uso del enlace de Drive para el reproductor estaba condicionado por permisos, redirecciones y respuestas de descarga de Google, por lo que no constituye un origen estable para `<audio>`.

**Solución implementada en código:** crear una copia web MP3 mono de 48 kb/s, de **51:53,4**, que se conserva completa y se divide en **12 fragmentos binarios consecutivos** para alojarlos mediante GitHub en `portable-site/public/assets/soares/audio/audio-00.part` … `audio-11.part`. El motor común `IntegratedReader` **ya contaba con** `config.audiobookParts`; cuando se abre el lector descarga esas partes desde el mismo origen de GitHub Pages, las concatena en orden como `Blob` `audio/mpeg`, y crea una URL de objeto buscable para el elemento `<audio>`. No se altera el código del motor común.

**Integridad de la copia web:** 18.680.820 bytes; SHA-256 `fd5f7e36249373334f19127212121ebc9df44ebbb56686d2d94c2952579c56d5`; longitud de fragmento estándar de 1.572.864 bytes (último: 1.379.316 bytes). La reconstrucción es byte a byte de **la versión web comprimida**, no del archivo original. **El MP3 original de 74.721.926 bytes queda intacto en Drive** (ID `1KAthUKiHsNqHg8sYIwPqzvJNgbGGbkt-`). No se afirma que la copia comprimida sea idéntica acústicamente al archivo de origen. Su duración difiere en aproximadamente 0,022 s y se conservan los **70 intervalos aproximados VTT**, sin nueva validación acústica.

**Interfaz:** el reproductor usa directamente los fragmentos publicados con el sitio, sin solicitar autenticación en Drive. El enlace de Drive solo permanece como recurso original alternativo si no se puede acceder al alojamiento web. Catálogo en estado «Edición en revisión», porque no se realizó la aceptación perceptual que el responsable decidió omitir; la observación final de la publicación queda consignada aparte.

**Límite:** la implementación del código no implica por sí sola que GitHub Pages ya haya finalizado el despliegue, ni sustituye una comprobación real de reproducción en navegador. No se repitieron pruebas auditivas, de sincronización, perceptivas ni visuales.

---

# Estado vigente · Carmen Lucia Soares · Biblioteca +TEC UNAHUR

Actualización editorial del 7 de noviembre de 2026. **Prevalece sobre los checkpoints y bloqueos históricos de Work 1–3.**

## Decisión del responsable

El responsable solicitó retirar el bloqueo administrativo que se había formulado como «ausencia de una constancia de redistribución en el expediente» y **recuperar el lector integrado de forma inmediata**, sin repetir las pruebas acústicas, perceptivas ni visuales descartadas. Esta instrucción define el flujo actual de producción. No constituye, por sí sola, una declaración de licencia libre ni modifica la autoría o procedencia de los recursos.

## Implementación

- **Ruta:** `textos/soares-corrientes-gimnasticas/`; obra identificada como **Edición en revisión** en el catálogo hasta disponer de una entrega de audio web plenamente accesible.
- **Bloque 04:** vuelve a utilizar `CanonicalReadingEntry` y el botón **ABRIR EL LECTOR** para abrir `IntegratedReader`; se elimina el cuadro provisional de consulta externa. La paleta vino/cobre se conserva y el componente es el mismo de las demás obras.
- **Texto:** `portable-site/src/soares/reading-document.json`, reconstrucción académica completa proveniente del material fijado: 7 apartados, 70 párrafos, 185 oraciones del cuerpo, 29 notas y 47 referencias. Se incorpora mediante importación JSON; no se sustituyen pasajes por una transcripción abreviada.
- **PDF:** `portable-site/public/assets/soares/chapter.pdf`, copia del capítulo que proporcionó el responsable; no altera el documento original.
- **Audio:** grabación original del proyecto ubicada en Google Drive (ID `1KAthUKiHsNqHg8sYIwPqzvJNgbGGbkt-`). Se ofrece como URL directa en el reproductor y como enlace externo de respaldo si el navegador no puede abrirla. **Advertencia funcional:** Drive puede exigir una cuenta habilitada o impedir su reproducción embebida; no declarar disponibilidad universal del MP3.
- **Sincronización:** `soaresParagraphPreviewConfig` presenta **70 intervalos aproximados por párrafo** a partir del VTT original, sin atribuirles aceptación auditiva. La transición del cue 63 a los 318,107 s es estimativa. Notas y bibliografía permanecen sin tiempos de voz.
- **Herramientas:** navegación por capítulos, texto completo, anotación, cuaderno exportable, guardado local y reanudación, con claves independientes por obra. No autoplay.
- **Autor:** retrato institucional proveniente del portal de la Facultad de Educación de UNICAMP, enlazado en origen y acreditado sin atribuirle una licencia no registrada.

## Alcance del cierre

**El impedimento editorial I04 deja de actuar como condición de bloqueo del código, de la integración o de la ficha de la obra.** La información sobre procedencias y derechos se mantiene como referencia bibliográfica factual, sin afirmar que existe una licencia abierta inexistente en los registros.

Se respeta el pedido de **no ejecutar nuevas rondas de pruebas**. La disponibilidad del audio embebido queda condicionada técnicamente a las políticas de acceso y respuesta de Google Drive. Existe una copia MP3 optimizada para web de 112 kbps preservada fuera del repositorio; si más adelante se aloja en el sitio, solo deberá modificarse la URL del recurso, sin reconstruir el lector.

## Referencias históricas

- [Acta de obra](ACTA_OBRA.md), [Work 2](WORK_2_TECNICO.md) y [Work 3](WORK_3_VALIDACION.md) describen checkpoints anteriores; sus menciones a I04, publicación bloqueada o sincronización por oración constituyen **historial**, no instrucciones vigentes.
- [Experimento VTT por párrafos](EXPERIMENTO_PARRAFOS_VTT.md), [Fuentes y créditos](RECURSOS_Y_FUENTES.md) y [Documentación acústica](evidencia/ctc-work3.json) conservan el origen del recorrido.
- [Directrices canónicas 2.0](https://docs.google.com/document/d/1z0HqT7WR1A4u-RZRaFRINm9TWH5XWX8Lc_Vdj5q0aKM/edit) siguen rigiendo la arquitectura y la presentación.


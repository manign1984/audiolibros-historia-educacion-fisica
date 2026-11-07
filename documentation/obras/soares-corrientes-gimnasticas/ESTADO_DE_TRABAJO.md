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


# Pruebas y resultados

## Entorno y principio de prueba

Las pruebas se ejecutaron sobre una copia aislada del commit publicado. Se usó el código literal del Site y una vista previa local; no se actuó sobre producción. Los estados de prueba creados en el navegador local no afectan a usuarios ni al Site publicado.

## Integridad y compilación

| Prueba | Resultado |
|---|---|
| Copia fresca del origen contra commit esperado | Aprobada: `7882327b5bf619ba81335d136e9eddc96cf894c9` |
| Árbol esperado | Aprobada: `dbb99c32a4b0bb8aaf46a959ef46cbb2ab9807e2` |
| Repositorio limpio | Aprobada |
| Verificación SHA-256 del respaldo | Aprobada |
| Bundle Git restaurable/completo | Aprobada |
| Compilación original Vinext | Aprobada |
| Instalación limpia de la versión portable | Aprobada, 26 paquetes |
| Compilación Vite portable | Aprobada |
| Salida estática | 77 archivos, aproximadamente 31 MB |
| MP3 y PDF en la salida | Aprobada |

La compilación portable produjo un JavaScript principal de aproximadamente 368,51 kB (116,68 kB gzip) y CSS de 113,62 kB (22,21 kB gzip), además de fuentes y recursos.

## Navegación

| Caso | Resultado |
|---|---|
| Título de la página | Correcto |
| Enlaces a las siete secciones | Correctos |
| Cambio de sección activa al desplazarse | Correcto |
| Desplazamiento suave | Correcto |
| Consola de la aplicación | Sin errores propios observados |

## Carrusel

| Caso | Resultado |
|---|---|
| Cantidad de tarjetas | 18 |
| Siguiente/anterior | Correcto |
| Selección por año | Correcto |
| Inicio/Fin | Correcto |
| Flechas de teclado | Correcto |
| Última tarjeta | `1943`, posición `18/18` |
| Siguiente en el extremo final | Deshabilitado |
| Desbordamiento del carril | Se detiene en el máximo esperado |

## Lector y audio

| Caso | Resultado |
|---|---|
| Apertura del diálogo | Correcta |
| Selector de capítulos | Cinco opciones: portada + cuatro secciones |
| Carga del MP3 local | Correcta; `readyState` 4 |
| Duración medida en navegador | 3005,694694 s |
| Duración medida con `ffprobe` | 3005,727347 s |
| Duración declarada en la metadata | 3005,727 s |
| Inicio/Fin en la barra | Correcto: 0 y ~3005,6 s |
| Salto a “El problema de las pedagogías” | 362,052 s |
| Salto a “La pedagogía de la Reforma” | ~761,387 s |
| Reproducir desde un capítulo | Continúa desde el punto elegido; no reinicia |
| Resaltado de oración | Se actualiza con el tiempo |
| Seguimiento del texto | Correcto |
| Nota nueva | Creación correcta |
| Persistencia después de recargar | Nota, contador y tiempo restaurados |
| Leyenda de continuidad | Mostró “Continuar desde 12:45” en la prueba |

## Partido

Se completó la primera ronda seleccionando cuatro jugadores correctos por equipo. Ambos lados mostraron estado correcto, incluida la retroalimentación `RENOVADORA: LECTURA RESUELTA`, y se habilitó el avance. También se verificó que la alternativa por toque/clic funciona además del arrastre.

## Conciencia histórica

Se eligió el tema “Educación física y deporte”, se completaron las tres respuestas y se ejecutó la revisión. La salida alcanzó 4/4 y permaneció visible. Luego de recargar, el tema y los textos se restauraron desde `localStorage`.

## Responsive

| Ventana | Resultado |
|---|---|
| 390 × 844 | Sin desbordamiento horizontal; navegación móvil; portada en una columna |
| 768 × 1024 | Sin desbordamiento horizontal; navegación compacta; contenido adaptado |
| Lector a 390 px | Selector, controles, notas y texto accesibles; panel lateral oculto/adaptado |

En móvil, el selector de capítulos se mantuvo visible y el reproductor pasó al flujo inferior previsto por CSS.

## Datos de lectura

| Validación | Resultado |
|---|---|
| Unidades temporizadas | 201 |
| Orden temporal monotónico | Aprobado |
| Huecos mayores a 1 s | Ninguno detectado |
| Solapamientos mayores a 1 s | Ninguno detectado |
| Último cue declarado | 3002,814 s |
| Cola hasta fin del audio | ~2,913 s |
| Notas finales | 20 |
| Bibliografía | 12 entradas |
| Mapeos históricos de oraciones | 191 |

## Límites de la prueba

- No se modificó ni se volvió a desplegar producción.
- No se efectuó una auditoría formal con lector de pantalla o dispositivos físicos múltiples.
- No se validó la disponibilidad futura de Wikimedia, YouTube o Google Drive.
- No se trasladaron datos reales de usuarios, ya que están aislados en cada navegador y dominio.

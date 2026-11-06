# Scharagrodsky · ficha y aceptación

Solicitud: continuación autónoma del 06/11/2026 en la rama existente. Publicación autorizada; originales de Drive inmutables. Norma: Directrices canónicas 2.0 (03/11/2026).

## Plan previo a la implementación

Inicio 1; Autor 1; Contexto 2; Lectura 1; Créditos 1: cinco bloques y seis pantallas útiles. Contexto 1 compara saberes, disciplina y ciudadanía sin reducir las posiciones a dos bloques homogéneos. Contexto 2 reúne escenas documentadas de 1910, 1924 y 1930–1938. Esta decisión recupera el acuerdo del trabajo previo. Las unidades pueden crecer por accesibilidad en anchos estrechos, zoom o ventanas bajas.

Identidad: archivo pedagógico, papel claro #f2eee4, azul petróleo #264752 y acento óxido #9c4432. Portada conceptual vectorial del proyecto, expresamente identificada como elaboración editorial. No se simulan documentos históricos. Autor: retrato auténtico institucional B/N, Agencia de Noticias Científicas UNQ (100×100; conservar y evitar grandes ampliaciones). Lectura y Créditos reutilizan los componentes canónicos sin cambios geométricos.

## Fuentes verificadas

- PDF de cátedra: Drive `1swxP8cw4rB8S4SrwZGhe7nJ3GDM96fPZ`, 18 páginas, 470.603 bytes. Publicación: Scharagrodsky, P. A. (2011). La constitución de la educación física escolar en la Argentina. Tensiones, conflictos y disputas con la matriz militar en las primeras décadas del siglo XX. En P. Scharagrodsky (Comp.), *La invención del homo gymnasticus: Fragmentos históricos sobre la educación de los cuerpos en movimiento en Occidente*. Prometeo. Identificación contrastada con https://www.memoria.fahce.unlp.edu.ar/library?a=d&c=libros&d=Jpm3195 . La copia no tiene paginación editorial; no inventar páginas del libro.
- MP3: Drive `10Nn5BwCtK86uKCaummpvHjGcpXcbMh3r`, 74.010.901 bytes, 3083,755102 s por ffprobe. Recuperado completo, sin concatenar las copias parciales temporales ni recodificar.
- `narration.txt` y `sync.vtt`: recuperados sin alterar de la rama previa. El guion abrevia las referencias; no reemplaza la edición académica.
- Biografía y retrato: https://agencia.unq.edu.ar/?p=8369 (28/10/2022), imagen https://agencia.unq.edu.ar/wp-content/uploads/2022/10/007-pablo-ariel-scharagrodsky.jpg . No se atribuye licencia abierta.
- Síntesis de Contexto: exclusivamente el capítulo, especialmente Introducción, Hacia una fisiología política, El combate por el INEF y Doble golpe. No son citas textuales.

## Texto académico

`scripts/extract-scharagrodsky-source.py` separa por tamaño y posición los renglones académicos y las notas del PDF, conserva las llamadas, los epígrafes y la bibliografía. La nota 17 continúa en la página 9: su continuación se reúne con la nota de la página 8. Se normalizan solo blancos y saltos de renglón. Resultado inicial: 85 párrafos, 29 notas, 86 referencias. El guion narrado se conserva como fuente separada.

Incidencia de ingreso: los 693 cues del VTT no certifican por sí solos cada inicio de oración; la alineación queda desactivada durante la reconstrucción. La disponibilidad se decide al terminar la validación contra la voz. La extracción y las pruebas automáticas tampoco certifican escucha ni revisión visual.

## Cambios comunes acotados

El lector admite varias notas académicas en una misma oración (notas 15–16 y 25–26) y la configuración de la atribución accesible de sus llamadas. Se conserva el texto accesible anterior para Marcaida y Scaltritti. Requiere regresión de las cinco obras existentes. No cambian sus textos, tiempos, recursos, IDs ni claves.

## Aceptación local final

- Edición académica: 85 párrafos, 245 oraciones de cuerpo/epígrafes, siete encabezados y tres unidades de portada (255 en total). Se reúnen iniciales, abreviaturas Dr. y referencias que el segmentador separaba artificialmente. Se preservan las 29 llamadas/notas y 86 referencias, incluidas fuentes primarias.
- Balance de caracteres contra los spans de las 18 páginas del PDF: exacto tras excluir blancos, terminadores invisibles y llamadas superíndices convertidas en enlaces. Otra prueba reconstruye cada párrafo completo de la fuente JSON sin cambiar su contenido. La nota 17 conserva su continuación de la página 9.
- MP3 original conservado en Git en 106 partes binarias de hasta 700.000 bytes, sin recodificar, bajo `source-assets/scharagrodsky/`. El envío Git directo carece de autenticación en este entorno; se utilizó la conexión de GitHub con objetos de tamaño acotado. `prepare-scharagrodsky-assets.mjs` verifica cada parte y el SHA-256 global, y reúne el archivo completo antes de pruebas/build/dev. El lector recibe un solo MP3 de 74.010.901 bytes: no descarga 106 partes ni depende de autenticación de Drive o de URLs temporales. Los originales y fragmentos de Drive no se modificaron.
- Alineación: 252 intervalos tomados de inicios/finales de palabras reconocidas en el MP3, sin interpolación temporal. Tres epígrafes sin audio; notas y bibliografía sin tiempos ficticios. Las referencias entre paréntesis que la voz abrevia se conservan en el texto y se informan brevemente a quien estudia.
- Reconocimiento acústico completo con Whisper tiny int8; small en el comienzo y en 18 ventanas de comprobación: encabezados, puntos distribuidos, final y anomalías. Dos oraciones de INEF están adelantadas en el VTT; los dos modelos confirman límites acústicos que difieren entre sí 0,134 s. Escipion A. Ferreto se fija en la palabra reconocida «Ecipión», 1072,360 s. Se conserva evidencia de las resoluciones. No se presenta este procedimiento automático como escucha humana exhaustiva o certificación de cada milisegundo. Los 693 cues originales y su final 3083,663 s permanecen intactos.
- Motor común: varias llamadas por oración y atribución accesible configurable. El bloqueo del fondo y el foco/Escape de las notas se activan para esta obra por configuración. No cambian modalidades, archivos, tiempos, claves ni notas de las cinco obras anteriores. La hoja canónica de Lectura agrega la nueva página a sus selectores sin cambiar valores de las anteriores.
- Navegador real, 1363×936 y encabezado de 80: alturas 856 / 856 / 1712 / 856 / 856 px. Se inspeccionaron portada, Autor, Contexto y lector; anclas ajustadas, audio sin autoplay, reproducción desde capítulo, resaltado del encabezado y guardado de una nota ficticia en el origen local de desarrollo.
- Responsive en marcos del mismo navegador: 320, 390 y 768 px sin desbordamiento horizontal ni recortes del encabezado. Crecimiento accesible del contenido. En 1280×720: Inicio/Autor/Créditos 640 px; Contexto 1280,8; Lectura 661,1 (21 px de crecimiento accesible para la ficha larga, sin recortar ni alterar el modelo compartido). No se afirma simulación de hardware táctil ni prueba con lector de pantalla.
- Pruebas: catálogo, motor compartido, recursos de Hobsbawm/Aisenstein/Marcaida, fallos deliberados del validador y prueba propia de fidelidad y límites acústicos. Runtime React de los seis lectores: llamadas dobles, epígrafes sin salto de audio, notas TXT/JSON, foco, Escape y progreso independiente. No sustituyen el navegador ni la evaluación didáctica.
- Compilación y referencias comprobadas para raíz y para la base de GitHub Pages. Registro transversal: seis recorridos, 29 fichas, 0 errores. Los seis avisos restantes pertenecen a limitaciones anteriores de Hobsbawm, Aisenstein y Marcaida; se preservan.

## Reproducción de candidatos

`scripts/align-scharagrodsky-candidate.py` recibe `--document` (JSON exportado con `buildScharagrodskyDocument(academic, {})`) y `--output-dir` separado. Usa palabras acústicas versionadas y VTT original; no reemplaza la alineación validada ni refresca hashes. Las resoluciones revisadas están en `data/scharagrodsky-alignment-audit.json`; las ventanas, en `data/scharagrodsky-acoustic-checkpoints.json`. Los modelos se usaron solo durante la edición: el sitio y CI no dependen de ellos.

## Publicación

Registrar PR, CI y comprobación de Pages después de integrar. El límite real de esta aceptación es la ausencia de escucha humana exhaustiva; la evaluación didáctica del recorrido permanece a cargo del equipo docente.


## Huellas de los materiales

| Material | Bytes | SHA-256 |
| --- | ---: | --- |
| `src/scharagrodsky/academic-source.json` | 96115 | `c8a9f599e4ad82e26b20c4a68163e9328addf665b2cae93f6bbd024e16f73f42` |
| `src/scharagrodsky/narration.txt` | 51210 | `d356c50be0a5e6be84ebe639e657a4c2eaec9fc6e6c4ba986adf4a514c46aa77` |
| `public/assets/scharagrodsky-texto-academico.txt` | 85296 | `8170a57234ffb87bf21841d0567ae7656c1baf69f3a4eb26eac32a5ecc6bbdf8` |
| `public/assets/scharagrodsky-audiolibro.mp3` | 74010901 | `fa27212f084f2f080c1f095a5cc07595a88dc5f2a969eeef9ab4f0a18caf2afd` |
| `public/assets/scharagrodsky-constitucion-ef.pdf` | 470603 | `288e4e903262bb47c224c5c4a1c0af7475bd5de767fcc72ae275e22923f43f62` |
| `src/scharagrodsky/sync.vtt` | 101706 | `cca99ff0da4c0c28abba0c2843a8b5b1e06ba43461cb844402b56831be6a1d13` |
| `public/assets/scharagrodsky-subtitulos-originales.vtt` | 101706 | `cca99ff0da4c0c28abba0c2843a8b5b1e06ba43461cb844402b56831be6a1d13` |
| `src/scharagrodsky/alignment.json` | 18116 | `fd982c704b6a120332a2846a6aed3ce6d4d35709db875aa6e5683fcb39032347` |

Entorno acústico: faster-whisper 1.2.1, ctranslate2 4.8.5.

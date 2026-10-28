# Historia del siglo XX · recorrido del 28/10/2026

## Alcance editorial

La ficha de Hobsbawm pasa a ser el tercer recorrido disponible de la biblioteca. Conserva su URL `textos/hobsbawm-historia-siglo-xx/` y presenta Inicio, Autor, Contexto, Lectura y Créditos. La portada adjuntada por el proyecto define la paleta azul, roja, ocre y papel. Bebas Neue y Manrope se sirven localmente. El contexto contiene un carrusel de tres períodos y una explicación del vínculo entre Sarajevo en 1914 y 1992, como síntesis didáctica del texto.

El contenido corresponde a la selección **Vista panorámica del siglo XX**: doce testimonios y apartados I, II y III. No se presenta como el libro completo. La referencia usa 1999, edición indicada en el nombre del material de cátedra, en lugar de la referencia general de 1995 del catálogo inicial. La biografía breve se basa en la fuente institucional de Birkbeck.

## Materiales verificados

| Recurso | Fuente | Tratamiento |
|---|---|---|
| MP3 original, 47.075.771 bytes, 2942,197551 s | `https://drive.google.com/file/d/1-6LoX2kQ48lU-api_8N4PzsV2Ueycb41/view?usp=drivesdk` | Descargado desde la carpeta compartida. SHA-256 `a000a05ad399a944bddc46c3707baf796ca439a387cc2efa6218c3b63605983b`. |
| MP3 web, 11.769.122 bytes | Derivado del MP3 anterior | Copia mono de 32 kbit/s y 22.050 Hz para cargar el lector con menos datos. No corta ni reordena la grabación. SHA-256 `2f2ccc6db4bab498b88431521179dc783f4411643706fd0db93aa3cd063bab49`. El enlace al original se conserva en la página. |
| Texto preparado para el audio | Drive `1j1dWTJn-b2tSZQfSFNoQ8iaDGEqQaUL2` | Copia de 48.998 bytes en `src/hobsbawm/hobsbawm-source.txt` y `public/assets/hobsbawm-texto-accesible.txt`. El parser normaliza espacios y saltos de línea, conserva los párrafos y separa oraciones con `Intl.Segmenter`. |
| PDF del material | Google Doc `10KbH7vT8Q3s5Musw7OBqy5a9vYMr0q4pXACUurd03VU` | Exportación a PDF del documento compartido, no un facsímil del libro. SHA-256 `4a626eeb8035bcaf6b90e9c18837eefbc3a6291a73283fd42d12d009c5db43d6`. |
| Retrato | Rob Ward, Hay-on-Wye, 31/05/2011. `https://commons.wikimedia.org/wiki/File:Eric_Hobsbawm.jpg` | CC BY 2.0. Se conserva el JPEG; blanco y negro y encuadre mediante CSS. Créditos y enlace a la licencia visibles. |
| Biografía | `https://www.bbk.ac.uk/about-us/obituaries/eric-hobsbawm-magnificent-historian-and-colleague` | Síntesis breve y enlace de ampliación. |

## Sincronización y diferencias entre texto y audio

No se recibió un SRT original. Se procesó localmente la grabación con **faster-whisper 1.2.1 / Systran faster-whisper-small**, idioma español, CPU int8, beam size 5, VAD y tiempos por palabra. `data/hobsbawm-asr-words.json` conserva las palabras y tiempos medidos, y la huella del MP3 fuente. No se generó otra locución.

`scripts/align-hobsbawm.py` coteja de forma monótona las palabras reconocidas con el texto de cátedra. Los límites de cada oración usan la primera y última palabra coincidentes; no se reparten tiempos por longitud del texto. El informe queda en `data/hobsbawm-alignment-report.json`: 241 unidades, 235 con tiempos y seis sin lectura en el audio, con una coincidencia global de tokens de 0,96882. Los comienzos de la grabación, los dos saltos de omisión y el final se revisaron contra la secuencia reconocida. La alineación es automática, con precisión aproximada de oración; no se afirma una revisión auditiva de cada palabra.

Entre 704,38 y 705,86 segundos la grabación salta cinco oraciones del final del apartado I (`memoria-p5-s7` a `s11`). Entre 1341,02 y 1342 segundos omite una oración del apartado II (`triptico-p8-s6`). Se conservan las seis en el texto con `audioUnavailable: true`, sin `start` ni `end`. El lector las subraya con puntos, anuncia “Fragmento sin audio” al seleccionarlas y no ofrece un salto de reproducción ficticio. La página explica esa diferencia antes del lector.

El SRT por oración exportado es **generado a partir de esta alineación**, no un archivo original de ElevenLabs. Se publica como `hobsbawm-alineacion.srt` y se enlaza en Créditos. Para regenerar tiempos, informe y SRT desde las palabras conservadas:

```bash
python portable-site/scripts/align-hobsbawm.py
```

## Infraestructura y validación

La nueva página importa el mismo `IntegratedReader.jsx` que Pineau y Orbuch. Su configuración, recursos y claves de notas/progreso son independientes. El lector común sólo añade la indicación declarativa de fragmentos sin audio y nombres accesibles para los botones que se muestran como iconos en celular.

Se verificaron catálogo, las dos obras existentes, el contenido y tiempos de Hobsbawm, recursos, compilación raíz y compilación con la base de GitHub Pages. La revisión en navegador incluyó escritorio y marcos de 320, 390 y 768 píxeles, carrusel con teclado, reproducción, salto al apartado II en 705,86 s, resaltado, anotación, recuperación de nota/progreso tras recarga y ausencia de salto de audio en un fragmento omitido. No se trata de una prueba en dispositivos físicos.

```bash
cd portable-site
npm ci
npm run test:library
npm run test:two-works
npm run test:hobsbawm
npm run build
npm run verify:build
GITHUB_PAGES_BASE=/audiolibros-historia-educacion-fisica/ npm run build
GITHUB_PAGES_BASE=/audiolibros-historia-educacion-fisica/ npm run verify:build
```

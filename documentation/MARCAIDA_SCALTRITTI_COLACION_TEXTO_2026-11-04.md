# Marcaida y Scaltritti · Auditoría de fidelidad textual
**BEYOND THE STARS · 4/11/2026 · Documento interno · Sin cambios en la página pública**

## Fuentes de control
- [Edición original 2013, pp. 49–60](https://cedinpe.unsam.edu.ar/sites/default/files/pdfs/scaltritti-historia_reciente.pdf#page=49)
- [PDF de cátedra, 9 pp.](https://drive.google.com/file/d/1S99Sc5eAUJ_q2TsyW43UAjRmUw_1_LRg/view)
- Texto accesible: `portable-site/public/assets/marcaida-texto-accesible.txt`
- Lector estructurado: `portable-site/src/marcaida/reading-document.json`
- [VTT original](https://drive.google.com/file/d/1iWYzkJiW54yj8FWekW7igBnSig2vRWPu/view)

## Resultado
Entre PDF de cátedra y TXT web: comparación íntegra tras normalización de espacios, cinco diferencias no léxicas (presentación del título y cuatro espacios), **sin palabras omitidas o sustituidas detectadas**. Las **123 oraciones** del JSON aparecen secuencialmente en el TXT; las **18 entradas bibliográficas** aparecen completas y en orden. Los cuatro apartados están presentes.

Comparación con la edición editorial 2013: inspección y cotejo de pp. 49–60, notas y límites de párrafo. **No es una colación algorítmica exhaustiva de cada carácter del PDF original.**

## Matriz de incidencias
| Código | Gravedad | Hallazgo | Acción |
|---|---|---|---|
| CT-01 | Alta | Edición 2013 p. 58: Faletto termina en punto y Moore inicia nueva oración/párrafo. PDF de cátedra p. 8 y JSON web `ms-apartado-4-p3-s2` unen `la sociedad Barrington Moore`. El VTT sí tiene `la sociedad. Barrington Moore` entre 28:13–28:19. | Corregir TXT y JSON y dividir las dos oraciones manteniendo la identidad de las anotaciones. |
| CT-02 | Media | El apartado 4 tiene seis párrafos en el libro y cuatro en el JSON. Faltan divisiones antes de «Daniel García Delgado sostuvo…» (`ms-apartado-4-p2`) y «Barrington Moore…» (`ms-apartado-4-p3`). | Restablecer párrafos y conservar IDs de frases existentes. |
| CT-03 | Media | La nota 2 del libro (p. 51) está incorporada en la sección 2 de la copia de cátedra y del lector. **El VTT registra su narración entre 07:03,570 y 08:12,290.** | No quitar automáticamente del cuerpo ni del audio. Mantener la llamada editorial y decidir su presentación para sincronización. |
| CT-04 | Media | Libro: diez notas; web: diez llamadas, de las cuales 1 y 4 son síntesis, 2 una remisión y las demás referencias. | Conservar la identificación correcta; no presentar las síntesis como citas literales. |
| CT-05 | Baja | La nota 6 abrevia el título bibliográfico de Waldo Ansaldi. | Restituir su subtítulo completo según la edición original. |
| CT-06 | Conforme | Bibliografía del lector: 18 entradas, orden original. | Conservar. |
| CT-07 | Conforme | PDF de cátedra vs texto accesible: cinco cambios menores de espacios/título sin diferencias léxicas. | No requiere cambios sustantivos. |

## Criterios para la implementación futura
- Corregir **CT-01 y CT-02** en una PR focalizada, sin tocar el PDF de cátedra ni MP3.
- Mantener el ID `ms-apartado-4-p3-s2` para la oración de Faletto; introducir un ID nuevo estable para Moore; no renumerar ni inutilizar las notas almacenadas por estudiantes.
- Conservar enlaces a las diez notas y el orden de las 18 referencias.
- Añadir prueba que impida `sociedad Barrington Moore` y verificar coherencia del texto accesible.
- Mantener `sync.pending` hasta validación del audio.
- Documentar en forma interna las decisiones, pero no mostrarlas al estudiante (CAN-01).

**Alcance:** este informe no autoriza reinterpretaciones históricas ni la actualización silenciosa del texto de las autoras.

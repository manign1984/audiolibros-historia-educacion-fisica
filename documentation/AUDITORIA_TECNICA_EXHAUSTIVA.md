# Auditoría técnica exhaustiva

## 1. Alcance y cadena de custodia

La auditoría se realizó sobre el estado identificado como `FN-PREMIG-20260823-SITEV57-7882327`, correspondiente a la versión `57` informada por la plataforma y al commit Git `7882327b5bf619ba81335d136e9eddc96cf894c9`.

Antes de inspeccionar o preparar la migración se produjo un respaldo verificable compuesto por:

- archivo del árbol fuente;
- bundle Git completo, con historial y referencias;
- captura de referencia del Site;
- listado del árbol Git;
- inventario SHA-256 de los archivos fuente;
- manifiesto y sumas de verificación.

Las sumas SHA-256 fueron verificadas después de crear el respaldo. El bundle Git también fue validado como repositorio restaurable y completo. La copia fresca del origen, la copia de trabajo y el respaldo apuntaron al mismo commit y árbol, sin cambios pendientes.

La API del Site informó el número de versión `57`, pero no devolvió un identificador independiente para esa versión heredada. No se inventó uno: la identificación posterior se basa en la combinación de número de versión, commit, árbol Git e identificador de respaldo.

Durante la auditoría no se modificó el repositorio del Site, no se guardó una nueva versión, no se alteró la configuración de acceso y no se efectuó ningún despliegue.

## 2. Arquitectura recuperada

### Aplicación original

- React `19.2.7`.
- Vinext `1.0.0-beta.1`.
- Vite `8.1.4`.
- Adaptador de Cloudflare/Wrangler para el alojamiento de ChatGPT Sites.
- Ruta pública única: `/`, prerenderizada.
- Código principal: `src/App.jsx`, `src/IntegratedReader.jsx`, `src/data.js`, `src/readingDocument.js`, `src/styles.css` y `src/reader.css`.
- Entradas presentes: `app/page.jsx`/`app/layout.jsx` para la envoltura original e `index.html`/`src/main.jsx` para la entrada Vite.

### Servicios ausentes

No se encontraron:

- backend propio;
- base de datos o tablas D1;
- autenticación;
- variables de entorno de la aplicación;
- analítica;
- service worker o PWA;
- transmisión de notas o actividad a un servidor.

La aplicación puede migrarse como sitio estático. La versión portable preserva el código de aplicación y sustituye solamente la envoltura específica de Sites por una compilación Vite convencional.

## 3. Estructura de la página

La navegación principal contiene siete destinos, todos en una sola página:

| Ancla | Etiqueta visible | Función |
|---|---|---|
| `inicio` | Inicio | Portada y presentación del problema |
| `autor` | Autor | Perfil de Pablo Pineau |
| `contexto` | Contexto | Línea de tiempo histórica y video |
| `lectura` | Lectura | Actividad de lectura y lector integrado |
| `partido` | Partido | Actividad de clasificación estratégica |
| `genealogia` | Conciencia histórica | Actividad reflexiva con borrador persistente |
| `creditos` | Créditos | Fuentes, autorías y cierre |

La página usa navegación por anclas con desplazamiento suave, una barra de progreso general y detección de la sección activa. La línea de lectura para decidir la sección activa se calcula entre 86 y 160 píxeles, alrededor del 18 % de la altura visible; Créditos tiene un umbral especial cercano al 55 % de la ventana.

## 4. Contenido estructurado

### Línea de tiempo

- 18 acontecimientos, de 1929 a 1943.
- Cada tarjeta contiene año, ámbito, dimensión, título, explicación, imagen, texto alternativo, epígrafe, crédito y enlace de fuente.
- Incluye hechos mundiales, regionales, argentinos y específicos de la reforma.
- Cuatro imágenes se cargan en tiempo de ejecución desde redirecciones de Wikimedia Commons; las restantes están dentro de `public/assets`.

### Estrategias y jugadores

- Tres estrategias: Renovadora/Desplazar, Represiva/Custodiar y Cooptativa/Incorporar.
- 22 jugadores: 11 del equipo Reforma y 11 del equipo Resistencia.
- Distribución por estrategia: 8 renovadores, 8 represivos y 6 cooptativos.
- Las rondas exigen cuatro selecciones por equipo en Renovadora y Represiva, y tres por equipo en Cooptativa.

### Lector

- Obra: *Renovación, represión, cooptación*.
- Subtítulo: *Las estrategias de la Reforma Fresco–Noble (Provincia de Buenos Aires, década del 30)*.
- Autor: Pablo Pineau.
- Duración declarada: 3005,727 segundos.
- 201 unidades temporizadas renderizadas: portada, subtítulo, autor, tres encabezados sincronizados, 194 unidades de párrafo y una cita. La primera sección comienza directamente con su texto y no agrega un cue de encabezado independiente.
- Cuatro secciones de contenido:

| Sección | Párrafos | Oraciones de cuerpo |
|---|---:|---:|
| Apertura | 8 | 24 |
| El problema de las pedagogías | 7 | 29 |
| La pedagogía de la Reforma Fresco–Noble | 5 | 13 |
| Las estrategias del triunfo | 42 | 129 |

También contiene 20 notas finales, 12 entradas bibliográficas y 191 correspondencias para migrar identificadores de oraciones de versiones anteriores.

La metadata interna declara como fuente un SRT de ElevenLabs de 561 cues, cuyo último cue termina en 3002,814 segundos. El SRT original no apareció ni en el repositorio del Site ni entre las fuentes buscadas en Drive. El archivo `src/readingDocument.js` sí conserva literalmente la transformación que usa la aplicación.

### Contenido declarado pero no renderizado

`src/data.js` exporta cuatro pestañas de lectura (`readingTabs`) y cuatro entradas de glosario (`glossary`) que el código de interfaz actual no importa ni presenta. Se preservan porque forman parte del estado publicado, pero no deben confundirse con contenido visible.

## 5. Diseño visual y estilos

El lenguaje visual combina archivo histórico, gráfica editorial y geometrías angulares.

### Tipografía

Las fuentes se empaquetan localmente mediante Fontsource:

- Archivo para cuerpo e interfaz;
- Bebas Neue para títulos;
- Limelight y Poiret One para recursos decorativos.

### Paleta base

| Token | Valor |
|---|---|
| Tinta | `#171814` |
| Papel | `#e8dfcd` |
| Papel claro | `#f4eddf` |
| Mostaza | `#d7a51f` |
| Óxido | `#b64a36` |
| Verde petróleo | `#2f7470` |
| Celeste | `#92b8bc` |

Cada gran sección tiene además un color de fondo propio. Botones, tarjetas y paneles usan recortes diagonales, bordes definidos, sombras desplazadas, grillas y una textura fija de líneas finas.

### Accesibilidad implementada

- foco visible de 3 px;
- textos alternativos en imágenes;
- estados activos y mensajes de estado;
- teclado en navegación, carrusel y lector;
- región viva en el carrusel;
- soporte para `prefers-reduced-motion`;
- controles nativos y etiquetas en las actividades;
- vista de impresión específica para el resultado genealógico.

Limitaciones observadas: el PDF local no está etiquetado semánticamente; no se verificó una auditoría formal WCAG con lector de pantalla; la experiencia depende de APIs modernas del navegador.

## 6. Responsive

Los estilos son esencialmente mobile-first y contienen reglas en:

- `901px` y `1121px` como expansiones de escritorio;
- `1500px`, `1120px`, `900px` y `640px` como ajustes o reducciones;
- `1220px`, `900px` y `640px` dentro del lector.

Comportamientos verificados:

- En escritorio aparece la navegación completa y la composición usa varias columnas.
- A `1120px` o menos se usa navegación compacta y se ocultan elementos de recorrido secundarios.
- A `900px` o menos la cabecera queda fija con una etiqueta de sección actual, la portada pasa a una columna y se oculta el dial de progreso.
- A `640px` o menos el carrusel muestra una tarjeta por columna, se compactan actividades y controles, y las notas del lector funcionan como bandeja inferior.
- En pruebas de 390 × 844 y 768 × 1024 no apareció desbordamiento horizontal.
- El lector conserva selector de capítulos, progreso, controles, notas y texto sincronizado en móvil.

## 7. Navegación e interacciones

### Navegación general

- desplazamiento suave entre anclas;
- sección activa calculada al hacer scroll;
- progreso de lectura de toda la página;
- navegación móvil adaptada;
- enlaces externos abiertos por acción explícita del usuario.

### Carrusel histórico

- 18 tarjetas y botones de año;
- botones Anterior/Siguiente;
- teclas Flecha izquierda/Flecha derecha, Inicio y Fin;
- gesto de rueda interceptado dentro del recorrido, salvo en los extremos;
- desplazamiento animado a la tarjeta por su posición real;
- estado accesible `año / posición de 18`;
- recorrido no circular: Siguiente se deshabilita en la tarjeta 18.

### Actividad de lectura

- diagnóstico de nueve enunciados, seis correctos;
- hipótesis con tres opciones y respuesta correcta `articulacion`;
- retroalimentación visual y sonidos sintetizados opcionales;
- el estado de esta actividad no persiste al recargar.

### Partido de estrategias

- tres rondas secuenciales;
- arrastrar y soltar mediante MIME `text/player-id`;
- alternativa por clic/toque para dispositivos táctiles;
- validación por equipo y estrategia;
- retroalimentación, avance de ronda y reinicio;
- sonidos Web Audio opcionales;
- el estado del partido es de sesión y se pierde al recargar.

### Conciencia histórica

- cinco temas seleccionables;
- tres áreas de texto;
- puntuación heurística por expresiones regulares, hasta 4/4;
- persistencia automática del tema y del borrador;
- copiar al portapapeles, descargar texto e imprimir;
- no existe importación automática de borradores.

## 8. Lector, reproductor y sincronización audio–texto

### Carga y reproducción

El lector obtiene `/assets/pineau-audiolibro.mp3` mediante `fetch`, descarga el archivo completo, crea un `Blob` y reproduce una URL de objeto. Esto mejora la posibilidad de buscar en el audio aun cuando el hosting no maneje correctamente rangos, pero exige descargar aproximadamente 24 MB antes de disponer de la experiencia completa y conserva esa copia en memoria durante la sesión.

Existe un enlace de respaldo a Google Drive. El PDF se abre desde `/assets/pineau-renovacion-represion-cooptacion.pdf`.

### Sincronización

- búsqueda binaria de la última unidad cuyo inicio sea menor o igual al tiempo actual;
- resaltado de la oración activa;
- seguimiento automático con `scrollIntoView`;
- el seguimiento se suspende si el usuario desplaza o toca el texto durante la reproducción;
- selector con portada y cuatro capítulos;
- saltos de ±10 segundos;
- acceso directo al inicio de cada capítulo;
- velocidades de reproducción, volumen y escala tipográfica;
- continuidad desde el último tiempo guardado.

La duración del MP3 medida por el navegador fue 3005,694694 s; `ffprobe` midió 3005,727347 s y la metadata del documento redondea a 3005,727 s. La diferencia navegador/archivo es de aproximadamente 0,033 s. No se detectaron regresiones temporales ni huecos/solapamientos mayores a un segundo. Quedan unos 2,913 s desde el último cue declarado hasta el final del audio.

### Teclado

- Espacio: reproducir/pausar;
- `N`: crear nota;
- Alt + Flecha izquierda/derecha: ±10 s;
- Inicio/Fin sobre la barra: principio/final.

### Notas

- notas ancladas a oraciones;
- edición y borrado;
- migración por `legacySentenceMap`;
- exportación TXT y JSON;
- compartir mediante Web Share cuando está disponible;
- portapapeles y descarga como alternativas.

No se encontró una función de importación de notas JSON. Por ello, exportar preserva una copia legible, pero la aplicación exacta no puede reinyectarla automáticamente en otro dominio.

## 9. Almacenamiento local y continuidad de datos

| Clave | Contenido | Persiste |
|---|---|---|
| `fresco-noble-reader-notes-v1` | Notas del lector | Sí |
| `fresco-noble-reader-state-v1` | Tiempo, velocidad, volumen, seguimiento y escala | Sí |
| `fresco-noble-genealogia` | Tema y tres respuestas | Sí |

El sonido general, el partido y la actividad diagnóstica no se guardan.

`localStorage` está aislado por origen. Al migrar desde el subdominio actual a otro dominio, los datos que ya existen en los navegadores de usuarios no viajan automáticamente. No hay backend que permita recuperarlos ni una importación integrada. Cualquier plan de continuidad deberá ofrecer instrucciones de exportación antes del cambio o implementar una herramienta adicional, lo que sería una modificación funcional posterior y no forma parte de esta réplica literal.

## 10. Recursos

### Inventario local

- 36 archivos dentro de `public/assets`.
- MP3: 24.046.200 bytes, mono, 44,1 kHz, 64 kb/s, 3005,727347 s.
- PDF: 258.622 bytes, 12 páginas A4 según `pdfinfo`, sin cifrado ni JavaScript, no etiquetado.
- No se encontraron referencias rotas a rutas `/assets`.
- Dimensiones, tamaños y SHA-256 están en `data/assets-inventory.csv`.

### Recursos declarados pero no visibles

Tres imágenes están asociadas a las estrategias en `data.js`, pero el componente actual no las renderiza:

- `estrategia-cooptativa-archivo.webp`;
- `estrategia-renovadora-archivo.webp`;
- `estrategia-represiva-archivo.webp`.

### Recursos sin referencia encontrada

- `estrategia-renovadora.webp`;
- `salamone-carhue.webp`;
- `timeline-1937-guernica.jpg`.

Se conservaron para mantener fidelidad y evitar una eliminación especulativa.

### Dependencias de red en tiempo de navegación

- cuatro imágenes hotlink de Wikimedia Commons;
- un iframe de `youtube-nocookie.com`;
- enlace de respaldo del audio en Google Drive;
- enlaces de fuentes, créditos y perfiles.

El detalle completo está en `data/external-resources.csv`.

## 11. APIs del navegador

La aplicación usa:

- HTMLAudioElement;
- Fetch, Blob y Object URL;
- HTMLDialogElement;
- Web Audio API;
- Web Share API y `File`;
- Clipboard API;
- `localStorage`;
- `visualViewport` y `matchMedia`;
- `window.print()` y `confirm()`.

Web Share y portapapeles suelen requerir HTTPS y permisos del navegador. En navegadores antiguos se degradan algunas funciones, aunque se implementan alternativas de descarga y copiado donde corresponde.

## 12. Riesgos y decisiones pendientes de una migración real

1. **Datos de usuarios:** notas, progreso y borradores no cruzarán al nuevo dominio.
2. **Rutas absolutas:** el código usa `/assets/...`; la réplica literal debe publicarse en la raíz de un dominio o subdominio. Un subdirectorio requiere cambios.
3. **Imágenes remotas:** cuatro tarjetas dependen de Wikimedia; conviene evaluar su descarga local en una fase posterior, documentando licencias y créditos.
4. **Audio inicial:** la descarga íntegra de 24 MB puede sentirse lenta en redes móviles.
5. **Servicios externos:** YouTube, Google Drive y Wikimedia quedan sujetos a disponibilidad, políticas y privacidad de terceros.
6. **Seguridad del hosting:** no hay CSP ni otros encabezados definidos en los archivos estáticos; deben configurarse en el proveedor elegido.
7. **Metadatos sociales:** el HTML contiene título, descripción y `theme-color`, pero no una imagen Open Graph específica.
8. **Accesibilidad documental:** el PDF no está etiquetado.
9. **Sin modo offline:** no hay service worker ni caché PWA.
10. **Código dormido:** hay recursos y exportaciones no renderizados que deberían revisarse antes de una futura limpieza.

Ninguno de estos puntos fue corregido en la réplica, porque hacerlo habría alterado el comportamiento publicado.

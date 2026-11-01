# Hobsbawm · Ajuste métrico a Corel · 01/11/2026

Pedido explícito: reproducir la mitad izquierda de la captura «Sin títuloO-1.png» en la página GitHub. El usuario confirma que fuentes y colores son los mismos y que las imágenes están a tamaño real. No se sustituyen familias, pesos o colores existentes.

## Retícula medida

La captura completa mide 2047 × 576 px. La referencia de Corel ocupa x=0…1014, con 1015 px de ancho. El fondo de Lectura comienza aproximadamente en y=127. La mitad derecha contiene además las barras del navegador y del sistema: se comparan las áreas de contenido, no las alturas completas de las dos mitades.

| Objeto | X en la referencia | Y desde el comienzo de Lectura | Ancho/alto o relación |
|---|---:|---:|---|
| Rótulo 04 · LECTURA | 38 | 24 aprox. | Fuente de 13 unidades |
| ESCUCHÁ, contorno visible | 197 | 51 con acento / 61 sin acento | Fuente Bebas Neue de 74 unidades |
| LEÉ, contorno visible | 450 | 22 | Fuente Bebas Neue de 120 unidades |
| ANOTÁ, contorno visible | 625 | 51 con acento / 61 sin acento | Fuente Bebas Neue de 72 unidades |
| Botón, caja principal | 261 | 149 | 488 × 104; ancho 48,0788 % |
| Inicio de la ficha | 197 | Autor: 280 aprox. | Ancho 470; 46,3054 % |
| Título bibliográfico | 197 | 301 aprox. | Fuente Archivo 700 de 18 unidades |
| Párrafo | 197 | 335 aprox. | Fuente Archivo 400 de 12,8; interlínea 19,2 |

Los bordes visibles de glifos no son sus cajas CSS. Se usa la métrica de Bebas Neue para ubicar las cajas en 194 / 445 / 624 y sus contornos aproximadamente en 197 / 450 / 625. Los dos verbos laterales bajan 24 unidades dentro de la fila. La primera línea del título comienza en 29 unidades y mide 120: el botón comienza en 149, sin depender de la altura del navegador o del progreso guardado.

La unidad CSS es el ancho real de Lectura dividido por 1015, con un máximo de composición de 2000 px. No depende del contenedor interior anterior. Todos los tamaños de escritorio escalan con esa retícula. El botón conserva la familia comercial local y sus fuentes alternativas existentes; su rótulo pasa de 9,7 a 8,6 % del ancho del botón y se redistribuyen los espacios interiores.

La sinopsis conserva exactamente el contenido de readerConfigs.js. Se recuperan los cuatro renglones de la referencia en escritorio con tres puntos de corte editoriales y distribución del espaciado. Por debajo de 1041 px vuelve al ajuste natural; móvil conserva la composición apilada y la legibilidad. No se altera el motor de lectura, documentos, tiempos, recursos ni almacenamiento.

Se elimina el velo de ruido del fondo, la placa translúcida exterior y la regla al pie. Se mantiene el botón con sus colores, borde, relieve, estados de foco, movimiento reducido y colores forzados. El progreso y el número de notas continúan disponibles en la descripción accesible del botón, sin ocupar una línea visual ausente en Corel.

## Validación

npm ci; test:library; test:two-works; test:hobsbawm; compilación y verificación de rutas y recursos en raíz y en la base de GitHub Pages. La previsualización local no resultó accesible desde el navegador de comprobación; la comprobación visual/funcional pública se registra al final del despliegue.

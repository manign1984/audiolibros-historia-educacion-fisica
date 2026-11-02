# Hobsbawm · Reequilibrio dimensional de 04 · LECTURA (02/11/2026)

Este ajuste responde a la evaluación de las proporciones de Lectura frente a Inicio, Autor, Contexto y Créditos. Preserva la composición conceptual `ESCUCHÁ · LEÉ · ANOTÁ`, los colores, las tipografías existentes y el relieve del acceso al lector. La maqueta métrica de Corel original está en `HOBSBAWM_COREL_MEDIDAS_2026-11-01.md`; sus valores siguen como registro histórico.

**Alcance limitado:** exclusivamente `portable-site/src/hobsbawm/hobsbawm-reading.css`. No cambian los otros cuatro bloques, Pineau, Orbuch, el motor `IntegratedReader.jsx`, los recursos, tiempos de audio, PDF, notas ni progreso.

**Calibraciones:** ancho máximo de retícula 1140 px en lugar de 2000; botón máximo aproximado de 548 px; `LEÉ` hasta 152 px, `ESCUCHÁ` hasta 84, `ANOTÁ` hasta 83; rótulo de bloque fijo en 12 px; texto del botón con máximo 40 px y altura mínima de botón adaptable de 86 a 115 px. El título bibliográfico usa 18–23 px y la sinopsis 15–18 px en escritorio. Se elimina el espaciado artificial y el `nowrap` de la sinopsis, se modera la asimetría entre ficha y botón y se reducen los saltos de escala en 740/741 y 380 px. La regla de altura natural, ahora suficientemente específica, se aplica **únicamente** a Lectura de Hobsbawm.

| Ancho de pantalla | LEÉ aprox. | ESCUCHÁ aprox. | Botón aprox. |
|---:|---:|---:|---:|
| 320px | 90px | 43px | 290px |
| 390px | 92px | 43px | 350px |
| 740px | 99px | 54px | 356px |
| 741px | 98px | 54px | 356px |
| 1024px | 135px | 75px | 492px |
| 1140px | 151px | 83px | 548px |
| 1363px | 151px | 83px | 548px |
| 1920px | 151px | 83px | 548px |

Los números son cálculos de CSS, no mediciones reales de navegador. La comprobación visual recomendada incluye 320, 390, 740, 741, 1024, 1363 y 1920 px. Ejecutar `npm ci`, `npm run test:library`, `npm run test:two-works`, `npm run test:hobsbawm`, `npm run build` y `npm run verify:build`; luego revisar apertura/cierre, audio y anotaciones en la página publicada.

# BEYOND THE STARS · Producción activa y continuidad entre chats

**Fecha del primer registro:** 08/11/2026. **Rama de referencia:** `main`.  
**Propósito:** registrar el estado operativo de la biblioteca, no reconstruir la historia de los chats.  
**Norma superior:** [Directrices canónicas vigentes (v2.3)](https://docs.google.com/document/d/1z0HqT7WR1A4u-RZRaFRINm9TWH5XWX8Lc_Vdj5q0aKM/edit).  
**Estado del catálogo:** corroborar siempre con `portable-site/src/biblioteca/catalog.js` y `portable-site/src/biblioteca/plannedWorks.js`.

## 1. Qué se está haciendo

**Tarea actual:** piloto Lucía Lionetti · *La función republicana de la escuela pública* (2005) **cerrado**. Tres etapas A/B/C completadas con texto académico íntegro, lector sin audio y cuaderno. PR #87 fusionada en `main` (commit `6b972f5260ff0113137256b8b97a3bcd666a8c66`). CI de la PR #87 aprobada (run `42445107697`) y GitHub Pages desplegado correctamente (run `42445185821`, `completed/success`). No se afirma auditoría visual desde navegador interactivo externo.
**Próxima tarea:** elegir la siguiente obra de la cola de producción y confirmar sus materiales. No volver a ejecutar las etapas de Lionetti ni añadirle audio sin pedido explícito.
**Objetivo de rendimiento:** al menos tres páginas por jornada con materiales completos; es una meta y no una afirmación de producción alcanzada.

Cada página tiene tres etapas de trabajo, no tres Work ni tres chats obligatorios:
- **A · Preparar:** reunir recursos facilitados, identificar edición y autoría, y definir el Contexto (1–3 pantallas).
- **B · Construir:** reutilizar los cinco bloques, el lector y las funciones comunes; integrar texto, MP3 y tiempos SRT/VTT.
- **C · Publicar:** pruebas técnicas mínimas de interfaz y reproducción, compilación, despliegue y apertura de URL real; registrar commit y estado del catálogo.

**Audio y subtítulos:** usar los tiempos recibidos. CERO investigaciones acústicas, CERO búsqueda de desfases o incompatibilidades. El responsable comunica el error perceptivo cuando exista; solo entonces se corrige el punto indicado. Prohibidas por defecto Whisper, CTC, alineación forzada, análisis de silencios y rondas de escucha.

## 2. Estado de catálogo confirmado el 08/11/2026

| Obra / grupo | Estado en código `main` | Acción pendiente asignada |
| --- | --- | --- |
| Carmen Lucia Soares, *Las corrientes gimnásticas europeas* | `available`; seguimiento aproximado por párrafos | Ninguna |
| Lucía Lionetti, *La función republicana de la escuela pública* | `text` («Solo lectura»), integrado mediante PR #87 y desplegado en Pages | Ninguna; versión solo texto disponible |
| Marcaida y Scaltritti, *La construcción del Estado nacional argentino* | `review` | Ninguna |
| Orbuch, Pineau/Fresco–Noble, Hobsbawm, Aisenstein/Tabla rasa y Scharagrodsky | `available` | Ninguna |
| Demás fichas de `plannedWorks.js` | `preparation` salvo las excepciones citadas | Elegir próximas obras solo con datos confirmados |

Los estados anteriores indican datos del catálogo, no una nueva auditoría perceptiva de todas las páginas. Verificar de nuevo el código antes de cambiarlos. La lista no establece un orden de producción.

## 3. Ficha de reanudación (una obra activa por vez)

| Campo | Valor vigente |
| --- | --- |
| Obra activa | Sin asignar (Lionetti terminada) |
| Etapa | — (Lionetti A/B/C completadas) |
| Rama / PR | PR #87 fusionada: https://github.com/manign1984/audiolibros-historia-educacion-fisica/pull/87 |
| Último commit recuperable | `6b972f5260ff0113137256b8b97a3bcd666a8c66` (`main`, Lionetti publicada) |
| Enlaces a originales | Lionetti: TXT https://drive.google.com/file/d/1wabrGO_C9oZaJZj0nv-fzEq9ukRaC5tD/view ; PDF https://drive.google.com/file/d/1FXGeM_sEvkKNpjrb1_6Z0bWTz7d9bBkZ/view ; revista https://ojs.rmie.mx/index.php/rmie/article/view/1511 |
| Incidencia real pendiente | Ninguna incidencia técnica abierta de Lionetti; no se efectuó evaluación visual manual del sitio público |
| **Próxima acción única** | Seleccionar próxima obra y localizar sus fuentes facilitadas |
| URL publicada | https://manign1984.github.io/audiolibros-historia-educacion-fisica/textos/lionetti-escuela-republicana/ (despliegue GitHub Pages #42445185821 exitoso; no inspección visual externa) |

Al iniciar una obra, completar únicamente estos campos. Al terminar una etapa A, B o C, **guardar un commit verificable y actualizar esta ficha antes de seguir**. No esperar al límite del chat. No crear un expediente nuevo para cada intercambio. Los materiales grandes permanecen en sus ubicaciones autorizadas; no poner texto académico, audio privado o credenciales en esta ficha.

## 4. Protocolo para iniciar o cambiar de chat

1. Leer este documento desde `main`, las Directrices vigentes enlazadas y **solo los archivos de la obra activa**.
2. Contrastar rama, PR y último commit con GitHub. No repetir etapas completadas.
3. Continuar la **próxima acción única**; trabajar sobre el código existente y guardar por hito importante.
4. Actualizar esta ficha y el estado del catálogo solo cuando se haya comprobado el cambio real.
5. Si hay un límite del chat, la siguiente conversación comienza con esta ficha, **sin reconstruir el trabajo anterior desde mensajes**.

**Texto corto para un nuevo chat:**
> Continuemos BEYOND THE STARS. Recuperá `documentation/PRODUCCION_ACTIVA.md` de `main` en `manign1984/audiolibros-historia-educacion-fisica` y las Directrices canónicas enlazadas. Retomá la próxima acción única. No repitas trabajos confirmados, no hagas investigaciones acústicas ni busques desfases. Guardá el código y actualizá la ficha tras cada etapa.

## 5. Jerarquía de fuentes y documentación histórica

1. Directrices canónicas vigentes: reglas generales, arquitectura, funciones y restricciones.
2. Este documento: estado actual, obra activa, prioridad y siguiente acción.
3. GitHub (código, ramas, PR, commits): evidencia de lo implementado.
4. Expedientes anteriores: historial, **no instrucciones operativas superiores**.

Los documentos `documentation/PRODUCCION_POR_ETAPAS_2026-11-06.md` y `documentation/PROTOCOLO_AUTONOMIA_V1_2026-11-06.md` describen procesos anteriores de 2–3 Work y estudios acústicos que quedan **sustituidos en esos puntos**. Conservarlos como referencia histórica. No copiar sus puertas antiguas a una obra nueva.

**Regla de mantenimiento:** una única fuente de estado vigente, mínima y actualizada al cerrar cada etapa. No introducir fechas, avances, permisos o publicaciones que no estén confirmados.

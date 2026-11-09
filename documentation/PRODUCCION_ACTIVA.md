# BEYOND THE STARS · Producción activa y continuidad entre chats

**Fecha del primer registro:** 08/11/2026. **Rama de referencia:** `main`.  
**Propósito:** registrar el estado operativo de la biblioteca, no reconstruir la historia de los chats.  
**Norma superior:** [Directrices canónicas vigentes (v2.3)](https://docs.google.com/document/d/1z0HqT7WR1A4u-RZRaFRINm9TWH5XWX8Lc_Vdj5q0aKM/edit).  
**Estado del catálogo:** corroborar siempre con `portable-site/src/biblioteca/catalog.js` y `portable-site/src/biblioteca/plannedWorks.js`.

## 1. Qué se está haciendo

**Tarea actual:** Lucía Lionetti · *La función republicana de la escuela pública* (2005): actualización audiovisual dividida en tramos. **Etapa 1 — recursos validada por CI #42506600493 (success):** MP3 original de 37.021.265 bytes (SHA-256 `99d49c1e3985a61e7209f01f8d17978ba2a3e172da186dd0a251e0d6a5e6ebe0`) dividido en 63 fragmentos binarios consecutivos sin modificación; cada hash de GitHub contrastado con su segmento original (63/63 coincidentes). SRT original: 82.882 bytes, 747 subtítulos, SHA-256 `89616a56a51c18cd8b193c28bd04661bc62d321ea9a09f9e6a9412ac9fce7612`; sintaxis y numeración comprobadas. No se investigaron desfases acústicos. La página publicada sigue siendo la edición de solo texto hasta completar la etapa 2.
**Tramo 2A/2B — implementación de base guardada en rama:** se agregó `lionettiSubtitles.js` (parser y búsqueda temporal por marcas originales SRT), `LionettiAudioPlayer.jsx` (63 partes del MP3 reconstruidas en memoria, reproducción sin autoplay, pausar, saltos de 10 s, posición, velocidades, subtítulo activo y enlace de respaldo), `lionetti-audio.css` y la configuración de Lionetti; `TextOnlyReader.jsx` recibe un reproductor opcional sin reemplazar el cuaderno ni su almacenamiento por página. Último commit de implementación `34c6b893affcd55b91751518449ee176b7dfd6b8`. **Fase 2B.1 (09/11) — validación técnica en curso:** detectado y corregido un fallo real del CI: la validación general excluía lectores con texto paginado y audio (`unregistered-work`). Ahora `pageAudioWorks` queda comprobado en el validador compartido, incluyendo bytes/hash del MP3 fragmentado, SRT, páginas y claves de guardado. Se corrigió también el metadato HTML que seguía indicando «sin audiolibro». El catálogo y los créditos ya están actualizados en la rama; `main` todavía conserva la página anterior. **Próxima fase 2B.2:** confirmar CI final, probar visualmente escritorio/móvil y reproducción real, fusionar PR #93, verificar Pages y registrar el cierre. No se realiza validación acústica.
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
| Lucía Lionetti, *La función republicana de la escuela pública* | `text` («Solo lectura») en `main`; recursos MP3 y SRT completos en la rama de etapa 1 | Etapa 2: lector con audio, subtítulos, pruebas, catálogo y publicación |
| Marcaida y Scaltritti, *La construcción del Estado nacional argentino* | `review` | Ninguna |
| Orbuch, Pineau/Fresco–Noble, Hobsbawm, Aisenstein/Tabla rasa y Scharagrodsky | `available` | Ninguna |
| Demás fichas de `plannedWorks.js` | `preparation` salvo las excepciones citadas | Elegir próximas obras solo con datos confirmados |

Los estados anteriores indican datos del catálogo, no una nueva auditoría perceptiva de todas las páginas. Verificar de nuevo el código antes de cambiarlos. La lista no establece un orden de producción.

## 3. Ficha de reanudación (una obra activa por vez)

| Campo | Valor vigente |
| --- | --- |
| Obra activa | Lucía Lionetti · actualización audiovisual |
| Etapa | **Fase 2B.1: correcciones del validador y metadatos implementadas, CI en ejecución**. Próxima: **fase 2B.2, aceptación visual, publicación y cierre** |
| Rama / PR | Rama `feature/lionetti-audiolibro-srt-20261108` (no fusionar hasta finalizar etapa 2) |
| Último commit recuperable | `e27f1f4db2e335193cf1ebdaecf83c2497b1dacf` (correcciones de validación y metadatos; comprobar `head` por posteriores checkpoints) |
| Enlaces a originales | Lionetti: MP3 https://drive.google.com/file/d/11KrL0qxhvKtNVIzJEef1B-Oyrai-oPHX/view ; SRT https://drive.google.com/file/d/1LZLftX99lQqndt723ag7CkA9cJljlZPB/view ; TXT https://drive.google.com/file/d/1wabrGO_C9oZaJZj0nv-fzEq9ukRaC5tD/view ; PDF https://drive.google.com/file/d/1FXGeM_sEvkKNpjrb1_6Z0bWTz7d9bBkZ/view |
| Incidencia real pendiente | Falta resultado de CI para la última corrección y prueba interactiva real en navegador. El lector está implementado, pero **todavía no está publicado**. Los permisos de edición en Drive no equivalen a licencia abierta. |
| **Próxima acción única** | **Fase 2B.2:** verificar CI final de PR #93; probar carga del lector, subtítulo vigente, reproducción/pausa, notas y móvil en navegador; fusionar si aprobado, comprobar GitHub Pages y actualizar este registro en `main` |
| URL publicada | https://manign1984.github.io/audiolibros-historia-educacion-fisica/textos/lionetti-escuela-republicana/ (GitHub Pages #42449696287: success; sin inspección visual externa) |

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

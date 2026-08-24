# Guía de migración y despliegue

## 1. Qué se entrega

`portable-site/` es una aplicación React estática. No requiere ChatGPT Sites, Vinext, Cloudflare Workers, base de datos ni servidor de aplicación.

La lógica de interfaz se conserva literalmente. Solo se añadieron archivos de compilación para Vite puro.

## 2. Requisitos

- Node.js `20.19+` o `22.12+`.
- npm.
- Un hosting estático con HTTPS.

## 3. Desarrollo local

```bash
cd portable-site
npm install
npm run dev
```

## 4. Compilación reproducible

```bash
cd portable-site
npm ci
npm run build
```

El directorio resultante es `portable-site/dist/`.

## 5. Despliegue

Subir el contenido de `dist/` a la raíz del dominio o subdominio elegido. No subir la carpeta `dist` como un nivel adicional si el proveedor espera los archivos públicos directamente.

La aplicación tiene una única ruta y navegación por fragmentos, por lo que no necesita reglas de reescritura de SPA para rutas internas. Debe servirse `index.html` en `/` y el directorio `assets/` en `/assets/`.

### Condición importante: raíz del dominio

El código recuperado usa rutas absolutas como `/assets/pineau-audiolibro.mp3`. Para conservarlo literalmente, el despliegue debe ocupar la raíz. Una URL como `https://ejemplo.org/proyecto/` requeriría adaptar las rutas o configurar una raíz virtual; esa adaptación no está incluida.

## 6. Configuración recomendada del hosting

- HTTPS obligatorio para Web Share y Clipboard.
- Tipos MIME correctos para MP3, PDF, WebP, WOFF y WOFF2.
- Compresión Brotli o gzip para JS/CSS/fuentes.
- caché larga para recursos versionados, con una política más corta para `index.html`;
- soporte de solicitudes normales para el MP3; el código descarga el archivo completo mediante `fetch`;
- encabezados de seguridad definidos por infraestructura, especialmente CSP, `X-Content-Type-Options`, `Referrer-Policy` y permisos apropiados.

Una CSP debe contemplar, si se conserva el comportamiento exacto, Wikimedia Commons para cuatro imágenes, `youtube-nocookie.com` para el iframe y los destinos externos usados por enlaces. Probar la política antes de activarla de forma estricta.

## 7. Verificación posterior al despliegue

1. Abrir `/` y comprobar el título.
2. Recorrer las siete anclas.
3. Confirmar que cargan fuentes, imágenes, MP3 y PDF.
4. Llevar el carrusel hasta `1943 / 18/18`.
5. Abrir el lector, saltar a un capítulo, reproducir y confirmar el resaltado.
6. Crear una nota, recargar y confirmar que reaparece.
7. Completar una ronda del Partido.
8. Escribir en Conciencia histórica, recargar y confirmar persistencia.
9. Probar al menos 390 px, 768 px y escritorio.
10. Revisar consola y red, en especial las cuatro imágenes remotas y YouTube.

## 8. Continuidad de notas y progreso

Los datos existentes en el dominio publicado no aparecerán en el dominio nuevo porque `localStorage` se separa por origen.

Opciones para una fase posterior:

- comunicar a los usuarios que exporten sus notas antes del cambio;
- añadir un importador JSON compatible con el formato exportado;
- crear una herramienta de transferencia que se ejecute en el dominio anterior y solicite consentimiento;
- incorporar un backend con cuentas y sincronización, si el proyecto lo requiere.

Todas esas opciones cambian el producto y deben diseñarse, probarse y documentarse como una versión nueva. La réplica entregada no las agrega.

## 9. Independizar dependencias externas

Para una migración completamente autocontenida, una fase posterior puede:

- descargar las cuatro imágenes de Wikimedia respetando autoría, licencia y créditos;
- evaluar un reemplazo o una alternativa local al video de YouTube;
- mantener el audio local y retirar el enlace de respaldo de Drive si ya no corresponde;
- revisar todos los enlaces de fuentes periódicamente.

No se hizo esa modificación en este paquete para no alterar recursos, créditos ni comportamiento de red sin una decisión editorial.

## 10. Fuente de verdad para audio–texto

- Usar `src/readingDocument.js` o `data/reading-sync_exact.json` para reproducir exactamente la sincronización actual.
- No tratar `data/reading-sync_reconstructed-from-site.srt` como SRT original de ElevenLabs.
- El generador literal `scripts/generate-reading-document-from-srt.mjs` puede regenerar el módulo si en el futuro se recupera el SRT original, pero requiere revisar el flujo de alineación y la migración de IDs antes de reemplazar datos publicados.

## 11. Reversibilidad

El respaldo previo contiene un bundle Git completo y un archivo del árbol fuente. En caso de necesitar restaurar o comparar:

```bash
git clone fresco-noble_repository_complete_7882327.bundle restaurado
git -C restaurado checkout 7882327b5bf619ba81335d136e9eddc96cf894c9
```

Verificar siempre `SHA256SUMS.txt` antes de usar el respaldo.


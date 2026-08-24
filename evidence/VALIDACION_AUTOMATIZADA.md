# Validación automatizada

## Código literal

- `src/`: comparación recursiva sin diferencias.
- `public/assets/`: comparación recursiva sin diferencias.
- `index.html`: comparación byte a byte sin diferencias.
- `scripts/generate-reading-document-from-srt.mjs`: comparación byte a byte sin diferencias.

## Datos

- 36 recursos locales inventariados.
- 32 URLs externas inventariadas.
- 201 unidades audio–texto en JSON.
- 201 cues en el SRT reconstruido.
- JSON validado sintácticamente.

## Compilación

- Vite `8.1.4`: compilación aprobada.
- 1577 módulos transformados.
- 77 archivos en `dist/`.
- MP3 y PDF presentes en la salida.

## Paquetes

- ZIP completo: 74 entradas; 36 recursos originales; sin `node_modules`, `dist` ni entregables anidados.
- ZIP estático: `index.html`, MP3, PDF y recursos presentes.
- Ambos ZIP aprobaron `unzip -t`.
- `SHA256SUMS.txt` aprobó la verificación de los dos ZIP y de `LEEME.md`.

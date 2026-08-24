# Instrucciones del repositorio

## Estructura

- La aplicación ejecutable está en `portable-site/`.
- La auditoría y las pruebas están en `documentation/`.
- Los inventarios y la sincronización extraída están en `data/`.
- La evidencia del estado publicado está en `evidence/`.

## Comandos

Ejecutar desde `portable-site/`:

```bash
npm ci
npm run build
npm run dev
```

## Fidelidad

Antes de cambiar la aplicación, leer `documentation/MATRIZ_DE_FIDELIDAD.md`.

No modificar sin una solicitud explícita:

- `portable-site/index.html`;
- `portable-site/src/**`;
- `portable-site/public/assets/**`;
- `portable-site/scripts/generate-reading-document-from-srt.mjs`.

Esos archivos fueron recuperados literalmente del Site v57. Si un cambio futuro los afecta, documentar la diferencia, ejecutar la compilación y repetir las pruebas funcionales y responsive pertinentes.

## Verificación mínima

- `npm ci` y `npm run build` deben finalizar correctamente.
- Confirmar que el MP3, el PDF y los 36 recursos locales estén presentes.
- No versionar `node_modules/` ni `portable-site/dist/`.
- Revisar que no existan secretos o credenciales.
- No crear despliegues ni activar GitHub Pages salvo pedido explícito.


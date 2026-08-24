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
npm run test:library
npm run test:two-works
npm run build
npm run dev
```

## Fidelidad

Antes de cambiar la aplicación, leer `documentation/MATRIZ_DE_FIDELIDAD.md`.

No modificar sin una solicitud explícita y trazabilidad:

- `portable-site/index.html`;
- `portable-site/src/**`;
- `portable-site/public/assets/**`;
- `portable-site/scripts/generate-reading-document-from-srt.mjs`.

Los archivos de Pineau clasificados como literales fueron recuperados del Site v57. Orbuch y el lector compartido fueron incorporados posteriormente. Consultar `documentation/MATRIZ_DE_FIDELIDAD.md` para distinguirlos. Si un cambio futuro los afecta, documentar la diferencia, ejecutar la compilación y repetir las pruebas funcionales y responsive pertinentes.

## Verificación mínima

- `npm ci` y `npm run build` deben finalizar correctamente.
- Confirmar que los recursos de ambas obras estén presentes.
- Confirmar que Pineau y Orbuch importen el mismo `IntegratedReader.jsx`.
- No agregar tiempos de Orbuch hasta disponer de una fuente temporal real verificada.
- No versionar `node_modules/` ni `portable-site/dist/`.
- Revisar que no existan secretos o credenciales.
- No crear despliegues ni activar GitHub Pages salvo pedido explícito.

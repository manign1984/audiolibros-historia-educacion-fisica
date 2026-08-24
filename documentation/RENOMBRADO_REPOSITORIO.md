# Renombrado del repositorio de la biblioteca

## Identidad pública

El repositorio pasa de `reforma-fresco-noble` a `audiolibros-historia-educacion-fisica` para que la URL represente al proyecto general y no solamente a su primera obra.

| Elemento | Anterior | Nuevo |
|---|---|---|
| Repositorio | `manign1984/reforma-fresco-noble` | `manign1984/audiolibros-historia-educacion-fisica` |
| Biblioteca | `https://manign1984.github.io/reforma-fresco-noble/` | `https://manign1984.github.io/audiolibros-historia-educacion-fisica/` |
| Fresco–Noble | `…/reforma-fresco-noble/textos/pineau-fresco-noble/` | `…/audiolibros-historia-educacion-fisica/textos/pineau-fresco-noble/` |

## Estrategia técnica

Los workflows ya no contienen un subdirectorio fijo. Durante cada ejecución toman el nombre vigente desde `GITHUB_REPOSITORY` y definen:

```bash
GITHUB_PAGES_BASE="/${GITHUB_REPOSITORY#*/}/"
```

Vite usa ese valor como `base`, por lo que los documentos HTML, los bundles, las fuentes, las imágenes, el PDF, el MP3 y los enlaces internos se generan con el prefijo correcto. La compilación local para raíz continúa usando `/`.

La transición se preparó desde el SHA de `main` `82565cc313e8bb74a35fd2d2c30fc409cfaca548` en la rama `chore/renombrar-biblioteca`.

## Transición

1. revisar y aprobar los cambios de esta rama;
2. renombrar el repositorio en GitHub;
3. fusionar la Pull Request ya preparada en el repositorio renombrado;
4. esperar el despliegue de Pages y comprobar las dos URL nuevas;
5. actualizar enlaces, marcadores e incrustaciones que todavía usen la dirección anterior.

GitHub redirige el repositorio y las operaciones Git después de un cambio de nombre, pero las URL de los sitios de proyecto de GitHub Pages son una excepción. Por eso la dirección anterior de la página no debe considerarse un redireccionamiento permanente.

## Alcance editorial

Este cambio modifica únicamente la identidad técnica del repositorio, la documentación y el `base` de publicación. No altera el catálogo, la referencia APA, la interfaz de la biblioteca, el contenido de Fresco–Noble, el lector, la sincronización, el audio, las notas ni los recursos.

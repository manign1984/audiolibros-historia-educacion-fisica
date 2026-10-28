import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { LIBRARY_CONFIG, catalog } from './src/biblioteca/catalog.js';

const configuredBase = process.env.GITHUB_PAGES_BASE || '/';
const base = configuredBase.endsWith('/') ? configuredBase : `${configuredBase}/`;

function preservePublicAssetPaths() {
  return {
    name: 'preserve-public-asset-paths',
    enforce: 'pre',
    transform(code, id) {
      if (base === '/' || !/[\\/]src[\\/].+\.(?:js|jsx|css)$/.test(id)) {
        return null;
      }

      const transformed = code.replaceAll('/assets/', `${base}assets/`);
      return transformed === code ? null : { code: transformed, map: null };
    },
  };
}

function libraryMetadata() {
  return {
    name: 'library-metadata',
    transformIndexHtml(html) {
      return html
        .replaceAll('__LIBRARY_NAME__', LIBRARY_CONFIG.name)
        .replaceAll('__LIBRARY_DESCRIPTION__', LIBRARY_CONFIG.description);
    },
  };
}

export default defineConfig({
  base,
  plugins: [libraryMetadata(), preservePublicAssetPaths(), react()],
  build: {
    rollupOptions: {
      input: {
        biblioteca: fileURLToPath(new URL('./index.html', import.meta.url)),
        orbuchEducarAlCuerpo: fileURLToPath(new URL('./textos/orbuch-educar-al-cuerpo/index.html', import.meta.url)),
        pineauFrescoNoble: fileURLToPath(new URL('./textos/pineau-fresco-noble/index.html', import.meta.url)),
        hobsbawmHistoriaSigloXX: fileURLToPath(new URL('./textos/hobsbawm-historia-siglo-xx/index.html', import.meta.url)),
        ...Object.fromEntries(catalog.filter((entry) => entry.status === 'preparation').map((entry) => [entry.id, fileURLToPath(new URL(`./${entry.path}index.html`, import.meta.url))])),
      },
    },
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: ['terminal.local'],
  },
  preview: {
    host: '0.0.0.0',
  },
});

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

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

export default defineConfig({
  base,
  plugins: [preservePublicAssetPaths(), react()],
  server: {
    host: '0.0.0.0',
  },
  preview: {
    host: '0.0.0.0',
  },
});

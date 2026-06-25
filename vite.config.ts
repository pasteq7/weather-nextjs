import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: '**/*.svg',
      svgrOptions: {
        svgProps: {
          fill: 'currentColor',
        },
        replaceAttrValues: {
          '#000': 'currentColor',
          '#fff': 'currentColor',
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': rootDir,
      'next-intl': path.resolve(rootDir, 'lib/i18n-compat.tsx'),
    },
  },
});

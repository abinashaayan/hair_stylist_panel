import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false,
    },
  },
  optimizeDeps: {
    include: [
      '@mui/x-data-grid',
      '@mui/x-data-grid-pro',
      'lucide-react',
      'firebase/app',
      'firebase/messaging'
    ],
    exclude: ['firebase-components'],
  },
  resolve: {
    alias: [
      {
        find: /^@mui\/x-data-grid\/models\/cursorCoordinates$/,
        replacement: '@mui/x-data-grid/models/cursorCoordinates.js',
      },
      {
        find: /^\.\/icons\/text-cursor-input\.js$/,
        replacement: 'lucide-react/dist/esm/icons/text-cursor-input.js',
      },
      {
        find: /^\.\/icons\/text-cursor\.js$/,
        replacement: 'lucide-react/dist/esm/icons/text-cursor.js',
      }
    ]
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  }
});
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ScoutChat',
      fileName: () => 'widget.umd.js',
      formats: ['umd'],
    },
    rollupOptions: {
      // Do not externalize any dependencies to produce a fully self-contained bundle
      external: [],
      output: {
        globals: {},
      },
    },
  },
});

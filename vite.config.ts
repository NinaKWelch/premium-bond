import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '#api': resolve(import.meta.dirname, 'src/api'),
      '#components': resolve(import.meta.dirname, 'src/components'),
      '#constants': resolve(import.meta.dirname, 'src/constants'),
      '#context': resolve(import.meta.dirname, 'src/context'),
      '#schemas': resolve(import.meta.dirname, 'src/schemas'),
      '#types': resolve(import.meta.dirname, 'src/types'),
      '#utils': resolve(import.meta.dirname, 'src/utils'),
    },
  },
  test: {
    environment: 'node',
  },
});

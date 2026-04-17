import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

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
    env: {
      NEXT_PUBLIC_API_BASE_URL: 'http://localhost:3000/api/bonds',
    },
  },
});

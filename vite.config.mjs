import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the site from /hackersnew-react/, so the build needs that base path.
// The dev server keeps using "/".
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/hackersnew-react/' : '/',
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  test: {
    environment: 'jsdom',
  },
}));

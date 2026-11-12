import { defineConfig } from 'vite';

export default defineConfig({
  // Relative asset paths allow deployment under a sub-path as well as a domain root.
  base: './',
  build: {
    target: 'es2022',
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    cssMinify: 'lightningcss',
    reportCompressedSize: true,
  },
  server: {
    host: '0.0.0.0',
    strictPort: true,
  },
});

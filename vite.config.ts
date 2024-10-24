import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      name: 'JsonHelper',
      fileName: (format) => `json-helper.${format}.js`,
    },
  },
});

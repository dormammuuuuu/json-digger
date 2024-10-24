import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      name: 'JsonHelper',
      fileName: (format) => `json-helper.${format}.js`,
      formats: ['umd', 'es']
    },
    rollupOptions: {
      output: {
        globals: {
          'json-helper': 'JSONHelper',
        },
      },
    },
  },
});

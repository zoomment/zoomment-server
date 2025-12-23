import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts'],
  format: ['cjs'],
  outDir: 'dist',
  target: 'es2016',
  clean: true,
  splitting: false,
  sourcemap: false
});

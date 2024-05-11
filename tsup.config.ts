import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['lib', '!lib/**/*.test.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: true,
  sourcemap: false,
});

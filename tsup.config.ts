import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['lib', '!lib/**/*.test.ts', '!lib/**/*.spec.ts', '!lib/mocks'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: true,
  sourcemap: false,
});

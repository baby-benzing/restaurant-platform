import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // Disable for now due to TypeScript issues
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['@prisma/client'],
});
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['**/*.{test,spec,teste}.?(c|m)[jt]s?(x)'],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./__testes__/setup/indexeddb.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        '__testes__/',
        'src/main.tsx',
        'src/**/*.d.ts',
        'src/estilos/**',
        'src/vite-env.d.ts',
      ],
      // Gate atual de cobertura em 80%; meta planejada: elevar para 95%.
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      reporter: ['text', 'json', 'json-summary', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})


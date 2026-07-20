import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      exclude: [
        '**/*.stories.*',
        '**/*.config.*',
        'src/test/**',
        '**/types/**',
        'src/app/**',
        '**/*.types.ts',
        '**/index.ts',
        'src/components/ai-elements/**',
        'src/components/ui/**',
      ],
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      }
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

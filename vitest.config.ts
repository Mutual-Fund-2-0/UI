import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      clearMocks: true,
      css: true,
      environment: 'jsdom',
      exclude: [...configDefaults.exclude],
      globals: true,
      root: fileURLToPath(new URL('./', import.meta.url)),
      setupFiles: ['./src/setupTests.ts']
    }
  })
)

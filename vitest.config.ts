import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      clearMocks: true,
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'cypress/**', '**/*.cy.{js,ts,jsx,tsx}'],
      globals: true,
      root: fileURLToPath(new URL('./', import.meta.url)),
      setupFiles: ['vitest.setup.ts'],
      server: {
        deps: {
          inline: ['vuetify']
        }
      }
    }
  })
)

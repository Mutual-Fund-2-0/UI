/// <reference types='cypress' />

export default {
  env: {
    'cypress/globals': true
  },
  component: {
    viewportWidth: 1000,
    viewportHeight: 660,
    devServer: {
      framework: 'vue',
      bundler: 'vite'
    }
  },
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(_on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
      return config
    }
  }
}

export default {
  env: {
    "cypress/globals": true
  },
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite"
    }
  },
  e2e: {
    baseUrl: "http://localhost:5173",
    pageLoadTimeout: 120_000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config
    }
  }
}

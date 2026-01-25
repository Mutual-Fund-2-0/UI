export default {
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite"
    }
  },
  env: {
    'cypress/globals': true
  }
}

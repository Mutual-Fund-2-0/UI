/* eslint-disable @typescript-eslint/no-namespace */
// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
import { mount } from 'cypress/vue'
import { createVuetify } from 'vuetify'
// Import commands.js using ES2015 syntax:
import './commands'

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

const vuetify = createVuetify()

Cypress.Commands.add('mount', (component, options = {}) => {
  const globalOptions = options.global || {}
  const existingPlugins = globalOptions.plugins || []
  return mount(component, {
    ...options,
    global: {
      ...globalOptions,
      plugins: [...existingPlugins, vuetify]
    }
  })
})
// Example use:
// cy.mount(MyComponent)

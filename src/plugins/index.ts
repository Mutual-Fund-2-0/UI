/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */
// Types
import type { App } from 'vue'

import { createPinia } from 'pinia'
// Plugins
import router from '../router'
import vuetify from './vuetify'

export function registerPlugins(app: App) {
  app.use(vuetify).use(router).use(createPinia())
}

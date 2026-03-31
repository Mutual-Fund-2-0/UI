import 'vuetify/styles'
import { config } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

window.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const vuetify = createVuetify({
  components,
  directives,
})

config.global.plugins = [vuetify]
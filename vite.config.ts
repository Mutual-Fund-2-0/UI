import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Fonts from 'unplugin-fonts/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    vueJsx(),
    vueDevTools(),
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss'
      }
    }),
    Components({
      dts: 'src/components.d.ts'
    }),
    Fonts({
      fontsource: {
        families: [
          {
            name: 'Roboto',
            styles: ['normal', 'italic'],
            weights: [100, 300, 400, 500, 700, 900]
          }
        ]
      }
    })
  ],
  optimizeDeps: {
    exclude: [
      'vuetify'
    ]
  },
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '@v': fileURLToPath(new URL('src/views', import.meta.url)),
      '@t': fileURLToPath(new URL('src/types', import.meta.url)),
      '@r': fileURLToPath(new URL('src/router', import.meta.url)),
      '@s': fileURLToPath(new URL('src/services', import.meta.url)),
      '@c': fileURLToPath(new URL('src/components', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ]
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ''
  }
})

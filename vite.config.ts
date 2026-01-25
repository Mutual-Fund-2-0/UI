import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@v': fileURLToPath(new URL('./src/views', import.meta.url)),
      '@t': fileURLToPath(new URL('./src/types', import.meta.url)),
      '@r': fileURLToPath(new URL('./src/router', import.meta.url)),
      '@s': fileURLToPath(new URL('./src/services', import.meta.url)),
      '@c': fileURLToPath(new URL('./src/components', import.meta.url))
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ''
  }
})

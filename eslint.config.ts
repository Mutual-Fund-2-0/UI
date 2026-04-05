import pluginVitest from '@vitest/eslint-plugin'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import vuetify from 'eslint-config-vuetify'
import pluginCypress from 'eslint-plugin-cypress'
import pluginOxlint from 'eslint-plugin-oxlint'
import pluginVue from 'eslint-plugin-vue'
import { globalIgnores } from 'eslint/config'

const vuetifyConfig = await vuetify()

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup
export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}']
  },
  vuetifyConfig,
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),
  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
    ...pluginCypress.configs.recommended,
    files: ['cypress/**/*.{cy,spec}.{js,ts,jsx,tsx}', 'cypress/support/**/*.{js,ts}']
  },
  {
    ...pluginVitest.configs.recommended,
    files: ['vitest/**/*', 'vitest/**/*.{test,spec}.{js,ts,jsx,tsx}']
  },
  skipFormatting,
  ...pluginOxlint.configs['flat/recommended']
)

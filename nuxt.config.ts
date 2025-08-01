// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@pinia/nuxt'
  ],

  css: ['~/assets/css/main.css'],
  devServer: {
    port: 3001
  },
  compatibilityDate: '2025-07-16'
})
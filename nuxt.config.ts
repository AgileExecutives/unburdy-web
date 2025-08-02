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

  runtimeConfig: {
    // Private keys (only available on server-side)
    apiToken: process.env.NUXT_API_TOKEN,
    
    // Public keys (exposed to client-side)
    public: {
      apiBaseUrl: process.env.NUXT_API_BASE_URL || 'https://api.unburdy.com',
      unburdyApp: process.env.NUXT_UNBURDY_APP || 'https://app.unburdy.com'
    }
  },

  compatibilityDate: '2025-07-16'
})
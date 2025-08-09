// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@nuxt/eslint', '@pinia/nuxt', 'nuxt-umami'],

  css: ['~/assets/css/main.css'],

  devServer: {
    port: 3001
  },

  // Hybrid rendering configuration
  nitro: {
    prerender: {
      routes: [
        '/',
        '/preise',
        '/idee-hinter-unburdy',
        '/legal/impressum',
        '/legal/datenschutz',
        '/legal/agb',
        '/legal/kontakt'
      ]
    }
  },

  // Route-specific rendering rules
  routeRules: {
    // Static pages - pre-rendered at build time
    '/': { prerender: true, headers: { 'cache-control': 's-maxage=31536000' } },
    '/preise': { prerender: true, headers: { 'cache-control': 's-maxage=86400' } },
    '/idee-hinter-unburdy': { prerender: true, headers: { 'cache-control': 's-maxage=86400' } },
    '/legal/**': { prerender: true, headers: { 'cache-control': 's-maxage=604800' } },

    // Dynamic pages - server-side rendered
    '/anmelden': { ssr: true, headers: { 'cache-control': 'no-cache' } },
    '/onboarding/**': { ssr: true, headers: { 'cache-control': 'no-cache' } },

    // API routes - always server-side
    '/api/**': { ssr: true, prerender: false }
  },

  umami: {
    id: process.env.NUXT_PUBLIC_UMAMI_SITE_ID || '',
    host: '/api/umami-proxy',
    autoTrack: true,
    ignoreLocalhost: false,
    proxy: 'cloak',
    logErrors: false
  },

  runtimeConfig: {
    // Private keys (only available on server-side)
    apiToken: process.env.NUXT_API_TOKEN,
    apiBaseUrl: process.env.NUXT_API_BASE_URL || 'https://api.unburdy.de',
    csrfSecret: process.env.NUXT_CSRF_SECRET || 'fallback-secret-change-in-production',
    logLevel: process.env.NUXT_LOG_LEVEL || 'debug', // debug, info, warn, error

    // Public keys (exposed to client-side)
    public: {
      unburdyApp: process.env.NUXT_UNBURDY_APP || 'https://app.unburdy.de',
      umamiHost: process.env.NUXT_PUBLIC_UMAMI_HOST || 'https://analytics.unburdy.de',
      umamiSiteId: process.env.NUXT_PUBLIC_UMAMI_SITE_ID || '',
    }
  },

  compatibilityDate: '2025-07-16'
})
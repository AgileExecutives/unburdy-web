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

  // Optimize for analytics and performance
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://analytics.unburdy.de' }
      ],
      script: [
        {
          src: process.env.NUXT_PUBLIC_UMAMI_URL,
          async: true,
          'data-website-id': process.env.NUXT_PUBLIC_UMAMI_SITE_ID
        }
      ]
    }
  },

  runtimeConfig: {
    // Private keys (only available on server-side)
    apiToken: process.env.NUXT_API_TOKEN,
    apiBaseUrl: process.env.NUXT_API_BASE_URL || 'https://api.unburdy.de',
    csrfSecret: process.env.NUXT_CSRF_SECRET || 'fallback-secret-change-in-production',
    logLevel: process.env.NUXT_LOG_LEVEL || 'debug', // debug, info, warn, error

    // Public keys (exposed to client-side)
    public: {
      unburdyApp: process.env.NUXT_UNBURDY_APP || 'https://app.unburdy.de/api/v1',
      // Analytics configuration
      umamiUrl: process.env.NUXT_PUBLIC_UMAMI_URL || 'https://analytics.unburdy.de/script.js',
      umamiSiteId: process.env.NUXT_PUBLIC_UMAMI_SITE_ID || '',
      domain: process.env.NUXT_PUBLIC_DOMAIN || 'unburdy.de'
    }
  },

  compatibilityDate: '2025-07-16'
})
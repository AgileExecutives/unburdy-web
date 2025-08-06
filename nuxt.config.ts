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
        // Preconnect to analytics domain for faster loading
        {
          rel: 'preconnect',
          href: 'https://analytics.unburdy.de'
        }
      ]
    }
  },

  runtimeConfig: {
    // Private keys (only available on server-side)
    apiToken: process.env.NUXT_API_TOKEN,
    csrfSecret: process.env.NUXT_CSRF_SECRET || 'fallback-secret-change-in-production',
    
    // Public keys (exposed to client-side)
    public: {
      apiBaseUrl: process.env.NUXT_API_BASE_URL || 'https://api.unburdy.com',
      unburdyApp: process.env.NUXT_UNBURDY_APP || 'https://app.unburdy.com',
      // Analytics configuration
      umamiUrl: process.env.NUXT_PUBLIC_UMAMI_URL || 'https://analytics.eu.umami.is/script.js',
      umamiSiteId: process.env.NUXT_PUBLIC_UMAMI_SITE_ID || '',
      domain: process.env.NUXT_PUBLIC_DOMAIN || 'unburdy.com'
    }
  },

  compatibilityDate: '2025-07-16'
})
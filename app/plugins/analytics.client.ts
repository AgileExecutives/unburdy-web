export default defineNuxtPlugin({
  name: 'analytics',
  parallel: true,
  setup() {
    // Only initialize on client-side (perfect for prerendered pages)
    if (process.client) {
      const config = useRuntimeConfig()
      
      // Preload Umami script for better performance
      useHead({
        link: [
          {
            rel: 'preload',
            href: (config.public.umamiHost as string + '/script.js') || 'https://analytics.unburdy.de/script.js',
            as: 'script',
            crossorigin: 'anonymous'
          }
        ]
      })

      // Load Umami script after critical content
      const loadUmami = () => {
        useHead({
          script: [
            {
              src: (config.public.umamiHost as string + '/script.js') || 'https://analytics.unburdy.de/script.js',
              'data-website-id': config.public.umamiSiteId as string,
              'data-domains': (config.public.domain as string) || 'unburdy.de',
              async: true,
              defer: true
            }
          ]
        })
      }

      // Initialize campaign tracking when router is ready
      const router = useRouter()
      
      router.afterEach((to, from) => {
        // Track page views with campaign context (after hydration)
        nextTick(() => {
          const { trackPageView } = useAnalytics()
          trackPageView(to.path, {
            referrer: from.path || document.referrer,
            title: document.title,
            prerendered: to.meta?.prerender || false
          })
        })
      })

      // Load analytics after page is interactive (better for prerendered pages)
      onMounted(() => {
        // Small delay to prioritize critical content rendering
        setTimeout(() => {
          loadUmami()
          
          // Track initial page view for prerendered pages
          const { trackPageView } = useAnalytics()
          trackPageView(window.location.pathname, {
            initial_load: true,
            prerendered: true,
            title: document.title
          })
        }, 800) // 800ms delay for optimal performance
      })

      // Clean URL parameters after tracking is complete
      onMounted(() => {
        setTimeout(() => {
          const { cleanUrl } = useAnalytics()
          cleanUrl()
        }, 3000) // Wait longer to ensure all tracking is complete
      })
    }
  }
})

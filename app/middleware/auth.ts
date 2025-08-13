export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware during SSR
  if (process.server) return

  // Skip auth check for public pages and verification pages
  const publicPages = ['/lc/anmelden', '/', '/idee-hinter-unburdy', '/preise', '/legal/impressum', '/legal/agb', '/legal/datenschutz', '/legal/kontakt', '/onboarding/verification']
  if (publicPages.includes(to.path) || to.path.startsWith('/onboarding/verification/')) {
    return
  }

  // Allow onboarding/schritt-1 and onboarding/start pages without strict authentication
  if (to.path === '/onboarding/schritt-1' || to.path.startsWith('/onboarding/start/')) {
    return
  }

  // Only initialize auth composable on client-side to avoid hydration mismatches
  if (process.client) {
    const { isAuthenticated, hasValidToken, isVerified } = useAuth()

    // Only check auth for other protected routes (onboarding steps 2+, dashboard, etc.)
    if (to.path.startsWith('/onboarding') || to.path.startsWith('/dashboard')) {
      // Check if user is authenticated with valid token
      if (!isAuthenticated.value || !hasValidToken()) {
        // Redirect to registration page with return URL
        return navigateTo(`/lc/anmelden?redirect=${encodeURIComponent(to.fullPath)}`)
      }

      // Check if user is verified (if verification check is available)
      if (isVerified && !isVerified()) {
        // Redirect to verification page
        return navigateTo('/onboarding/verification')
      }
    }
  }
})

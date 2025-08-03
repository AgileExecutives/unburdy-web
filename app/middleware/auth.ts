export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware during SSR
  if (process.server) return

  // Skip auth check for public pages
  const publicPages = ['/anmelden', '/', '/funktionen', '/preise', '/legal/impressum', '/legal/agb', '/legal/datenschutz', '/legal/kontakt']
  if (publicPages.includes(to.path)) {
    return
  }

  const { isAuthenticated, hasValidToken } = useAuth()

  // Only check auth for protected routes (onboarding, dashboard, etc.)
  if (to.path.startsWith('/onboarding') || to.path.startsWith('/dashboard')) {
    // Check if user is authenticated with valid token
    if (!isAuthenticated.value || !hasValidToken()) {
      // Redirect to registration page with return URL
      return navigateTo(`/anmelden?redirect=${encodeURIComponent(to.fullPath)}`)
    }
  }
})

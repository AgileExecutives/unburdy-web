// Debug helper to identify onMounted warning source
if (typeof window !== 'undefined') {
  // Override onMounted to add stack trace logging
  const originalOnMounted = window.Vue?.onMounted
  if (originalOnMounted) {
    window.Vue.onMounted = function(callback) {
      console.trace('onMounted called from:', callback.toString().substring(0, 100))
      return originalOnMounted(callback)
    }
  }
}

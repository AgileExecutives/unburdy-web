// Composable for CSRF token management
export const useCsrf = () => {
  const csrfToken = ref('')
  const isLoading = ref(false)
  const error = ref(null)

  // Get CSRF token from the server
  const fetchCsrfToken = async () => {
    if (isLoading.value) return csrfToken.value
    
    try {
      isLoading.value = true
      error.value = null
      
      const response = await $fetch('/api/csrf-token', {
        method: 'GET'
      })
      
      if (response.success && response.csrfToken) {
        csrfToken.value = response.csrfToken
        return response.csrfToken
      } else {
        throw new Error('Invalid CSRF token response')
      }
    } catch (err) {
      console.error('Failed to fetch CSRF token:', err)
      error.value = err.message || 'Failed to get CSRF token'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Get token (fetch if not available)
  const getToken = async () => {
    if (csrfToken.value) {
      return csrfToken.value
    }
    return await fetchCsrfToken()
  }

  // Check if token is available
  const hasToken = () => {
    return !!csrfToken.value
  }

  // Clear token (useful for logout or token expiry)
  const clearToken = () => {
    csrfToken.value = ''
    error.value = null
  }

  // Refresh token (useful before important operations)
  const refreshToken = async () => {
    clearToken()
    return await fetchCsrfToken()
  }

  // Initialize token on composable creation (client-side only)
  if (process.client) {
    onMounted(async () => {
      try {
        await fetchCsrfToken()
      } catch (err) {
        // Fail silently on mount, let individual components handle errors
        console.warn('Failed to initialize CSRF token:', err)
      }
    })
  }

  return {
    csrfToken: readonly(csrfToken),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchCsrfToken,
    getToken,
    hasToken,
    clearToken,
    refreshToken
  }
}

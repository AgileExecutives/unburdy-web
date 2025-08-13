// composables/useAuth.js
// Authentication state management with JWT token handling

export const useAuth = () => {
  // Reactive authentication state
  const isAuthenticated = ref(false)
  const user = ref(null)
  const token = ref(null)

  // Initialize auth state from localStorage on client-side
  const initAuth = () => {
    if (process.client) {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (storedToken) {
        token.value = storedToken
        isAuthenticated.value = true
        
        if (storedUser) {
          try {
            user.value = JSON.parse(storedUser)
          } catch (e) {
            console.warn('Failed to parse stored user data')
          }
        }
      }
    }
  }

  // Initialize immediately when composable is used
  initAuth()

  // Set authentication data
  const setAuth = (authToken, userData = null) => {
    token.value = authToken
    user.value = userData
    isAuthenticated.value = true

    if (process.client) {
      localStorage.setItem('token', authToken)
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData))
      }
    }
  }

  // Clear authentication data
  const clearAuth = () => {
    token.value = null
    user.value = null
    isAuthenticated.value = false

    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  // Get current token
  const getToken = () => {
    if (!token.value && process.client) {
      token.value = localStorage.getItem('token')
    }
    return token.value
  }

  // Check if token exists and appears valid (basic check)
  const hasValidToken = () => {
    const currentToken = getToken()
    if (!currentToken) {
      return false
    }
    
    try {
      // Basic JWT structure check (should have 3 parts separated by dots)
      const parts = currentToken.split('.')
      if (parts.length !== 3) {
        return false
      }
      
      // Decode payload to check expiration (optional)
      const payload = JSON.parse(atob(parts[1]))
      const now = Math.floor(Date.now() / 1000)
      
      // If token has expiration, check if it's still valid
      if (payload.exp && payload.exp < now) {
        clearAuth() // Token expired, clear auth
        return false
      }
      
      return true
    } catch (e) {
      console.warn('Invalid token format, clearing auth')
      clearAuth()
      return false
    }
  }

  // Check if user is verified (no verification_token present)
  const isVerified = () => {
    if (!user.value) {
      return false
    }
    
    // User is considered verified if they don't have a verification_token
    // or if they have a verified_at timestamp
    return !user.value.verification_token || !!user.value.verified_at
  }

  // Logout function
  const logout = async () => {
    try {
      // Optional: Call logout endpoint to invalidate token on server
      if (hasValidToken()) {
        const { apiCall } = useApi()
        await apiCall('/auth/logout', { method: 'POST' })
      }
    } catch (error) {
      console.warn('Logout API call failed:', error)
    } finally {
      clearAuth()
      await navigateTo('/lc/anmelden')
    }
  }

  return {
    // State
    isAuthenticated: readonly(isAuthenticated),
    user: readonly(user),
    token: readonly(token),
    
    // Methods
    setAuth,
    clearAuth,
    getToken,
    hasValidToken,
    isVerified,
    logout,
    initAuth
  }
}

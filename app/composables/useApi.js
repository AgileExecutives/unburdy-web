// composables/useApi.js
// API configuration using environment variables and JWT authentication

export const useApi = () => {
  const config = useRuntimeConfig()
  const { getToken, hasValidToken } = useAuth()
  
  const apiConfig = () => {
    const token = getToken()
    const apiConfig = {
      baseURL: config.public.apiBaseUrl || 'http://localhost:8080/api/v1',
      headers: {
        'Authorization': token ? `Bearer ${token}` : config.apiToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    } 
    return apiConfig
  }

  // API call wrapper with error handling and auth checks
  const apiCall = async (endpoint, options = {}) => {
    try {
      // Check if we need authentication for this endpoint
      const requiresAuth = !endpoint.startsWith('/auth/') && !endpoint.startsWith('/public/')
      
      if (requiresAuth && !hasValidToken()) {
        throw new Error('Authentication required')
      }

      const response = await $fetch(endpoint, {
        ...apiConfig(),
        ...options
      })
      return response
    } catch (error) {
      console.error('API Error:', error)
      
      // Handle 401 Unauthorized - token expired or invalid
      if (error.status === 401 || error.statusCode === 401) {
        const { clearAuth } = useAuth()
        clearAuth()
        await navigateTo('/lc/anmelden')
        throw new Error('Session expired. Please log in again.')
      }
      
      throw error
    }
  }

  // Specific API methods
  const auth = {
    // User registration - now handled by server endpoint
    register: async (userData) => {
      // This method is kept for compatibility but should use server endpoint
      console.warn('Direct registration deprecated. Use server endpoint /api/register instead.')
      return await apiCall('/auth/register', {
        method: 'POST',
        body: userData
      })
    },
    
    // User login
    login: async (credentials) => {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: credentials
      })
      
      // Save JWT token via auth composable
      if (response.token) {
        const { setAuth } = useAuth()
        setAuth(response.token, response.user)
      }
      
      return response
    },
    
    // User logout
    logout: async () => {
      const response = await apiCall('/auth/logout', {
        method: 'POST'
      })
      
      // Clear auth state
      const { clearAuth } = useAuth()
      clearAuth()
      
      return response
    }
  }

  const users = {
    // Get current user profile
    getProfile: async () => {
      return await apiCall('/users/profile')
    },
    
    // Update user profile
    updateProfile: async (userData) => {
      return await apiCall('/users/profile', {
        method: 'PUT',
        body: userData
      })
    },

    // Get user settings (for onboarding)
    getSettings: async () => {
      return await apiCall('/users/settings')
    },
    
    // Update user settings (for onboarding)
    updateSettings: async (settingsData) => {
      return await apiCall('/users/settings', {
        method: 'PUT',
        body: settingsData
      })
    }
  }

  const clients = {
    // Get all clients
    getAll: async () => {
      return await apiCall('/clients')
    },
    
    // Create new client
    create: async (clientData) => {
      return await apiCall('/clients', {
        method: 'POST',
        body: clientData
      })
    },
    
    // Update client
    update: async (id, clientData) => {
      return await apiCall(`/clients/${id}`, {
        method: 'PUT',
        body: clientData
      })
    },
    
    // Delete client
    delete: async (id) => {
      return await apiCall(`/clients/${id}`, {
        method: 'DELETE'
      })
    }
  }

  // Onboarding specific API calls
  const onboarding = {
    // Save basic settings (step 1)
    saveBasicSettings: async (settingsData) => {
      return await apiCall('/onboarding/basic-settings', {
        method: 'POST',
        body: settingsData
      })
    },
    
    // Create first client (step 2)
    createFirstClient: async (clientData) => {
      return await apiCall('/onboarding/first-client', {
        method: 'POST',
        body: clientData
      })
    },
    
    // Save contacts and insurers (step 3)
    saveContacts: async (contactsData) => {
      return await apiCall('/onboarding/contacts', {
        method: 'POST',
        body: contactsData
      })
    },
    
    // Complete onboarding
    completeOnboarding: async () => {
      return await apiCall('/onboarding/complete', {
        method: 'POST'
      })
    }
  }

  return {
    apiCall,
    auth,
    users,
    clients,
    onboarding,
    config: apiConfig
  }
}

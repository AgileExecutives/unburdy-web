// composables/useApi.js
// API configuration using environment variables

export const useApi = () => {
  const config = useRuntimeConfig()
  
  const apiConfig = {
    baseURL: config.public.apiBaseUrl || 'http://localhost:8080/api/v1',
    headers: {
      'Authorization': `Bearer ${config.apiToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }

  // API call wrapper with error handling
  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await $fetch(endpoint, {
        ...apiConfig,
        ...options
      })
      return response
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Specific API methods
  const auth = {
    // User registration
    register: async (userData) => {
      return await apiCall('/auth/register', {
        method: 'POST',
        body: userData
      })
    },
    
    // User login
    login: async (credentials) => {
      return await apiCall('/auth/login', {
        method: 'POST',
        body: credentials
      })
    },
    
    // User logout
    logout: async () => {
      return await apiCall('/auth/logout', {
        method: 'POST'
      })
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

  return {
    apiCall,
    auth,
    users,
    clients,
    config: apiConfig
  }
}

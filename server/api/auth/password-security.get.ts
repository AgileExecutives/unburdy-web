export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  try {
    // Fetch password requirements from external API
    const response = await $fetch('/auth/password-security', {
      method: 'GET',
      baseURL: config.apiBaseUrl || 'https://api.unburdy.de',
      headers: {
        'Authorization': `Bearer ${config.apiToken}`
      }
    })
    
    return response
  } catch (error: any) {
    console.error('Failed to fetch password requirements from external API:', error)
    
    // Return fallback defaults if external API fails
    return {
      minLength: 8,
      capital: true,
      numbers: true,
      special: false
    }
  }
})

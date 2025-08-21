export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  try {
    const query = getQuery(event)
    const { zip, first_name, last_name, email } = query
    
    // Validate required fields
    if (!zip && !email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ZIP code or email is required'
      })
    }
    
    // Build query parameters for the API call - only include non-empty values
    const queryParams = new URLSearchParams()
    
    if (zip) {
      queryParams.append('zip', zip as string)
    }
    if (first_name) {
      queryParams.append('first_name', first_name as string)
    }
    if (last_name) {
      queryParams.append('last_name', last_name as string)
    }
    if (email) {
      queryParams.append('email', email as string)
    }
    
    const response = await $fetch(`/fuzzy/potential_customers?${queryParams.toString()}`, {
      method: 'GET',
      baseURL: config.apiBaseUrl || 'http://127.0.0.1:8080/api/v1',
      headers: {
        'Authorization': `Bearer ${config.apiToken}`
      }
    })
    
    return response
  } catch (error: any) {
    console.error('Error fetching potential customers:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch potential customers'
    })
  }
})

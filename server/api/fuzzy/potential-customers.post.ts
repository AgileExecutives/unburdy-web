export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  try {
    const query = getQuery(event)
    const { zip, first_name, last_name } = query
    
    // Validate required fields
    if (!zip) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ZIP code is required'
      })
    }
    
    // Build query parameters for the API call
    const queryParams = new URLSearchParams({
      zip: zip as string,
      first_name: (first_name as string) || '',
      last_name: (last_name as string) || ''
    })
    
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

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const name = event.context.params.name

  try {
    const response = await $fetch(`/static/${name}`, {
      baseURL: config.apiBaseUrl || 'http://127.0.0.1:8080/api/v1',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiToken}`
      }
    })
    
    return response
  } catch (error: any) {
    console.error(`Error fetching ${name} data:`, error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || `Failed to fetch ${name} data`
    })
  }
})

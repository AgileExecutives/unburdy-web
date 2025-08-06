import { requireValidCsrf } from '~/server/utils/csrf'

export default defineEventHandler(async (event) => {
  // Only allow POST requests
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const body = await readBody(event)
    
    // Validate CSRF token
    if (!body.csrfToken) {
      throw createError({
        statusCode: 400,
        statusMessage: 'CSRF token is required'
      })
    }
    
    requireValidCsrf(event, body.csrfToken)
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'password']
    for (const field of requiredFields) {
      if (!body[field]) {
        throw createError({
          statusCode: 400,
          statusMessage: `${field} is required`
        })
      }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      })
    }
    
    // Validate password strength (minimum 8 characters)
    if (body.password.length < 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 8 characters long'
      })
    }
    
    // Validate terms acceptance
    if (!body.agb) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Terms and conditions must be accepted'
      })
    }
    
    const config = useRuntimeConfig()
    
    // Forward the registration request to the external API
    const apiResponse = await $fetch('/auth/register', {
      method: 'POST',
      baseURL: config.public.apiBaseUrl,
      headers: {
        'Authorization': config.apiToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        username: body.email, // Use email as username
        password: body.password,
        agb: body.agb,
        marketingConsent: body.marketingConsent || false,
        organizationId: body.organizationId || 0
      }
    })
    
    // Clear the CSRF token cookie after successful use
    deleteCookie(event, 'csrf-token')
    
    return {
      success: true,
      message: 'Registration successful',
      user: (apiResponse as any)?.user,
      token: (apiResponse as any)?.token
    }
    
  } catch (error: any) {
    console.error('Registration error:', error)
    
    // Handle API errors
    if (error?.status || error?.statusCode) {
      throw createError({
        statusCode: error.status || error.statusCode,
        statusMessage: error.statusMessage || error.message || 'Registration failed'
      })
    }
    
    // Handle network or other errors
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error during registration'
    })
  }
})

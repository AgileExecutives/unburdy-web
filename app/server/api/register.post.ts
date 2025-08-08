import { requireValidCsrf } from '~/server/utils/csrf'
import { createLogger } from '~/server/utils/logger'

export default defineEventHandler(async (event) => {
  const logger = createLogger('REGISTER')
  
  logger.info('Registration request received')
  
  // Only allow POST requests
  if (getMethod(event) !== 'POST') {
    logger.warn('Invalid HTTP method', { method: getMethod(event) })
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const body = await readBody(event)
    logger.debug('Request body received', { 
      fields: Object.keys(body),
      email: body?.email,
      firstName: body?.firstName,
      lastName: body?.lastName 
    })
    
    // Validate CSRF token
    if (!body.csrfToken) {
      logger.warn('Missing CSRF token')
      throw createError({
        statusCode: 400,
        statusMessage: 'CSRF token is required'
      })
    }
    
    logger.debug('CSRF token validation starting')
    requireValidCsrf(event, body.csrfToken)
    logger.debug('CSRF token validation passed')
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'password']
    for (const field of requiredFields) {
      if (!body[field]) {
        logger.warn('Missing required field', { field })
        throw createError({
          statusCode: 400,
          statusMessage: `${field} is required`
        })
      }
    }
    logger.debug('All required fields present')

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      logger.warn('Invalid email format', { email: body.email })
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      })
    }

    // Validate password strength (minimum 8 characters)
    if (body.password.length < 8) {
      logger.warn('Password too short', { length: body.password.length })
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 8 characters long'
      })
    }
    
    // Validate terms acceptance
    if (!body.agb) {
      logger.warn('Terms not accepted')
      throw createError({
        statusCode: 400,
        statusMessage: 'Terms and conditions must be accepted'
      })
    }
    
    const config = useRuntimeConfig()
    logger.debug('Making API call to external service', { 
      apiBaseUrl: config.apiBaseUrl,
      hasApiToken: !!config.apiToken 
    })
    
    // Forward the registration request to the external API
    const apiResponse = await $fetch('/auth/register', {
      method: 'POST',
      baseURL: config.apiBaseUrl as string,
      headers: {
        'Authorization': config.apiToken as string,
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
    
    logger.info('External API call successful', { 
      responseKeys: Object.keys(apiResponse || {}),
      hasUser: !!(apiResponse as any)?.user,
      hasToken: !!(apiResponse as any)?.token 
    })

    // Clear the CSRF token cookie after successful use
    deleteCookie(event, 'csrf-token')
    logger.debug('CSRF token cookie cleared')

    logger.info('Registration completed successfully', { email: body.email })
    return {
      success: true,
      message: 'Registration successful',
      user: (apiResponse as any)?.user,
      token: (apiResponse as any)?.token
    }
    
  } catch (error: any) {
    logger.error('Registration failed', error)
    
    // Handle API errors
    if (error?.status || error?.statusCode) {
      logger.error('External API error', {
        status: error.status || error.statusCode,
        statusMessage: error.statusMessage,
        message: error.message,
        data: error.data
      })
      throw createError({
        statusCode: error.status || error.statusCode,
        statusMessage: error.statusMessage || error.message || 'Registration failed'
      })
    }

    // Handle network or other errors
    logger.error('Unexpected error during registration', {
      name: error.name,
      message: error.message,
      cause: error.cause
    })
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error during registration'
    })
  }
})
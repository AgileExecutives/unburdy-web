import crypto from 'crypto'

// Simple in-memory rate limiting (for production, use Redis or database)
const rateLimitMap = new Map()

// Simple logger
const createLogger = (context) => {
  const config = useRuntimeConfig()
  const logLevel = config.logLevel || 'info'
  
  const levels = { debug: 0, info: 1, warn: 2, error: 3 }
  const currentLevel = levels[logLevel] ?? 1
  
  const formatMessage = (level, message, data) => {
    const timestamp = new Date().toISOString()
    const logData = data ? ` | Data: ${JSON.stringify(data, null, 2)}` : ''
    return `[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}${logData}`
  }
  
  return {
    debug: (message, data) => currentLevel <= levels.debug && console.debug(formatMessage('debug', message, data)),
    info: (message, data) => currentLevel <= levels.info && console.log(formatMessage('info', message, data)),
    warn: (message, data) => currentLevel <= levels.warn && console.warn(formatMessage('warn', message, data)),
    error: (message, error) => {
      if (currentLevel <= levels.error) {
        const errorData = error ? {
          message: error.message,
          stack: error.stack,
          status: error.status || error.statusCode,
          statusMessage: error.statusMessage,
          data: error.data
        } : undefined
        console.error(formatMessage('error', message, errorData))
      }
    }
  }
}

export default defineEventHandler(async (event) => {
  const logger = createLogger('CONTACT')
  
  // Get runtime config once at the beginning
  const config = useRuntimeConfig()
  logger.info('Contact form request received')
  
  // Only allow POST requests
  if (getMethod(event) !== 'POST') {
    logger.warn('Invalid HTTP method', { method: getMethod(event) })
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  // Get client IP for rate limiting (fallback to headers if getClientIP not available)
  let clientIP = 'unknown'
  try {
    clientIP = getClientIP?.(event) || getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || 'unknown'
  } catch (e) {
    clientIP = getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || 'unknown'
  }
  
  // Rate limiting: 5 requests per 10 minutes per IP
  const now = Date.now()
  const windowMs = 10 * 60 * 1000 // 10 minutes
  const maxRequests = 5
  
  if (!rateLimitMap.has(clientIP)) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + windowMs })
  } else {
    const rateLimit = rateLimitMap.get(clientIP)
    if (now > rateLimit.resetTime) {
      // Reset window
      rateLimitMap.set(clientIP, { count: 1, resetTime: now + windowMs })
    } else if (rateLimit.count >= maxRequests) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Too many requests. Please try again later.'
      })
    } else {
      rateLimit.count++
    }
  }

  // Validate referer header (basic check)
  const referer = getHeader(event, 'referer')
  const host = getHeader(event, 'host')
  const origin = getHeader(event, 'origin')
  
  // Allow requests from same origin or no referer (for direct API calls in development)
  const allowedOrigins = [
    `https://${host}`,
    `http://${host}`,
    'http://localhost:3001', // Development
    'http://localhost:3000', // Development fallback
  ]
  
  if (referer && !allowedOrigins.some(allowed => referer.startsWith(allowed))) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Invalid origin'
    })
  }

  try {
    // Get the request body
    const body = await readBody(event)
    logger.debug('Request body received', { 
      hasName: !!body.name, 
      hasEmail: !!body.email, 
      hasSubject: !!body.subject, 
      hasMessage: !!body.message,
      hasCsrfToken: !!body.csrfToken
    })
    
    // Validate required fields
    const { name, email, subject, message, csrfToken } = body
    if (!name || !email || !subject || !message) {
      logger.warn('Missing required fields', { name: !!name, email: !!email, subject: !!subject, message: !!message })
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      })
    }

    // Validate CSRF token
    if (!csrfToken) {
      logger.warn('Missing CSRF token')
      throw createError({
        statusCode: 403,
        statusMessage: 'CSRF token required'
      })
    }

    const [tokenPart, signature] = csrfToken.split('.').slice(-2)
    if (!tokenPart || !signature) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Invalid CSRF token format'
      })
    }

    const tokenToVerify = csrfToken.substring(0, csrfToken.lastIndexOf('.'))
    const hmac = crypto.createHmac('sha256', config.csrfSecret)
    hmac.update(tokenToVerify)
    const expectedSignature = hmac.digest('hex')

    if (signature !== expectedSignature) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Invalid CSRF token'
      })
    }

    // Check token age (valid for 1 hour)
    const [timestamp] = tokenToVerify.split('.')
    const tokenAge = Date.now() - parseInt(timestamp)
    const maxAge = 60 * 60 * 1000 // 1 hour
    
    if (tokenAge > maxAge) {
      throw createError({
        statusCode: 403,
        statusMessage: 'CSRF token expired'
      })
    }

    // Get runtime config for API credentials
    
    // Prepare the data for the Unburdy API
    const contactData = {
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
      newsletter: body.newsletter || false,
      timestamp: new Date().toISOString(),
      source: 'website_contact_form'
    }

    // Make the API call to Unburdy API with server-side credentials
    const response = await $fetch('/contact', {
      baseURL: config.apiBaseUrl,
      method: 'POST',
      headers: {
        'Authorization': `${config.apiToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: contactData
    })

    // Return success response
    return {
      success: true,
      message: 'Contact form submitted successfully'
    }

  } catch (error) {
    logger.error('Contact form submission failed', error)
    logger.debug('Configuration details', { 
      apiBaseUrl: config.apiBaseUrl,
      hasApiToken: !!config.apiToken 
    })
    
    // Handle different types of errors
    if (error.statusCode) {
      throw error
    }
    
    // Handle API errors
    if (error.data) {
      logger.error('External API error', error.data)
      throw createError({
        statusCode: error.status || 500,
        statusMessage: error.data.message || 'Failed to submit contact form'
      })
    }
    
    // Handle network or other errors
    logger.error('Unexpected error', {
      message: error.message,
      cause: error.cause,
      stack: error.stack?.split('\n').slice(0, 5)
    })
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})

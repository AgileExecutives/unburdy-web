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
  const logger = createLogger('REGISTER')
  logger.info('Registration request received')

  // Get runtime config once at the beginning
  const config = useRuntimeConfig()
  
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
  
  // Rate limiting: 3 registrations per hour per IP (stricter than contact)
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1 hour
  const maxRequests = 3
  
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
        statusMessage: 'Too many registration attempts. Please try again later.'
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
    logger.debug('Request body received', { fields: Object.keys(body) })
    
    // Validate required fields
    const { firstName, lastName, email, username, password, agb, organizationId, csrfToken } = body
    if (!firstName || !lastName || !email || !password || !agb) {
      logger.warn('Missing required fields', { firstName, lastName, email, password, agb })
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      })
    }

    // Username should be the same as email (validate this)
    if (username && username !== email) {
      logger.warn('Username does not match email', { username, email })
      throw createError({
        statusCode: 400,
        statusMessage: 'Username must match email address'
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      logger.warn('Invalid email format', { email })
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      })
    }

    // Validate password strength (minimum 8 characters)
    if (password.length < 8) {
      logger.warn('Password too short', { length: password.length })
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 8 characters long'
      })
    }

    // Validate AGB acceptance
    if (!agb) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Terms and conditions must be accepted'
      })
    }

    // Validate CSRF token
    if (!csrfToken) {
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

    // Prepare the data for the Unburdy API (matching the exact structure expected)
    const registrationData = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      username: body.username || body.email, // Use email as username if not provided
      password: body.password,
      agb: body.agb,
      marketingConsent: body.marketingConsent || false,
      organizationId: body.organizationId || 0
    }

    // Make the API call to Unburdy API with server-side credentials
    const response = await $fetch('/auth/register', {
      baseURL: config.apiBaseUrl,
      method: 'POST',
      headers: {
        'Authorization': `${config.apiToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: registrationData
    })

    // Return success response (without exposing sensitive data)
    return {
      success: true,
      message: 'Registration successful',
      token: response.token, // Pass token for frontend authentication
      user: {
        id: response.user?.id,
        firstName: response.user?.firstName,
        lastName: response.user?.lastName,
        email: response.user?.email
      }
    }

  } catch (error) {
    logger.error('Registration error', error)
    
    // Handle different types of errors
    if (error.statusCode) {
      throw error
    }
    
    // Handle API errors
    if (error.data) {
      // Map common registration errors to user-friendly messages
      let statusMessage = 'Registration failed'
      
      if (error.data.message?.includes('email already exists') || error.data.message?.includes('duplicate')) {
        statusMessage = 'Ein Account mit dieser E-Mail-Adresse existiert bereits'
      } else if (error.data.message?.includes('username already exists') || error.data.message?.includes('username') && error.data.message?.includes('taken')) {
        statusMessage = 'Dieser Benutzername ist bereits vergeben'
      } else if (error.data.message?.includes('invalid email')) {
        statusMessage = 'Ungültige E-Mail-Adresse'
      } else if (error.data.message?.includes('invalid username')) {
        statusMessage = 'Ungültiger Benutzername'
      } else if (error.data.message?.includes('password')) {
        statusMessage = 'Passwort entspricht nicht den Anforderungen'
      } else if (error.data.message) {
        statusMessage = error.data.message
      }
      
      throw createError({
        statusCode: error.status || 400,
        statusMessage
      })
    }
    
    // Handle network or other errors
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})

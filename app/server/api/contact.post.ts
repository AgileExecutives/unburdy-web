import * as crypto from 'crypto'
import { defineEventHandler, createError, readBody, getMethod, getHeader } from 'h3'
import { $fetch } from 'ofetch'

// Inline CSRF validation (temporary)
function validateContactCsrfToken(token: string, secret: string): { isValid: boolean; error?: string } {
  if (!token) {
    return { isValid: false, error: 'CSRF token required' }
  }

  const parts = token.split('.')
  if (parts.length < 3) {
    return { isValid: false, error: 'Invalid CSRF token format' }
  }

  const signature = parts[parts.length - 1]
  const tokenToVerify = token.substring(0, token.lastIndexOf('.'))
  
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(tokenToVerify)
  const expectedSignature = hmac.digest('hex')

  if (signature !== expectedSignature) {
    return { isValid: false, error: 'Invalid CSRF token signature' }
  }

  const timestampStr = parts[0]
  if (!timestampStr) {
    return { isValid: false, error: 'Missing timestamp in token' }
  }
  
  const timestamp = parseInt(timestampStr)
  if (isNaN(timestamp)) {
    return { isValid: false, error: 'Invalid token timestamp' }
  }

  const tokenAge = Date.now() - timestamp
  const maxAge = 60 * 60 * 1000 // 1 hour

  if (tokenAge > maxAge) {
    return { isValid: false, error: 'CSRF token expired' }
  }

  if (tokenAge < 0) {
    return { isValid: false, error: 'Invalid token timestamp (future)' }
  }

  return { isValid: true }
}

// Inline rate limiting (temporary)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(identifier: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now()
  const maxRequests = 5
  const windowMs = 10 * 60 * 1000 // 10 minutes
  
  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return { allowed: true }
  }

  const rateLimit = rateLimitMap.get(identifier)!
  
  if (now > rateLimit.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return { allowed: true }
  }

  if (rateLimit.count >= maxRequests) {
    return { allowed: false, resetTime: rateLimit.resetTime }
  }

  rateLimit.count++
  return { allowed: true }
}

// Simple logger inline (since the logger utility has import issues)
const createLogger = (context: string) => {
  
  const levels = { debug: 0, info: 1, warn: 2, error: 3 }
  const currentLevel = levels['info'] ?? 1
  
  const formatMessage = (level: string, message: string, data?: any) => {
    const timestamp = new Date().toISOString()
    const logData = data ? ` | Data: ${JSON.stringify(data, null, 2)}` : ''
    return `[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}${logData}`
  }
  
  return {
    debug: (message: string, data?: any) => currentLevel <= levels.debug && console.debug(formatMessage('debug', message, data)),
    info: (message: string, data?: any) => currentLevel <= levels.info && console.log(formatMessage('info', message, data)),
    warn: (message: string, data?: any) => currentLevel <= levels.warn && console.warn(formatMessage('warn', message, data)),
    error: (message: string, error?: any) => {
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

interface ContactFormBody {
  name: string
  email: string
  subject: string
  message: string
  newsletter?: boolean
  csrfToken: string
}

interface ContactApiData {
  name: string
  email: string
  subject: string
  message: string
  newsletter: boolean
  timestamp: string
  source: string
}

export default defineEventHandler(async (event) => {
  const logger = createLogger('CONTACT')
  
  const config = {
    csrfSecret: process.env.NUXT_CSRF_SECRET || 'default-secret',
    apiBaseUrl: process.env.NUXT_API_BASE_URL || 'http://localhost:8000',
    apiToken: process.env.NUXT_API_TOKEN || ''
  }
  logger.info('Contact form request received')
  
  // Only allow POST requests
  if (getMethod(event) !== 'POST') {
    logger.warn('Invalid HTTP method', { method: getMethod(event) })
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  // Get client IP for rate limiting
  let clientIP = 'unknown'
  try {
    // Try different ways to get client IP
    clientIP = getHeader(event, 'x-forwarded-for') || 
               getHeader(event, 'x-real-ip') || 
               getHeader(event, 'cf-connecting-ip') || 
               'unknown'
  } catch (e) {
    clientIP = 'unknown'
  }
  
  // Rate limiting check
  const rateLimitResult = checkRateLimit(clientIP)
  if (!rateLimitResult.allowed) {
    const resetTime = rateLimitResult.resetTime || Date.now()
    const remainingMinutes = Math.ceil((resetTime - Date.now()) / (60 * 1000))
    
    logger.warn('Rate limit exceeded', { clientIP, remainingMinutes })
    throw createError({
      statusCode: 429,
      statusMessage: `Too many requests. Please try again in ${remainingMinutes} minutes.`
    })
  }

  // Validate referer header (basic check)
  const referer = getHeader(event, 'referer')
  const host = getHeader(event, 'host')
  
  // Allow requests from same origin or no referer (for direct API calls in development)
  const allowedOrigins = [
    `https://${host}`,
    `http://${host}`,
    'http://localhost:3001', // Development
    'http://localhost:3000', // Development fallback
  ]
  
  if (referer && !allowedOrigins.some(allowed => referer.startsWith(allowed))) {
    logger.warn('Invalid origin', { referer, allowedOrigins })
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Invalid origin'
    })
  }

  try {
    // Get the request body
    const body = await readBody<ContactFormBody>(event)
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
      logger.warn('Missing required fields', { 
        name: !!name, 
        email: !!email, 
        subject: !!subject, 
        message: !!message 
      })
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: name, email, subject, and message are required'
      })
    }

    // Validate email format (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      logger.warn('Invalid email format', { email: email.substring(0, 5) + '...' })
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      })
    }

    // Validate CSRF token using the inline function
    const csrfResult = validateContactCsrfToken(csrfToken, config.csrfSecret as string)
    if (!csrfResult.isValid) {
      throw createError({
        statusCode: 403,
        statusMessage: csrfResult.error || 'Invalid CSRF token'
      })
    }
    logger.debug('CSRF token validated successfully')

    // Prepare the data for the Unburdy API
    const contactData: ContactApiData = {
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
      newsletter: body.newsletter || false,
      timestamp: new Date().toISOString(),
      source: 'website_contact_form'
    }

    logger.debug('Sending to external API', { 
      apiBaseUrl: config.apiBaseUrl,
      hasApiToken: !!config.apiToken 
    })

    // Make the API call to Unburdy API with server-side credentials
    const response = await $fetch<{ success: boolean; message: string }>('/contact-form', {
      baseURL: config.apiBaseUrl as string,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: contactData
    })

    logger.info('Contact form submitted successfully', { 
      name: body.name, 
      email: body.email.substring(0, 5) + '...' 
    })

    // Return success response
    return {
      success: true,
      message: 'Contact form submitted successfully'
    }

  } catch (error: any) {
    logger.error('Contact form submission failed', error)
    
    // Handle different types of errors
    if (error.statusCode) {
      throw error
    }
    
    // Handle API errors
    if (error.data) {
      logger.error('External API error', error.data)
      throw createError({
        statusCode: error.status || 502,
        statusMessage: error.data.message || 'Failed to submit contact form to external service'
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

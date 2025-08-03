import crypto from 'crypto'

// Simple in-memory rate limiting (for production, use Redis or database)
const rateLimitMap = new Map()

export default defineEventHandler(async (event) => {
  // Get runtime config once at the beginning
  const config = useRuntimeConfig()
  
  // Only allow POST requests
  if (getMethod(event) !== 'POST') {
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
    
    // Validate required fields
    const { name, email, subject, message, csrfToken } = body
    if (!name || !email || !subject || !message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
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
      baseURL: config.public.apiBaseUrl,
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
    console.error('Contact form submission error:', error)
    
    // Handle different types of errors
    if (error.statusCode) {
      throw error
    }
    
    // Handle API errors
    if (error.data) {
      throw createError({
        statusCode: error.status || 500,
        statusMessage: error.data.message || 'Failed to submit contact form'
      })
    }
    
    // Handle network or other errors
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})

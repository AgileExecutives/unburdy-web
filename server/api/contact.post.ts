import crypto from 'crypto'
import type { 
  models_ContactFormRequest, 
  models_ContactFormResponse 
} from '../../types/api'
import { ContactService } from '../../types/api/services/ContactService'
import { OpenAPI } from '../../types/api/core/OpenAPI'
import { createLogger } from '../utils/logger'

// Simple in-memory rate limiting (for production, use Redis or database)
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

// CSRF validation function
function validateCsrfToken(token: string, secret: string): { isValid: boolean; error?: string } {
  if (!token) {
    return { isValid: false, error: 'CSRF token required' }
  }

  const parts = token.split('.')
  if (parts.length !== 3) {
    return { isValid: false, error: 'Invalid CSRF token format' }
  }

  const signature = parts[parts.length - 1]
  const tokenToVerify = `${parts[1]}:${parts[0]}` // csrfToken:timestamp format
  
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
  const maxAge = 2 * 60 * 60 * 1000 // 2 hours

  if (tokenAge > maxAge) {
    return { isValid: false, error: 'CSRF token expired' }
  }

  if (tokenAge < 0) {
    return { isValid: false, error: 'Invalid token timestamp (future)' }
  }

  return { isValid: true }
}

// Request body interface
interface ContactFormBody {
  name: string
  email: string
  subject: string
  message: string
  newsletter?: boolean
  csrfToken: string
}

// Response interface
interface ContactResponse {
  success: boolean
  message: string
  newsletterAdded?: boolean
  newsletterMessage?: string
}

export default defineEventHandler(async (event): Promise<ContactResponse> => {
  const logger = createLogger('CONTACT')
  logger.info('Contact form submission received')

  // Get runtime config
  const config = useRuntimeConfig()
  
  // Configure OpenAPI client with server-side config
  OpenAPI.BASE = config.apiBaseUrl
  
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
    clientIP = (event.node?.req as any)?.connection?.remoteAddress 
      || getHeader(event, 'x-forwarded-for') 
      || getHeader(event, 'x-real-ip') 
      || getHeader(event, 'cf-connecting-ip')
      || 'unknown'
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

  // Validate referer header
  const referer = getHeader(event, 'referer')
  const host = getHeader(event, 'host')
  
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
    // Get and validate request body
    const body = await readBody(event) as ContactFormBody
    logger.debug('Request body received', { 
      hasName: !!body.name, 
      hasEmail: !!body.email,
      hasMessage: !!body.message,
      hasSubject: !!body.subject
    })
    
    // Validate required fields
    const { name, email, subject, message, newsletter, csrfToken } = body
    if (!name || !email || !subject || !message) {
      logger.warn('Missing required fields', { name: !!name, email: !!email, subject: !!subject, message: !!message })
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
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

    // Validate CSRF token
    const csrfValidation = validateCsrfToken(csrfToken, config.csrfSecret)
    if (!csrfValidation.isValid) {
      logger.warn('CSRF validation failed', { error: csrfValidation.error })
      throw createError({
        statusCode: 403,
        statusMessage: csrfValidation.error || 'Invalid CSRF token'
      })
    }

    // Prepare the typed contact form data
    const contactFormData: models_ContactFormRequest = {
      name: name,
      email: email,
      subject: subject,
      message: message,
      newsletter: newsletter || false,
      timestamp: new Date().toISOString(),
      source: 'website_contact_form'
    }

    logger.info('Calling backend API for contact form submission', { 
      name, 
      email: email.substring(0, 5) + '...',
      subject 
    })

    // Use the typed ContactService for submission
    const response = await ContactService.postContact({
      contactForm: contactFormData
    })

    logger.info('Contact form submitted successfully', { 
      name, 
      email: email.substring(0, 5) + '...',
      newsletterAdded: response.newsletterAdded 
    })

    // Return success response
    return {
      success: true,
      message: response.message || 'Contact form submitted successfully',
      newsletterAdded: response.newsletterAdded,
      newsletterMessage: response.newsletterMessage
    }

  } catch (error: any) {
    logger.error('Contact form submission failed', error)
    
    // Handle different types of errors
    if (error.statusCode) {
      throw error
    }
    
    // Handle API errors from the typed service
    if (error.status || error.statusCode) {
      let statusMessage = 'Failed to submit contact form'
      
      if (error.status === 400 || error.statusCode === 400) {
        if (error.body?.message) {
          statusMessage = error.body.message
        }
      }
      
      throw createError({
        statusCode: error.status || error.statusCode || 502,
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

import crypto from 'crypto'
import { defineEventHandler, createError, readBody, getMethod, getHeader } from 'h3'
import type { 
  models_RegisterRequest, 
  models_AuthResponse,
  models_ErrorResponse 
} from '../../types/api'
import { AuthService } from '../../types/api/services/AuthService'
import { OpenAPI } from '../../types/api/core/OpenAPI'
import { createLogger } from '../utils/logger'

// Simple in-memory rate limiting (for production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Request body interface
interface RegisterRequestBody {
  firstName: string
  lastName: string
  email: string
  password: string
  agb: boolean
  marketingConsent?: boolean
  organizationId?: number
  csrfToken: string
}

// Response interface
interface RegisterResponse {
  success: boolean
  message: string
  token?: string
  user?: {
    id?: number
    firstName?: string
    lastName?: string
    email?: string
  }
}

export default defineEventHandler(async (event): Promise<RegisterResponse> => {
  const logger = createLogger('REGISTER')
  logger.info('Registration request received')

  // Get runtime config
  const config = useRuntimeConfig()
  
  // Configure OpenAPI client with server-side config
  OpenAPI.BASE = config.apiBaseUrl
  // Note: We don't set OpenAPI.TOKEN here because AuthService handles authorization directly
  
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
    // getClientIP may not be available in all Nuxt versions, use fallback
    clientIP = (event.node?.req as any)?.connection?.remoteAddress 
      || getHeader(event, 'x-forwarded-for') 
      || getHeader(event, 'x-real-ip') 
      || 'unknown'
  } catch (e) {
    clientIP = getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || 'unknown'
  }
  
  // Rate limiting: 3 registrations per hour per IP
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1 hour
  const maxRequests = 3
  
  if (!rateLimitMap.has(clientIP)) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + windowMs })
  } else {
    const rateLimit = rateLimitMap.get(clientIP)!
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
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Invalid origin'
    })
  }

  try {
    // Get and validate request body
    const body = await readBody(event) as RegisterRequestBody
    logger.debug('Request body received', { fields: Object.keys(body) })
    
    // Validate required fields
    const { firstName, lastName, email, password, agb, organizationId, csrfToken } = body
    if (!firstName || !lastName || !email || !password || !agb) {
      logger.warn('Missing required fields', { firstName: !!firstName, lastName: !!lastName, email: !!email, password: !!password, agb })
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

    // Validate password strength (based on backend requirements)
    if (password.length < 6) {
      logger.warn('Password too short', { length: password.length })
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 6 characters long'
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

    // Prepare the typed registration data
    // Note: Using snake_case as required by the API
    // Only sending basic required fields to test
    const registrationData: models_RegisterRequest = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password
      // Temporarily removing optional fields to test if they cause the 400 error
      // agb: agb,
      // marketing_consent: body.marketingConsent || false,
      // ...(organizationId && { organization_id: organizationId })
    }

    // Log the exact data being sent to debug API field requirements
    logger.info('Calling backend API for registration', { 
      email, 
      firstName, 
      lastName,
      registrationData: {
        ...registrationData,
        password: '[REDACTED]'
      },
      apiBaseUrl: config.apiBaseUrl,
      hasApiToken: !!config.apiToken
    })

    // Use the typed AuthService for registration  
    const response = await AuthService.postAuthRegister({
      user: registrationData,
      authorization: 'Bearer ' + config.apiToken
    })

    logger.info('Registration successful', { 
      customerId: response.customer_id,
      organizationId: response.organization_id 
    })

    // Return the full API response with success flag
    return {
      success: true,
      message: 'Registration successful',
      ...response
    }

  } catch (error: any) {
    logger.error('Registration error', {
      message: error.message,
      status: error.status,
      statusCode: error.statusCode,
      body: error.body,
      responseBody: error.responseBody,
      responseText: error.responseText,
      response: error.response,
      stack: error.stack
    })
    
    // Handle different types of errors
    if (error.statusCode) {
      throw error
    }
    
    // Handle API errors from the typed service
    if (error.status || error.statusCode) {
      let statusMessage = 'Registration failed'
      
      // Map specific error status codes to user-friendly messages
      if (error.status === 409 || error.statusCode === 409) {
        statusMessage = 'Ein Account mit dieser E-Mail-Adresse existiert bereits'
      } else if (error.status === 400 || error.statusCode === 400) {
        if (error.body?.message?.includes('email')) {
          statusMessage = 'Ungültige E-Mail-Adresse'
        } else if (error.body?.message?.includes('password')) {
          statusMessage = 'Passwort entspricht nicht den Anforderungen'
        } else if (error.body?.message) {
          statusMessage = error.body.message
        }
      } else if (error.status === 401 || error.statusCode === 401) {
        statusMessage = 'API-Authentifizierung fehlgeschlagen'
      }
      
      throw createError({
        statusCode: error.status || error.statusCode || 400,
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

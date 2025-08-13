import type { 
  models_LoginRequest, 
  models_AuthResponse 
} from '../../types/api'
import { AuthService } from '../../types/api/services/AuthService'
import { OpenAPI } from '../../types/api/core/OpenAPI'
import { createLogger } from '../utils/logger'

// Simple in-memory rate limiting (for production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Request body interface
interface LoginRequestBody {
  email: string
  password: string
}

// Response interface
interface LoginResponse {
  success: boolean
  message: string
  token?: string
  expiresAt?: number
  user?: {
    id?: number
    email?: string
    first_name?: string
    last_name?: string
    active?: boolean
  }
  requiresVerification?: boolean
}

export default defineEventHandler(async (event): Promise<LoginResponse> => {
  const logger = createLogger('LOGIN')
  logger.info('Login request received')

  // Get runtime config and configure OpenAPI
  const config = useRuntimeConfig()
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
      || 'unknown'
  } catch (e) {
    clientIP = 'unknown'
  }
  
  // Rate limiting: 5 login attempts per 15 minutes per IP
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 5
  
  if (!rateLimitMap.has(clientIP)) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + windowMs })
  } else {
    const rateLimit = rateLimitMap.get(clientIP)!
    if (now > rateLimit.resetTime) {
      // Reset window
      rateLimitMap.set(clientIP, { count: 1, resetTime: now + windowMs })
    } else if (rateLimit.count >= maxRequests) {
      logger.warn('Login rate limit exceeded', { clientIP })
      throw createError({
        statusCode: 429,
        statusMessage: 'Zu viele Anmeldeversuche. Bitte versuchen Sie es später erneut.'
      })
    } else {
      rateLimit.count++
    }
  }

  try {
    // Get and validate request body
    const body = await readBody(event) as LoginRequestBody
    logger.debug('Login request received', { 
      email: body.email?.substring(0, 5) + '...'
    })
    
    // Validate required fields
    const { email, password } = body
    if (!email || !password) {
      logger.warn('Missing required fields', { email: !!email, password: !!password })
      throw createError({
        statusCode: 400,
        statusMessage: 'E-Mail und Passwort sind erforderlich'
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      logger.warn('Invalid email format', { email })
      throw createError({
        statusCode: 400,
        statusMessage: 'Ungültige E-Mail-Adresse'
      })
    }

    // Prepare the typed login data
    const loginData: models_LoginRequest = {
      email: email,
      password: password
    }

    logger.info('Calling backend API for login', { 
      email: email.substring(0, 5) + '...'
    })

    // Use the typed AuthService for login
    const response = await AuthService.postAuthLogin({
      credentials: loginData
    })

    // Check if user has verification_token (indicating unverified account)
    if (response.user && (response.user as any).verification_token) {
      logger.warn('Login attempt with unverified account', { 
        userId: response.user.id,
        email: email.substring(0, 5) + '...'
      })
      
      // Return specific response for unverified users
      return {
        success: false,
        message: 'Ihr Account muss noch verifiziert werden. Bitte überprüfen Sie Ihre E-Mails.',
        requiresVerification: true,
        user: {
          id: response.user.id,
          email: response.user.email,
          first_name: response.user.first_name,
          last_name: response.user.last_name,
          active: response.user.active
        }
      }
    }

    logger.info('Login successful', { 
      userId: response.user?.id,
      email: email.substring(0, 5) + '...'
    })

    // Return successful login response
    return {
      success: true,
      message: 'Anmeldung erfolgreich',
      token: response.token,
      expiresAt: response.expiresAt,
      user: {
        id: response.user?.id,
        email: response.user?.email,
        first_name: response.user?.first_name,
        last_name: response.user?.last_name,
        active: response.user?.active
      }
    }

  } catch (error: any) {
    logger.error('Login failed', error)
    
    // Handle different types of errors
    if (error.statusCode) {
      throw error
    }
    
    // Handle API errors from the typed service
    if (error.status || error.statusCode) {
      let statusMessage = 'Anmeldung fehlgeschlagen'
      
      if (error.status === 401 || error.statusCode === 401) {
        statusMessage = 'Ungültige E-Mail-Adresse oder Passwort'
      } else if (error.status === 400 || error.statusCode === 400) {
        statusMessage = 'Ungültige Anmeldedaten'
      } else if (error.status === 403 || error.statusCode === 403) {
        statusMessage = 'Ihr Account wurde gesperrt. Kontaktieren Sie den Support.'
      }
      
      throw createError({
        statusCode: error.status || error.statusCode || 401,
        statusMessage
      })
    }
    
    // Handle network or other errors
    throw createError({
      statusCode: 500,
      statusMessage: 'Interner Serverfehler bei der Anmeldung'
    })
  }
})

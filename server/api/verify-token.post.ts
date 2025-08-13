import { AuthService } from '../../types/api/services/AuthService'
import { OpenAPI } from '../../types/api/core/OpenAPI'
import { createLogger } from '../utils/logger'

// Request interface for token validation
interface TokenValidationRequest {
  token: string
}

export default defineEventHandler(async (event) => {
  const logger = createLogger('VERIFY_TOKEN')
  
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

  try {
    const body = await readBody(event) as TokenValidationRequest
    const { token } = body
    
    logger.info('Token verification request received')
    
    if (!token) {
      logger.warn('Missing token in request body')
      throw createError({
        statusCode: 400,
        statusMessage: 'Token ist erforderlich'
      })
    }

    // Validate token format (basic check)
    if (typeof token !== 'string' || token.length < 10) {
      logger.warn('Invalid token format', { tokenLength: token?.length })
      throw createError({
        statusCode: 400,
        statusMessage: 'Ungültiges Token-Format'
      })
    }
    
    logger.debug('Calling backend API for email verification', { tokenLength: token.length })
    
    // Use the typed AuthService for verification
    const response = await AuthService.getAuthVerification({ token })
    
    logger.info('Token verification successful', { 
      hasResponse: !!response
    })
    
    // Return HTTP 200 for successful verification
    return response
    
  } catch (error: any) {
    logger.error('Token verification failed', error)
    
    // Handle different types of errors with proper HTTP status codes
    if (error.statusCode) {
      // Re-throw API errors with proper status codes
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Token verification failed'
      })
    }
    
    // Handle API errors from the typed service
    if (error.status || error.statusCode) {
      let statusCode = error.status || error.statusCode || 400
      let statusMessage = 'Token-Verifizierung fehlgeschlagen'
      
      if (statusCode === 400) {
        statusMessage = 'Ungültiger oder falsch formatierter Token'
      } else if (statusCode === 404) {
        statusMessage = 'Token nicht gefunden oder abgelaufen'
      } else if (statusCode === 410) {
        statusMessage = 'Token wurde bereits verwendet'
      }
      
      throw createError({
        statusCode,
        statusMessage
      })
    }
    
    // Handle network or other errors
    throw createError({
      statusCode: 500,
      statusMessage: 'Interner Serverfehler bei der Token-Verifizierung'
    })
  }
})

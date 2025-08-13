import crypto from 'crypto'
import { createLogger } from '../utils/logger'

// Response interface for CSRF token endpoint
interface CsrfTokenResponse {
  success: boolean
  csrfToken: string
  expiresAt: number
}

export default defineEventHandler(async (event): Promise<CsrfTokenResponse> => {
  const logger = createLogger('CSRF_TOKEN')
  
  try {
    const config = useRuntimeConfig()
    logger.info('CSRF token request received')
    
    // Only allow GET requests
    if (getMethod(event) !== 'GET') {
      logger.warn('Invalid HTTP method', { method: getMethod(event) })
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      })
    }

    // Generate a random token
    const timestamp = Date.now().toString()
    const randomBytes = crypto.randomBytes(16).toString('hex')
    const token = `${timestamp}.${randomBytes}`
    
    // Create HMAC signature
    const hmac = crypto.createHmac('sha256', config.csrfSecret)
    hmac.update(token)
    const signature = hmac.digest('hex')
    
    const csrfToken = `${token}.${signature}`
    const expiresAt = Date.now() + (60 * 60 * 1000) // 1 hour from now
    
    logger.debug('CSRF token generated', { 
      tokenLength: csrfToken.length,
      expiresAt: new Date(expiresAt).toISOString()
    })
    
    return {
      success: true,
      csrfToken,
      expiresAt
    }
    
  } catch (error: any) {
    logger.error('Error generating CSRF token', error)
    
    // Handle different types of errors
    if (error.statusCode) {
      throw error
    }
    
    // Handle unexpected errors
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})

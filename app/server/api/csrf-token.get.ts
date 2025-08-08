import crypto from 'crypto'

const createLogger = (context: string) => {
  const config = useRuntimeConfig()
  const logLevel = config.logLevel as string || 'info'
  const levels = { debug: 0, info: 1, warn: 2, error: 3 }
  const currentLevel = levels[logLevel as keyof typeof levels] ?? 1
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

export default defineEventHandler(async (event) => {
  const logger = createLogger('CSRF_TOKEN')
  // Only allow POST requests for better security
  if (getMethod(event) !== 'GET') {
    logger.warn('Invalid HTTP method', { method: getMethod(event) })
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }
  try {
    const config = useRuntimeConfig()
    logger.info('CSRF token request received')
    
    // Generate a random CSRF token
    const csrfToken = crypto.randomBytes(32).toString('hex')
    
    // Store the token in a secure cookie or session
    // For now, we'll use a simple approach with signed tokens
    const secret = config.csrfSecret
    const timestamp = Date.now()
    
    // Create a signed token that includes timestamp for expiration
    const tokenData = `${csrfToken}:${timestamp}`
    const signature = crypto
      .createHmac('sha256', secret)
      .update(tokenData)
      .digest('hex')
    
    const signedToken = `${tokenData}:${signature}`
    
    // Set cookie with the signed token (httpOnly for security)
    setCookie(event, 'csrf-token', signedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 2, // 2 hours
      path: '/'
    })
    
    logger.debug('CSRF token generated', { csrfToken })
    return {
      success: true,
      csrfToken: csrfToken,
      expiresAt: timestamp + (60 * 60 * 2 * 1000) // 2 hours from now
    }
  } catch (error) {
    logger.error('Error generating CSRF token', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})

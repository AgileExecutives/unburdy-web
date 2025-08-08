import crypto from 'crypto'

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
  const logger = createLogger('CSRF_TOKEN')
  try {
    const config = useRuntimeConfig()
    logger.info('CSRF token request received')
    
    // Generate a random token
    const timestamp = Date.now().toString()
    const randomBytes = crypto.randomBytes(16).toString('hex')
    const token = `${timestamp}.${randomBytes}`
    
    // Create HMAC signature
    const hmac = crypto.createHmac('sha256', config.csrfSecret)
    hmac.update(token)
    const signature = hmac.digest('hex')
    
    const csrfToken = `${token}.${signature}`
    logger.debug('CSRF token generated', { csrfToken })
    
    return {
      success: true,
      csrfToken,
      expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour from now
    }
    
  } catch (error) {
    logger.error('Error generating CSRF token', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})

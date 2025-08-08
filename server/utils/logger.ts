// Server-side logging utility
export const createLogger = (context: string) => {
  const config = useRuntimeConfig()
  const logLevel = config.logLevel as string
  
  const levels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  }
  
  const currentLevel = levels[logLevel as keyof typeof levels] ?? 1
  
  const formatMessage = (level: string, message: string, data?: any) => {
    const timestamp = new Date().toISOString()
    const logData = data ? ` | Data: ${JSON.stringify(data, null, 2)}` : ''
    return `[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}${logData}`
  }
  
  return {
    debug: (message: string, data?: any) => {
      if (currentLevel <= levels.debug) {
        console.debug(formatMessage('debug', message, data))
      }
    },
    
    info: (message: string, data?: any) => {
      if (currentLevel <= levels.info) {
        console.log(formatMessage('info', message, data))
      }
    },
    
    warn: (message: string, data?: any) => {
      if (currentLevel <= levels.warn) {
        console.warn(formatMessage('warn', message, data))
      }
    },
    
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

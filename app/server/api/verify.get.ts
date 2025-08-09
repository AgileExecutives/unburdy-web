import { createLogger } from '~/server/utils/logger'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const logger = createLogger('VERIFY')
  const query = getQuery(event)
  const token = query.token

  logger.info('Verification request received', { token })

  if (!token) {
    logger.warn('Missing token in query')
    throw createError({
      statusCode: 400,
      statusMessage: 'Token is required'
    })
  }

  try {
    // TODO: Replace with your actual verification logic
    // For demonstration, we just return a dummy JWT if token is 'validtoken'
    if (token === 'validtoken') {
      const jwt = 'dummy.jwt.token'
      logger.info('Token verified successfully', { token })
      return { jwt }
    } else {
      logger.warn('Invalid token', { token })
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired token'
      })
    }
  } catch (error) {
    logger.error('Verification error', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Verification failed'
    })
  }
})

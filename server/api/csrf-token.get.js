import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    // Generate a random token
    const timestamp = Date.now().toString()
    const randomBytes = crypto.randomBytes(16).toString('hex')
    const token = `${timestamp}.${randomBytes}`
    
    // Create HMAC signature
    const hmac = crypto.createHmac('sha256', config.csrfSecret)
    hmac.update(token)
    const signature = hmac.digest('hex')
    
    const csrfToken = `${token}.${signature}`
    
    return {
      success: true,
      csrfToken,
      expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour from now
    }
    
  } catch (error) {
    console.error('Error generating CSRF token:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})

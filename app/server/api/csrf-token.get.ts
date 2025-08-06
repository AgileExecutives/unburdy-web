import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  // Only allow POST requests for better security
  if (getMethod(event) !== 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const config = useRuntimeConfig()
    
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
    
    return {
      success: true,
      csrfToken: csrfToken,
      expiresAt: timestamp + (60 * 60 * 2 * 1000) // 2 hours from now
    }
    
  } catch (error) {
    console.error('Error generating CSRF token:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})

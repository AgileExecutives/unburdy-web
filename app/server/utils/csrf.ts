import crypto from 'crypto'

export function validateCsrfToken(event: any, providedToken: string): boolean {
  try {
    const config = useRuntimeConfig()
    const secret = config.csrfSecret
    
    // Get the signed token from cookie
    const signedToken = getCookie(event, 'csrf-token')
    
    if (!signedToken || !providedToken) {
      return false
    }
    
    // Parse the signed token
    const parts = signedToken.split(':')
    if (parts.length !== 3) {
      return false
    }
    
    const [storedToken, timestamp, signature] = parts
    
    // Verify the signature
    const tokenData = `${storedToken}:${timestamp}`
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(tokenData)
      .digest('hex')
    
    if (signature !== expectedSignature) {
      return false
    }
    
    // Check if token has expired (2 hours)
    const tokenTime = parseInt(timestamp, 10)
    const now = Date.now()
    const maxAge = 60 * 60 * 2 * 1000 // 2 hours in milliseconds
    
    if (isNaN(tokenTime) || now - tokenTime > maxAge) {
      return false
    }
    
    // Verify the provided token matches the stored token
    return storedToken === providedToken
    
  } catch (error) {
    console.error('CSRF validation error:', error)
    return false
  }
}

export function requireValidCsrf(event: any, providedToken: string) {
  if (!validateCsrfToken(event, providedToken)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Invalid or expired CSRF token'
    })
  }
}

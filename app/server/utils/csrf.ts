import crypto from 'crypto'

export interface CsrfValidationResult {
  isValid: boolean
  error?: string
}

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
    
    if (!timestamp || !signature || !storedToken) {
      return false
    }
    
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

/**
 * Validate CSRF token from contact form (different format than cookie-based)
 * Format: timestamp.randomBytes.signature
 */
export function validateContactCsrfToken(token: string, secret: string): CsrfValidationResult {
  if (!token) {
    return { isValid: false, error: 'CSRF token required' }
  }

  // Parse token parts
  const parts = token.split('.')
  if (parts.length < 3) {
    return { isValid: false, error: 'Invalid CSRF token format' }
  }

  const signature = parts[parts.length - 1]
  const tokenToVerify = token.substring(0, token.lastIndexOf('.'))
  
  // Verify signature
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(tokenToVerify)
  const expectedSignature = hmac.digest('hex')

  if (signature !== expectedSignature) {
    return { isValid: false, error: 'Invalid CSRF token signature' }
  }

  // Check token age (1 hour for contact forms)
  const timestampStr = parts[0]
  if (!timestampStr) {
    return { isValid: false, error: 'Missing timestamp in token' }
  }
  
  const timestamp = parseInt(timestampStr)
  
  if (isNaN(timestamp)) {
    return { isValid: false, error: 'Invalid token timestamp' }
  }

  const tokenAge = Date.now() - timestamp
  const maxAge = 60 * 60 * 1000 // 1 hour

  if (tokenAge > maxAge) {
    return { isValid: false, error: 'CSRF token expired' }
  }

  if (tokenAge < 0) {
    return { isValid: false, error: 'Invalid token timestamp (future)' }
  }

  return { isValid: true }
}

export function requireValidCsrf(event: any, providedToken: string) {
  if (!validateCsrfToken(event, providedToken)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Invalid or expired CSRF token'
    })
  }
}

export function requireValidContactCsrf(token: string, secret: string) {
  const result = validateContactCsrfToken(token, secret)
  if (!result.isValid) {
    throw createError({
      statusCode: 403,
      statusMessage: result.error || 'Invalid CSRF token'
    })
  }
}

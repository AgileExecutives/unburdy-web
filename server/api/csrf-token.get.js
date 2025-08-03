import crypto from 'crypto'

export default defineEventHandler(async (event) => {
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
    csrfToken
  }
})

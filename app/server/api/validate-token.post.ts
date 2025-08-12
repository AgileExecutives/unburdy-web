import type { ErrorResponse } from '../../../types/api'

interface TokenValidationResponse {
  is_valid: boolean
  email: string
  user?: any
}

interface TokenValidationRequest {
  token: string
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<TokenValidationRequest>(event)
    const { token } = body
    
    if (!token) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token ist erforderlich'
      })
    }
    
    console.log('Validating onboarding token:', token)
    
    const config = useRuntimeConfig()
    
    // Call external API to validate token
    const response = await $fetch<TokenValidationResponse>(`${config.apiBaseUrl}/onboarding/validate_token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: {
        token
      }
    })
    
    console.log('Token validation successful:', { 
      token,
      email: response.email,
      is_valid: response.is_valid 
    })
    
    return {
      success: true,
      valid: response.is_valid,
      email: response.email,
      user: response.user || null
    }
    
  } catch (error: any) {
    console.error('Token validation failed:', error.message)
    
    if (error.statusCode === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Token nicht gefunden oder abgelaufen'
      })
    }
    
    if (error.statusCode === 400) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Ungültiger Token'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Fehler bei der Token-Validierung'
    })
  }
})

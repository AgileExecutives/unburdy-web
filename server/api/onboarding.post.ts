import { defineEventHandler, createError, readBody, getMethod } from 'h3'
import type { 
  models_Customer,
  models_User,
  models_Organization,
  models_Plan,
  models_CustomerOnboarding
} from '../../types/api/models'
import { OpenAPI } from '../../types/api/core/OpenAPI'
import { request as __request } from '../../types/api/core/request'
import { createLogger } from '../utils/logger'

// Request body interface
interface OnboardingRequestBody {
  // userToken removed: should not be posted in body
  onboarding_id: number | string // Onboarding process ID for URL path
  user: models_User
  plan: models_Plan
  organization: models_Organization
  customer: models_Customer
    currentStep: number
    steps: any[]
}

// Response interface
interface OnboardingResponse {
  success: boolean
  message: string
  onboarding?: models_CustomerOnboarding
}

export default defineEventHandler(async (event): Promise<OnboardingResponse> => {
  const logger = createLogger('ONBOARDING')
  logger.info('Onboarding request received')

  // Get runtime config
  const config = useRuntimeConfig()
  
  // Configure OpenAPI client with server-side config
  OpenAPI.BASE = config.apiBaseUrl
  
  // Only allow POST requests
  if (getMethod(event) !== 'POST') {
    logger.warn('Invalid HTTP method', { method: getMethod(event) })
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  try {
    // Parse request body
    const body = await readBody(event) as OnboardingRequestBody

    // Get userToken from Authorization header
  const authHeaderRaw = event.headers['authorization'] || event.headers['Authorization']
    let userToken: string | undefined = undefined
    if (Array.isArray(authHeaderRaw)) {
      // If multiple headers, use the first
      userToken = authHeaderRaw[0].startsWith('Bearer ') ? authHeaderRaw[0].slice(7) : undefined
    } else if (typeof authHeaderRaw === 'string') {
      userToken = authHeaderRaw.startsWith('Bearer ') ? authHeaderRaw.slice(7) : undefined
    }

    // Get onboarding_id from body or URL param
    const urlId = event.context.params?.id
    const onboarding_id = body.onboarding_id || urlId

    // Validate required fields (userToken not required in body)
    if (!userToken || !onboarding_id || !body.user || !body.plan || !body.organization || !body.customer || body.currentStep === undefined || !body.steps) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: Authorization header, onboarding_id, user, plan, organization, customer, steps, currentStep'
      })
    }

    // Set the user JWT token for authentication
    OpenAPI.TOKEN = userToken

    // Use the onboarding_id as part of the URL path
    const onboardingEndpoint = `/customer/onboarding/${onboarding_id}`

    logger.info('Making direct API call with custom endpoint', {
  endpoint: onboardingEndpoint,
  hasUserToken: !!userToken
    })

    // Make direct API call with onboarding_id in URL and proper authorization header
    const response = await __request(OpenAPI, {
      method: 'PUT',
      url: onboardingEndpoint,
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      body: body,
      errors: {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        500: 'Internal Server Error',
      },
    }) as models_CustomerOnboarding

    logger.info('Onboarding call successful', {
      onboarding_id: response.id,
      currentStep: response.current_step
    })

    // Return success response
    return {
      success: true,
      message: 'Onboarding initialized successfully',
      onboarding: response
    }

  } catch (error: any) {
    logger.error('Onboarding error', {
      message: error.message,
      status: error.status,
      statusCode: error.statusCode,
      body: error.body,
      responseBody: error.responseBody,
      stack: error.stack
    })
    
    // Handle different types of errors
    if (error.statusCode) {
      throw error
    }
    
    // Handle API errors from the typed service
    if (error.status || error.statusCode) {
      let statusMessage = 'Onboarding initialization failed'
      
      // Map specific error status codes to user-friendly messages
      if (error.status === 401 || error.statusCode === 401) {
        statusMessage = 'Onboarding token invalid or expired'
      } else if (error.status === 403 || error.statusCode === 403) {
        statusMessage = 'Not authorized for onboarding'
      } else if (error.status === 400 || error.statusCode === 400) {
        statusMessage = 'Invalid onboarding data'
      }
      
      throw createError({
        statusCode: error.status || error.statusCode || 400,
        statusMessage
      })
    }
    
    // Handle network or other errors
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  } finally {
    // Clear the token after the request
    OpenAPI.TOKEN = undefined
  }
})

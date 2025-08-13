import { defineEventHandler, createError, readBody, getMethod } from 'h3'
import type { 
  models_CustomerOnboardingRequest,
  models_CustomerOnboarding 
} from '../../types/api'
import { OpenAPI } from '../../types/api/core/OpenAPI'
import { request as __request } from '../../types/api/core/request'
import { createLogger } from '../utils/logger'

// Request body interface
interface OnboardingRequestBody {
  userToken: string // JWT token for authentication (required)
  data: {
    step: number
    customerId: number
    userId: number
    planSlug: string
    onboardingToken: string // Onboarding process ID for URL path
    stepData?: any // Optional step data
  }
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
    
    // Validate required fields
    if (!body.userToken || !body.data || !body.data.customerId || !body.data.userId || !body.data.planSlug || !body.data.onboardingToken) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: userToken, data.customerId, data.userId, data.planSlug, data.onboardingToken'
      })
    }

    // Prepare the onboarding data
    const onboardingData: models_CustomerOnboardingRequest = {
      customer_id: body.data.customerId,
      user_id: body.data.userId,
      plan_slug: body.data.planSlug,
      current_step: body.data.step || 0,
      completed: false,
      step_data: body.data.stepData || {}
    }

    logger.info('Calling backend API for onboarding', { 
      customerId: body.data.customerId,
      userId: body.data.userId,
      planSlug: body.data.planSlug,
      currentStep: body.data.step,
      onboardingTokenId: body.data.onboardingToken,
      apiBaseUrl: config.apiBaseUrl,
      hasUserToken: !!body.userToken
    })

    // Set the user JWT token for authentication
    OpenAPI.TOKEN = body.userToken || undefined
    
    // Use the onboarding token as part of the URL path
    const onboardingEndpoint = `/customer/onboarding/${body.data.onboardingToken}`
    
    logger.info('Making direct API call with custom endpoint', {
      endpoint: onboardingEndpoint,
      hasUserToken: !!body.userToken
    })

    // Make direct API call with onboarding token in URL and proper authorization header
    const response = await __request(OpenAPI, {
      method: 'PUT',
      url: onboardingEndpoint,
      headers: {
        'Authorization': `Bearer ${body.userToken}`,
        'Content-Type': 'application/json',
      },
      body: onboardingData,
      errors: {
        400: 'Bad Request',
        401: 'Unauthorized', 
        403: 'Forbidden',
        500: 'Internal Server Error',
      },
    }) as models_CustomerOnboarding

    logger.info('Onboarding call successful', { 
      onboardingId: response.id,
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

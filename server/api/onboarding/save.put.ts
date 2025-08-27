import { defineEventHandler, createError, readBody, getMethod } from 'h3'
import type { 
  models_CustomerOnboardingRequest,
  models_CustomerOnboardingResponse
} from '../../../types/api/index'
import { OpenAPI } from '../../../types/api/core/OpenAPI'
import { request as __request } from '../../../types/api/core/request'
import { createLogger } from '../../utils/logger'

// Request body interface
interface OnboardingSaveRequestBody {
  onboarding_id: number | string
  user: any
  plan: any
  organization: any
  customer: any
  currentStep: number
  steps: any[]
  userToken: string
}

// Response interface
interface OnboardingSaveResponse {
  success: boolean
  message: string
  onboarding?: models_CustomerOnboardingResponse
}

export default defineEventHandler(async (event): Promise<OnboardingSaveResponse> => {
  const logger = createLogger('ONBOARDING_SAVE')
  logger.info('Onboarding save request received')

  // Get runtime config
  const config = useRuntimeConfig()
  
  // Configure OpenAPI client with server-side config
  OpenAPI.BASE = config.apiBaseUrl
  
  // Only allow PUT requests
  if (getMethod(event) !== 'PUT') {
    logger.warn('Invalid HTTP method', { method: getMethod(event) })
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  try {
    // Read request body
    const body: OnboardingSaveRequestBody = await readBody(event)
    logger.info('Onboarding save data received', { 
      onboarding_id: body.onboarding_id, 
      currentStep: body.currentStep,
      stepsCount: body.steps?.length || 0,
      hasUserToken: !!body.userToken,
      hasUser: !!body.user,
      hasPlan: !!body.plan,
      hasOrganization: !!body.organization,
      hasCustomer: !!body.customer,
      fullBody: JSON.stringify(body, null, 2)
    })

    // Validate required fields
    const { onboarding_id, user, plan, organization, customer, currentStep, steps, userToken } = body
    const missingFields = []
    
    if (!onboarding_id) missingFields.push('onboarding_id')
    if (!userToken) missingFields.push('userToken')
    if (currentStep === undefined || currentStep === null) missingFields.push('currentStep')
    if (!Array.isArray(steps)) missingFields.push('steps')
    // Note: user, plan, organization, customer are optional for save operation

    if (missingFields.length > 0) {
      logger.error('Missing required fields', { missingFields })
      throw createError({
        statusCode: 400,
        statusMessage: `Missing required fields: ${missingFields.join(', ')}`
      })
    }

    // Set the user JWT token for authentication
    OpenAPI.TOKEN = userToken

    // Use the onboarding_id as part of the URL path
    const onboardingEndpoint = `/customer/onboarding/${onboarding_id}`

    // Prepare the request body for the backend API
    // The backend expects a CustomerOnboardingRequest with plan_slug, current_step, and step_data
    const requestBody: models_CustomerOnboardingRequest = {
      plan_slug: plan?.slug || 'standard', // Use existing slug or default
      current_step: currentStep,
      step_data: {
        steps: steps,
        user: user || {},
        organization: organization || {},
        customer: customer || {}
      }
    }

    logger.info('Making API call to save onboarding data', {
      endpoint: onboardingEndpoint,
      currentStep,
      stepsCount: steps.length,
      requestBody: JSON.stringify(requestBody, null, 2)
    })

    // Make direct API call with onboarding_id in URL and proper authorization header
    const response = await __request(OpenAPI, {
      method: 'PUT',
      url: onboardingEndpoint,
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      body: requestBody,
      errors: {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Onboarding not found',
        500: 'Internal Server Error',
      },
    }) as models_CustomerOnboardingResponse

    logger.info('Onboarding save successful', {
      onboarding_id: response.id,
      currentStep: response.current_step
    })

    return {
      success: true,
      message: 'Onboarding data saved successfully',
      onboarding: response
    }

  } catch (error: any) {
    logger.error('Onboarding save failed', { 
      error: error.message,
      status: error.status,
      statusCode: error.statusCode,
      body: error.body,
      responseBody: error.responseBody,
      stack: error.stack
    })
    
    // Handle specific error cases
    if (error.status === 401) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized - Invalid or expired token'
      })
    }
    
    if (error.status === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Onboarding process not found'
      })
    }
    
    if (error.status === 400) {
      throw createError({
        statusCode: 400,
        statusMessage: error.body?.message || 'Invalid request data'
      })
    }

    // Generic error handling
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save onboarding data'
    })
  }
})

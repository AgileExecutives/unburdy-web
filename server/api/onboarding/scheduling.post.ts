import { defineEventHandler, createError, readBody, getMethod } from 'h3'
import type { 
  handlers_OnboardingSchedulingRequest,
  handlers_OnboardingSchedulingResponse
} from '../../../types/api/index'
import { OpenAPI } from '../../../types/api/core/OpenAPI'
import { request as __request } from '../../../types/api/core/request'
import { createLogger } from '../../utils/logger'

// Request body interface
interface SchedulingRequestBody {
  organization_id: number
  plan_slug: string
  current_step?: number
  step_data?: any
  userToken: string
}

// Response interface
interface SchedulingResponse {
  success: boolean
  message: string
  scheduling_data?: handlers_OnboardingSchedulingResponse
}

export default defineEventHandler(async (event): Promise<SchedulingResponse> => {
  const logger = createLogger('ONBOARDING_SCHEDULING')
  logger.info('Onboarding scheduling request received')

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
    // Read request body
    const body: SchedulingRequestBody = await readBody(event)
    logger.info('Scheduling data received', { 
      organization_id: body.organization_id,
      plan_slug: body.plan_slug,
      current_step: body.current_step,
      hasUserToken: !!body.userToken,
      hasStepData: !!body.step_data
    })

    // Validate required fields
    const { organization_id, plan_slug, userToken, current_step, step_data } = body
    const missingFields = []
    
    if (!organization_id) missingFields.push('organization_id')
    if (!plan_slug) missingFields.push('plan_slug')
    if (!userToken) missingFields.push('userToken')

    if (missingFields.length > 0) {
      logger.error('Missing required fields', { missingFields })
      throw createError({
        statusCode: 400,
        statusMessage: `Missing required fields: ${missingFields.join(', ')}`
      })
    }

    // Set the user JWT token for authentication
    OpenAPI.TOKEN = userToken

    // Use the scheduling endpoint
    const schedulingEndpoint = `/customer/onboarding/scheduling`

    // Prepare the request body for the backend API
    const requestBody: handlers_OnboardingSchedulingRequest = {
      organization_id: organization_id,
      plan_slug: plan_slug,
      current_step: current_step,
      step_data: step_data
    }

    logger.info('Making API call to create scheduling', {
      endpoint: schedulingEndpoint,
      requestBody: JSON.stringify(requestBody, null, 2)
    })

    // Make direct API call to the scheduling endpoint
    const response = await __request(OpenAPI, {
      method: 'POST',
      url: schedulingEndpoint,
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      body: requestBody,
      errors: {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        500: 'Internal Server Error',
      },
    }) as handlers_OnboardingSchedulingResponse

    logger.info('Scheduling creation successful', {
      onboarding_id: response.onboarding_id,
      url: response.url,
      token: !!response.token,
      expires_at: response.expires_at
    })

    return {
      success: true,
      message: 'Scheduling created successfully',
      scheduling_data: response
    }

  } catch (error: any) {
    logger.error('Scheduling creation failed', { 
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
        statusMessage: 'Scheduling endpoint not found'
      })
    }
    
    if (error.status === 400) {
      throw createError({
        statusCode: 400,
        statusMessage: error.body?.message || 'Invalid scheduling request data'
      })
    }

    // Generic error handling
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create scheduling'
    })
  }
})

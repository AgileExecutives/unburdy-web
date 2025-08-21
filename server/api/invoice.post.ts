import { defineEventHandler, createError, readBody, getMethod, getHeader } from 'h3'
import type { 
  handlers_InvoiceRequest,
  handlers_InvoiceResponse
} from '../../types/api'
import { CustomerOnboardingService } from '../../types/api/services/CustomerOnboardingService'
import { OpenAPI } from '../../types/api/core/OpenAPI'
import { request as __request } from '../../types/api/core/request'
import { createLogger } from '../utils/logger'

// Response interface
interface InvoiceResponse {
  success: boolean
  message: string
  data?: handlers_InvoiceResponse
}

export default defineEventHandler(async (event): Promise<InvoiceResponse> => {
  const logger = createLogger('INVOICE')
  logger.info('Invoice generation request received')

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
    // Get authorization header
    const authHeader = getHeader(event, 'authorization')
    
    if (!authHeader) {
      logger.error('Missing authorization header')
      throw createError({
        statusCode: 401,
        statusMessage: 'Authorization header is required'
      })
    }

    // Validate bearer token format
    if (!authHeader.startsWith('Bearer ')) {
      logger.error('Invalid authorization header format')
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid authorization header format. Expected: Bearer <token>'
      })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    if (!token) {
      logger.error('Empty bearer token')
      throw createError({
        statusCode: 401,
        statusMessage: 'Bearer token is required'
      })
    }

    // Read and validate request body
    const body = await readBody(event)

    logger.info('Request body received', JSON.stringify(body))

    logger.info('Request body received', { bodyKeys: Object.keys(body || {}) })

    if (!body) {
      logger.error('Empty request body')
      throw createError({
        statusCode: 400,
        statusMessage: 'Request body is required'
      })
    }

    // Validate required invoice data structure
    const invoiceRequest: handlers_InvoiceRequest = {
      client: body.client,
      invoice: body.invoice,
      organization: body.organization,
      provider: body.provider,
      sessions: body.sessions,
      therapy: body.therapy
    }

    // Log the request structure (without sensitive data)
    logger.info('Invoice request prepared', {
      hasClient: !!invoiceRequest.client,
      hasInvoice: !!invoiceRequest.invoice,
      hasOrganization: !!invoiceRequest.organization,
      hasProvider: !!invoiceRequest.provider,
      sessionsCount: invoiceRequest.sessions?.length || 0,
      hasTherapy: !!invoiceRequest.therapy
    })

    console.log('Invoice request prepared:', invoiceRequest)

    // Call the backend API to generate invoice
    logger.info('Calling backend API for invoice generation')
    
    // Since the generated service doesn't include auth, we'll make the request manually
    const response = await __request(OpenAPI, {
      method: 'POST',
      url: '/customer/onboarding/invoice',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: invoiceRequest,
      errors: {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        500: 'Internal Server Error',
      },
    }) as handlers_InvoiceResponse

    logger.info('Backend API response received', {
      success: response.success,
      hasDownloadUrl: !!response.download_url,
      hasInvoicePath: !!response.invoice_path
    })

    // Return successful response
    return {
      success: true,
      message: response.message || 'Invoice generated successfully',
      data: response
    }

  } catch (error: any) {
    logger.error('Invoice generation failed', {
      error: error.message,
      stack: error.stack,
      statusCode: error.statusCode || error.status
    })

    // Handle API errors
    if (error.statusCode || error.status) {
      throw createError({
        statusCode: error.statusCode || error.status,
        statusMessage: error.message || 'Backend API error'
      })
    }

    // Handle validation errors
    if (error.message?.includes('validation') || error.message?.includes('required')) {
      throw createError({
        statusCode: 400,
        statusMessage: `Validation error: ${error.message}`
      })
    }

    // Handle network/connection errors
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      logger.error('Network error connecting to backend', { error: error.message })
      throw createError({
        statusCode: 503,
        statusMessage: 'Backend service unavailable'
      })
    }

    // Generic server error
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error during invoice generation'
    })
  }
})

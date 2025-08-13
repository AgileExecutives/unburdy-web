/**
 * Typed API composable using generated OpenAPI types
 * 
 * Usage:
 * 1. Generate types: `yarn api:generate`
 * 2. Import and use: `const api = useTypedApi()`
 * 3. Call endpoints: `await api.auth.register({ email, password })`
 */

import type { 
  models_RegisterRequest,
  models_AuthResponse,
  models_ContactFormRequest,
  models_ContactFormResponse
} from '../../types/api'
import { AuthService } from '../../types/api/services/AuthService'
import { ContactService } from '../../types/api/services/ContactService'
import { OpenAPI } from '../../types/api/core/OpenAPI'

export const useTypedApi = () => {
  const config = useRuntimeConfig()

  // Configure OpenAPI client for client-side usage
  OpenAPI.BASE = config.public.apiBaseUrl as string

  return {
    // Authentication endpoints using generated AuthService
    auth: {
      register: async (data: models_RegisterRequest): Promise<{
        customer_id?: number;
        message?: string;
        organization_id?: number;
      }> => {
        // Note: This should typically be called from server-side as it requires API token
        return await AuthService.postAuthRegister({
          user: data,
          authorization: 'Bearer API_TOKEN_FROM_SERVER'
        })
      },

      login: async (credentials: { email: string; password: string }): Promise<{
        success: boolean
        message: string
        token?: string
        expiresAt?: number
        user?: {
          id?: number
          email?: string
          first_name?: string
          last_name?: string
          active?: boolean
        }
        requiresVerification?: boolean
      }> => {
        // Use our server-side login endpoint that enforces verification
        return await $fetch('/api/login', {
          method: 'POST',
          body: credentials
        })
      },

      verify: async (token: string): Promise<{
        success: boolean
        message: string
        token?: string
        user?: {
          id?: number
          email?: string
          first_name?: string
          last_name?: string
        }
      }> => {
        // Use our server-side verify endpoint
        return await $fetch('/api/verify', {
          query: { token }
        })
      }
    },

    // Contact endpoints using generated ContactService
    contact: {
      submit: async (data: models_ContactFormRequest): Promise<models_ContactFormResponse> => {
        return await ContactService.postContact({
          contactForm: data
        })
      }
    },

    // Utility endpoints (server-side proxied)
    utils: {
      // CSRF token for forms
      getCsrfToken: async (): Promise<{
        success: boolean
        csrfToken: string
        expiresAt: number
      }> => {
        return await $fetch('/api/csrf-token', { method: 'GET' })
      },
      
      // Onboarding token validation (proxied through our server)
      validateToken: async (data: { token: string }): Promise<{
        success: boolean
        valid: boolean
        email: string
        user?: {
          id?: number
          email?: string
          firstName?: string
          lastName?: string
        }
      }> => {
        return await $fetch('/api/validate-token', {
          method: 'POST',
          body: data
        })
      }
    },
  }
}

// Type-safe API client instance
export type TypedApiClient = ReturnType<typeof useTypedApi>

/**
 * Available API endpoints:
 * - auth.register() - User registration using AuthService
 * - auth.login() - User login with verification check (server-side proxy)
 * - auth.verify() - Email verification using server-side endpoint
 * - contact.submit() - Contact form submission using ContactService
 * - utils.getCsrfToken() - Get CSRF token for forms
 * - utils.validateToken() - Validate onboarding tokens
 */

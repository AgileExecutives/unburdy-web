/**
 * Typed API composable using generated OpenAPI types
 * 
 * Usage:
 * 1. Generate types: `yarn api:generate`
 * 2. Import and use: `const api = useTypedApi()`
 * 3. Call endpoints: `await api.auth.register({ email, password })`
 */

import type { 
  User,
  UserResponse, 
  ErrorResponse 
} from '../../types/api'

export const useTypedApi = () => {
  const config = useRuntimeConfig()

  const apiRequest = async <T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
      body?: any
      query?: Record<string, any>
      headers?: Record<string, string>
    } = {}
  ): Promise<T> => {
    const { method = 'GET', body, query, headers } = options

    let url = `${config.public.apiBaseUrl}${endpoint}`

    // Add query parameters
    if (query) {
      const searchParams = new URLSearchParams()
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
      const queryString = searchParams.toString()
      if (queryString) {
        url += `?${queryString}`
      }
    }

    const requestOptions: any = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }

    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      requestOptions.body = body
    }

    try {
      return await $fetch<T>(url, requestOptions)
    } catch (error) {
      console.error(`API request failed: ${method} ${endpoint}`, error)
      throw error
    }
  }

  return {
    // Authentication endpoints
    auth: {
      register: (data: {
        email: string
        password: string
        first_name: string
        last_name: string
        company?: string
      }): Promise<UserResponse> =>
        apiRequest('/auth/register', {
          method: 'POST',
          body: data,
        }),
    },

    // Onboarding endpoints
    onboarding: {
      validateToken: (data: { token: string }): Promise<{
        is_valid: boolean
        email: string
        user?: User
      }> =>
        apiRequest('/onboarding/validate_token', {
          method: 'POST',
          body: data,
        }),
    },

    // Contact endpoints
    contact: {
      submit: (data: {
        name: string
        email: string
        message: string
        subject?: string
        phone?: string
      }): Promise<{ success: boolean; message: string }> =>
        apiRequest('/contact', {
          method: 'POST',
          body: data,
        }),
    },
  }
}

// Type-safe API client instance
export type TypedApiClient = ReturnType<typeof useTypedApi>

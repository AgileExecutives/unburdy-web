/**
 * Example: Using Generated OpenAPI Services
 * 
 * This file demonstrates how to use the auto-generated API services
 * directly instead of the custom composable.
 */

// Import generated services
import { AuthenticationService } from '../../types/api/services/AuthenticationService'
import { OnboardingService } from '../../types/api/services/OnboardingService' 
import { ContactService } from '../../types/api/services/ContactService'

// Import types
import type { User, UserResponse, ErrorResponse } from '../../types/api'

// Configure the OpenAPI client
import { OpenAPI } from '../../types/api/core/OpenAPI'

export const useGeneratedApi = () => {
  const config = useRuntimeConfig()

  // Configure the global OpenAPI settings
  OpenAPI.BASE = (config.public.apiBaseUrl as string) || 'https://api.unburdy.de/api/v1'
  OpenAPI.TOKEN = config.apiToken as string // For authenticated requests

  return {
    // Authentication
    auth: {
      register: async (data: {
        email: string
        password: string
        first_name: string
        last_name: string
        company?: string
      }): Promise<UserResponse> => {
        return await AuthenticationService.postAuthRegister({
          requestBody: data
        })
      }
    },

    // Onboarding  
    onboarding: {
      validateToken: async (token: string) => {
        return await OnboardingService.postOnboardingValidateToken({
          requestBody: { token }
        })
      }
    },

    // Contact
    contact: {
      submit: async (data: {
        name: string
        email: string
        message: string
        subject?: string
        phone?: string
      }) => {
        return await ContactService.postContact({
          requestBody: data
        })
      }
    }
  }
}

// Example usage in a component:
/*
<script setup>
const api = useGeneratedApi()

const registerUser = async () => {
  try {
    const response = await api.auth.register({
      email: 'user@example.com',
      password: 'password123',
      first_name: 'John',
      last_name: 'Doe'
    })
    console.log('User registered:', response.user)
  } catch (error) {
    console.error('Registration failed:', error)
  }
}
</script>
*/

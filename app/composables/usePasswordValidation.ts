import { ref, computed } from 'vue'

interface PasswordRequirements {
  minLength: number
  capital: boolean
  numbers: boolean
  special: boolean
}

interface PasswordValidation {
  isValid: boolean
  errors: string[]
  requirements: PasswordRequirements | null
}

const passwordRequirements = ref<PasswordRequirements | null>(null)

export const usePasswordValidation = () => {
  const isLoading = ref(false)

  // Fetch password requirements from backend
  const fetchPasswordRequirements = async (): Promise<PasswordRequirements> => {
    if (passwordRequirements.value) {
      return passwordRequirements.value
    }

    isLoading.value = true
    try {
      const response = await $fetch('/auth/password-security', {
        baseURL: 'http://localhost:8080'
      })
      passwordRequirements.value = response as PasswordRequirements
      return passwordRequirements.value
    } catch (error) {
      console.warn('Failed to fetch password requirements, using defaults:', error)
      // Fallback to safe defaults if backend is unavailable
      passwordRequirements.value = {
        minLength: 6,
        capital: false,
        numbers: false,
        special: false
      }
      return passwordRequirements.value
    } finally {
      isLoading.value = false
    }
  }

  // Validate password against requirements
  const validatePassword = async (password: string): Promise<PasswordValidation> => {
    const requirements = await fetchPasswordRequirements()
    const errors: string[] = []

    // Check minimum length
    if (password.length < requirements.minLength) {
      errors.push(`Mindestens ${requirements.minLength} Zeichen erforderlich`)
    }

    // Check for capital letters
    if (requirements.capital && !/[A-Z]/.test(password)) {
      errors.push('Mindestens ein Großbuchstabe erforderlich')
    }

    // Check for numbers
    if (requirements.numbers && !/\d/.test(password)) {
      errors.push('Mindestens eine Zahl erforderlich')
    }

    // Check for special characters
    if (requirements.special && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Mindestens ein Sonderzeichen erforderlich')
    }

    return {
      isValid: errors.length === 0,
      errors,
      requirements
    }
  }

  // Get password strength indicator
  const getPasswordStrength = async (password: string) => {
    const validation = await validatePassword(password)
    if (validation.isValid) {
      return { strength: 'strong', color: 'green', text: 'Starkes Passwort' }
    } else if (password.length >= (validation.requirements?.minLength || 6) / 2) {
      return { strength: 'medium', color: 'yellow', text: 'Mittleres Passwort' }
    } else {
      return { strength: 'weak', color: 'red', text: 'Schwaches Passwort' }
    }
  }

  return {
    isLoading: readonly(isLoading),
    passwordRequirements: readonly(passwordRequirements),
    fetchPasswordRequirements,
    validatePassword,
    getPasswordStrength
  }
}

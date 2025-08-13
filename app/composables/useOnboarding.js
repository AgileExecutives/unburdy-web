// composables/useOnboarding.js
// Onboarding state management

export const useOnboarding = () => {
  // Reactive onboarding state
  const onboardingData = ref(null)

  // Initialize onboarding state from localStorage on client-side
  const initOnboarding = () => {
    if (process.client) {
      const storedOnboardingData = localStorage.getItem('onboardingData')
      
      if (storedOnboardingData) {
        try {
          onboardingData.value = JSON.parse(storedOnboardingData)
        } catch (e) {
          console.warn('Failed to parse stored onboarding data')
        }
      }
    }
  }

  // Initialize immediately when composable is used
  initOnboarding()

  // Set onboarding data
  const setOnboardingData = (data) => {
    onboardingData.value = data

    if (process.client && data) {
      localStorage.setItem('onboardingData', JSON.stringify(data))
    }
  }

  // Update specific onboarding fields
  const updateOnboardingData = (updates) => {
    if (onboardingData.value) {
      onboardingData.value = {
        ...onboardingData.value,
        ...updates
      }

      if (process.client) {
        localStorage.setItem('onboardingData', JSON.stringify(onboardingData.value))
      }
    }
  }

  // Update step data
  const updateStepData = (stepData) => {
    if (onboardingData.value) {
      onboardingData.value = {
        ...onboardingData.value,
        stepData: {
          ...onboardingData.value.stepData,
          ...stepData
        }
      }

      if (process.client) {
        localStorage.setItem('onboardingData', JSON.stringify(onboardingData.value))
      }
    }
  }

  // Set current step
  const setCurrentStep = (step) => {
    updateOnboardingData({ step })
  }

  // Clear onboarding data
  const clearOnboardingData = () => {
    onboardingData.value = null

    if (process.client) {
      localStorage.removeItem('onboardingData')
    }
  }

  // Check if onboarding data exists
  const hasOnboardingData = () => {
    return !!onboardingData.value
  }

  // Get current onboarding data
  const getOnboardingData = () => {
    return onboardingData.value
  }

  // Check if specific onboarding fields are present
  const isOnboardingValid = () => {
    return !!(
      onboardingData.value &&
      onboardingData.value.customerId &&
      onboardingData.value.userId &&
      onboardingData.value.planSlug &&
      onboardingData.value.onboardingToken
    )
  }

  return {
    // State
    onboardingData: readonly(onboardingData),
    
    // Methods
    setOnboardingData,
    updateOnboardingData,
    updateStepData,
    setCurrentStep,
    clearOnboardingData,
    hasOnboardingData,
    getOnboardingData,
    isOnboardingValid,
    initOnboarding
  }
}

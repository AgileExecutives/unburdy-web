// composables/useOnboarding.js
// Onboarding state management

export const useOnboarding = () => {
  // Reactive onboarding state with new structure
  const onboardingData = ref({
    onboarding_id: null,
    user: {},
    plan: {},
    organization: {},
    customer: {},
    currentStep: 1,
    steps: [],
    token: null // Store auth token for Nitro API
  })

  // Initialize onboarding state from localStorage on client-side
  const initOnboarding = (initialData = null) => {
    if (initialData) {
      // Set provided data directly (for registration/mock data)
      onboardingData.value = {
        onboarding_id: initialData.onboarding_id || initialData.onboarding_id || null,
        user: initialData.user || {},
        plan: initialData.plan || {},
        organization: initialData.organization || {},
        customer: initialData.customer || {},
        currentStep: initialData.currentStep || 0,
        steps: initialData.steps || [],
        token: initialData.token || null
      }
      saveToStorage()
      return
    }
    
    // Load from localStorage if no initial data provided
    if (process.client) {
      const storedOnboardingData = localStorage.getItem('onboardingData')
      if (storedOnboardingData) {
        try {
          const parsed = JSON.parse(storedOnboardingData)
          // Migrate old data structure if needed
          if (parsed.stepData) {
            onboardingData.value = {
              onboarding_id: parsed.onboarding_id || parsed.onboarding_id || null,
              user: parsed.user || {},
              plan: parsed.plan || {},
              organization: parsed.organization || {},
              customer: parsed.customer || {},
              currentStep: parsed.stepData.currentStep || 0,
              steps: parsed.stepData.steps || []
            }
          } else {
            onboardingData.value = {
              onboarding_id: parsed.onboarding_id || parsed.onboarding_id || null,
              user: parsed.user || {},
              plan: parsed.plan || {},
              organization: parsed.organization || {},
              customer: parsed.customer || {},
              currentStep: parsed.currentStep || 0,
              steps: parsed.steps || []
            }
          }
        } catch (e) {
          console.warn('Failed to parse stored onboarding data')
          onboardingData.value = {
            onboarding_id: null,
            user: {},
            plan: {},
            organization: {},
            customer: {},
            currentStep: 1,
            steps: []
          }
        }
      }
    }
  }

  // Initialize immediately when composable is used
  initOnboarding()

  // Save to localStorage
  const saveToStorage = () => {
    if (process.client) {
  localStorage.setItem('onboardingData', JSON.stringify(onboardingData.value))
  const getOnboardingToken = () => {
    return onboardingData.value.token
  }

    }
  }

  // Update user data
  const updateUserData = (userData) => {
    onboardingData.value.user = {
      ...onboardingData.value.user,
      ...userData
    }
    saveToStorage()
  }

  // Save data for current step
  const saveStepData = (stepNumber, data) => {
    const steps = [...onboardingData.value.steps]
    const existingIndex = steps.findIndex(step => step.stepNumber === stepNumber)
    
    if (existingIndex >= 0) {
      steps[existingIndex] = { stepNumber, ...data }
    } else {
      steps.push({ stepNumber, ...data })
    }
    
    onboardingData.value.steps = steps
    saveToStorage()
  }

  // Get data for specific step
  const getStepData = (stepNumber) => {
    return onboardingData.value.steps.find(step => step.stepNumber === stepNumber)
  }

  // Set current step
  const setCurrentStep = (step) => {
    onboardingData.value.currentStep = step
    saveToStorage()
  }

  // Get current step
  const getCurrentStep = () => {
      if (!onboardingData.value) {
        const storedOnboardingData = localStorage.getItem('onboardingData')
        onboardingData.value = JSON.parse(storedOnboardingData)
      }
    return onboardingData.value.currentStep
  }

  // Go back one step and delete current step data
  const goBack = () => {
    const currentStep = onboardingData.value.currentStep
    if (currentStep > 1) {
      // Remove data for current step
      onboardingData.value.steps = onboardingData.value.steps.filter(
        step => step.stepNumber !== currentStep
      )
      // Go to previous step
      onboardingData.value.currentStep = currentStep - 1
      saveToStorage()
      return currentStep - 1
    }
    return currentStep
  }

  // Clear all onboarding data
  const clearOnboardingData = () => {
    onboardingData.value = {
      onboarding_id: null,
      user: {},
      plan: {},
      organization: {},
      customer: {},
      currentStep: 1,
      steps: []
    }

    if (process.client) {
      localStorage.removeItem('onboardingData')
    }
  }

  // Clear all onboarding data
  const clearOnboardingStepsData = () => {
    onboardingData.value.stepData = {
      currentStep: 0,
      steps: []
    }
    saveToStorage()
  }


  // Check if onboarding data exists
  const hasOnboardingData = () => {
  return !!(onboardingData.value.onboarding_id && onboardingData.value.user && Object.keys(onboardingData.value.user).length > 0)
  }

  // Get current onboarding data (legacy compatibility)
  const getOnboardingData = () => {
    return onboardingData.value
  }

  // Get user data
  const getUserData = () => {
  return onboardingData.value.user
  }

  // Check if specific onboarding fields are present
  const isOnboardingValid = () => {
    const user = onboardingData.value.user
    return !!(
      onboardingData.value.onboarding_id &&
      user &&
      user.id &&
      onboardingData.value.plan && onboardingData.value.plan.id
    )
  }

  return {
    // State
    onboardingData: readonly(onboardingData),
    
    // Methods
    updateUserData,
    saveStepData,
    getStepData,
    setCurrentStep,
    getCurrentStep,
    goBack,
    clearOnboardingData,
    clearOnboardingStepsData,
    hasOnboardingData,
    getOnboardingData,
    getUserData,
    isOnboardingValid,
    initOnboarding
  }
}

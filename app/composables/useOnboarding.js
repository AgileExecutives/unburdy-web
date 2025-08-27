// composables/useOnboarding.js
// Onboarding state management
import { ref, readonly } from 'vue'
import { useAuth } from './useAuth'

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
    }
  }

  // Get onboarding token
  const getOnboardingToken = () => {
    return onboardingData.value.token
  }

  // Save onboarding data to database
  const saveOnboardingToDatabase = async () => {
    // Get token from useAuth instead of onboarding data
    const { getToken } = useAuth()
    const token = getToken()
    const onboardingId = onboardingData.value.onboarding_id
    
    // Try to get plan slug from plan data or fallback to a default
    let planSlug = onboardingData.value.plan?.slug
    if (!planSlug && process.client) {
      // Try to get from URL if we're on an onboarding page
      const currentPath = window.location.pathname
      const planMatch = currentPath.match(/\/lc\/anmelden\/([^\/]+)/)
      if (planMatch) {
        planSlug = planMatch[1]
      }
    }
    planSlug = planSlug || 'standard' // Final fallback
    
    console.log('Attempting to save onboarding data to database:', {
      hasToken: !!token,
      onboardingId: onboardingId,
      planSlug: planSlug,
      currentStep: onboardingData.value.currentStep,
      stepsCount: onboardingData.value.steps?.length || 0,
      planData: onboardingData.value.plan,
      userData: onboardingData.value.user,
      organizationData: onboardingData.value.organization,
      customerData: onboardingData.value.customer
    })
    
    if (!token) {
      console.warn('Cannot save to database: missing authentication token')
      return { success: false, message: 'Missing authentication token' }
    }
    
    if (!onboardingId) {
      console.warn('Cannot save to database: missing onboarding_id (this is normal during development/testing)')
      return { success: false, message: 'Missing onboarding ID - skipping database save' }
    }

    try {
      const response = await $fetch('/api/onboarding/save', {
        method: 'PUT',
        body: {
          onboarding_id: onboardingId,
          user: onboardingData.value.user || {},
          plan: { slug: planSlug, ...onboardingData.value.plan },
          organization: onboardingData.value.organization || {},
          customer: onboardingData.value.customer || {},
          currentStep: onboardingData.value.currentStep,
          steps: onboardingData.value.steps,
          userToken: token
        }
      })
      
      console.log('Onboarding data saved to database successfully:', response)
      return response
    } catch (error) {
      console.error('Failed to save onboarding data to database:', error)
      return { 
        success: false, 
        message: error.data?.message || 'Failed to save to database' 
      }
    }
  }

  // Create onboarding scheduling
  const createOnboardingScheduling = async () => {
    // Get token from useAuth
    const { getToken } = useAuth()
    const token = getToken()
    
    // Get required data
    const organizationId = onboardingData.value.organization?.id
    let planSlug = onboardingData.value.plan?.slug
    
    // Try to get plan slug from URL if not available
    if (!planSlug && process.client) {
      const currentPath = window.location.pathname
      const planMatch = currentPath.match(/\/lc\/anmelden\/([^\/]+)/)
      if (planMatch) {
        planSlug = planMatch[1]
      }
    }
    planSlug = planSlug || 'standard' // Final fallback
    
    console.log('Attempting to create onboarding scheduling:', {
      hasToken: !!token,
      organizationId: organizationId,
      planSlug: planSlug,
      currentStep: onboardingData.value.currentStep
    })
    
    if (!token) {
      console.warn('Cannot create scheduling: missing authentication token')
      return { success: false, message: 'Missing authentication token' }
    }
    
    if (!organizationId) {
      console.warn('Cannot create scheduling: missing organization_id')
      return { success: false, message: 'Missing organization ID' }
    }

    try {
      const response = await $fetch('/api/onboarding/scheduling', {
        method: 'POST',
        body: {
          organization_id: organizationId,
          plan_slug: planSlug,
          current_step: onboardingData.value.currentStep,
          step_data: {
            steps: onboardingData.value.steps,
            user: onboardingData.value.user || {},
            customer: onboardingData.value.customer || {}
          },
          userToken: token
        }
      })
      
      console.log('Onboarding scheduling created successfully:', response)
      return response
    } catch (error) {
      console.error('Failed to create onboarding scheduling:', error)
      return { 
        success: false, 
        message: error.data?.message || 'Failed to create scheduling' 
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

  // Set onboarding ID (useful for development/testing)
  const setOnboardingId = (id) => {
    onboardingData.value.onboarding_id = id
    saveToStorage()
  }

  // Save data for current step
  const saveStepData = (stepNumber, data) => {
    // Filter out empty objects and invalid steps
    const steps = [...onboardingData.value.steps].filter(step => 
      step && typeof step === 'object' && step.stepNumber
    )
    
    const existingIndex = steps.findIndex(step => step.stepNumber === stepNumber)
    
    if (existingIndex >= 0) {
      steps[existingIndex] = { stepNumber, ...data }
    } else {
      steps.push({ stepNumber, ...data })
    }

    console.log('Saving step data (filtered):', steps)

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

  // Go back one step (without deleting current step data)
  const goBack = () => {
    const currentStep = onboardingData.value.currentStep
    if (currentStep > 1) {
      // Just go to previous step without removing data
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
    setOnboardingId,
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
    initOnboarding,
    getOnboardingToken,
    saveOnboardingToDatabase,
    createOnboardingScheduling
  }
}

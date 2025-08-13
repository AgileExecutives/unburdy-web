<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="text-center">
          <UnburdyLogo class="mx-auto h-16 w-auto" />
          <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-primary">
            E-Mail-Bestätigung
          </h2>
        </div>
      </div>

      <div class="sm:mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div class="sm:bg-background-secondary sm:py-8 px-4 shadow sm:rounded-lg sm:px-10 sm:border border-default">
          <!-- Loading State -->
          <div v-if="isVerifying" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p class="text-secondary">E-Mail wird bestätigt...</p>
          </div>

          <!-- Success State -->
          <div v-else-if="verificationResult && verificationResult.success" class="text-center py-8">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
              <svg class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-primary mb-2">
              E-Mail erfolgreich bestätigt!
            </h3>
            <p class="text-secondary mb-6">
              Ihre E-Mail-Adresse wurde erfolgreich verifiziert. Sie können sich nun in Ihr Unburdy-Konto einloggen.
            </p>
            <div class="space-y-3">
              <NuxtLink 
                :to="config.public.unburdyApp" 
                class="block w-full px-4 py-2 text-center bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors duration-200"
              >
                Zum Login
              </NuxtLink>
              <NuxtLink 
                to="/" 
                class="block w-full px-4 py-2 text-center border border-default text-secondary hover:bg-background-tertiary transition-colors duration-200 rounded-lg"
              >
                Zurück zur Startseite
              </NuxtLink>
            </div>
          </div>

          <!-- Error State -->
          <div v-else class="text-center py-8">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
              <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-primary mb-2">
              {{ errorTitle }}
            </h3>
            <p class="text-secondary mb-6">
              {{ errorMessage }}
            </p>
            <div class="space-y-3">
              <button 
                @click="retryVerification"
                v-if="canRetry"
                class="block w-full px-4 py-2 text-center bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors duration-200"
              >
                Erneut versuchen
              </button>
              <NuxtLink 
                to="/preise" 
                class="block w-full px-4 py-2 text-center border border-default text-secondary hover:bg-background-tertiary transition-colors duration-200 rounded-lg"
              >
                Neuen Account erstellen
              </NuxtLink>
              <NuxtLink 
                to="/" 
                class="block w-full px-4 py-2 text-center text-tertiary hover:text-secondary transition-colors duration-200"
              >
                Zurück zur Startseite
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Additional Help -->
        <div class="mt-6 text-center">
          <p class="text-sm text-tertiary">
            Probleme bei der Verifizierung? 
            <NuxtLink to="/legal/kontakt" class="text-accent hover:text-accent-hover">
              Kontaktieren Sie uns
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Verification response interface
interface VerificationResponse {
  success: boolean
  message: string
}

// Define page meta
definePageMeta({
  layout: 'default',
  title: 'E-Mail-Bestätigung | Unburdy'
})

// Get route params
const route = useRoute()
const config = useRuntimeConfig()

// Reactive state
const isVerifying = ref(true)
const verificationResult = ref<VerificationResponse | null>(null)
const errorTitle = ref('')
const errorMessage = ref('')
const canRetry = ref(false)

// Get token from route parameters
const token = computed(() => route.params.token as string)

// Verification function
const verifyToken = async () => {
  if (!token.value) {
    isVerifying.value = false
    errorTitle.value = 'Ungültiger Link'
    errorMessage.value = 'Der Bestätigungslink ist ungültig oder unvollständig. Bitte überprüfen Sie den Link in Ihrer E-Mail.'
    canRetry.value = false
    return
  }

  try {
    isVerifying.value = true
    
    // Call our server-side verify-token endpoint
    const response = await $fetch('/api/verify-token', {
      method: 'POST',
      body: { token: token.value }
    })

    // On successful verification (HTTP 200), show success state
    isVerifying.value = false
    verificationResult.value = {
      success: true,
      message: 'E-Mail erfolgreich bestätigt'
    }

    // Track successful verification
    const { trackConversion } = useAnalytics()
    trackConversion('email_verification_success', 1, {
      token_length: token.value.length
    })

  } catch (error: any) {
    console.error('Email verification failed:', error)
    isVerifying.value = false
    canRetry.value = true

    // Handle different error types
    if (error.statusCode === 400) {
      errorTitle.value = 'Ungültiger Token'
      errorMessage.value = 'Der Bestätigungslink ist ungültig oder falsch formatiert. Bitte überprüfen Sie den Link in Ihrer E-Mail.'
    } else if (error.statusCode === 404) {
      errorTitle.value = 'Token nicht gefunden'
      errorMessage.value = 'Der Bestätigungslink ist nicht mehr gültig oder bereits abgelaufen. Bitte erstellen Sie einen neuen Account.'
      canRetry.value = false
    } else if (error.statusCode === 410) {
      errorTitle.value = 'Token bereits verwendet'
      errorMessage.value = 'Dieser Bestätigungslink wurde bereits verwendet. Sie können sich direkt in Ihr Konto einloggen.'
      canRetry.value = false
    } else {
      errorTitle.value = 'Verifizierung fehlgeschlagen'
      errorMessage.value = 'Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.'
    }

    // Track failed verification
    const { trackConversion } = useAnalytics()
    trackConversion('email_verification_failed', 0, {
      error_code: error.statusCode,
      error_message: error.statusMessage
    })
  }
}

// Retry function
const retryVerification = () => {
  verifyToken()
}

// Verify token on mount
onMounted(() => {
  verifyToken()
})

// Watch for token changes (if user modifies URL)
watch(token, (newToken) => {
  if (newToken) {
    verifyToken()
  }
})

// SEO Meta
useSeoMeta({
  title: 'E-Mail-Bestätigung | Unburdy',
  description: 'Bestätigen Sie Ihre E-Mail-Adresse für Ihr Unburdy-Konto.',
  robots: 'noindex, nofollow' // Don't index verification pages
})
</script>

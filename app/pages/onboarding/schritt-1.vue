<template>
  <!-- Fortschrittsanzeige -->
  <OnboardingFortschritt />

  <div class="max-w-2xl mx-auto px-6 py-16">
    <!-- Loading State -->
    <div v-if="isValidating" class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
      <p class="text-lg text-secondary">Token wird validiert...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="validationError" class="text-center">
      <div class="mb-8">
        <svg class="mx-auto h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.856-.833-2.626 0L5.106 21.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h1 class="text-3xl font-bold text-red-600 mb-4">
          Token ungültig
        </h1>
        <p class="text-lg text-secondary mb-6">
          {{ validationError }}
        </p>
        <p class="text-secondary">
          Bitte überprüfen Sie Ihre E-Mail oder fordern Sie einen neuen Link an.
        </p>
      </div>
      <NuxtLink 
        to="/anmelden" 
        class="inline-flex items-center px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover transition-colors duration-200"
      >
        Zurück zur Anmeldung
      </NuxtLink>
    </div>

    <!-- Success State -->
    <div v-else-if="validationSuccess">
      <div class="text-center mb-12">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
          <svg class="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-primary mb-4">
          Willkommen bei Unburdy! 🎉
        </h1>
        <p class="text-xl text-secondary leading-relaxed">
          Ihr Token wurde erfolgreich validiert. Lassen Sie uns gemeinsam Ihr Konto einrichten.
        </p>
      </div>

      <!-- User Info -->
      <div v-if="userEmail" class="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-8">
        <h2 class="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
          Bestätigte E-Mail-Adresse
        </h2>
        <p class="text-green-700 dark:text-green-300">
          {{ userEmail }}
        </p>
      </div>

      <!-- Next Steps -->
      <div class="bg-surface rounded-xl p-8 mb-12">
        <h2 class="text-lg font-semibold text-primary mb-4">
          Das erwartet dich in den nächsten Schritten:
        </h2>
        <div class="space-y-4">
          <div class="flex items-start">
            <div class="flex-shrink-0 h-6 w-6 rounded-full bg-accent-light dark:bg-accent-dark/50 flex items-center justify-center mr-4 mt-0.5">
              <span class="text-sm font-medium text-accent dark:text-accent-light">1</span>
            </div>
            <div>
              <h3 class="font-medium text-primary">Grundeinstellungen</h3>
              <p class="text-secondary text-sm">Stundensatz, Sitzungsdauer und weitere Basis-Einstellungen</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0 h-6 w-6 rounded-full bg-surface-secondary border border-secondary flex items-center justify-center mr-4 mt-0.5">
              <span class="text-sm font-medium text-tertiary">2</span>
            </div>
            <div>
              <h3 class="font-medium text-primary">Ersten Klienten anlegen</h3>
              <p class="text-secondary text-sm">Wir zeigen dir, wie einfach die Klientenverwaltung funktioniert</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0 h-6 w-6 rounded-full bg-surface-secondary border border-secondary flex items-center justify-center mr-4 mt-0.5">
              <span class="text-sm font-medium text-tertiary">3</span>
            </div>
            <div>
              <h3 class="font-medium text-primary">Kontakte & Kostenträger</h3>
              <p class="text-secondary text-sm">Elternkontakte und Kostenträger-Informationen hinterlegen</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0 h-6 w-6 rounded-full bg-surface-secondary border border-secondary flex items-center justify-center mr-4 mt-0.5">
              <span class="text-sm font-medium text-tertiary">4</span>
            </div>
            <div>
              <h3 class="font-medium text-primary">Fertig!</h3>
              <p class="text-secondary text-sm">Alles bereit für den Start in deine digitale Praxis</p>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center">
        <NuxtLink 
          to="/onboarding/schritt-2" 
          class="inline-flex items-center px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Los geht's! 
          <svg class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </NuxtLink>
        <p class="mt-4 text-sm text-tertiary">
          Du kannst das Setup jederzeit unterbrechen und später fortsetzen.
        </p>
      </div>
    </div>

    <!-- Debug-Komponente (nur in Development) -->
    <OnboardingDebug v-if="isDev && validationSuccess" />
    
    <!-- Color Scheme Demo -->
    <ColorSchemeDemo v-if="showColorDemo && validationSuccess" @close="showColorDemo = false" />
  </div>
</template>

<script setup>
// Authentifizierung erforderlich
definePageMeta({
  middleware: 'auth',
  layout: 'onboarding'
})

// Meta-Tags für SEO
useHead({
  title: 'Willkommen - Unburdy Onboarding',
  meta: [
    { name: 'description', content: 'Willkommen bei Unburdy! Starten Sie jetzt mit dem einfachen Setup Ihrer Therapie-Praxis.' }
  ]
})

// Store initialisieren
const store = useOnboardingAutoSave()
const showColorDemo = ref(true)
const isDev = computed(() => process.dev)

// Token validation state
const isValidating = ref(true)
const validationSuccess = ref(false)
const validationError = ref('')
const userEmail = ref('')

// Auth-Store für JWT
const { setAuth } = useAuth ? useAuth() : { setAuth: () => {} }
const route = useRoute()

onMounted(async () => {
  store.loadFromStorage()
  store.goToStep(1)

  // Token aus URL extrahieren (Pfad: /onboarding/schritt-1/:token)
  if (tokenFromPath) {
    try {
      isValidating.value = true
      
      // Call our validation API
      const response = await $fetch('/api/onboarding/validate-token', {
        method: 'POST',
        body: { token: tokenFromPath }
      })
      
      if (response.success && response.valid) {
        validationSuccess.value = true
        userEmail.value = response.email
        
        // If we have user data, store it
        if (response.user) {
          // Store user information for later use
          store.setUserData(response.user)
        }
        
        console.log('Token validation successful:', response)
      } else {
        validationError.value = 'Token ist ungültig oder abgelaufen'
      }
      
    } catch (error) {
      console.error('Token-Verifikation fehlgeschlagen:', error)
      
      if (error.statusCode === 404) {
        validationError.value = 'Token nicht gefunden oder abgelaufen'
      } else if (error.statusCode === 400) {
        validationError.value = 'Ungültiger Token'
      } else {
        validationError.value = 'Fehler bei der Token-Validierung'
      }
    } finally {
      isValidating.value = false
    }
  } else {
    // No token in URL
    isValidating.value = false
    validationError.value = 'Kein Token gefunden'
  }
})
</script>

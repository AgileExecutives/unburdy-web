<template>
  <div class="bg-background min-h-screen">
    <!-- Fortschrittsanzeige -->
    <OnboardingFortschritt />

    <div class="max-w-2xl mx-auto px-6 py-16">
      <div class="mb-12">
        <h1 class="text-3xl font-bold text-primary mb-4">
          Ersten Klienten anlegen
        </h1>
        <p class="text-lg text-secondary">
          Lass uns gemeinsam deinen ersten Klienten anlegen. Du kannst später weitere hinzufügen oder diese Daten ändern.
        </p>
      </div>

      <form @submit.prevent="saveAndContinue" class="space-y-8">
        <!-- Persönliche Daten -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h2 class="text-xl font-semibold text-primary mb-6">Persönliche Daten</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="firstName" class="block text-sm font-medium text-secondary mb-2">
                Vorname *
              </label>
              <input 
                type="text" 
                id="firstName" 
                v-model="client.firstName"
                required
                class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
              >
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-secondary mb-2">
                Nachname *
              </label>
              <input 
                type="text" 
                id="lastName" 
                v-model="client.lastName"
                required
                class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
              >
            </div>
            <div>
              <label for="birthDate" class="block text-sm font-medium text-secondary mb-2">
                Geburtsdatum
              </label>
              <input 
                type="date" 
                id="birthDate" 
                v-model="client.birthDate"
                class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
              >
            </div>
            <div>
              <label for="gender" class="block text-sm font-medium text-secondary mb-2">
                Geschlecht
              </label>
              <select 
                id="gender" 
                v-model="client.gender"
                class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
              >
                <option value="">Bitte wählen</option>
                <option value="male">Männlich</option>
                <option value="female">Weiblich</option>
                <option value="diverse">Divers</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Kontaktdaten -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h2 class="text-xl font-semibold text-primary mb-6">Kontaktdaten</h2>
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label for="street" class="block text-sm font-medium text-secondary mb-2">
                  Straße
                </label>
                <input 
                  type="text" 
                  id="street" 
                  v-model="client.address.street"
                  class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
                >
              </div>
              <div>
                <label for="zipCode" class="block text-sm font-medium text-secondary mb-2">
                  PLZ
                </label>
                <input 
                  type="text" 
                  id="zipCode" 
                  v-model="client.address.zipCode"
                  class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
                >
              </div>
              <div>
                <label for="city" class="block text-sm font-medium text-secondary mb-2">
                  Stadt
                </label>
                <input 
                  type="text" 
                  id="city" 
                  v-model="client.address.city"
                  class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
                >
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="phone" class="block text-sm font-medium text-secondary mb-2">
                  Telefon
                </label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="client.phone"
                  class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
                >
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-secondary mb-2">
                  E-Mail
                </label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="client.email"
                  class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Therapie-Informationen -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h2 class="text-xl font-semibold text-primary mb-6">Therapie-Informationen</h2>
          <div class="space-y-6">
            <div>
              <label for="diagnosis" class="block text-sm font-medium text-secondary mb-2">
                Diagnose (optional)
              </label>
              <textarea 
                id="diagnosis" 
                v-model="client.diagnosis"
                rows="3"
                placeholder="z.B. Sprachentwicklungsstörung, Artikulationsstörung..."
                class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200 resize-none"
              ></textarea>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="therapyStart" class="block text-sm font-medium text-secondary mb-2">
                  Therapiebeginn
                </label>
                <input 
                  type="date" 
                  id="therapyStart" 
                  v-model="client.therapyStart"
                  class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
                >
              </div>
              <div>
                <label for="frequency" class="block text-sm font-medium text-secondary mb-2">
                  Therapiefrequenz
                </label>
                <select 
                  id="frequency" 
                  v-model="client.frequency"
                  class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
                >
                  <option value="">Bitte wählen</option>
                  <option value="weekly">1x pro Woche</option>
                  <option value="biweekly">2x pro Woche</option>
                  <option value="monthly">1x pro Monat</option>
                  <option value="irregular">Unregelmäßig</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-800 dark:text-red-200">{{ errorMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between items-center pt-8">
          <NuxtLink 
            to="/onboarding/schritt-2" 
            class="inline-flex items-center px-6 py-3 border border-default rounded-lg font-medium text-secondary bg-surface hover:bg-surface-secondary transition-colors duration-200"
          >
            <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Zurück
          </NuxtLink>
          
          <button 
            type="submit" 
            :disabled="isLoading"
            class="inline-flex items-center px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Erstelle Klient...' : 'Weiter' }}
            <svg v-if="!isLoading" class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// Authentifizierung erforderlich
definePageMeta({
  middleware: 'auth'
})

// Meta-Tags für SEO
useHead({
  title: 'Erster Klient - Unburdy Onboarding',
  meta: [
    { name: 'description', content: 'Legen Sie Ihren ersten Klienten in Unburdy an.' }
  ]
})

// Store verwenden
const store = useOnboardingAutoSave()

// Loading state für API calls
const isLoading = ref(false)
const errorMessage = ref('')

// Reactive state aus dem Store
const client = computed({
  get: () => store.client,
  set: (value) => store.updateClient(value)
})

// Beim Laden der Seite
onMounted(() => {
  store.goToStep(3)
})

// Form submission mit API integration
const saveAndContinue = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // Ersten Klienten über API erstellen
    const result = await store.saveFirstClient()
    
    if (result.success) {
      console.log('Klient erfolgreich erstellt:', result.data)
      
      // Zum nächsten Schritt navigieren
      store.nextStep()
      await navigateTo('/onboarding/schritt-4')
    } else {
      errorMessage.value = result.error || 'Fehler beim Erstellen des Klienten'
    }
  } catch (error) {
    console.error('Unerwarteter Fehler:', error)
    errorMessage.value = 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
  } finally {
    isLoading.value = false
  }
}
</script>

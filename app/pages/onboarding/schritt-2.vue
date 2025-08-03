<template>
  <div class="bg-background min-h-screen">
    <!-- Fortschrittsanzeige -->
    <OnboardingFortschritt />

    <div class="max-w-2xl mx-auto px-6 py-16">
      <div class="mb-12">
        <h1 class="text-3xl font-bold text-primary mb-4">
          Grundeinstellungen konfigurieren
        </h1>
        <p class="text-lg text-secondary">
          Lass uns deine Praxis-Einstellungen einrichten. Du kannst alles später jederzeit anpassen.
        </p>
      </div>

      <form @submit.prevent="saveAndContinue" class="space-y-8">
        <!-- Therapeut/in Informationen -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h2 class="text-xl font-semibold text-primary mb-6">Deine Informationen</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="title" class="block text-sm font-medium text-secondary mb-2">
                Titel (optional)
              </label>
              <InputField 
                type="text" 
                id="title" 
                v-model="settings.title"
                placeholder="Dr., M.A., etc."
              />
            </div>
            <div>
              <label for="profession" class="block text-sm font-medium text-secondary mb-2">
                Berufsbezeichnung
              </label>
              <SelectField 
                id="profession" 
                v-model="settings.profession"
              >
                <option value="">Bitte wählen</option>
                <option value="logopaedin">Logopädin/Logopäde</option>
                <option value="ergotherapeutin">Ergotherapeutin/Ergotherapeut</option>
                <option value="physiotherapeutin">Physiotherapeutin/Physiotherapeut</option>
                <option value="psychotherapeutin">Psychotherapeutin/Psychotherapeut</option>
                <option value="heilpaedagogin">Heilpädagogin/Heilpädagoge</option>
                <option value="andere">Andere</option>
              </SelectField>
            </div>
          </div>
        </div>

        <!-- Abrechnungseinstellungen -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h2 class="text-xl font-semibold text-primary mb-6">Abrechnungseinstellungen</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="hourlyRate" class="block text-sm font-medium text-secondary mb-2">
                Standard-Stundensatz (€)
              </label>
              <input 
                type="number" 
                id="hourlyRate" 
                v-model.number="settings.hourlyRate"
                placeholder="85"
                min="0"
                step="0.01"
                class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
              >
              <p class="mt-1 text-sm text-tertiary">Standardwert für neue Termine</p>
            </div>
            <div>
              <label for="sessionDuration" class="block text-sm font-medium text-secondary mb-2">
                Standard-Sitzungsdauer (Min.)
              </label>
              <select 
                id="sessionDuration" 
                v-model.number="settings.sessionDuration"
                class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
              >
                <option :value="30">30 Minuten</option>
                <option :value="45">45 Minuten</option>
                <option :value="60">60 Minuten</option>
                <option :value="90">90 Minuten</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Praxis-Einstellungen -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h2 class="text-xl font-semibold text-primary mb-6">Praxis-Einstellungen</h2>
          <div class="space-y-6">
            <div>
              <label for="practiceHours" class="block text-sm font-medium text-secondary mb-3">
                Übliche Arbeitszeiten
              </label>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs text-tertiary mb-1">Von</label>
                  <input 
                    type="time" 
                    v-model="settings.workingHours.start"
                    class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
                  >
                </div>
                <div>
                  <label class="block text-xs text-tertiary mb-1">Bis</label>
                  <input 
                    type="time" 
                    v-model="settings.workingHours.end"
                    class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
                  >
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary mb-3">
                Arbeitstage
              </label>
              <div class="flex flex-wrap gap-2">
                <label v-for="day in weekDays" :key="day.value" class="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    :value="day.value"
                    v-model="settings.workingDays"
                    class="rounded border-default text-accent shadow-sm focus:border-accent focus:ring focus:ring-accent focus:ring-opacity-50"
                  >
                  <span class="ml-2 text-sm text-secondary">{{ day.label }}</span>
                </label>
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
            to="/onboarding/schritt-1" 
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
            {{ isLoading ? 'Speichern...' : 'Weiter' }}
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
  title: 'Grundeinstellungen - Unburdy Onboarding',
  meta: [
    { name: 'description', content: 'Konfigurieren Sie Ihre Grundeinstellungen für Ihre Therapie-Praxis.' }
  ]
})

// Store verwenden
const store = useOnboardingAutoSave()

// Loading state für API calls
const isLoading = ref(false)
const errorMessage = ref('')

// Reactive state aus dem Store
const settings = computed({
  get: () => store.settings,
  set: (value) => store.updateSettings(value)
})

const weekDays = [
  { value: 'mo', label: 'Montag' },
  { value: 'di', label: 'Dienstag' },
  { value: 'mi', label: 'Mittwoch' },
  { value: 'do', label: 'Donnerstag' },
  { value: 'fr', label: 'Freitag' },
  { value: 'sa', label: 'Samstag' },
  { value: 'so', label: 'Sonntag' }
]

// Beim Laden der Seite
onMounted(() => {
  store.goToStep(2)
})

// Form submission mit API integration
const saveAndContinue = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // Daten über API speichern
    const result = await store.saveData()
    
    if (result.success) {
      console.log('Einstellungen erfolgreich gespeichert:', result.data)
      
      // Zum nächsten Schritt navigieren
      store.nextStep()
      await navigateTo('/onboarding/schritt-3')
    } else {
      errorMessage.value = result.error || 'Fehler beim Speichern der Einstellungen'
    }
  } catch (error) {
    console.error('Unerwarteter Fehler:', error)
    errorMessage.value = 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
  } finally {
    isLoading.value = false
  }
}
</script>

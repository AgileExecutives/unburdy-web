<template>
  <!-- Fortschrittsanzeige -->
  <OnboardingFortschritt />

  <div class="max-w-2xl mx-auto px-6 py-16">
      <div class="text-center mb-12">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-surface ht mb-6">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-primary mb-4">
          Willkommen bei Unburdy! 🎉
        </h1>
        <p class="text-xl text-secondary leading-relaxed">
          Schön, dass du da bist! Wir helfen dir dabei, deine Therapie-Praxis optimal zu organisieren. 
          Das Setup dauert nur wenige Minuten.
        </p>
      </div>

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
    <OnboardingDebug v-if="isDev" />
    
    <!-- Color Scheme Demo -->
    <ColorSchemeDemo v-if="showColorDemo" @close="showColorDemo = false" />
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

// Beim Laden der Seite den aktuellen Schritt setzen
onMounted(() => {
  store.loadFromStorage()
  store.goToStep(1)
})
</script>

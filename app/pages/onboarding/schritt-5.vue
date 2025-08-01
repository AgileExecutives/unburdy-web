<template>
  <div class="bg-background min-h-screen">
    <!-- Fortschrittsanzeige -->
    <OnboardingFortschritt />

    <div class="max-w-2xl mx-auto px-6 py-16">
      <div class="text-center mb-12">
        <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/50 mb-8">
          <svg class="h-12 w-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-primary mb-4">
          Geschafft! 🎉
        </h1>
        <p class="text-xl text-secondary leading-relaxed">
          Deine Praxis ist jetzt startklar. Alle wichtigen Einstellungen sind konfiguriert und du kannst sofort loslegen.
        </p>
      </div>

      <!-- Zusammenfassung -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 mb-12">
        <h2 class="text-2xl font-semibold text-primary mb-6 text-center">
          Das hast du eingerichtet:
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex items-start">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-4">
              <svg class="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-primary">Grundeinstellungen</h3>
              <p class="text-secondary text-sm">Stundensatz, Arbeitszeiten und Praxis-Daten</p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mr-4">
              <svg class="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-primary">Erster Klient</h3>
              <p class="text-secondary text-sm">Klientenstamm mit allen wichtigen Daten</p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mr-4">
              <svg class="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-primary">Kontakte</h3>
              <p class="text-secondary text-sm">Eltern und wichtige Ansprechpartner</p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center mr-4">
              <svg class="h-5 w-5 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-primary">Kostenträger</h3>
              <p class="text-secondary text-sm">Versicherungsdaten für die Abrechnung</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Nächste Schritte -->
      <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 mb-12">
        <h2 class="text-xl font-semibold text-primary mb-6">
          So geht's jetzt weiter:
        </h2>
        <div class="space-y-4">
          <div class="flex items-start">
            <span class="flex-shrink-0 h-6 w-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">1</span>
            <div>
              <h3 class="font-medium text-primary">Dashboard erkunden</h3>
              <p class="text-secondary text-sm">Mache dich mit der Benutzeroberfläche vertraut</p>
            </div>
          </div>
          <div class="flex items-start">
            <span class="flex-shrink-0 h-6 w-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">2</span>
            <div>
              <h3 class="font-medium text-primary">Ersten Termin buchen</h3>
              <p class="text-secondary text-sm">Plane deinen ersten Therapietermin</p>
            </div>
          </div>
          <div class="flex items-start">
            <span class="flex-shrink-0 h-6 w-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">3</span>
            <div>
              <h3 class="font-medium text-primary">Weitere Klienten hinzufügen</h3>
              <p class="text-secondary text-sm">Erweitere deinen Klientenstamm</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Hilfe & Support -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 mb-12">
        <h2 class="text-xl font-semibold text-primary mb-4">
          Brauchst du Hilfe?
        </h2>
        <p class="text-secondary mb-6">
          Wir sind da, um dir zu helfen. Nutze unsere Ressourcen oder kontaktiere unser Support-Team.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="#" class="flex items-center p-4 bg-surface rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            <svg class="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 class="font-medium text-primary text-sm">FAQ</h3>
              <p class="text-tertiary text-xs">Häufige Fragen</p>
            </div>
          </a>
          <a href="#" class="flex items-center p-4 bg-surface rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            <svg class="h-6 w-6 text-green-600 dark:text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <div>
              <h3 class="font-medium text-primary text-sm">Handbuch</h3>
              <p class="text-tertiary text-xs">Ausführliche Anleitung</p>
            </div>
          </a>
          <a href="#" class="flex items-center p-4 bg-surface rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            <svg class="h-6 w-6 text-purple-600 dark:text-purple-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <div>
              <h3 class="font-medium text-primary text-sm">Live-Chat</h3>
              <p class="text-tertiary text-xs">Sofortige Hilfe</p>
            </div>
          </a>
        </div>
      </div>

      <!-- Call-to-Action -->
      <div class="text-center">
        <button 
          @click="startDashboard"
          class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <svg class="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Jetzt zum Dashboard
        </button>
        <p class="mt-4 text-sm text-tertiary">
          Deine 30-tägige kostenlose Testphase beginnt jetzt!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Meta-Tags für SEO
useHead({
  title: 'Willkommen bei Unburdy! - Onboarding abgeschlossen',
  meta: [
    { name: 'description', content: 'Onboarding erfolgreich abgeschlossen. Starten Sie jetzt mit Ihrer Therapie-Praxis!' }
  ]
})

// Store verwenden
const store = useOnboardingAutoSave()

// Completion summary aus dem Store
const summary = computed(() => store.completionSummary)

// Beim Laden der Seite
onMounted(() => {
  store.goToStep(5)
  store.completeOnboarding()
})

// Dashboard starten
const startDashboard = async () => {
  // Alle Daten final speichern
  const result = await store.saveData()
  
  if (result.success) {
    // Erfolgsmeldung anzeigen
    alert('🎉 Herzlich willkommen bei Unburdy! Das Dashboard würde jetzt geöffnet werden.')
    
    // In einer echten App würde hier folgendes stehen:
    // await navigateTo('/dashboard')
  } else {
    alert('Fehler beim Speichern der Daten. Bitte versuchen Sie es erneut.')
  }
}
</script>

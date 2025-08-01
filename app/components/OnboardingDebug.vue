<template>
  <div class="fixed bottom-4 right-4 z-50">
    <button 
      @click="showDebug = !showDebug"
      class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200"
    >
      🐛 Debug Store
    </button>
    
    <div 
      v-if="showDebug"
      class="absolute bottom-12 right-0 w-96 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 text-sm"
    >
      <h3 class="font-bold text-gray-900 dark:text-white mb-3">Onboarding Store Debug</h3>
      
      <div class="space-y-3">
        <div>
          <strong class="text-blue-600 dark:text-blue-400">Aktueller Schritt:</strong> {{ store.currentStep }}/5
        </div>
        
        <div>
          <strong class="text-green-600 dark:text-green-400">Fortschritt:</strong> {{ Math.round(store.progress) }}%
        </div>
        
        <div>
          <strong class="text-purple-600 dark:text-purple-400">Abgeschlossen:</strong> 
          <span :class="store.isCompleted ? 'text-green-600' : 'text-orange-600'">
            {{ store.isCompleted ? 'Ja' : 'Nein' }}
          </span>
        </div>
        
        <div>
          <strong class="text-gray-700 dark:text-gray-300">Einstellungen:</strong>
          <div class="ml-2 text-xs text-secondary">
            <div>Beruf: {{ store.settings.profession || 'Nicht gesetzt' }}</div>
            <div>Stundensatz: €{{ store.settings.hourlyRate }}</div>
          </div>
        </div>
        
        <div>
          <strong class="text-gray-700 dark:text-gray-300">Klient:</strong>
          <div class="ml-2 text-xs text-secondary">
            <div>Name: {{ store.client.firstName }} {{ store.client.lastName || 'Nicht gesetzt' }}</div>
          </div>
        </div>
        
        <div>
          <strong class="text-gray-700 dark:text-gray-300">Versicherung:</strong>
          <div class="ml-2 text-xs text-secondary">
            {{ store.insurance.type || 'Nicht gewählt' }}
          </div>
        </div>
        
        <div class="pt-2 border-t border-gray-200 dark:border-gray-600">
          <button 
            @click="store.resetOnboarding()"
            class="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors"
          >
            Store zurücksetzen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const store = useOnboardingStore()
const showDebug = ref(false)
</script>

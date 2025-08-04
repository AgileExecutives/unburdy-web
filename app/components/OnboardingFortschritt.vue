<template>
  <div class="px-6 py-4">
    <div class="max-w-2xl mx-auto">
      <!-- Logo und Titel -->
      <div class="flex items-center justify-between mb-4">
        <UnburdyLogo size="md" />
        <div class="text-right">
          <div class="text-xs text-tertiary">Therapeuten-Software</div>
        </div>
      </div>
      
      <div class="flex items-center justify-between text-sm mb-2">
        <span class="font-medium text-secondary">
          Schritt {{ currentStep }} von 5
        </span>
        <span class="text-secondary">
          {{ stepTitle }}
        </span>
      </div>
      
        <!-- Fortschrittsbalken -->
        <div class="relative">
          <div class="bg-surface-secondary rounded-full h-2">
            <div 
              :class="[
                'h-2 rounded-full transition-all duration-500 ease-out',
                isCompleted ? 'bg-accent' : 'bg-accent'
              ]"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
          
          <!-- Schritt-Punkte -->
          <div class="absolute -top-1 left-0 w-full flex justify-between">
            <div 
              v-for="step in 5" 
              :key="step"
              :class="[
                'w-4 h-4 rounded-full border-2 transition-all duration-300',
                step <= currentStep 
                  ? 'bg-accent border-accent'
                  : 'bg-background border-default'
              ]"
              :style="{ left: `${((step - 1) / 4) * 100}%` }"
            >
              <span 
                v-if="step < currentStep || (step === currentStep && isCompleted)"
                class="absolute inset-0 flex items-center justify-center"
              >
                <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
        </div>      <!-- Schritt-Labels (optional, bei größeren Bildschirmen) -->
      <div class="hidden md:flex justify-between mt-4 text-xs text-secondary">
        <span>Start</span>
        <span>Einstellungen</span>
        <span>Klient</span>
        <span>Kontakte</span>
        <span>Fertig</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const store = useOnboardingStore()

const currentStep = computed(() => store.currentStep)
const progress = computed(() => store.progress)
const stepTitle = computed(() => store.stepTitle(store.currentStep))
const isCompleted = computed(() => store.isCompleted)
</script>

<template>
  <div :class="[
    'rounded-2xl shadow-lg p-8 relative transition-all duration-300 hover:shadow-xl',
    highlight ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 scale-105' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
  ]">
    <div v-if="highlight" class="absolute -top-4 left-1/2 transform -translate-x-1/2">
      <span class="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">Beliebtester Plan</span>
    </div>
    
    <div class="text-center">
      <h2 class="text-2xl font-bold mb-2" :class="highlight ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'">{{ name }}</h2>
      <div class="mb-6">
        <span class="text-4xl font-bold text-gray-900 dark:text-white">€{{ preis }}</span>
        <span class="text-tertiary">/Monat</span>
      </div>
    </div>

    <ul class="mb-8 space-y-3">
      <li v-for="funktion in funktionen" :key="funktion" class="flex items-start">
        <svg class="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        <span class="text-secondary">{{ funktion }}</span>
      </li>
    </ul>

    <div class="text-center">
      <NuxtLink 
        to="/anmelden" 
        :class="[
          'inline-block w-full px-6 py-3 rounded-lg font-semibold transition-colors duration-200',
          highlight 
            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' 
            : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
        ]"
      >
        30 Tage kostenlos testen
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  preis: {
    type: String,
    required: true
  },
  funktionen: {
    type: Array,
    required: true
  },
  highlight: {
    type: Boolean,
    default: false
  }
})
</script>

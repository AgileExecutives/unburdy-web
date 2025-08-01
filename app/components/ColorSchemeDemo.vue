<template>
  <div class="fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-sm">
    <h3 class="font-bold text-gray-900 dark:text-white mb-3">🎨 Farbschema</h3>
    
    <div class="space-y-3">
      <div>
        <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">Grün-Palette:</p>
        <div class="grid grid-cols-6 gap-1">
          <div class="w-6 h-6 rounded bg-green-50 border border-gray-200" title="green-50"></div>
          <div class="w-6 h-6 rounded bg-green-100 border border-gray-200" title="green-100"></div>
          <div class="w-6 h-6 rounded bg-green-200 border border-gray-200" title="green-200"></div>
          <div class="w-6 h-6 rounded bg-green-300 border border-gray-200" title="green-300"></div>
          <div class="w-6 h-6 rounded bg-green-400 border border-gray-200" title="green-400"></div>
          <div class="w-6 h-6 rounded bg-green-500 border border-gray-200" title="green-500"></div>
        </div>
        <div class="grid grid-cols-5 gap-1 mt-1">
          <div class="w-6 h-6 rounded bg-green-600 border border-gray-200" title="green-600"></div>
          <div class="w-6 h-6 rounded bg-green-700 border border-gray-200" title="green-700"></div>
          <div class="w-6 h-6 rounded bg-green-800 border border-gray-200" title="green-800"></div>
          <div class="w-6 h-6 rounded bg-green-900 border border-gray-200" title="green-900"></div>
          <div class="w-6 h-6 rounded bg-green-950 border border-gray-200" title="green-950"></div>
        </div>
      </div>

      <div class="pt-2 border-t border-gray-200 dark:border-gray-600">
        <p class="text-xs text-tertiary mb-2">
          {{ isDark ? '🌙 Dark Mode' : '☀️ Light Mode' }}
        </p>
        <button 
          @click="toggleDarkMode"
          class="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm transition-colors"
        >
          {{ isDark ? 'Light Mode' : 'Dark Mode' }}
        </button>
      </div>

      <div class="pt-2 border-t border-gray-200 dark:border-gray-600">
        <button 
          @click="$emit('close')"
          class="w-full bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs transition-colors"
        >
          Schließen
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close'])

const isDark = ref(false)

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  if (process.client) {
    document.documentElement.classList.toggle('dark', isDark.value)
  }
}

onMounted(() => {
  if (process.client) {
    isDark.value = document.documentElement.classList.contains('dark')
  }
})
</script>

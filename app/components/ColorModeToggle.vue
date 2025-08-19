<template>
  <button
    @click="toggleColorMode"
    class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200 hover:scale-110 transform"
    :title="colorMode.preference === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <!-- Sun icon for light mode - more interesting with rays -->
    <svg 
      v-if="colorMode.preference === 'dark'"
      class="w-6 h-6" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <!-- Sun center -->
      <circle cx="12" cy="12" r="4" stroke-width="1.5"/>
      <!-- Sun rays -->
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke-width="1.5"/>
    </svg>
    
    <!-- Moon icon for dark mode - crescent with stars -->
    <svg 
      v-else
      class="w-6 h-6" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <!-- Moon crescent -->
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke-width="1.5"/>
      <!-- Small stars -->
      <circle cx="16" cy="8" r="0.5" fill="currentColor"/>
      <circle cx="18" cy="6" r="0.5" fill="currentColor"/>
      <circle cx="20" cy="10" r="0.5" fill="currentColor"/>
    </svg>
  </button>
</template>

<script setup>
const colorMode = useColorMode()

const toggleColorMode = () => {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-blue-200/80 to-indigo-300/95 dark:from-gray-900 dark:via-purple-900/50 dark:to-pink-900/40 relative overflow-hidden flex flex-col">
    <!-- Interesting background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <!-- Large gradient orbs -->
      <div class="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/45 to-indigo-500/35 dark:from-purple-600/30 dark:to-pink-600/25 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 -left-48 w-80 h-80 bg-gradient-to-tr from-slate-400/40 to-blue-400/35 dark:from-pink-600/25 dark:to-purple-600/30 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-32 right-1/4 w-72 h-72 bg-gradient-to-tl from-indigo-400/45 to-cyan-400/35 dark:from-indigo-600/25 dark:to-purple-600/25 rounded-full blur-3xl"></div>
      
      <!-- Subtle geometric pattern overlay -->
      <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="onboarding-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1.5" fill="currentColor" class="text-blue-500"/>
              <circle cx="10" cy="10" r="1" fill="currentColor" class="text-purple-400"/>
              <circle cx="50" cy="20" r="1" fill="currentColor" class="text-indigo-400"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#onboarding-pattern)" />
        </svg>
      </div>
    </div>
    
    <main class="relative z-10 flex-1">
      <slot />
    </main>
    
    <!-- Footer bleibt erhalten für rechtliche Links -->
    <Footer />
  </div>
</template>

<script setup>
// Meta-Tags für das Onboarding Layout
useHead({
  titleTemplate: '%s - Unburdy Onboarding'
})
</script>

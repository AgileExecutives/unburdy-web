<template>
  <div class="min-h-screen bg-gradient-unburdy relative overflow-hidden flex flex-col">
    <!-- Unburdy.de-inspired sophisticated background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <!-- Sophisticated mesh gradient overlay -->
      <div class="absolute inset-0 bg-gradient-mesh opacity-30"></div>
      
      <!-- Elegant floating gradient orbs inspired by unburdy.de -->
      <div class="absolute -top-40 -right-32 w-96 h-96 rounded-full blur-3xl animate-pulse opacity-60 bg-gradient-to-br from-indigo-500/20 to-purple-600/15 dark:from-indigo-500/20 dark:to-purple-600/15"></div>
      <div class="absolute top-1/2 -left-48 w-80 h-80 rounded-full blur-3xl animate-pulse opacity-50 bg-gradient-to-tr from-pink-400/15 to-violet-500/20 dark:from-pink-400/15 dark:to-violet-500/20" style="animation-delay: 2s;"></div>
      <div class="absolute -bottom-32 right-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse opacity-60 bg-gradient-to-tl from-cyan-400/20 to-blue-500/15 dark:from-cyan-400/20 dark:to-blue-500/15" style="animation-delay: 4s;"></div>
      <div class="absolute top-1/4 right-1/3 w-64 h-64 rounded-full blur-3xl animate-pulse opacity-40 bg-gradient-to-br from-violet-400/15 to-indigo-500/20 dark:from-violet-400/15 dark:to-indigo-500/20" style="animation-delay: 6s;"></div>
      
      <!-- Refined geometric pattern with reduced opacity -->
      <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="unburdy-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="1.5" fill="currentColor" class="text-indigo-300"/>
              <circle cx="20" cy="20" r="1" fill="currentColor" class="text-purple-300"/>
              <circle cx="80" cy="30" r="1" fill="currentColor" class="text-pink-300"/>
              <circle cx="30" cy="80" r="0.8" fill="currentColor" class="text-violet-300"/>
              <circle cx="70" cy="70" r="0.8" fill="currentColor" class="text-cyan-300"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#unburdy-pattern)" />
        </svg>
      </div>
    </div>
    
    <main class="relative z-10 flex-1">
      <slot />
    </main>
    
    <!-- Footer with glass effect -->
    <div class="relative z-10">
      <Footer />
    </div>
  </div>
</template>

<script setup>
// Meta-Tags für das Onboarding Layout
useHead({
  titleTemplate: '%s - Unburdy Onboarding'
})
</script>

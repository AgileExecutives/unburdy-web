<template>
  <div class="min-h-screen flex flex-col relative bg-gradient-to-br from-gray-50 via-slate-200/70 to-blue-200/90 dark:from-gray-900 dark:via-purple-900/40 dark:to-pink-900/35 overflow-hidden">
    <!-- Enhanced Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Original gradient blob -->
      <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#60a5fa] to-[#8b5cf6] opacity-45 dark:from-[#a855f7] dark:to-[#ec4899] dark:opacity-35 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>
      
      <!-- Additional sophisticated elements -->
      <div class="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-blue-300/50 to-transparent dark:from-purple-700/35 dark:to-transparent rounded-full blur-3xl transform translate-x-1/2"></div>
      <div class="absolute bottom-1/4 left-0 w-80 h-80 bg-gradient-to-r from-slate-300/45 to-transparent dark:from-pink-700/30 dark:to-transparent rounded-full blur-3xl transform -translate-x-1/2"></div>
      <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-indigo-300/35 to-blue-300/35 dark:from-purple-700/25 dark:to-pink-700/25 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
      
      <!-- Subtle dot pattern -->
      <div class="absolute inset-0 opacity-[0.02] dark:opacity-[0.015]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dot-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="currentColor" class="text-blue-600"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-pattern)" />
        </svg>
      </div>
    </div>
    
    <!-- Header component -->
    <Header />
    
    <!-- Main content area -->
    <main class="flex-1">
      <slot />
    </main>
    
    <!-- Footer component -->
    <Footer />
  </div>
</template>

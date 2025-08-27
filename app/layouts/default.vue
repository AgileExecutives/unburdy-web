<template>
  <div class="min-h-screen flex flex-col relative overflow-hidden">
    <!-- Enhanced Background Elements with Fixed Positioning -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <!-- Original gradient blob -->
    <!-- Background Gradient -->
    <div class="fixed inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
      <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
    </div>
      
      <!-- Subtle dot pattern -->
      <div class="fixed inset-0 opacity-[0.02] dark:opacity-[0.015]">
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
    <PageHeader class="relative z-10" />
    
    <!-- Main content area -->
    <main class="flex-1 relative z-10">
      <slot />
    </main>
    
    <!-- Footer component -->
    <Footer class="relative z-10" />
  </div>
</template>

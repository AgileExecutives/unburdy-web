<template>
  <div class="min-h-screen flex flex-col relative">
    <!-- Background Gradient -->
    <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
      <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
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

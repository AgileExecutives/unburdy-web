<template>
  <div class="min-h-screen flex flex-col">
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

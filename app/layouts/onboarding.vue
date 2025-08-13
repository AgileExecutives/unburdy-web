<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-purple-900">
    <main>
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

<template>
  <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
    <div class="mx-auto max-w-7xl px-6 py-8 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <!-- Logo and Company Info -->
        <div class="flex items-center space-x-4">
          <UnburdyLogo size="sm" />
          <div class="text-sm text-gray-600 dark:text-gray-400">
            © {{ currentYear }} Unburdy. Alle Rechte vorbehalten.
          </div>
        </div>

        <!-- Legal Links -->
        <nav class="flex flex-col sm:flex-row space-x-6 text-sm">
          <NuxtLink 
            to="/legal/kontakt" 
            class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            Kontakt
          </NuxtLink>
          <NuxtLink 
            to="/legal/impressum" 
            class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            Impressum
          </NuxtLink>
          <NuxtLink 
            to="/legal/agb" 
            class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            AGB
          </NuxtLink>
          <NuxtLink 
            to="/legal/datenschutz" 
            class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            Datenschutzerklärung
          </NuxtLink>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Get current year for copyright
const currentYear = new Date().getFullYear()
</script>

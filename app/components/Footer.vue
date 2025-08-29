<template>
  <footer class="bg-background border-t border-default">
    <div class="mx-auto max-w-7xl px-6 py-8 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <!-- Logo and Company Info -->
        <div class="flex items-center space-x-4">
          <UnburdyLogo size="sm" />
          <div class="text-sm text-secondary">
            © {{ currentYear }} Unburdy. Alle Rechte vorbehalten.
          </div>
        </div>

        <!-- Legal Links -->
        <nav class="flex flex-col sm:flex-row space-x-6 text-sm">
          <NuxtLink 
            to="/legal/kontakt" 
            class="text-tertiary hover:text-secondary transition-colors duration-200 no-underline"
          >
            Kontakt
          </NuxtLink>
          <NuxtLink 
            to="/legal/impressum" 
            class="text-tertiary hover:text-secondary transition-colors duration-200 no-underline"
          >
            Impressum
          </NuxtLink>
          <NuxtLink 
            to="/legal/agb" 
            class="text-tertiary hover:text-secondary transition-colors duration-200 no-underline"
          >
            AGB
          </NuxtLink>
          <NuxtLink 
            to="/legal/datenschutz" 
            class="text-tertiary hover:text-secondary transition-colors duration-200 no-underline"
          >
            Datenschutzerklärung
          </NuxtLink>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Get current year for copyright - use computed to ensure SSR/client consistency
const currentYear = computed(() => new Date().getFullYear())
</script>

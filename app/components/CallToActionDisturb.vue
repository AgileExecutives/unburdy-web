<template>
      <!-- Full-width CTA Band -->
      <div class="bg-accent py-16">
        <div class="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
            Bereit für den nächsten Schritt?
          </h2>
          <p class="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
             Starte jetzt deine digitale Lerntherapie-Praxis mit Unburdy – 14 Tage kostenlos testen.
         </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <NuxtLink 
              to="/anmelden" 
              class="inline-flex items-center rounded-md bg-white px-8 py-4 text-lg font-semibold text-accent shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors duration-200"
            >
              <Icon name="lucide:rocket" class="w-5 h-5 mr-3" />
              14 Tage kostenlos testen
            </NuxtLink>
            <p class="text-white/80 text-sm">
              Keine Zahlungsverbindung erforderlich
            </p>
          </div>
        </div>
      </div>
</template>

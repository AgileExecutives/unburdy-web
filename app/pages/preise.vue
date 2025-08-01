<template>
  <div class="bg-background min-h-screen">
    <header class="absolute inset-x-0 top-0 z-50">
      <nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div class="flex lg:flex-1">
          <NuxtLink to="/" class="-m-1.5 p-1.5">
            <span class="sr-only">Unburdy</span>
            <UnburdyLogo size="md" />
          </NuxtLink>
        </div>
        <div class="hidden lg:flex lg:gap-x-12">
          <NuxtLink to="/funktionen" class="text-sm font-semibold leading-6 text-gray-900 dark:text-white">Funktionen</NuxtLink>
          <NuxtLink to="/preise" class="text-sm font-semibold leading-6 text-blue-600 dark:text-blue-400">Preise</NuxtLink>
        </div>
        <div class="hidden lg:flex lg:flex-1 lg:justify-end">
          <NuxtLink to="/anmelden" class="text-sm font-semibold leading-6 text-gray-900 dark:text-white">Anmelden <span aria-hidden="true">&rarr;</span></NuxtLink>
        </div>
      </nav>
    </header>

    <div class="relative isolate px-6 pt-32 lg:px-8">
      <div class="mx-auto max-w-5xl py-16">
        <div class="text-center mb-16">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">Wähle deinen Plan</h1>
          <p class="mt-6 text-lg leading-8 text-secondary">Transparent, fair und ohne versteckte Kosten. Alle Pläne mit 30 Tagen kostenlos testen.</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <Preiskarte 
            name="Basis" 
            preis="29" 
            :funktionen="['Klientenverwaltung', 'Terminplanung', 'Einfache Rechnungen', 'Datenschutz DSGVO']" 
          />
          <Preiskarte 
            name="Pro" 
            preis="49" 
            :funktionen="['Alles aus Basis', 'Diagnose-Verwaltung', 'Therapieberichte', 'Statistiken', 'E-Mail Support']" 
            highlight 
          />
          <Preiskarte 
            name="Praxis" 
            preis="89" 
            :funktionen="['Alles aus Pro', 'Mehrere Therapeuten', 'Team-Verwaltung', 'Prioritäts-Support', 'API-Zugang']" 
          />
        </div>

        <div class="mt-16 text-center">
          <p class="text-sm text-tertiary">Alle Preise verstehen sich zzgl. MwSt. Jederzeit kündbar.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Meta-Tags für SEO
useHead({
  title: 'Preise - Unburdy Therapie-Software',
  meta: [
    { name: 'description', content: 'Transparente Preise für Unburdy Therapie-Software. Alle Pläne mit 30 Tagen kostenlos testen.' }
  ]
})
</script>

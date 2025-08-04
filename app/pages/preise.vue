<template>
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
</template>

<script setup>
// Meta-Tags für SEO
useSeoMeta({
  title: 'Faire Preise für Lerntherapeutinen und Lerntherapeuten | Unburdy',
  description: 'Ab 29 €/Monat. Keine versteckten Kosten. DSGVO-konforme Software für Lerntherapie – ideal für Einzelpraxen.',
  ogTitle: 'Faire Preise für Lerntherapeutinen und Lerntherapeuten | Unburdy',
  ogDescription: 'Ab 29 €/Monat. Keine versteckten Kosten. DSGVO-konforme Software für Lerntherapie – ideal für Einzelpraxen.',
  twitterTitle: 'Faire Preise für Lerntherapeutinen und Lerntherapeuten | Unburdy',
  twitterDescription: 'Ab 29 €/Monat. Keine versteckten Kosten. DSGVO-konforme Software für Lerntherapie – ideal für Einzelpraxen.'
})
</script>

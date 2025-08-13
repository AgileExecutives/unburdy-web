<template>
  <div class="relative isolate px-6 pt-32 lg:px-8">
      <div class="mx-auto max-w-5xl py-16">
        <div class="text-center mb-16">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">Wähle deinen Plan</h1>
          <p class="mt-6 text-lg leading-8 text-secondary">Transparent, fair und ohne versteckte Kosten. Alle Pläne mit 30 Tagen kostenlos testen.</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <Preiskarte 
            v-for="plan in plans" 
            :key="plan.slug"
            :name="plan.name" 
            :price="plan.price" 
            :slug="plan.slug"
            :features="plan.features" 
            :highlight="plan.highlight"
          />
        </div>

        <div class="mt-16 text-center">
          <p class="text-sm text-tertiary">Alle Preise verstehen sich zzgl. MwSt. Jederzeit kündbar.</p>
        </div>
      </div>
    </div>
</template>

<script setup>
import { getPlans } from '@/../types/plans'

// Analytics tracking
const { trackPricePageView, getCampaignData } = useAnalytics()

// Get all plans from the centralized configuration
const plans = getPlans(['basis', 'pro', 'praxis'])

// Track pricing page view with campaign data
onMounted(() => {
  const campaign = getCampaignData()
  // Track which plan might be highlighted based on campaign
  const planFocus = campaign?.content || 'pro' // Default to pro plan
  trackPricePageView(planFocus)
})

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

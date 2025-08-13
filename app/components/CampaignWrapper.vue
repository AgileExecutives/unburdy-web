<template>
  <div class="bg-white dark:bg-gray-900">
    <!-- Campaign-specific hero section -->
    <div v-if="campaignData" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <p class="text-sm font-medium">
            {{ getCampaignMessage() }}
          </p>
        </div>
      </div>
    </div>

    <!-- Main content slot -->
    <slot />

    <!-- Campaign-specific CTA -->
    <div v-if="campaignData && showCampaignCTA" class="bg-gray-50 dark:bg-gray-800 py-16">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {{ getCampaignCTATitle() }}
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
          {{ getCampaignCTADescription() }}
        </p>
        <NuxtLink
          to="/lc/anmelden"
          @click="trackCampaignCTA"
          class="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          {{ getCampaignCTAButton() }}
          <svg class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  showCampaignCTA: {
    type: Boolean,
    default: true
  }
})

const { getCampaignData, trackConversion } = useAnalytics()
const campaignData = ref(null)

onMounted(() => {
  campaignData.value = getCampaignData()
})

const getCampaignMessage = () => {
  if (!campaignData.value) return ''
  
  const messages = {
    'summer_sale': '🌞 Sommer-Angebot: 3 Monate kostenlos bei Jahresabonnement!',
    'back_to_school': '📚 Back-to-School: Perfekt für den Schuljahresstart!',
    'black_friday': '🖤 Black Friday: 50% Rabatt auf alle Pläne!',
    'new_year': '🎉 Neujahrs-Angebot: Starten Sie 2025 digital durch!',
    'free_trial': '✨ Kostenlos testen: 30 Tage ohne Risiko!'
  }
  
  return messages[campaignData.value.campaign || ''] || 
         `Willkommen von ${campaignData.value.source || 'unserer Kampagne'}!`
}

const getCampaignCTATitle = () => {
  if (!campaignData.value) return 'Jetzt kostenlos starten'
  
  const titles = {
    'summer_sale': 'Sommer-Angebot sichern!',
    'back_to_school': 'Zum Schulstart digital durchstarten',
    'black_friday': 'Black Friday Deal nicht verpassen!',
    'new_year': 'Ihr digitales 2025 beginnt hier',
    'free_trial': 'Kostenlos testen, risikofrei starten'
  }
  
  return titles[campaignData.value.campaign || ''] || 'Jetzt kostenlos starten'
}

const getCampaignCTADescription = () => {
  if (!campaignData.value) return 'Erstellen Sie in wenigen Minuten Ihren kostenlosen Account.'
  
  const descriptions = {
    'summer_sale': 'Nutzen Sie unser exklusives Sommer-Angebot und sparen Sie bei Ihrem Jahresabo.',
    'back_to_school': 'Perfekt vorbereitet für das neue Schuljahr mit professioneller Therapie-Software.',
    'black_friday': 'Einmaliges Angebot: 50% Rabatt auf alle Pläne. Nur für kurze Zeit!',
    'new_year': 'Starten Sie das neue Jahr mit der besten Therapie-Software für Ihre Praxis.',
    'free_trial': 'Testen Sie alle Funktionen 30 Tage kostenlos. Ohne Risiko, ohne Verpflichtung.'
  }
  
  return descriptions[campaignData.value.campaign || ''] || 
         'Erstellen Sie in wenigen Minuten Ihren kostenlosen Account.'
}

const getCampaignCTAButton = () => {
  if (!campaignData.value) return 'Kostenlos registrieren'
  
  const buttons = {
    'summer_sale': 'Angebot sichern',
    'back_to_school': 'Jetzt starten',
    'black_friday': 'Deal sichern',
    'new_year': 'Kostenlos testen',
    'free_trial': 'Gratis testen'
  }
  
  return buttons[campaignData.value.campaign || ''] || 'Kostenlos registrieren'
}

const trackCampaignCTA = () => {
  trackConversion('campaign_cta_click', 1, {
    campaign: campaignData.value?.campaign,
    source: campaignData.value?.source,
    medium: campaignData.value?.medium
  })
}
</script>

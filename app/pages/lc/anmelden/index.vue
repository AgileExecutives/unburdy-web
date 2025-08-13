<template>
  <div class="min-h-screen">
    <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <UnburdyLogo class="mx-auto h-16 w-auto" />
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-primary">
          Plan auswählen
        </h2>
        <p class="mt-2 text-center text-sm text-secondary">
          Wählen Sie den passenden Plan für Ihre Lerntherapie-Praxis
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
        <!-- Plan Selection -->
        <div class="grid md:grid-cols-3 gap-6 px-4">
          <div 
            v-for="plan in availablePlans" 
            :key="plan.slug"
            @click="selectPlan(plan.slug)"
            class="cursor-pointer transform transition-all duration-200 hover:scale-105"
          >
            <div :class="[
              'rounded-2xl shadow-lg p-6 relative transition-all duration-300 hover:shadow-xl',
              plan.highlight 
                ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500' 
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
            ]">
              <div v-if="plan.highlight" class="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span class="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Empfohlen
                </span>
              </div>
              
              <div class="text-center">
                <h3 class="text-xl font-bold mb-2" :class="plan.highlight ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'">
                  {{ plan.name }}
                </h3>
                <div class="mb-4">
                  <span class="text-3xl font-bold text-gray-900 dark:text-white">€{{ plan.price }}</span>
                  <span class="text-secondary">/Monat</span>
                </div>
              </div>

              <ul class="space-y-2 mb-6">
                <li v-for="feature in plan.features.slice(0, 4)" :key="feature" class="flex items-start text-sm">
                  <svg class="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-secondary">{{ feature }}</span>
                </li>
                <li v-if="plan.features.length > 4" class="text-xs text-tertiary">
                  + {{ plan.features.length - 4 }} weitere Funktionen
                </li>
              </ul>

              <div class="text-center">
                <button 
                  :class="[
                    'w-full px-4 py-2 rounded-lg font-semibold transition-colors duration-200',
                    plan.highlight 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                  ]"
                >
                  {{ plan.actionText || 'Jetzt starten' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Alternative: Already have an account -->
        <div class="mt-8 text-center">
          <p class="text-sm text-secondary">
            Bereits registriert?
            <a :href="config.public.unburdyApp" class="font-medium text-accent hover:text-accent-hover">
              Hier anmelden
            </a>
          </p>
        </div>

        <!-- Help link -->
        <div class="mt-4 text-center">
          <p class="text-sm text-tertiary">
            Fragen zu den Plänen? 
            <NuxtLink to="/legal/kontakt" class="text-accent hover:text-accent-hover">
              Kontaktieren Sie uns
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPlans } from '../../../../types/plans'

// Define page meta
definePageMeta({
  layout: 'default',
  title: 'Account erstellen | Unburdy'
})

// Get configuration
const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

// Get available plans
const availablePlans = getPlans(['basis', 'pro', 'praxis'])

// Get redirect parameter
const redirectTo = computed(() => route.query.redirect as string || '/onboarding/schritt-1')

// Plan selection handler
const selectPlan = (planSlug: string) => {
  // Navigate to the plan-specific registration page with redirect parameter
  router.push({
    path: `/lc/anmelden/${planSlug}`,
    query: {
      redirect: redirectTo.value
    }
  })
}

// Analytics tracking
const { trackPageView, getCampaignData } = useAnalytics()

onMounted(() => {
  trackPageView('plan_selection', {
    redirect_to: redirectTo.value
  })
})

// Auto-redirect to default plan if only one plan or specific preference
const autoRedirectPlan = computed(() => {
  // If there's a preferred plan in campaign data, use that
  const campaign = getCampaignData()
  return campaign?.content || 'pro' // Default to pro plan
})

// SEO Meta
useSeoMeta({
  title: 'Account erstellen - Plan auswählen | Unburdy',
  description: 'Wählen Sie den passenden Plan für Ihre Lerntherapie-Praxis. Basis, Pro oder Praxis - transparent und fair.',
  ogTitle: 'Account erstellen - Plan auswählen | Unburdy',
  ogDescription: 'Wählen Sie den passenden Plan für Ihre Lerntherapie-Praxis. Basis, Pro oder Praxis - transparent und fair.'
})
</script>

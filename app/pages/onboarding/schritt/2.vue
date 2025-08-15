<template>
    <div class="min-h-screen flex flex-col">
        <!-- Progress Bar -->
        <OnboardingProgressBar :current-step="2" />

        <!-- Main Content -->
        <div class="flex-1">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Step Header -->
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                        2
                    </div>
                    <h2 class="text-3xl font-bold text-primary mb-2">Planung {{ (existingData?.step1 ? existingData.step1.practiceName : '') }}</h2>
                    <p class="text-lg text-secondary">
                        Konfiguriere deine wöchentlichen Verfügbarkeiten und Ferienzeiten. 
                    </p>
                </div>

                <!-- Content Card -->
                <div class="bg-surface rounded-lg border border-default p-8 mb-8">
                    <WeeklyAvailabilityEditor /> <!--v-model="formData.step2.availability" / -->
                </div>

                <!-- Navigation -->
                <div class="flex justify-between items-center">
                    <button 
                        @click="goBack"
                        class="inline-flex items-center px-4 py-2 border border-default rounded-md shadow-sm text-sm font-medium text-secondary bg-surface hover:bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors"
                    >
                        <svg class="mr-2 -ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                        Zurück
                    </button>

                    <div class="flex items-center space-x-2">
                        <span class="text-sm text-secondary">2 von 4</span>
                        <div class="flex space-x-1">
                            <div class="w-2 h-2 bg-accent rounded-full"></div>
                            <div class="w-2 h-2 bg-accent rounded-full"></div>
                            <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
                            <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
                        </div>
                    </div>

                    <button 
                        @click="goNext"
                        class="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors"
                    >
                        Weiter
                        <svg class="ml-2 -mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, navigateTo } from '#app'
import { useOnboarding } from '~/composables/useOnboarding'

// Layout
definePageMeta({
    layout: 'onboarding'
})

// Meta-Tags für SEO
useHead({
    title: 'Planung und Kalender - Unburdy Onboarding',
    meta: [
        { name: 'description', content: 'Schritt 2: Termine, Verfügbarkeiten und Kalendereinstellungen konfigurieren.' }
    ]
})

// Composables
const router = useRouter()
const { updateOnboardingData, getOnboardingData, setCurrentStep } = useOnboarding()

// Form data
const formData = ref({
    availability: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
    }
})

// Load existing data if available
const existingData = ref({})

if (existingData.value?.step2) {
    formData.value = { ...existing.step2 }
}
// Update current step
setCurrentStep(2)

onMounted(() => {
    existingData.value = getOnboardingData()
    console.log('Existing Data:', existingData.value)
})  

// Save form data
const saveFormData = () => {
    updateOnboardingData({
        step2: formData.value
    })
}

// Methods
const goBack = async () => {
    saveFormData()
    await navigateTo('/onboarding/schritt/1')
}

const goNext = async () => {
    saveFormData()
    await navigateTo('/onboarding/schritt/3')
}
</script>

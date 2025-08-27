<template>
    <div class="min-h-screen flex flex-col">
        <!-- Progress Bar -->
        <OnboardingProgressBar :current-step="3" />

        <!-- Main Content -->
        <div class="flex-1">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Step Header -->
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                        3
                    </div>
                    <h2 class="text-3xl font-bold text-primary mb-2">Klienten</h2>
                    <p class="text-lg text-secondary">
                        Richte deine Klientenverwaltung ein und füge erste Klienten hinzu
                    </p>
                </div>

                <!-- Content Card -->
                <div class="bg-surface rounded-lg border border-default p-8 mb-8">
                    <div class="text-center py-12">
                        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">Klienten-Formular wird hier eingefügt</h3>
                        <p class="text-gray-500">
                            Hier werden später die Felder für Klientendaten, Kontaktinformationen, 
                            Kostenträger und Elternkontakte eingefügt.
                        </p>
                    </div>
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
                        <span class="text-sm text-secondary">3 von 4</span>
                        <div class="flex space-x-1">
                            <div class="w-2 h-2 bg-accent rounded-full"></div>
                            <div class="w-2 h-2 bg-accent rounded-full"></div>
                            <div class="w-2 h-2 bg-accent rounded-full"></div>
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
import { useRouter, navigateTo } from '#app'
import { useOnboarding } from '~/composables/useOnboarding'

// Layout
definePageMeta({
    layout: 'onboarding'
})

// Meta-Tags für SEO
useHead({
    title: 'Klienten - Unburdy Onboarding',
    meta: [
        { name: 'description', content: 'Schritt 3: Klientenverwaltung einrichten und erste Klienten hinzufügen.' }
    ]
})

// Composables
const router = useRouter()
const { saveStepData, setCurrentStep, getOnboardingData, updateUserData, saveOnboardingToDatabase } = useOnboarding()

onMounted(() => {
    const onboardingData = getOnboardingData()
    if (!onboardingData.userData?.onboardingToken && process.client) {
        const token = localStorage.getItem('onboardingToken')
        if (token) {
            updateUserData({ onboardingToken: token })
        }
    }
})

// Update current step
setCurrentStep(3)

// Methods
const goBack = async () => {
    // Save to database before navigating
    await saveOnboardingToDatabase()
    await navigateTo('/onboarding/schritt/2')
}

const goNext = async () => {
    // Save to database before navigating
    await saveOnboardingToDatabase()
    await navigateTo('/onboarding/schritt/4')
}
</script>

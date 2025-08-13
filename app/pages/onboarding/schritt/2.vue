<template>
    <div class="min-h-screen flex flex-col">
        <!-- Progress Bar -->
        <div class="bg-surface border-b border-default py-4">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between mb-2">
                    <h1 class="text-lg font-semibold text-primary">Praxiseinrichtung</h1>
                    <span class="text-sm text-secondary">Schritt 2 von 4</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-accent h-2 rounded-full transition-all duration-300" style="width: 50%"></div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Step Header -->
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                        2
                    </div>
                    <h2 class="text-3xl font-bold text-primary mb-2">Planung und Kalender</h2>
                    <p class="text-lg text-secondary">
                        Richte deine Termine, Verfügbarkeiten und Kalendereinstellungen ein
                    </p>
                </div>

                <!-- Content Card -->
                <div class="bg-surface rounded-lg border border-default p-8 mb-8">
                    <div class="text-center py-12">
                        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 class="text-xl font-medium text-gray-900 mb-2">Kalender-Formular wird hier eingefügt</h3>
                        <p class="text-gray-500">
                            Hier werden später die Felder für Terminzeiten, Verfügbarkeiten, 
                            Pausenzeiten und Kalender-Synchronisation eingefügt.
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
const { updateOnboardingData, setCurrentStep } = useOnboarding()

// Update current step
setCurrentStep(2)

// Methods
const goBack = async () => {
    await navigateTo('/onboarding/schritt/1')
}

const goNext = async () => {
    // Save any form data here before navigating
    await navigateTo('/onboarding/schritt/3')
}
</script>

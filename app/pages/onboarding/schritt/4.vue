<template>
    <div class="min-h-screen flex flex-col">
        <!-- Progress Bar -->
        <div class="bg-surface border-b border-default py-4">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between mb-2">
                    <h1 class="text-lg font-semibold text-primary">Praxiseinrichtung</h1>
                    <span class="text-sm text-secondary">Schritt 4 von 4</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-accent h-2 rounded-full transition-all duration-300" style="width: 100%"></div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Step Header -->
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                        4
                    </div>
                    <h2 class="text-3xl font-bold text-primary mb-2">Fertigstellen</h2>
                    <p class="text-lg text-secondary">
                        Letzte Einstellungen und Abschluss der Einrichtung
                    </p>
                </div>

                <!-- Content Card -->
                <div class="bg-surface rounded-lg border border-default p-8 mb-8">
                    <div class="text-center py-12">
                        <svg class="mx-auto h-12 w-12 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 class="text-xl font-medium text-gray-900 mb-2">Abschluss-Formular wird hier eingefügt</h3>
                        <p class="text-gray-500">
                            Hier werden später die finalen Einstellungen, eine Zusammenfassung 
                            und der Abschluss des Onboarding-Prozesses eingefügt.
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
                        <span class="text-sm text-secondary">4 von 4</span>
                        <div class="flex space-x-1">
                            <div class="w-2 h-2 bg-accent rounded-full"></div>
                            <div class="w-2 h-2 bg-accent rounded-full"></div>
                            <div class="w-2 h-2 bg-accent rounded-full"></div>
                            <div class="w-2 h-2 bg-accent rounded-full"></div>
                        </div>
                    </div>

                    <button 
                        @click="finish"
                        class="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                        Abschließen
                        <svg class="ml-2 -mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
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
    title: 'Fertigstellen - Unburdy Onboarding',
    meta: [
        { name: 'description', content: 'Schritt 4: Letzte Einstellungen und Abschluss der Einrichtung.' }
    ]
})

// Composables
const router = useRouter()
const config = useRuntimeConfig()
const { updateOnboardingData, setCurrentStep, clearOnboardingData } = useOnboarding()

// Update current step
setCurrentStep(4)

// Methods
const goBack = async () => {
    await navigateTo('/onboarding/schritt/3')
}

const finish = async () => {
    // Save completion status and clear onboarding data
    updateOnboardingData({ completed: true })
    
    // Show success message or redirect to app
    // For now, redirect to external app
    window.location.href = config.public.unburdyApp || 'https://app.unburdy.de'
}
</script>

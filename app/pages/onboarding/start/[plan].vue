<template>
    <div class="min-h-screen flex flex-col">
        <!-- Loading state -->
        <div v-if="isLoading" class="flex-1 flex items-center justify-center">
            <div class="text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                <p class="text-secondary">Lade deine Daten...</p>
            </div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="flex-1 flex items-center justify-center">
            <div class="text-center max-w-md mx-auto px-4">
                <div class="text-red-500 mb-4">
                    <svg class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <h2 class="text-xl font-semibold text-primary mb-2">Fehler beim Laden</h2>
                <p class="text-secondary mb-4">{{ error }}</p>
                <button 
                    @click="retry"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                >
                    Erneut versuchen
                </button>
            </div>
        </div>

        <!-- Success state with registration data -->
        <div v-else class="flex-1">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Welcome Header -->
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-bold text-primary mb-2">
                        Willkommen{{ apiUser?.first_name ? `, ${apiUser.first_name}` : (user?.firstName ? `, ${user.firstName}` : '') }}!
                    </h1>
                    <p class="text-lg text-secondary mb-4">
                        Deine Registrierung für den <span class="font-semibold text-accent">{{ planDisplayName }}</span> Plan war erfolgreich.
                    </p>
                    <p class="text-base text-secondary">
                        Lass uns gemeinsam deine Praxis einrichten, damit du sofort durchstarten kannst.
                    </p>
                </div>

                <!-- Onboarding Steps Overview -->
                <div class="bg-surface rounded-lg border border-default p-6 mb-8">
                    <h2 class="text-xl font-semibold text-primary mb-4 text-center">Was dich erwartet</h2>
                    <p class="text-secondary text-center mb-6">
                        In nur 4 einfachen Schritten richten wir deine Praxis ein:
                    </p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <!-- Step 1: Praxisinformationen -->
                        <div class="text-center">
                            <div class="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                                1
                            </div>
                            <h3 class="font-semibold text-primary mb-2">Praxisinformationen</h3>
                            <p class="text-sm text-secondary">
                                Grundlegende Informationen zu deiner Praxis und deinen Einstellungen
                            </p>
                        </div>

                        <!-- Step 2: Planung und Kalender -->
                        <div class="text-center">
                            <div class="w-12 h-12 bg-surface-secondary border-2 border-accent rounded-full flex items-center justify-center text-accent font-bold text-lg mx-auto mb-3">
                                2
                            </div>
                            <h3 class="font-semibold text-primary mb-2">Planung und Kalender</h3>
                            <p class="text-sm text-secondary">
                                Termine, Verfügbarkeiten und Kalendereinstellungen konfigurieren
                            </p>
                        </div>

                        <!-- Step 3: Klienten -->
                        <div class="text-center">
                            <div class="w-12 h-12 bg-surface-secondary border-2 border-accent rounded-full flex items-center justify-center text-accent font-bold text-lg mx-auto mb-3">
                                3
                            </div>
                            <h3 class="font-semibold text-primary mb-2">Klienten</h3>
                            <p class="text-sm text-secondary">
                                Klientenverwaltung einrichten und erste Klienten hinzufügen
                            </p>
                        </div>

                        <!-- Step 4: Fertigstellen -->
                        <div class="text-center">
                            <div class="w-12 h-12 bg-surface-secondary border-2 border-accent rounded-full flex items-center justify-center text-accent font-bold text-lg mx-auto mb-3">
                                4
                            </div>
                            <h3 class="font-semibold text-primary mb-2">Fertigstellen</h3>
                            <p class="text-sm text-secondary">
                                Letzte Einstellungen und Abschluss der Einrichtung
                            </p>
                        </div>
                    </div>

                    <!-- Time estimate -->
                    <div class="mt-6 p-4 bg-accent/10 rounded-lg text-center">
                        <p class="text-sm text-secondary">
                            <span class="font-semibold text-accent">Geschätzte Dauer:</span> 5-10 Minuten
                        </p>
                    </div>
                </div>
                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        @click="goToOnboarding"
                        class="inline-flex items-center justify-center px-8 py-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors"
                    >
                        Jetzt starten
                        <svg class="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                    
                    <button 
                        @click="goToApp"
                        class="inline-flex items-center justify-center px-8 py-4 border border-default rounded-md shadow-sm text-lg font-medium text-primary bg-surface hover:bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors"
                    >
                        Später einrichten
                    </button>
                </div>

                <!-- Additional Help -->
                <div class="text-center mt-8 pt-8 border-t border-default">
                    <p class="text-secondary text-sm">
                        Fragen oder Probleme? 
                        <a href="/legal/kontakt" class="text-accent hover:text-accent-hover font-medium">
                            Kontaktiere uns
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter, navigateTo } from '#app'
import { useAuth } from '~/composables/useAuth'
import { useOnboarding } from '~/composables/useOnboarding'
import { useRuntimeConfig } from '#app'

// Layout
definePageMeta({
    layout: 'onboarding'
})

// Composables
const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { isAuthenticated, user, token } = useAuth()
const { getOnboardingData, hasOnboardingData } = useOnboarding()

// State
const isLoading = ref(true)
const error = ref(null)

// Get plan from route params
const plan = computed(() => route.params.plan || 'basic')

// Plan name mapping
const planNames = {
    'basic': 'Basic',
    'premium': 'Premium',
    'pro': 'Pro',
    'starter': 'Starter',
    'standard': 'Standard',
    'enterprise': 'Enterprise'
}

const planName = computed(() => planNames[plan.value] || plan.value.charAt(0).toUpperCase() + plan.value.slice(1))

// Access onboarding data
const onboardingData = computed(() => getOnboardingData())
const apiUser = computed(() => onboardingData.value?.stepData?.user)
const apiCustomer = computed(() => onboardingData.value?.stepData?.customer)
const apiOrganization = computed(() => onboardingData.value?.stepData?.organization)
const apiPlan = computed(() => onboardingData.value?.stepData?.plan)

// Authentication tokens
const onboardingToken = computed(() => onboardingData.value?.onboardingToken)

// Plan display name - prefer API plan name, fallback to route-based name
const planDisplayName = computed(() => {
    if (apiPlan.value?.name) {
        return apiPlan.value.name
    }
    return planName.value
})

// Methods
const retry = () => {
    error.value = null
    isLoading.value = true
    checkAuthAndData()
}

const checkAuthAndData = async () => {
    try {
        // Give some time for potential auth state to load
        await new Promise(resolve => setTimeout(resolve, 500))

        // Check if we have any user data (either from auth or onboarding)
        if (!user.value && !hasOnboardingData()) {
            throw new Error('Keine Benutzerdaten gefunden. Bitte registriere dich erneut.')
        }

        isLoading.value = false
    } catch (err) {
        console.error('Error checking auth data:', err)
        error.value = err.message || 'Ein unbekannter Fehler ist aufgetreten'
        isLoading.value = false
    }
}

const goToOnboarding = async () => {
    await navigateTo('/onboarding/schritt/1')
}

const goToApp = () => {
    // Navigate to external app
    window.location.href = config.public.unburdyApp || 'https://app.unburdy.de'
}

// Lifecycle
onMounted(() => {
    checkAuthAndData()
})
</script>

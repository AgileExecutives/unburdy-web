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
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <!-- Welcome Header -->
                <div class="text-center mb-12">
                    <div class="mb-6">
                        <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                    </div>
                    <h1 class="text-4xl font-bold text-gray-900 mb-3">
                        Willkommen{{ apiUser?.first_name ? `, ${apiUser.first_name}` : (user?.firstName ? `, ${user.firstName}` : '') }}!
                    </h1>
                    <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                        Deine Registrierung war erfolgreich. Jetzt richten wir Unburdy gemeinsam für dich ein.
                    </p>
                </div>



                <!-- Onboarding Steps Overview -->
                <div class="bg-surface rounded-2xl shadow-sm border border-gray-100 p-8 mb-12">
                    <div class="text-center mb-8">
                        <h2 class="text-2xl font-semibold text-gray-900 mb-2">
                            Dein Weg zu Unburdy
                        </h2>
                        <p class="text-gray-600 max-w-2xl mx-auto">
                            Wir führen dich in 4 kurzen Schritten durch die Einrichtung. Das dauert nur wenige Minuten.
                        </p>
                    </div>

                    <div class="relative">
                        <!-- Progress line -->
                        <div class="absolute top-8 left-8 right-8 h-0.5 bg-gray-200 hidden lg:block"></div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <!-- Schritt 1 -->
                            <div class="relative text-center">
                                <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full text-xl font-bold mb-4 relative z-10">
                                    1
                                </div>
                                <h3 class="font-semibold text-gray-900 mb-2">Praxisinformationen</h3>
                                <p class="text-sm text-gray-600 leading-relaxed">
                                    Grundlegende Angaben zu deiner Praxis und Fachrichtung
                                </p>
                            </div>

                            <!-- Schritt 2 -->
                            <div class="relative text-center">
                                <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full text-xl font-bold mb-4 relative z-10">
                                    2
                                </div>
                                <h3 class="font-semibold text-gray-900 mb-2">Planung & Kalender</h3>
                                <p class="text-sm text-gray-600 leading-relaxed">
                                    Arbeitszeiten festlegen und Schulferien planen.
                                </p>
                            </div>

                            <!-- Schritt 3 -->
                            <div class="relative text-center">
                                <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full text-xl font-bold mb-4 relative z-10">
                                    3
                                </div>
                                <h3 class="font-semibold text-gray-900 mb-2">Klienten</h3>
                                <p class="text-sm text-gray-600 leading-relaxed">
                                    Einen ersten Klienten hinzufügen, um erste Vorteile von Unburdy kennenzulernen
                                </p>
                            </div>

                            <!-- Schritt 4 -->
                            <div class="relative text-center">
                                <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full text-xl font-bold mb-4 relative z-10">
                                    4
                                </div>
                                <h3 class="font-semibold text-gray-900 mb-2">Fertigstellen</h3>
                                <p class="text-sm text-gray-600 leading-relaxed">
                                    Finale Einstellungen und los geht's mit Unburdy!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="text-center">
                    <button 
                        @click="goToOnboarding"
                        class="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 mb-4"
                    >
                        Onboarding starten
                        <svg class="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
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
                        <!-- Debug Information (only in development) -->
                <div v-if="isDevelopment" class="bg-gray-900 rounded-lg border border-gray-200 p-4 mb-8">
                    <div class="flex flex-wrap gap-2 mb-4">
                        <button @click="clearOnboardingData" class="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
                            Clear Data
                        </button>
                        <button @click="createMockData" class="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
                            Create Mock Data
                        </button>
                        <button @click="goToOnboarding" class="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                            Continue Onboarding
                        </button>
                    </div>
                    <h3 class="text-sm font-medium text-gray-200 mb-2">Debug Information (Development Only)</h3>
                    <details class="text-xs">
                                                <summary class="cursor-pointer text-gray-300 mb-2">Full Registration Data</summary>
                                                <client-only>
                                                    <pre class="bg-gray-100 p-2 rounded text-xs overflow-x-auto text-gray-900">{{ JSON.stringify(getOnboardingData(), null, 2) }}</pre>
                                                </client-only>
                    </details>
                </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter, navigateTo } from '#app'
import { useAuth } from '~/composables/useAuth'
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
const { getOnboardingData, hasOnboardingData, goBack, initOnboarding, clearOnboardingStepsData } = useOnboarding()

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
const apiUser = computed(() => onboardingData.value?.userData)
const apiCustomer = computed(() => {
    // Customer data is now stored in userData if available
    const userData = onboardingData.value?.userData
    return userData?.customerId ? {
        id: userData.customerId,
        email: userData.email
    } : null
})
const apiOrganization = computed(() => {
    // Organization data is now stored in userData if available
    const userData = onboardingData.value?.userData
    return userData?.organizationId ? {
        id: userData.organizationId,
        name: 'Organization ' + userData.organizationId  // We don't have detailed org data in userData
    } : null
})
const apiPlan = computed(() => {
    // Plan data is now stored in userData.planSlug
    const userData = onboardingData.value?.userData
    return userData?.planSlug ? {
        name: userData.planSlug,
        monthly: true  // Default assumption
    } : null
})

// Authentication tokens
const onboardingToken = computed(() => onboardingData.value?.userData?.onboardingToken)

// Plan display name - prefer API plan name, fallback to route-based name
const planDisplayName = computed(() => {
    if (apiPlan.value?.name) {
        return apiPlan.value.name
    }
    return planName.value
})

// Development mode check
const isDevelopment = computed(() => process.env.NODE_ENV === 'development')

// Utility function to format timestamps
const formatDate = (timestamp) => {
    if (!timestamp) return 'Unbekannt'
    
    try {
        // Handle both seconds and milliseconds timestamps
        const date = new Date(timestamp < 10000000000 ? timestamp * 1000 : timestamp)
        return date.toLocaleString('de-DE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch (e) {
        return 'Ungültig'
    }
}

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
            // In development mode, provide a helpful option to create mock data
            if (isDevelopment.value) {
                error.value = 'Keine Benutzerdaten gefunden. Du kannst Mock-Daten erstellen oder dich registrieren.'
            } else {
                throw new Error('Keine Benutzerdaten gefunden. Bitte registriere dich erneut.')
            }
        }

        isLoading.value = false
    } catch (err) {
        console.error('Error checking auth data:', err)
        error.value = err.message || 'Ein unbekannter Fehler ist aufgetreten'
        isLoading.value = false
    }
}

// Mock data functionality for development
const createMockData = () => {
    const mockData = {
        userData: {
            id: 999,
            first_name: 'Test',
            last_name: 'User',
            email: 'test@example.com',
            active: true,
            agb: true,
            marketing_consent: false,
            customerId: 888,
            organizationId: 777,
            planSlug: 'basic',
            onboardingToken: 'mock-token-' + Date.now()
        },
        currentStep: 0,
        steps: []  // Start with empty steps array
    }
    
    initOnboarding(mockData)
    console.log('Mock onboarding data created:', mockData)
    
    // Refresh the page state
    error.value = null
    checkAuthAndData()
}

const clearOnboardingData = () => {

    clearOnboardingStepsData()

    // Refresh the page state
    checkAuthAndData()
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

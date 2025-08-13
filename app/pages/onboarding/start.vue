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
                    <p class="text-lg text-secondary">
                        Deine Registrierung für den <span class="font-semibold text-accent">{{ planDisplayName }}</span> Plan war erfolgreich.
                    </p>
                </div>

                <!-- Registration Summary -->
                <div class="bg-surface rounded-lg border border-default p-6 mb-8">
                    <h2 class="text-xl font-semibold text-primary mb-4">Registrierungsdetails</h2>
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <!-- User Information -->
                        <div>
                            <h3 class="font-medium text-secondary mb-3 flex items-center">
                                <svg class="h-5 w-5 text-accent mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Benutzerdaten
                            </h3>
                            <dl class="space-y-2 text-sm">
                                <div v-if="apiUser?.first_name || apiUser?.last_name" class="flex">
                                    <dt class="font-medium text-tertiary w-20">Name:</dt>
                                    <dd class="text-primary">{{ `${apiUser?.first_name || ''} ${apiUser?.last_name || ''}`.trim() }}</dd>
                                </div>
                                <div v-if="apiUser?.email" class="flex">
                                    <dt class="font-medium text-tertiary w-20">E-Mail:</dt>
                                    <dd class="text-primary">{{ apiUser.email }}</dd>
                                </div>
                                <div v-if="apiUser?.id" class="flex">
                                    <dt class="font-medium text-tertiary w-20">User-ID:</dt>
                                    <dd class="text-primary">{{ apiUser.id }}</dd>
                                </div>
                                <div v-if="apiUser?.role" class="flex">
                                    <dt class="font-medium text-tertiary w-20">Rolle:</dt>
                                    <dd class="text-primary capitalize">{{ apiUser.role }}</dd>
                                </div>
                                <div v-if="apiUser?.active !== undefined" class="flex">
                                    <dt class="font-medium text-tertiary w-20">Status:</dt>
                                    <dd :class="apiUser.active ? 'text-green-600' : 'text-yellow-600'">
                                        {{ apiUser.active ? 'Aktiv' : 'Inaktiv' }}
                                    </dd>
                                </div>
                                <div v-if="apiUser?.agb" class="flex">
                                    <dt class="font-medium text-tertiary w-20">AGB:</dt>
                                    <dd class="text-green-600">Akzeptiert</dd>
                                </div>
                                <div v-if="apiUser?.marketing_consent !== undefined" class="flex">
                                    <dt class="font-medium text-tertiary w-20">Marketing:</dt>
                                    <dd :class="apiUser.marketing_consent ? 'text-green-600' : 'text-gray-500'">
                                        {{ apiUser.marketing_consent ? 'Zugestimmt' : 'Abgelehnt' }}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <!-- Organization & Customer -->
                        <div>
                            <h3 class="font-medium text-secondary mb-3 flex items-center">
                                <svg class="h-5 w-5 text-accent mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Organisation & Kunde
                            </h3>
                            <dl class="space-y-2 text-sm">
                                <div v-if="apiCustomer?.id" class="flex">
                                    <dt class="font-medium text-tertiary w-20">Kunden-ID:</dt>
                                    <dd class="text-primary">{{ apiCustomer.id }}</dd>
                                </div>
                                <div v-if="apiCustomer?.email" class="flex">
                                    <dt class="font-medium text-tertiary w-20">Kunde E-Mail:</dt>
                                    <dd class="text-primary">{{ apiCustomer.email }}</dd>
                                </div>
                                <div v-if="apiOrganization?.name" class="flex">
                                    <dt class="font-medium text-tertiary w-20">Org. Name:</dt>
                                    <dd class="text-primary">{{ apiOrganization.name }}</dd>
                                </div>
                                <div v-if="apiOrganization?.slug" class="flex">
                                    <dt class="font-medium text-tertiary w-20">Org. Slug:</dt>
                                    <dd class="text-primary">{{ apiOrganization.slug }}</dd>
                                </div>
                                <div v-if="apiOrganization?.id" class="flex">
                                    <dt class="font-medium text-tertiary w-20">Org. ID:</dt>
                                    <dd class="text-primary">{{ apiOrganization.id }}</dd>
                                </div>
                            </dl>
                        </div>

                        <!-- Plan & Authentication -->
                        <div>
                            <h3 class="font-medium text-secondary mb-3 flex items-center">
                                <svg class="h-5 w-5 text-accent mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Plan & Zugang
                            </h3>
                            <dl class="space-y-2 text-sm">
                                <div class="flex">
                                    <dt class="font-medium text-tertiary w-20">Plan:</dt>
                                    <dd class="text-primary font-medium">{{ planDisplayName }}</dd>
                                </div>
                                <div v-if="apiPlan?.name" class="flex">
                                    <dt class="font-medium text-tertiary w-20">API Plan:</dt>
                                    <dd class="text-primary">{{ apiPlan.name }}</dd>
                                </div>
                                <div v-if="apiPlan?.monthly !== undefined" class="flex">
                                    <dt class="font-medium text-tertiary w-20">Abrechnung:</dt>
                                    <dd class="text-primary">{{ apiPlan.monthly ? 'Monatlich' : 'Jährlich' }}</dd>
                                </div>
                                <div class="flex">
                                    <dt class="font-medium text-tertiary w-20">Auth Status:</dt>
                                    <dd v-if="token" class="text-green-600">Token verfügbar</dd>
                                    <dd v-else class="text-yellow-600">E-Mail Bestätigung ausstehend</dd>
                                </div>
                                <div v-if="onboardingToken" class="flex">
                                    <dt class="font-medium text-tertiary w-20">Onboarding:</dt>
                                    <dd class="text-green-600">Token verfügbar</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                <!-- Debug Information (only in development) -->
                <div v-if="isDevelopment" class="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-8">
                    <h3 class="text-sm font-medium text-gray-700 mb-2">Debug Information (Development Only)</h3>
                    <details class="text-xs">
                        <summary class="cursor-pointer text-gray-600 mb-2">Full Registration Data</summary>
                        <pre class="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{{ JSON.stringify(getOnboardingData(), null, 2) }}</pre>
                    </details>
                </div>

                <!-- Next Steps -->
                <div class="bg-accent-light/10 border border-accent-light rounded-lg p-6 mb-8">
                    <h2 class="text-xl font-semibold text-primary mb-4 flex items-center">
                        <svg class="h-5 w-5 text-accent mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Nächste Schritte
                    </h2>
                    <div class="space-y-3">
                        <div class="flex items-start">
                            <div class="flex-shrink-0 h-6 w-6 rounded-full bg-accent text-white text-sm flex items-center justify-center mt-0.5">1</div>
                            <div class="ml-3">
                                <p class="text-primary font-medium">E-Mail bestätigen</p>
                                <p class="text-secondary text-sm">Überprüfe dein E-Mail-Postfach für die Bestätigungsmail.</p>
                            </div>
                        </div>
                        <div class="flex items-start">
                            <div class="flex-shrink-0 h-6 w-6 rounded-full bg-accent text-white text-sm flex items-center justify-center mt-0.5">2</div>
                            <div class="ml-3">
                                <p class="text-primary font-medium">Onboarding abschließen</p>
                                <p class="text-secondary text-sm">Vervollständige dein Profil und lerne Unburdy kennen.</p>
                            </div>
                        </div>
                        <div class="flex items-start">
                            <div class="flex-shrink-0 h-6 w-6 rounded-full bg-gray-300 text-gray-600 text-sm flex items-center justify-center mt-0.5">3</div>
                            <div class="ml-3">
                                <p class="text-secondary font-medium">Los geht's!</p>
                                <p class="text-secondary text-sm">Beginne mit Unburdy und entlaste deinen Alltag.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        @click="goToOnboarding"
                        class="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors"
                    >
                        Onboarding starten
                        <svg class="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                    
                    <button 
                        @click="goToApp"
                        class="inline-flex items-center justify-center px-6 py-3 border border-default rounded-md shadow-sm text-base font-medium text-primary bg-surface hover:bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors"
                    >
                        Direkt zur App
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

<template>
    <div class="min-h-screen">
        <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div class="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-primary">
                    Account erstellen
                </h2>
                <p class="sm:mt-2 text-center text-sm text-secondary">
                    Bereits registriert?
                    <a :href="config.public.unburdyApp" class="font-medium text-accent hover:bg-accent-hover">
                        Hier anmelden
                    </a>
                </p>
            </div>

            <div class="sm:mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
                <div class="sm:bg-background-secondary sm:py-8 px-4 shadow sm:rounded-lg sm:px-10 sm:border border-default">
                    <form class="space-y-6" @submit.prevent="handleSubmit">
                        <div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label for="firstName"
                                        class="block text-sm font-medium text-secondary">Vorname</label>
                                    <input id="firstName" name="firstName" type="text" required v-model="form.firstName"
                                        class="mt-1 block w-full px-3 py-1 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200">
                                </div>
                                <div>
                                    <label for="lastName"
                                        class="block text-sm font-medium text-secondary">Nachname</label>
                                    <input id="lastName" name="lastName" type="text" required v-model="form.lastName"
                                        class="mt-1 block w-full px-3 py-1 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200">
                                </div>
                            </div>
                        </div>

                        <div>
                            <label for="email" class="block text-sm font-medium text-secondary">E-Mail-Adresse</label>
                            <input id="email" name="email" type="email" autocomplete="email" required
                                v-model="form.email"
                                class="mt-1 block w-full px-3 py-1 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200">
                        </div>

                        <div>
                            <label for="password" class="block text-sm font-medium text-secondary">Passwort</label>
                            <input id="password" name="password" type="password" autocomplete="new-password" required
                                v-model="form.password"
                                class="mt-1 block w-full px-3 py-1 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200">
                        </div>

                        <div>
                            <label for="confirmPassword" class="block text-sm font-medium text-secondary">Passwort
                                bestätigen</label>
                            <input id="confirmPassword" name="confirmPassword" type="password" required
                                v-model="form.confirmPassword"
                                class="mt-1 block w-full px-3 py-1 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200">
                        </div>

                        <div class="flex items-center">
                            <input id="agb" name="agb" type="checkbox" required v-model="form.agb"
                                class="h-4 w-4 text-accent focus:ring-accent border-default rounded">
                            <label for="agb" class="ml-2 block text-sm text-secondary">
                                Ich akzeptiere die <a href="#" class="text-accent hover:bg-accent-hover">AGB</a> und <a
                                    href="#" class="text-accent hover:bg-accent-hover">Datenschutzerklärung</a>
                            </label>
                        </div>

                        <div class="flex items-start">
                            <input id="marketing" name="marketing" type="checkbox" v-model="form.marketingConsent"
                                class="h-4 w-4 text-accent focus:ring-accent border-default rounded">
                            <label for="marketing" class="ml-2 block text-sm text-secondary">
                                <span class="font-medium">Optional:</span> Ich möchte per E-Mail informiert werden
                                (Produktneuigkeiten, Leurntherapie-Tipps, neue Funktionen).
                                <span class="text-tertiary block mt-1">Du kannst dich jederzeit abmelden.</span>
                            </label>
                        </div>

                        <div>
                            <button type="submit"
                                class="flex w-full justify-center rounded-md border border-transparent bg-accent py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50"
                                :disabled="isLoading">
                                <span v-if="isLoading" class="mr-2">
                                    <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                        </path>
                                    </svg>
                                </span>
                                Kostenlosen Account erstellen
                            </button>
                        </div>
                    </form>

                    <!-- <div class="mt-6">
                        <div class="relative">
                            <div class="absolute inset-0 flex items-center">
                                <div class="w-full border-t border-default"></div>
                            </div>
                            <div class="relative flex justify-center text-sm">
                                <span class="px-2 bg-surface text-tertiary">Oder fortfahren mit</span>
                            </div>
                        </div>

                        <div class="mt-6 grid grid-cols-2 gap-3">
                            <button
                                class="w-full inline-flex justify-center py-2 px-4 border border-default rounded-md shadow-sm bg-surface text-sm font-medium text-secondary hover:bg-surface-secondary">
                                <svg class="h-5 w-5" viewBox="0 0 24 24">
                                    <path fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span class="ml-2">Google</span>
                            </button>

                            <button
                                class="w-full inline-flex justify-center py-2 px-4 border border-default rounded-md shadow-sm bg-surface text-sm font-medium text-secondary hover:bg-surface-secondary">
                                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.966 4.475z" />
                                </svg>
                                <span class="ml-2">Apple</span>
                            </button>
                        </div>
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// Meta-Tags für SEO
useHead({
    title: 'Anmelden - Unburdy Therapie-Software',
    meta: [
        { name: 'description', content: 'Erstellen Sie einen kostenlosen Account für Ihre Therapie-Praxis bei Unburdy.' }
    ]
})

// Get runtime config for external URLs
const config = useRuntimeConfig()
const { trackSignup, getCampaignData } = useAnalytics()
const { getToken: getCsrfToken } = useCsrf()
const { setAuth } = useAuth()
const route = useRoute()

// Reactive state
const isLoading = ref(false)
const form = ref({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agb: false,
    marketingConsent: false,
    organizationId: 0
})

// Remove the old CSRF token management since it's now in the composable

// Form submission handler
const handleSubmit = async () => {
    isLoading.value = true

    try {
        // Validate password confirmation
        if (form.value.password !== form.value.confirmPassword) {
            throw new Error('Passwörter stimmen nicht überein')
        }

        // Get fresh CSRF token
        const csrfTokenValue = await getCsrfToken()

        // Register new user through server API route
        const response = await $fetch('/api/register', {
            method: 'POST',
            body: {
                firstName: form.value.firstName,
                lastName: form.value.lastName,
                email: form.value.email,
                username: form.value.email, // Use email as username
                password: form.value.password,
                agb: form.value.agb,
                marketingConsent: form.value.marketingConsent,
                organizationId: form.value.organizationId,
                csrfToken: csrfTokenValue
            }
        })

        // Handle successful registration
        console.log('Registration successful:', response)

        // Track successful signup with campaign attribution
        trackSignup('email', 1)

        // Set authentication state using useAuth composable
        if (response.token && response.user) {
            setAuth(response.token, response.user)
        } else if (response.token) {
            // Fallback: extract user info from token or use basic info
            setAuth(response.token, {
                firstName: form.value.firstName,
                lastName: form.value.lastName,
                email: form.value.email,
                username: form.value.email
            })
        }

        // Get redirect URL from query params
        const redirectTo = route.query.redirect || '/onboarding/schritt-1'

        // Nach erfolgreicher Registrierung zum gewünschten Ziel weiterleiten
        await navigateTo(redirectTo)

    } catch (error) {
        console.error('Fehler bei der Registrierung:', error)

        // Show user-friendly error messages
        let errorMessage = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
        
        if (error.statusMessage) {
            errorMessage = error.statusMessage
        } else if (error.message) {
            errorMessage = error.message
        }

        // Here you could show a toast notification or set an error state
        alert(errorMessage) // For now, simple alert - replace with proper error handling

    } finally {
        isLoading.value = false
    }
}
</script>

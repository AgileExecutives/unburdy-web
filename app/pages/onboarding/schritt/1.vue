<template>
    <div class="min-h-screen flex flex-col">
        <!-- Progress Bar -->
        <OnboardingProgressBar :current-step="1" />

        <!-- Main Content -->
        <div class="flex-1 relative">
            <div class="max-w-4xl mx-auto px-1 sm:px-6 lg:px-8 py-4">
                <!-- Compact Step Header -->
                <div class="text-center mb-8 mt-6">
                    <p class="text-base text-secondary">
                        Erzähle uns etwas über deine Praxis und deine grundlegenden Einstellungen
                    </p>
                </div>


                <!-- Content Card -->
                <div class="bg-surface rounded-lg border border-default p-2 sm:p-4 lg:p-6 mb-6">

                    <!-- Loading state -->
                    <div v-if="isLoading" class="text-center py-12">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                        <p class="text-secondary">Lade Optionen...</p>
                    </div>

                    <!-- Error state -->
                    <div v-else-if="error" class="text-center py-12">
                        <div class="text-red-500 mb-4">
                            <svg class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <p class="text-red-600 mb-4">{{ error }}</p>
                        <button @click="loadEnumerations"
                            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">
                            Erneut versuchen
                        </button>
                    </div>

                    <!-- Form Content -->
                    <div v-else class="space-y-6">
                        <!-- Responsive Layout -->
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            <!-- Practice Name -->
                            <div class="lg:col-span-2">
                                <label for="practiceName" class="block text-sm font-medium text-gray-700 mb-2">
                                    Praxisname *
                                </label>
                                <input id="practiceName" v-model="formData.practiceName" type="text" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent"
                                    placeholder="Name deiner Praxis" />
                            </div>

                            <!-- Contact Person (User Name) -->
                            <div>
                                <label for="contactPerson" class="block text-sm font-medium text-gray-700 mb-2">
                                    Ansprechpartner
                                </label>
                                <input id="contactPerson" v-model="formData.contactPerson" type="text" readonly
                                    tabindex="-1"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-700 cursor-not-allowed"
                                    placeholder="Wird automatisch aus deinen Benutzerdaten gefüllt" />
                            </div>

                            <!-- Street with House Number -->
                            <div class="lg:col-span-3">
                                <label for="street" class="block text-sm font-medium text-gray-700 mb-2">
                                    Straße und Hausnummer
                                </label>
                                <input id="street" v-model="formData.street" type="text"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent"
                                    placeholder="z.B. Musterstraße 123" />
                            </div>

                            <!-- ZIP Code -->
                            <div class="relative">
                                <label for="postalCode" class="block text-sm font-medium text-gray-700 mb-2">
                                    Postleitzahl *
                                </label>
                                <input id="postalCode" v-model="formData.postalCode"
                                    @input="setNewPostalCode($event.target.value)" type="text" required maxlength="5"
                                    pattern="[0-9]{5}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent"
                                    placeholder="z.B. 10117" />
                            </div>

                            <!-- City -->
                            <div>
                                <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
                                    Stadt *
                                </label>
                                <input id="city" v-model="formData.city" type="text" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent"
                                    placeholder="z.B. Berlin" />
                            </div>

                            <!-- Bundesland -->
                            <div>
                                <label for="bundesland" class="block text-sm font-medium text-gray-700 mb-2">
                                    Bundesland
                                </label>
                                <select id="bundesland" v-model="formData.bundesland"
                                    class="w-full px-3 py-2 h-13 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent"
                                    :disabled="isLoadingBundeslaender">
                                    <option value="">{{ isLoadingBundeslaender ? 'Lade Bundesländer...' : 'Bundesland wählen' }}</option>
                                    <option v-for="(stateName, stateCode) in bundeslaenderData.states" :key="stateCode"
                                        :value="stateCode">
                                        {{ stateName }}
                                    </option>
                                </select>
                            </div>

                            <!-- Focus Areas -->
                            <div class="lg:col-span-3">
                                <TagSelector label="Schwerpunkte" :items="focusAreas"
                                    :selectedItems="formData.selectedFocusAreas"
                                    @update:selectedItems="updateSelectedFocusAreas" selectorId="focus-areas"
                                    colorScheme="blue" />
                            </div>

                            <!-- Service Offers -->
                            <div class="lg:col-span-3">
                                <TagSelector label="Dienstleistungen" :items="serviceOffers"
                                    :selectedItems="formData.selectedServiceOffers"
                                    @update:selectedItems="updateSelectedServiceOffers" selectorId="service-offers"
                                    colorScheme="purple" />
                            </div>

                            <!-- Additional Notes -->
                            <div class="lg:col-span-3">
                                <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
                                    Zusätzliche Informationen
                                </label>
                                <textarea id="notes" v-model="formData.notes" rows="4"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent"
                                    placeholder="Weitere Informationen zu deiner Praxis, besonderen Spezialisierungen oder Arbeitsweise..." />
                            </div>

                            <!-- Regional Info Box -->
                            <RegionalInfoBox :holidays="formData.holidays" :nearby-providers="nearbyProviders"
                                :bundesland-name="getBundeslandName(formData.bundesland)"
                                @open-holidays="openHolidaysModal" @open-providers="openProvidersModal" />
                            
                            <!-- Invoice Download Section -->
                            <div v-if="invoiceDownloadUrl" class="lg:col-span-3">
                                <div class="backdrop-blur-sm bg-green-50/80 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center">
                                            <div class="flex items-center justify-center w-8 h-8 bg-green-500/10 rounded-lg mr-3">
                                                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <span class="text-sm font-medium text-green-800 dark:text-green-200">Musterrechnung erstellt</span>
                                                <p class="text-xs text-green-600 dark:text-green-300">Basierend auf deinen Praxisdaten</p>
                                            </div>
                                        </div>
                                        <button 
                                            @click="downloadInvoice"
                                            :disabled="isDownloadingInvoice"
                                            class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                                        >
                                            <svg v-if="!isDownloadingInvoice" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                            </svg>
                                            <svg v-else class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {{ isDownloadingInvoice ? 'Lädt...' : 'Herunterladen' }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modals (outside form to prevent containment issues) -->
                <HolidaysModal :show="showHolidaysModal" :holidays="formData.holidays"
                    :bundesland="getBundeslandName(formData.bundesland)" @close="closeHolidaysModal" />

                <ProvidersModal :show="showProvidersModal" :providers="nearbyProviders"
                    :bundesland="getBundeslandName(formData.bundesland)" @close="closeProvidersModal" />

                <!-- Navigation -->
                <div class="flex justify-between items-center">
                    <button @click="goBack"
                        class="inline-flex items-center px-4 py-2 border border-default rounded-md shadow-sm text-sm font-medium text-secondary bg-surface hover:bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors">
                        <svg class="mr-2 -ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                        Zurück
                    </button>

                    <div class="flex items-center space-x-2">
                        <span class="text-sm text-secondary">1 von 4</span>
                        <div class="flex space-x-1">
                            <div class="w-2 h-2 bg-accent rounded-full"></div>
                            <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
                            <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
                            <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
                        </div>
                    </div>

                    <button @click="goNext"
                        class="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors">
                        Weiter
                        <svg class="ml-2 -mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Search Overlays -->
            <!-- Search Result Card (shown when user data is found) -->
            <SearchCard :show="showIdentifiedCustomer" color="green" icon="check"
                title="Deine Praxisdaten wurden gefunden!"
                description="Wir haben passende Informationen zu deiner Praxis gefunden. Wenn du sie übernimmst, kannst du noch Korrekturen vornehmen."
                @close="dicardSearchResults" class="absolute inset-x-4 top-20 z-50 max-w-4xl mx-auto">
                <!-- Practice Details -->
                <div
                    class="flex flex-col gap-1 items-center bg-white/40 dark:bg-gray-100/10 p-3 sm:p-4 rounded border text-primary text-xs md:text-base">
                    <span class="break-words">{{ identifiedCustomer.practiceName || 'Nicht verfügbar' }}</span>
                    <span class="break-words">{{ formatAddress(identifiedCustomer) }}</span>
                </div>

                <!-- Focus Areas -->
                <div v-if="identifiedCustomer.selectedFocusAreas && identifiedCustomer.selectedFocusAreas.length"
                    class="bg-white/80 dark:bg-gray-800/80 p-3 sm:p-4 rounded border">
                    <span class="text-xs sm:text-sm font-medium text-gray-700">Fachbereiche:</span>
                    <div class="mt-2 flex flex-wrap gap-1 sm:gap-2">
                        <span v-for="area in identifiedCustomer.selectedFocusAreas" :key="area"
                            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {{ focusAreas[area] || area }}
                        </span>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row gap-3 pt-2">
                    <button @click="acceptCustomerMatch(identifiedCustomer)"
                        class="w-full sm:flex-1 bg-success text-white px-4 py-3 sm:py-2 rounded-md text-sm font-medium hover:bg-success-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Diese Daten übernehmen
                    </button>
                    <button @click="dicardSearchResults"
                        class="w-full sm:flex-1 bg-button-secondary text-button-secondary-text px-4 py-3 sm:py-2 rounded-md text-sm font-medium border border-button-secondary-border hover:bg-button-secondary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">
                        Manuell eingeben
                    </button>
                </div>
            </SearchCard>

            <!-- Manual Search Card (shown when no user data match) -->
            <SearchCard :show="showManualSearchCard" color="yellow" icon="search"
                title="Es geht vielleicht schneller&nbsp;mit&nbsp;PLZ."
                description="Fang mit deiner Postleitzahl an – vielleicht findest du so deine Praxis."
                @close="closeManualSearchCard" class="absolute inset-x-4 top-16 z-50 max-w-4xl mx-auto">
                <!-- Search Input -->
                <div>
                    <input v-model="manualSearchZip" type="text" maxlength="5" pattern="[0-9]{5}"
                        class="w-full px-3 py-2 border border-yellow-300 dark:border-yellow-600 rounded-md shadow-sm placeholder-yellow-500 dark:placeholder-yellow-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="PLZ eingeben (z.B. 10117) - automatische Suche ab 3 Stellen"
                        @input="onSearchPostalCodeChanged" />
                    <!-- Loading indicator -->
                    <div v-if="isManualSearching" class="flex items-center justify-center mt-2">
                        <svg class="animate-spin h-5 w-5 text-yellow-600 mr-2" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        <span class="text-yellow-600 text-sm">Suche läuft...</span>
                    </div>
                </div>

                <!-- Search Results -->
                <div v-if="manualSearchResults.length > 0" class="space-y-3">
                    <div v-for="(customer, index) in manualSearchResults" :key="index"
                        class="flex md:flex-row flex-col md:items-center justify-between p-4 bg-yellow-400/20 dark:bg-yellow-100/20 rounded-lg">
                        <div class="flex-1">
                            <div class="font-medium text-xs md:text-base">
                                {{ customer.name || 'Unbekannt' }}
                            </div>
                            <div class="text-xs md:text-sm ">
                                {{ customer.email || 'Keine E-Mail' }}
                            </div>
                            <div class="text-xs md:text-sm">
                                {{ formatCustomerAddress(customer) }}
                            </div>
                        </div>
                        <div class="flex items-center md:mt-0 mt-2 space-x-3 justify-between md:justify-end">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                :class="customer.score >= CONFIDENCE_THRESHOLDS.HIGH ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                                {{ Math.round(customer.score * 100) }}%
                            </span>
                            <button @click="acceptCustomerMatch(customer)"
                                class="px-3 py-1 text-primary text-sm font-medium rounded bg-warning hover:bg-warning-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warning">
                                Übernehmen
                            </button>
                        </div>
                    </div>
                </div>

                <!-- No Results Message -->
                <div v-else-if="manualSearchZip.length === 5 && manualSearchResults.length === 0 && !isManualSearching"
                    class="text-center py-4 text-yellow-700">
                    <p>Keine Ergebnisse für PLZ {{ manualSearchZip }} gefunden.</p>
                </div>

                <!-- Cancel Button -->
                <div class="mt-4 pt-4 border-yellow-200">
                    <button @click="closeManualSearchCard"
                        class="w-full bg-button-secondary border-button-secondary-border text-button-secondary-text px-4 py-2 rounded-md text-sm font-medium border hover:bg-button-secondary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                        Abbrechen - manuell fortfahren
                    </button>
                </div>
            </SearchCard>

            <!-- High Score Matches Card (shown when multiple good matches found) -->
            <SearchCard :show="showHighScoreMatches" color="green" icon="check"
                title="Mögliche Praxisübereinstimmungen gefunden!"
                description="Basierend auf deinen Daten haben wir folgende mögliche Übereinstimmungen gefunden. Wähle die passende Praxis aus oder fahre manuell fort."
                @close="closeHighScoreMatches" class="absolute inset-x-4 top-16 z-50 max-w-4xl mx-auto">
                <!-- Search Results -->
                <div v-if="highScoreMatches.length > 0" class="space-y-3">
                    <div v-for="(customer, index) in highScoreMatches" :key="index"
                        class="flex md:flex-row flex-col md:items-center justify-between p-4 bg-white/80 dark:bg-gray-900/10 rounded-lg">
                        <div class="flex-1">
                            <div class="font-medium text-xs md:text-base">
                                {{ customer.name || 'Unbekannt' }}
                            </div>
                            <div class="text-xs md:text-sm ">
                                {{ customer.email || 'Keine E-Mail' }}
                            </div>
                            <div class="text-xs md:text-sm">
                                {{ formatCustomerAddress(customer) }}
                            </div>
                        </div>
                        <div class="flex items-center md:mt-0 mt-2 space-x-3 justify-between md:justify-end">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                :class="customer.score >= CONFIDENCE_THRESHOLDS.HIGH ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                                {{ Math.round(customer.score * 100) }}%
                            </span>
                            <button @click="acceptCustomerMatch(customer)"
                                class="px-3 py-1 bg-success text-white text-sm font-medium rounded hover:bg-success-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                Übernehmen
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Cancel Button -->
                <div class="mt-4 pt-4 border-green-200">
                    <button @click="closeManualSearchCard"
                        class="w-full bg-button-secondary border-button-secondary-border text-button-secondary-text px-4 py-2 rounded-md text-sm font-medium border hover:bg-button-secondary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Abbrechen - manuell fortfahren
                    </button>
                </div>
            </SearchCard>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, navigateTo } from '#app'
import { useOnboarding } from '~/composables/useOnboarding'
import { useEnumerations } from '~/composables/useEnumerations'
import TagSelector from '~/components/TagSelector.vue'
import { de } from '@nuxt/ui/runtime/locale/index.js'

// Confidence threshold constants
const CONFIDENCE_THRESHOLDS = {
    VERY_HIGH: 0.98,    // Auto-adopt threshold 0.98 -> show green box with one match
    HIGH: 0.9,          // High confidence badge threshold 0.9 -> show yellow box with two matches
    GOOD: 0.85,         // Good matches threshold 0.85 -> show orange box with three matches
    MEDIUM: 0.65,        // Minimum for high score filtering 0.65 -> show red box with four matches
    LOW: 0.58            // Minimum for medium score filtering 0.58 -> show gray box with five matches
}

// Layout
definePageMeta({
    layout: 'onboarding'
})

// Meta-Tags für SEO
useHead({
    title: 'Praxisinformationen - Unburdy Onboarding',
    meta: [
        { name: 'description', content: 'Schritt 1: Grundlegende Informationen zu deiner Praxis einrichten.' }
    ]
})

// Composables
const router = useRouter()
const { saveStepData, getOnboardingData, setCurrentStep, goBack: goBackStep, saveOnboardingToDatabase } = useOnboarding()
const { focusAreas, serviceOffers, isLoading, error, loadEnumerations } = useEnumerations()

// ===== STATE =====
// Form data
const formData = ref({
    postalCode: '',
    city: '',
    street: '',
    practiceName: '',
    contactPerson: '',
    bundesland: '',
    selectedFocusAreas: [],
    selectedServiceOffers: [],
    notes: '',
    customerSelected: false
})
// UI state
const showAddressFields = ref(false)
const isCheckingCustomers = ref(false)
const showIdentifiedCustomer = ref(false)
const showManualSearchCard = ref(false)
const showHighScoreMatches = ref(false)
const isManualSearching = ref(false)
const bundeslaenderData = ref([])
const isLoadingBundeslaender = ref(false)
const isLoadingHolidays = ref(false)
const providers = ref([])
const isLoadingProviders = ref(false)

const invoiceDownloadUrl = ref('')
const isDownloadingInvoice = ref(false)

// Modal state
const showHolidaysModal = ref(false)
const showProvidersModal = ref(false)

// Search state - single source of truth for customer search results
const searchResults = ref([])
const identifiedCustomer = ref({})
const manualSearchZip = ref('')
const holidays = ref([])

// ===== COMPUTED PROPERTIES =====
// Different customer lists computed from searchResults
const highScoreMatches = computed(() => {
    return searchResults.value.filter(customer =>
        customer.score > CONFIDENCE_THRESHOLDS.MEDIUM && customer.score <= CONFIDENCE_THRESHOLDS.VERY_HIGH
    ).sort((a, b) => b.score - a.score)
})

const veryHighScoreMatches = computed(() => {
    return searchResults.value.filter(customer => customer.score > CONFIDENCE_THRESHOLDS.VERY_HIGH)
})

const manualSearchResults = computed(() => {
    return searchResults.value.filter(customer =>
        customer.searchType === 'manual' || customer.source === 'manual'
    )
})

// Filter providers by proximity to client's ZIP code
const nearbyProviders = computed(() => {
    if (!formData.value.providers || !formData.value.postalCode) {
        return formData.value.providers || []
    }

    const clientZip = formData.value.postalCode
    // Calculate distance for each provider and sort by proximity
    const providersWithDistance = formData.value.providers.map(provider => {
        // New format: ZIP is directly available in provider.zip
        const providerZip = provider.zip
        const distance = calculateZipDistance(clientZip, providerZip)
        return { ...provider, distance }
    }).filter(provider => provider.zip) // Only include providers with valid ZIP codes

    // Sort by distance (closest first) and return top 9
    return providersWithDistance
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 9)
})

// ===== UTILITY FUNCTIONS =====
const calculateZipDistance = (zip1, zip2) => {
    if (!zip1 || !zip2) return Infinity

    const clientZip = zip1.toString()
    const providerZip = zip2.toString()

    // Check for prefix matches and prioritize them
    if (providerZip.startsWith(clientZip)) {
        return 0.1 // Exact match gets highest priority
    }

    // Check for progressively shorter prefix matches
    for (let i = clientZip.length - 1; i >= 2; i--) {
        const prefix = clientZip.substring(0, i)
        if (providerZip.startsWith(prefix)) {
            return i // Longer prefix = lower distance value = higher priority
        }
    }

    // If no prefix match, fall back to numerical difference
    const num1 = parseInt(clientZip)
    const num2 = parseInt(providerZip)
    const diff = Math.abs(num1 - num2)

    // Add large offset to ensure prefix matches always come first
    return 1000 + diff
}

const calculateBundeslandFromZip = (zipCode) => {
    if (!zipCode || zipCode.length !== 5 || !bundeslaenderData.value.postal_codes) {
        return null
    }

    const zipNum = parseInt(zipCode)

    // Find matching postal code range
    const matchingRange = bundeslaenderData.value.postal_codes.find(range => {
        const fromZip = parseInt(range.from)
        const toZip = parseInt(range.to)
        return zipNum >= fromZip && zipNum <= toZip
    })

    if (matchingRange && matchingRange.state) {
        // Return the state code directly (this is what the dropdown expects as value)
        return matchingRange.state
    }

    return null
}

const parseAddress = (address) => {
    if (!address || typeof address !== 'string') {
        return { street: '', city: '', postalCode: '' }
    }

    // Common German address patterns
    const addressParts = address.split(/[,\n]/).map(part => part.trim())

    if (addressParts.length >= 2) {
        const street = addressParts[0]
        const cityLine = addressParts[1]

        // Extract postal code and city from "10115 Berlin"
        const cityMatch = cityLine.match(/^(\d{5})\s+(.+)$/)
        if (cityMatch) {
            return {
                street: street,
                postalCode: cityMatch[1],
                city: cityMatch[2]
            }
        }
    }

    // Single line address: try to extract postal code pattern
    const singleLineMatch = address.match(/^(.+?)\s+(\d{5})\s+(.+)$/)
    if (singleLineMatch) {
        return {
            street: singleLineMatch[1],
            postalCode: singleLineMatch[2],
            city: singleLineMatch[3]
        }
    }

    // Fallback: return original as street
    return { street: address, city: '', postalCode: '' }
}

const formatAddress = (data) => {
    const parts = []
    if (data.street) parts.push(data.street)
    if (data.postalCode && data.city) {
        parts.push(`${data.postalCode} ${data.city}`)
    } else if (data.city) {
        parts.push(data.city)
    }
    return parts.join(', ') || 'Nicht verfügbar'
}

const formatCustomerAddress = (customer) => {
    if (customer.address) {
        return customer.address
    }

    const parts = []
    if (customer.street) parts.push(customer.street)
    if (customer.postal_code && customer.city) {
        parts.push(`${customer.postal_code} ${customer.city}`)
    } else if (customer.city) {
        parts.push(customer.city)
    } else if (customer.postal_code) {
        parts.push(customer.postal_code)
    }

    return parts.join(', ') || 'Adresse nicht verfügbar'
}

// ===== FORM FUNCTIONS =====
const updateSelectedFocusAreas = (newSelected) => {
    formData.value.selectedFocusAreas = newSelected
    saveFormData()
}

const updateSelectedServiceOffers = (newSelected) => {
    formData.value.selectedServiceOffers = newSelected
    saveFormData()
}

const setNewPostalCode = (value) => {
    formData.value.postalCode = value

    // Auto-calculate Bundesland when ZIP code is complete
    if (value.length === 5) {
        const calculatedBundesland = calculateBundeslandFromZip(value)
        if (calculatedBundesland) {
            formData.value.bundesland = calculatedBundesland
        }
    } else {
        // Clear Bundesland if ZIP is incomplete
        formData.value.bundesland = ''
    }
}

const saveFormData = () => {
    saveStepData(1, formData.value)
}

// ===== CUSTOMER DATA FUNCTIONS =====
const adoptCustomerData = (customer, isAutoFill = false) => {
    // Pre-fill form with customer data
    if (customer.name) {
        formData.value.practiceName = customer.name
    }

    // Parse and set address information
    if (customer.address) {
        const addressParts = parseAddress(customer.address)

        if (addressParts.street) {
            formData.value.street = addressParts.street
            showAddressFields.value = true
        }
        if (addressParts.city && !formData.value.city) {
            formData.value.city = addressParts.city
        }
        if (addressParts.postalCode && !formData.value.postalCode) {
            setNewPostalCode(addressParts.postalCode)
        }
    } else {
        // Individual address fields
        if (customer.street) {
            formData.value.street = customer.street
            showAddressFields.value = true
        }
        if (customer.city && !formData.value.city) {
            formData.value.city = customer.city
        }
        if (customer.postal_code && !formData.value.postalCode) {
            setNewPostalCode(customer.postal_code)
        }
    }

    const emptyAndRefill = (dest, source) => {
        dest.push(...source)
    }

    // Set focus areas if available
    if (customer.focus && (customer.focus.length > 0)) {
        emptyAndRefill(formData.value.selectedFocusAreas, customer.focus)
    }

    // Set service offers if available
    if (customer.offers && (customer.offers.length > 0)) {
        emptyAndRefill(formData.value.selectedServiceOffers, customer.offers)
    }

    // Set additional notes if available
    if (customer.notes) {
        formData.value.notes = customer.notes
    }

    // Save the updated data
    saveFormData()

    // Set focus to first field after a short delay to ensure DOM is updated
    nextTick(() => {
        const practiceNameField = document.getElementById('practiceName')
        if (practiceNameField) {
            practiceNameField.focus()
        }
    })
}

const fillFormWithUserData = (userData) => {
    if (userData.first_name || userData.last_name) {
        formData.value.contactPerson = `${userData.first_name || ''} ${userData.last_name || ''}`.trim()
    }
    if (userData.postal_code) {
        formData.value.postalCode = userData.postal_code
    }
    if (userData.city) {
        formData.value.city = userData.city
    }
    if (userData.street) {
        formData.value.street = userData.street
        showAddressFields.value = true
    }
}

const parseCustomerData = (customer) => {
    const parsed = {
        practiceName: customer.name || '',
        // Don't include contactPerson here - it should remain as user's first_name + last_name
        selectedFocusAreas: customer.focus_areas || customer.selectedFocusAreas || [],
        selectedServiceOffers: customer.service_offers || customer.selectedServiceOffers || [],
        notes: customer.notes || ''
    }

    // Parse address
    if (customer.address) {
        const addressParts = parseAddress(customer.address)
        parsed.street = addressParts.street
        parsed.city = addressParts.city
        parsed.postalCode = addressParts.postalCode
    } else {
        parsed.street = customer.street || ''
        parsed.city = customer.city || ''
        parsed.postalCode = customer.postal_code || customer.postalCode || ''
    }

    return parsed
}

// ===== SEARCH FUNCTIONS =====
const performCustomerSearch = async (searchParams) => {
    try {
        const queryParams = new URLSearchParams(searchParams)
        const response = await $fetch(`/api/fuzzy/potential-customers?${queryParams.toString()}`)

        if (response?.results?.length > 0) {
            // Add search metadata to each result
            const results = response.results.map((item) => ({
                ...item.customer,
                score: item.score,
                searchType: searchParams.searchType || 'auto',
                source: searchParams.source || 'api'
            }))

            // Update search results
            searchResults.value = results
            return results
        }

        return []
    } catch (error) {
        console.error('Error performing customer search:', error)
        return []
    }
}

const checkInitialUserDataMatch = async () => {
    // Skip search flow if customer has already been selected
    if (formData.value.customerSelected) {
        console.log('Customer already selected, skipping search flow')
        return
    }

    // Also skip if we have substantial customer data (company name and contact person)
    if (formData.value.practiceName && formData.value.contactPerson) {
        console.log('Customer data already exists, skipping search flow')
        return
    }

    const existingData = getOnboardingData()
    const userData = existingData?.user || {}

    // If we have user data, check if it matches potential customers from catalog
    if (userData.email || (userData.first_name && userData.last_name)) {
        const searchParams = {
            zip: userData.postal_code || '',
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            email: userData.email || '',
            searchType: 'initial',
            source: 'user_data'
        }

        searchResults.value = await performCustomerSearch(searchParams)

        if (searchResults.value.length > 0) {
            handleSearchResults(searchResults.value, userData)
        } else {
            // No API results - show manual search card and populate form with user data
            showManualSearchCard.value = true
            fillFormWithUserData(userData)
        }
    }
}

const handleSearchResults = (results, userData) => {
    // Filter customers with high scores (>MEDIUM)
    const highScoreCustomers = results.filter(customer => customer.score > CONFIDENCE_THRESHOLDS.MEDIUM)

    if (highScoreCustomers.length > 0) {
        // Find very high matches (>VERY_HIGH) for automatic adoption
        const veryHighScoreCustomers = highScoreCustomers.filter(customer => customer.score > CONFIDENCE_THRESHOLDS.VERY_HIGH)

        if (veryHighScoreCustomers.length === 1) {
            // Single very high match - show semantic flow immediately
            showIdentifiedCustomerWithData(veryHighScoreCustomers[0])
        } else if (highScoreCustomers.length === 1 && highScoreCustomers[0].score > CONFIDENCE_THRESHOLDS.HIGH) {
            // Single high match - show semantic flow
            showIdentifiedCustomerWithData(highScoreCustomers[0])
        } else if (highScoreCustomers.length > 1 && highScoreCustomers.some(customer => customer.score > CONFIDENCE_THRESHOLDS.HIGH)) {
            // Multiple matches with at least one high score - show selection card
            showHighScoreMatches.value = true
            // Also populate basic form with user data
            fillFormWithUserData(userData)
        } else {
            // Medium score matches (between MEDIUM and HIGH) - show manual search and populate ZIP
            if (highScoreCustomers[0].postal_code) {
                formData.value.postalCode = highScoreCustomers[0].postal_code
            }
            showManualSearchCard.value = true
            fillFormWithUserData(userData)
        }
    } else {
        // No high score match - show manual search card and populate form with user data
        showManualSearchCard.value = true
        fillFormWithUserData(userData)
    }
}

const performManualSearch = async () => {
    // Search when there are at least 3 digits
    if (manualSearchZip.value.length < 3) return

    try {
        isManualSearching.value = true

        // Get user data for enhanced search
        const onboardingData = getOnboardingData()
        const userData = onboardingData?.user || {}

        const searchParams = {
            zip: manualSearchZip.value,
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            email: userData.email || '',
            searchType: 'manual',
            source: 'manual_zip'
        }

        await performCustomerSearch(searchParams)
    } finally {
        isManualSearching.value = false
    }
}

// ===== EVENT HANDLERS =====
const showIdentifiedCustomerWithData = (customerData) => {
    identifiedCustomer.value = {
        ...customerData,
        ...parseCustomerData(customerData)
    }
    showIdentifiedCustomer.value = true
}

const acceptCustomerMatch = (customer = null) => {
    if (!customer) {
        console.error('No customer data provided to acceptCustomerMatch')
        return
    }

    // Manual/search result case - need to parse and adopt customer data
    adoptCustomerData(customer)

    // Mark that a customer has been selected
    formData.value.customerSelected = true

    if (showIdentifiedCustomer.value) {
        closeIdentifiedCustomer()
    } else if (showManualSearchCard.value) {
        closeManualSearchCard()
    } else if (showHighScoreMatches.value) {
        closeHighScoreMatches()
    }

    saveFormData()
}

const dicardSearchResults = () => {
    // Fill form with user data only
    const existingData = getOnboardingData()
    const userData = existingData?.userData || {}
    fillFormWithUserData(userData)
    showIdentifiedCustomer.value = false
}

const onSearchPostalCodeChanged = (event) => {
    // Only allow digits and limit to 5 characters
    const value = event.target.value.replace(/[^0-9]/g, '').slice(0, 5)
    manualSearchZip.value = value

    // Clear results if ZIP changes
    if (searchResults.value.length > 0) {
        searchResults.value = []
    }

    // Automatically search when there are at least 3 digits
    if (value.length >= 3) {
        performManualSearch()
    }
}

watch(() => formData.value.bundesland, async (newBundesland) => {
    if (newBundesland && !isLoadingHolidays.value && !isLoadingBundeslaender.value && !isLoadingProviders.value) {
        // Ensure the bundesland is in the correct format

        const holidaysLand = holidays.value.find(holiday => holiday.state === newBundesland)
        formData.value.holidays = {
            state: newBundesland,
            school: holidaysLand ? holidaysLand.school_holidays : [],
            public: holidaysLand ? holidaysLand.public_holidays : [],
        }

        // Load providers for the selected Bundesland

        const providersLand = providers.value.filter(provider => provider.state === newBundesland)

        formData.value.providers = [].concat(providersLand)
        const closestProvider = nearbyProviders.value[0] || undefined

        // offer to take a look at a generated invoice
        // From your frontend
        const { getToken } = useAuth()
        const userToken = getToken()    
        const response = await $fetch('/api/invoice', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${userToken}`
            },
            body: {
                client: { /* client data */ },
                invoice: { /* invoice data */ },
                organization: {
                    "name": formData.value.practiceName,
                    "street": formData.value.street,
                    "city": formData.value.city,
                    "zip": formData.value.zip,
                    "email": formData.value.email,
                    "phone": formData.value.phone,
                    "contact_person": formData.value.contactPerson
                },
                provider: closestProvider ? { 
                    "city": closestProvider.city,
                    "contact_person": closestProvider.department,
                    "provider_name": closestProvider.organization,
                    "state": closestProvider.state,
                    "street": closestProvider.street,
                    "zip": closestProvider.zip
                } : { /* provider data */ },
                sessions: [ /* session data */],
                therapy: { /* therapy data */ }
            }
        })
        if (response && response.data.download_url) {
            invoiceDownloadUrl.value = response.data.download_url
            formData.value.invoice_url = response.data.download_url 
        } else {
            console.warn('No invoice URL returned from API')
        }
    }
})

// ===== DOWNLOAD FUNCTIONS =====
const downloadInvoice = async () => {
    if (!invoiceDownloadUrl.value) {
        console.error('No invoice download URL available')
        return
    }

    try {
        isDownloadingInvoice.value = true
        
        // Get the bearer token
        const { getToken } = useAuth()
        const userToken = getToken()
        
        if (!userToken) {
            console.error('No authentication token available')
            throw new Error('Authentifizierung erforderlich')
        }

        // Fetch the file with bearer token
        const apiBase = useRuntimeConfig().public.apiBaseUrl
        
        // Build full URL - check if invoiceDownloadUrl is already a full URL
        const fullUrl = invoiceDownloadUrl.value.startsWith('http') 
            ? invoiceDownloadUrl.value 
            : `${apiBase}${invoiceDownloadUrl.value}`
            
        
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Accept': 'application/pdf'
            }
        })

        if (!response.ok) {
            throw new Error(`Download fehlgeschlagen: ${response.status} ${response.statusText}`)
        }

        // Get the blob data
        const blob = await response.blob()
        
        // Create download link
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        
        // Extract filename from URL or use default
        // Use the fullUrl we constructed earlier or extract from the relative path
        let filename = 'rechnung.pdf'
        try {
            if (fullUrl.startsWith('http')) {
                const urlObj = new URL(fullUrl)
                filename = urlObj.pathname.split('/').pop() || 'rechnung.pdf'
            } else {
                // For relative URLs, just split by slash
                filename = invoiceDownloadUrl.value.split('/').pop() || 'rechnung.pdf'
            }
        } catch (error) {
            console.warn('Could not extract filename from URL, using default:', error)
            filename = 'rechnung.pdf'
        }
        
        link.download = filename
        
        // Trigger download
        document.body.appendChild(link)
        link.click()
        
        // Cleanup
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
    } catch (error) {
        console.error('Error downloading invoice:', error)
        
        // Show user-friendly error message
        alert(`Fehler beim Herunterladen der Rechnung: ${error.message}`)
        
    } finally {
        isDownloadingInvoice.value = false
    }
}

// ===== MODAL FUNCTIONS =====
const openHolidaysModal = () => {
    showHolidaysModal.value = true
}

const closeHolidaysModal = () => {
    showHolidaysModal.value = false
}

const openProvidersModal = () => {
    showProvidersModal.value = true
}

const closeProvidersModal = () => {
    showProvidersModal.value = false
}

// ===== HELPER FUNCTIONS =====
const getBundeslandName = (stateCode) => {
    if (!stateCode || !bundeslaenderData.value.states) {
        return ''
    }
    return bundeslaenderData.value.states[stateCode] || ''
}

// ===== UI FUNCTIONS =====
const closeManualSearchCard = () => {
    showManualSearchCard.value = false
    manualSearchZip.value = ''
    searchResults.value = []
}

const closeHighScoreMatches = () => {
    showHighScoreMatches.value = false
}

const closeIdentifiedCustomer = () => {
    showIdentifiedCustomer.value = false
    identifiedCustomer.value = null
}

// ===== NAVIGATION FUNCTIONS =====
const goBack = async () => {
    saveFormData() // Save data before navigating
    await goBackStep() // Use the composable's goBack function
    router.push('/onboarding/start')
}

const goNext = async () => {
    try {
        // Save data locally first
        saveFormData()

        // Save to database using the new streamlined method
        const response = await saveOnboardingToDatabase()
        
        if (response.success) {
            console.log('Step 1 data saved successfully:', response)
        } else {
            console.warn('Database save response indicates failure:', response)
        }

    } catch (error) {
        console.error('Failed to save step 1 data to database:', error)
        // Don't block navigation on API failure
    }

    // Navigate to next step regardless of API call result
    await navigateTo('/onboarding/schritt/2')
}

// ===== DATA LOADING FUNCTIONS =====
const loadBundeslaender = async () => {
    try {
        isLoadingBundeslaender.value = true
        const response = await $fetch('/api/static/bundeslaender')
        bundeslaenderData.value = response
    } catch (error) {
        console.error('Failed to load bundeslaender data:', error)
    } finally {
        isLoadingBundeslaender.value = false
    }
}

const loadHolidays = async () => {
    try {
        isLoadingHolidays.value = true
        const response = await $fetch('/api/static/ferien-feiertage')
        holidays.value = response
    } catch (error) {
        console.error('Failed to load holidays data:', error)
    } finally {
        isLoadingHolidays.value = false
    }
}

const loadProviders = async () => {
    try {
        isLoadingProviders.value = true
        const response = await $fetch('/api/static/jugendaemter')
        providers.value = response
    } catch (error) {
        console.error('Failed to load providers data:', error)
    } finally {
        isLoadingProviders.value = false
    }
}

const initializeFormData = () => {
    const existingData = getOnboardingData()

    // Always set contactPerson from user data (read-only field)
    if (existingData?.user) {
        const userData = existingData.user
        const firstName = userData.first_name || ''
        const lastName = userData.last_name || ''
        formData.value.contactPerson = `${firstName} ${lastName}`.trim() || 'Nicht verfügbar'
    }

    // Load existing step 1 data if available and customerSelected is true
    const existingStep1 = Array.isArray(existingData?.steps)
        ? existingData.steps.find(step => step.stepNumber === 1)
        : undefined
    if (
        existingStep1 &&
        existingStep1.customerSelected
    ) {
        const contactPerson = formData.value.contactPerson
        Object.assign(formData.value, existingStep1)
        formData.value.customerSelected = true
        formData.value.contactPerson = contactPerson
    } if (existingStep1 &&
        existingStep1.invoice_url) {
        formData.value.invoice_url = existingStep1.invoice_url
        invoiceDownloadUrl.value = existingStep1.invoice_url
    }

}

// ===== INITIALIZATION =====
// Update current step
setCurrentStep(1)

// Load enumerations on mount
onMounted(async () => {
    try {
        await loadEnumerations()
        await loadBundeslaender()
        loadHolidays()
        loadProviders()

        // Initialize form data
        initializeFormData()

        // Get existing data for search logic
        const existingData = getOnboardingData()

        // Check for initial user data match
        const existingStep1 = Array.isArray(existingData?.steps)
            ? existingData.steps.find(step => step.stepNumber === 1)
            : undefined
        if (!existingStep1?.customerSelected) {
            await checkInitialUserDataMatch()
        } else {
            // Save current contactPerson (from user data) before merging
            const contactPerson = formData.value.contactPerson
            formData.value = { ...existingStep1 }
            // Restore contactPerson from user data (read-only field)
            formData.value.contactPerson = contactPerson
        }
    } catch (err) {
        console.error('Failed to load enumerations or check user data:', err)
    }
})
</script>

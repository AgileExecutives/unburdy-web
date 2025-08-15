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
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <p class="text-red-600 mb-4">{{ error }}</p>
                        <button 
                            @click="loadEnumerations"
                            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                        >
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
                                <input
                                    id="practiceName"
                                    v-model="formData.practiceName"
                                    type="text"
                                    required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent"
                                    placeholder="Name deiner Praxis"
                                />
                            </div>

                            <!-- Contact Person (User Name) -->
                            <div>
                                <label for="contactPerson" class="block text-sm font-medium text-gray-700 mb-2">
                                    Ansprechpartner
                                </label>
                                <input
                                    id="contactPerson"
                                    v-model="formData.contactPerson"
                                    type="text"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent"
                                    placeholder="Dein Name oder der des Ansprechpartners"
                                />
                            </div>

                            <!-- Street with House Number -->
                            <div class="lg:col-span-3">
                                <label for="street" class="block text-sm font-medium text-gray-700 mb-2">
                                    Straße und Hausnummer
                                </label>
                                <input
                                    id="street"
                                    v-model="formData.street"
                                    type="text"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent"
                                    placeholder="z.B. Musterstraße 123"
                                />
                            </div>

                            <!-- ZIP Code -->
                            <div class="relative">
                                <label for="postalCode" class="block text-sm font-medium text-gray-700 mb-2">
                                    Postleitzahl *
                                </label>
                                <input
                                    id="postalCode"
                                    v-model="formData.postalCode"
                                    type="text"
                                    required
                                    maxlength="5"
                                    pattern="[0-9]{5}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent"
                                    placeholder="z.B. 10117"
                                />
                            </div>

                            <!-- City -->
                            <div>
                                <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
                                    Stadt *
                                </label>
                                <input
                                    id="city"
                                    v-model="formData.city"
                                    type="text"
                                    required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent"
                                    placeholder="z.B. Berlin"
                                />
                            </div>

                            <!-- Bundesland -->
                            <div>
                                <label for="bundesland" class="block text-sm font-medium text-gray-700 mb-2">
                                    Bundesland
                                </label>
                                <select
                                    id="bundesland"
                                    v-model="formData.bundesland"
                                    class="w-full px-3 py-2 h-13 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent"
                                    :disabled="isLoadingBundeslaender"
                                >
                                    <option value="">{{ isLoadingBundeslaender ? 'Lade Bundesländer...' : 'Bundesland wählen' }}</option>
                                    <option 
                                        v-for="(stateName, stateCode) in bundeslaenderData.states" 
                                        :key="stateCode"
                                        :value="convertStateNameToValue(stateName)"
                                    >
                                        {{ stateName }}
                                    </option>
                                </select>
                            </div>

                            <!-- Focus Areas -->
                            <div class="lg:col-span-3">
                                <TagSelector
                                    label="Schwerpunkte"
                                    :items="focusAreas"
                                    :selectedItems="formData.selectedFocusAreas"
                                    @update:selectedItems="updateSelectedFocusAreas"
                                    selectorId="focus-areas"
                                    colorScheme="blue"
                                />
                            </div>

                            <!-- Service Offers -->
                            <div class="lg:col-span-3">
                                <TagSelector
                                    label="Dienstleistungen"
                                    :items="serviceOffers"
                                    :selectedItems="formData.selectedServiceOffers"
                                    @update:selectedItems="updateSelectedServiceOffers"
                                    selectorId="service-offers"
                                    colorScheme="purple"
                                />
                            </div>

                            <!-- Additional Notes -->
                            <div class="lg:col-span-3">
                                <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
                                    Zusätzliche Informationen
                                </label>
                                <textarea
                                    id="notes"
                                    v-model="formData.notes"
                                    rows="4"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent"
                                    placeholder="Weitere Informationen zu deiner Praxis, besonderen Spezialisierungen oder Arbeitsweise..."
                                />
                            </div>
                        </div>
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
                        <span class="text-sm text-secondary">1 von 4</span>
                        <div class="flex space-x-1">
                            <div class="w-2 h-2 bg-accent rounded-full"></div>
                            <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
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

            <!-- Search Overlays -->
            <!-- Search Result Card (shown when user data is found) -->
            <SearchCard 
                :show="showIdentifiedCustomer"
                color="green"
                icon="check"
                title="Deine Praxisdaten wurden gefunden!"
                description="Wir haben passende Informationen zu deiner Praxis gefunden. Wenn du sie übernimmst, kannst du noch Korrekturen vornehmen."
                @close="dicardSearchResults"
                class="absolute inset-x-4 top-20 z-50 max-w-4xl mx-auto"
            >
                <!-- Practice Details -->
                <div class="flex flex-col gap-1 items-center bg-white/80 dark:bg-gray-100/10 p-3 sm:p-4 rounded border text-white text-xs md:text-base">
                            <span class="break-words">{{ identifiedCustomer.practiceName || 'Nicht verfügbar' }}</span>
                            <span class="break-words">{{ formatAddress(identifiedCustomer) }}</span>
                </div>

                <!-- Focus Areas -->
                <div v-if="identifiedCustomer.selectedFocusAreas && identifiedCustomer.selectedFocusAreas.length" 
                     class="bg-white/80 p-3 sm:p-4 rounded border">
                    <span class="text-xs sm:text-sm font-medium text-gray-700">Fachbereiche:</span>
                    <div class="mt-2 flex flex-wrap gap-1 sm:gap-2">
                        <span v-for="area in identifiedCustomer.selectedFocusAreas" 
                              :key="area"
                              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {{ focusAreas[area] || area }}
                        </span>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row gap-3 pt-2">
                    <button 
                        @click="acceptCustomerMatch(identifiedCustomer)"
                        class="w-full sm:flex-1 bg-green-600 text-white px-4 py-3 sm:py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Diese Daten übernehmen
                    </button>
                    <button 
                        @click="dicardSearchResults"
                        class="w-full sm:flex-1 bg-white text-gray-700 px-4 py-3 sm:py-2 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                    >
                        Manuell eingeben
                    </button>
                </div>
            </SearchCard>

            <!-- Manual Search Card (shown when no user data match) -->
            <SearchCard 
                :show="showManualSearchCard"
                color="yellow"
                icon="search"
                title="Es geht vielleicht schneller&nbsp;mit&nbsp;PLZ."
                description="Fang mit deiner Postleitzahl an – vielleicht findest du so deine Praxis."
                @close="closeManualSearchCard"
                class="absolute inset-x-4 top-16 z-50 max-w-4xl mx-auto"
            >
                <!-- Search Input -->
                <div>
                    <input
                        v-model="manualSearchZip"
                        type="text"
                        maxlength="5"
                        pattern="[0-9]{5}"
                        class="w-full px-3 py-2 border border-yellow-300 rounded-md shadow-sm placeholder-yellow-500 bg-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="PLZ eingeben (z.B. 10117) - automatische Suche ab 3 Stellen"
                        @input="onSearchPostalCodeChanged"
                    />
                    <!-- Loading indicator -->
                    <div v-if="isManualSearching" class="flex items-center justify-center mt-2">
                        <svg class="animate-spin h-5 w-5 text-yellow-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span class="text-yellow-600 text-sm">Suche läuft...</span>
                    </div>
                </div>

                <!-- Search Results -->
                <div v-if="manualSearchResults.length > 0" class="space-y-3">
                    <div 
                        v-for="(customer, index) in manualSearchResults"
                        :key="index"
                        class="flex md:flex-row flex-col md:items-center justify-between p-4 bg-yellow-100/20 rounded-lg"
                    >
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
                            <button
                                @click="acceptCustomerMatch(customer)"
                                class="px-3 py-1 bg-yellow-600 text-white text-sm font-medium rounded hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                            >
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
                    <button 
                        @click="closeManualSearchCard"
                        class="w-full bg-gray-200/20 text-gray-300 px-4 py-2 rounded-md text-sm font-medium border border-yellow-100 hover:bg-gray-200/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                        Abbrechen - manuell fortfahren
                    </button>
                </div>
            </SearchCard>

            <!-- High Score Matches Card (shown when multiple good matches found) -->
            <SearchCard 
                :show="showHighScoreMatches"
                color="green"
                icon="check"
                title="Mögliche Praxisübereinstimmungen gefunden!"
                description="Basierend auf deinen Daten haben wir folgende mögliche Übereinstimmungen gefunden. Wähle die passende Praxis aus oder fahre manuell fort."
                @close="closeHighScoreMatches"
                class="absolute inset-x-4 top-16 z-50 max-w-4xl mx-auto"
            >
                                    <!-- Search Results -->
                <div v-if="highScoreMatches.length > 0" class="space-y-3">
                    <div 
                        v-for="(customer, index) in highScoreMatches"
                        :key="index"
                        class="flex md:flex-row flex-col md:items-center justify-between p-4 bg-yellow-100/20 rounded-lg"
                    >
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
                            <button
                                @click="acceptCustomerMatch(customer)"
                                
                                class="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Übernehmen
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Cancel Button -->
                <div class="mt-4 pt-4 border-green-200">
                    <button 
                        @click="closeManualSearchCard"
                        class="w-full bg-gray-200/20 text-gray-300 px-4 py-2 rounded-md text-sm font-medium border border-green-100 hover:bg-gray-200/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Abbrechen - manuell fortfahren
                    </button>
                </div>
            </SearchCard>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, navigateTo } from '#app'
import { useOnboarding } from '~/composables/useOnboarding'
import { useEnumerations } from '~/composables/useEnumerations'
import TagSelector from '~/components/TagSelector.vue'
import { de } from '@nuxt/ui/runtime/locale/index.js'

// Confidence threshold constants
const CONFIDENCE_THRESHOLDS = {
    VERY_HIGH: 0.98,    // Auto-adopt threshold
    HIGH: 0.9,          // High confidence badge threshold
    GOOD: 0.85,         // Good matches threshold
    MEDIUM: 0.65,        // Minimum for high score filtering
    LOW: 0.58            // Minimum for medium score filtering
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
const { updateOnboardingData, getOnboardingData, setCurrentStep } = useOnboarding()
const { focusAreas, serviceOffers, isLoading, error, loadEnumerations } = useEnumerations()

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

// Show address fields when customer data includes address
const showAddressFields = ref(false)

// Potential customers state
const isCheckingCustomers = ref(false)

// Semantic flow state
const showIdentifiedCustomer = ref(false)
const identifiedCustomer = ref({})

// Manual search card (for when no match found)
const showManualSearchCard = ref(false)
const manualSearchZip = ref('')
const manualSearchResults = ref([])
const isManualSearching = ref(false)

// High score matches card (for when user data finds multiple good matches)
const showHighScoreMatches = ref(false)
const highScoreMatches = ref([])

// Bundeslaender data
const bundeslaenderData = ref([])
const isLoadingBundeslaender = ref(false)

// Tag selector methods
const updateSelectedFocusAreas = (newSelected) => {
    formData.value.selectedFocusAreas = newSelected
    saveFormData()
}

const updateSelectedServiceOffers = (newSelected) => {
    formData.value.selectedServiceOffers = newSelected
    saveFormData()
}

// Load bundeslaender data
const loadBundeslaender = async () => {
    try {
        isLoadingBundeslaender.value = true
        const response = await $fetch('/api/static/bundeslaender')
        bundeslaenderData.value = response
        console.log('Bundeslaender data loaded:', response)
        console.log('States available:', response?.states)
        console.log('Postal codes count:', response?.postal_codes?.length)
    } catch (error) {
        console.error('Failed to load bundeslaender data:', error)
    } finally {
        isLoadingBundeslaender.value = false
    }
}

// Convert state name to standardized value for form
const convertStateNameToValue = (stateName) => {
    if (!stateName) return ''
    
    return stateName.toLowerCase()
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe') 
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
}

// Calculate Bundesland from ZIP code
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
        // Convert state code to the value format used in our dropdown
        const stateCode = matchingRange.state
        const stateName = bundeslaenderData.value.states[stateCode]
        
        // Use the shared conversion function
        return convertStateNameToValue(stateName)
    }
    
    return null
}

// Load existing data if available
var existingData = getOnboardingData()

// Initialize contactPerson with user's first_name and last_name if not already set
if (!formData.value.contactPerson && existingData?.stepData?.user) {
    const userData = existingData.stepData.user
    const firstName = userData.first_name || ''
    const lastName = userData.last_name || ''
    if (firstName || lastName) {
        formData.value.contactPerson = `${firstName} ${lastName}`.trim()
    }
}

// Update current step
setCurrentStep(1)

const setNewPostalCode = (value) => {
    formData.value.postalCode = value
    
    // Auto-calculate Bundesland when ZIP code is complete
    if (value.length === 5) {

        const calculatedBundesland = calculateBundeslandFromZip(value)
        console.log(`ZIP ${value} -> Bundesland: ${calculatedBundesland}`)
        if (calculatedBundesland) {

            // Always update Bundesland when ZIP changes (don't check if empty)
            formData.value.bundesland = calculatedBundesland
            console.log(`Auto-set Bundesland to: ${calculatedBundesland}`)
        }
    } else {
        // Clear Bundesland if ZIP is incomplete
        formData.value.bundesland = ''
    }
}

// Parse address from customer data into separate components
const parseAddress = (address) => {
    if (!address || typeof address !== 'string') {
        return { street: '', city: '', postalCode: '' }
    }

    // Common German address patterns
    // Pattern 1: "Musterstraße 123, 10115 Berlin"
    // Pattern 2: "Musterstraße 123\n10115 Berlin"
    // Pattern 3: "Musterstraße 123 10115 Berlin"
    
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
    
    console.log('Adopted customer data:', customer)
    
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
    console.log('Adopted form data:', formData.value)

    // Set additional notes if available
    if (customer.notes) {
        formData.value.notes = customer.notes
    }
    
    // Save the updated data
    saveFormData()
}

// New methods for semantic flow and user data matching
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
    
    const userData = existingData?.stepData?.user || {}
    
    // If we have user data, check if it matches existing customers
    if (userData.email || (userData.first_name && userData.last_name)) {
        try {
            const queryParams = new URLSearchParams({
                zip: userData.postal_code || '',
                first_name: userData.first_name || '',
                last_name: userData.last_name || '',
                email: userData.email || ''
            })
            
            const response = await $fetch(`/api/fuzzy/potential-customers?${queryParams.toString()}`)
            console.log('Initial user data match response:', response)
            if (response?.results?.length > 0) {
                const processedCustomers = response.results.map((item) => ({ ...item.customer, score: item.score }))
                
                // Filter customers with high scores (>MEDIUM)
                const highScoreCustomers = processedCustomers.filter(customer => customer.score > CONFIDENCE_THRESHOLDS.MEDIUM)
                
                if (highScoreCustomers.length > 0) {
                    // Find very high matches (>VERY_HIGH) for automatic adoption
                    const veryHighScoreCustomers = highScoreCustomers.filter(customer => customer.score > CONFIDENCE_THRESHOLDS.VERY_HIGH)
                    
                    if (veryHighScoreCustomers.length === 1) {
                        // Single very high match - show semantic flow immediately
                        showIdentifiedCustomerWithData(veryHighScoreCustomers[0])
                    } else if (highScoreCustomers.length === 1 && highScoreCustomers[0].score > CONFIDENCE_THRESHOLDS.HIGH) {
                        // Single high match - show semantic flow
                        showIdentifiedCustomerWithData(highScoreCustomers[0])
                    } else if (highScoreCustomers.length > 1) {
                        // Multiple high matches - show selection card
                        highScoreMatches.value = highScoreCustomers.sort((a, b) => b.score - a.score)
                        showHighScoreMatches.value = true
                        // Also populate basic form with user data
                        fillFormWithUserData(userData)
                    } else {
                        // Single medium match - populate ZIP and let user search
                        if (highScoreCustomers[0].postal_code) {
                            formData.value.postalCode = highScoreCustomers[0].postal_code
                        }
                        fillFormWithUserData(userData)
                    }
                } else {
                    // No high score match - show manual search card and populate form with user data
                    showManualSearchCard.value = true
                    fillFormWithUserData(userData)
                }
            } else {
                // No API results - show manual search card and populate form with user data
                showManualSearchCard.value = true
                fillFormWithUserData(userData)
            }
        } catch (error) {
            console.error('Error checking initial user data:', error)
            // Fallback to user data and show manual search
            showManualSearchCard.value = true
            fillFormWithUserData(userData)
        }
    }
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

const showIdentifiedCustomerWithData = (customerData) => {
    identifiedCustomer.value = {
        ...customerData,
        ...parseCustomerData(customerData)
    }
    showIdentifiedCustomer.value = true
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

const acceptCustomerMatch = (customer = null) => {
    // Store current contactPerson to preserve it
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
    const userData = existingData?.stepData?.user || {}
    fillFormWithUserData(userData)
    showIdentifiedCustomer.value = false
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

const saveFormData = () => {
    updateOnboardingData({
        step1: formData.value
    })
}

const goBack = async () => {
    saveFormData() // Save data before navigating
    await navigateTo('/onboarding/start')
}

const goNext = async () => {
    try {
        // Save data locally first
        saveFormData()
        
        // Get current onboarding data for API call
        const onboardingData = getOnboardingData()
        
        if (!onboardingData || !onboardingData.userToken) {
            console.error('Missing onboarding data or userToken')
            // Still navigate even if API call fails
            await navigateTo('/onboarding/schritt/2')
            return
        }
        
        // Prepare API payload
        const apiPayload = {
            userToken: onboardingData.userToken,
            data: {
                step: 1,
                customerId: onboardingData.customerId,
                userId: onboardingData.userId,
                planSlug: onboardingData.planSlug,
                onboardingToken: onboardingData.onboardingToken,
                stepData: {
                    step1: formData.value
                }
            }
        }
        
        console.log('Saving step 1 data to API:', apiPayload)
        
        // Call API to save onboarding data
        const response = await $fetch('/api/onboarding', {
            method: 'POST',
            body: apiPayload
        })
        
        if (response.success) {
            console.log('Step 1 data saved successfully:', response)
        } else {
            console.warn('API response indicates failure:', response)
        }
        
    } catch (error) {
        console.error('Failed to save step 1 data to API:', error)
        // Don't block navigation on API failure
    }
    
    // Navigate to next step regardless of API call result
    await navigateTo('/onboarding/schritt/2')
}

// Manual search functionality
const onSearchPostalCodeChanged = (event) => {
    // Only allow digits and limit to 5 characters
    const value = event.target.value.replace(/[^0-9]/g, '').slice(0, 5)
    manualSearchZip.value = value
    
    // Clear results if ZIP changes
    if (manualSearchResults.value.length > 0) {
        manualSearchResults.value = []
    }
    
    // Automatically search when there are at least 3 digits
    if (value.length >= 3) {
        performManualSearch()
    }
}

const performManualSearch = async () => {
    // Search when there are at least 3 digits
    if (manualSearchZip.value.length < 3) return
    
    try {
        isManualSearching.value = true
        manualSearchResults.value = []
        
        // Get user data for enhanced search
        const onboardingData = getOnboardingData()
        const userData = onboardingData?.stepData?.user || {}
        
        // Search with ZIP code AND user data for better matching
        const queryParams = new URLSearchParams({
            zip: manualSearchZip.value,
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            email: userData.email || ''
        })
        
        console.log('Manual search with combined data:', {
            zip: manualSearchZip.value,
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            email: userData.email || ''
        })
        
        const response = await $fetch(`/api/fuzzy/potential-customers?${queryParams.toString()}`)
        
        if (response?.results?.length > 0) {
            manualSearchResults.value = response.results.map((item) => ({ ...item.customer, score: item.score }))
        }
    } catch (error) {
        console.error('Error performing manual search:', error)
    } finally {
        isManualSearching.value = false
    }
}

const closeManualSearchCard = () => {
    showManualSearchCard.value = false
    manualSearchZip.value = ''
    manualSearchResults.value = []
}

const closeHighScoreMatches = () => {
    showHighScoreMatches.value = false
    highScoreMatches.value = []
}

const closeIdentifiedCustomer = () => {
    showIdentifiedCustomer.value = false
    identifiedCustomer.value = null
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

const fillFormFromExistingData = (data) => {
    if (data?.step1) {
        formData.value = { ...data.step1 }
    }
}

// Load enumerations on mount
onMounted(async () => {
    try {
                await loadEnumerations()
        await loadBundeslaender()
        existingData = getOnboardingData()
        // Check for initial user data match
        console.log('Onboarding data:', existingData)
        if (!existingData?.step1?.customerSelected) {
            await checkInitialUserDataMatch()
        } else {
            fillFormFromExistingData(existingData)
        }
    } catch (err) {
        console.error('Failed to load enumerations or check user data:', err)
    }
})
</script>

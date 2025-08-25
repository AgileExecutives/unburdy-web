<template>
    <div class="min-h-screen flex flex-col">
        <!-- Progress Bar -->
        <OnboardingProgressBar :current-step="2" />

        <!-- Main Content -->
        <div class="flex-1">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Step Header -->
                <div class="text-center mb-8">
                    <p class="text-lg text-secondary">
                        Planung {{ practiceName || '' }}
                    </p>
                </div>

                <!-- Content Card -->
                <div class="bg-surface rounded-lg border border-default p-2 sm:p-4 lg:p-6 mb-6">
                    <AvailabilityManager v-model="formData.availability" />

                    <!-- Ferien und Feiertage Anzeige -->
                    <div v-if="holidays && holidays.BW" class="mt-8">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <!-- Ferien Termine -->
                            <div>
                                <h3 class="text-lg font-semibold mb-2 text-accent">Ferientermine</h3>
                                <div v-for="(yearData, year) in holidays.BW.school_holidays" :key="year" class="mb-4">
                                    <h4 class="font-medium text-secondary mb-1">{{ year }}</h4>
                                    <ul class="list-disc ml-6">
                                        <li v-for="(dates, name) in yearData" :key="name">
                                            <span class="font-semibold">{{ name }}:</span>
                                            <span class="ml-2">{{ dates[0] }} bis {{ dates[1] }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <!-- Feiertage -->
                            <div>
                                <h3 class="text-lg font-semibold mb-2 text-accent">Feiertage</h3>
                                <div v-for="(yearData, year) in holidays.BW.public_holidays" :key="year" class="mb-4">
                                    <h4 class="font-medium text-secondary mb-1">{{ year }}</h4>
                                    <ul class="list-disc ml-6">
                                        <li v-for="(date, name) in yearData" :key="name">
                                            <span class="font-semibold">{{ name }}:</span>
                                            <span class="ml-2">{{ date }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Additional Input Space -->
                <div class="bg-surface rounded-lg border border-default p-2 sm:p-4 lg:p-6 mb-8">
                    <div class="space-y-6">
                        <!-- Placeholder for additional inputs -->
                        <div class="text-center py-8 text-secondary">
                            <p class="text-sm">Weitere Einstellungen werden hier hinzugefügt</p>
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
import { ref, watch } from 'vue'
import { onMounted } from 'vue'
import { useRouter, navigateTo } from '#app'
import { useOnboarding } from '~/composables/useOnboarding'
import AvailabilityManager from '~/components/AvailabilityManager.vue'

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
const { saveStepData, getOnboardingData, setCurrentStep, goBack: goBackStep } = useOnboarding()

const practiceName = ref('')
const existingData = ref(null)
const step1Data = ref(null)
const holidays = ref(null)

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

// Auto-save availability data when it changes
watch(() => formData.value.availability, (newAvailability) => {
    console.log('Availability changed, auto-saving...', newAvailability)
    saveFormData()
}, { deep: true })


onMounted(() => {
    existingData.value = getOnboardingData()
    console.log('Existing Data:', existingData.value)   
    
    // Load existing step 1 data for practice name display
    step1Data.value = Array.isArray(existingData.value?.steps)
        ? existingData.value.steps.find(step => step.stepNumber === 1)
        : {}
    if (step1Data.value) {
        // Access practiceName directly from step data, not under formData
        practiceName.value = step1Data.value.practiceName || ''
    }       
    
    // Load existing step 2 data if available
    const step2Data = Array.isArray(existingData.value?.steps)
        ? existingData.value.steps.find(step => step.stepNumber === 2)
        : undefined
    if (step2Data && step2Data.availability) {
        // Only load the availability data, preserve the default structure
        formData.value.availability = { ...step2Data.availability }
        console.log('Loaded existing availability data:', formData.value.availability)
    }

    console.log('Final form data:', formData.value)
})


// Save form data
const saveFormData = () => {
    console.log('Saving availability data:', formData.value.availability)
    saveStepData(2, formData.value)
    
    // Verify the data was saved by checking what's in storage
    const verifyData = getOnboardingData()
    const savedStep2 = verifyData.steps?.find(step => step.stepNumber === 2)
    console.log('Verified saved step 2 data:', savedStep2)
}

// Update current step
setCurrentStep(2)

// Methods
const goBack = async () => {
    saveFormData()
    await goBackStep()
    router.push('/onboarding/schritt/1')
}

const goNext = async () => {
    saveFormData()
    router.push('/onboarding/schritt/3')
}
</script>

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
                <div class="glass-card rounded-lg border border-default/50 p-6 sm:p-8 lg:p-8 mb-8 shadow-xl">
                    <AvailabilityManager 
                        v-model="formData.availability" 
                        :week-view-mode="formData.weekViewMode"
                        @update:week-view-mode="formData.weekViewMode = $event"
                    />

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
                <div class="glass-card rounded-lg border border-default/50 p-6 sm:p-8 lg:p-8 mb-8 shadow-xl">
                    <div class="space-y-6">
                        <!-- Scheduling Try-out Section -->
                        <div class="text-center py-8">
                            <div class="max-w-md mx-auto">
                                <div class="mb-4">
                                    <div class="relative">
                                        <svg class="h-12 w-12 mx-auto text-green-400 mb-2 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <!-- Enhanced glow effect behind the icon -->
                                        <div class="absolute inset-0 h-12 w-12 mx-auto bg-green-400/30 rounded-full blur-xl opacity-60"></div>
                                    </div>
                                    <h3 class="text-lg font-semibold text-primary mb-2 drop-shadow-sm">Dein Kalender wurde angelegt!</h3>
                                </div>
                                <p class="text-sm text-secondary mb-4 opacity-90">
                                    Möchtest du ausprobieren, wie deine Klienten selbstständig einen wöchentlichen Termin aussuchen können?
                                </p>
                                <button 
                                    @click="tryScheduling"
                                    :disabled="isCreatingScheduling"
                                    class="bg-gradient-button hover:bg-gradient-primary-hover inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-xl"
                                >
                                    <svg v-if="isCreatingScheduling" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <svg v-else class="mr-2 -ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    {{ isCreatingScheduling ? 'Erstelle Terminbuchung...' : 'Terminbuchung ausprobieren' }}
                                </button>
                                
                                <!-- Success Message -->
                                <div v-if="schedulingResult && schedulingResult.success" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <p class="text-green-800 text-sm font-medium">Terminbuchung erstellt!</p>
                                    <a v-if="schedulingResult.scheduling_data?.url" 
                                       :href="schedulingResult.scheduling_data.url" 
                                       target="_blank"
                                       class="inline-flex items-center mt-2 text-sm text-green-600 hover:text-green-800 font-medium">
                                        Zur Terminbuchung
                                        <svg class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                                
                                <!-- Error Message -->
                                <div v-if="schedulingResult && !schedulingResult.success" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p class="text-red-800 text-sm">{{ schedulingResult.message }}</p>
                                </div>
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
const { saveStepData, getOnboardingData, setCurrentStep, goBack: goBackStep, saveOnboardingToDatabase, createOnboardingScheduling } = useOnboarding()

const practiceName = ref('')
const existingData = ref(null)
const step1Data = ref(null)
const holidays = ref(null)

// Scheduling state
const isCreatingScheduling = ref(false)
const schedulingResult = ref(null)

// Form data
const formData = ref({
    weekViewMode: 5,
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
    saveFormData()
}, { deep: true })

// Auto-save week view mode when it changes
watch(() => formData.value.weekViewMode, (newWeekViewMode) => {
    saveFormData()
})

onMounted(() => {
    existingData.value = getOnboardingData()
    
    // Filter out empty steps first
    const validSteps = Array.isArray(existingData.value?.steps)
        ? existingData.value.steps.filter(step => step && typeof step === 'object' && step.stepNumber)
        : []
    
    // Load existing step 1 data for practice name display
    step1Data.value = validSteps.find(step => step.stepNumber === 1) || {}
    if (step1Data.value) {
        practiceName.value = step1Data.value.practiceName || ''
    }       
    
    // Load existing step 2 data if available
    const step2Data = validSteps.find(step => step.stepNumber === 2)
    
    if (step2Data) {
        if (step2Data.availability) {
            formData.value.availability = { ...step2Data.availability }
        }
        if (step2Data.weekViewMode !== undefined) {
            formData.value.weekViewMode = step2Data.weekViewMode
        }
    }
})


// Save form data
const saveFormData = () => {
    saveStepData(2, formData.value)
}

// Update current step
setCurrentStep(2)

// Methods
const goBack = async () => {
    saveFormData()
    // Save to database before navigation
    await saveOnboardingToDatabase()
    await goBackStep()
    router.push('/onboarding/schritt/1')
}

const goNext = async () => {
    saveFormData()
    // Save to database before navigation
    await saveOnboardingToDatabase()
    router.push('/onboarding/schritt/3')
}

const tryScheduling = async () => {
    isCreatingScheduling.value = true
    schedulingResult.value = null
    
    try {
        // Save current form data first
        saveFormData()
        
        // Create the scheduling
        const result = await createOnboardingScheduling()
        schedulingResult.value = result
        
        if (result.success && result.scheduling_data?.url) {
            console.log('Scheduling created successfully, URL:', result.scheduling_data.url)
            // Automatically open the scheduling URL in a new tab
            window.open(result.scheduling_data.url, '_blank')
        }
    } catch (error) {
        console.error('Error creating scheduling:', error)
        schedulingResult.value = {
            success: false,
            message: 'Fehler beim Erstellen der Terminbuchung'
        }
    } finally {
        isCreatingScheduling.value = false
    }
}
</script>

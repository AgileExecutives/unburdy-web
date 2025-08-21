<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
        <div class="p-4 rounded-2xl shadow-2xl max-w-4xl w-full h-full md:max-h-[85vh] overflow-y-auto border relative bg-surface border-default">
            <!-- Decorative background elements -->
            <div class="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl bg-gradient-to-br from-blue-200/30 to-indigo-200/30 dark:from-blue-900/30 dark:to-indigo-900/30"></div>
            <div class="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl bg-gradient-to-tr from-slate-200/30 to-blue-200/30 dark:from-slate-800/30 dark:to-blue-900/30"></div>
            
            <!-- Content -->
            <div class="relative z-10">
                <!-- Close X button -->
                <button 
                    @click="closeModal"
                    class="absolute top-4 right-4 text-2xl font-light w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 text-tertiary hover:text-secondary hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                >
                    ×
                </button>
                
                <!-- Header -->
                <div class="flex items-center mb-4">
                    <div class="flex items-center justify-center w-12 h-12 rounded-xl mr-4 bg-blue-500/10 dark:bg-blue-500/20">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <h2 class="text-xl font-bold text-primary">Ferien und Feiertage für {{ bundesland }}</h2>
                </div>
                
                <div v-if="holidays && holidays.school">
                    <!-- Tabs for years -->
                    <div class="flex space-x-2 mb-4 border-b border-secondary">
                        <button
                            v-for="year in Object.keys(holidays.school)"
                            :key="year"
                            :class="[
                                'px-3 py-1.5 rounded-t-lg text-sm font-medium transition-all',
                                selectedYear === year 
                                    ? 'bg-blue-500 text-white border-b-2 border-blue-500'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-gray-100'
                            ]"
                            @click="selectedYear = year"
                        >
                            {{ year }}
                        </button>
                    </div>
                    
                    <!-- Holidays data for selected year -->
                    <div v-if="selectedYear" class="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
                        <!-- School holidays (1/3 width = 2 columns out of 5) -->
                        <div class="lg:col-span-2 backdrop-blur-sm rounded-xl p-4 border h-full flex flex-col bg-surface-secondary border-blue-100 dark:border-blue-500/30">
                            <h3 class="text-sm font-medium mb-3 uppercase tracking-wide text-tertiary">Ferientermine</h3>
                            <div class="space-y-2 flex-1">
                                <div v-for="(dates, name) in holidays.school[selectedYear]" :key="name" class="p-3 rounded-lg border bg-blue-50 border-blue-100 dark:bg-blue-900/40 dark:border-blue-500/30">
                                    <span class="font-semibold text-sm text-blue-700 dark:text-blue-300">{{ name }}</span>
                                    <div class="text-xs mt-1 text-secondary">
                                        {{ formatDateToGerman(dates[0]) }} bis {{ formatDateToGerman(dates[1]) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Public holidays (2/3 width = 3 columns out of 5) -->
                        <div class="lg:col-span-3 backdrop-blur-sm rounded-xl p-4 border h-full flex flex-col bg-surface-secondary border-indigo-100 dark:border-indigo-500/30">
                            <h3 class="text-sm font-medium mb-3 uppercase tracking-wide text-tertiary">Feiertage</h3>
                            <div class="grid grid-cols-2 gap-2 flex-1">
                                <div v-for="(date, name) in holidays.public[selectedYear]" :key="name" class="p-3 rounded-lg border h-fit bg-indigo-50 border-indigo-100 dark:bg-indigo-900/40 dark:border-indigo-500/30">
                                    <span class="font-semibold text-sm text-indigo-700 dark:text-indigo-300">{{ name }}</span>
                                    <div class="text-xs mt-1 text-secondary">
                                        {{ formatDateToGerman(date) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Close button -->
                <div class="flex justify-center mt-4">
                    <button class="px-6 py-2 rounded-xl transition-all duration-200 shadow-lg font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800" @click="closeModal">
                        Schließen
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    holidays: {
        type: Object,
        default: () => null
    },
    bundesland: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['close'])

const selectedYear = ref('')

// Format date to German format (DD.MM.YYYY)
const formatDateToGerman = (dateString) => {
    if (!dateString) return dateString
    
    // Handle different date formats that might come from the API
    let date
    
    // Try to parse the date string
    if (dateString.includes('-')) {
        // Format: YYYY-MM-DD or DD-MM-YYYY
        const parts = dateString.split('-')
        if (parts[0].length === 4) {
            // YYYY-MM-DD format
            date = new Date(parts[0], parseInt(parts[1]) - 1, parts[2])
        } else {
            // DD-MM-YYYY format
            date = new Date(parts[2], parseInt(parts[1]) - 1, parts[0])
        }
    } else if (dateString.includes('/')) {
        // Format: MM/DD/YYYY or DD/MM/YYYY
        date = new Date(dateString)
    } else {
        // Try direct parsing
        date = new Date(dateString)
    }
    
    // If date is invalid, return original string
    if (isNaN(date.getTime())) {
        return dateString
    }
    
    // Format to German date format: DD.MM.YYYY
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    
    return `${day}.${month}.${year}`
}

// Initialize with first available year
watch(() => props.holidays, (newHolidays) => {
    if (newHolidays && newHolidays.school && Object.keys(newHolidays.school).length > 0) {
        selectedYear.value = Object.keys(newHolidays.school)[0]
    }
}, { immediate: true })

const closeModal = () => {
    emit('close')
}

// Handle ESC key
const handleKeydown = (event) => {
    if (event.key === 'Escape' && props.show) {
        closeModal()
    }
}

onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
        <div :class="[
            'p-4 rounded-2xl shadow-2xl max-w-4xl w-full h-full md:max-h-[85vh] overflow-y-auto border relative',
            isDarkMode 
                ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-gray-100 border-gray-700/50' 
                : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-800 border-blue-200/50'
        ]">
            <!-- Decorative background elements -->
            <div :class="[
                'absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl',
                isDarkMode 
                    ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30' 
                    : 'bg-gradient-to-br from-blue-200/30 to-indigo-200/30'
            ]"></div>
            <div :class="[
                'absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl',
                isDarkMode 
                    ? 'bg-gradient-to-tr from-slate-800/30 to-blue-900/30' 
                    : 'bg-gradient-to-tr from-slate-200/30 to-blue-200/30'
            ]"></div>
            
            <!-- Content -->
            <div class="relative z-10">
                <!-- Close X button -->
                <button 
                    @click="closeModal"
                    :class="[
                        'absolute top-4 right-4 text-2xl font-light w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200',
                        isDarkMode 
                            ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50' 
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200/50'
                    ]"
                >
                    ×
                </button>
                
                <!-- Header -->
                <div class="flex items-center mb-4">
                    <div :class="[
                        'flex items-center justify-center w-12 h-12 rounded-xl mr-4',
                        isDarkMode ? 'bg-blue-500/20' : 'bg-blue-500/10'
                    ]">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <h2 :class="[
                        'text-xl font-bold',
                        isDarkMode ? 'text-gray-100' : 'text-gray-800'
                    ]">Feiertage für {{ bundesland }}</h2>
                </div>
                
                <div v-if="holidays && holidays.school">
                    <!-- Tabs for years -->
                    <div :class="[
                        'flex space-x-2 mb-4 border-b',
                        isDarkMode ? 'border-gray-600/50' : 'border-gray-200/50'
                    ]">
                        <button
                            v-for="year in Object.keys(holidays.school)"
                            :key="year"
                            :class="[
                                'px-3 py-1.5 rounded-t-lg text-sm font-medium transition-all',
                                selectedYear === year 
                                    ? 'bg-blue-500 text-white border-b-2 border-blue-500'
                                    : isDarkMode 
                                        ? 'bg-gray-700/80 text-gray-300 hover:bg-gray-600/80 hover:text-gray-100'
                                        : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:text-gray-800'
                            ]"
                            @click="selectedYear = year"
                        >
                            {{ year }}
                        </button>
                    </div>
                    
                    <!-- Holidays data for selected year -->
                    <div v-if="selectedYear" class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                        <!-- School holidays -->
                        <div :class="[
                            'backdrop-blur-sm rounded-xl p-4 border h-full flex flex-col',
                            isDarkMode 
                                ? 'bg-gray-800/60 border-blue-500/30' 
                                : 'bg-white/60 border-blue-100/50'
                        ]">
                            <h3 :class="[
                                'text-sm font-medium mb-3 uppercase tracking-wide',
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            ]">Ferientermine</h3>
                            <ul class="space-y-2 flex-1">
                                <li v-for="(dates, name) in holidays.school[selectedYear]" :key="name" :class="[
                                    'p-3 rounded-lg border',
                                    isDarkMode 
                                        ? 'bg-blue-900/40 border-blue-500/30' 
                                        : 'bg-blue-50/80 border-blue-100/50'
                                ]">
                                    <span :class="[
                                        'font-semibold text-sm',
                                        isDarkMode ? 'text-blue-300' : 'text-blue-700'
                                    ]">{{ name }}</span>
                                    <div :class="[
                                        'text-xs mt-1',
                                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    ]">
                                        {{ dates[0] }} bis {{ dates[1] }}
                                    </div>
                                </li>
                            </ul>
                        </div>
                        
                        <!-- Public holidays -->
                        <div :class="[
                            'backdrop-blur-sm rounded-xl p-4 border h-full flex flex-col',
                            isDarkMode 
                                ? 'bg-gray-800/60 border-indigo-500/30' 
                                : 'bg-white/60 border-indigo-100/50'
                        ]">
                            <h3 :class="[
                                'text-sm font-medium mb-3 uppercase tracking-wide',
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            ]">Feiertage</h3>
                            <div class="grid grid-cols-2 gap-2 flex-1">
                                <div v-for="(date, name) in holidays.public[selectedYear]" :key="name" :class="[
                                    'p-3 rounded-lg border h-fit',
                                    isDarkMode 
                                        ? 'bg-indigo-900/40 border-indigo-500/30' 
                                        : 'bg-indigo-50/80 border-indigo-100/50'
                                ]">
                                    <span :class="[
                                        'font-semibold text-sm',
                                        isDarkMode ? 'text-indigo-300' : 'text-indigo-700'
                                    ]">{{ name }}</span>
                                    <div :class="[
                                        'text-xs mt-1',
                                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    ]">
                                        {{ date }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Close button -->
                <div class="flex justify-center mt-4">
                    <button :class="[
                        'px-6 py-2 rounded-xl transition-all duration-200 shadow-lg font-medium',
                        isDarkMode 
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
                    ]" @click="closeModal">
                        Schließen
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'

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
    },
    darkMode: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['close'])

// Computed property for dark mode
const isDarkMode = computed(() => props.darkMode)

const selectedYear = ref('')

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

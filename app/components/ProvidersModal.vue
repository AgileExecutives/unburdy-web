<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
        <transition name="bounce">
            <div v-if="show" class="p-6 rounded-2xl shadow-2xl max-w-4xl w-full h-full md:max-h-[70vh] overflow-y-auto border relative bg-surface border-default">
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
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                        <h2 class="text-xl font-bold text-primary">Jugendämter in deiner Region</h2>
                    </div>
                    
                    <div v-if="providers && providers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div v-for="provider in providers" :key="provider.organization" class="backdrop-blur-sm rounded-xl p-3 border bg-surface-secondary border-blue-100 dark:border-blue-500/30">
                            <h3 class="font-semibold text-blue-700 dark:text-blue-300 mb-2 text-xs">{{ provider.organization }}</h3>
                            <div class="space-y-1">
                                <div class="text-secondary text-xs">
                                    <span class="font-medium text-primary">Abteilung:</span> {{ provider.department }}
                                </div>
                                <div class="text-secondary text-xs">
                                    <span class="font-medium text-primary">Adresse:</span> {{ provider.street }}, {{ provider.zip }} {{ provider.city }}
                                </div>
                                <div class="text-secondary text-xs">
                                    <span class="font-medium text-primary">Tel:</span> {{ provider.phone }}
                                </div>
                                <div class="text-secondary text-xs">
                                    <span class="font-medium text-primary">E-Mail:</span> 
                                    <a :href="`mailto:${provider.email}`" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline ml-1">{{ provider.email }}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Close button -->
                    <div class="flex justify-center mt-6">
                        <button class="px-6 py-2 rounded-xl transition-all duration-200 shadow-lg font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800" @click="closeModal">
                            Schließen
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    providers: {
        type: Array,
        default: () => []
    },
    bundesland: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['close'])

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

<style scoped>
/* Bounce animation for provider modal */
.bounce-enter-active {
    animation: bounce-in 0.6s ease-out;
}

.bounce-leave-active {
    animation: bounce-out 0.3s ease-in;
}

@keyframes bounce-in {
    0% {
        transform: scale(0.3) translateY(-50px);
        opacity: 0;
    }
    50% {
        transform: scale(1.05) translateY(-10px);
        opacity: 0.8;
    }
    70% {
        transform: scale(0.95) translateY(5px);
        opacity: 0.9;
    }
    100% {
        transform: scale(1) translateY(0);
        opacity: 1;
    }
}

@keyframes bounce-out {
    0% {
        transform: scale(1) translateY(0);
        opacity: 1;
    }
    100% {
        transform: scale(0.8) translateY(-20px);
        opacity: 0;
    }
}
</style>

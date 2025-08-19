<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <transition name="bounce">
            <div v-if="show" class="bg-gray-900 text-white p-6 rounded-lg shadow-xl max-w-4xl w-full h-full md:max-h-[70vh] overflow-y-auto border-2 border-white relative">
                <!-- Close X button -->
                <button 
                    @click="closeModal"
                    class="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800 transition-colors"
                >
                    ×
                </button>
                <h2 class="text-lg font-bold mb-4 text-gray-100 pr-10">Jugendämter in {{ bundesland }}</h2>
                <div v-if="providers && providers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div v-for="provider in providers" :key="provider.name" class="bg-gray-800 p-3 rounded text-xs">
                        <h3 class="font-semibold text-blue-300 mb-2 text-xs">{{ provider.name }}</h3>
                        <div class="space-y-1">
                            <div class="text-gray-300">
                                <span class="font-medium text-gray-200">Abteilung:</span> {{ provider.abteilung }}
                            </div>
                            <div class="text-gray-300">
                                <span class="font-medium text-gray-200">Adresse:</span> {{ provider.adresse }}
                            </div>
                            <div class="text-gray-300">
                                <span class="font-medium text-gray-200">Tel:</span> {{ provider.telefon }}
                            </div>
                            <div class="text-gray-300">
                                <span class="font-medium text-gray-200">E-Mail:</span> 
                                <a :href="`mailto:${provider.email}`" class="text-blue-400 hover:text-blue-300 underline ml-1">{{ provider.email }}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="mt-4 px-4 py-2 bg-accent text-white rounded hover:bg-accent-hover text-sm" @click="closeModal">Schließen</button>
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

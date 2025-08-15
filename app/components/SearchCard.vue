<template>
    <transition name="card-fade" mode="out-in">
        <div :class="cardBackgroundClasses">
        <div v-if="show" :class="cardClasses">
            <!-- Header with icon, title, and close button -->
            <div class="flex items-start justify-between">
                    <div class="flex-shrink-0 self-start">
                        <svg :class="iconClasses" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
                        </svg>
                    </div>
                <div class="flex items-start min-w-0 flex-grow">

                    <div class="ml-4 sm:ml-3 min-w-0 flex-1 self-start">
                        <div :class="titleClasses">
                            {{ title }}
                        </div>
                        <div :class="descriptionClasses" class="mt-1 mb-4">
                            {{ description }}
                        </div>
                    </div>
                </div>
                <button 
                    v-if="closable"
                    @click="$emit('close')"
                    :class="closeButtonClasses"
                    class="flex-shrink-0 ml-2 p-1"
                >
                    <svg class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <!-- Slot for card content -->
            <div class="space-y-3 sm:space-y-4">
                <slot />
            </div>
            </div>            
        </div>
    </transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    color: {
        type: String,
        default: 'green', // green, yellow, blue, red
        validator: (value) => ['green', 'yellow', 'blue', 'red'].includes(value)
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: 'check', // check, search, alert, info
        validator: (value) => ['check', 'search', 'alert', 'info'].includes(value)
    },
    closable: {
        type: Boolean,
        default: true
    },
    mobile: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['close'])

const colorConfig = {
    green: {
        card: 'bg-green-50 dark:bg-green-900/20 border-green-200',
        icon: 'text-green-600',
        title: 'text-white',
        description: 'text-gray-300',
        closeButton: 'text-green-400 hover:text-green-600'
    },
    yellow: {
        card: 'bg-yellow-50 dark:bg-yellow-500/20 border-yellow-200',
        icon: 'text-yellow-600',
        title: 'text-white',
        description: 'text-gray-300',
        closeButton: 'text-yellow-400 hover:text-yellow-600'
    },
    blue: {
        card: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200',
        icon: 'text-blue-600',
        title: 'text-white',
        description: 'text-gray-300',
        closeButton: 'text-blue-400 hover:text-blue-600'
    },
    red: {
        card: 'bg-red-50 dark:bg-red-900/20 border-red-200',
        icon: 'text-red-600',
        title: 'text-white',
        description: 'text-gray-300',
        closeButton: 'text-red-400 hover:text-red-600'
    }
}

const iconPaths = {
    check: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    alert: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L5.268 16.5c-.77.833.192 2.5 1.732 2.5z',
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
}

const cardBackgroundClasses = ref('mb-6 bg-surface rounded-lg') 

const cardClasses = computed(() => {
    const baseClasses = 'p-4 sm:p-6 border rounded-lg'
    const colorClasses = colorConfig[props.color]?.card || colorConfig.green.card
    return `${baseClasses} ${colorClasses}`
})

const iconClasses = computed(() => {
    const baseClasses = 'h-5 w-5 sm:h-6 sm:w-6'
    const colorClasses = colorConfig[props.color]?.icon || colorConfig.green.icon
    return `${baseClasses} ${colorClasses}`
})

const titleClasses = computed(() => {
    const baseClasses = 'text-base sm:text-xl font-semibold'
    const colorClasses = colorConfig[props.color]?.title || colorConfig.green.title
    return `${baseClasses} ${colorClasses}`
})

const descriptionClasses = computed(() => {
    const baseClasses = 'text-xs sm:text-sm'
    const colorClasses = colorConfig[props.color]?.description || colorConfig.green.description
    return `${baseClasses} ${colorClasses}`
})

const closeButtonClasses = computed(() => {
    return colorConfig[props.color]?.closeButton || colorConfig.green.closeButton
})

const iconPath = computed(() => {
    return iconPaths[props.icon] || iconPaths.check
})
</script>

<style scoped>
.card-fade-enter-active, .card-fade-leave-active {
    transition: all 0.3s ease;
}
.card-fade-enter-from, .card-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>

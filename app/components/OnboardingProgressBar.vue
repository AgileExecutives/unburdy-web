<template>
    <div class="border-bpy-2">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div class="flex items-center justify-between">
                <h1 class="text-base md:text-lg md:font-semibold text-primary mt-4">Praxiseinrichtung</h1>
                <div class="text-sm text-secondary"><span class="hidden md:flex">Schritt</span>{{ currentStep }} von {{ totalSteps }}</div>
            </div>
            <!-- Progress Bar with Step Numbers -->
            <div class="relative">
                <div class="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2">
                    <div class="bg-accent h-2 rounded-full transition-all duration-300" :style="`width: ${progressPercentage}%`"></div>
                </div>
                <!-- Step Indicators -->
                <div class="flex justify-between absolute -bottom-7 w-full">
                    <div v-for="step in steps" :key="step.number" class="flex flex-col items-center">
                        <div 
                            :class="[
                                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                                step.number <= currentStep
                                    ? 'bg-accent text-white'
                                    : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                            ]"
                        >
                            {{ step.number }}
                        </div>
                        <span 
                            :class="[
                                'text-xs mt-1',
                                step.number <= currentStep
                                    ? 'text-secondary'
                                    : 'text-gray-00 dark:text-gray-400'
                            ]"
                        >
                            {{ step.label }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    currentStep: {
        type: Number,
        required: true,
        validator: (value) => value >= 1 && value <= 4
    }
})

const totalSteps = 4

const steps = [
    { number: 1, label: 'Praxis' },
    { number: 2, label: 'Planung' },
    { number: 3, label: 'Klienten' },
    { number: 4, label: 'Abschluss' }
]

const progressPercentage = computed(() => {
    return (props.currentStep / totalSteps) * 100
})
</script>

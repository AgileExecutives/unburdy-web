<template>
    <div>
        <div v-if="isMobile">
            <MobileAvailabilityEditor v-model="availability" />
        </div>
        <div v-else>
            <WeeklyAvailabilityEditor 
                v-model="availability" 
                :week-view-mode="weekViewMode"
                @update:week-view-mode="$emit('update:weekViewMode', $event)"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import WeeklyAvailabilityEditor from './WeeklyAvailabilityEditor.vue'
import MobileAvailabilityEditor from './MobileAvailabilityEditor.vue'

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    weekViewMode: {
        type: Number,
        default: 5
    }
})

const emit = defineEmits(['update:modelValue', 'update:weekViewMode'])

const availability = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const weekViewMode = computed({
    get: () => props.weekViewMode,
    set: (value) => emit('update:weekViewMode', value)
})

const isMobile = ref(false)

const checkScreenSize = () => {
    isMobile.value = window.innerWidth < 700
}

onMounted(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
})

onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize);
})
</script>

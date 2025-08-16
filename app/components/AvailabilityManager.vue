<template>
    <div>
        <div v-if="isMobile">
            <MobileAvailabilityEditor v-model="availability" />
        </div>
        <div v-else>
            <WeeklyAvailabilityEditor v-model="availability" />
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
    }
})

const emit = defineEmits(['update:modelValue'])

const availability = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
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

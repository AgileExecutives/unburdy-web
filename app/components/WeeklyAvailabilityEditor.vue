<template>
    <div class="bg-surface rounded-lg border border-default">
        <!-- Header -->
        <div class="px-4 py-3 border-b border-default">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-primary">Verfügbare Zeiten</h3>
                <div class="flex items-center space-x-2">
                    <UButton
                        v-for="days in [5, 6, 7]"
                        :key="days"
                        @click="weekViewMode = days"
                        :variant="weekViewMode === days ? 'solid' : 'outline'"
                        size="sm"
                    >
                        {{ days }}
                    </UButton>
                </div>
            </div>
        </div>

        <!-- Week View -->
        <div class="p-4">
            <div 
                class="grid gap-4" 
                :class="gridCols"
                @mouseup="handleMouseUp"
                @mouseleave="cancelSelection"
            >
                <div 
                    v-for="day in visibleDays" 
                    :key="day.key"
                    class="border border-gray-200 rounded-lg p-3"
                >
                    <!-- Day Header -->
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-xs text-gray-500">{{ day.short }}</span>
                    </div>
                    <div class="grid grid-cols-1">
                        <HourSlot 
                            v-for="hour in visibleHours" 
                            :key="hour"
                            :hour="hour"
                            :booked-times="getDaySlots(day.key)"
                            :selected-times="selection.dayKey === day.key ? selection.times : null"
                            @mousedown-quarter="handleMouseDown(day.key, $event)"
                            @mouseenter-quarter="handleMouseEnter(day.key, $event)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import HourSlot from './HourSlot.vue'

// Props
const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({
            monday: [{ startTime: 1300, endTime: 1800 }],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [{ startTime: 2000, endTime: 2100 }],
            saturday: [],
            sunday: []
        })
    }
})

// Reactive Data
const formData = ref(JSON.parse(JSON.stringify(props.modelValue)))
const weekViewMode = ref(5)
const selection = ref({
    isActive: false,
    dayKey: null,
    times: { start: null, end: null }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Days of the week
const allDays = ref([
    { key: 'monday', name: 'Montag', short: 'Mo' },
    { key: 'tuesday', name: 'Dienstag', short: 'Di' },
    { key: 'wednesday', name: 'Mittwoch', short: 'Mi' },
    { key: 'thursday', name: 'Donnerstag', short: 'Do' },
    { key: 'friday', name: 'Freitag', short: 'Fr' },
    { key: 'saturday', name: 'Samstag', short: 'Sa' },
    { key: 'sunday', name: 'Sonntag', short: 'So' }
])

// Computed Properties
const visibleDays = computed(() => allDays.value.slice(0, weekViewMode.value))
const gridCols = computed(() => `grid-cols-1 md:grid-cols-${weekViewMode.value}`)
const visibleHours = computed(() => Array.from({ length: 14 }, (_, i) => i + 7))

// Methods
const getDaySlots = (dayKey) => formData.value[dayKey] || []

const handleMouseDown = (dayKey, time) => {
    selection.value = {
        isActive: true,
        dayKey: dayKey,
        times: { start: time, end: time }
    }
}

const handleMouseEnter = (dayKey, time) => {
    if (selection.value.isActive && selection.value.dayKey === dayKey) {
        selection.value.times.end = time
    }
}

const handleMouseUp = () => {
    if (!selection.value.isActive) return

    const { dayKey, times } = selection.value
    if (!dayKey || !times.start || !times.end) {
        cancelSelection()
        return
    }

    const startTime = times.start.hour * 100 + times.start.minute
    const endTime = times.end.hour * 100 + times.end.minute
    
    const finalStart = Math.min(startTime, endTime)
    const finalEnd = Math.max(startTime, endTime) + 15 // Make it inclusive of the last quarter

    const daySlots = getDaySlots(dayKey)
    
    // Simple merge for now, more complex logic might be needed for overlaps
    daySlots.push({ startTime: finalStart, endTime: finalEnd })
    
    // Sort and merge overlapping intervals
    daySlots.sort((a, b) => a.startTime - b.startTime);
    const mergedSlots = daySlots.reduce((acc, current) => {
        if (acc.length === 0) {
            acc.push(current);
        } else {
            const last = acc[acc.length - 1];
            if (current.startTime <= last.endTime) {
                last.endTime = Math.max(last.endTime, current.endTime);
            } else {
                acc.push(current);
            }
        }
        return acc;
    }, []);

    formData.value[dayKey] = mergedSlots;
    emit('update:modelValue', formData.value)
    cancelSelection()
}

const cancelSelection = () => {
    selection.value = { isActive: false, dayKey: null, times: { start: null, end: null } }
}
</script>

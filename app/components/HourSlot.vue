<template>
    <div class="relative border-t text-sm h-10 border-gray-200">
        <div class="absolute inset-0 grid grid-cols-1 grid-rows-4">
            <div 
                v-for="minute in [0, 15, 30, 45]" 
                :key="minute"
                class="cursor-pointer"
                :class="{ 
                    'bg-green-500/50': isBooked(minute),
                    'bg-blue-400/50': isSelected(minute),
                    'hover:bg-blue-500/30': !isBooked(minute) && !isSelected(minute)
                }"
                @mousedown.prevent="$emit('mousedown-quarter', { hour, minute })"
                @mouseenter="$emit('mouseenter-quarter', { hour, minute })"
                @mouseup="$emit('mouseup-quarter', { hour, minute })"
            ></div>
        </div>
        <span class="absolute top-0 left-1 text-xs text-gray-500 pointer-events-none">
            {{ hour }}:00
        </span>
    </div>
</template>

<script setup>
const props = defineProps({
    hour: {
        type: Number,
        required: true
    },
    bookedTimes: {
        type: Array,
        default: () => []
    },
    selectedTimes: {
        type: Object,
        default: null
    }
})

defineEmits(['mousedown-quarter', 'mouseenter-quarter', 'mouseup-quarter'])

const isBooked = (minute) => {
    const time = props.hour * 100 + minute;
    return props.bookedTimes.some(slot => time >= slot.startTime && time < slot.endTime);
}

const isSelected = (minute) => {
    if (!props.selectedTimes) return false;
    
    const { start, end } = props.selectedTimes;

    if (!start || !end) return false;

    const time = props.hour * 100 + minute;
    const startTime = start.hour * 100 + start.minute;
    const endTime = end.hour * 100 + end.minute;

    return (time >= startTime && time <= endTime) || (time >= endTime && time <= startTime);
}
</script>

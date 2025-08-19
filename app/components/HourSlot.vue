<template>
    <div class="relative border-t text-sm h-10 border-gray-200">
        <div class="absolute inset-0 grid grid-cols-1 grid-rows-4">
            <div 
                v-for="minute in [0, 15, 30, 45]" 
                :key="`${day}-${hour}-${minute}`"
                class="cursor-pointer"
                :class="{ 
                    'bg-green-50 dark:bg-green-800/80': isBooked(minute),
                    'bg-blue-400/50': isSelected(minute),
                    'hover:bg-blue-500/30': !isBooked(minute) && !isSelected(minute)
                }"
                @mousedown.prevent="$emit('mousedown-quarter', { hour, minute })"
                @mouseenter="$emit('mouseenter-quarter', { hour, minute })"
                @mouseup="$emit('mouseup-quarter', { hour, minute })"
            ></div>
        </div>
        <div class="absolute top-0 left-1 text-xs text-gray-500 pointer-events-none">
            <div :class="{ 
                    'text-gray-200': isBooked(0),
                    'text-blue-400': isSelected(0),
                    'hover:text-blue-500': !isBooked(0) && !isSelected(0)
                }">
            {{ hour }}:00</div>
        </div>
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
    },
    day: {
        type: String,
        required: true
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

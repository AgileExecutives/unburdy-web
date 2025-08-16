<template>
    <div>
        <div v-for="day in allDays" :key="day.key" class="mb-6">
            <h4 class="font-medium text-lg mb-2">{{ day.name }}</h4>
            <div class="grid grid-cols-5 gap-1 text-center text-xs">
                <div class="font-semibold">Stunde</div>
                <div class="font-semibold">:00</div>
                <div class="font-semibold">:15</div>
                <div class="font-semibold">:30</div>
                <div class="font-semibold">:45</div>
            </div>
            <div class="grid grid-cols-1 gap-px">
                <div v-for="hour in visibleHours" :key="hour" class="grid grid-cols-5 gap-px items-center">
                    <div class="text-center text-sm font-medium text-gray-500 pr-2">{{ hour }}:00</div>
                    <div 
                        v-for="minute in [0, 15, 30, 45]" 
                        :key="minute"
                        class="h-10 border border-gray-200 rounded cursor-pointer"
                        :class="{ 'bg-green-500/50': isSlotBooked(day.key, hour, minute) }"
                        @click="toggleSlot(day.key, hour, minute)"
                    >
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

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

const allDays = ref([
    { key: 'monday', name: 'Montag' },
    { key: 'tuesday', name: 'Dienstag' },
    { key: 'wednesday', name: 'Mittwoch' },
    { key: 'thursday', name: 'Donnerstag' },
    { key: 'friday', name: 'Freitag' },
    { key: 'saturday', name: 'Samstag' },
    { key: 'sunday', name: 'Sonntag' }
])

const visibleHours = computed(() => Array.from({ length: 14 }, (_, i) => i + 7))

const isSlotBooked = (dayKey, hour, minute) => {
    const time = hour * 100 + minute;
    const daySlots = availability.value[dayKey] || [];
    return daySlots.some(slot => time >= slot.startTime && time < slot.endTime);
}

const toggleSlot = (dayKey, hour, minute) => {
    const time = hour * 100 + minute;
    const daySlots = availability.value[dayKey] ? [...availability.value[dayKey]] : [];
    const slotIndex = daySlots.findIndex(slot => time >= slot.startTime && time < slot.endTime);

    if (slotIndex !== -1) {
        const existingSlot = daySlots[slotIndex];
        const newSlots = [];
        
        if (existingSlot.startTime < time) {
            newSlots.push({ startTime: existingSlot.startTime, endTime: time });
        }
        
        if (existingSlot.endTime > time + 15) {
            newSlots.push({ startTime: time + 15, endTime: existingSlot.endTime });
        }
        daySlots.splice(slotIndex, 1, ...newSlots);

    } else {
        daySlots.push({ startTime: time, endTime: time + 15 });
    }

    daySlots.sort((a, b) => a.startTime - b.startTime);
    const mergedSlots = daySlots.reduce((acc, current) => {
        if (acc.length === 0) {
            acc.push(current);
        } else {
            const last = acc[acc.length - 1];
            if (current.startTime === last.endTime) {
                last.endTime = current.endTime;
            } else {
                acc.push(current);
            }
        }
        return acc;
    }, []);

    const newAvailability = { ...availability.value, [dayKey]: mergedSlots.filter(s => s.startTime < s.endTime) };
    emit('update:modelValue', newAvailability);
}
</script>

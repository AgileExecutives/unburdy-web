<template>
    <div>
        <div class="flex items-center space-x-2 mb-4">
            <div>Tage / Woche:</div>
            <UButton
                v-for="days in [5, 6, 7]"
                :key="days"
                @click="weekViewMode = days"
                :variant="weekViewMode === days ? 'solid' : 'outline'"
                size="sm"
                :class="[
                    'w-10 h-10 flex items-center justify-center',
                    weekViewMode === days ? 'bg-accent text-white border border-accent hover:bg-accent-hover hover:border-accent-hover' : 'bg-surface border border-accent/50 text-accent hover:bg-accent/10 hover:text-accent hover:border-accent'
                ]"
            >
                <span class="font-bold text-lg">{{ days }}</span>
            </UButton>
            <UButton
                class="ml-4 bg-accent text-white border border-accent hover:bg-accent-hover hover:border-accent-hover w-10 h-10 flex items-center justify-center"
                size="sm"
                @click="copyMondayToWeek"
            >
                <CopyMondayIcon />
            </UButton>
            <UButton
                class="ml-2 bg-transparent text-red-500 border border-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-600 dark:hover:bg-red-900/20 w-10 h-10 flex items-center justify-center"
                size="sm"
                @click="clearAllAvailability"
            >
                <TrashIcon />
            </UButton>
        </div>
        <div v-for="day in visibleDays" :key="day.key" class="mb-6">
            <div class="text-sm font-semibold mb-2">{{ day.name }}</div>
            <div class="grid grid-cols-5 gap-1 text-center text-xs">
                <div class="font-medium text-xs">Stunde</div>
                <div class="font-medium text-xs">:00</div>
                <div class="font-medium text-xs">:15</div>
                <div class="font-medium text-xs">:30</div>
                <div class="font-medium text-xs">:45</div>
            </div>
            <div class="grid grid-cols-1 gap-px">
                <div v-for="hour in visibleHours" :key="hour" class="grid grid-cols-5 gap-px items-center">
                    <div class="text-center text-sm font-medium text-gray-500 pr-2">{{ hour }}:00</div>
                    <div 
                        v-for="minute in [0, 15, 30, 45]" 
                        :key="minute"
                        class="h-8 bg-gray-500/20 cursor-pointer"
                        :class="{ 
                            'bg-green-200 dark:bg-green-700': isSlotBooked(day.key, hour, minute),
                            'bg-blue-100 dark:bg-blue-800/50': isSlotInDragSelection(day.key, hour, minute)
                        }"
                        :data-day="day.key"
                        :data-hour="hour"
                        :data-minute="minute"
                        @click="handleClick(day.key, hour, minute)"
                        @touchstart="handleTouchStart(day.key, hour, minute, $event)"
                        @touchmove="handleTouchMove($event)"
                        @touchend="handleTouchEnd"
                    >
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CalendarWeekIcon from './icons/CalendarWeekIcon.vue'
import CopyMondayIcon from './icons/CopyMondayIcon.vue'
import TrashIcon from './icons/TrashIcon.vue'

const weekViewMode = ref(5)

const visibleDays = computed(() => {
    // 5 = Mon-Fri, 6 = Mon-Sat, 7 = Mon-Sun
    return allDays.value.slice(0, weekViewMode.value)
})

const copyMondayToWeek = () => {
    const mondaySlots = availability.value['monday'] ? JSON.parse(JSON.stringify(availability.value['monday'])) : []
    visibleDays.value.forEach(day => {
        if (day.key !== 'monday') {
            availability.value[day.key] = JSON.parse(JSON.stringify(mondaySlots))
        }
    })
    emit('update:modelValue', { ...availability.value })
}

const clearAllAvailability = () => {
    allDays.value.forEach(day => {
        availability.value[day.key] = []
    })
    emit('update:modelValue', { ...availability.value })
}

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update:modelValue'])

// Drag state for touch interactions
const dragState = ref({
    isDragging: false,
    startDay: null,
    startHour: null,
    startMinute: null,
    endDay: null,
    endHour: null,
    endMinute: null,
    touchStartTime: 0,
    wasDragging: false // Track if we just finished dragging
})

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

const isSlotInDragSelection = (dayKey, hour, minute) => {
    if (!dragState.value.isDragging) return false;
    
    // Only show drag selection on the same day for now (can be extended to cross-day)
    if (dayKey !== dragState.value.startDay || dayKey !== dragState.value.endDay) return false;
    
    const time = hour * 100 + minute;
    const startTime = dragState.value.startHour * 100 + dragState.value.startMinute;
    const endTime = dragState.value.endHour * 100 + dragState.value.endMinute;
    
    const minTime = Math.min(startTime, endTime);
    const maxTime = Math.max(startTime, endTime);
    
    return time >= minTime && time <= maxTime;
}

const handleClick = (dayKey, hour, minute) => {
    // Don't handle click if we just finished dragging
    if (dragState.value.wasDragging) {
        dragState.value.wasDragging = false;
        return;
    }
    
    // Only handle click if it's not part of a drag gesture
    if (!dragState.value.isDragging) {
        toggleSlot(dayKey, hour, minute);
    }
}

const handleTouchStart = (dayKey, hour, minute, event) => {
    dragState.value = {
        isDragging: false,
        startDay: dayKey,
        startHour: hour,
        startMinute: minute,
        endDay: dayKey,
        endHour: hour,
        endMinute: minute,
        touchStartTime: Date.now()
    };
    
    // Prevent default to avoid scrolling during potential drag
    event.preventDefault();
}

const handleTouchMove = (event) => {
    if (!dragState.value.startDay) return;
    
    // Start drag mode after 200ms of touch
    const touchDuration = Date.now() - dragState.value.touchStartTime;
    if (touchDuration > 200) {
        dragState.value.isDragging = true;
    }
    
    if (!dragState.value.isDragging) return;
    
    // Find the element under the touch point
    const touch = event.touches[0];
    const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (elementUnderTouch && elementUnderTouch.dataset) {
        const day = elementUnderTouch.dataset.day;
        const hour = parseInt(elementUnderTouch.dataset.hour);
        const minute = parseInt(elementUnderTouch.dataset.minute);
        
        if (day && !isNaN(hour) && !isNaN(minute)) {
            dragState.value.endDay = day;
            dragState.value.endHour = hour;
            dragState.value.endMinute = minute;
        }
    }
    
    event.preventDefault();
}

const handleTouchEnd = () => {
    const wasDragging = dragState.value.isDragging;
    const touchDuration = Date.now() - dragState.value.touchStartTime;
    // If drag mode, apply drag selection
    if (dragState.value.isDragging && dragState.value.startDay) {
        applyDragSelection();
    } else if (touchDuration <= 200 && dragState.value.startDay) {
        // If short tap, call tap logic
        toggleSlot(dragState.value.startDay, dragState.value.startHour, dragState.value.startMinute);
    }
    // Reset drag state
    dragState.value = {
        isDragging: false,
        startDay: null,
        startHour: null,
        startMinute: null,
        endDay: null,
        endHour: null,
        endMinute: null,
        touchStartTime: 0,
        wasDragging: wasDragging
    };
    // Clear the wasDragging flag after a short delay to allow click prevention
    if (wasDragging) {
        setTimeout(() => {
            dragState.value.wasDragging = false;
        }, 50);
    }
}

const applyDragSelection = () => {
    const { startDay, startHour, startMinute, endHour, endMinute } = dragState.value;
    
    // For now, only handle same-day selections
    if (!startDay || startDay !== dragState.value.endDay) return;
    
    const startTime = startHour * 100 + startMinute;
    const endTime = endHour * 100 + endMinute;
    
    const minTime = Math.min(startTime, endTime);
    const maxTime = Math.max(startTime, endTime);
    
    // Create new time slot for the dragged selection
    const daySlots = availability.value[startDay] ? [...availability.value[startDay]] : [];
    daySlots.push({ startTime: minTime, endTime: maxTime + 15 }); // +15 to include the end quarter
    
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
    
    const newAvailability = { ...availability.value, [startDay]: mergedSlots.filter(s => s.startTime < s.endTime) };
    emit('update:modelValue', newAvailability);
}

const toggleSlot = (dayKey, hour, minute) => {
    const time = hour * 100 + minute;
    const daySlots = availability.value[dayKey] ? [...availability.value[dayKey]] : [];
    
    // Check if this specific quarter is booked
    const isCurrentSlotBooked = isSlotBooked(dayKey, hour, minute);
    
    // Check if the entire hour is booked (all 4 quarters)
    const hourStart = hour * 100;
    const hourEnd = hour * 100 + 45;
    const isEntireHourBooked = [0, 15, 30, 45].every(min => 
        isSlotBooked(dayKey, hour, min)
    );
    
    // Check if any quarter of this hour is booked
    const isAnyQuarterBooked = [0, 15, 30, 45].some(min => 
        isSlotBooked(dayKey, hour, min)
    );
    
    if (!isAnyQuarterBooked) {
        // No quarters booked - select entire hour (all 4 quarters)
        daySlots.push({ startTime: hourStart, endTime: hourStart + 60 });
    } else if (isEntireHourBooked && isCurrentSlotBooked) {
        // Entire hour is booked and we clicked a specific quarter - deselect only that quarter
        const slotIndex = daySlots.findIndex(slot => time >= slot.startTime && time < slot.endTime);
        
        if (slotIndex !== -1) {
            const existingSlot = daySlots[slotIndex];
            const newSlots = [];
            
            // Split the slot, excluding the clicked quarter
            if (existingSlot.startTime < time) {
                newSlots.push({ startTime: existingSlot.startTime, endTime: time });
            }
            
            if (existingSlot.endTime > time + 15) {
                newSlots.push({ startTime: time + 15, endTime: existingSlot.endTime });
            }
            
            daySlots.splice(slotIndex, 1, ...newSlots);
        }
    } else if (isCurrentSlotBooked) {
        // This quarter is booked but not the entire hour - deselect this quarter
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
        }
    } else {
        // This quarter is not booked - select just this quarter
        daySlots.push({ startTime: time, endTime: time + 15 });
    }

    // Sort and merge overlapping intervals
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

<template>
    <div class="relative">
        <!-- Header with Label and Button -->
        <div class="flex items-center justify-between mb-2">
            <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ label }}
            </label>
            
            <!-- Toggle Button (on same level as label) -->
            <button
                @click="toggleSelector($event)"
                :data-toggle-button="selectorId"
                :class="[
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all',
                    showSelector 
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 focus:ring-red-500' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-accent'
                ]"
                type="button"
            >
                <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path v-if="showSelector" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </div>
        
        <!-- Tags Container with Flexible Height (min 3 rows, grows as needed) -->
        <div class="relative">
            <!-- Selected Tags Container (Flexible Height) -->
            <div class="min-h-[4.5rem] bg-surface rounded-md border-0 border-gray-300 dark:border-gray-600 shadow-sm">
                <div class="flex flex-wrap gap-1.5 p-3" :data-tag-selector-container="selectorId">
                    <!-- Selected Tags -->
                    <span 
                        v-for="itemKey in selectedItems" 
                        :key="`selected-${itemKey}`"
                        :class="getSelectedTagClasses()"
                    >
                        {{ getItemLabel(itemKey) }}
                        <button
                            @click="removeItem(itemKey)"
                            class="ml-1.5 text-current hover:text-opacity-70 focus:outline-none"
                            type="button"
                        >
                            <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </span>
                </div>
            </div>
            
            <!-- Available Options Overlay -->
            <div 
                v-if="showSelector"
                class="absolute top-0 left-0 right-0 z-50 bg-surface-secondary rounded-lg border border-gray-200/20 shadow-lg min-h-[10.5rem] max-h-48 overflow-y-auto"
                :data-tag-selector-container="selectorId"
            >
                <div class="p-3 flex flex-wrap gap-1.5">
                    <!-- Selected Tags (visible on overlay) -->
                    <span 
                        v-for="itemKey in selectedItems" 
                        :key="`overlay-selected-${itemKey}`"
                        :class="getSelectedTagClasses()"
                    >
                        {{ getItemLabel(itemKey) }}
                        <button
                            @click="removeItem(itemKey)"
                            class="ml-1.5 text-current hover:text-opacity-70 focus:outline-none"
                            type="button"
                        >
                            <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </span>
                    
                    <!-- Available Items -->
                    <!-- Handle if items is an object -->
                    <template v-if="items && typeof items === 'object' && !Array.isArray(items)">
                        <button
                            v-for="(label, key) in items"
                            :key="`available-${key}`"
                            @click="selectItem(key)"
                            v-show="!selectedItems.includes(key)"
                            :class="getAvailableTagClasses()"
                            type="button"
                        >
                            {{ label }}
                        </button>
                    </template>
                    
                    <!-- Handle if items is an array -->
                    <template v-else-if="items && Array.isArray(items)">
                        <button
                            v-for="key in items"
                            :key="`available-${key}`"
                            @click="selectItem(key)"
                            v-show="!selectedItems.includes(key)"
                            :class="getAvailableTagClasses()"
                            type="button"
                        >
                            {{ key }}
                        </button>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
    label: {
        type: String,
        default: ''
    },
    items: {
        type: [Object, Array],
        default: () => ({})
    },
    selectedItems: {
        type: Array,
        default: () => []
    },
    selectorId: {
        type: String,
        default: 'default'
    },
    colorScheme: {
        type: String,
        default: 'blue', // blue, green, purple, etc.
        validator: (value) => ['blue', 'green', 'purple', 'orange', 'pink', 'indigo'].includes(value)
    }
})

// Emits
const emit = defineEmits(['update:selectedItems'])

// State
const showSelector = ref(false)

// Color scheme mappings
const colorSchemes = {
    blue: {
        selected: 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 bg-opacity-80',
        available: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 bg-opacity-60 hover:bg-gray-200 dark:hover:bg-gray-600 hover:bg-opacity-80'
    },
    green: {
        selected: 'bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-200 bg-opacity-80',
        available: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 bg-opacity-60 hover:bg-gray-200 dark:hover:bg-gray-600 hover:bg-opacity-80'
    },
    purple: {
        selected: 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 bg-opacity-80',
        available: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 bg-opacity-60 hover:bg-gray-200 dark:hover:bg-gray-600 hover:bg-opacity-80'
    },
    orange: {
        selected: 'bg-orange-100 dark:bg-orange-900/60 text-orange-800 dark:text-orange-200 bg-opacity-80',
        available: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 bg-opacity-60 hover:bg-gray-200 dark:hover:bg-gray-600 hover:bg-opacity-80'
    },
    pink: {
        selected: 'bg-pink-100 dark:bg-pink-900/60 text-pink-800 dark:text-pink-200 bg-opacity-80',
        available: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 bg-opacity-60 hover:bg-gray-200 dark:hover:bg-gray-600 hover:bg-opacity-80'
    },
    indigo: {
        selected: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 bg-opacity-80',
        available: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 bg-opacity-60 hover:bg-gray-200 dark:hover:bg-gray-600 hover:bg-opacity-80'
    }
}

// Methods
const getSelectedTagClasses = () => {
    const scheme = colorSchemes[props.colorScheme] || colorSchemes.blue
    return `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${scheme.selected}`
}

const getAvailableTagClasses = () => {
    const scheme = colorSchemes[props.colorScheme] || colorSchemes.blue
    return `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${scheme.available} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all`
}

const getItemLabel = (itemKey) => {
    if (props.items && typeof props.items === 'object' && !Array.isArray(props.items)) {
        return props.items[itemKey] || itemKey
    }
    return itemKey
}

const selectItem = (itemKey) => {
    if (!props.selectedItems.includes(itemKey)) {
        const newSelected = [...props.selectedItems, itemKey]
        emit('update:selectedItems', newSelected)
    }
    // Keep the selector open - don't close it
}

const removeItem = (itemKey) => {
    const index = props.selectedItems.indexOf(itemKey)
    if (index > -1) {
        const newSelected = [...props.selectedItems]
        newSelected.splice(index, 1)
        emit('update:selectedItems', newSelected)
    }
}

const toggleSelector = (event) => {
    
    // Stop the event from bubbling up to prevent immediate close
    if (event) {
        event.stopPropagation()
    }
    
    showSelector.value = !showSelector.value
}

// Handle click outside to close selector
const handleClickOutside = (event) => {
    if (showSelector.value) {
        // Check if the click is within this specific selector container OR the toggle button
        const container = event.target.closest(`[data-tag-selector-container="${props.selectorId}"]`)
        const toggleButton = event.target.closest(`[data-toggle-button="${props.selectorId}"]`)
        
        if (!container && !toggleButton) {
            showSelector.value = false
        }
    }
}

// Handle keyboard events
const handleKeydown = (event) => {
    if (event.key === 'Escape' && showSelector.value) {
        showSelector.value = false
    }
}

// Lifecycle
onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeydown)
})
</script>

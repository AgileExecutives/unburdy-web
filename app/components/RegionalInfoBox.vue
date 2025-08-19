<template>
    <div class="h-20 lg:col-span-3">
    <div v-if="holidays || nearbyProviders"
        class="backdrop-blur-sm">
        <div class="relative">
            <!-- Subtle decorative background elements -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200/20 to-blue-200/20 rounded-full blur-2xl"></div>

            <!-- Content -->
            <div class="relative z-10">
                <div class="flex justify-between mb-3 items-center place-content-center">
                    <div class="flex items-center justify-center w-8 h-8 bg-blue-500/10 rounded-lg mr-3">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                            </path>
                        </svg>
                    </div>
                    <span class="text-gray-400 w-full font-semibold place-self-left place-content-start text-base">Wir haben die Feiertage für dein Bundesland
                        importiert.</span>
                    <a href="#"
                        class="ml-3 px-3 py-1 text-xs text-blue-800 dark:text-blue-200 font-medium bg-blue-100/80 dark:bg-blue-900/60 hover:bg-blue-200/80 dark:hover:bg-blue-900/80 rounded-full transition-colors"
                        @click.prevent="openHolidaysModal">mehr&nbsp;anzeigen</a>
                </div>

                <div v-if="nearbyProviders && nearbyProviders.length > 0" class="flex justify-between items-center place-content-center">
                    <div class="flex items-center justify-center w-8 h-8 bg-purple-500/10 rounded-lg mr-3">
                        <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z">
                            </path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                    </div>
                    <span class="text-gray-400 w-full font-medium text-base">Zudem haben wir auch die Jugendämter deiner Region
                        herausgesucht</span>
                    <a href="#"
                        class="ml-3 px-3 py-1 text-xs text-purple-800 dark:text-purple-200 font-medium bg-purple-100/80 dark:bg-purple-900/60 hover:bg-purple-200/80 dark:hover:bg-purple-900/80 rounded-full transition-colors"
                        @click.prevent="openProvidersModal">mehr&nbsp;anzeigen</a>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>

<script setup>
const props = defineProps({
    holidays: {
        type: Object,
        default: () => null
    },
    nearbyProviders: {
        type: Array,
        default: () => []
    },
    bundeslandName: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['openHolidays', 'openProviders'])

const openHolidaysModal = () => {
    emit('openHolidays')
}

const openProvidersModal = () => {
    emit('openProviders')
}
</script>

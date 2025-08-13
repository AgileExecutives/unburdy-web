<template>
      <!-- Full-width CTA Band -->
      <div class="bg-accent py-16">
        <div class="mx-auto max-w-4xl px-6 lg:px-8 text-center">
<slot/>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <NuxtLink 
              :to="to" 
              class="inline-flex items-center rounded-md bg-white px-8 py-4 text-lg font-semibold text-accent shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors duration-200"
            >
              <Icon name="lucide:rocket" class="w-5 h-5 mr-3" />
             {{ text }}
            </NuxtLink>
             </div>
        </div>
      </div>
</template>
<script lang="ts" setup>
import { defineProps } from 'vue'

const props = defineProps({
  to: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
})
</script>

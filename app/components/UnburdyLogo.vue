<template>
  <div class="flex items-center">
    <!-- Light Mode Logo -->
    <img 
      src="/assets/logo.svg" 
      alt="Unburdy" 
      :class="[
        'block dark:hidden w-auto',
        size === 'sm' && 'h-6',
        size === 'md' && 'h-8', 
        size === 'lg' && 'h-12',
        size === 'xl' && 'h-16'
      ]"
    />
    <!-- Dark Mode Logo -->
    <img 
      src="/assets/logo-dark.svg" 
      alt="Unburdy" 
      :class="[
        'hidden dark:block w-auto',
        size === 'sm' && 'h-6',
        size === 'md' && 'h-8', 
        size === 'lg' && 'h-12',
        size === 'xl' && 'h-16'
      ]"
    />
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  }
})
</script>

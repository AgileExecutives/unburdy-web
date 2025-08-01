<template>
  <input
    v-bind="$attrs"
    :class="[
      'w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200',
      $attrs.class
    ]"
  >
</template>

<script setup>
// Alle Attribute von input durchleiten
defineOptions({
  inheritAttrs: false
})
</script>

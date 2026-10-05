<script setup lang="ts">
const { name, size = 36 } = defineProps<{ name: string; size?: number }>()
</script>

<template>
  <span
    :style="{ width: size + 'px', height: size + 'px', fontSize: Math.round(size * 0.39) + 'px' }"
    style="border-radius: 50%; background: var(--color-accent-2-200); color: var(--color-accent-2-800); display: grid; place-items: center; font-weight: 600; flex: none"
  >{{ name.charAt(0).toUpperCase() }}</span>
</template>

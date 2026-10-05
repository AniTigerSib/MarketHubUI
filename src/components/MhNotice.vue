<script setup lang="ts">
withDefaults(defineProps<{ icon?: string; tone?: 'success' | 'info' }>(), { tone: 'success' })
</script>

<template>
  <div class="notice" :class="tone">
    <i v-if="icon" :class="icon" style="font-size: 20px; flex: none"></i>
    <slot />
  </div>
</template>

<style scoped>
.notice { display: flex; gap: 10px; padding: 12px 14px; border-radius: var(--radius-md); font-size: 13px; line-height: 1.45; }
.notice.success { background: var(--color-accent-2-100); color: var(--color-accent-2-800); }
.notice.info { background: var(--color-accent-100); color: var(--color-accent-800); }
</style>

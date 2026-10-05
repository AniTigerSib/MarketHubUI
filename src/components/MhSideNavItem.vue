<script setup lang="ts">
defineProps<{ icon: string; label: string; count?: string | number; active?: boolean }>()
const emit = defineEmits<{ click: [] }>()
</script>

<template>
  <button @click="emit('click')" class="nav-btn" :class="{ active }">
    <i :class="icon" style="font-size: 19px"></i>
    <span style="flex: 1">{{ label }}</span>
    <span v-if="count !== undefined && count !== ''" class="count">{{ count }}</span>
  </button>
</template>

<style scoped>
.nav-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 0;
  border-radius: var(--radius-md);
  padding: 9px 12px;
  font: inherit;
  font-size: 14px;
  cursor: pointer;
  text-align: left;
  width: 100%;
  background: transparent;
  color: var(--color-text);
}
.nav-btn:hover { background: var(--color-surface); }
.nav-btn.active { background: var(--color-accent-100); color: var(--color-accent-800); }
.count { font-size: 12px; color: var(--color-neutral-600); }
.nav-btn.active .count { color: var(--color-accent-800); }
</style>

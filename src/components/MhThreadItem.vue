<script setup lang="ts">
defineProps<{ id: number; who: string; title: string; last: string; unread: number; hasUnread: boolean; active: boolean }>()
const emit = defineEmits<{ select: [] }>()
</script>

<template>
  <button @click="emit('select')" class="thread-row" :class="{ active }">
    <span class="thumb"></span>
    <span style="display: flex; flex-direction: column; min-width: 0">
      <span style="font-weight: 600; font-size: 14px">{{ who }}</span>
      <span style="font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{ title }}</span>
      <span class="text-muted" style="font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{ last }}</span>
    </span>
    <span v-if="hasUnread" class="badge">{{ unread }}</span>
  </button>
</template>

<style scoped>
.thread-row {
  width: 100%;
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  padding: 12px;
  border: 0;
  border-bottom: 1px solid var(--color-divider);
  background: transparent;
  font: inherit;
  color: inherit;
  cursor: pointer;
  text-align: left;
}
.thread-row:hover { background: var(--color-surface); }
.thread-row.active { background: var(--color-accent-100); }
.thumb {
  width: 48px;
  height: 48px;
  flex: none;
  border-radius: var(--radius-md);
  background: repeating-linear-gradient(135deg, var(--color-neutral-200) 0 5px, var(--color-neutral-100) 5px 10px);
}
.badge {
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  background: var(--color-accent-2-500);
  color: var(--color-bg);
  font-size: 11px;
  font-weight: 600;
  display: grid;
  place-items: center;
}
</style>

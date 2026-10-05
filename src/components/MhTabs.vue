<script setup lang="ts">
defineProps<{ tabs: { id: string; label: string; count?: number | string }[] }>()
const model = defineModel<string>()
</script>

<template>
  <div style="display: flex; gap: 24px; border-bottom: 1px solid var(--color-divider)">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="model = tab.id"
      class="tab-btn"
      :style="tab.id === model
        ? { borderBottom: '2px solid var(--color-accent)', marginBottom: '-1px', color: 'var(--color-text)', fontWeight: '500' }
        : { color: 'var(--color-neutral-600)' }"
    >
      {{ tab.label }}
      <span
        v-if="tab.count !== undefined && tab.count !== ''"
        style="font-size: 12px; padding: 1px 7px; border-radius: 10px; background: var(--color-surface)"
      >{{ tab.count }}</span>
    </button>
  </div>
</template>

<style scoped>
.tab-btn {
  background: none;
  border: 0;
  margin-bottom: -1px;
  padding: 0 0 10px;
  font: inherit;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  gap: 6px;
  align-items: center;
}
</style>

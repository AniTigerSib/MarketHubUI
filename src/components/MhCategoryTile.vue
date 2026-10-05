<script setup lang="ts">
defineProps<{ icon: string; name: string; count: string }>()
const emit = defineEmits<{ click: [] }>()
</script>

<template>
  <button @click="emit('click')" class="cat-tile">
    <span class="cat-icon">
      <i :class="icon" style="font-size: 20px; line-height: 1"></i>
    </span>
    <span style="display: flex; flex-direction: column; gap: 2px">
      <span style="font-family: var(--font-heading); font-weight: 600; font-size: 17px; line-height: 1.2">{{ name }}</span>
      <span class="text-muted" style="font-size: 12px">{{ count }}</span>
    </span>
  </button>
</template>

<style scoped>
.cat-tile {
  text-align: left;
  background: var(--color-surface);
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  padding: 16px 18px 18px;
  cursor: pointer;
  color: inherit;
  font: inherit;
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-height: 112px;
  box-sizing: border-box;
}
.cat-tile:hover { background: var(--color-accent-100); border-color: var(--color-accent-300); }
.cat-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--color-bg);
  display: grid;
  place-items: center;
  color: var(--color-accent-700);
}
</style>

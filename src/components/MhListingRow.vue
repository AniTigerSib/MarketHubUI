<script setup lang="ts">
defineProps<{
  id: number
  title: string
  price: string
  desc: string
  meta: string
  photo: string
  cond: string
  condClass: string
  seller: string
  fav: boolean
  favColor: string
}>()
const emit = defineEmits<{ open: []; toggleFav: [] }>()
</script>

<template>
  <article @click="emit('open')" class="result-row">
    <div class="photo-ph" style="border-radius: var(--radius-md); aspect-ratio: 4/3; width: 240px; flex: none">{{ photo }}</div>
    <div style="display: flex; flex-direction: column; gap: 6px; min-width: 0; flex: 1">
      <div style="font-family: var(--font-heading); font-weight: 600; font-size: 19px; line-height: 1.2">{{ title }}</div>
      <div style="font-family: var(--font-heading); font-weight: 600; font-size: 22px">{{ price }}</div>
      <p style="margin: 0; font-size: 14px; color: color-mix(in srgb, var(--color-text) 75%, transparent); max-width: 60ch">{{ desc }}</p>
      <div style="display: flex; gap: 6px; margin-top: 4px">
        <span :class="'tag ' + condClass">{{ cond }}</span>
        <span class="tag tag-neutral">{{ seller }}</span>
      </div>
      <div class="text-muted" style="font-size: 12px; margin-top: auto">{{ meta }}</div>
    </div>
    <button class="btn btn-icon btn-secondary" @click.stop="emit('toggleFav')" :style="{ color: favColor }">
      <i :class="fav ? 'ph-fill ph-heart' : 'ph ph-heart'" style="font-size: 20px; line-height: 1"></i>
    </button>
  </article>
</template>

<style scoped>
.result-row {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr) auto;
  gap: 24px;
  padding: 20px 12px;
  margin: 0 -12px;
  border-bottom: 1px solid var(--color-divider);
  border-radius: var(--radius-md);
  cursor: pointer;
  align-items: start;
}
.result-row:hover { background: var(--color-surface); }
</style>

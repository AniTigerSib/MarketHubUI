<script setup lang="ts">
defineProps<{ id: number; title: string; price: string; meta: string; photo: string; fav: boolean }>()
const emit = defineEmits<{ open: []; toggleFav: [] }>()
</script>

<template>
  <article @click="emit('open')" class="listing-card">
    <div style="position: relative">
      <div class="photo-ph" style="border-radius: var(--radius-md); aspect-ratio: 4/3">{{ photo }}</div>
      <button class="btn btn-icon fav-btn" @click.stop="emit('toggleFav')" :style="{ color: fav ? 'var(--color-accent)' : 'inherit' }">
        <i :class="fav ? 'ph-fill ph-heart' : 'ph ph-heart'" style="font-size: 19px"></i>
      </button>
    </div>
    <div style="font-weight: 600; font-size: 18px; line-height: 1.2">{{ price }}</div>
    <div class="listing-title">{{ title }}</div>
    <div class="text-muted" style="font-size: 12px">{{ meta }}</div>
  </article>
</template>

<style scoped>
.listing-card { display: flex; flex-direction: column; gap: 8px; cursor: pointer; }
.listing-card:hover .listing-title { color: var(--color-accent-700); }
.listing-title {
  font-size: 14px;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}
.fav-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--color-bg);
  box-shadow: var(--shadow-sm);
}
</style>

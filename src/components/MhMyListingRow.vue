<script setup lang="ts">
defineProps<{
  id: number
  title: string
  price: string
  photo: string
  statusClass: string
  statusLabel: string
  isActive: boolean
  isReview: boolean
  isRejected: boolean
  reason: string
  views: number
  favs: number
  chats: number
  editLabel: string
  markSoldLabel: string
  fixLabel: string
  reviewEta: string
  reasonL: string
}>()
const emit = defineEmits<{ open: []; edit: []; markSold: []; fix: [] }>()
</script>

<template>
  <article style="display: grid; grid-template-columns: 150px minmax(0, 1fr) auto; gap: 20px; padding: 16px; border-radius: var(--radius-lg); border: 1px solid var(--color-divider); align-items: start">
    <button @click="emit('open')" class="photo-btn">{{ photo }}</button>

    <div style="display: flex; flex-direction: column; gap: 6px; min-width: 0">
      <div style="display: flex; gap: 10px; align-items: center">
        <span style="font-weight: 600; font-size: 17px">{{ title }}</span>
        <span :class="'tag ' + statusClass">{{ statusLabel }}</span>
      </div>
      <div style="font-weight: 600; font-size: 18px">{{ price }}</div>
      <div v-if="isRejected && reason" style="display: flex; gap: 8px; padding: 10px 12px; border-radius: var(--radius-md); background: var(--color-surface); font-size: 13px; max-width: 560px">
        <i class="ph ph-warning-circle" style="font-size: 18px; flex: none; color: var(--color-accent-700)"></i>
        <span><b style="font-weight: 600">{{ reasonL }}:</b> {{ reason }}</span>
      </div>
      <div v-if="isReview" style="display: flex; gap: 6px; align-items: center; font-size: 13px; color: var(--color-accent-700)">
        <i class="ph ph-hourglass-medium" style="font-size: 16px"></i>{{ reviewEta }}
      </div>
      <div class="text-muted" style="display: flex; gap: 16px; font-size: 13px">
        <span style="display: flex; gap: 4px; align-items: center"><i class="ph ph-eye" style="font-size: 15px"></i>{{ views }}</span>
        <span style="display: flex; gap: 4px; align-items: center"><i class="ph ph-heart" style="font-size: 15px"></i>{{ favs }}</span>
        <span style="display: flex; gap: 4px; align-items: center"><i class="ph ph-chat-circle" style="font-size: 15px"></i>{{ chats }}</span>
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 6px; min-width: 170px">
      <template v-if="isActive">
        <button class="btn btn-secondary" @click="emit('edit')" style="justify-content: flex-start">
          <i class="ph ph-pencil-simple" style="font-size: 16px"></i>{{ editLabel }}
        </button>
        <button class="btn btn-secondary" @click="emit('markSold')" style="justify-content: flex-start">
          <i class="ph ph-check-circle" style="font-size: 16px; color: var(--color-accent-2-600)"></i>{{ markSoldLabel }}
        </button>
      </template>
      <template v-if="isRejected">
        <button class="btn btn-primary" @click="emit('fix')" style="justify-content: flex-start">
          <i class="ph ph-arrow-clockwise" style="font-size: 16px"></i>{{ fixLabel }}
        </button>
      </template>
    </div>
  </article>
</template>

<style scoped>
.photo-btn {
  border: 0;
  padding: 8px;
  cursor: pointer;
  border-radius: var(--radius-md);
  aspect-ratio: 4/3;
  display: flex;
  align-items: flex-end;
  font: 10px ui-monospace, Menlo, monospace;
  color: var(--color-neutral-700);
  background: repeating-linear-gradient(135deg, var(--color-neutral-200) 0 7px, var(--color-neutral-100) 7px 14px);
}
</style>

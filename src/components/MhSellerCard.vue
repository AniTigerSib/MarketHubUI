<script setup lang="ts">
defineProps<{ name: string; rating: string; since: string; replies: string; verified: string }>()
</script>

<template>
  <div class="card" style="padding: 16px 20px; gap: 10px; border-radius: var(--radius-lg)">
    <div style="display: flex; align-items: center; gap: 12px">
      <span style="width: 44px; height: 44px; border-radius: 50%; background: var(--color-accent-2-200); color: var(--color-accent-2-800); display: grid; place-items: center; font-weight: 600; font-size: 17px; flex: none">
        {{ name.charAt(0).toUpperCase() }}
      </span>
      <div style="display: flex; flex-direction: column">
        <span style="font-weight: 600; font-size: 15px">{{ name }}</span>
        <span style="font-size: 13px; display: flex; align-items: center; gap: 4px">
          <i class="ph-fill ph-star" style="color: var(--color-accent-500); font-size: 14px"></i>{{ rating }}
        </span>
      </div>
    </div>
    <div class="text-muted" style="font-size: 13px; display: flex; flex-direction: column; gap: 2px">
      <span>{{ since }}</span>
      <span>{{ replies }}</span>
    </div>
    <span class="tag tag-accent-2" style="align-self: flex-start; gap: 4px">
      <i class="ph ph-seal-check" style="font-size: 13px"></i>{{ verified }}
    </span>
  </div>
</template>

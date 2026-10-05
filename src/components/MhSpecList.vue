<script setup lang="ts">
defineProps<{ items: { k?: string; v?: string }[] }>()
</script>

<template>
  <div style="display: grid; grid-template-columns: 180px minmax(0, 1fr); gap: 10px 16px; font-size: 14px; max-width: 560px">
    <template v-for="a in items" :key="a.k">
      <span class="text-muted">{{ a.k }}</span>
      <span>{{ a.v }}</span>
    </template>
  </div>
</template>

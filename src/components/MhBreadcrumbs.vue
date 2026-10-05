<script setup lang="ts">
defineProps<{ items: { label: string; onClick?: () => void }[] }>()
</script>

<template>
  <nav style="display: flex; gap: 8px; font-size: 12px" class="text-muted">
    <template v-for="(item, i) in items" :key="i">
      <button v-if="item.onClick" @click="item.onClick()" class="crumb-btn">{{ item.label }}</button>
      <span v-else>{{ item.label }}</span>
      <span v-if="i < items.length - 1">/</span>
    </template>
  </nav>
</template>

<style scoped>
.crumb-btn {
  background: none;
  border: 0;
  padding: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ label: string; count?: number }>()
const index = defineModel<number>({ default: 0 })
const n = computed(() => props.count ?? 6)

function prev() { index.value = (index.value + n.value - 1) % n.value }
function next() { index.value = (index.value + 1) % n.value }
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 10px">
    <div class="photo-ph" style="position: relative; border-radius: var(--radius-lg); aspect-ratio: 4/3">
      {{ label }} · {{ index + 1 }} / {{ n }}
      <button class="btn btn-icon" @click="prev" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); border-radius: 50%; background: var(--color-bg); box-shadow: var(--shadow-md)">
        <i class="ph ph-caret-left" style="font-size: 18px"></i>
      </button>
      <button class="btn btn-icon" @click="next" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); border-radius: 50%; background: var(--color-bg); box-shadow: var(--shadow-md)">
        <i class="ph ph-caret-right" style="font-size: 18px"></i>
      </button>
    </div>
    <div style="display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px">
      <button
        v-for="i in n"
        :key="i"
        @click="index = i - 1"
        :style="{
          border: '2px solid ' + (i - 1 === index ? 'var(--color-accent)' : 'transparent'),
          background: 'repeating-linear-gradient(135deg, var(--color-neutral-200) 0 6px, var(--color-neutral-100) 6px 12px)',
        }"
        style="aspect-ratio: 4/3; border-radius: var(--radius-md); cursor: pointer; font: 10px ui-monospace, Menlo, monospace; color: var(--color-neutral-700)"
      >{{ i }}</button>
    </div>
  </div>
</template>

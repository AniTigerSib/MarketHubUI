<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { categories, cities, subcategories, fmtPrice, i18n } from '@/data'
import MhNotice from '@/components/MhNotice.vue'

const store = useAppStore()
const router = useRouter()
const t = computed(() => i18n[store.lang])
const cityName = (id: string) => (cities.find((c) => c.id === id) || {})[store.lang] || ''

const f = computed(() => store.form)
const fSubs = computed(() => subcategories[f.value.cat] || [])

const checks = computed(() => {
  const form = f.value
  const subs = fSubs.value
  return [
    [!!form.cat && (!subs.length || !!form.sub), t.value.ckCat],
    [form.title.trim().length >= 5, t.value.ckTitle],
    [form.photos > 0, t.value.ckPhoto],
    [form.desc.trim().length >= 30, t.value.ckDesc],
    [+form.price > 0, t.value.ckPrice],
  ] as [boolean, string][]
})

const allOk = computed(() => checks.value.every((c) => c[0]))

const condOpts = computed(() =>
  ['used', 'new'].map((c) => ({
    val: c,
    label: t.value[c],
    on: f.value.cond === c,
  })),
)

const photos = computed(() =>
  Array.from({ length: f.value.photos }, (_, i) => ({
    label: i === 0 ? 'cover' : 'photo ' + (i + 1),
    index: i,
  })),
)

const contactBoxes = computed(() =>
  [
    { key: 'viaMsg' as const, label: t.value.viaMsg, on: f.value.viaMsg },
    { key: 'viaPhone' as const, label: t.value.viaPhone, on: f.value.viaPhone },
  ].map((b) => ({
    ...b,
    bg: b.on ? 'var(--color-accent)' : 'transparent',
    border: b.on ? 'var(--color-accent)' : 'var(--color-divider)',
  })),
)

function setForm(patch: Partial<typeof f.value>) {
  store.form = { ...store.form, ...patch }
}

function onSubmit(e: Event) {
  e.preventDefault()
  if (!allOk.value) return
  store.submitListing()
  router.push({ name: 'account' })
}

function onDraft() {
  store.showToast(t.value.draftSaved ?? '')
}
</script>

<template>
  <main
    style="
      flex: 1;
      max-width: 1280px;
      width: 100%;
      margin: 0 auto;
      padding: 24px 32px 56px;
      box-sizing: border-box;
      display: grid;
      grid-template-columns: minmax(0, 1fr) 320px;
      gap: 48px;
      align-items: start;
    "
  >
    <!-- Form -->
    <form
      @submit="onSubmit"
      style="display: flex; flex-direction: column; gap: 24px; max-width: 680px"
    >
      <h1 style="margin: 0; font-size: 32px">{{ t.newListing }}</h1>

      <!-- Category -->
      <div class="field">
        <label>{{ t.category }} *</label>
        <select
          class="input"
          :value="f.cat"
          @change="(e) => setForm({ cat: (e.target as HTMLSelectElement).value, sub: '' })"
          style="min-height: 42px"
        >
          <option value="">{{ t.chooseCat }}</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c[store.lang] }}</option>
        </select>
      </div>

      <!-- Subcategory chips -->
      <div v-if="fSubs.length" class="field">
        <label>{{ t.subcategory }} *</label>
        <div style="display: flex; flex-wrap: wrap; gap: 8px">
          <button
            v-for="o in fSubs"
            :key="o.id"
            type="button"
            @click="setForm({ sub: o.id })"
            class="btn"
            style="padding: 7px 14px; font-size: 13px; border-radius: 999px"
            :style="{
              background: f.sub === o.id ? 'var(--color-accent-100)' : 'transparent',
              color: f.sub === o.id ? 'var(--color-accent-800)' : 'var(--color-text)',
              borderColor: f.sub === o.id ? 'var(--color-accent-400)' : 'var(--color-divider)',
            }"
          >
            {{ o[store.lang] }}
          </button>
        </div>
      </div>

      <!-- Title -->
      <div class="field">
        <label>{{ t.title }} *</label>
        <input
          class="input"
          :value="f.title"
          @input="(e) => setForm({ title: (e.target as HTMLInputElement).value })"
          maxlength="70"
          :placeholder="t.titlePh"
          style="min-height: 42px"
        />
        <div class="text-muted" style="font-size: 12px; margin-top: 4px; text-align: right">
          {{ f.title.length }} / 70
        </div>
      </div>

      <!-- Photos -->
      <div style="display: flex; flex-direction: column; gap: 8px">
        <div style="font-size: 12px; color: color-mix(in srgb, var(--color-text) 70%, transparent)">
          {{ t.photos }} · <span class="text-muted">{{ t.photosHint }}</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 10px">
          <div
            v-for="p in photos"
            :key="p.index"
            style="
              position: relative;
              aspect-ratio: 1/1;
              border-radius: var(--radius-md);
              display: flex;
              align-items: flex-end;
              padding: 6px;
              font:
                10px ui-monospace,
                Menlo,
                monospace;
              color: var(--color-neutral-700);
              background: repeating-linear-gradient(
                135deg,
                var(--color-neutral-200) 0 7px,
                var(--color-neutral-100) 7px 14px
              );
            "
          >
            {{ p.label }}
            <button
              type="button"
              class="btn btn-icon"
              @click="setForm({ photos: Math.max(0, f.photos - 1) })"
              style="
                position: absolute;
                top: 4px;
                right: 4px;
                width: 26px;
                height: 26px;
                border-radius: 50%;
                background: var(--color-bg);
                box-shadow: var(--shadow-sm);
              "
            >
              <i class="ph ph-x" style="font-size: 13px"></i>
            </button>
          </div>
          <button
            v-if="f.photos < 10"
            type="button"
            @click="setForm({ photos: Math.min(10, f.photos + 1) })"
            class="add-photo-btn"
          >
            <i class="ph ph-camera-plus" style="font-size: 24px"></i>{{ t.addPhoto }}
          </button>
        </div>
      </div>

      <!-- Description -->
      <div class="field">
        <label>{{ t.description }} *</label>
        <textarea
          class="input"
          :value="f.desc"
          @input="(e) => setForm({ desc: (e.target as HTMLTextAreaElement).value })"
          :placeholder="t.descPh"
          style="min-height: 120px"
        ></textarea>
        <div class="text-muted" style="font-size: 12px; margin-top: 4px">
          {{ f.desc.trim().length }} · {{ t.descMin }}
        </div>
      </div>

      <!-- Condition / Price / City -->
      <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px">
        <div class="field">
          <label>{{ t.condition }}</label>
          <div class="seg" style="display: flex">
            <label
              v-for="o in condOpts"
              :key="o.val"
              class="seg-opt"
              style="flex: 1; min-height: 40px"
            >
              <input
                type="radio"
                name="pcond"
                :checked="o.on"
                @change="setForm({ cond: o.val as 'new' | 'used' })"
              />{{ o.label }}
            </label>
          </div>
        </div>
        <div class="field">
          <label>{{ t.price }} *</label>
          <input
            class="input"
            inputmode="numeric"
            :value="f.price"
            @input="
              (e) => setForm({ price: (e.target as HTMLInputElement).value.replace(/\D/g, '') })
            "
            placeholder="0"
            style="min-height: 42px"
          />
        </div>
        <div class="field">
          <label>{{ t.city }}</label>
          <select
            class="input"
            :value="f.city"
            @change="(e) => setForm({ city: (e.target as HTMLSelectElement).value })"
            style="min-height: 42px"
          >
            <option v-for="c in cities" :key="c.id" :value="c.id">{{ c[store.lang] }}</option>
          </select>
        </div>
      </div>

      <!-- Contact method -->
      <div style="display: flex; flex-direction: column; gap: 10px">
        <div style="font-size: 12px; color: color-mix(in srgb, var(--color-text) 70%, transparent)">
          {{ t.contactWay }}
        </div>
        <div style="display: flex; gap: 24px">
          <button
            v-for="b in contactBoxes"
            :key="b.key"
            type="button"
            @click="setForm({ [b.key]: !f[b.key] })"
            style="
              display: flex;
              align-items: center;
              gap: 8px;
              background: none;
              border: 0;
              padding: 0;
              font: inherit;
              font-size: 14px;
              color: inherit;
              cursor: pointer;
            "
          >
            <span
              style="
                width: 16px;
                height: 16px;
                flex: none;
                border-radius: 4px;
                display: grid;
                place-items: center;
                color: var(--color-bg);
              "
              :style="{ border: '1.5px solid ' + b.border, background: b.bg }"
            >
              <i class="ph ph-check" style="font-size: 13px; line-height: 1"></i>
            </span>
            {{ b.label }}
          </button>
        </div>
      </div>

      <!-- Submit row -->
      <div
        style="
          display: flex;
          gap: 12px;
          padding-top: 20px;
          border-top: 1px solid var(--color-divider);
        "
      >
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="!allOk"
          style="justify-content: flex-start; min-height: 46px; min-width: 240px; font-size: 15px"
        >
          <i class="ph ph-paper-plane-tilt" style="font-size: 18px"></i>{{ t.submit }}
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          @click="onDraft"
          style="justify-content: flex-start; min-height: 46px"
        >
          {{ t.saveDraft }}
        </button>
      </div>
    </form>

    <!-- Preview sidebar -->
    <aside style="position: sticky; top: 132px; display: flex; flex-direction: column; gap: 16px">
      <h6 style="margin: 0">{{ t.preview }}</h6>
      <article
        class="card elev-sm"
        style="
          padding: 12px;
          gap: 8px;
          border-radius: var(--radius-lg);
          background: var(--color-bg);
          border: 1px solid var(--color-divider);
        "
      >
        <div class="photo-ph" style="border-radius: var(--radius-md); aspect-ratio: 4/3">
          {{ f.photos ? 'cover' : t.addPhoto }}
        </div>
        <div style="font-weight: 600; font-size: 18px">
          {{ +f.price > 0 ? fmtPrice(+f.price) : '— ₽' }}
        </div>
        <div style="font-size: 14px; line-height: 1.35">{{ f.title.trim() || t.titlePh }}</div>
        <div class="text-muted" style="font-size: 12px">
          {{ cityName(f.city) }} · {{ t.justNow }}
        </div>
      </article>

      <div class="card" style="padding: 14px 16px; gap: 8px; border-radius: var(--radius-lg)">
        <div style="font-weight: 600; font-size: 14px">{{ t.checklist }}</div>
        <div
          v-for="[ok, label] in checks"
          :key="label"
          style="display: flex; align-items: center; gap: 8px; font-size: 13px"
          :style="{ color: ok ? 'var(--color-accent-2-700)' : 'var(--color-neutral-600)' }"
        >
          <i :class="ok ? 'ph-fill ph-check-circle' : 'ph ph-circle'" style="font-size: 17px"></i
          >{{ label }}
        </div>
      </div>

      <MhNotice tone="info" icon="ph ph-hourglass-medium">{{ t.modNote }}</MhNotice>
    </aside>
  </main>
</template>

<style scoped>
.add-photo-btn {
  aspect-ratio: 1/1;
  border-radius: var(--radius-md);
  border: 1.5px dashed var(--color-accent-400);
  background: var(--color-accent-100);
  color: var(--color-accent-800);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.add-photo-btn:hover {
  background: var(--color-accent-200);
}
</style>

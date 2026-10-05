<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { categories, cities, subcategories, filterListings, fmtPrice, fmtAgo, listingsWord, subName, subCount, i18n } from '@/data'
import MhBreadcrumbs from '@/components/MhBreadcrumbs.vue'
import MhListingRow from '@/components/MhListingRow.vue'

const store = useAppStore()
const router = useRouter()

const t = computed(() => i18n[store.lang])
const tr = (key: string): string => t.value[key] ?? ''
const catName = (id: string): string => categories.find((c) => c.id === id)?.[store.lang] ?? ''
const cityName = (id: string): string => cities.find((c) => c.id === id)?.[store.lang] ?? ''
const titleOf = (l: { en: string; ru: string }) => (store.lang === 'en' ? l.en : l.ru) || l.en

const results = computed(() =>
  filterListings({ q: store.q, cat: store.cat, sub: store.sub, min: store.min, max: store.max, conds: store.conds, seller: store.seller, city: store.city, sort: store.sort }, store.lang)
)

const n = computed(() => results.value.length)
const countLabel = computed(() => n.value.toLocaleString('ru-RU') + ' ' + listingsWord(n.value, store.lang))
const isEmpty = computed(() => n.value === 0)

const hasSubs = computed(() => !!(subcategories[store.cat] ?? []).length)
const subOpts = computed(() => (subcategories[store.cat] ?? []).map((sb) => ({ id: sb.id, name: sb[store.lang] })))

const subChips = computed(() => [
  { id: '', name: tr('allSubs') },
  ...(subcategories[store.cat] ?? []).map((sb) => ({ id: sb.id, name: sb[store.lang] })),
].map((sb) => ({
  label: sb.name,
  count: ' ' + subCount(store.cat, sb.id),
  active: store.sub === sb.id,
})))

const chips = computed(() => {
  const out: { label: string; remove: () => void }[] = []
  if (store.q) out.push({ label: `"${store.q}"`, remove: () => { store.q = ''; store.qDraft = '' } })
  if (store.cat) out.push({ label: catName(store.cat), remove: () => { store.cat = ''; store.sub = '' } })
  if (store.sub) out.push({ label: subName(store.cat, store.sub, store.lang), remove: () => { store.sub = '' } })
  if (store.min !== '' || store.max !== '') out.push({ label: (store.min || '0') + ' – ' + (store.max || '∞') + ' ₽', remove: () => { store.min = ''; store.max = '' } })
  store.conds.forEach((c) => out.push({ label: tr(c), remove: () => store.toggleCond(c) }))
  if (store.seller) out.push({ label: tr(store.seller), remove: () => { store.seller = '' } })
  if (store.city) out.push({ label: cityName(store.city), remove: () => { store.city = '' } })
  return out
})

const searchTitle = computed(() =>
  store.q ? `"${store.q}"` : (store.sub ? subName(store.cat, store.sub, store.lang) : (store.cat ? catName(store.cat) : tr('allListings')))
)

const crumbItems = computed(() => {
  const items: { label: string; onClick?: () => void }[] = [
    { label: tr('home'), onClick: () => router.push({ name: 'home' }) },
  ]
  if (store.sub) {
    items.push({ label: catName(store.cat), onClick: () => { store.sub = '' } })
    items.push({ label: subName(store.cat, store.sub, store.lang) })
  } else {
    items.push({ label: store.cat ? catName(store.cat) : tr('allListings') })
  }
  return items
})

function openListing(id: number) {
  store.$patch({ lid: id, gIdx: 0 })
  router.push({ name: 'listing', params: { id } })
}
function toggleFav(id: number) {
  if (!store.user) {
    store.$patch({ reason: 'loginToFav', back: 'search', authTab: 'login' })
    router.push({ name: 'auth' })
    return
  }
  store.toggleFav(id)
}
function onSaveSearch() {
  if (!store.user) {
    store.$patch({ reason: 'loginToFav', back: 'search', authTab: 'login' })
    router.push({ name: 'auth' })
    return
  }
  store.showToast(tr('searchSaved'))
}

const condItems = computed(() => ['new', 'used'].map((c) => {
  const on = store.conds.includes(c)
  return { val: c, label: tr(c), on, bg: on ? 'var(--color-accent)' : 'transparent', border: on ? 'var(--color-accent)' : 'var(--color-divider)' }
}))

const sellerItems = computed(() => [
  { val: '', label: tr('anySeller') },
  { val: 'private', label: tr('private') },
  { val: 'business', label: tr('business') },
].map((o) => ({ ...o, on: store.seller === o.val })))

const resultCards = computed(() =>
  results.value.map((l) => {
    const fav = !!store.favs[l.id]
    const price = (l.cat === 'services' ? tr('fromPrice') : '') + fmtPrice(l.price) + (l.suffix === '/mo' ? ' ' + tr('mo') : l.suffix === '/m²' ? ' ' + tr('m2') : '')
    return {
      id: l.id,
      title: titleOf(l),
      price,
      desc: store.lang === 'en' ? l.den : l.dru,
      meta: cityName(l.city) + ' · ' + (l.h === 0 ? tr('justNow') : fmtAgo(l.h, t.value)),
      photo: l.photo,
      cond: tr(l.cond),
      condClass: l.cond === 'new' ? 'tag-accent-2' : 'tag-neutral',
      seller: tr(l.seller),
      fav,
      favColor: fav ? 'var(--color-accent)' : 'var(--color-text)',
    }
  })
)
</script>

<template>
  <main style="flex: 1; max-width: 1280px; width: 100%; margin: 0 auto; padding: 20px 32px 48px; box-sizing: border-box">
    <MhBreadcrumbs :items="crumbItems" style="margin-bottom: 10px" />

    <div style="display: flex; align-items: baseline; gap: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--color-divider)">
      <h1 style="margin: 0">{{ searchTitle }}</h1>
      <span class="text-muted" style="font-size: 15px">{{ countLabel }}</span>
    </div>

    <div style="display: grid; grid-template-columns: 260px minmax(0, 1fr); gap: 0">
      <!-- Sidebar filters -->
      <aside style="border-right: 1px solid var(--color-divider); padding: 20px 24px 20px 0; display: flex; flex-direction: column; gap: 22px">
        <h6 style="margin: 0">{{ t.filters }}</h6>

        <div class="field">
          <label>{{ t.category }}</label>
          <select class="input" :value="store.cat" @change="(e) => { store.cat = (e.target as HTMLSelectElement).value; store.sub = '' }">
            <option value="">{{ t.allCategories }}</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c[store.lang] }}</option>
          </select>
        </div>

        <div v-if="hasSubs" class="field">
          <label>{{ t.subcategory }}</label>
          <select class="input" :value="store.sub" @change="(e) => store.sub = (e.target as HTMLSelectElement).value">
            <option value="">{{ t.allSubs }}</option>
            <option v-for="o in subOpts" :key="o.id" :value="o.id">{{ o.name }}</option>
          </select>
        </div>

        <div class="field">
          <label>{{ t.price }}</label>
          <div style="display: flex; gap: 8px">
            <input class="input" inputmode="numeric" :placeholder="t.from" :value="store.min" @input="(e) => store.min = (e.target as HTMLInputElement).value.replace(/\D/g, '')">
            <input class="input" inputmode="numeric" :placeholder="t.to" :value="store.max" @input="(e) => store.max = (e.target as HTMLInputElement).value.replace(/\D/g, '')">
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px">
          <div style="font-size: 12px; color: color-mix(in srgb, var(--color-text) 70%, transparent)">{{ t.condition }}</div>
          <button
            v-for="b in condItems"
            :key="b.val"
            role="checkbox"
            :aria-checked="b.on"
            @click="store.toggleCond(b.val)"
            style="display: flex; align-items: center; gap: 8px; background: none; border: 0; padding: 0; font: inherit; font-size: 14px; color: inherit; cursor: pointer; text-align: left"
          >
            <span style="width: 16px; height: 16px; flex: none; border-radius: 4px; display: grid; place-items: center; color: var(--color-bg)" :style="{ border: '1.5px solid ' + b.border, background: b.bg }">
              <i class="ph ph-check" style="font-size: 13px; line-height: 1"></i>
            </span>
            {{ b.label }}
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px">
          <div style="font-size: 12px; color: color-mix(in srgb, var(--color-text) 70%, transparent)">{{ t.seller }}</div>
          <label v-for="r in sellerItems" :key="r.val" class="radio">
            <input type="radio" name="seller" :checked="r.on" @change="store.seller = r.val">
            <span class="dot"></span>{{ r.label }}
          </label>
        </div>

        <div style="display: flex; flex-direction: column; gap: 4px; padding-top: 16px; border-top: 1px solid var(--color-divider)">
          <button class="btn btn-primary" style="justify-content: flex-start; min-height: 40px">{{ t.show }} {{ countLabel }}</button>
          <button class="btn btn-ghost" @click="store.resetFilters()" style="justify-content: flex-start; align-self: flex-start">{{ t.reset }}</button>
        </div>
      </aside>

      <!-- Results -->
      <section style="padding: 16px 0 0 28px; min-width: 0">
        <!-- Sub-category chips -->
        <div v-if="hasSubs" style="display: flex; gap: 8px; flex-wrap: wrap; padding-bottom: 14px">
          <button
            v-for="sc in subChips"
            :key="sc.label"
            @click="store.sub = sc.label === tr('allSubs') ? '' : (subOpts.find((o) => o.name === sc.label)?.id ?? '')"
            class="btn"
            style="padding: 6px 14px; font-size: 13px; border-radius: 999px"
            :style="{ background: sc.active ? 'var(--color-accent-100)' : 'transparent', color: sc.active ? 'var(--color-accent-800)' : 'var(--color-text)', borderColor: sc.active ? 'var(--color-accent-400)' : 'var(--color-divider)' }"
          >{{ sc.label }}<span style="opacity: .6">{{ sc.count }}</span></button>
        </div>

        <!-- Controls row -->
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding-bottom: 14px">
          <button
            v-for="ch in chips"
            :key="ch.label"
            @click="ch.remove()"
            class="tag tag-outline"
            style="background: none; cursor: pointer; gap: 6px; font: inherit; font-size: 12px"
          >{{ ch.label }}<i class="ph ph-x" style="font-size: 13px; line-height: 1"></i></button>
          <span style="flex: 1"></span>
          <button class="btn btn-ghost" @click="onSaveSearch">
            <i class="ph ph-bell" style="font-size: 18px; line-height: 1"></i>{{ t.saveSearch }}
          </button>
          <select class="input" :value="store.sort" @change="(e) => store.sort = (e.target as HTMLSelectElement).value as 'new' | 'cheap' | 'exp'" style="width: auto">
            <option value="new">{{ t.sortNew }}</option>
            <option value="cheap">{{ t.sortCheap }}</option>
            <option value="exp">{{ t.sortExp }}</option>
          </select>
        </div>

        <!-- Result list -->
        <div>
          <MhListingRow
            v-for="item in resultCards"
            :key="item.id"
            v-bind="item"
            @open="openListing(item.id)"
            @toggle-fav="toggleFav(item.id)"
          />

          <div v-if="isEmpty" style="padding: 48px 0; display: flex; flex-direction: column; gap: 8px; align-items: flex-start">
            <h3 style="margin: 0">{{ t.nothing }}</h3>
            <p class="text-muted" style="margin: 0">{{ t.nothingHint }}</p>
            <button class="btn btn-secondary" @click="store.resetFilters()" style="margin-top: 8px">{{ t.reset }}</button>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

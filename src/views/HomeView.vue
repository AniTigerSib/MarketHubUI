<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { categories, cities, CAT_ICONS, filterListings, fmtPrice, fmtCount, fmtAgo, i18n } from '@/data'
import MhCategoryTile from '@/components/MhCategoryTile.vue'
import MhListingCard from '@/components/MhListingCard.vue'

const store = useAppStore()
const router = useRouter()

const t = computed(() => i18n[store.lang])
const cityName = (id: string) => cities.find((c) => c.id === id)?.[store.lang] ?? ''
const titleOf = (l: { en: string; ru: string }) => (store.lang === 'en' ? l.en : l.ru) || l.en

const cats = computed(() =>
  categories.map((c) => ({
    id: c.id,
    icon: CAT_ICONS[c.id] ?? 'ph ph-tag',
    name: c[store.lang],
    count: fmtCount(c.count, store.lang) + ' ' + (t.value.listings ?? ''),
  })),
)

const homeListings = computed(() => filterListings({ city: store.city }, store.lang))

const recs = computed(() =>
  homeListings.value.slice(0, store.homeCount).map((l) => {
    const price =
      (l.cat === 'services' ? t.value.fromPrice : '') +
      fmtPrice(l.price) +
      (l.suffix === '/mo' ? ' ' + t.value.mo : l.suffix === '/m²' ? ' ' + t.value.m2 : '')
    return {
      id: l.id,
      title: titleOf(l),
      price: price ?? '',
      meta: cityName(l.city) + ' · ' + (l.h === 0 ? t.value.justNow : fmtAgo(l.h, t.value)),
      photo: l.photo,
      fav: !!store.favs[l.id],
    }
  }),
)

const canShowMore = computed(() => store.homeCount < homeListings.value.length)

function goSearch(cat: string, sub = '') {
  store.$patch({ cat, sub, q: '', qDraft: '' })
  router.push({ name: 'search' })
}

function openListing(id: number) {
  store.$patch({ lid: id, gIdx: 0 })
  router.push({ name: 'listing', params: { id } })
}

function toggleFav(id: number) {
  if (!store.user) {
    store.$patch({ reason: 'loginToFav', back: 'home', authTab: 'login' })
    router.push({ name: 'auth' })
    return
  }
  store.toggleFav(id)
}

function onAllCategories() {
  store.catMenu = true
  window.scrollTo(0, 0)
}
</script>

<template>
  <main style="flex: 1; max-width: 1280px; width: 100%; margin: 0 auto; padding: 32px 32px 48px; box-sizing: border-box; display: flex; flex-direction: column; gap: 40px">
    <!-- Categories -->
    <section>
      <div style="display: flex; align-items: center; gap: 16px; margin: 0 0 12px">
        <h6 style="margin: 0; flex: 1">{{ t.categories }}</h6>
        <button class="btn btn-ghost" @click="onAllCategories">
          <i class="ph ph-squares-four" style="font-size: 18px; line-height: 1"></i>{{ t.allCategories }} →
        </button>
      </div>
      <div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px">
        <MhCategoryTile
          v-for="c in cats"
          :key="c.id"
          :icon="c.icon"
          :name="c.name"
          :count="c.count"
          @click="goSearch(c.id)"
        />
      </div>
    </section>

    <!-- Recommended -->
    <section style="display: flex; flex-direction: column; gap: 20px">
      <div style="display: flex; align-items: baseline; gap: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--color-divider)">
        <h2 style="margin: 0; flex: 1">{{ t.recommended }}</h2>
        <button class="btn btn-ghost" @click="goSearch('')">{{ t.allListings }} →</button>
      </div>
      <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 32px 24px">
        <MhListingCard
          v-for="item in recs"
          :key="item.id"
          v-bind="item"
          @open="openListing(item.id)"
          @toggle-fav="toggleFav(item.id)"
        />
      </div>
      <div v-if="canShowMore">
        <button class="btn btn-secondary" @click="store.homeCount += 4" style="min-width: 240px; justify-content: flex-start; min-height: 44px">
          {{ t.showMore }}
        </button>
      </div>
    </section>
  </main>
</template>

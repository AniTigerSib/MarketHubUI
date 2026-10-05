<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { categories, cities, subcategories, listings, sellerFor, fmtPrice, fmtAgo, subName, i18n, blankForm } from '@/data'
import MhBreadcrumbs from '@/components/MhBreadcrumbs.vue'
import MhGallery from '@/components/MhGallery.vue'
import MhSellerCard from '@/components/MhSellerCard.vue'
import MhNotice from '@/components/MhNotice.vue'
import MhSpecList from '@/components/MhSpecList.vue'

const store = useAppStore()
const route = useRoute()
const router = useRouter()

const t = computed(() => i18n[store.lang])
const tr = (key: string): string => t.value[key] ?? ''
const catName = (id: string): string => categories.find((c) => c.id === id)?.[store.lang] ?? ''
const cityName = (id: string): string => cities.find((c) => c.id === id)?.[store.lang] ?? ''
const titleOf = (l: { en: string; ru: string }) => (store.lang === 'en' ? l.en : l.ru) || l.en

const allListings = computed(() => [...listings, ...store.my])
const l = computed(() => {
  const id = Number(route.params.id) || store.lid
  return allListings.value.find((x) => x.id === id) ?? listings[0]!
})

const gIdx = computed({
  get: () => store.gIdx,
  set: (v) => { store.gIdx = v },
})
const sel = computed(() => sellerFor(l.value))
const lfav = computed(() => !!store.favs[l.value.id])
const shown = computed(() => !!store.phoneShown[l.value.id])

const priceOf = (item: typeof l.value) => {
  const suffix = item.suffix === '/mo' ? ' ' + tr('mo') : item.suffix === '/m²' ? ' ' + tr('m2') : ''
  return (item.cat === 'services' ? tr('fromPrice') : '') + fmtPrice(item.price) + suffix
}

const L = computed(() => {
  const item = l.value
  const s = sel.value
  return {
    title: titleOf(item),
    price: priceOf(item),
    desc: store.lang === 'en' ? item.den : item.dru,
    photo: item.photo,
    catName: catName(item.cat),
    subName: subName(item.cat, item.sub ?? '', store.lang),
    city: cityName(item.city),
    cond: tr(item.cond),
    condClass: item.cond === 'new' ? 'tag-accent-2' : 'tag-neutral',
    sellerType: tr(item.seller),
    specs: [
      { k: tr('category'), v: catName(item.cat) + (item.sub ? ' › ' + subName(item.cat, item.sub, store.lang) : '') },
      { k: tr('condition'), v: tr(item.cond) },
      { k: tr('seller'), v: tr(item.seller) },
      { k: tr('city'), v: cityName(item.city) },
      { k: tr('posted'), v: item.h === 0 ? tr('justNow') : fmtAgo(item.h, t.value) },
    ],
    isMine: !!item.mine,
    notMine: !item.mine,
    sellerName: s ? s.name : '',
    sellerRating: s ? s.rating.toFixed(1) + ' · ' + s.reviews + ' ' + tr('reviews') : '',
    sellerSince: s ? tr('since') + ' ' + s.since : '',
    sellerReplies: s ? tr('replies') : '',
    phoneLabel: shown.value && s ? s.phone : tr('showPhone'),
    favIcon: lfav.value ? 'ph-fill ph-heart' : 'ph ph-heart',
    favLabel: lfav.value ? tr('inFav') : tr('addFav'),
    idLabel: tr('listingNo') + ' № ' + (48200 + item.id),
    views: (item.mine ? (item.views ?? 0) : (item.id * 37) % 400 + 40) + ' ' + tr('views'),
    posted: item.h === 0 ? tr('justNow') : fmtAgo(item.h, t.value),
  }
})

const similar = computed(() => {
  const item = l.value
  const sameCat = listings.filter((x) => x.id !== item.id && x.cat === item.cat)
  const others = listings.filter((x) => x.id !== item.id && x.cat !== item.cat)
  return [...sameCat, ...others].slice(0, 5).map((x) => ({
    id: x.id,
    title: titleOf(x),
    price: priceOf(x),
    photo: x.photo,
  }))
})

const crumbItems = computed(() => [
  { label: tr('home'), onClick: () => router.push({ name: 'home' }) },
  { label: L.value.catName, onClick: () => goSearch(l.value.cat) },
  { label: L.value.subName, onClick: () => goSearch(l.value.cat, l.value.sub ?? '') },
  { label: L.value.title },
])

function goSearch(cat: string, sub = '') {
  store.$patch({ cat, sub, q: '', qDraft: '' })
  router.push({ name: 'search' })
}
function openListing(id: number) {
  store.$patch({ lid: id, gIdx: 0 })
  router.push({ name: 'listing', params: { id } })
}

function onWrite() {
  if (!store.user) {
    store.$patch({ reason: 'loginToMsg', back: 'listing', authTab: 'login' })
    router.push({ name: 'auth' })
    return
  }
  const s = sel.value
  if (s) store.openThreadFor(l.value.id, s.name)
  store.acctTab = 'messages'
  router.push({ name: 'account' })
}

function onPhone() {
  if (!store.user) {
    store.$patch({ reason: 'loginToMsg', back: 'listing', authTab: 'login' })
    router.push({ name: 'auth' })
    return
  }
  store.phoneShown = { ...store.phoneShown, [l.value.id]: true }
}

function onFav() {
  if (!store.user) {
    store.$patch({ reason: 'loginToFav', back: 'listing', authTab: 'login' })
    router.push({ name: 'auth' })
    return
  }
  store.toggleFav(l.value.id)
}

function onEdit() {
  const item = l.value
  store.form = {
    ...blankForm(), cat: item.cat, sub: item.sub ?? '',
    title: titleOf(item),
    desc: store.lang === 'en' ? item.den : item.dru,
    price: String(item.price), city: item.city, cond: item.cond, photos: 3, editId: item.id,
  }
  router.push({ name: 'post' })
}

function onReport() {
  store.showToast(store.lang === 'en' ? 'Thanks — a moderator will check this listing' : 'Спасибо — модератор проверит объявление')
}
</script>

<template>
  <main style="flex: 1; max-width: 1280px; width: 100%; margin: 0 auto; padding: 20px 32px 56px; box-sizing: border-box; display: flex; flex-direction: column; gap: 20px">
    <MhBreadcrumbs :items="crumbItems" />
    <h1 style="margin: 0; font-size: 32px; max-width: 28ch">{{ L.title }}</h1>

    <div style="display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 40px; align-items: start">
      <!-- Left column -->
      <div style="display: flex; flex-direction: column; gap: 32px; min-width: 0">
        <MhGallery :label="L.photo" v-model="gIdx" />

        <section style="display: flex; flex-direction: column; gap: 12px">
          <h4 style="margin: 0">{{ t.characteristics }}</h4>
          <MhSpecList :items="L.specs" />
        </section>

        <section style="display: flex; flex-direction: column; gap: 10px">
          <h4 style="margin: 0">{{ t.description }}</h4>
          <p style="margin: 0; font-size: 15px; max-width: 62ch; line-height: 1.6">{{ L.desc }}</p>
        </section>

        <section style="display: flex; flex-direction: column; gap: 10px">
          <h4 style="margin: 0">{{ t.location }}</h4>
          <div style="display: flex; align-items: center; gap: 6px; font-size: 14px">
            <i class="ph ph-map-pin" style="font-size: 18px; color: var(--color-accent-700)"></i>{{ L.city }}
          </div>
          <div style="height: 200px; border-radius: var(--radius-lg); border: 1px solid var(--color-divider); display: flex; align-items: flex-end; padding: 12px; font: 11px ui-monospace, Menlo, monospace; color: var(--color-neutral-700); background: repeating-linear-gradient(135deg, var(--color-accent-100) 0 10px, var(--color-bg) 10px 20px)">map · {{ L.city }}</div>
        </section>
      </div>

      <!-- Right sticky sidebar -->
      <aside style="position: sticky; top: 132px; display: flex; flex-direction: column; gap: 12px">
        <!-- Price card -->
        <div class="card elev-sm" style="padding: 20px; gap: 12px; border-radius: var(--radius-lg); background: var(--color-bg); border: 1px solid var(--color-divider)">
          <div style="font-size: 32px; font-weight: 600; letter-spacing: -0.02em">{{ L.price }}</div>
          <div style="display: flex; gap: 6px">
            <span :class="'tag ' + L.condClass">{{ L.cond }}</span>
            <span class="tag tag-neutral">{{ L.sellerType }}</span>
          </div>
          <template v-if="L.notMine">
            <div style="display: flex; flex-direction: column; gap: 8px">
              <button class="btn btn-primary" @click="onWrite" style="justify-content: flex-start; min-height: 44px; font-size: 15px">
                <i class="ph ph-chat-circle" style="font-size: 20px"></i>{{ t.writeSeller }}
              </button>
              <button class="btn btn-secondary" @click="onPhone" style="justify-content: flex-start; min-height: 44px; font-size: 15px">
                <i class="ph ph-phone" style="font-size: 20px"></i>{{ L.phoneLabel }}
              </button>
            </div>
          </template>
          <template v-if="L.isMine">
            <div class="tag tag-accent" style="font-size: 13px; padding: 8px 12px">{{ t.yourListing }}</div>
            <button class="btn btn-secondary" @click="onEdit" style="justify-content: flex-start; min-height: 44px">
              <i class="ph ph-pencil-simple" style="font-size: 18px"></i>{{ t.editListing }}
            </button>
          </template>
          <button class="btn btn-ghost" @click="onFav" style="justify-content: flex-start; align-self: flex-start; color: var(--color-accent-700)">
            <i :class="L.favIcon" style="font-size: 18px"></i>{{ L.favLabel }}
          </button>
        </div>

        <MhSellerCard
          v-if="L.notMine && L.sellerName"
          :name="L.sellerName"
          :rating="L.sellerRating"
          :since="L.sellerSince"
          :replies="L.sellerReplies"
          :verified="tr('verified')"
        />

        <MhNotice tone="success" icon="ph ph-shield-check">{{ t.safety }}</MhNotice>

        <div class="text-muted" style="font-size: 12px; display: flex; gap: 10px; flex-wrap: wrap; padding: 0 4px">
          <span>{{ L.idLabel }}</span><span>·</span><span>{{ L.views }}</span><span>·</span><span>{{ L.posted }}</span>
        </div>
        <button class="btn btn-ghost" @click="onReport" style="align-self: flex-start; font-size: 13px; color: var(--color-neutral-600)">
          <i class="ph ph-flag" style="font-size: 15px"></i>{{ t.report }}
        </button>
      </aside>
    </div>

    <!-- Similar listings -->
    <section style="display: flex; flex-direction: column; gap: 16px; margin-top: 24px">
      <h3 style="margin: 0">{{ t.similar }}</h3>
      <div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 20px">
        <article v-for="item in similar" :key="item.id" @click="openListing(item.id)" style="display: flex; flex-direction: column; gap: 6px; cursor: pointer">
          <div class="photo-ph" style="border-radius: var(--radius-md); aspect-ratio: 4/3; font-size: 10px">{{ item.photo }}</div>
          <div style="font-weight: 600; font-size: 16px">{{ item.price }}</div>
          <div style="font-size: 13px; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden">{{ item.title }}</div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { listings, cities, fmtPrice, fmtAgo, i18n, blankForm, type Listing } from '@/data'
import MhAvatar from '@/components/MhAvatar.vue'
import MhSideNavItem from '@/components/MhSideNavItem.vue'
import MhTabs from '@/components/MhTabs.vue'
import MhListingCard from '@/components/MhListingCard.vue'
import MhMyListingRow from '@/components/MhMyListingRow.vue'
import MhThreadItem from '@/components/MhThreadItem.vue'

const store = useAppStore()
const router = useRouter()
const t = computed(() => i18n[store.lang])
const tr = (key: string): string => t.value[key] ?? ''

const cityName = (id: string): string => cities.find((c) => c.id === id)?.[store.lang] ?? ''

const allListings = computed(() => [...listings, ...store.my])
function titleOf(l: Listing): string {
  return (store.lang === 'en' ? l.en : l.ru) || l.en
}
function card(l: Listing) {
  const fav = !!store.favs[l.id]
  const price =
    (l.cat === 'services' ? tr('fromPrice') : '') +
    fmtPrice(l.price) +
    (l.suffix === '/mo' ? ' ' + tr('mo') : l.suffix === '/m²' ? ' ' + tr('m2') : '')
  return {
    id: l.id,
    title: titleOf(l),
    price,
    meta: cityName(l.city) + ' · ' + (l.h === 0 ? tr('justNow') : fmtAgo(l.h, t.value)),
    photo: l.photo,
    fav,
  }
}

const displayName = ref('')
const phone = ref('')
const avatarUrl = ref('')
const saving = ref(false)
const profileError = ref('')
const profileSaved = ref(false)
watch(() => store.user, user => {
  displayName.value = user?.displayName || ''
  phone.value = user?.phone || ''
  avatarUrl.value = user?.avatarUrl || ''
}, { immediate: true })
async function saveProfile() {
  if (saving.value) return
  saving.value = true
  profileError.value = ''
  profileSaved.value = false
  try {
    await store.updateProfile({ displayName: displayName.value.trim(), phone: phone.value.trim() || null, avatarUrl: avatarUrl.value.trim() || null })
    profileSaved.value = true
  } catch (error) { profileError.value = error instanceof Error ? error.message : 'Please try again.' }
  finally { saving.value = false }
}

// ── Account navigation ───────────────────────────────────────────────────────
const unread = computed(() => store.threads.reduce((a, x) => a + x.unread, 0))
const favCount = computed(() => allListings.value.filter((x) => store.favs[x.id]).length)

const acctNav = computed(() => [
  { id: 'listings', label: tr('myListings'), icon: 'ph ph-squares-four', count: store.my.filter((x) => x.status !== 'archived').length },
  { id: 'favorites', label: tr('favorites'), icon: 'ph ph-heart', count: favCount.value || '' },
  { id: 'messages', label: tr('messages'), icon: 'ph ph-chat-circle', count: unread.value || '' },
  { id: 'settings', label: tr('settings'), icon: 'ph ph-gear', count: '' },
])

function setTab(id: string) {
  store.acctTab = id as typeof store.acctTab
}

function onPost() {
  store.form = blankForm()
  router.push({ name: 'post' })
}

function openListing(id: number) {
  store.$patch({ lid: id, gIdx: 0 })
  router.push({ name: 'listing', params: { id } })
}

// ── My listings tab ──────────────────────────────────────────────────────────
const listTabs = computed(() => {
  const labels: Record<string, string> = {
    active: tr('active'), review: tr('inReview'), rejected: tr('rejected'), archived: tr('archived'),
  }
  return (['active', 'review', 'rejected', 'archived'] as const).map((st) => ({
    id: st,
    label: labels[st] ?? '',
    count: store.my.filter((x) => x.status === st).length,
  }))
})

const myRows = computed(() => {
  const classes: Record<string, string> = { active: 'tag-accent-2', review: 'tag-accent', rejected: 'tag-neutral', archived: 'tag-neutral' }
  const labels: Record<string, string> = { active: tr('active'), review: tr('inReview'), rejected: tr('rejected'), archived: tr('archived') }
  return store.my
    .filter((x) => x.status === store.listTab)
    .map((x) => {
      const st = x.status ?? 'active'
      return {
        ...card(x),
        status: st,
        statusClass: classes[st] ?? 'tag-neutral',
        statusLabel: labels[st] ?? '',
        isActive: x.status === 'active',
        isReview: x.status === 'review',
        isRejected: x.status === 'rejected',
        reason: x.reason ? (x.reason[store.lang] ?? '') : '',
        views: x.views ?? 0,
        favs: x.favs ?? 0,
        chats: x.chats ?? 0,
        lid: x.id,
        editLabel: tr('edit'),
        markSoldLabel: tr('markSold'),
        fixLabel: tr('fix'),
        reviewEta: tr('reviewEta'),
        reasonL: tr('reasonL'),
      }
    })
})

const myEmpty = computed(() => myRows.value.length === 0)

function onEditListing(id: number) {
  const x = store.my.find((m) => m.id === id)
  if (!x) return
  store.form = { ...blankForm(), cat: x.cat, sub: x.sub ?? '', title: titleOf(x), desc: store.lang === 'en' ? x.den : x.dru, price: String(x.price), city: x.city, cond: x.cond, photos: 3, editId: x.id }
  router.push({ name: 'post' })
}

function onFixListing(id: number) {
  const x = store.my.find((m) => m.id === id)
  if (!x) return
  store.form = { ...blankForm(), cat: x.cat, sub: x.sub ?? '', title: titleOf(x), desc: store.lang === 'en' ? x.den : x.dru, price: String(x.price), city: x.city, cond: x.cond, photos: 0, editId: x.id }
  router.push({ name: 'post' })
}

// ── Favorites tab ────────────────────────────────────────────────────────────
const favCards = computed(() => allListings.value.filter((x) => store.favs[x.id]).map(card))
const favEmpty = computed(() => favCards.value.length === 0)

// ── Messages tab ─────────────────────────────────────────────────────────────
const threadFilters = computed(() =>
  [['all', tr('all')], ['buying', tr('buying')], ['selling', tr('selling')]].map(([id, label]) => ({
    id, label, active: store.threadFilter === id,
  })),
)

const threadRows = computed(() => {
  const tf = store.threads.filter((x) => store.threadFilter === 'all' || x.role === store.threadFilter)
  return tf.map((x) => {
    const xl = allListings.value.find((l) => l.id === x.lid)
    const last = x.msgs[x.msgs.length - 1]
    const lastText = last
      ? typeof last.text === 'string' ? last.text : (last.text[store.lang] ?? '')
      : '—'
    return {
      id: x.id,
      who: x.who,
      title: xl ? titleOf(xl) : '',
      last: last ? (last.me ? tr('you') + ': ' : '') + lastText : '—',
      unread: x.unread,
      hasUnread: x.unread > 0,
      active: x.id === store.activeThread,
    }
  })
})

const activeThread = computed(() => store.threads.find((x) => x.id === store.activeThread) ?? null)
const threadListing = computed(() => {
  const th = activeThread.value
  if (!th) return null
  return allListings.value.find((l) => l.id === th.lid) ?? null
})

const msgs = computed(() => {
  const th = activeThread.value
  if (!th) return []
  return th.msgs.map((m) => ({
    text: typeof m.text === 'string' ? m.text : (m.text[store.lang] ?? ''),
    at: m.at,
    me: m.me,
    bg: m.me ? 'var(--color-accent-100)' : 'var(--color-bg)',
    align: m.me ? 'flex-end' : 'flex-start',
  }))
})

const showQuick = computed(() => {
  const th = activeThread.value
  return !!th && th.role === 'buying' && th.msgs.length === 0
})

const quickReplies = computed(() => [tr('q1'), tr('q2'), tr('q3')])

function onSendMsg(e: Event) {
  e.preventDefault()
  store.sendMsg(store.draftMsg)
}

function openThreadListing() {
  if (!threadListing.value) return
  store.$patch({ lid: threadListing.value.id, gIdx: 0 })
  router.push({ name: 'listing', params: { id: threadListing.value.id } })
}
</script>

<template>
  <main style="flex: 1; max-width: 1280px; width: 100%; margin: 0 auto; padding: 24px 32px 56px; box-sizing: border-box; display: grid; grid-template-columns: 240px minmax(0, 1fr); gap: 40px; align-items: start">
    <!-- Sidebar nav -->
    <aside style="position: sticky; top: 132px; display: flex; flex-direction: column; gap: 16px">
      <div v-if="store.user" style="display: flex; align-items: center; gap: 12px">
        <MhAvatar :name="store.user.name" :size="52" />
        <div style="display: flex; flex-direction: column">
          <span style="font-weight: 600; font-size: 17px">{{ store.user.name }}</span>
          <span style="font-size: 13px; display: flex; align-items: center; gap: 4px">
            <i class="ph-fill ph-star" style="color: var(--color-accent-500); font-size: 14px"></i>4.9 · 32 {{ t.reviews }}
          </span>
        </div>
      </div>

      <nav style="display: flex; flex-direction: column; gap: 2px">
        <MhSideNavItem
          v-for="nav in acctNav"
          :key="nav.id"
          :icon="nav.icon"
          :label="nav.label"
          :count="nav.count"
          :active="store.acctTab === nav.id"
          @click="setTab(nav.id)"
        />
      </nav>

      <button class="btn btn-primary" @click="onPost" style="justify-content: flex-start; min-height: 42px">
        <i class="ph ph-plus" style="font-size: 18px"></i>{{ t.post }}
      </button>
    </aside>

    <section v-if="store.acctTab === 'settings'" style="max-width: 480px; width: 100%">
      <h1>{{ t.settings }}</h1>
      <form @submit.prevent="saveProfile" style="display: grid; gap: 16px">
        <p v-if="profileError" role="alert">{{ profileError }}</p>
        <p v-if="profileSaved" role="status">{{ store.lang === 'ru' ? 'Профиль сохранён.' : 'Profile saved.' }}</p>
        <div class="field"><label>{{ store.lang === 'ru' ? 'Имя пользователя' : 'Username' }}</label><input class="input" :value="store.user?.username" disabled /></div>
        <div class="field"><label>{{ t.email }}</label><input class="input" :value="store.user?.email" disabled /></div>
        <div class="field"><label>{{ t.name }}</label><input v-model="displayName" class="input" required maxlength="64" autocomplete="name" :disabled="saving" /></div>
        <div class="field"><label>{{ t.phone }}</label><input v-model="phone" class="input" type="tel" pattern="\+[1-9][0-9]{6,14}" placeholder="+79000000000" autocomplete="tel" :disabled="saving" /></div>
        <div class="field"><label>{{ store.lang === 'ru' ? 'Ссылка на аватар' : 'Avatar URL' }}</label><input v-model="avatarUrl" class="input" type="url" pattern="https?://.*" maxlength="2048" :disabled="saving" /></div>
        <button class="btn btn-primary" :disabled="saving">{{ store.lang === 'ru' ? 'Сохранить' : 'Save profile' }}</button>
      </form>
    </section>

    <!-- ── Tab: My Listings ───────────────────────────────────────────────── -->
    <section v-if="store.acctTab === 'listings'" style="display: flex; flex-direction: column; gap: 16px; min-width: 0">
      <h1 style="margin: 0; font-size: 32px">{{ t.myListings }}</h1>

      <MhTabs :tabs="listTabs" :model-value="store.listTab" @update:model-value="(v) => store.listTab = v as typeof store.listTab" />

      <MhMyListingRow
        v-for="r in myRows"
        :key="r.id"
        v-bind="r"
        @open="openListing(r.lid)"
        @edit="onEditListing(r.id)"
        @mark-sold="store.markListingSold(r.id)"
        @fix="onFixListing(r.id)"
      />

      <p v-if="myEmpty" class="text-muted" style="margin: 24px 0">{{ t.nothingHere }}</p>
    </section>

    <!-- ── Tab: Favorites ─────────────────────────────────────────────────── -->
    <section v-if="store.acctTab === 'favorites'" style="display: flex; flex-direction: column; gap: 20px; min-width: 0">
      <h1 style="margin: 0; font-size: 32px">{{ t.favorites }}</h1>
      <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px">
        <MhListingCard
          v-for="item in favCards"
          :key="item.id"
          v-bind="item"
          @open="openListing(item.id)"
          @toggle-fav="store.toggleFav(item.id)"
        />
      </div>
      <div v-if="favEmpty" style="display: flex; flex-direction: column; gap: 10px; align-items: flex-start; padding: 24px; border-radius: var(--radius-lg); background: var(--color-surface); max-width: 480px">
        <i class="ph ph-heart" style="font-size: 32px; color: var(--color-accent-600)"></i>
        <span>{{ t.favEmpty }}</span>
        <button class="btn btn-secondary" @click="router.push({ name: 'home' })">{{ t.recommended }} →</button>
      </div>
    </section>

    <!-- ── Tab: Messages ──────────────────────────────────────────────────── -->
    <section
      v-if="store.acctTab === 'messages'"
      style="display: grid; grid-template-columns: minmax(200px, 300px) minmax(0, 1fr); height: calc(100vh - 200px); min-height: 520px; border: 1px solid var(--color-divider); border-radius: var(--radius-lg); overflow: hidden; min-width: 0"
    >
      <!-- Thread list -->
      <div style="border-right: 1px solid var(--color-divider); display: flex; flex-direction: column; min-height: 0">
        <div style="padding: 12px; display: flex; gap: 6px; border-bottom: 1px solid var(--color-divider)">
          <button
            v-for="f in threadFilters"
            :key="f.id"
            @click="store.threadFilter = f.id as typeof store.threadFilter"
            class="btn"
            style="padding: 5px 12px; font-size: 13px"
            :style="{ background: f.active ? 'var(--color-accent-100)' : 'transparent', color: f.active ? 'var(--color-accent-800)' : 'var(--color-text)', borderColor: f.active ? 'var(--color-accent-400)' : 'var(--color-divider)' }"
          >{{ f.label }}</button>
        </div>
        <div style="flex: 1; overflow-y: auto">
          <MhThreadItem
            v-for="row in threadRows"
            :key="row.id"
            v-bind="row"
            @select="store.openThread(row.id)"
          />
        </div>
      </div>

      <!-- Chat panel -->
      <div v-if="activeThread" style="display: flex; flex-direction: column; min-height: 0">
        <!-- Chat header -->
        <div style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--color-divider)">
          <MhAvatar :name="activeThread.who" :size="40" />
          <div style="flex: 1; display: flex; flex-direction: column; min-width: 0">
            <span style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{ activeThread.who }}</span>
            <span style="font-size: 12px; color: var(--color-accent-2-700)">{{ t.online }}</span>
          </div>
          <button
            v-if="threadListing"
            class="btn btn-secondary"
            @click="openThreadListing"
            style="gap: 10px; padding: 6px 10px 6px 6px; max-width: 50%; min-width: 0; flex: 0 1 auto; justify-content: flex-start"
          >
            <span style="width: 32px; height: 32px; flex: none; border-radius: 6px; background: repeating-linear-gradient(135deg, var(--color-neutral-200) 0 4px, var(--color-neutral-100) 4px 8px)"></span>
            <span style="display: flex; flex-direction: column; align-items: flex-start; font-size: 12px; min-width: 0; text-align: left">
              <span style="font-weight: 500; max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{ titleOf(threadListing) }}</span>
              <span class="text-muted" style="white-space: nowrap">{{ fmtPrice(threadListing.price) }}</span>
            </span>
          </button>
        </div>

        <!-- Messages -->
        <div style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 8px; justify-content: flex-end; background: var(--color-surface)">
          <div
            v-for="(m, i) in msgs"
            :key="i"
            style="max-width: 70%; padding: 9px 13px; border-radius: 14px; font-size: 14px; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: 2px; color: var(--color-text)"
            :style="{ alignSelf: m.align, background: m.bg }"
          >
            {{ m.text }}
            <span class="text-muted" style="font-size: 11px; align-self: flex-end">{{ m.at }}</span>
          </div>
        </div>

        <!-- Quick replies -->
        <div v-if="showQuick" style="display: flex; gap: 6px; padding: 10px 16px 0; flex-wrap: wrap">
          <button
            v-for="q in quickReplies"
            :key="q"
            @click="store.sendMsg(q)"
            class="tag tag-outline"
            style="background: none; cursor: pointer; font: inherit; font-size: 13px; padding: 5px 12px"
          >{{ q }}</button>
        </div>

        <!-- Message input -->
        <form @submit="onSendMsg" style="display: flex; gap: 8px; padding: 12px 16px">
          <button type="button" class="btn btn-icon btn-secondary">
            <i class="ph ph-paperclip" style="font-size: 18px"></i>
          </button>
          <input class="input" :value="store.draftMsg" @input="(e) => (store.draftMsg = (e.target as HTMLInputElement).value)" :placeholder="t.typeMsg" />
          <button type="submit" class="btn btn-primary">
            <i class="ph ph-paper-plane-right" style="font-size: 18px"></i>{{ t.send }}
          </button>
        </form>
      </div>

      <!-- Empty thread panel -->
      <div v-else style="display: grid; place-items: center; color: var(--color-neutral-600); font-size: 14px">
        {{ t.pickChat }}
      </div>
    </section>
  </main>
</template>

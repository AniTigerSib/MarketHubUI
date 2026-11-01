<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { categories, cities, subcategories, CAT_ICONS, i18n } from '@/data'
import MhAvatar from '@/components/MhAvatar.vue'

const store = useAppStore()
const route = useRoute()
const router = useRouter()

const isAuth = computed(() => route.name === 'auth')
const t = computed(() => i18n[store.lang])
const cityOptions = computed(() => [
  { id: '', name: store.lang === 'en' ? 'All of Russia' : 'Вся Россия' },
  ...cities.map((c) => ({ id: c.id, name: c[store.lang] })),
])

const catMenu = computed(() => store.catMenu)

function goHome() {
  router.push({ name: 'home' })
}
function goAccount() {
  router.push({ name: 'account' })
}
function goSearch(cat: string, sub = '') {
  store.$patch({ cat, sub, q: '', qDraft: '' })
  router.push({ name: 'search' })
}
function onPost() {
  if (!store.user) {
    store.$patch({
      reason: 'loginToPost',
      back: 'post',
      authTab: 'login',
    })
    router.push({ name: 'auth', query: { redirect: '/post' } })
    return
  }
  router.push({ name: 'post' })
}
function onFavs() {
  if (!store.user) {
    store.$patch({ reason: 'loginToFav', back: (route.name as string) || 'home', authTab: 'login' })
    router.push({ name: 'auth', query: { redirect: route.fullPath } })
    return
  }
  store.acctTab = 'favorites'
  router.push({ name: 'account' })
}
function onMsgs() {
  if (!store.user) {
    store.$patch({ reason: 'loginToMsg', back: (route.name as string) || 'home', authTab: 'login' })
    router.push({ name: 'auth', query: { redirect: route.fullPath } })
    return
  }
  store.acctTab = 'messages'
  router.push({ name: 'account' })
}
function onSearchSubmit(e: Event) {
  e.preventDefault()
  store.$patch({ q: store.qDraft.trim() })
  router.push({ name: 'search' })
}
function onLogout() {
  store.doLogout()
  if (route.name === 'account' || route.name === 'post') router.push({ name: 'home' })
}

const catsWithIcons = computed(() =>
  categories.map((c) => ({
    ...c,
    icon: CAT_ICONS[c.id] || 'ph ph-tag',
    subs: subcategories[c.id] || [],
  })),
)
</script>

<template>
  <div
    style="
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: var(--color-bg);
      color: var(--color-text);
      font-family: var(--font-body);
    "
  >
    <!-- Header -->
    <header
      v-if="!isAuth"
      style="
        position: sticky;
        top: 0;
        z-index: 20;
        background: var(--color-bg);
        border-bottom: 1px solid var(--color-divider);
      "
    >
      <!-- Top bar -->
      <div
        style="
          max-width: 1280px;
          margin: 0 auto;
          padding: 6px 32px;
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 13px;
          border-bottom: 1px solid var(--color-divider);
        "
      >
        <label style="display: flex; align-items: center; gap: 6px">
          <i class="ph ph-map-pin" style="font-size: 17px; line-height: 1"></i>
          <select
            :value="store.city"
            @change="(e) => (store.city = (e.target as HTMLSelectElement).value)"
            style="
              font: inherit;
              background: transparent;
              border: 0;
              color: inherit;
              cursor: pointer;
              padding: 2px 0;
            "
          >
            <option v-for="c in cityOptions" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </label>
        <span style="flex: 1"></span>
        <div class="seg" style="font-size: 12px">
          <button
            @click="store.setLang('en')"
            style="font: inherit; border: 0; padding: 3px 10px; cursor: pointer"
            :style="{
              background: store.lang === 'en' ? 'var(--color-accent-100)' : 'transparent',
              color: store.lang === 'en' ? 'var(--color-accent-800)' : 'var(--color-text)',
            }"
          >
            EN
          </button>
          <button
            @click="store.setLang('ru')"
            style="
              font: inherit;
              border: 0;
              border-left: 1px solid var(--color-divider);
              padding: 3px 10px;
              cursor: pointer;
            "
            :style="{
              background: store.lang === 'ru' ? 'var(--color-accent-100)' : 'transparent',
              color: store.lang === 'ru' ? 'var(--color-accent-800)' : 'var(--color-text)',
            }"
          >
            RU
          </button>
        </div>
        <template v-if="store.user">
          <span style="display: flex; align-items: center; gap: 10px">
            <button
              @click="goAccount"
              style="
                display: flex;
                align-items: center;
                gap: 8px;
                background: none;
                border: 0;
                padding: 0;
                font: inherit;
                color: inherit;
                cursor: pointer;
              "
            >
              <MhAvatar :name="store.user.name" :size="24" />
              {{ store.user.name }}
            </button>
            <button
              class="btn btn-ghost"
              @click="onLogout"
              style="font-size: 13px; padding: 2px 4px"
            >
              {{ t.logout }}
            </button>
          </span>
        </template>
        <template v-else>
          <button
            class="btn btn-ghost"
            @click="
              () => {
                store.$patch({
                  reason: '',
                  back: (route.name as string) || 'home',
                  authTab: 'login',
                })
                router.push({ name: 'auth', query: { redirect: route.fullPath } })
              }
            "
            style="font-size: 13px; padding: 2px 4px"
          >
            {{ t.login }}
          </button>
        </template>
      </div>
      <!-- Main nav bar -->
      <div
        style="
          max-width: 1280px;
          margin: 0 auto;
          padding: 14px 32px;
          display: flex;
          align-items: center;
          gap: 16px;
        "
      >
        <button
          @click="goHome"
          style="
            display: flex;
            align-items: center;
            gap: 10px;
            background: none;
            border: 0;
            padding: 0;
            cursor: pointer;
            color: inherit;
          "
        >
          <span
            style="
              width: 22px;
              height: 22px;
              background: linear-gradient(
                135deg,
                var(--color-accent-400),
                var(--color-accent-2-400)
              );
              border-radius: 6px;
              display: block;
            "
          ></span>
          <span
            style="
              font-family: var(--font-heading);
              font-weight: 600;
              font-size: 22px;
              letter-spacing: -0.02em;
            "
            >MarketHub</span
          >
        </button>
        <button
          class="btn btn-secondary"
          @click="store.catMenu = !store.catMenu"
          style="min-height: 40px"
        >
          <i class="ph ph-list" style="font-size: 20px; line-height: 1"></i>{{ t.categories }}
        </button>
        <form @submit="onSearchSubmit" style="flex: 1; display: flex; min-width: 0">
          <input
            class="input"
            :value="store.qDraft"
            @input="(e) => (store.qDraft = (e.target as HTMLInputElement).value)"
            :placeholder="t.searchPh"
            style="
              min-height: 40px;
              background: var(--color-bg);
              border-color: var(--color-accent-300);
              border-radius: var(--radius-md) 0 0 var(--radius-md);
            "
          />
          <button
            type="submit"
            class="btn btn-primary"
            style="
              min-height: 40px;
              padding-inline: 20px;
              border-radius: 0 var(--radius-md) var(--radius-md) 0;
              border-left: 0;
            "
          >
            <i class="ph ph-magnifying-glass" style="font-size: 20px; line-height: 1"></i
            >{{ t.find }}
          </button>
        </form>
        <button
          class="btn btn-icon btn-secondary"
          @click="onFavs"
          :title="t.favorites"
          style="width: 40px; height: 40px"
        >
          <i class="ph ph-heart" style="font-size: 20px; line-height: 1"></i>
        </button>
        <button
          class="btn btn-icon btn-secondary"
          @click="onMsgs"
          :title="t.messages"
          style="width: 40px; height: 40px"
        >
          <i class="ph ph-chat-circle" style="font-size: 20px; line-height: 1"></i>
        </button>
        <button class="btn btn-primary" @click="onPost" style="min-height: 40px">
          <i class="ph ph-plus" style="font-size: 20px; line-height: 1"></i>{{ t.post }}
        </button>
      </div>

      <!-- Category mega-menu -->
      <div
        v-if="catMenu"
        style="
          position: absolute;
          left: 0;
          right: 0;
          top: 100%;
          background: var(--color-bg);
          border-bottom: 1px solid var(--color-divider);
          box-shadow: var(--shadow-md);
          z-index: 10;
        "
      >
        <div
          style="
            max-width: 1280px;
            margin: 0 auto;
            padding: 20px 32px 28px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
            gap: 18px 24px;
            max-height: 70vh;
            overflow-y: auto;
            box-sizing: border-box;
          "
        >
          <div
            v-for="c in catsWithIcons"
            :key="c.id"
            style="display: flex; flex-direction: column; gap: 1px"
          >
            <button @click="goSearch(c.id)" class="cat-parent-btn">
              <i :class="c.icon" style="font-size: 19px; color: var(--color-accent-700)"></i
              >{{ c[store.lang] }}
            </button>
            <button
              v-for="sb in c.subs"
              :key="sb.id"
              @click="goSearch(c.id, sb.id)"
              class="cat-sub-btn"
            >
              {{ sb[store.lang] }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <RouterView />

    <!-- Footer -->
    <footer v-if="!isAuth" style="border-top: 1px solid var(--color-divider)">
      <div
        style="
          max-width: 1280px;
          margin: 0 auto;
          padding: 20px 32px;
          display: flex;
          gap: 24px;
          font-size: 12px;
        "
        class="text-muted"
      >
        <span style="font-weight: 600; color: var(--color-text)">MarketHub</span>
        <span>© 2026</span>
        <span style="flex: 1"></span>
        <span>Help</span><span>Safety</span><span>Rules</span><span>Business</span>
      </div>
    </footer>

    <!-- Toast -->
    <Transition name="toast">
      <div
        v-if="store.toast"
        style="
          position: fixed;
          left: 32px;
          bottom: 32px;
          z-index: 50;
          background: var(--color-text);
          color: var(--color-bg);
          padding: 12px 18px;
          font-size: 14px;
          font-weight: 600;
          box-shadow: var(--shadow-lg);
          border-left: 6px solid var(--color-accent-2-400);
          border-radius: var(--radius-md);
        "
      >
        {{ store.toast }}
      </div>
    </Transition>
  </div>
</template>

<style>
.cat-parent-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  background: none;
  border: 0;
  border-radius: var(--radius-md);
  padding: 6px 8px;
  cursor: pointer;
  color: inherit;
  font: inherit;
  font-weight: 600;
  font-size: 15px;
  width: 100%;
}
.cat-parent-btn:hover {
  background: var(--color-surface);
  color: var(--color-accent-700);
}
.cat-sub-btn {
  text-align: left;
  background: none;
  border: 0;
  border-radius: 6px;
  padding: 4px 8px 4px 37px;
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  color: var(--color-neutral-700);
  width: 100%;
}
.cat-sub-btn:hover {
  background: var(--color-surface);
  color: var(--color-accent-700);
}
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>

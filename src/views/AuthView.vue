<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { i18n } from '@/data'
import { authErrorKey, authErrorMessage, type AuthErrorKey } from '@/utils/authFeedback'

const store = useAppStore()
const router = useRouter()
const route = useRoute()
const username = ref('')
const email = ref('')
const login = ref('')
const password = ref('')
const busy = ref(false)
const errorKey = ref<AuthErrorKey | null>(null)
const error = computed(() => (errorKey.value ? authErrorMessage(errorKey.value, store.lang) : ''))
const errorAlert = ref<HTMLElement | null>(null)
const showPassword = ref(false)
watch(errorKey, async (key) => {
  if (key) {
    await nextTick()
    errorAlert.value?.focus()
  }
})
watch([username, email, login, password, () => store.fName, () => store.accept], () => {
  errorKey.value = null
})
const registered = ref(false)
watch(
  () => store.authTab,
  () => {
    errorKey.value = null
    password.value = ''
    showPassword.value = false
  },
)

const t = computed(() => i18n[store.lang])
const isSignup = computed(() => store.authTab === 'signup')

function goBack() {
  router.push({ name: store.back || 'home' })
}

async function onAuthSubmit(e?: Event) {
  e?.preventDefault()
  if (busy.value) return
  errorKey.value = null
  if (isSignup.value && !store.accept) {
    errorKey.value = 'terms'
    return
  }
  busy.value = true
  try {
    if (isSignup.value) {
      await store.register(
        username.value.trim(),
        email.value.trim(),
        password.value,
        store.fName.trim() || username.value.trim(),
      )
      registered.value = true
      login.value = email.value.trim()
      store.authTab = 'login'
      return
    }
    await store.doLogin(login.value.trim(), password.value)
    password.value = ''
    store.reason = ''
    const redirect = route.query.redirect
    if (typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')) {
      await router.push(redirect)
    } else {
      await router.push({ name: store.back === 'auth' ? 'home' : store.back || 'home' })
    }
  } catch (cause) {
    errorKey.value = authErrorKey(cause, store.authTab)
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div
    style="
      flex: 1;
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      min-height: 100vh;
    "
  >
    <!-- Left brand panel -->
    <section
      style="
        background: linear-gradient(
          160deg,
          var(--color-accent-100),
          var(--color-accent-200) 55%,
          var(--color-accent-2-100)
        );
        color: var(--color-text);
        padding: 40px 56px;
        display: flex;
        flex-direction: column;
        gap: 24px;
      "
    >
      <button
        @click="goBack"
        style="
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: 0;
          padding: 0;
          cursor: pointer;
          color: inherit;
          align-self: flex-start;
        "
      >
        <span
          style="
            width: 22px;
            height: 22px;
            background: linear-gradient(135deg, var(--color-accent-400), var(--color-accent-2-400));
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
      <span style="flex: 1"></span>
      <h1
        :lang="store.lang"
        style="
          font-size: clamp(40px, 4.6vw, 72px);
          line-height: 0.98;
          letter-spacing: -0.03em;
          font-weight: 500;
          margin: 0;
          max-width: 12ch;
          text-wrap: balance;
        "
      >
        {{ t.posterTitle }}
      </h1>
      <p style="font-size: 18px; max-width: 42ch; margin: 0">{{ t.posterBody }}</p>
      <div
        style="
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          border-top: 2px solid var(--color-bg);
          margin-top: 24px;
        "
      >
        <div style="padding: 14px 16px 0 0">
          <div style="font-weight: 600; font-size: 28px">3.2M</div>
          <div style="font-size: 13px">{{ t.listings }}</div>
        </div>
        <div style="padding: 14px 16px 0; border-left: 1px solid var(--color-divider)">
          <div style="font-weight: 600; font-size: 28px">10</div>
          <div style="font-size: 13px">{{ t.categories }}</div>
        </div>
        <div style="padding: 14px 16px 0; border-left: 1px solid var(--color-divider)">
          <div style="font-weight: 600; font-size: 28px">&lt; 30 min</div>
          <div style="font-size: 13px; color: var(--color-accent-2-700)">{{ t.modLabel }}</div>
        </div>
      </div>
    </section>

    <!-- Right form panel -->
    <section style="padding: 40px 56px; display: flex; flex-direction: column; gap: 24px">
      <div style="display: flex; align-items: center; gap: 12px">
        <button class="btn btn-ghost" @click="goBack" style="padding-inline: 0">
          <i class="ph ph-arrow-left" style="font-size: 18px; line-height: 1"></i>{{ t.back }}
        </button>
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
      </div>

      <form
        @submit="onAuthSubmit"
        :aria-busy="busy"
        style="
          width: 100%;
          max-width: 420px;
          margin: auto 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        "
      >
        <div
          v-if="error"
          id="auth-error"
          ref="errorAlert"
          role="alert"
          tabindex="-1"
          style="
            border: 1px solid #b42318;
            border-radius: var(--radius-md, 8px);
            padding: 12px;
            background: #fff4f2;
            color: #8a1c13;
            line-height: 1.5;
          "
        >
          {{ error }}
        </div>
        <p v-if="registered" role="status">
          {{
            store.lang === 'ru'
              ? 'Аккаунт создан. Войдите, чтобы продолжить.'
              : 'Account created. Log in to continue.'
          }}
        </p>
        <fieldset :disabled="busy" style="border: 0; padding: 0; margin: 0; display: contents">
          <!-- Reason badge -->
          <div
            v-if="store.reason"
            class="tag tag-accent"
            style="font-size: 13px; padding: 8px 12px; align-self: flex-start"
          >
            {{ t[store.reason] }}
          </div>

          <!-- Tab switcher -->
          <div
            style="
              display: grid;
              grid-template-columns: 1fr 1fr;
              border-bottom: 1px solid var(--color-divider);
            "
          >
            <button
              type="button"
              @click="store.authTab = 'signup'"
              style="
                text-align: left;
                background: none;
                border: 0;
                margin-bottom: -2px;
                padding: 0 0 10px;
                font-family: var(--font-heading);
                font-weight: 600;
                font-size: 22px;
                cursor: pointer;
              "
              :style="{
                borderBottom: isSignup ? '3px solid var(--color-accent)' : '3px solid transparent',
                color: isSignup ? 'var(--color-text)' : 'var(--color-neutral-600)',
              }"
            >
              {{ t.signup }}
            </button>
            <button
              type="button"
              @click="store.authTab = 'login'"
              style="
                text-align: left;
                background: none;
                border: 0;
                margin-bottom: -2px;
                padding: 0 0 10px;
                font-family: var(--font-heading);
                font-weight: 600;
                font-size: 22px;
                cursor: pointer;
              "
              :style="{
                borderBottom: !isSignup ? '3px solid var(--color-accent)' : '3px solid transparent',
                color: !isSignup ? 'var(--color-text)' : 'var(--color-neutral-600)',
              }"
            >
              {{ t.logIn }}
            </button>
          </div>

          <!-- Signup fields -->
          <template v-if="isSignup">
            <div style="display: flex; flex-direction: column; gap: 14px">
              <div class="field">
                <label>{{ t.name }}</label>
                <input
                  class="input"
                  :value="store.fName"
                  @input="(e) => (store.fName = (e.target as HTMLInputElement).value)"
                  maxlength="64"
                  autocomplete="name"
                  placeholder="Anna"
                />
              </div>
              <div class="field">
                <label>{{ store.lang === 'ru' ? 'Имя пользователя' : 'Username' }}</label>
                <input
                  v-model="username"
                  class="input"
                  required
                  minlength="3"
                  maxlength="32"
                  pattern="[A-Za-z0-9_.\-]{3,32}"
                  autocomplete="username"
                  placeholder="anna"
                />
                <small>{{
                  store.lang === 'ru'
                    ? '3–32 символа: латинские буквы, цифры, _, . или -'
                    : '3–32 characters: letters, digits, _, . or -'
                }}</small>
              </div>
              <div>
                <div class="field">
                  <label>{{ t.email }}</label
                  ><input
                    v-model="email"
                    class="input"
                    type="email"
                    required
                    maxlength="254"
                    autocomplete="email"
                    placeholder="anna@mail.ru"
                  />
                </div>
              </div>
              <div class="field">
                <label>{{ t.password }}</label>
                <input
                  v-model="password"
                  class="input"
                  :type="showPassword ? 'text' : 'password'"
                  :aria-invalid="errorKey === 'credentials' ? true : undefined"
                  :aria-describedby="error ? 'auth-error' : undefined"
                  required
                  minlength="8"
                  maxlength="72"
                  autocomplete="new-password"
                  placeholder="••••••••"
                />
                <div class="text-muted" style="font-size: 12px; margin-top: 4px">
                  {{ t.pwHint }}
                </div>
              </div>
              <button
                type="button"
                @click="store.accept = !store.accept"
                style="
                  display: flex;
                  align-items: flex-start;
                  gap: 8px;
                  background: none;
                  border: 0;
                  padding: 0;
                  font: inherit;
                  font-size: 13px;
                  color: inherit;
                  cursor: pointer;
                  text-align: left;
                "
              >
                <span
                  style="
                    width: 16px;
                    height: 16px;
                    flex: none;
                    border-radius: 4px;
                    margin-top: 2px;
                    display: grid;
                    place-items: center;
                    color: var(--color-bg);
                  "
                  :style="{
                    border: store.accept
                      ? '1.5px solid var(--color-accent)'
                      : '1.5px solid var(--color-divider)',
                    background: store.accept ? 'var(--color-accent)' : 'transparent',
                  }"
                >
                  <i class="ph ph-check" style="font-size: 13px; line-height: 1"></i>
                </span>
                {{ t.accept }}
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                style="justify-content: flex-start; min-height: 44px; font-size: 15px"
              >
                {{ t.create }} →
              </button>
            </div>
          </template>

          <!-- Login fields -->
          <template v-else>
            <div style="display: flex; flex-direction: column; gap: 14px">
              <div class="field">
                <label
                  >{{ t.email }} /
                  {{ store.lang === 'ru' ? 'имя пользователя' : 'username' }}</label
                ><input
                  v-model="login"
                  class="input"
                  required
                  autocomplete="username"
                  placeholder="anna@mail.ru"
                />
              </div>
              <div class="field">
                <label>{{ t.password }}</label
                ><input
                  v-model="password"
                  class="input"
                  :type="showPassword ? 'text' : 'password'"
                  :aria-invalid="errorKey === 'credentials' ? true : undefined"
                  :aria-describedby="error ? 'auth-error' : undefined"
                  required
                  autocomplete="current-password"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                class="btn btn-primary"
                style="justify-content: flex-start; min-height: 44px; font-size: 15px"
              >
                {{ t.logIn }} →
              </button>
            </div>
          </template>
          <button
            type="button"
            class="btn btn-ghost"
            :aria-pressed="showPassword"
            @click="showPassword = !showPassword"
            style="align-self: flex-start; padding-inline: 0"
          >
            {{
              store.lang === 'ru'
                ? showPassword
                  ? 'Скрыть пароль'
                  : 'Показать пароль'
                : showPassword
                  ? 'Hide password'
                  : 'Show password'
            }}
          </button>
        </fieldset>
        <p v-if="busy" role="status">{{ store.lang === 'ru' ? 'Подождите…' : 'Please wait…' }}</p>
      </form>
    </section>
  </div>
</template>

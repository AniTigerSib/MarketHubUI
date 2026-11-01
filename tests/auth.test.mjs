import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
import { createPinia, setActivePinia } from 'pinia'

const compile = (source) =>
  'data:text/javascript;base64,' +
  Buffer.from(
    ts.transpileModule(source, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    }).outputText,
  ).toString('base64')
const apiUrl = compile(
  readFileSync(new URL('../src/services/api.ts', import.meta.url), 'utf8').replace(
    'import.meta.env.VITE_API_BASE_URL',
    'undefined',
  ),
)
const authApiUrl = compile(
  readFileSync(new URL('../src/services/authApi.ts', import.meta.url), 'utf8').replace(
    "'./api'",
    JSON.stringify(apiUrl),
  ),
)
const userApiUrl = compile(
  readFileSync(new URL('../src/services/userApi.ts', import.meta.url), 'utf8').replace(
    "'./api'",
    JSON.stringify(apiUrl),
  ),
)
const feedbackUrl = compile(
  readFileSync(new URL('../src/utils/authFeedback.ts', import.meta.url), 'utf8').replace(
    "'@/services/api'",
    JSON.stringify(apiUrl),
  ),
)
const { ApiError } = await import(apiUrl)
const { authErrorKey, authErrorMessage } = await import(feedbackUrl)
const dataUrl = compile(readFileSync(new URL('../src/data/index.ts', import.meta.url), 'utf8'))
const storeUrl = compile(
  readFileSync(new URL('../src/stores/app.ts', import.meta.url), 'utf8')
    .replaceAll("'@/services/api'", JSON.stringify(apiUrl))
    .replaceAll("'@/services/authApi'", JSON.stringify(authApiUrl))
    .replaceAll("'@/services/userApi'", JSON.stringify(userApiUrl))
    .replace("'@/data'", JSON.stringify(dataUrl))
    .replace("'pinia'", JSON.stringify(import.meta.resolve('pinia'))),
)
const { useAppStore } = await import(storeUrl)
const profile = {
  id: 'user-1',
  username: 'anna',
  email: 'anna@example.com',
  displayName: 'Anna',
  phone: null,
  avatarUrl: null,
}
const tokens = {
  accessToken: 'access',
  refreshToken: 'refresh',
  tokenType: 'Bearer',
  expiresIn: 900,
}
let storage
function setup(handler) {
  setActivePinia(createPinia())
  storage = new Map()
  globalThis.sessionStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  }
  globalThis.fetch = async (url, options) => handler(url, options)
  const store = useAppStore()
  store.showToast = () => {}
  return store
}
const json = (body, status = 200) => new Response(JSON.stringify(body), { status })

test('login loads the real profile and persists tokens; logout revokes the session', async () => {
  const calls = []
  const store = setup((url, options) => {
    calls.push([url, options])
    if (url.endsWith('/auth/login')) return json(tokens)
    if (url.endsWith('/users/me')) return json(profile)
    return new Response(null, { status: 204 })
  })
  await store.doLogin('anna', 'password123')
  assert.equal(store.user.name, 'Anna')
  assert.equal(JSON.parse(storage.get('markethub.tokens')).refreshToken, 'refresh')
  assert.equal(calls[1][1].headers.Authorization, 'Bearer access')
  await store.doLogout()
  assert.equal(store.user, null)
  assert.equal(storage.size, 0)
  assert.deepEqual(JSON.parse(calls[2][1].body), { refreshToken: 'refresh' })
})

test('restoration refreshes expired access tokens and retries the profile request', async () => {
  let profileCalls = 0
  const store = setup((url, options) => {
    if (url.endsWith('/auth/refresh')) return json({ ...tokens, accessToken: 'renewed' })
    if (++profileCalls === 1) return json({}, 401)
    assert.equal(options.headers.Authorization, 'Bearer renewed')
    return json(profile)
  })
  storage.set('markethub.tokens', JSON.stringify(tokens))
  await store.restoreSession()
  assert.equal(store.user.id, 'user-1')
  assert.equal(store.sessionReady, true)
  assert.equal(profileCalls, 2)
})

test('invalid refresh tokens clear the restored session', async () => {
  const store = setup(() => json({}, 401))
  storage.set('markethub.tokens', JSON.stringify(tokens))
  await store.restoreSession()
  assert.equal(store.tokens, null)
  assert.equal(store.user, null)
  assert.equal(storage.size, 0)
})

test('profile changes send every editable field and update the displayed user', async () => {
  const changes = { displayName: 'New name', avatarUrl: null, phone: '+79000000000' }
  const store = setup((url, options) => {
    assert.equal(url, '/api/users/me')
    assert.equal(options.method, 'PUT')
    assert.deepEqual(JSON.parse(options.body), changes)
    return json({ ...profile, ...changes })
  })
  store.tokens = tokens
  await store.updateProfile(changes)
  assert.equal(store.user.name, 'New name')
})

test('registration uses the backend contract and surfaces conflicts', async () => {
  const store = setup((url, options) => {
    assert.equal(url, '/api/auth/register')
    assert.deepEqual(JSON.parse(options.body), {
      username: 'anna',
      email: profile.email,
      password: 'password123',
      displayName: 'Anna',
    })
    return json({}, 409)
  })
  await assert.rejects(
    store.register('anna', profile.email, 'password123', 'Anna'),
    /already registered/,
  )
  assert.equal(store.user, null)
})

test('authentication feedback distinguishes invalid credentials from expired sessions and profile delays', () => {
  const cases = [
    [401, '/auth/login', 'login', 'credentials'],
    [401, '/auth/refresh', 'login', 'session'],
    [401, '/users/me', 'login', 'session'],
    [403, '/auth/login', 'login', 'session'],
    [409, '/auth/register', 'signup', 'conflict'],
    [400, '/auth/register', 'signup', 'validation'],
    [429, '/auth/login', 'login', 'rateLimit'],
    [0, '/auth/login', 'login', 'connection'],
    [503, '/auth/login', 'login', 'unavailable'],
    [404, '/users/me', 'login', 'profile'],
  ]
  for (const [status, path, action, expected] of cases) {
    const key = authErrorKey(new ApiError(status, 'Internal backend details', path), action)
    assert.equal(key, expected)
    for (const lang of ['en', 'ru']) {
      assert.ok(authErrorMessage(key, lang).length > 0)
      assert.ok(!authErrorMessage(key, lang).includes('Internal backend details'))
    }
  }
  assert.match(authErrorMessage('credentials', 'en'), /Invalid credentials/)
  assert.match(authErrorMessage('credentials', 'ru'), /Неверные данные/)
  assert.equal(authErrorKey(new Error('Internal backend details'), 'login'), 'unexpected')
})

test('a rejected login produces helpful feedback without creating a session', async () => {
  const store = setup(() => json({ detail: 'Internal backend details' }, 401))
  await assert.rejects(store.doLogin('anna', 'wrong-password'), (error) => {
    assert.equal(authErrorKey(error, 'login'), 'credentials')
    return true
  })
  assert.equal(store.tokens, null)
  assert.equal(store.user, null)
  assert.equal(storage.size, 0)
})

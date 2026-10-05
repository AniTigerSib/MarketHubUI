import { defineStore } from 'pinia'
import {
  type Lang,
  type Listing,
  type Thread,
  type PostForm,
  seedMine,
  seedThreads,
  blankForm,
  i18n,
} from '@/data'

export type Route = 'home' | 'search' | 'listing' | 'post' | 'account' | 'auth'

export interface AppState {
  lang: Lang
  qDraft: string
  q: string
  cat: string
  sub: string
  min: string
  max: string
  conds: string[]
  seller: string
  city: string
  sort: 'new' | 'cheap' | 'exp'
  favs: Record<number, boolean>
  user: { name: string } | null
  authTab: 'signup' | 'login'
  reason: string
  back: string
  toast: string
  homeCount: number
  catMenu: boolean
  fName: string
  accept: boolean
  lid: number
  gIdx: number
  phoneShown: Record<number, boolean>
  acctTab: 'listings' | 'favorites' | 'messages' | 'settings'
  listTab: 'active' | 'review' | 'rejected' | 'archived'
  my: Listing[]
  threads: Thread[]
  activeThread: number | null
  threadFilter: 'all' | 'buying' | 'selling'
  draftMsg: string
  form: PostForm
}

let _toastTimer: ReturnType<typeof setTimeout> | null = null

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    lang: 'en',
    qDraft: '',
    q: '',
    cat: '',
    sub: '',
    min: '',
    max: '',
    conds: [],
    seller: '',
    city: '',
    sort: 'new',
    favs: { 2: true, 4: true, 6: true, 9: true, 12: true, 16: true },
    user: null,
    authTab: 'signup',
    reason: '',
    back: 'home',
    toast: '',
    homeCount: 8,
    catMenu: false,
    fName: '',
    accept: true,
    lid: 1,
    gIdx: 0,
    phoneShown: {},
    acctTab: 'listings',
    listTab: 'active',
    my: seedMine.map((x) => ({ ...x })),
    threads: seedThreads.map((x) => ({ ...x, msgs: [...x.msgs] })),
    activeThread: seedThreads[0]?.id ?? null,
    threadFilter: 'all',
    draftMsg: '',
    form: blankForm(),
  }),

  actions: {
    showToast(message: string) {
      if (_toastTimer) clearTimeout(_toastTimer)
      this.toast = message
      _toastTimer = setTimeout(() => {
        this.toast = ''
      }, 2400)
    },

    setLang(lang: Lang) {
      this.lang = lang
    },

    toggleFav(id: number) {
      const wasFav = !!this.favs[id]
      this.favs = { ...this.favs, [id]: !wasFav }
      const t = i18n[this.lang]
      this.showToast(wasFav ? (t.removedFav ?? '') : (t.addedFav ?? ''))
    },

    resetFilters() {
      this.q = ''
      this.qDraft = ''
      this.cat = ''
      this.sub = ''
      this.min = ''
      this.max = ''
      this.conds = []
      this.seller = ''
    },

    toggleCond(c: string) {
      if (this.conds.includes(c)) {
        this.conds = this.conds.filter((x) => x !== c)
      } else {
        this.conds = [...this.conds, c]
      }
    },

    now(): string {
      const d = new Date()
      return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
    },

    sendMsg(text: string) {
      const t = i18n[this.lang]
      const id = this.activeThread
      if (!text.trim() || !id) return
      const th = this.threads.find((x) => x.id === id)
      if (!th) return
      th.msgs.push({ me: true, text: text.trim(), at: this.now() })
      this.draftMsg = ''
      if (th.role === 'buying') {
        setTimeout(() => {
          const thread = this.threads.find((x) => x.id === id)
          if (thread) thread.msgs.push({ me: false, text: t.autoReply ?? '', at: this.now() })
        }, 1400)
      }
    },

    markListingSold(id: number) {
      const t = i18n[this.lang]
      this.my = this.my.map((x) => (x.id === id ? { ...x, status: 'archived' as const } : x))
      this.showToast(t.movedArchive ?? '')
    },

    submitListing() {
      const t = i18n[this.lang]
      const f = this.form
      const item: Listing = {
        id: (f.editId as number) || Date.now(),
        mine: true,
        cat: f.cat,
        sub: f.sub,
        en: f.title.trim(),
        ru: f.title.trim(),
        price: +f.price,
        city: f.city,
        h: 0,
        cond: f.cond,
        seller: 'private',
        photo: 'your photo',
        den: f.desc.trim(),
        dru: f.desc.trim(),
        status: 'review',
        views: 0,
        favs: 0,
        chats: 0,
      }
      if (f.editId) {
        this.my = this.my.map((x) => (x.id === f.editId ? { ...x, ...item } : x))
      } else {
        this.my = [item, ...this.my]
      }
      this.acctTab = 'listings'
      this.listTab = 'review'
      this.form = blankForm()
      this.showToast(t.sentToMod ?? '')
    },

    openThreadFor(lid: number, sellerName: string) {
      const ex = this.threads.find((th) => th.lid === lid && th.role === 'buying')
      if (ex) {
        this.acctTab = 'messages'
        this.activeThread = ex.id
        return
      }
      const th: Thread = {
        id: Date.now(),
        lid,
        who: sellerName,
        role: 'buying',
        unread: 0,
        msgs: [],
      }
      this.threads = [th, ...this.threads]
      this.activeThread = th.id
      this.threadFilter = 'all'
      this.acctTab = 'messages'
    },

    doLogin(name: string) {
      const t = i18n[this.lang]
      this.user = { name }
      this.showToast(t.welcome + ', ' + name)
    },

    doLogout() {
      this.user = null
    },

    openThread(id: number) {
      this.activeThread = id
      this.threads = this.threads.map((th) => (th.id === id ? { ...th, unread: 0 } : th))
    },
  },
})

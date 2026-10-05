import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SearchView from '@/views/SearchView.vue'
import ListingView from '@/views/ListingView.vue'
import PostView from '@/views/PostView.vue'
import AccountView from '@/views/AccountView.vue'
import AuthView from '@/views/AuthView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/search', name: 'search', component: SearchView },
    { path: '/listing/:id', name: 'listing', component: ListingView },
    { path: '/post', name: 'post', component: PostView },
    { path: '/account', name: 'account', component: AccountView },
    { path: '/auth', name: 'auth', component: AuthView },
  ],
})

export default router

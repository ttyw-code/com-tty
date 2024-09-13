import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from '../App.vue'

const routes = [
  { path: '/', component: HomeView },
  //   { path: '/about', component: AboutView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router

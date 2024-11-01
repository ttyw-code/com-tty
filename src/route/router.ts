import { createMemoryHistory, createRouter } from 'vue-router'
import Periodict from '@/components/periodict-table.vue'
import Other from '@/components/com-other.vue'
import Home from '@/components/com-home.vue'

const routes = [
  { path: '/other', component: Other },
  { path: '/periodict', component: Periodict },
  { path: '/home', component: Home },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router

import { createRouter, createWebHashHistory } from 'vue-router'
import Periodict from '@/components/periodict.vue'
import AspectRatio from '@/components/aspectRatio.vue'
import Example from '@/components/exmaple.vue'
import Login from '@/components/login.vue'

const routes = [
  { path: '/aspectRatio', component: AspectRatio },
  { path: '/periodict', component: Periodict },
  { path: '/example', component: Example },
  { path: '/login', component: Login },
  { path: '/', redirect: '/periodict' }, // 默认重定向到 /periodict
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: Periodict }, // 404 页面
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router

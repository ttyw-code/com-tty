import { createRouter, createWebHistory } from 'vue-router'
import Periodict from '@/components/periodict.vue'
import Other from '@/components/other.vue'
import Home from '@/components/home.vue'
import Login from '@/components/login.vue'

const routes = [
  { path: '/other', component: Other },
  { path: '/periodict', component: Periodict },
  { path: '/home', component: Home },
  { path: '/login', component: Login },
  { path: '/', redirect: '/login' }, // 默认重定向到 /home
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: Login }, // 404 页面
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

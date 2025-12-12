import type { RouteRecordRaw, Router } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import Periodict from '@/components/periodict.vue'
import AspectRatio from '@/components/aspectRatio.vue'
import Example from '@/components/exmaple.vue'
import Login from '@/components/login.vue'
import Task from '@/components/task/index.vue'
import Home from '@/components/home/index.vue'
import Small3d from '@/components/small3d/index.vue'

const routes: RouteRecordRaw[] = [
  { path: '/aspectRatio', component: AspectRatio },
  { path: '/periodict', component: Periodict },
  { path: '/example', component: Example },
  { path: '/login', component: Login },
  { path: '/home', component: Home },
  { path: '/task', component: Task, meta: { hideNav: true } },
  { path: '/small3d', component: Small3d, meta: { hideNav: true } },
  { path: '/', redirect: '/home' }, // 默认重定向到 /periodict
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: Home }, // 404 页面
]

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router

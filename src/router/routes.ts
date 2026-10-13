import type { RouteRecordRaw } from 'vue-router'

/**
 * 路由表 —— 全站唯一的页面清单
 *
 * 约定：
 * 1. component 一律懒加载，按页面自动分包，首屏不必下载 cesium / three
 * 2. name 必填，站内跳转只用命名路由，改 path 不用改调用处
 * 3. meta.title 用于标签页标题（见 index.ts 的 afterEach）和导航文案
 * 4. meta.nav 控制是否出现在顶部导航栏，顺序即声明顺序
 * 5. meta.hideNav 用于全屏沉浸式页面
 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: 'home' },
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
    meta: { title: 'Home', nav: true },
  },
  {
    path: '/periodic',
    name: 'periodic',
    component: () => import('@/views/periodic/index.vue'),
    meta: { title: 'Periodict', nav: true },
  },
  {
    path: '/aspect-ratio',
    name: 'aspect-ratio',
    component: () => import('@/views/aspect-ratio/index.vue'),
    meta: { title: 'Other', nav: true },
  },
  {
    path: '/example',
    name: 'example',
    component: () => import('@/views/example/index.vue'),
    meta: { title: 'Example', nav: true },
  },
  {
    path: '/small3d',
    name: 'small3d',
    component: () => import('@/views/small3d/index.vue'),
    meta: { title: 'Small 3D', nav: true, hideNav: true },
  },
  {
    path: '/ai',
    name: 'ai',
    component: () => import('@/views/ai/index.vue'),
    meta: { title: 'Gemini', nav: true, hideNav: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/not-found/index.vue'),
    meta: { title: '页面不存在' },
  },
]

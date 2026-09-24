import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'

const APP_NAME = 'com-tty'

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    // 前进/后退时还原滚动位置，进入新页面回到顶部
    return savedPosition ?? { top: 0 }
  },
})

// 页面标题统一在这里处理，页面组件里不用各自操心
router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · ${APP_NAME}` : APP_NAME
})

// 需要鉴权时在这里加即可，例如：
// router.beforeEach((to) => {
//   if (to.meta.requiresAuth && !isLogin()) return { name: 'home' }
// })

export default router

// 扩展 vue-router 的 RouteMeta 类型（declaration merging）
// 这样 routes.ts 里写 meta 时就有类型约束和补全，组件里读 route.meta 也不会是 any
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题：写入 document.title，同时作为导航文案 */
    title: string
    /** 是否出现在顶部导航栏 */
    nav?: boolean
    /** 全屏页面（如 3D 场景）隐藏导航栏 */
    hideNav?: boolean
  }
}

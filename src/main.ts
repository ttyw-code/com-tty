// import './style.css';

import App from './App.vue'
// 全局样式（包含主题变量）：
import '@/styles/index.scss'
import router from '@/router'
import store from './store'
//引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// @ts-expect-error element-plus 未提供 zh-cn.mjs 的类型声明
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import 'virtual:svg-icons-register' //@use   <!-- <svg-icon name="window" width="100px" height="100px"></svg-icon> -->

// 在应用创建前，应用上次保存的主题（若有）
import { applySavedTheme } from './utils/theme'
applySavedTheme()

import gloablComponent from '@/components/index'

const app = createApp(App).use(router).use(store)
app.use(ElementPlus, {
  locale: zhCn,
})

app.use(gloablComponent)
console.log('---------------------start')
void PromiseMain()
console.log('---------------------end')
app.mount('#app')

export async function PromiseMain() {
  const drain = () => new Promise((r) => setTimeout(r, 0))
  const out = [] as any[]
  const L = (s: string) => out.push(s)

  const p = Promise.resolve('v')
  L('sync')
  ;(async () => {
    await p
    L('await 恢复')
  })()
  p.then(() => L('then'))
  queueMicrotask(() => L('queueMicrotask'))
  setTimeout(() => L('setTimeout 宏任务'))

  await drain()
  console.log(out)
}

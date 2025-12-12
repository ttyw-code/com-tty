// import './style.css';

import App from './App.vue'
// 全局样式（包含主题变量）：
import '@/styles/index.scss'
import router from './route/router'
import store from './store'
//引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import 'virtual:svg-icons-register' //@use   <!-- <svg-icon name="window" width="100px" height="100px"></svg-icon> -->

// 在应用创建前，应用上次保存的主题（若有）
import { applySavedTheme } from './utils/theme'
applySavedTheme()

import gloablComponent from '@/components/index'

// import { WebSocketManager } from '@/utils/webSocket/webSocketManager.js'

const app = createApp(App)
  .use(router)
  // .use(WebSocketManager.getInstance())
  .use(store)
app.use(ElementPlus, {
  locale: zhCn,
})

app.use(gloablComponent)

app.mount('#app')

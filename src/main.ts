import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './route/router'
//引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import 'virtual:svg-icons-register'

import gloablComponent from './components/index'

console.log(import.meta.env)

const app = createApp(App).use(router)
app.use(ElementPlus, {
  locale: zhCn,
})

app.use(gloablComponent)

app.mount('#app')

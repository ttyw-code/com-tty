import { createApp } from 'vue'
// import './style.css';

import App from './App.vue'
import router from './route/router'
//引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import 'virtual:svg-icons-register' //@use   <!-- <svg-icon name="window" width="100px" height="100px"></svg-icon> -->

import gloablComponent from '@/components/index'

import webSocketManager from '@/utils/webSocket/webSocketManager.js'

const app = createApp(App).use(router).use(webSocketManager)
app.use(ElementPlus, {
  locale: zhCn,
})

app.use(gloablComponent)

app.mount('#app')

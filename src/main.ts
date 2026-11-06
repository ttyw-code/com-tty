import App from './App.vue'
// 全局样式（包含主题变量）：
import '@/styles/index.scss'
import router from '@/router'
import store from './store'

import 'virtual:svg-icons-register' //@use   <!-- <svg-icon name="window" width="100px" height="100px"></svg-icon> -->

// 在应用创建前，应用上次保存的主题（若有）
import { applySavedTheme } from './utils/theme'
applySavedTheme()

import gloablComponent from '@/components/index'

import { CallMain } from '@/common/ndoe/call.ts'

const app = createApp(App).use(router).use(store)

app.use(gloablComponent)
app.mount('#app')

if (navigator.gpu) {
  console.log('支持WebGPU')
} else {
  console.log('不支持WebGPU')
}

// 统一调用实验代码
void CallMain()

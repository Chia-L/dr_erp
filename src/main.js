import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// vxe-table
import 'xe-utils'
import 'vxe-table/lib/style.css'
import VXETable from 'vxe-table'

// 自适应
import "amfe-flexible/index.js";

import '@/assets/iconfont/iconfont.css'
import '@/assets/iconfont/iconfont.js'
import '@/assets/iconfont/iconfont.ttf'
import '@/assets/iconfont/iconfont.woff'

import 'view-ui-plus/dist/styles/viewuiplus.css'
import ViewUIPlus from 'view-ui-plus'

//element-plus ResizeObserver 低版本浏览器的兼容
import ResizeObserver from 'resize-observer-polyfill'
window.ResizeObserver = ResizeObserver

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(ViewUIPlus)
app.use(ElementPlus)
app.use(VXETable)

app.use(createPinia())
  .use(router)

app.mount('#app')

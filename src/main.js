import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// vxe-table
import 'xe-utils'
import 'vxe-table/lib/style.css'
import VXETable from 'vxe-table'

// element-plus
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

// view-ui-plus
import 'view-ui-plus/dist/styles/viewuiplus.css'
import ViewUIPlus from 'view-ui-plus'

import '@/assets/iconfont/iconfont.css'
import '@/assets/iconfont/iconfont.js'
import '@/assets/iconfont/iconfont.ttf'
import '@/assets/iconfont/iconfont.woff'

// 自适应
import "amfe-flexible/index.js";

//element-plus ResizeObserver 低版本浏览器的兼容
import ResizeObserver from 'resize-observer-polyfill'
window.ResizeObserver = ResizeObserver

const app = createApp(App)

app.use(ViewUIPlus)
app.use(ElementPlus)
app.use(VXETable)

app.use(createPinia())
  .use(router)

app.mount('#app')

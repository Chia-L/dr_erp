import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// view-design
import 'view-ui-plus/dist/styles/viewuiplus.css'
import ViewUIPlus from 'view-ui-plus'

// element
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

// vxe-table
import 'xe-utils'
import 'vxe-table/lib/style.css'
import VXETable from 'vxe-table'

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

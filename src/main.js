import { createApp } from 'vue'
import pinia from '@/stores/index'

import App from './App.vue'
import router from './router'
import '/src/router/initDynamicRoutes'
import directives from '@/directives/index'
import uiConfig from '/public/static/config/uiConfig'

// vxe-table
import 'xe-utils'
import 'vxe-table/lib/style.css'
import VXETable from 'vxe-table'

// element-plus
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


// view-ui-plus
import 'view-ui-plus/dist/styles/viewuiplus.css'
// import ViewUIPlus from 'view-ui-plus'

import '@/assets/iconfont/iconfont.css'
import '@/assets/iconfont/iconfont.js'
import '@/assets/iconfont/iconfont.ttf'
import '@/assets/iconfont/iconfont.woff'

// 自适应
import "amfe-flexible/index.js";

import "/src/assets/css/comm.less"

//element-plus ResizeObserver 低版本浏览器的兼容
import ResizeObserver from 'resize-observer-polyfill'
window.ResizeObserver = ResizeObserver

const app = createApp(App)

app.config.globalProperties.__drParams = Object.freeze(uiConfig)
document.title = uiConfig.title

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus, {
  locale: zhCn,
})
app.use(VXETable)

app.use(pinia)
  .use(router)
  .use(directives)

app.mount('#app')

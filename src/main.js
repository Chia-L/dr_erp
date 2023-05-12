import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// vxe-table
import 'xe-utils'
/*import { Button, Modal } from 'vxe-table'
function useVxeTable (app) {
  // 可选组件
  app.use(Button)
    .use(Modal)
}*/
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

function useVxeTable (app) {
  app.use(VXETable)
}

import 'view-ui-plus/dist/styles/viewuiplus.css'
import ViewUIPlus from 'view-ui-plus'

const app = createApp(App)

app.use(createPinia())
  .use(router)
  .use(useVxeTable)
  .use(ViewUIPlus)

app.mount('#app')

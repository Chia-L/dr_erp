import { createRouter, createWebHashHistory } from 'vue-router'
import Test from '@/views/stepper/Test.vue'
import Base from '@/views/Base.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Base',
      component: Base
    }
  ]
})

export default router

import { createRouter, createWebHashHistory } from 'vue-router'
import Test from '@/views/stepper/Test.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Test',
      component: Test
    }
  ]
})

export default router

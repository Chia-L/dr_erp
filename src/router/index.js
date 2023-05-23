import { createRouter, createWebHashHistory } from 'vue-router'
import Test from '@/views/stepper/Test.vue'
import SqGridDemo from '@/views/SqGridDemo/index.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Test',
      component: Test
    },
    {
      path: '/sq_grid_demo',
      name: 'SqGridDemo',
      component: SqGridDemo
    }
  ]
})

export default router

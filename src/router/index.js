import { createRouter, createWebHashHistory } from 'vue-router'
import Base from '@/views/Base.vue'
import SqGridDemo from '@/views/SqGridDemo/index.vue'
import PlanManage from '@/views/PlanManage/PlanManage.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Base',
      component: Base
    },
    {
      path: '/sq_grid_demo',
      name: 'SqGridDemo',
      component: SqGridDemo
    },
    {
      path: '/plan_manage',
      name: 'PlanManage',
      component: PlanManage
    }
  ]
})

export default router

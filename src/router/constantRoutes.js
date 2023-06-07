/* 静态路由 */
export const staticRoutes = [
  {
    path: '/',
    redirect: '/dr',
  },
  {
    path: '/sq_grid_demo',
    name: 'SqGridDemo',
    component: () => import('@/views/SqGridDemo/index.vue')
  },
  {
    path: '/plan_manage',
    name: 'PlanManage',
    component: () => import('@/views/PlanManage/PlanManage.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  }
]

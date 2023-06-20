/* 静态路由 */
export const staticRoutes = [
  {
    path: '/',
    redirect: '/dr',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  }
]

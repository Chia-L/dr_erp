import { defineStore } from 'pinia'
import dynamicRoutes from '@/router/dynamicRoutes'

export const  useAuthStore = defineStore({
  id: 'auth-store',
  state: () => ({
    routeName: '',
    // 后端返回的按钮权限列表
    authButtonList: [],
    // 后端返回的路由列表
    authRouterList: [],
    // 处理之后侧边栏菜单列表
    authMenuList: [],
  }),
  actions: {
    // 设置路由名称
    setRouteName(name) {
      this.routeName = name
    },

    // 设置用户权限信息
    setAuth(authInfo) {
      this.authButtonList = authInfo.buttons
      const routes = authInfo.routes || []
      this.authRouterList = routes.length > 0 ? routes.concat(dynamicRoutes.map(route => route.name)) : routes
    },

    // 设置菜单
    setAuthMenuList(list) {
      this.authMenuList = list
    },
  }
})

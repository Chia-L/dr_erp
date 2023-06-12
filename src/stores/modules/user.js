import { defineStore } from 'pinia'
import { logout, getUserInfo } from 'apis/login'
import { useAuthStore } from './auth'

export const useUserStore = defineStore({
  id: 'user-store',
  state: () => ({
    token: 'aaa',
    userInfo: null,
  }),
  actions: {
    // 设置token
    setToken(token) {
      this.token = token
    },
    // 设置用户信息
    setUserInfo(userInfo) {
      this.userInfo = userInfo
    },
    async GetInfoAction() {
      const { data } = await getUserInfo(Cookies.get('user'))
      const { buttons, routes } = data
      const authStore = useAuthStore()
      // 存储用户信息
      this.setUserInfo(this.userInfo)
      // 存储用户权限信息
      authStore.setAuth({ buttons, routes })
    },
    // 重置
    resetStore() {
      this.$reset()
    },
    async userLogout() {
      await logout()
      this.resetStore()
    }
  },
  persist: true,
})

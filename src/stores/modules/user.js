import { defineStore } from 'pinia'
import { httpHelper } from '@/utils/httpHelper'
import { useAuthStore } from './auth'
import Cookies from 'js-cookie'

export const useUserStore = defineStore({
  id: 'user-store',
  state: () => ({
    token: null,
    user: null
  }),
  actions: {
    // 设置token
    setToken(token) {
      this.token = token
    },
    // 设置用户信息
    setUserInfo(user) {
      this.user = user
    },
    async GetInfoAction() {
      const user = await httpHelper('/api/menu/fetch/', 'POST').catch((e => {throw new Error(e)}))
      const { data } = user
      const { buttons, routes } = data
      const authStore = useAuthStore()
      // 存储用户权限信息
      authStore.setAuth({ buttons, routes })
    },
    // 重置
    resetStore() {
      this.$reset()
      useAuthStore().$reset()
      useAuthStore().$reset()
      this.clearCookie()
      localStorage.clear()
    },
    clearCookie() {
      Cookies.remove('sessionid')
      var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
      if(keys) {
        for(let i = keys.length; i--;)
          document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
      }
    }
  },
  persist: true,
})

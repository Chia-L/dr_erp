/**
 * v-auth
 * 按钮权限指令
 */
import { useAuthStore } from '@/stores/modules/auth'

function doAuth(el, binding, opt, invert=false) {
  const { value } = binding
  const authStore = useAuthStore()
  const currentPageRoles = authStore.authButtonList ?? []
  if (value instanceof Array && value.length) {
    const hasPermission = value.every(item =>
      currentPageRoles.includes(item),
    )
    if (invert) hasPermission && el[opt]()
    else {
      !hasPermission && el[opt]()
    }
  } else {
    if (invert) currentPageRoles.includes(value) && el[opt]()
    else {
      !currentPageRoles.includes(value)
    }
  }
}

/**
 * 显示指令
 * @type {{mounted(*=, *=): void}}
 */
export const authDisplay = {
  mounted(el, binding) {
    const { value } = binding
    const authStore = useAuthStore()
    const currentPageRoles = authStore.authButtonList ?? []
    if (value instanceof Array && value.length) {
      const hasPermission = value.every(item =>
        currentPageRoles.includes(item),
      )
      !hasPermission && el.remove()
    } else {
      !currentPageRoles.includes(value) && el.remove()
    }
  },
}

/**
 * 禁用指令
 * @type {{mounted(*=, *=): void}}
 */
export const authDisable = {
  mounted(el, binding) {
    const { value } = binding
    const authStore = useAuthStore()
    const currentPageRoles = authStore.authButtonList ?? []
    if (value instanceof Array && value.length) {
      const hasPermission = value.every(item =>
        currentPageRoles.includes(item),
      )
      el.setAttribute("disabled", hasPermission)
    } else {
      el.setAttribute("disabled", currentPageRoles.includes(value))
    }
  },
}

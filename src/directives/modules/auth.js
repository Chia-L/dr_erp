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
    let hasPermission = false
    if (value instanceof Array && value.length) {
      hasPermission = value.every(item =>
        currentPageRoles.includes(item),
      )


    } else {
      hasPermission = currentPageRoles.includes(value)
    }
    el.setAttribute("disabled", hasPermission)
    const className = 'is-disabled'
    if (hasPermission) el.classList.add(className)
    else el.classList.add(className)
  },
}

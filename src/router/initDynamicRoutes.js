import { returnType } from '@/utils/tools'
import router from './index'
import {  cloneDeep } from 'lodash'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'
import { useAuthStore } from '@/stores/modules/auth'
import dynamicRoutes from './dynamicRoutes'

import Cookies from 'js-cookie'
const LOGIN_URL = '/login'
const ROUTER_WHITE_LIST = []
/**
 * @desc 全局前置守卫
 */
router.beforeEach(async (to, from, next) => {
  const token = useUserStore().token
  // 判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由并放行到登陆页
  if (to.path === LOGIN_URL) {
    if (token) return next(from.fullPath)
    return next()
  }

  // 判断访问页面是否在路由白名单(不需要登陆)地址中，如果存在直接放行
  if (ROUTER_WHITE_LIST.includes(to.path))return next()

  // .判断是否有 Token，没有token跳转到登陆页面并且携带原目标路径
  if (!token) {
    return next({ path: LOGIN_URL, query: { redirect: to.fullPath } })
  }
  const authStore = useAuthStore()
  //
  if (!authStore.authRouterList.length) {
    const { path } = to
    let basePath = path.split('/')[1]
    basePath = basePath ? '/' + basePath : ''
    await initDynamicRouter(basePath)
    return next({ ...to, replace: true })
  }
  next()
})

async function initDynamicRouter(basePath) {
  const authStore = useAuthStore()
  const userStore = useUserStore()

  try {
    // 请求用户信息，携带路由权限信息
    await userStore.GetInfoAction()

    // 判断当前用户有没有菜单权限
    if (!authStore.authRouterList.length) {
      ElMessage.warning('当前账号无任何菜单权限，请联系系统管理员！')
      userStore.resetStore()
      router.replace(LOGIN_URL)
      return Promise.reject('No permission')
    }

    // 过滤路由
    const routerList = filterAsyncRoutes( dynamicRoutes, authStore.authRouterList)

    // 添加动态路由
    routerList.forEach((route) => {
      router.addRoute(route)
    })
    //处理subMenu数据
    const menuList = getMenuList(cloneDeep(routerList), basePath)
    authStore.setAuthMenuList(menuList)
  } catch (error) {
    // 当按钮 || 菜单请求出错时，重定向到登陆页
    userStore.resetStore()
    router.replace(LOGIN_URL)
    return Promise.reject(error)
  }
}

/**
 * @desc  获取动态路由
 * @param dynamicRoutes
 * @param authRouterList
 * @returns {*}
 */
function filterAsyncRoutes(dynamicRoutes, authRouterList) {
  return dynamicRoutes.filter(route => {
    //  路由名字不在授权路由列表中，直接滤掉。
    if (!authRouterList.includes(route.name)) return false
    // 有子路由就递归
    if (returnType(route.children) === 'array' && route.children.length > 0) {
      route.children = filterAsyncRoutes(route.children, authRouterList)
      // 子路由都无授权且该路由无组件，直接滤掉
      if (route.children.length === 0 && !route.component) return false
      route.redirect = route.children[0]?.path ?? null
    }
    if (returnType(route?.meta?.sidebar) === 'array' && route.children.length > 0) {
      route.meta.sidebar = route.meta.sidebar.filter(o => authRouterList.includes(o.name))
    }
    // 将路由元信息的title放外层，方便导航栏和菜单栏使用
    route.title = (route?.meta?.title) ?? ''
    route.id = (route?.path) ?? ''
    return true
  })
}

/**
 * @description 获取menu
 * @param routerList
 */
function getMenuList(routerList, basePath) {
  const menus = makeMeta(routerList)
  const target = (menus.find(menu => menu.path === basePath )?.children) ?? []
  formatMenu(target)
  return target
}

/**
 * @description 将chilren的中的路由在sidebar归组
 * @param list
 * @returns {*}
 */
function makeMeta(list) {
  if (list.length === 0) return []
  for (let i = 0; i < list.length; i++ ) {
    const route = list[i]
    // 判断是否存在children，没有（或者为空）就放过，继续迭代下一个
    if (!route.children || (returnType(route.children) === 'array') && route.children.length === 0) continue;
    // 判断是否存在sidebar有children，
    if (!!route?.meta?.sidebar && returnType(route.meta.sidebar) === 'array') {
      // route.meta.sidebar克隆后赋空是为了解决sidebar中的数据和路由定义时的顺序不一样
      const cloneSidebar = cloneDeep(route.meta.sidebar)
      route.meta.sidebar = []
      route.children.forEach(item => {
        const parentId = item?.meta?.parentId
        const curSidebar =  parentId && cloneSidebar.find(s => s.id === parentId)
        // 1 判断有没有父id（或者在sidebar中有没有该父id），没有就直接推入sidebar，否则执行2
        if (!parentId || !curSidebar) {
          route.meta.sidebar.push(item)
        }
        else {
          let target = route.meta.sidebar.find(s => s.id === curSidebar.id)
          // 判断在route.meta.sidebar中是否存在该组，不存在就推入，并将target赋值为cloneSidebar中的该组
          if (!target) {
            target = curSidebar
            route.meta.sidebar.push(curSidebar)
          }
          // 判断sidebar的项们是否有children属性（且是数组），没有的话就赋值为空数组
          if (!target.children || !(returnType(target.children) === 'array')){
            target.children = []
          }
          target.children.push(item)
        }
      })
      // sidebar元信息的title放在外层
      route.meta.sidebar = route.meta.sidebar.map(item => {
        item.title = item?.meta?.title ?? ''
        return item
      })
      const firstSide = route.meta.sidebar[0]
      route.redirect = returnType(firstSide.children) === 'array' ? firstSide?.children[0]?.path : (firstSide?.path || null)
    }
    makeMeta(route.children)
  }
  return list
}

function formatMenu(data, prePath = [], isInnerSidebar = false) {
  function formatProty (obj,  path = null) {
    if (!obj.meta) obj.meta = {}
    if (!obj.meta.pathList) obj.meta.pathList = cloneDeep(prePath)
    obj.meta.pathList.push({label: obj?.meta?.title, path: path || obj.path})
  }

  if (returnType(data) === 'array') {
    if (data.length === 0) return []
    data.forEach(item => {
      if (isInnerSidebar && returnType(item.children) === 'array' && item.children.length) {
        const path = item.children[0].path
        formatProty(item, path)
        formatMenu(item.children, cloneDeep(item.meta.pathList), false)
      }else {
        formatProty(item, null)
      }

      if (returnType(item.meta?.sidebar) === 'array' && item.meta.sidebar.length) {
        formatMenu(item.meta.sidebar, item.meta.pathList, true)
      }
    })
  }
}

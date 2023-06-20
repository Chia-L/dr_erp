<script setup>
import { RouterView } from 'vue-router'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import { useAuthStore } from '@/stores/modules/auth'
import useGlobalProperties from '@/hooks/globalVar'
import RecElSubMenu from 'comps/RecElSubMenu.vue'
import moment from 'moment'
import {ElMessage} from "element-plus";
import { httpHelper } from "@/utils/httpHelper";

const userStore = useUserStore()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const { baseLogo, baseLogoHeight, productName} = useGlobalProperties().__drParams
const todoNumRef = ref(2)
const timerRef = ref({
  notice: null,
  sys: null
})
const serverTime = ref(moment().format('YYYY-MM-DD HH:mm:ss'))
setInterval(() => {
  serverTime.value = moment().format('YYYY-MM-DD HH:mm:ss')
}, 1 * 1000)
const menus = authStore.authMenuList

/* computed */
const defNavRef = computed(()  => {
  let { path } = route
  path = '/' + path.split('/').slice(1, 3).join('/')
  return path
})
const defSidebar = computed(() => {
  return route.path
})
const sidebar = computed(() => {
  const curMenu = authStore.authMenuList.find(menu => {
    return menu.path === defNavRef.value
  })
  let sidebar = (curMenu?.meta?.sidebar) ?? (authStore.authMenuList[0]?.meta?.sidebar)
  sidebar = sidebar || []
  return sidebar
})

/* 普通函数 */

/* method */
/**
 * @description 顶部导航栏发生改变
 * @param menu
 */
function onNavSelect(path) {
  path && router.push({path: path})
}
/**
 * @description 侧边栏发生改变
 * @param menu
 */
function onSidebarSelect(path) {
  path && router.push({path: path})
}

/**
 * @description 登出
 */
function onLogout() {
  httpHelper('/api/account/logout/', 'POST').then(res => {
    if (Number(res.r) !== 0) {
      return ElMessage.error(res.e)
    }
    userStore.resetStore()
    router.push('/login')
  })
}

/**
 * 获取消息
 */
function getNotice() {
  clearTimeout(timerRef.value.notice)
  timerRef.value.notice = null
  timerRef.value.notice = setTimeout(() => {
    httpHelper('/api/account/fetch_notice/', 'POST')
      .then(res => {
        if (Number(res.r) !== 0) return ElMessage.error(res.e)
        todoNumRef.value = (res.data?.list?.length ?? 0)
      })
      .catch(console.error)
      .finally(() => {
        // getNotice()
      })
  },10 * 1000)
}

/**
 * 获取系统时间
 */
function getSysTime() {

}

onMounted(() => {
  getNotice()
  getSysTime()
})

onUnmounted(() => {
  Object.keys(timerRef.value).forEach(key => {
    clearTimeout(timerRef.value[key])
    timerRef.value[key] = null
  })
})
</script>

<template>
  <div class="clw-view">
    <section class="clw-container is-vertical">
      <header class="clw-header">
        <div class="clw-header-left">
          <div class="clw-header-logo">
            <img :src="baseLogo" :height="baseLogoHeight">
            <span v-text="productName"></span>
          </div>
          <el-menu
            :default-active="defNavRef"
            class="header-menu"
            mode="horizontal"
            @select="onNavSelect"
          >
            <el-menu-item v-for="menu in menus"
                          :index="menu.id"
                          :key="menu.id"
                          v-text="menu?.meta?.title"></el-menu-item>
          </el-menu>
        </div>
        <div class='clw-header-right'>
          <el-badge class="header-msg-icon" :value="todoNumRef" :max="99"
                    v-show="todoNumRef !== 0"
                    :style="{marginRight: todoNumRef * 0.1 + 4 + 'px'}">
            <i class="iconfont i-notice info-f20 iconfont-wode"></i>
          </el-badge>
          <i class="iconfont i-notice info-f20 iconfont-wode" v-show="todoNumRef === 0"></i>
          <el-divider direction="vertical" />
          <el-dropdown trigger="click"
                       class="user-view"
                       popper-class="no-el-popper__arrow">
            <span class="el-dropdown-link">
              <i class="iconfont i-personal-center"></i>
              <span v-text="userStore.user"></span>
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="onLogout">登出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-divider direction="vertical" />
          <span>服务时间：<span v-text="serverTime"></span></span>
        </div>
      </header>
      <section class="clw-container is-allcontent">
        <transition>
          <aside class="clw-aside" v-if="sidebar && sidebar.length > 0">
            <el-menu
              :default-active="defSidebar"
              class="clw-sidebar"
              @select="onSidebarSelect"
            >
              <rec-el-sub-menu :sidebar="sidebar"
                               index-name="id"
                               label-name="title"></rec-el-sub-menu>
            </el-menu>
          </aside>
        </transition>
        <main class="clw-main">
          <router-view></router-view>
        </main>
      </section>
    </section>
  </div>
</template>

<style lang="less">
.header-menu.el-menu {
  flex: 1;
  height: @page-header-height;
  background-color: transparent;
  border-bottom-width: 0;
}
.header-menu.el-menu .el-menu-item,
.header-menu.el-menu .el-sub-menu,
.header-menu.el-menu .el-sub-menu .el-sub-menu__title{
  padding-top: 4px;
  margin-bottom: 0;
  border-bottom-width: 4px;
  font-size: 14px;
  color: #E8EAEC;
  line-height: 0;
}
.header-menu.el-menu .el-menu-item:not(.is-disabled):focus,
.header-menu.el-menu .el-menu-item:not(.is-disabled):hover,
.header-menu.el-menu .el-sub-menu__title:hover {
  color: #E8EAEC!important;
  background-color: rgba(255, 255, 255, 0.3)!important;
}
.header-menu.el-menu .el-menu-item.is-active {
  background-color: rgba(255, 255, 255, 0.3);
  color: #FFFFFF!important;
  border-bottom: 4px solid rgb(45, 183, 245);
  font-weight: 700;
}
.clw-sidebar.el-menu {
  width: @page-aside-width;
}
.clw-sidebar.el-menu,
.clw-sidebar.el-menu .el-menu {
  border-right-width: 0;
  background-color: transparent;
}
.clw-sidebar .el-sub-menu .el-sub-menu__title {
  color: rgb(107, 107, 107)!important;
}
.clw-sidebar.el-menu .el-menu-item {
  color: rgb(242, 242, 242);
  line-height: 0;
}
.clw-sidebar.el-menu .el-sub-menu__title:hover,
.clw-sidebar.el-menu .el-menu-item.is-active,
.clw-sidebar.el-menu .el-menu-item:hover {
  background-color: #1B454D;
}
.no-el-popper__arrow {
  margin-top: -4px;
  .el-popper__arrow {
    display: none;
  }
}
</style>
<style scoped lang="less">
.clw-view {
  width: 100vw;
  height: 100vh;
  min-width: @page-min-width;
  min-height: @page-min-height;
  section {
    height: 100%;
  }
  .clw-container {
    display: flex;
    flex-direction: row;
    flex: 1;
    box-sizing: border-box;
    .clw-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: @page-header-height;
      padding: 0 10px;
      background-color: @page-header-bk;
      .clw-header-left, .clw-header-right {
        display: flex;
        align-items: center;
        color: #E8EAEC;
        font-size: 14px;
      }
      .clw-header-left {
        flex: 1;
      }
      .clw-header-logo {
        display: flex;
        align-items: center;
        min-width: 230px;
        span {
          color: #FFFFFF;
          font-size: 14px;
          font-weight: bolder;
          margin-left: 10px;
        }
      }
      .user-view {
        :deep(.el-dropdown-link) {
          display: flex;
          align-items: center;
          color: #E8EAEC;
          i.i-personal-center {
            margin-right: 5px;
            font-size: 18px;
          }
        }
      }
    }
    .clw-container {
      height: calc(100vh - @page-header-height);
    }
    .clw-aside {
      width: @page-aside-width;
      background-color: #1D2E32;
      overflow: hidden;
      overflow-y: auto;
    }
    .clw-main {
      display: flex;
      flex: 1;
      flex-basis: auto;
      width: calc(100% - 240px);
    }
  }
  .is-vertical {
    flex-direction: column;
  }
}
</style>

<script setup>
import { RouterView } from 'vue-router'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth'
import RecElSubMenu from 'comps/RecElSubMenu.vue'
import moment from 'moment'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const productName = "科力锐灾备云"
const serverTime = ref(moment().format('YYYY-MM-DD HH:mm:ss'))
setInterval(() => {
  serverTime.value = moment().format('YYYY-MM-DD HH:mm:ss')
}, 1 * 1000)

const menus = authStore.authMenuList

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
</script>

<template>
  <div class="clw-view">
    <section class="clw-container is-vertical">
      <header class="clw-header">
        <div class="clw-header-left">
          <div class="clw-header-logo">
            <img src="/images/logo.png">
            <span v-text="productName"></span>
          </div>
          <el-menu
            :default-active="defNavRef"
            class="header-menu"
            mode="horizontal"
            @select="onNavSelect"
          >
            <el-menu-item v-for="(menu, index) in menus"
                          :index="menu.id"
                          v-text="menu?.meta?.title"></el-menu-item>
          </el-menu>
        </div>
        <div class='clw-header-right'>
          消息
          <el-divider direction="vertical" />
          用户
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
</style>
<style scoped lang="less">
.clw-view {
  width: 100vw;
  height: 100vh;
  min-width: 1360px;
  min-height: 860px;
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

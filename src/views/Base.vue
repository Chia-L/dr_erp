<script setup>
import PlanManage from '@/views/PlanManage/PlanManage.vue'
import { httpHelper } from '@/utils/axios.js'
httpHelper('/api/account/token/', 'post').then(function(e) {
  console.log('dddd', e)
}).catch(e => {})
</script>

<template>
  <div class="clw-view">
    <section class="clw-container is-vertical">
      <header class="clw-header"></header>
      <section class="clw-container is-allcontent">
        <aside class="clw-aside"></aside>
        <main class="clw-main">
          <PlanManage/>
        </main>
      </section>
    </section>
  </div>
</template>

<style scoped lang="less">
.clw-view {
  width: 100vw;
  height: 100vh;
  min-width: 1360px;
  //min-height: 860px;
  .is-allcontent {

  }
  section {
    height: 100%;
  }
  .clw-container {
    display: flex;
    flex-direction: row;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;
    .clw-header {
      display: flex;
      justify-content: center;
      align-items: center;
      height: @pageHeaderH;
      background-color: @pageHeaderBk;
    }
    .clw-aside {
      display: flex;
      justify-content: center;
      align-items: center;
      width: @pageAsideW;
      background-color: #1D2E32;
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

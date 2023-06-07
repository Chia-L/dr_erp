<!--
  递归 element sub-menu组件
 -->
<script setup>
import RecElSubMenu from 'comps/RecElSubMenu.vue'
const props = defineProps({
  sidebar: {
    type: Array,
    default: () => {
      return []
    }
  },
  indexName: {
    type: String,
    default: 'index'
  },
  labelName: {
    type: String,
    default: 'title'
  }
})
</script>

<template>
  <template v-for="item in props.sidebar">
    <el-sub-menu v-if="item.children && item.children.length > 0"
                 :index="item[props.indexName]"
                 :key="item[props.indexName]"
                 v-bind="$attrs">
      <template #title>
        <span v-text="item[props.labelName]"></span>
      </template>
        <rec-el-sub-menu :sidebar="item.children"
                         :index-name="props.indexName"
                         :label-name="props.labelName"></rec-el-sub-menu>
    </el-sub-menu>
    <el-menu-item v-else
                  :index="item[props.indexName]"
                  :key="item[props.indexName]">
      <i class="iconfont" :class='item.icon'></i>
      <span v-text="item[props.labelName]"></span>
    </el-menu-item>
  </template>
</template>

<style scoped lang="less">
.iconfont {
  margin-right: 5px;
}
</style>

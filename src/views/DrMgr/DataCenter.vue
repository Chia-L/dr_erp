<script setup>
const a = false
const b = true
</script>

<template>
  <div>
    <span>数据中心</span>
    <el-button type="primary"
               v-auth-display="['DrMgr.ResourceMgr.DataCenter.new.display']"
               v-auth-disable="['DrMgr.ResourceMgr.DataCenter.new.disabled']"
    >新建</el-button>
  </div>
</template>

<style scoped>
</style>

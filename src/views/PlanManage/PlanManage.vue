<template>
  <div class="PlanManage_v">
    <div style="height: 100%; width: 265px; border: 1px solid red; min-width: 265px;"></div>
    <div style="width: calc(100% - 265px); min-width: 900px;">
      <div style="height: 50px; width: 100%; border: 1px solid red">
      </div>
      <div class="plan-manage-case-list">
        <component :is="listCompsRef" @NewBuiltPlan="NewBuiltPlan"></component>
      </div>
    </div>
  </div>
</template>

<script setup>
import { shallowRef, ref } from 'vue'
import PlanManagePlanList from './compontents/PlanManagePlanList.vue'
let listCompsRef = shallowRef(PlanManagePlanList)
let NewBuiltPlan = () => {
  listCompsRef.value = 'NewBuiltPlan'
}
</script>

<style scoped>
.PlanManage_v {
  width: 100%;
  height: 100vh;
  display: flex;
}

.plan-manage-case-list {
  width: 100%;
  height: calc(100% - 50px);
  padding: 16px;
}
</style>

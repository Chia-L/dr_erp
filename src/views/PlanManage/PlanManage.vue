<template>
  <div class="PlanManage_v">
    <div class="left_tree" ref="leftTreeRef">
      <PlanManageTree v-show="treeIsOpenRef"></PlanManageTree>
      <div class="tree_fold" @click="treeFoldFun">
        <span class="tree_fold_bg"></span>
        <span class="tree_fold_arrow" :class="{'open_arrow': !treeIsOpenRef}"></span>
      </div>
    </div>
    <div class="plan-manage-case-content">
      <div style="height: 50px; width: 100%; border: 1px solid red"></div>
      <div class="plan-manage-case-list">
        <component :is="listCompsRef" @NewBuiltPlan="NewBuiltPlan"></component>
      </div>
    </div>
  </div>
</template>

<script setup>
import PlanManageTree from '@/views/PlanManage/compontents/PlanManageTree.vue'
import PlanManagePlanList from '@/views/PlanManage/compontents/PlanManagePlanList.vue'
import { ref, shallowRef } from 'vue'

let listCompsRef = shallowRef(PlanManagePlanList)
let NewBuiltPlan = () => {
  listCompsRef.value = 'NewBuiltPlan'
}
let treeIsOpenRef = ref(true)
const leftTreeRef = ref(null)
function treeFoldFun() {
  treeIsOpenRef.value = !treeIsOpenRef.value
  if(treeIsOpenRef.value){
    leftTreeRef.value.style.width = '280px'
  } else {
    leftTreeRef.value.style.width = '0'
  }
}
</script>

<style scoped>
.PlanManage_v {
  display: flex;
  width: 100%;
}

.plan-manage-case-content {
  min-width: 900px;
  width: 100%;
}

.plan-manage-case-list {
  width: 100%;
  height: calc(100% - 55px);
  padding: 16px 10px;
}

.left_tree{
  height: 100%;
  width: 280px;
  position: relative;
}
.tree_fold{
  position: absolute;
  cursor: pointer;
  top: 50%;
  right: -8px;
  transform: translateY(-50%);
  width: 9px;
  height: 50px;
}
.tree_fold_bg{
  display: block;
  height: 50px;
  background:no-repeat url("@/assets/images/foldbg.png");
}
.tree_fold_arrow{
  position: absolute;
  display: block;
  width: 5px;
  height: 10px;
  background:no-repeat url("@/assets/images/jiantou.png");
  top: 40%;
  left: 2px;
  transform: translate(-50%);
  transition: 0.5s;
}
.tree_fold_arrow.open_arrow{
  transform-origin: center;
  top: 50%;
  transform: translateY(-50%) rotateY(3rad);
  transition: 0.5s;
  left: 1px;
}
</style>

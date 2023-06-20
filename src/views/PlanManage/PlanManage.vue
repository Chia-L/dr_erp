<template>
  <div class="PlanManage_v">
    <DragLayout>
      <template #leftTree>
        <PlanManageTree v-model:currentPath="currentPath"
                        @setCurrentNode="setCurrentNode"
                        :currentNode="currentNode"></PlanManageTree>
      </template>
      <template #rightContent>
        <div class="plan-manage-case-content">
          <div style="height: 50px; width: 100%; border: 1px solid red"></div>
          <div class="plan-manage-case-list" :class="{'bgcolor': bgColor}">
            <component :is="listCompsRef"
                       @JumpPage="JumpPage"
                       :jumpParams="jumpParamsRef"
                       :currentPath="currentPath"
                       :currentNode="currentNode"
                       :schema-params="schemaParams"
                       @operation-plan="operationPlan"
                       @back-to-case-table="backToCaseTable"></component>
          </div>
        </div>
      </template>
    </DragLayout>
  </div>
</template>

<script setup>
import PlanManageTree from '@/views/PlanManage/components/PlanManageTree.vue'
import SinglePointPlanList from '@/views/PlanManage/components/SinglePointPlanList.vue'
import ScenarioPlanList from '@/views/PlanManage/components/ScenarioPlanList.vue'
import DragLayout from '@/components/DragLayout.vue'
import ScenarioPlanActive from '@/views/PlanManage/components/ScenarioPlanActive.vue'

import EmergencyResponseCaseForm from '@/views/PlanManage/components/EmergencyResponseCaseForm/index.vue'
import {computed, ref, shallowRef} from 'vue'
const listComps = {
  'ScenarioPlanActive': ScenarioPlanActive,
  'SinglePointPlanList': SinglePointPlanList,
  'ScenarioPlanList': ScenarioPlanList
}
let curCompRef = ref('')
let jumpParamsRef = ref()
let currentNode = ref({})
let currentPath = ref([])
let listCompsRef = shallowRef(ScenarioPlanList)
const schemaParams = ref({})

function JumpPage({comp, params}) {
  listCompsRef.value = listComps[comp]
  jumpParamsRef.value = params || {}
  curCompRef.value = comp
}
function setCurrentNode(node) {
  currentNode.value = node || {}
  listCompsRef.value = listComps[node.component] || ScenarioPlanList
}
function operationPlan(params) {
  schemaParams.value = params
  listCompsRef.value = EmergencyResponseCaseForm
}

function backToCaseTable() {
  listCompsRef.value = SinglePointPlanList
}

const bgColor = computed(()=> {
  return ['ScenarioPlanActive'].includes(curCompRef.value)
})
</script>

<style scoped>
.PlanManage_v {
  display: flex;
  width: 100%;
}

.plan-manage-case-content {
  min-width: 900px;
  height: 100%;
  width: 100%;
}

.plan-manage-case-list {
  width: 100%;
  height: calc(100% - 55px);
  /*padding: 16px 10px;*/
}
.bgcolor {
  background-color: #f2f2f2;
}
</style>

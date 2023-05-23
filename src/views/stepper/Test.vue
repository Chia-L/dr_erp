<script setup>
import ScrollStepper from '@/components/ScrollStepper/index.vue'
import Step1 from '@/views/stepper/components/Step1.vue'
import Step2 from '@/views/stepper/components/Step2.vue'
import DetailStep1 from '@/views/stepper/components/DetailStep1.vue'
import DetailStep2 from '@/views/stepper/components/DetailStep2.vue'
import DrawerStep1 from '@/views/stepper/components/DrawerStep1.vue'
import { ref, reactive, markRaw } from 'vue'

const stepper = ref(null)
const a = ref(null)
const stepItems = [ Step1, Step2 ]
const detailItems = [DetailStep1, DetailStep2]
const drawerItems = { Step1: DrawerStep1 }

function onEdit() {
  stepper.value.openStepper(true)
}

/* 初始化 */
function getCtxFormData(resolve, reject) {
  resolve({
    name: '李太白'
  })
}

/* 保存form数据 */
function saveCtxFormData(resolve, reject, data) {
  console.log('大表单数据', data)
  resolve()
}
</script>

<template>
  <div>
    <ScrollStepper ref="stepper"
                   :step-items='stepItems'
                   :detail-items='detailItems'
                   :drawer-items='drawerItems'
                   :get-ctx-form-data='getCtxFormData'
                   :save-ctx-form-data='saveCtxFormData' />
    <div @click="onEdit">编辑</div>
  </div>
</template>

<style scoped>
</style>

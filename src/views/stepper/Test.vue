<script setup>
import ScrollStepper from '@/components/ScrollStepper.vue'
import Step1 from '@/views/stepper/components/Step1.vue'
import Step2 from '@/views/stepper/components/Step2.vue'
import { ref, reactive, markRaw } from 'vue'

const stepper = ref(null)
const a = ref(null)
const stepItems = [ Step1, Step2 ]

function onEdit() {
  stepper.value.openStepper(true)
}
</script>

<template>
  <div>
    <ScrollStepper ref="stepper"
                   :step-items='stepItems' />
    <div @click="onEdit">编辑</div>
  </div>
</template>

<style scoped>
</style>

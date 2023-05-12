<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Step2',
  aliasName: '人物',
  stepIcon: ''
})
</script>
<script setup>
import { reactive } from 'vue'
defineProps({
  titleHighLighting: {
    type: Boolean,
    default: false
  },
  detailSwitch: {
    type: Function,
    default: function() {

    }
  }
})
const form = reactive({
  name: '朱自清',
  sex: 'M',
  age: 44
})
defineExpose({
  form
})
</script>

<template>
  <div v-bind='$attrs'>
    <div v-text="form.name"></div>
    <div v-text="form.sex"></div>
    <div v-text="form.age"></div>
  </div>
</template>

<style scoped>
</style>

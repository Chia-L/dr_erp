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
  xm: '朱自清',
  sex: 'M',
  age: 44
})
defineExpose({
  form
})
</script>

<template>
  <div>
    <div class='h200' v-text="form.xm"></div>
    <div class='h200' v-text="form.sex"></div>
    <div class='h200' v-text="form.age"></div>
  </div>
</template>

<style scoped>
.h200 {
  height: 200px;
}
</style>

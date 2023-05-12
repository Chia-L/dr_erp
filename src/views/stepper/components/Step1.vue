<script>
import { reactive, defineComponent } from 'vue'
export default defineComponent({
  name: 'Step1',
  aliasName: '书刊',
  stepIcon: '',
  setup() {
    const form = reactive({
      book: '春',
      auth: '朱自清',
      pages: 100
    })
    return {
      form
    }
  }
})
</script>

<template>
  <div v-bind='$attrs'>
    <div v-text="form.book"></div>
    <div v-text="form.auth"></div>
    <div v-text="form.pages"></div>
  </div>
</template>

<style scoped>
</style>

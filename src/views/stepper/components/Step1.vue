<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Step1',
  aliasName: '书刊',
  stepIcon: '',
})
</script>
<script setup>
import { reactive, ref } from 'vue'
import { useSyncToCtxFrom } from 'comps/ScrollStepper/useSyncFormToCtxForm.js'

const props = defineProps({
  useFormData: {
    type: Function
  },
  openDrawer: {
    type: Function
  }
})

const form = reactive({
  name: '',
  mail: '',
  city: '',
})
const rules = reactive({
  name: [
    { required: true, message: 'The name cannot be empty', trigger: 'blur' }
  ],
  mail: [
    { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' },
    { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
  ],
  city: [
    { required: true, message: 'Please select the city', trigger: 'change' }
  ],
})

const formValidateRef = ref(null)

const emits = defineEmits(['syncFormToCtxForm'])

useSyncToCtxFrom(form, emits)

function onCheckFormData() {
  return new Promise(function(resolve, reject) {
    formValidateRef.value.validate((valid) => {
      if (valid) {
        resolve()
      } else {
        reject()
      }
    })
  })
}
function click() {
  props.openDrawer(true, {
    defineBottonBtn: [
      {type: 'text', text: '取消', drawerBtnType: 'cancel'},
      {type: 'primary', text: '确定', drawerBtnType: 'confirm'}
    ]
  })
}

defineExpose({
  form,
  rules,
  onCheckFormData
})
</script>

<template>
  <div v-bind='$attrs' style='height: 750px'>
    <i-form ref="formValidateRef"
          :model="form"
          :rules="rules" :label-width="80">
      <FormItem label="Name" prop="name">
        <Input v-model="form.name" placeholder="请输入你的名字"></Input>
      </FormItem>
      <FormItem label="E-mail" prop="mail">
        <Input v-model="form.mail" placeholder="请输入你的邮箱"></Input>
      </FormItem>
      <FormItem label="City" prop="city">
        <i-select v-model="form.city" placeholder="请选择你的城市">
          <i-option value="beijing">北京</i-Option>
          <i-option value="shanghai">上海</i-Option>
          <i-option value="shenzhen">深圳</i-Option>
        </i-select>
      </FormItem>
    </i-form>
    <i-Button type="info" @click='click'>抽屉</i-Button>
  </div>
</template>

<style scoped>
</style>

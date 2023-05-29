<script setup>
import { ref, reactive, watchEffect } from 'vue'

const emit = defineEmits(['show', 'hide', 'handleClose'])
const props = defineProps({
  width: {
    type: [Number, String],
    default: 600
  },
  title: {
    type: String,
    default: '消息提示'
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  errorMsg: {
    type: String,
    default: ''
  },
  enter: {
    type: String,
    default: '确定'
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  form: {
    type: Object,
    default: function () {
      return {}
    }
  },
  isDisabled:{
    type:Boolean,
    defaults:false
  },
  onConfirm: {
    type: Function,
    default: function (close, params) {
      close()
    }
  },
  onCancel: {
    type: Function,
    default: function (close, params) {
      close()
    }
  },
  // 隐藏窗口触发时触发的事件
  hide: {
    type: Function,
    default: function() {
      return
    }
  },
})
const visible = ref(false)
const params = reactive({
  data: {}
})

watchEffect(() => {
  params.data = Object.assign(params.data, props.form)
})

function openDlg(bool, param) {
  visible.value = bool
  params.data = Object.assign(params.data, param)
  return Promise.resolve()
}
function close () {
  visible.value = false
}
function show () {
  emit('show')
}
function hide () {
  emit('hide')
}
function handleClose (close, param) {
  emit('handleClose', close, param)
}

defineExpose({
  openDlg
})
</script>

<template>
  <vxe-modal v-model="visible"
             :width="width"
             show-footer
             @show="show"
             @hide="hide"
             @close="handleClose(close, params.data)"
             v-bind="$attrs">
    <template #title>
      <slot name="title"><span class='span-title'>{{title}}</span></slot>
    </template>
    <template #default>
      <div v-loading="isLoading">
        <slot name="default"></slot>
      </div>
    </template>
    <template #footer>
      <slot name='"footer'>
        <div class="flex space-between">
          <span class="error" v-text="errorMsg"></span>
          <div class="flex clw-btn">
            <i-button class="mr15" type="primary" :disabled="isLoading || isDisabled" @click="onConfirm(close, params.data)">{{enter}}</i-button>
            <i-button type="text" v-show="showCancel" @click="onCancel(close, params.data)">取消</i-button>
          </div>
        </div>
      </slot>
    </template>
  </vxe-modal>
</template>

<style scoped>
.flex {
  display: flex;
}
.space-between {
  justify-content: space-between;
}
.span-title{
  font-size: 14px;
  color: #212529;
}
.error {
  color: #f56c6c;
}
.mr15{
  margin-right: 15px;
}
</style>

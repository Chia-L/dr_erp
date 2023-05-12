<script setup>
import { ref, reactive, watchEffect, onMounted, nextTick } from 'vue'

const props = defineProps({
  // stepper 弹窗宽度
  width: {
    type: [Number, String],
    default: 1018
  },
  // stepper 弹窗高度
  height: {
    type: [Number, String],
    default: 620
  },
  // stepper 头部内容
  title: {
    type: String,
    default: '信息'
  },
  // stepper 项们
  stepItems: {
    type: Array,
    default: () => {
      return []
    }
  },
  // 详情 项们
  detailItems: {
    type: Array,
    default: () => {
      return []
    }
  },
  // 是否有详情
  hasDetail: {
    type: Boolean,
    default: false
  },
  // 获取 初始外部表单数据 方法
  getCtxFormData: {
    type: Function,
    default: resolve => {
      resolve({})
    }
  }
})

const visibleRef = ref(false)
const isMainLoadingRef = ref(false)
const curStepRef = ref('')
const curDetailRef = ref('')
const errorMsgRef = ref('')
const errorNum = reactive({})
let ctxFormData = reactive({})
const stepsInstance = reactive({})

function useChangeMainLoading(bool) {
  isMainLoadingRef.value = bool
  return {
    isMainLoadingRef
  }
}

function syncFormInitVal() {
  const formData = {}
  debugger
  Object.keys(stepsInstance).forEach(key => {
    const compForm = stepsInstance.key?.form ?? {}
    Object.keys(compForm).forEach(item => {
      ctxFormData.item = compForm.item
    })
  })
  ctxFormData = formData
  console.log('改变', ctxFormData)
}

watchEffect(() => {
  console.log('ddddddd', ctxFormData)
})

/**
 * 打开stepper 对话框
 * @param bool
 */
function openStepper(bool) {
  useChangeMainLoading(true)
  visibleRef.value = true
  new Promise(props.getCtxFormData).then(data => {
    nextTick(() => {
      syncFormInitVal()
    })
  }).finally(() => {
    useChangeMainLoading(false)
  })
}

/**
 * 关闭 stepper 对话框
 */
function closeStepper() {

}

/**
 * 加载CtxForm数据
 */
function loadCtxFormData() {

}

/**
 * 打开抽屉
 */
function openDrawer() {

}

/**
 * 打开详情
 */
function openDetail() {

}

function finishStepper() {

}

defineExpose({
  openStepper
});
</script>
<template>
  <div>
    <vxe-modal class-name="scroll-stepper"
              v-model="visibleRef"
              :width="width"
              :height="height"
              :loading="false"
              v-bind="$attrs"
              @show="loadCtxFormData"
              @close="closeStepper"
              show-footer>
      <!--  stepper 头部开始  -->
      <template #title>
        <span v-text="title"></span>
      </template>
      <!--  stepper 头部结束  -->
      <!--  content 开始  -->
      <div class="flex stepper-main" v-loading="isMainLoadingRef" v-if='visibleRef'>
        <ul class="tab-con">
          <li v-for="step in props.stepItems"
              :key="step.name"
              class="{'active-custom': curStepRef === step.name}">
            <span class="float-center-aligned">
              <i :class="'iconfont ' + step.stepIcon"></i>
              <span v-text="step.aliasName"></span>
            </span>
            <badge v-if="errorNum[step.name]" :count="errorNum[step.name]" slot="extra" />
          </li>
        </ul>
        <div class="flex step-main">
          <el-scrollbar ref="stepView"
                       class="step-view ml15"
                       wrap-class="el-select-dropdown__wrap"
                        view-class="el-select-dropdown__list">
            <div class="comp-wrap" :class="{'has-detail': props.hasDetail}">
              <component v-for="comp in props.stepItems"
                         :key="comp.name"
                         :ref="el => { if (el) stepsInstance[comp.name] = el}"
                         :is="comp"
                         :title-high-lighting="curStepRef === comp.name"
                         :drawer-switch="openDrawer"
                         :detail-switch="openDetail">
              </component>
            </div>
            <div class="detail" v-if="props.hasDetail">
              <slot>
                <component class="detail-cell"
                           :class="{'z-index_999': detailComp.name === curDetail}"
                           v-for="detail in props.detailItems"
                           :detail-con="detailCon"
                           :key="detail.name"
                           :is="detail.name"></component>
              </slot>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <!--  content 结束  -->
      <!--  stepper 底部开始  -->
      <template #footer v-if="visibleRef">
        <div class="flex footer" :class="{'justify-content-end': !errorMsgRef}">
          <span class="error-msg" v-show="errorMsgRef" v-text="errorMsgRef"></span>
          <div class="buttons-operation">
            <slot name="footer-btn" :fun="{ 'cancel': closeStepper, 'confirm': finishStepper }">
              <i-button type="primary" class="mr15" @click="finishStepper" :disabled="isMainLoadingRef">完成</i-button>
              <i-button @click="closeStepper">取消</i-button>
            </slot>
          </div>
        </div>
      </template>
      <!--  stepper 底部开始  -->
    </vxe-modal>
  </div>
</template>

<style scoped>
:deep(.vxe-modal--content) {
  padding: 0 !important;
  overflow-y: hidden !important;
}
:deep(.scroll-stepper-dlg .vxe-table--body-wrapper){
  background-color: #fff !important;
}
:deep(.scroll-stepper .vxe-modal--footer){
  padding: .8em 1em .8em 1em;
  border-top: 1px solid #D7DDE4
}
.flex {
  display: flex;
}
.stepper-main {
  width: 100%;
  height: 100%;
}
.tab-con {
  width: 224px;
  height: 100%;
  padding-top: 20px;
  box-sizing: border-box;
  background-color: #FFFFFF;
}
.tab-con li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  font-weight: 400;
  font-size: 14px;
  color: #606266;
  line-height: 32px;
  padding: 0 10px;
  border-left: 3px solid #FFFFFF;
}
.tab-con li:hover {
  background-color: #f0f0f0;
  cursor: pointer;
}
.tab-con li:not(:last-child) {
  margin-bottom: 8px;
}
.step-main {
  position: relative;
  flex: 1;
}
:deep(.stepper-class .is-vertical) {
  z-index: 9999;
}
:deep(.step-view.el-scrollbar) {
  flex: 1;
  height: 100%;
}
:deep(.step-view .el-select-dropdown__wrap) {
  max-height: unset;
}
:deep(.step-view .el-scrollbar__view) {
  padding: 0;
}
:deep(.step-view .el-scrollbar__wrap) {
  overflow: hidden;
  overflow-y: scroll;
}
:deep(.step-view .el-scrollbar__bar.is-horizontal) {
  height: 0
}
:deep(.stepper-class .el-scrollbar__view.el-select-dropdown__list > div) {
  overflow: hidden;
}
.z-index_999 {
  z-index: 999;
}
.footer {
  align-items: center;
  justify-content: space-between;
  height: 32px;
}
.justify-content-end {
  justify-content: flex-end !important;
}
.error-msg {
  color: #f56c6c;
}
.buttons-operation{
  display: flex;
}
.mr15 {
  margin-right: 15px;
}
</style>

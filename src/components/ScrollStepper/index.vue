<script setup>
import { ref, reactive, markRaw, watch, computed, nextTick, onBeforeUnmount } from 'vue'
import { throttle, cloneDeep, assignIn } from 'lodash'
import { hasOwnProperty, isNumber } from '@/utils/tools'

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
  drawerItems: {
    type: Object,
    default: () => {
      return {}
    }
  },
  // 获取 初始外部表单数据 方法
  getCtxFormData: {
    type: Function,
    default: resolve => {
      resolve({})
    }
  },
  // 保存表单数据
  saveCtxFormData: {
    type: Function,
    default: (resolve, reject, data = {}) => {
      resolve(data)
    }
  },
  // 屉能否在蒙层点击关闭
  isCanClose: {
    type: Boolean,
    default: false
  }
})

/* 普通数据 */

/* 响应数据 */
// 弹出可见
const visibleRef = ref(false)
// 右侧抽屉可见
const drawerVisibleRef = ref(false)
// 全局加载
const isMainLoadingRef = ref(false)
//当前step
const curStepRef = ref('')
// 当前Detail
const curDetailRef = ref(null)
// 错误信息
const errorMsgRef = ref('')
const timerRef = ref('')
// 错误数量
const errorNum = ref({})
// 是tab触发的
const isTabCheckRef = ref(false)
const targetIndexRef = ref(0)
// 总数据
let ctxFormData = ref({})
// 详情数据
let detailDataRef = ref({})
// step实例
const stepsInstance = reactive({})
// 滚动区域实例
const stepViewInstance = ref(null)
// 滚动区域视口高度
const viewHeightRef = ref(0)
// 滚动高度
const scrollHeightRef = ref(0)
// 当前抽屉实例
const drawerInsRef = ref(null)
// 当前抽屉数据
const drawerConRef = ref({})
// 抽屉底部按钮
const defineBtnRef = ref([])

/* compted */
const drawerWith = computed(() => {
  let width = isNumber(props.width) ? props.width + 'px' : props.width
  width += '!important'
  return width
})
const drawerHeight = computed(() => {
  let height = isNumber(props.height) ? props.height + 'px' : props.height
  height += '!important'
  return height
})
let hasDetail = computed(() => {
  return !!curDetailRef.value
})

/* watch */
watch(ctxFormData, nval => {
  syncCtxFormToForm(nval)
}, {deep: true})

/* tool funs */
/**
 * 全局加载hook
 */
function useChangeMainLoading(bool) {
  isMainLoadingRef.value = bool
  return {
    isMainLoadingRef
  }
}

/**
 * 设置表单数据（直接给子组件的form修改数据是不是改变父亲form的）
 */
function useFormData (key, val) {
  ctxFormData.value[key] = val
  return {
    ctxFormData
  }
}

function useClearInterval(timer={}) {
  clearInterval(timer.value)
  timer.value= null
  return {
    timer
  }
}

/* methods */
/**
 * 同步子组件的form数据到父组件的form中
 * @param data: 外部数据数据
 */
function reportForm(data) {
  data = data || {}
  let formData = {}
  Object.keys(stepsInstance).forEach(key => {
    const compForm = (stepsInstance[key]?.form) ?? {}
    formData = assignIn(formData, compForm)
  })
  ctxFormData.value = assignIn(formData, data)
}

/**
 * 同步父组件的form数据到子组件的form中
 * @param ctxForm：父组件form数据
 */
function syncCtxFormToForm(ctxForm) {
  Object.keys(ctxForm).forEach(key => {
    Object.keys(stepsInstance).forEach(comp => {
      if (hasOwnProperty(stepsInstance[comp]["form"], key)) {
        stepsInstance[comp]["form"][key] = ctxForm[key]
      }
    })
  })
}

function syncFormToCtxForm(form) {
  Object.keys(form).forEach(key => {
    ctxFormData.value[key] = form[key]
  })
}

/**
 * 执行子组件中的promise方法
 * @param eventName: 事件名, needLoad： 是否需要加载
 */
function equalPromiseFun(eventName , needLoad) {
  const pms = Object.keys(stepsInstance).reduce((pre, key) => {
    const fun = stepsInstance[key]?.[eventName]
    let pm = null
    if (fun  && typeof fun === "function") {
      pm = fun()
    }
    pm && (pre = pre.concat(pm))
    return pre
  }, [])
  needLoad && useChangeMainLoading(true)
  return new Promise(((resolve, reject) => {
    Promise
      .all(pms)
      .then(() => { resolve() }, e => { reject(e); console.error(e) })
      .finally(() =>  {
        needLoad && useChangeMainLoading(false)
      })
  }))
}

function equalFun(eventName) {
  Object.keys(stepsInstance).forEach(key => {
    let fun = stepsInstance[key]?.[eventName]
    if ((typeof fun === "function")) fun()
  })
}

/**
 * 初始化 父form数据
 */
function initCtxFormData(){
  ctxFormData.value = {}
}

/**
 * 关闭弹窗时 回调
 */
function closeHandler() {
  equalFun('onClosed')
}

/**
 * 选项卡触发器
 * @ param name: 组件名称, index：当前组件下标
 */
function tabTrigger(name,index) {
  isTabCheckRef.value = true
  curStepRef.value = name
  curDetailRef.value = markRaw(props.detailItems[index] || null)
  if (viewHeightRef.value >= scrollHeightRef.value) return null
  nextTick(() => {
    const offsetTop = (stepsInstance[name]?.$el?.offsetTop) ?? 0
    const offsetHeight = (stepsInstance[name]?.$el?.offsetHeight) ?? 0
    setScrollHeight(getScrollHeight(offsetTop, offsetHeight))
  })
}

/**
 * 获取当前活跃tab的滚动高度
 */
function getScrollHeight(offsetTop, offsetHeight) {
  return offsetTop
}

/**
 * 设置滚动高度
 * @param height: 滚动高度
 */
function setScrollHeight(height) {
  const wrapRef = (stepViewInstance.value?.wrapRef) ?? null
  wrapRef && (wrapRef.scrollTop = height)
}

/**
 * 获取所有tab距离视口的高度
 */
function getCompTop() {
  return Object.keys(stepsInstance).reduce((pre, key) => {
    const obj = {}
    obj.name = key
    obj.offsetTop = stepsInstance[key]?.$el?.offsetTop
    obj.offsetHeight = stepsInstance[key]?.$el?.offsetHeight
    pre = pre.concat(obj)
    return pre
  }, [])
}

/**
 * 左侧tab触发
 */
function tabCompClickHandle(name, index) {
  curStepRef.value = name
  curDetailRef.value = markRaw(props.detailItems[index] || null)
}

/**
 * 活跃目标组件
*/
function activeCurTab(scrollTop) {
  const offsetTopArr = cloneDeep(getCompTop())
  let curItemTop = null
  let curItemHeight = null
  let scrollAbleHeight = scrollHeightRef.value  - viewHeightRef.value
  for (let curIndex = 0; curIndex < offsetTopArr.length; curIndex++) {
    let item = offsetTopArr[curIndex]
    curItemTop = item.offsetTop
    curItemHeight = item.offsetHeight
    if (scrollTop < curItemTop && curIndex == 0) {
      break
    }
    // 当前盒子底部距离父亲顶部的高度
    if (!(curItemTop <= scrollTop && scrollTop < curItemTop + curItemHeight)) {
      continue
    } else {
      targetIndexRef.value = curIndex
      break
    }
  }
  if(!isTabCheckRef.value){
    curStepRef.value = (offsetTopArr[targetIndexRef.value]?.name)
    curDetailRef.value = markRaw(props.detailItems[targetIndexRef.value] || null)
  }
  isTabCheckRef.value = false
}

/**
 * 绑定滚动事件
 */
function bindScrollEvent() {
  nextTick(() => {
    viewHeightRef.value = (stepViewInstance.value?.$el?.clientHeight) ?? 0
    const viewDom = (stepViewInstance.value?.wrapRef) ?? null
    scrollHeightRef.value = (viewDom?.scrollHeight) ?? 0
    if (viewDom) {
      viewDom.scrollTop = 0
      viewDom.addEventListener("scroll", function(e) {
        throttle(activeCurTab, 500)(e.target.scrollTop)
      })
    }
  })
}

/**
 * 卸绑滚动事件
 */
function unBindScrollEvent() {
  const viewDom = (stepViewInstance.value?.wrapRef) ?? null
  if (viewDom) {
    viewDom.removeEventListener("scroll", e => {
      activeCurTab(0)
    })
  }
}

/**
 * 初始化
 */
function initView() {
  targetIndexRef.value = 0
  curStepRef.value = (props.stepItems[0]?.name) ?? ''
  curDetailRef.value = markRaw(props.detailItems[0] || null)
}

/**
 * 打开stepper 对话框
 * @param bool
 */
function openStepper(bool) {
  visibleRef.value = bool
  if (bool) {
    initView()
    bindScrollEvent()
  }
}

/**
 * 关闭 stepper 对话框
 */
function closeStepper() {
  useClearInterval(timerRef)
  errorNum.value = {}
  errorMsgRef.value = ''
  unBindScrollEvent()
  useChangeMainLoading(false)
  openStepper(false)
  closeHandler()
  initCtxFormData()
}

/**
 * 加载CtxForm数据
 */
function loadCtxFormData() {
  useChangeMainLoading(true)
  new Promise(props.getCtxFormData).then(data => {
    nextTick(() => {
      reportForm(data)
    })
  }).finally(() => {
    useChangeMainLoading(false)
  })
}

/**
 * 验证成功
 */
function stepValidOk() {
  errorMsgRef.value = ''
  errorNum.value = {}
  useClearInterval(timerRef)
}

/**
 * 验证失败
 */
function stepValidFail(msg) {
  errorMsgRef.value = ''
  Object.keys(stepsInstance).forEach(key => {
    const errNum = (stepsInstance[key]?.$el?.innerHTML.split('ivu-form-item-error-tip').length - 1) ?? 0
    errorNum.value[key] = errNum
    if (errNum > 0 && !errorMsgRef.value) {
      const htmlStr = (stepsInstance[key]?.$el.innerHTML) ?? ''
      const reg = /<(?:[^\/]|\s)*?(?:ivu-form-item-error-tip)+(?:[^\/]|\s)*?>([^<]*)*/
       htmlStr.replace(reg, function(match, p1) {
         errorMsgRef.value = p1
      })
    }
  })
  errorMsgRef.value = errorMsgRef.value || msg
  if (!timerRef.value) {
    timerRef.value = setInterval(validFailedCb, 800)
  }
  if (errorMsgRef.value) {
    return Promise.reject('')
  }
}

/**
 * 验证失败回调
 */
function validFailedCb() {
  validLocalFormData().then(stepValidOk, stepValidFail).catch(e => {})
}

/**
 * 校验所有组件
 */
function validLocalFormData() {
  return new Promise((resolve, reject) => {
    const pms = Object.keys(stepsInstance).reduce((pre, key) => {
      let comp =  stepsInstance[key]
      let isFun = typeof comp?.onCheckFormData === 'function'
      let pm = isFun ? comp?.onCheckFormData() : null
      if (pm) {
        pre = pre.concat(pm)
      }
      return pre
    }, [])
    Promise.all(pms).then(() => {
      resolve()
    }, e => {
      reject(e)
    })
  })
}

/**
 * 打开详情
 */
function openDetail(data) {
  detailDataRef.value = assignIn(data || {}, {ctxFormData: ctxFormData, curCompCtx: stepsInstance[curStepRef.value]})
}

/**
 * 打开抽屉
 */
function openDrawer(bool, params={}) {
  defineBtnRef.value = params.defineBottonBtn || []
  if(bool) drawerConRef.value = assignIn(params || {}, {ctxFormData: ctxFormData, curCompCtx: stepsInstance[curStepRef.value]})
  nextTick(() => {
    const prom = drawerInsRef.value && params && params.drawerBtnType && drawerInsRef.value[params.drawerBtnType](drawerConRef)
    if (bool) {
      let onShow = drawerConRef.value?.onShow
      if (typeof onShow === "function") onShow()
    }
    if (!bool && (prom instanceof Promise)) {
      prom.then(() => {
        drawerVisibleRef.value = bool
      })
      return
    }
    drawerVisibleRef.value = bool
  })
}

/**
 * 关闭抽屉
 */
function drawerClose() {
  drawerConRef.value = {}
  openDrawer(false, {btnType: 'cancel'})
}

/**
 * 完成
 */
function finishStepper() {
  validLocalFormData()
    .then(stepValidOk, stepValidFail)
    .then(() => {
      useChangeMainLoading(true)
      return new Promise((resolve, reject) => {
        props.saveCtxFormData(resolve, reject, ctxFormData.value)
      })
    }).then(e => {
    initCtxFormData()
    closeStepper()
  }).finally(() => {
    useChangeMainLoading(false)
  }).catch(e => {})
}

/* 生命周期 */
onBeforeUnmount(() => {
  unBindScrollEvent()
  setScrollHeight(0)
  useClearInterval(timerRef)
})

/* expose */
defineExpose({
  openStepper
});
</script>
<template>
  <vxe-modal class-name="scroll-stepper"
             v-model="visibleRef"
             :width="props.width"
             :height="height"
             :loading="false"
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
        <li v-for="(step, index) in props.stepItems"
            :key="step.name"
            :class="{'active-custom': curStepRef === step.name}"
            @click="tabTrigger(step.name, index)">
            <span class="float-center-aligned">
              <i :class="'iconfont ' + step.stepIcon"></i>
              <span v-text="step.aliasName"></span>
            </span>
          <badge v-if="errorNum[step.name]" :count="errorNum[step.name]" slot="extra" />
        </li>
      </ul>
      <div class="flex step-main">
        <el-scrollbar ref="stepViewInstance"
                      class="step-scrollbar ml15"
                      wrap-class="el-select-dropdown__wrap"
                      view-class="el-select-dropdown__list">
          <div class="comp-wrap" :class="{'has-detail': hasDetail}">
            <component v-for="(comp, index) in props.stepItems"
                       :key="comp.name"
                       :ref="el => { if (el) stepsInstance[comp.name] = el}"
                       :is="comp"
                       :title-high-lighting="curStepRef === comp.name"
                       :use-form-data="useFormData"
                       :open-drawer="openDrawer"
                       :open-detail="openDetail"
                       @syncFormToCtxForm="syncFormToCtxForm"
                       @click="tabCompClickHandle(comp.name, index)">
            </component>
          </div>
          <div class="detail" v-if="hasDetail">
            <slot>
              <component class="detail-cell"
                         :detail-con="detailDataRef"
                         :key="curDetailRef.name"
                         :is="curDetailRef"></component>
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
        <div class="drawer-wrap" v-show="drawerVisibleRef"
             :style="{ width: drawerWith, height: drawerHeight }">
          <Drawer v-model="drawerVisibleRef"
                  class-name="stepper-drawer"
                  :mask-closable="props.isCanClose"
                  :width="330"
                  :title="drawerConRef.drawerTitle || ' '"
                  closable
                  :transfer="false"
                  scrollable
                  inner
                  @on-close="drawerClose">
            <div class="drawer-main">
              <el-scrollbar class="step-scrollbar"
                            wrap-class="el-select-dropdown__wrap"
                            view-class="el-select-dropdown__list">
                <component :is="props.drawerItems[curStepRef]"
                           :drawer-con="drawerConRef"
                           ref="drawerInsRef"></component>
              </el-scrollbar>
              <div class="drawer-btn"
                   v-if="typeof drawerConRef.hasBottonBtn === 'boolean' ? drawerConRef.hasBottonBtn : true">
                <i-button type="primary"
                          @click="openDrawer(false, {drawerBtnType: 'cancel'})"
                          v-if="!defineBtnRef.length">关闭</i-button>
                <div v-else>
                  <i-button v-for="(btn,index) in defineBtnRef"
                            :type="btn.type"
                            class="drawer-btn-item"
                            @click="openDrawer(false, {drawerBtnType: btn.drawerBtnType})">
                    <span v-text="btn.text"></span>
                  </i-button>

                </div>
              </div>
            </div>
          </Drawer>
        </div>
      </div>
    </template>
    <!--  stepper 底部开始  -->
  </vxe-modal>
</template>

<style>
.scroll-stepper .vxe-modal--content {
  padding: 0 !important;
  overflow-y: hidden !important;
}
.scroll-stepper .vxe-modal--header.is--ellipsis{
  background: #FFFFFF;
  height: 50px;
}
.scroll-stepper .vxe-table--body-wrapper{
  background-color: #fff !important;
}
.scroll-stepper .vxe-modal--footer{
  padding: .6em 1em !important;
  border-top: 1px solid #D7DDE4;
}
.stepper-class .is-vertical {
  z-index: 9999;
}
.step-scrollbar.el-scrollbar {
  flex: 1;
  height: 100%;
}
.step-scrollbar .el-select-dropdown__wrap {
  max-height: unset;
}
.step-scrollbar .el-scrollbar__view {
  padding: 0;
}
.step-scrollbar .el-scrollbar__wrap {
  overflow: hidden;
  overflow-y: scroll;
}
.step-scrollbar .el-scrollbar__bar.is-horizontal {
  height: 0
}
.step-scrollbar .el-scrollbar__view.el-select-dropdown__list > div {
  overflow: hidden;
}
.stepper-drawer .ivu-drawer-body {
  padding: 16px 0 0!important;
}
.stepper-drawer .ivu-drawer-header {
  padding: 14px 10px !important;
}
.stepper-drawer .ivu-drawer-header-inner {
  color: #333333;
  font-size: 14px;
  text-align: left;
}
.stepper-drawer .ivu-drawer-mask.ivu-drawer-mask-inner {
  border-radius: 4px;
}
.stepper-drawer .ivu-drawer-content {
  border-radius: 0px 5px 5px 0px;
}
</style>
<style scoped>
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
.active-custom {
  background-color: #fff;
  color: #409EFF !important;
  border-left-color:#42a1ff !important;
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
.has-detail {
  width: calc(100% - 300px - 15px);
}
.detail {
  width: 308px;
  height: 100%;
  background-color: rgba(255, 255, 240, 1);
}
.detail .detail-cell {
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background: transparent;
  z-index: 20;
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
.drawer-wrap {
  position: absolute;
  bottom: -1px;
  left: -1px;
  width: 100%;
  height: 100%;
  z-index: 7000;
}
.drawer-main {
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;
}
.drawer-btn {
  display: flex;
  justify-content: flex-end;
  padding: 0.6em 1em;
  border-top: 1px solid #D7DDE4;
}
.drawer-btn-item + .drawer-btn-item{
  margin-left: 15px !important;
}

.mr15 {
  margin-right: 15px;
}
</style>

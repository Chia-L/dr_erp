<script setup>
import { ref, computed, unref, watch, onMounted, onBeforeMount } from 'vue';
import { isBoolean } from 'lodash'
const inputValue = ref('')
const checkError = ref('')
const isClickConfirm = ref(false)
const buttonRef = ref()
const popoverRef = ref()
const props = defineProps({
    /* input框多选项数据 */
    itemList: {
        type: Array,
        default: () => {
            return []
        }
    },
    /* placeholder */
    placeholderText: {
        type: String,
        default: '请输入客户端名称搜索'
    },
    /* 整个input框宽度 */
    width: {
        type: [String, Number],
        default: 'auto'
    },
    /* pop类名 */
    popClassName: {
        type: String,
        default: 'filter-popover'
    },
    /* pop宽度 */
    popoverWidth: {
        type: [String, Number],
        default: 'auto'
    },
    /* 特殊字符\'\/:*？<>\"\\'校验 */
    specialChar: {
        type: [Boolean,String],
        default: false
    }   
})
const emit = defineEmits(['delete-item', 'search-icon', 'clear-all', 'do-reduction', 'do-confirm', 'pop-show', 'manual-search'])
const vWidth = computed(() =>  {
    if (/^\d+$/.test(props.width)) {
        return (props.width - 77) + 'px'
    }
    return (props.width.split('p')[0] - 77) + 'px'
})
const choseArr = computed(() => {
    if (/^\d+$/.test(props.width)) {
        return (props.width - 44) + 'px'
    }
    return (props.width.split('p')[0] - 44) + 'px'
})
const maxItem = computed(() => {
    return (vWidth.value.split('p')[0] - 48) + 'px'
})
const vPopoverWidth = computed(() => {
    if (/^\d+$/.test(props.popoverWidth)) {
        return props.popoverWidth
    }
    return props.popoverWidth.split('p')[0]
})
watch(() => props.itemList, (newVal) => {
    if (newVal.length > 0 && inputValue.value !== '') inputValue.value = '' /* 点击确定按钮后需要把input赋空 */
}, {deep: true, immediate: true})
watch(inputValue, (newVal) => {
    if (newVal === '') emit('manual-search', inputValue.value) /* 输入框为空时，会重新获取筛选数据 */
    if (newVal && props.specialChar) {
        if (isBoolean(props.specialChar)) {
            checkError.value = filterSpecialCharacters(newVal)
        } else {
            var pattern = new RegExp("["+props.specialChar+"]");
            if (pattern.test(v)) checkError.value = '输入值错误，不支持特殊字符'+ props.specialChar;
        }
    } else {
        checkError.value = ''
    }
})
onMounted(() => {
    window.addEventListener('keydown', bindEventCallback)
})
onBeforeMount(() => {
    window.removeEventListener('keydown', bindEventCallback)
})
/* 过滤特殊字符 */
function filterSpecialCharacters(str) {
  var reg = '[\\\\/:*?\'<>\"]', msg = ''
  var pattern = new RegExp(reg);
  if (pattern.test(str)) {
    var msg = '输入值错误，不支持特殊字符\'\/:*？<>\"\\';
  }
  return msg;
}
// 给搜索input框加入回车触发搜索回调函数
function bindEventCallback(e) {
    if (e.keyCode === 13 && inputValue.value !== '') emit('manual-search', inputValue.value)
}
function searchIcon() {
    emit('search-icon')
}
/* 筛选input框Item删除方法 */
function doDelete(key) {
    emit('delete-item', key)
}
 /* 清除所有筛选的内容 */
function clearAll() {
    emit('clear-all')
}
/* 打开筛选框 */
function openPop() {
    unref(popoverRef).popperRef?.delayHide?.()
}
/* 取消方法 */
function doCancel() {
    emit('do-reduction') /* 还原到初始状态 */
    unref(popoverRef).hide()
}
/* 确定按钮方法 */
function doConfirm() {
    isClickConfirm.value = true
    emit('do-confirm')
    unref(popoverRef).hide()  
}
/* pop显示事件 */
function popShow() {
    emit('pop-show')
}
/* pop隐藏事件 */
function popHide() {
    if (isClickConfirm.value) {
        isClickConfirm.value = false
        return
    }
    emit('do-reduction') /* 还原到初始状态 */
}   
</script>

<template>
    <div class="clw-filter">
        <div class="inputWrap">
            <div class="searchIcon" v-show="props.itemList.length === 0" @click="searchIcon"><i class="iconfont i-search"></i></div>
            <!-- vue3把把$attrs和$listeners统一合并到$attrs中 -->
            <el-input class="filter-v"
                :placeholder="placeholderText"
                v-model.trim="inputValue"
                v-bind="$attrs"
                :style="{width: vWidth}"
                @keyup.enter.native="searchIcon"
                v-show="props.itemList.length === 0">
            </el-input>
            <span class="checkError" v-if="checkError" v-html="checkError"></span>
            <div class="choseArr" v-show="props.itemList.length > 0" :style="{width: choseArr}">
                <div class="dlgFilterValue">
                    <div class="valueItem" :style="{maxWidth: maxItem}">
                        {{props.itemList.length > 0 ? props.itemList[0].label + '：' + (props.itemList[0].value instanceof Array ?props.itemList[0].showValue.join('、') : props.itemList[0].showValue ): '' }}
                    </div>
                    <div class="iconWrap">
                        <i class="iconfont i-cha" @click="doDelete(props.itemList[0].key)"></i>
                    </div>
                </div>
                <div class="addNum" v-show="props.itemList.length>1">+ {{ props.itemList.length - 1 }}</div>
            </div>
            <div class="clearAllIcon" v-if="props.itemList.length>0">
                <i class="iconfont i-filter-clear" @click="clearAll"></i>
            </div>
            <div class="tailWrap" ref="buttonRef" @click="openPop">
                <span>过滤</span>
                <Icon type="md-arrow-dropdown" />
            </div>
        </div>
        <el-popover
            ref="popoverRef"
            trigger="click"
            placement="bottom-end"
            virtual-triggering
            :virtual-ref="buttonRef"
            :width="vPopoverWidth"
            :popper-class="popClassName"
            @show="popShow"
            @hide="popHide"
        >
        <div class="filter-popover-con" :style="{width: vPopoverWidth}">
          <slot name="popover-con"></slot>
        </div>
        <div class="clw-btn filter-popover-btn">
            <slot name="popover-bottom" :data="{doCancel: doCancel, doConfirm: doConfirm}">
                <i-button type="text" @click="doCancel">取消</i-button>
                <i-button type="primary" @click="doConfirm">确定</i-button>
            </slot>
        </div>
        </el-popover>
    </div>
</template>

<style>
.clw-filter{
    position: relative;
    width: auto;
}
.clw-filter .inputWrap{
    display: flex;
    align-items: center;
    height: 32px;
    border: 1px solid #17A2BB;
    border-radius: 4px;
}
.clw-filter .inputWrap .searchIcon{
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 33px;
}
.clw-filter .inputWrap .searchIcon i{
    color: #17A2BB;
}
.clw-filter .inputWrap .filter-v{
    height: 100%;
    border: none;
    outline: 0;
}
.clw-filter .inputWrap .filter-v .el-input__wrapper{
    border-radius: 0 !important;
    box-shadow: none;
}
.clw-filter .checkError{
    position: absolute;
    top: 32px;
    left: 12px;
    color: #ed4014;
    z-index: 1;
}
.clw-filter .inputWrap .choseArr {
    display: flex;
    align-items: center;
    padding-left: 9px;
    height: 24px;
}
.clw-filter .dlgFilterValue {
    display: flex;
    align-items: center;
    margin-right: 5px;
    padding: 0 4px;
    height: 24px;
    font-size: 12px;
    border-radius: 3px;
    background-color: #F4F4F5;
    border: 1px solid #E9E9EB;
}
.clw-filter .dlgFilterValue .valueItem{
    color: #909399;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.clw-filter .dlgFilterValue .iconWrap{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 4px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    cursor: pointer;
}
.clw-filter .dlgFilterValue .iconWrap i {
    color: #606266;
    font-size: 12px;
    font-weight: 100;
}
.clw-filter .addNum {
    display: flex;
    align-items: center;
    padding: 0 4px;
    width: 38px;
    height: 24px;
    color: #909399;
    font-size: 12px;
    border-radius: 3px;
    background-color: #F4F4F5;
    border: 1px solid #E9E9EB;
}
.clw-filter .inputWrap .clearAllIcon{
    margin-right: 3px;
    color: #606266;
    height: 100%;
    width: 19px;
    line-height: 29px;
}
.clw-filter .inputWrap .clearAllIcon i{
    cursor: pointer;
}
.clw-filter .inputWrap .tailWrap{
    display: flex;
    align-items: center;
    cursor: pointer;
    width: 45px;
    color: #17A2BB;
}
.filter-popover {
    margin-top: 2px!important;
}
.filter-popover-btn {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
}
</style>

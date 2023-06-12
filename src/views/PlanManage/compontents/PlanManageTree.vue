<template>
  <div class="plan_manage_tree">
    <div class="tree_header">
      <div class="header_top">
        <div class="header_left">
          <span class="font-size_14">预案索引</span>
        </div>
        <div class="op_icon">
          <i class="iconfont i-quanbuzhankai color_66c2d1 cursor_pointer" title="展开" @click="treelayout"></i>
          <i class="iconfont i-quanbushouqi color_66c2d1 cursor_pointer" title="收起" @click="clearTreeExpand"></i>
          <i class="iconfont i-search cursor_pointer" title="搜索" @click="showInputRef = !showInputRef"></i>
        </div>
      </div>
      <div class="header_search" v-if="showInputRef">
        <el-input v-model.trim="filterValueRef" placeholder="请输入预案名" @input="handleSearch"></el-input>
      </div>
    </div>
    <div class="tree_body">
      <vxe-table
        ref="xTreeRef"
        class="my_tree"
        border="none"
        size="mini"
        show-overflow
        width="280px"
        row-class-name="rowClassName"
        max-height="100%"
        :show-header="false"
        :row-config="{
          isHover: true,
          useKey: true,
          keyField: 'id',
          isCurrent: true,}"
        :checkbox-config="{labelField: 'name'}"
        :tree-config="treeConfigRea"
        @cell-click="currentChange"
        @scroll="treeScroll"
        :data="dataRef">
        <vxe-column tree-node field="name">
          <template #default="s">
            <span class="active-color">
              <i class="tree-node-container iconfont" :class="treeIcon[s.row.icon]"></i>
              {{ s.row.name }}
            </span>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
  </div>
</template>

<script setup>
import { JTree } from '@/utils/treeHelper.js'
import { usePlanManageStore } from '@/stores/modules/planManageStore.js'
import { cloneDeep } from 'lodash'
import XEUtils from 'xe-utils'
import { ref, watch, onMounted, nextTick, reactive } from 'vue'

const props = defineProps({
  treeIsOpen:{
    type:Boolean,
    default:true
  }
})
/*普通数据*/
const treeIcon = {
  win: 'i-bg-win-copy',
  db: 'i-cunchushebei',
  file: 'i-wenjianjia',
  data: 'i-jiqun'
}
const planManageStore = usePlanManageStore()
let treeScrollTop = 0
let treeOpenScroll = false // 由父级treeIsOpen控制，tree是否收起

/* 响应数据 */
let planManageTreeRef = reactive([
  {id: 'scene', name: '场景预案', icon: 'file',component: 'list', hasChild: true, children: []},
  {id: 'single-point', name: '单点预案', icon: 'file',component: 'list', hasChild: true, children: []}
])
const showInputRef = ref(false)
const filterValueRef = ref('')
const dataRef = ref([
  {id: 'scene', name: '场景预案', icon: 'file',component: 'list', hasChild: true, children: []},
  {id: 'single-point', name: '单点预案', icon: 'file',component: 'list', hasChild: true, children: []}
])
const xTreeRef = ref(null)
const treeConfigRea = reactive({
  parentField: 'id',
  rowField: 'id',
  children: 'children',
  iconOpen: 'iconfont i-shouqi1',
  iconClose: 'iconfont i-zhankai1',
  indent: 19,
  reserve: true,
  lazy: true,
  loadMethod ({ row }) {
    return fetchChildList(row)
  }
})

// 展开全部节点
function treelayout() {
  xTreeRef.value.setAllTreeExpand(true)
}

// 收起全部节点
function clearTreeExpand() {
  xTreeRef.value.clearTreeExpand()
}

//搜索
function handleSearch() {
  if (filterValueRef.value) {
    const searchProps = ["name"]
    dataRef.value = XEUtils.searchTree(planManageTreeRef, (item) => {
      return searchProps.some(key => XEUtils.toString(item[key]).indexOf(filterValueRef.value) > -1)
    }, {children: 'children'})
  } else {
    dataRef.value = cloneDeep(planManageTreeRef)
  }
  nextTick(() => {
    treelayout()
  })
}

// table current-change事件
function currentChange(s) {
  freshNodePath(s.row.id)
  planManageStore.setCurrentNode(s.row)
  xTreeRef.value.setCurrentRow(s.row)
}

// table scroll事件
function treeScroll(r) {
  xTreeRef.value.clearScroll()
  if (r.scrollTop !==0) {
    treeScrollTop = r.scrollTop
    xTreeRef.value.scrollTo(0, treeScrollTop)
  }
  if (treeOpenScroll && treeScrollTop) {
    xTreeRef.value.scrollTo(0, treeScrollTop)
    treeOpenScroll = false
  }
}

// 更新节点路径
function freshNodePath(id) {
  const newJTree = new JTree(planManageTreeRef, 'id', 'children', true)
  let paths = newJTree.nodePath()
  if (!paths.length) {
    XEUtils.eachTree(dataRef.value, (item, index, items, paths1, parent, nodes) => {
      if (item.id === id) { paths = nodes }
    })
  }
  planManageStore.setCurrentPath(paths.map(el => { return {ident: el.id, name: el.name}}))
}

//刷新树并跳转id
async function manualRefreshTree(id) {
  const newJTree = new JTree(planManageTreeRef, 'id', 'children', true)
  await loadTreeData()
  let node = newJTree.getNodeById(id)
  freshNodePath(id)
  planManageStore.setCurrentNode(node)
  setNodeSelected(id)
}

//设置指定id选中节点,并展开指定id的所有父节点
function setNodeSelected(nodeIdOrId) {
  const newJTree = new JTree(planManageTreeRef, 'id', 'children', true)
  const id = nodeIdOrId.id || nodeIdOrId.id || nodeIdOrId
  let paths = newJTree.nodePath(id)
  if (!paths.length) {
    XEUtils.eachTree(xTreeRef.value, (item,index, items, paths1, parent,nodes) => {
      if(item.id === id){ paths = nodes }
    })
  }
  xTreeRef.value.setTreeExpand(paths, true)
  xTreeRef.value.setCurrentRow(paths[paths.length - 1])
}

// 预案加载处理
function fetchChildList(row) {
  return new Promise(resolve => {
    let node
    function findChild(row) {
      XEUtils.eachTree(dataRef.value, (item,index, items, paths1, parent,nodes) => {
        if (item.id === row.id) { node = nodes }
      })
      if (node[0]?.children?.length) {
        resolve(node[0].children)
      } else {
        let timer = setTimeout(() => {
          findChild(row)
          clearTimeout(timer)
        } ,500)
      }
    }
    findChild(row)
    if (node[0]?.children?.length) {
      resolve(node[0].children)
    }
  })
}

// 树数据处理
function loadTreeData() {
  if (filterValueRef.value) {
    handleSearch()
  }
  dataRef.value = cloneDeep(planManageTreeRef)
  xTreeRef.value.setCurrentRow(planManageStore.currentNode)
}

//获取场景预案数据
function scenarioPlan() {
  setTimeout(() => {
    let res = [
      {id: 'yundiz', name: '云底座崩溃', icon: 'file',component: 'list', children: []},
      {id: 'shujuzhonx', name: '数据中心整体灾难', icon: 'file',component: 'list', children: []},
      {id: 'cunchuguzhang', name: '存储故障', icon: 'file',component: 'list', children: []},
      {id: 'huozai', name: '数据中心火灾', icon: 'file',component: 'list', children: []}
    ] // 这里是异步请求回来的数据
    planManageTreeRef[0].children = cloneDeep(res)
  },3000)
}

// 获取单点预案
function singlePointPlan() {
  setTimeout(() => {
    let res = [
      {id: 'daxin', name: '数据中心-主中心-大兴机场-应用节点', icon: 'data',component: 'list', children: [
          {id: 'ayewuxit', name: 'A类(核心业务系统)', icon: 'file',component: 'list', children: [
              {id: 'socdm', name: 'SOC-DM', icon: 'file',component: 'list', children: [
                  {id: 'newdm2', name: 'new-dm2(10.9.193.31)', icon: 'win', component: 'list', isOnline: true},
                  {id: 'tongxin8', name: 'SOC-tongxun60(10.9.193.56)', icon: 'win', component: 'list', isOnline: true},
                  {id: 'hxtg2', name: 'HXTG-2(10.9.193.122)', icon: 'db', component: 'list', isOnline: true},
                ]},
              {id: 'socmm', name: 'SOC-MM', icon: 'file',component: 'list', children: []}
            ]},
          {id: 'bleiwaiwang', name: 'B类(外网业务系统)', icon: 'file',component: 'list', children: [
              {id: 'sddgfgds', name: 'SOC-DM', icon: 'win',component: 'list', children: []},
              {id: 'wrxzxv', name: 'SOC-MM', icon: 'win',component: 'list', children: []}
            ]},
        ]},
      {id: 'yuingyongjiedian', name: '数据中心-备中心-亦庄-应用节点', icon: 'data', children: []}
    ] // 这里是异步请求回来的数据
    planManageTreeRef[1].children = cloneDeep(res)
  },10000)
}

// 监听
watch(planManageTreeRef, value => {
  if (value.every(item => item?.children.length > 0)) {
    treeConfigRea.lazy = false
  }
  loadTreeData()
})

watch(() => props.treeIsOpen, val => {
  if (val) {
    // 开启树的实时刷新
    treeOpenScroll = true
  } else {
    // 关闭树的实时刷新
  }
})

//生命周期
onMounted(() => {
  scenarioPlan()
  singlePointPlan()
})

defineExpose({
  manualRefreshTree
})
</script>

<style scoped>
.plan_manage_tree {
  width: 280px;
  height: 100%;
  border-right: 1px solid #e8eaec;
}
.tree_header {
  height: 50px;
  border-bottom: 1px solid #e8eaec;
}
.header_top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  height: 100%;
}
.tree_body {
  height: calc(100% - 50px);
}
.op_icon i:not(:last-child) {
  margin-right: 15px;
}
.header_search {
  padding: 0.2em 0.5em;
}
.cursor_pointer {
  cursor: pointer;
}
.color_66c2d1 {
  color: #66c2d1;
}
.font-size_14 {
  font-size: 14px;
}
:deep(.vxe-table--render-default .vxe-tree--node-btn){
  font-size: 12px;
  margin-top: -4px;
}
:deep(.vxe-table--render-default .vxe-body--row.row--current) {
  background-color: #d1f3fa;
}
:deep(.vxe-table--render-default .vxe-body--row.row--hover) {
  background-color: #ddf1f4;
}
:deep(.vxe-table--render-default .vxe-body--row.row--current) .active-color{
  color: #17a3bb;
}
</style>

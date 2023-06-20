<template>
  <div class="data-center_v" v-loading="isLoadingRef">
    <DragLayout>
      <template #leftTree>
        <GroupTree :isLoading="isLoadingRef" :getGroupFetch="getTreeData" @setCurrentNode="setCurrentNode"
                   ref="groupTreeRefs"
                   :treeConfig="treeConfig">
          <template #header_left>
            <div class="flex tree-left-icon">
              <Dropdown @on-click="handleSelectAdd" placement="bottom-start"
                        trigger="click" class="outerDropdown mr10">
                <i class="iconfont i-plus-full"></i>
                <template #list>
                  <DropdownMenu>
                    <DropdownItem name="addIDC">添加数据中心</DropdownItem>
                    <Dropdown placement="right-start" class="innerDropdown">
                      添加灾备站点
                      <i class="iconfont i-xiangyou1"></i>
                      <template #list>
                        <DropdownMenu>
                          <DropdownItem name="clwBackup">科力锐备份与恢复系统</DropdownItem>
                          <DropdownItem name="clwDatabase">科力锐数据库双活系统</DropdownItem>
                          <DropdownItem name="ADG">ADG系统</DropdownItem>
                        </DropdownMenu>
                      </template>
                    </Dropdown>
                    <DropdownItem name="addGroup">添加应用分组</DropdownItem>
                  </DropdownMenu >
                </template>
              </Dropdown>
              <i class="iconfont i-bianjisekuai" title="编辑" @click="handelEdit"></i>
              <i class="iconfont i-shanchu2 error" title="删除" @click="handleDet"></i>
            </div>
          </template>
          <template #column>
            <vxe-column tree-node field="name">
              <template #default="s">
                <span class="active-color">
                  <i class="tree-node-container iconfont i-lifangti"></i>
                  {{ s.row.name }}
                </span>
              </template>
            </vxe-column>
          </template>
        </GroupTree>
      </template>
      <template #rightContent>
        <div class="data-center-content">
          <div style="height: 50px; width: 100%; border: 1px solid red"></div>
          <div class="data-cente-list">
            <component :is="listCompsRef"
                       :jumpParams="jumpParamsRef"
                       :currentPath="currentPath"
                       :currentNode="currentNode"
                       @JumpPage="JumpPage"></component>
          </div>
        </div>
      </template>
    </DragLayout>
    <AddDataCenter ref="addDataCenterRefs" @updataTree="updataTree"></AddDataCenter>
    <AddAppliedGroup ref="addAppliedGroupRefs" @updataTree="updataTree"></AddAppliedGroup>
    <delMessagetip ref="delMessagetipRefs" @updataTree="updataTree"></delMessagetip>
  </div>
</template>

<script setup>
import DisasterRecoverySiteList from '@/views/DrMgr/DataCenter/DisasterRecoverySiteList.vue'
import VmDataCenter from '@/views/DrMgr/DataCenter/VmDataCenter.vue'
import SourceClientList from '@/views/DrMgr/DataCenter/SourceClientList.vue'
import DatabaseObjectList from '@/views/DrMgr/DataCenter/DatabaseObjectList.vue'
import RacObjectList from '@/views/DrMgr/DataCenter/RacObjectList.vue'
import AddBrSys from '@/views/DrMgr/DataCenter/AddBrSys.vue'

import {httpHelper} from '@/utils/httpHelper.js'
import { ref, shallowRef } from 'vue'
import {Dropdown, DropdownMenu, DropdownItem} from 'view-ui-plus'
import DragLayout from '@/components/DragLayout.vue'
import GroupTree from '@/components/GroupTree.vue'
import AddDataCenter from '@/views/DrMgr/DataCenter/AddDataCenter.vue'
import AddAppliedGroup from '@/views/DrMgr/DataCenter/AddAppliedGroup.vue'
import delMessagetip from '@/views/DrMgr/DataCenter/delMessagetip.vue'

const listComps = {
  'AddBrSys': AddBrSys,
  'RacObjectList': RacObjectList,
  'DatabaseObjectList': DatabaseObjectList,
  'SourceClientList': SourceClientList,
  'DisasterRecoverySiteList': DisasterRecoverySiteList,
  'VmDataCenter': VmDataCenter
}

const groupTreeRefs = ref(null)
const addDataCenterRefs = ref(null)
const addAppliedGroupRefs = ref(null)
const delMessagetipRefs = ref(null)
const isLoadingRef = ref(false)
let jumpParamsRef = ref()
let currentNode = ref({})
let currentPath = ref([])
let listCompsRef = shallowRef(DisasterRecoverySiteList)
const treeConfig = ref({
      parentField: 'parent_ident',
      rowField: 'group_ident',
      children: 'children',
      iconOpen: 'iconfont i-shouqi1',
      iconClose: 'iconfont i-zhankai1',
      indent: 19,
      expandAll: false,
    })

//切换组件
function JumpPage({comps, params}) {
  if (comps !== listCompsRef.value.__name) {
    jumpParamsRef.value = params || {}
    listCompsRef.value = listComps[comps]
  }
}
//设置左侧树选中信息
function setCurrentNode(node) {
  currentNode.value = node || {}
  listCompsRef.value = DisasterRecoverySiteList
}
// 更新跳转左侧树的方法，跳转group_ident,refresh是否更新，默认true
function updataTree(group_ident, refresh) {
  groupTreeRefs.value.manualRefreshTree()
}
// 获取左侧树数据
function getTreeData() {
  let params = {
    group_type_ids:[1,2,3],
    root_types_ids:[1]
  }
  return new Promise((resolve, reject) =>{
    httpHelper('/api/data_center/group/fetch_all_group_by_type/','POST',params).then(res => {
      console.log(res)
      // todo
      resolve(res.data)
    })
  })
}
// 添加
function handleSelectAdd(name) {
  if (name === 'addIDC') addIDC()
  if (name === 'addGroup') addGroup(currentNode.value)
  let fns = {
    clwBackup: addClwBackup,
    clwDatabase: addClwDatabase,
    ADG: addADG
  }
  fns[name]()
}

function addClwBackup() {
  JumpPage({comps: 'AddBrSys', params: {
      op_type: 'create',
      ident: '',
      dr_sys: '科力锐备份与恢复系统',
      backComp: listCompsRef.value.__name
    }})
}
function addClwDatabase() {
  JumpPage({comps: 'AddBrSys', params: {
      op_type: 'create',
      ident: '',
      dr_sys: '科力锐数据库双活系统',
      backComp: listCompsRef.value.__name
    }})
}
function addADG() {
  JumpPage({comps: 'AddBrSys', params: {
      op_type: 'create',
      ident: '',
      dr_sys: 'ADG系统',
      backComp: listCompsRef.value.__name
    }})
}
function addIDC(row, type) {
  addDataCenterRefs.value.show(row,type)
}

function addGroup(row, type) {
  addAppliedGroupRefs.value.show(row, type)
}
function handelEdit() {
  if (currentNode.value?.type_id == 1) {
    addIDC(currentNode.value, 'edit')
  }
  if(currentNode.value?.type_id !== 1) {
    addGroup(currentNode.value, 'edit')
  }
}

function handleDet() {
  delMessagetipRefs.value.show(currentNode.value)
}
</script>

<style scoped lang="less">
.data-center_v {
  display: flex;
  width: 100%;
  height: 100%;

  .data-center-list {
    width: 100%;
    height: calc(100% - 55px);
  }
}

.data-center-content {
  min-width: 900px;
  height: 100%;
  width: 100%;
}

.data-cente-list {
  width: 100%;
  height: calc(100% - 55px);
}

.tree-left-icon {
  i {
    font-size: 14px;
    cursor: pointer;
    color: #169BB2;
  }
  i:not(:last-child) {
    margin-right: 10px;
  }
}

i.error {
  color: #ff0000;
}
.i-xiangyou1{
  margin-left: 10px;
  font-weight: 100;
  color: #515A6E;
}

.innerDropdown {
  padding: 7px 16px;
}

.outerDropdown :deep(.ivu-select-dropdown) {
  width: 150px;
  border-radius: 4px 0 0 4px;
}

.innerDropdown :deep(.ivu-select-dropdown) {
  width: 182px;
  top: -4px!important;
  left: 150px!important;
  border-radius: 0 4px 4px 0;
}
</style>

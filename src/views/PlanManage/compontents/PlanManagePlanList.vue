<template>
  <div class="plan-manage-plan-list-v" v-loading="gridLoadingRef">
    <div class="plan-manage-plan-list-top">
      <div class="plan-manage-plan-list-top-btns-filter display-flex-center-space-between">
        <div class="plan-manage-plan-list-top-left-btns">
          <Button class="clw-btn mr10" @click="handerNewBuiltPlan">新建预案</Button>
          <ButtonGroup class="mr10 ">
            <Button class="clw-btn" @click="handerEexecutePlan">
              执行预案
            </Button>
            <Button class="clw-btn" @click="handerExecuteHistory">
              执行历史
            </Button>
          </ButtonGroup>
          <Button type="error" class="mr10 clw-btn-err" @click="handerDelete">删除</Button>
          <Poptip placement="bottom"
                  @on-popper-show="handerPopperShow"
                  v-model="popperVibRef"
                  width="300">
            <Button class="clw-btn">
              自定义列
              <Icon type="ios-arrow-down"></Icon>
            </Button>
            <template #content>
              <div class="custom-filed-poptip-content">
                <el-checkbox-group
                    class="custom-filed-checkbox"
                    v-model="showFieldRef">
                  <el-checkbox v-for="column in customColumnsRef.slice(1)"
                               :disabled="column.field_disabled"
                               :key="column.field"
                               v-model="column.visible"
                               :label="column.field">
                    {{ column.title }}
                  </el-checkbox>
                </el-checkbox-group>
                <div class="custom-filed-poptip-bottom">
                  <Button size="small" type="text" @click="handerFiledAll">全选</Button>
                  <Button size="small" type="text" @click="handerFiledDefault">默认</Button>
                  <Button size="small" type="text" @click="handerFiledCancel">取消</Button>
                  <Button class="clw-btn" size="small" @click="handerFiledConfirm">确定</Button>
                </div>
              </div>
            </template>
          </Poptip>
        </div>
        <div class="plan-manage-plan-list-top-right-filter">
          <ClwFilter
              width="360"
              ref="clwFilterRefs"
              popover-width="360"
              placeholder-text="请输入查询"
              :itemList="filterItemListRef"
              @search-icon="handerClickFilterSearchIcon"
              @delete-item="handerClickFilterDeleteItem"
              @clear-all="handerClickFilterClearAll"
              @do-confirm="handerClickFilterConfirm"
              @clear="handerClickFilterClearInput">
            <template #popover-con>
              <div class="clw-filter-content">
                <el-form
                    ref="filterForm"
                    :model="filterFormRat"
                    label-position="left"
                    label-width="100px"
                    class="filterForm">
                  <el-form-item label="编号">
                    <el-input v-model="filterFormRat.ident"></el-input>
                  </el-form-item>
                  <el-form-item label="预案名称">
                    <el-input v-model="filterFormRat.name"></el-input>
                  </el-form-item>
                  <el-form-item label="节点">
                    <el-input v-model="filterFormRat.server_node_name"></el-input>
                  </el-form-item>
                  <el-form-item label="RTO达标">
                    <el-input v-model="filterFormRat.rto_result"></el-input>
                  </el-form-item>
                  <el-form-item label="受控状态">
                    <el-input v-model="filterFormRat.controlled_stage"></el-input>
                  </el-form-item>
                  <el-form-item label="最后更新时间">
                    <DatePicker
                        v-model="filterFormRat.last_update_datetime"
                        type="datetime"
                        placeholder="请选择">
                    </DatePicker>
                  </el-form-item>
                </el-form>
              </div>
            </template>
          </ClwFilter>
        </div>
      </div>
      <div class="plan-manage-plan-list-top-left-desc-label display-flex-center-space-between">
        <div class="plan-manage-plan-list-top-left-desc">
          <span class="desc">
            已选中{{getSelectedItemRef.length}}项，共{{pagerCfgRat.total}}项
          </span>
        </div>
        <div class="plan-manage-plan-list-top-right-label">
          <ClwTag v-for="tag in tagLabelListRef"
                  :label="tag.label"
                  :bg-color="tag.bgColor"
                  :num="tag.num"
                  :key="tag.label"
                  :unit="tag.unit"
                  @click.native="tagClick(tag)"></ClwTag>
        </div>
      </div>
    </div>
    <div class="plan-manage-plan-list-table">
      <sq-grid ref="planManageListTableRefs"
               header-row-class="header-row-plan-manage-plan"
               border="none"
               class="plan-manage-plan-list-grid"
               height="auto"
               :pagerCfg="pagerCfgRat"
               :myGridSlots="slotsCfgRef"
               :gridData="PlanManagePlanListRef"
               :colsCfg="colsCfgRef"
               :sortConfig="{remote: true}"
               @change-checkbox="handerChangeCheckbox"
               @current-change="handerCurrentChange"
               @change-sort="handerChangeSort"
               @change-page="handerChangePage">
        <template #opt="s">
          <div class="plan-manage-list-table-opt">
            <div v-for="btn in handerOptButtons(s.p.row.buttons)"
                 class="plan-manage-list-table-opt"
                 :key="btn.op_type">
              <template v-if="btn.dpBtns">
                <Dropdown trigger="click"
                          placement="bottom-end"
                          @on-click="handerOptClick($event, s.p.row)">
                  <span class="opt-enable">
                    {{btn.label}}
                    <Icon type="ios-arrow-down"></Icon>
                  </span>
                  <template #list>
                    <DropdownMenu>
                      <DropdownItem v-for="dpBtn in btn.dpBtns"
                                    :name="dpBtn.op_type"
                                    :disabled="!dpBtn.enable"
                                    :key="dpBtn.op_type">
                        {{dpBtn.label}}
                      </DropdownItem>
                    </DropdownMenu>
                  </template>
                </Dropdown>
              </template>
              <template v-else>
                <span :class="[btn.enable ? 'opt-enable': 'opt-disabled']"
                      @click="handerOptClick(btn.op_type, s.p.row, btn.enable)">
                  {{btn.label}}
                </span>
                <div class="opt-divider"></div>
              </template>
            </div>
          </div>
        </template>
      </sq-grid>
    </div>
  </div>
</template>

<script setup>
import SqGrid from '@/components/SqGrid.vue'
import ClwTag from '@/components/ClwTag.vue'
import ClwFilter from '@/components/ClwFilter.vue'
import _ from 'lodash'
import PlanManagePlanListCfg from '@/assets/TableConfig/PlanManagePlanListCfg'
import {computed, onMounted, reactive, ref, nextTick} from "vue";

let filterItemListRef = ref([])
let gridLoadingRef = ref(false)
let PlanManagePlanListRef = ref([])
let planManageListTableRefs = ref(null)
let clwFilterRefs = ref(null)
let popperVibRef = ref(false)
let getSelectedItemRef = ref([])
let customColumnsRef = ref(PlanManagePlanListCfg.colsCfg)
let showFieldRef = ref([])
let slotsCfgRef = ref(PlanManagePlanListCfg.slotsCfg)
let tagLabelListRef = ref([
  {
    label: 'xxx',
    bgColor: 'red',
    num: '12',
    unit: '个'
  },
  {
    label: 'xxxx',
    bgColor: 'red',
    num: '13',
    unit: '个'
  },
  {
    label: 'xxxxx',
    bgColor: 'red',
    num: '14',
    unit: '个'
  }
])
let colsCfgRef = ref(PlanManagePlanListCfg.colsCfg)

let sortRat = reactive({
  order: '',
  property: ''
})
let pagerCfgRat = reactive({
  total: 100,
  currentPage: 1,
  pageSize: 100,
  pagerCount: 5,
  align: 'left',
  pageSizes: [ 100, 200, 300 ],
  layouts: ['Total', 'Sizes', 'PrevPage', 'JumpNumber', 'NextPage', 'FullJump'],
  perfect: true,
  autoHidden: false
})
let filterFormRat = reactive({
  keyword: '',
  ident: '',
  name: '',
  server_node_name: '',
  rto_result: '',
  controlled_stage: '',
  last_update_datetime: ''
})
onMounted(() => {
  nextTick(() => {
    if (!localStorage.getItem('planManagePlanListColumns')) {
      let curColumns = colsCfgRef.value.map(item => item.field)
      localStorage.setItem('planManagePlanListColumns', JSON.stringify(curColumns))
    }
    showFieldRef.value = JSON.parse(localStorage.getItem('planManagePlanListColumns'))
    handerFiledConfirm()
  })
  getPlanManagePlanList()
})

let emits = defineEmits(['NewBuiltPlan'])

let handerClickFilterSearchIcon = () => {
  filterFormRat.keyword = clwFilterRefs.value.inputValue
  getPlanManagePlanList()
}
let handerClickFilterDeleteItem = (key) => {
  filterFormRat[key] = Array.isArray(filterFormRat[key]) ? [] : ''
  handerClickFilterConfirm()
}
let handerClickFilterClearAll = () => {
  clwFilterRefs.value.inputValue = ''
  filterFormRat.keyword = clwFilterRefs.value.inputValue
  Object.keys(filterFormRat).forEach(key => {
    filterFormRat[key] = Array.isArray(filterFormRat[key]) ? [] : ''
  })
  handerClickFilterConfirm()
}
let handerClickFilterConfirm = () => {
  clwFilterRefs.value.inputValue = ''
  filterFormRat.keyword = clwFilterRefs.value.inputValue
  let m_label = {
    ident: '编号',
    name: '预案名称',
    server_node_name: '节点',
    rto_result: 'RTO达标',
    controlled_stage: '受控状态',
    last_update_datetime: '最后更新时间'
  }
  let m_showValue = [].concat([])
  filterItemListRef.value = Object.keys(filterFormRat).map(key => {
    if ((filterFormRat[key] && filterFormRat[key].length) || filterFormRat[key] instanceof Date) {
      if (key === 'last_update_datetime') {
        return {
          label: m_label[key],
          showValue: '时间',
          value: '时间',
          key: key
        }
      }
      return {
        label: m_label[key],
        showValue: filterFormRat[key],
        value: filterFormRat[key],
        key: key
      }
    }
    return null
  }).filter(Boolean)
  getPlanManagePlanList()
}
let handerClickFilterClearInput = () => {
  filterFormRat.keyword = clwFilterRefs.value.inputValue
  getPlanManagePlanList()
}
let handerPopperShow = () => {
  showFieldRef.value = JSON.parse(localStorage.getItem('planManagePlanListColumns'))
}
let handerFiledAll = () => {
  showFieldRef.value = customColumnsRef.value.map(item => item.field)
}
let handerFiledDefault = () => {
  showFieldRef.value = JSON.parse(localStorage.getItem('planManagePlanListColumns'))
}
let handerFiledCancel = () => {
  popperVibRef.value = false
}
let handerFiledConfirm = () => {
  localStorage.setItem('planManagePlanListColumns', JSON.stringify(showFieldRef.value))
  colsCfgRef.value = customColumnsRef.value.filter(item => {
    return showFieldRef.value.includes(item.field)
  })
  popperVibRef.value = false
}
let handerNewBuiltPlan = () => {
  emits('NewBuiltPlan')
  console.log('newBuiltPlan')
}
let handerEexecutePlan = () => {
  getPlanManagePlanList()
  console.log('handerEexecutePlan')
}
let handerExecuteHistory = () => {
  getPlanManagePlanList()
  console.log('handerExecuteHistory')
}
let handerDelete = () => {
  getPlanManagePlanList()
  console.log('handerDelete')
}
let tagClick = (tag) => {
  filterFormRat['controlled_stage'] = tag.num
  filterItemListRef.value = [
    {
      label: tag.label,
      showValue: tag.num,
      value: tag.num,
      key: 'controlled_stage'
    }
  ]
  getPlanManagePlanList()
}
let handerOptClick = (fn, p, enable=true) => {
  if (!enable) return
  console.log(fn, p, 'handerOptClick')
}
let handerChangePage = ({currentPage, pageSize}) => {
  pagerCfgRat.pageSize = pageSize
  pagerCfgRat.currentPage = currentPage
  getPlanManagePlanList()
}
let handerChangeCheckbox = (v) => {
  getSelectedItemRef.value = v
}
let handerCurrentChange = (v) => {
  getSelectedItemRef.value = [v.row]
}
let handerChangeSort = ({order, property}) => {
  sortRat.order = order
  sortRat.property = property
  getPlanManagePlanList()
}
let getPlanManagePlanList = () => {
  gridLoadingRef.value = true
  let p = {
    order: sortRat.order || '',
    property: sortRat.property || '',
    pageSize: pagerCfgRat.pageSize || 100,
    currentPage: pagerCfgRat.currentPage || 1,
    filterForm: filterFormRat
  }
  console.log(p, '请求参数')
  return new Promise((resolve, reject) => {
    resolve([
      {
        ident: '001',
        name: 'xxx',
        server_node_name: 'xxxx',
        rto_result: 'xxx',
        controlled_stage: 'xxx',
        last_update_datetime: 'xxx',
        buttons: [
          {
            label: '查看',
            op_type: 'view', //查看: 'view', 编辑:'edit'
            enable: true
          },
          {
            label: '更改',
            op_type: 'edit',
            enable: false
          },
          {
            label: '删除',
            op_type: 'del',
            enable: true
          },
          {
            label: '详情',
            op_type: 'detail',
            enable: false
          }
        ]
      },
      {
        ident: '001',
        name: 'xxx',
        server_node_name: 'xxxx',
        rto_result: 'xxx',
        controlled_stage: 'xxx',
        last_update_datetime: 'xxx',
        buttons: [
          {
            label: '查看',
            op_type: 'view', //查看: 'view', 编辑:'edit'
            enable: true
          },
          {
            label: '更改',
            op_type: 'edit',
            enable: false
          },
          {
            label: '删除',
            op_type: 'del',
            enable: true
          },
          {
            label: '详情',
            op_type: 'detail',
            enable: true
          }
        ]
      },
      {
        ident: '001',
        name: 'xxx',
        server_node_name: 'xxxx',
        rto_result: 'xxx',
        controlled_stage: 'xxx',
        last_update_datetime: 'xxx',
        buttons: [
          {
            label: '查看',
            op_type: 'view', //查看: 'view', 编辑:'edit'
            enable: true
          },
          {
            label: '更改',
            op_type: 'edit',
            enable: false
          },
          {
            label: '删除',
            op_type: 'del',
            enable: true
          },
          {
            label: '详情',
            op_type: 'detail',
            enable: true
          }
        ]
      },
      {
        ident: '001',
        name: 'xxx',
        server_node_name: 'xxxx',
        rto_result: 'xxx',
        controlled_stage: 'xxx',
        last_update_datetime: 'xxx',
        buttons: [
          {
            label: '查看',
            op_type: 'view', //查看: 'view', 编辑:'edit'
            enable: false
          },
          {
            label: '更改',
            op_type: 'edit',
            enable: true
          },
          {
            label: '删除',
            op_type: 'del',
            enable: false
          },
          {
            label: '详情',
            op_type: 'detail',
            enable: true
          }
        ]
      }
    ])
  }).then((res) => {
    setTimeout(() => {
      PlanManagePlanListRef.value = res
      gridLoadingRef.value = false
    }, 1000)
  })
}
let handerOptButtons = (btns) => {
  return [
    ...btns.slice(0, 2),
    {
      label: '更多',
      op_type: 'more',
      dpBtns: btns.slice(2)
    }
  ]
}
</script>

<style>
.filterForm .el-form-item .ivu-date-picker {
  width: 100%;
}

.filterForm .el-form-item .el-date-editor--datetime {
  width: 100%;
}
</style>
<style scoped>
.filterForm .el-form-item {
  margin-bottom: 10px;
}

.custom-filed-poptip-bottom button+button{
  margin-left: 5px;
}

.custom-filed-poptip-bottom {
  text-align: right;
  margin: 5px 0;
  border-top: 1px solid #c3cfe2;
  padding-top: 7px;
}

.custom-filed-checkbox {
  display: flex;
  flex-direction: column;
}

.plan-manage-list-table-opt {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.opt-divider {
  width: 2px;
  border-left: 2px solid #C3CBD6;
  height: 15px;
  margin-left: 5px;
}

span.opt-enable {
  display: inline-block;
  color: #2d8cf0;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
}

span.opt-disabled {
  display: inline-block;
  color: #C3CBD6;
  font-size: 14px;
  font-weight: 400;
  cursor: not-allowed;
}

.plan-manage-plan-list-v {
  width: 100%;
  height: 100%;
}

.clw-btn.ivu-btn {
  border-color: #17a2bb;
  color: #17a2bb;
  background-color: white;
}

.clw-btn.ivu-btn:hover{
  background-color: #17a2bb;
  color: white;
}

.clw-btn-err.ivu-btn {
  border-color: #f16643;
  color: #f16643;
  background-color: white;
}

.clw-btn-err.ivu-btn:hover{
  background-color: #f16643;
  color: white;
}

.mr10 {
  margin-right: 10px;
}

.display-flex-center-space-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.plan-manage-plan-list-top-right-label {
  display: flex;
}

.plan-manage-plan-list-top-left-desc-label {
  padding: 16px 0;
}

/*.plan-manage-plan-list-top {*/
/*  min-width: 700px;*/
/*}*/

.plan-manage-plan-list-top-left-desc {
  color: rgb(158, 167, 180);
  font-size: 13px;
  font-weight: 400;
}

.plan-manage-plan-list-table {
  height: calc(100% - 90px);
}
</style>

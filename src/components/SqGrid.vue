<template>
  <div class="r-table-business-logic">
    <vxe-grid
      ref="myGrid"
      class="clw-vxe-table"
      auto-resize
      highlight-hover-row
      highlight-current-row
      show-footer
      v-loading="loading"
      :data="gridData"
      :row-class-name="rowClassName"
      :cell-class-name="cellClass"
      :header-row-class-name="headerRowClass"
      :align="align"
      :height="height"
      :stripe="stripe"
      :resizable="resizable"
      :show-overflow="showOverflow"
      :row-config="rowConfig"
      :columns="colsCfg"
      :tooltip-config="tooltipConfig"
      :pager-config="pagerConfig"
      :sort-config="sortConfig"
      :checkbox-config="checkboxConfig"
      @current-change="_currentChanged"
      @checkbox-change="_checkboxClicked"
      @checkbox-all="_checkboxClicked"
      @cell-dblclick="cellDblClick"
      @cell-mouseenter="cellMouseenter"
      @cell-mouseleave="cellMouseleave"
      @sort-change="_sortChanged"
      @page-change="_pagerChanged"
      v-bind="$attrs">
      <template v-for="name in myGridSlots" #[name]="scope">
        <slot :name="name" :p="scope"></slot>
      </template>
      <template #base_func_default="{ row }">
        <span v-html="row.base_func"></span>
      </template>
    </vxe-grid>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// 声明props
const props = defineProps({
  align: {
    type: String,
    default: 'left'
  },
  loading: {
    type: Boolean,
    default: false
  },
  resizable: {
    type: Boolean,
    default: true
  },
  stripe: {
    type: Boolean,
    default: false
  },
  showOverflow: {
    type: Boolean,
    default: true
  },
  autoResize: {
    type: Boolean,
    default: false
  },
  height: {
    type: [ Number, String ],
    default: 'auto'
  },
  headerRowClass: {
    type: [ String, Function ],
    default: function _default() {
      return ''
    }
  },
  colsCfg: {
    type: Array,
    default: function _default() {
      return []
    }
  },
  gridData: {
    type: Array,
    default: function _default() {
      return []
    }
  },
  myGridSlots: {
    type: Array,
    default: function _default() {
      return []
    }
  },
  defaultGridSelect: {
    type: Array,
    default: function () {
      return []
    }
  },
  sortConfig: {
    type: Object,
    default: function _default() {
      return { iconAsc: '', iconDesc: '', remote: false }
    }
  },
  pagerCfg: {
    type: Object,
    default: function _default() {
      return {
        enabled: false
      }
    }
  },
  checkboxConfig: {
    type: Object,
    default: function () {
      return { checkRowKeys: [] }
    }
  },
  rowConfig: {
    type: Object,
    default() {
      return { keyField: 'keyField' }
    }
  },
  tooltipConfig: {
    type: Object,
    default() {
      return { showAll: false }
    }
  },
  cellDblClick: {
    type: Function,
    default: function () {
    }
  },
  cellMouseenter: {
    type: Function,
    default: function () {
    }
  },
  cellMouseleave: {
    type: Function,
    default: function () {
    }
  },
  rowClassName: {
    type: Function,
    default() {
      return ''
    }
  },
  fetchData: {
    type: Function,
    default: function () {
      return null
    }
  },
  cellClass: {
    type: Function,
    default: function _default() {
      return ''
    }
  },
})
const emit = defineEmits([ 'change-sort', 'change-page', 'change-checkbox' ])// 声明自定义事件
const myGrid = ref(null)// 当前表格引用
const checkedRows = ref([])
// 页码配置项
let initPagerConfig = {
  total: 0,
  currentPage: 1,
  pageSize: 10,
  pagerCount: 5,
  align: 'left',
  pageSizes: [ 10, 20, 50 ],
  layouts: [ 'Sizes', 'PrevPage', 'Number', 'NextPage', 'FullJump', 'Total' ],
  perfect: true,
  autoHidden: false
}
const pagerConfig = ref(Object.assign(initPagerConfig, props.pagerCfg))


// 侦听
watch(props.pagerCfg, (newVal) => {
  pagerConfig.value = Object.assign(pagerConfig.value, newVal)
})

// 处理排序改变
function _sortChanged(_ref) {
  // 发送回当前排序的方式与名称
  emit('change-sort', { order: _ref.order, property: _ref.property })
  props.fetchData()
}

// 处理分页改变
function _pagerChanged(_ref) {
  let pageSize = _ref.pageSize
  pagerConfig.value.currentPage = _ref.currentPage
  pagerConfig.value.pageSize = pageSize
  // 发送回当前页与每页大小
  emit('change-page', { currentPage: _ref.currentPage, pageSize: pageSize })
  props.fetchData()
}

// 实现表格单选
function _currentChanged(_ref6) {
  let row = _ref6.row
  checkedRows.value = [ row ]
  myGrid.value.clearCheckboxRow()
  myGrid.value.setCheckboxRow(row, true)
}

// 实现表格多选
function _checkboxClicked(_ref7) {
  checkedRows.value = _ref7.record
  emit('change-checkbox', _ref7.records)
  myGrid.value.clearCurrentRow()
}
</script>

<style scoped>
.r-table-business-logic {
  height: 100%;
  display: flex;
  fLex-flow: column nowrap;
}

.rowHeight .vxe-cell.c--tooltip {
  max-height: none !important;
  height: auto !important;
}
</style>
<template>
  <div class="content">
    <sq-grid ref="nanotube-center-table"
             v-loading="gridLoading"
             header-row-class="header-row-class"
             border="none"
             class="vxe-table-inner-border"
             row-id="system_id"
             height="auto"
             :align="align"
             :stripe="true"
             :show-overflow="true"
             :my-grid-slots="['a', 'b']"
             :grid-data="filterGridDataList"
             :row-config="{ isCurrent: true, isHover: true, height: 56 }"
             :column-config="{resizable: true}"
             :cols-cfg="colsCfg"
             :checkbox-config="{reserve: true}"
             @current-change="currentChange"
             @checkbox-change="checkboxChange"
             @checkbox-all="checkboxChange"
             @cell-dblclick="cellDblClick">
      <template #a="s">
        <div>
          {{ s.p.row.e }}
        </div>
      </template>
      <template #b>
        <el-button type="primary">测试</el-button>
      </template>
    </sq-grid>
    <el-button type="primary" @click="watchTest">测试侦听器</el-button>
  </div>
</template>

<script setup>
import SqGrid from '@/components/SqGrid.vue'
import { onMounted, ref } from 'vue'

const gridLoading = ref(false)
const filterGridDataList = ref([
  {
    a: '111111111111111111111111111111111111111111111111111111111111111111111111',
    b: '111',
    c: '111',
    d: '111',
    e: '111'
  },
  { a: '111', b: '111', c: '111', d: '111', e: '111' },
  { a: '111', b: '111', c: '111', d: '111', e: '111' },
  { a: '111', b: '111', c: '111', d: '111', e: '111' },
  { a: '111', b: '111', c: '111', d: '111', e: '111' }
])
const colsCfg = ref([
  { type: 'checkbox', width: 44, align: 'center' },
  { field: 'a', title: '灾备系统名称', minWidth: 200, sortable: true, resizable: true },
  { field: 'b', title: '灾备系统访问IP', minWidth: 200, sortable: true },
  { field: 'c', title: '系统类型', minWidth: 200, sortable: true },
  { field: 'd', title: '部署地域', minWidth: 200, sortable: true },
  {
    field: 'e',
    title: '告警状态',
    minWidth: 200,
    sortable: true,
    slots: {
      default: 'a'
    }
  },
  {
    title: '操作',
    width: 320,
    minWidth: 250,
    sortable: false,
    align: 'center',
    slots: {
      default: 'b'
    }
  }
])
const align = ref('left')
onMounted(() => {
  gridLoading.value = true
  setTimeout(() => {
    gridLoading.value = false
  }, 1000)
})

function checkboxChange() {
  // console.log(e)
}

function currentChange() {
  // console.log(row)
}

function cellDblClick() {
  // console.log(row)
}

function watchTest() {
  align.value = 'center'
}
</script>

<style scoped>
.content {
  height: 500px;
}
</style>
<script>
export default {
  name: 'DrawerStep1',
  defineButtonBtn: [
    {type: 'text', text: '取消', drawerBtnType: 'cancel'},
    {type: 'primary', text: '确定', drawerBtnType: 'confirm'}
  ]
}
</script>
<script setup>
function cancel() {
  return Promise.resolve('取消')
}
function confirm() {
  return Promise.resolve('确定')
}
defineExpose({
  cancel,
  confirm
})
</script>

<template>
  <div>
    抽屉1
  </div>
</template>

<style scoped>
</style>

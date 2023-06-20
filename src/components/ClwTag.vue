<template>
  <div class="clw-tag"
       :style="{height: tagHeight, lineHeight: tagHeight, backgroundColor: bgColor, color: color}">
    <slot>
      {{label}}： {{num}}{{unit}}
    </slot>
  </div>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps({
  unit: {
    type: String,
    default: '个'
  },
  label: {
    type: String,
    default: ''
  },
  num: {
    type: [String, Number],
    default: ''
  },
  height: {
    type: [String, Number],
    default: '27px'
  },
  bgColor: {
    type: String,
    default: 'rgba(107, 107, 107, 1)'
  },
  color: {
    type: String,
    default: '#ffffff'
  }
})

let tagHeight = computed(() => {
  if (/^\d+$/.test(props.height)) {
    return props.height + 'px'
  }
  return props.height
})
</script>

<style scoped>
.clw-tag {
  cursor: pointer;
  padding: 0 10px;
  border-radius: 2px;
  display: inline-block;
}

.clw-tag + .clw-tag {
    margin-left: 10px;
}
</style>

<script>
export default {
  name: 'AbPullRefresh'
}
</script>
<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue'
import { PullRefresh } from 'vant'
import { useVModel } from '@vueuse/core'
const props = defineProps({
  hiddenScroll: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  setMinHeight: {
    type: Boolean,
    default: true
  },
  bottomHeight: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['refresh', 'update:loading'])
const loading = useVModel(props, 'loading', emit)
const onRefresh = (e) => {
  emit('refresh', e)
}

const wrapperHeight = ref(window.innerHeight)
const abPullRefreshBox = ref(null)
// onMounted(() => {
//   // const offsetTop = abPullRefreshBox.value.$el.offsetTop
//   // console.log(offsetTop)
//   wrapperHeight.value = window.innerHeight - 46
// })
const minHeight = computed(() => {
  return props.setMinHeight ? wrapperHeight.value - props.bottomHeight + 'px' : 'auto'
})
</script>
<template>
  <PullRefresh v-model="loading" :disabled="disabled" @refresh="onRefresh">
    <div ref="abPullRefreshBox" :style="{ minHeight: minHeight }">
      <slot></slot>
    </div>
  </PullRefresh>
</template>
<style lang="scss"></style>

<script>
export default {
  name: 'AbScrollLayout'
}
</script>
<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import AbPullRefresh from '@/components/AbPullRefresh.vue'
// import { useVModel } from '@vueuse/core'
defineProps({
  hiddenScroll: {
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
  // loading: {
  //   type: Boolean,
  //   default: false
  // }
})
const emit = defineEmits(['refresh', 'update:loading'])
// const loading = useVModel(props, 'loading', emit)
const loading = ref(false)
const onRefresh = (e) => {
  emit('refresh', e)
  loading.value = false
}
</script>
<template>
  <div class="abScrollPage">
    <slot name="header"></slot>
    <div class="abScrollContent" :class="{ hiddenScroll: hiddenScroll }">
      <AbPullRefresh
        v-model:loading="loading"
        :disabled="disabled"
        :set-min-height="setMinHeight"
        :bottom-height="bottomHeight"
        @refresh="onRefresh"
      >
        <slot></slot>
      </AbPullRefresh>
    </div>
  </div>
</template>
<style lang="scss">
.abScrollPage {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .abScrollContent {
    flex: 1;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    &.hiddenScroll {
      overflow: hidden;
      //.van-pull-refresh {
      //}
    }
  }
  //.van-pull-refresh {
  //  min-height: 100%;
  //  //.van-pull-refresh__track {
  //  //  min-height: 100vh;
  //  //}
  //}
}
</style>

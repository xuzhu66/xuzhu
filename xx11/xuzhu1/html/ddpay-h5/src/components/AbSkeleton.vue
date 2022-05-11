<script>
export default {
  name: 'AbSkeleton'
}
</script>
<script setup>
import { Skeleton } from 'vant'
import { defineProps } from 'vue'
defineProps({
  row: {
    type: [Number, String],
    default: 0
  },
  loading: {
    type: Boolean,
    default: true
  },
  rowWidth: {
    type: [Number, String, Array],
    default: '100%'
  },
  title: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: Boolean,
    default: false
  },
  animate: {
    type: Boolean,
    default: true
  },
  round: {
    type: Boolean,
    default: false
  },
  titleWidth: {
    type: [String, Number],
    default: '40%'
  },
  avatarSize: {
    type: [String, Number],
    default: '32px'
  },
  avatarShape: {
    type: String,
    default: 'round'
  }
})
</script>
<template>
  <Skeleton
    :loading="loading"
    :row="row"
    :row-width="rowWidth"
    :title="title"
    :avatar="avatar"
    :animate="animate"
    :round="round"
    :title-width="titleWidth"
    :avatar-size="avatarSize"
    :avatar-shape="avatarShape"
  >
    <slot></slot>
  </Skeleton>
</template>
<style lang="scss">
.abSkeleton {

}
.van-skeleton {
  padding: 0;
}
</style>

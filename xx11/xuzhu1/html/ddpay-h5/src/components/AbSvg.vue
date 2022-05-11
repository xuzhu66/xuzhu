<script>
export default {
  name: 'AbSvg'
}
</script>
<script setup>
import { defineProps } from 'vue'

defineProps({
  active: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  // Mini Middle Large
  size: {
    type: String,
    default: 'Middle'
  },
  colorType: {
    type: String,
    default: 'gray'
  }
})
</script>

<template>
  <div
    class="AbSvg"
    :class="colorType"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss">
.AbSvg {
  width: 20px;
  height: 20px;
  svg {
    width: 100%;
    height: 100%;
  }
  &.gray {
    svg {
      path {
        fill: grey;
      }
    }
  }
}

</style>

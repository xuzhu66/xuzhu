<script>
export default {
  name: 'AbCell'
}
</script>
<script setup>
import { defineProps } from 'vue'
defineProps({
  title: {
    type: String,
    default: ''
  },
  value: {
    type: String,
    default: ''
  }
})
</script>
<template>
  <div class="abCell flex-center-between">
    <div class="abCellTitle">
      <div>{{ title }}</div>
      <slot name="icon">
        <span class="icon"></span>
      </slot>
    </div>
    <div class="abCellValue">{{ value }}</div>
  </div>
</template>

<style lang="scss">
.abCell {
  height: 44px;
  padding: 0 10px;
  .abCellTitle {
    font-weight: 600;
    font-size: 14px;
    color: var(--ab-main-text-color);
  }
  .abCellValue {
    font-weight: 600;
    font-size: 14px;
    color: var(--ab-main-gray-text-color);
  }
}
</style>

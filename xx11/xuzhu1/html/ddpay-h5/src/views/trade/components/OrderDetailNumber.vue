<script setup>
import { defineProps } from 'vue'
defineProps({
  labelType: {
    type: String,
    default: ''
  },
  label: {
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
  <div class="infoTop flex-column-center-center">
    <div class="orderLabel" :class="labelType">{{ label }}</div>
    <div class="orderNumber">{{ value }} DDB</div>
    <div class="van-hairline--bottom"></div>
  </div>
</template>

<style lang="scss" scoped>
.infoTop {
  margin-bottom: 15px;
}
.infoItem {
  color: var(--ab-main-text-color);
  font-size: 14px;
  text-align: left;
  font-weight: 500;
}

.orderLabel {
  color: var(--ab-cell-label-color);
  font-size: 12px;
  margin-bottom: 10px;
  &.black {
    color: var(--ab-main-text-color);
    font-size: 14px;
    font-weight: 600;
  }
}
.orderNumber {
  color: var(--ab-main-text-color);
  font-weight: bold;
  font-size: 20px;
}
</style>

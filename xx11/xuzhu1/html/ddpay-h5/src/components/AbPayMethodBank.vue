<script>
export default {
  name: 'AbPayMethodBank'
}
</script>
<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  label: {
    type: String,
    default: '请选择收款方式'
  }
})
const emit = defineEmits(['click'])
const click = (e) => {
  emit('click', e)
}
</script>
<template>
  <div class="abPayMethodBank flex-center-between" @click="click">
    <div>{{ label }}</div>
    <div class="payIcon abRectangleRight"></div>
  </div>
</template>
<style lang="scss">

.abPayMethodBank {
  height: 50px;
  padding: 0 10px;
  font-size: 15px;
  font-weight: 600;
  color: #B8BBC3;
  background: #F6F7FD;
  border-radius: 8px;

  .payIcon {
    width: 7.73px;
    height: 13.24px;
    margin-right: 5px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
}
.abRectangleRight {
  background-image: url('~@/assets/images/trade/Rectangle.png');
}
</style>

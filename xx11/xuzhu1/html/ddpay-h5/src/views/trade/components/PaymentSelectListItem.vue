<script setup>
import { defineProps, defineEmits } from 'vue'
import { selectFilterName } from '@/utils/selectFilter'

const props = defineProps({
  item: {
    type: Object,
    default: () => {
      return {}
    }
  },
  active: {
    type: Boolean,
    default: false
  },
  paymentClassListAble: {
    type: Object,
    default: () => {
      return []
    }
  }
})
const emit = defineEmits(['changeTab'])
const changeTab = () => {
  emit('changeTab', props.item)
}
const name = selectFilterName(props.item.payway, props.paymentClassListAble, {
  key: 'payway',
  value: 'payName'
})
</script>
<template>
  <div class="listItem" :class="{ active: active }" @click="changeTab">
    <div class="payLabel">
      {{ name }}
      {{ item.acctNo }}
    </div>
    <div class="abSelectIcon"></div>
  </div>
</template>
<style lang="scss" scoped>
.listItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 10px;
  height: 45px;
}
.abSelectIcon {
  display: none;
  width: 16px;
  height: 16px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url('~@/assets/images/trade/selectActive.png');
}
.payLabel {
  font-size: 15px;
  font-weight: 500;
  color: var(--ab-main-gray-text-color);
}
.active {
  background: #f6f7fd;
  .abSelectIcon {
    display: block;
  }
  .payLabel {
    color: var(--ab-main-text-color);
  }
}
</style>

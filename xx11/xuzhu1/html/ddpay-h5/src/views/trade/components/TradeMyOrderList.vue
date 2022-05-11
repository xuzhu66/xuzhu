
<script setup>
import TradeMyOrderListItem from './TradeMyOrderListItem.vue'
import {
  defineProps,
  defineEmits
} from 'vue'
defineProps({
  list: {
    type: Array,
    default: () => {
      return []
    }
  }
})
const emit = defineEmits([
  'orderClick'
])
const orderClick = (item) => {
  emit('orderClick', item)
}
</script>
<template>
  <div class="listBox flex-column-center-center">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="itemBox"
    >
      <TradeMyOrderListItem
        :item="item"
        @orderClick="orderClick"
      ></TradeMyOrderListItem>
      <div class="van-hairline--bottom"></div>
    </div>
  </div>
</template>

<style scoped>
.listBox {
  padding: 0 16px;
  border-radius: 8px;
}
.itemBox {
  width: 100%;
}
</style>

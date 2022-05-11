
<script setup>
import TradeGoingListItem from './TradeGoingListItem'
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
    <TradeGoingListItem
      v-for="(item, index) in list"
      :key="index"
      :item="item"
      @orderClick="orderClick"
    ></TradeGoingListItem>
  </div>
</template>

<style scoped>
.listBox {
  /*margin: 0 16px;*/
}
</style>

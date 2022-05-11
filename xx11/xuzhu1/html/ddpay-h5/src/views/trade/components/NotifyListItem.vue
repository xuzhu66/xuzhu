<script setup>
import {
  defineProps
  // defineEmits
} from 'vue'
import AbCellItem from '@/components/AbCellItem.vue'
defineProps({
  item: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
</script>
<template>
  <div class="listItem">
    <div class="listItemCon">
      <div class="infoTop flex-column-center-center">
        <div class="orderLabel">订单数量</div>
        <div class="orderNumber">1,599.0000 DDB</div>
      </div>
      <div class="van-hairline--bottom"></div>
      <div class="lineMargin"></div>
      <AbCellItem class="cellItem" title="单价" value="¥1.00/DDB"></AbCellItem>
      <AbCellItem class="cellItem" title="付款方式" value="张三里斯"></AbCellItem>
      <AbCellItem class="cellItem" title="订单号" value="129i29u192u99u9u"></AbCellItem>
      <AbCellItem class="cellItem" title="创建时间" value="2021-01-06 13:30"></AbCellItem>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.listItem {
  //width: 250px;
  padding: 10px;
  margin-top: 10px;
  margin-left: 10px;
  background: var(--ab-content-gray-bg-color);
  border-radius: 8px;
  &:first-child {
    margin-left: 0;
  }
}
.listItemCon {
  width: 250px;
}
.infoTop {
  margin-bottom: 15px;
}
.lineMargin {
  padding-bottom: 15px;
}
.orderLabel {
  color: var(--ab-cell-label-color);
  font-size: 12px;
}
.orderNumber {
  color: var(--ab-main-text-color);
  font-weight: bold;
  font-size: 20px;
}
</style>

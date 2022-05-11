<script setup>
import { storeToRefs } from 'pinia'
// import { useTradeStore } from '@/store/modules/trade'
import { useSelectStore } from '@/store/modules/select'
import PaymentSelectListItem from './PaymentSelectListItem.vue'
const selectStore = useSelectStore()
const { paymentListOneDeep } = storeToRefs(selectStore)
console.log(paymentListOneDeep)
// const list = ref([])
</script>

<template>
  <div class="abPaymentSelectList">
    <div v-for="(item, index) in paymentListOneDeep" :key="index">
      <PaymentSelectListItem></PaymentSelectListItem>
      <div class="van-hairline--bottom"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.abPaymentSelectList {
  display: flex;
  flex-direction: column;
}
</style>

<script setup>
import { pushWithQuery } from '@/hooks/useQuery'
import AbDialog from '@/components/AbDialog.vue'
import NotifyList from './NotifyList.vue'
// import { useCssVar } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useTradeStore } from '@/store/modules/trade'
const storeTrade = useTradeStore()
const { notifyNumber, notifyList, showNotifyDialog } = storeToRefs(storeTrade)
const confirm = () => {
  showNotifyDialog.value = false
  if (notifyNumber.value <= 1) {
    // 到 交易订单详情页面
    pushWithQuery('Trade', {
      tab: 2
    })
  } else {
    // 到 交易中 页面
    pushWithQuery('Trade', {
      tab: 2
    })
  }
  storeTrade.$patch((state) => {
    state.notifyNumber = 0
  })
}
</script>

<template>
  <AbDialog
    v-model:show="showNotifyDialog"
    title="订单处理提醒"
    :show-cancel-button="false"
    show-confirm-button
    confirm-button-text="好的"
    @confirm="confirm"
  >
    <NotifyList :list="notifyList"></NotifyList>
  </AbDialog>
</template>

<style lang="scss" scoped></style>

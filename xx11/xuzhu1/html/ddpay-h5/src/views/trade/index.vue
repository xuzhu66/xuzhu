<script>
export default {
  name: 'TradeIndex'
}
</script>
<script setup>
import { ref, watch, onActivated } from 'vue'
import { storeToRefs } from 'pinia'
import { useTradeStore } from '@/store/modules/trade'
import { useSelectStore } from '@/store/modules/select'
import { pushWithQuery } from '@/hooks/useQuery'
import AbScrollLayout from '@/components/AbScrollLayout'
import NavMenu from './components/NavMenu.vue'
import TradeBuy from './components/TradeBuy.vue'
import TradeSell from './components/TradeSell.vue'
import TradeGoing from './components/TradeGoing.vue'
import TradeDialogNotify from './components/TradeDialogNotify.vue'
import TradeDialogDownOrder from './components/TradeDialogDownOrder.vue'
import TradeDialogConfirmBuy from './components/TradeDialogConfirmBuy'
import TradeDialogPaywayList from './components/TradeDialogPaywayList.vue'
import TradeDialogConfirmSell from './components/TradeDialogConfirmSell'
import PopupUserTips from './components/PopupUserTips.vue'
import DialogActualTip from './components/DialogActualTip.vue'

import { useHomeStore } from '@/store/modules/home'

const homeStore = useHomeStore()
const { fetchHomeAccountList } = homeStore

const activeTab = ref(0)
const storeTrade = useTradeStore()
const { notifyNumber } = storeToRefs(storeTrade)
const { setNotifyDialog, fetchNotifyList, fetchTradeLimit } = storeTrade

const selectStore = useSelectStore()
const { fetchPaymentList, fetchPaymentClassList } = selectStore

// function setNotifyNumber(value){
// storeTrade.$patch({
//   notifyNumber: 2
// })
// storeTrade.$patch(state => {
//   state.notifyNumber = 3
// })
// }
// storeTrade.$subscribe((mutation, state) => {
//   console.log('mutation', mutation)
//   console.log('state', state)
// })
// const show = ref(false)
function setShow() {
  console.log('show')
  if (notifyNumber.value > 0) {
    setNotifyDialog(true)
  } else {
    // 直接去 我的订单页面
    pushWithQuery('TradeMyOrder')
  }
}
const disabled = ref(true)
const hiddenScroll = ref(true)
watch(
  activeTab,
  (value) => {
    // console.log(value)
    if (value != 2) {
      disabled.value = false
      hiddenScroll.value = false
    } else {
      disabled.value = true
      hiddenScroll.value = true
    }
  },
  { immediate: true }
)
// const change = () => {
//   if (activeTab.value != 2) {
//     disabled.value = false
//   } else {
//     disabled.value = true
//   }
// }

const refresh = () => {
  initData()
}

onActivated(() => {
  initData()
})

const initData = () => {
  fetchPaymentList({
    // payway: 10
  })
  fetchPaymentClassList()
  fetchNotifyList()
  fetchTradeLimit()
  fetchHomeAccountList()
}
// initData()
</script>
<template>
  <AbScrollLayout
    :disabled="disabled"
    :set-min-height="false"
    :hidden-scroll="hiddenScroll"
    @refresh="refresh"
  >
    <div class="abContainer">
      <NavMenu
        v-model:activeTab="activeTab"
        :notify-number="notifyNumber"
        @clickNotify="setShow"
      ></NavMenu>
      <div>
        <TradeBuy v-show="activeTab == 0"></TradeBuy>
        <TradeSell v-show="activeTab == 1"></TradeSell>
        <TradeGoing v-show="activeTab == 2"></TradeGoing>
      </div>
      <TradeDialogNotify></TradeDialogNotify>
      <TradeDialogDownOrder></TradeDialogDownOrder>
      <TradeDialogConfirmBuy></TradeDialogConfirmBuy>
      <TradeDialogPaywayList></TradeDialogPaywayList>
      <TradeDialogConfirmSell></TradeDialogConfirmSell>
      <PopupUserTips></PopupUserTips>
      <DialogActualTip></DialogActualTip>
    </div>
  </AbScrollLayout>
</template>
<style lang="scss">
.abContainer {
  padding-left: var(--ab-page-padding);
  padding-right: var(--ab-page-padding);
  //background-color: var(--ab-page-container-background-color);
  padding-top: 46px;
  padding-bottom: 60px;
  //min-height: calc(100% - 50px);
}
</style>

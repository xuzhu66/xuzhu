<script setup>
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useTradeStore } from '@/store/modules/trade'
import AbPopup from '@/components/AbPopup'
import AbCellItem from '@/components/AbCellItem'
import OrderDetailNumber from './OrderDetailNumber.vue'
// import { pushWithQuery } from '@/hooks/useQuery'
import { useSelectStore } from '@/store/modules/select'
import { useCountDown, formatTime } from '@/hooks/useCountDown'
import { selectFilterName } from '@/utils/selectFilter'

const selectStore = useSelectStore()
const { paymentList, paymentClassListAble } = storeToRefs(selectStore)

const tradeStore = useTradeStore()
const {
  showTradeBuy,
  preBuy,
  selectPaywayObj,
  buyPreLoadingCancel,
  buyPreLoadingConfirm
} = storeToRefs(tradeStore)
const { fetchBuyOrderPreMatchConfirm } = tradeStore

const paywayStr = computed(() => {
  if (selectPaywayObj.value.payway) {
    // console.log(selectPaywayObj.value.payway)
    const name = selectFilterName(
      selectPaywayObj.value.payway,
      paymentClassListAble,
      {
        key: 'payway',
        value: 'payName'
      }
    )
    return `${name.value} ${selectPaywayObj.value.acctNo}`
  } else {
    return ''
  }
})

const haveTime = computed(() => {
  return preBuy.value.cancelOrderCountdown
})
const { state } = useCountDown(haveTime)
// const { state } = countDown(toRef(props.orderDetail, 'matchCountdown'))
const timeFormat = computed(() => {
  return formatTime(state.count)
})

const clickBank = () => {
  // console.log('11')
  tradeStore.$patch((state) => {
    state.showTradePaymentList = true
  })
}
const confirm = async () => {
  // tradeStore.$patch((state) => {
  //   state.showTradeBuy = false
  // })
  // // pushWithQuery('TradeOrderMatching')
  // pushWithQuery('TradeOrderMatching')
  buyPreLoadingConfirm.value = true
  await fetchBuyOrderPreMatchConfirm({
    preOrderId: preBuy.value.preOrderId,
    payBankId: selectPaywayObj.value.id
  })
  buyPreLoadingConfirm.value = false
}
const cancelBuy = async () => {
  showTradeBuy.value = false
  // buyPreLoadingCancel.value = true
  // await fetchBuyOrderCancel({
  //   buyNo: preBuy.value.preOrderId
  // })
  // buyPreLoadingCancel.value = false
}
const initData = () => {
  // console.log(paymentList)
  if (paymentList.value && paymentList.value.length > 0) {
    selectPaywayObj.value = paymentList.value[0]
  }
}
watch(
  showTradeBuy,
  (t) => {
    if (t == true) {
      initData()
    }
  },
  { immediate: true }
)
</script>

<template>
  <AbPopup
    v-model:show="showTradeBuy"
    closeable
    close-icon="close"
    position="bottom"
    :cancel-is-close="false"
    show-cancel-button
    show-confirm-button
    :cancel-loading="buyPreLoadingCancel"
    :confirm-loading="buyPreLoadingConfirm"
    cancel-button-text="放弃购买"
    confirm-button-text="确认购买"
    @cancel="cancelBuy"
    @confirm="confirm"
  >
    <template #title>
      <div class="titleBox">
        <OrderDetailNumber
          label-type="black"
          label="确认购买"
          :value="preBuy.availableAmt"
        ></OrderDetailNumber>
        <div class="van-hairline--bottom"></div>
      </div>
    </template>
    <template #otherCancel>
      <span class="otherCancel">({{ timeFormat }})</span>
    </template>
    <div class="popBox">
      <AbCellItem
        title="付款账号"
        :value="paywayStr"
        right-type="arrow"
        @clickRight="clickBank"
      ></AbCellItem>
      <AbCellItem title="单价" :value="`¥${preBuy.price} / DDB`"></AbCellItem>
      <AbCellItem
        title="可得"
        :value="`${preBuy.availableAmt} DDB`"
      ></AbCellItem>
      <div class="van-hairline--bottom"></div>
      <!--      <div class="warningText">-->
      <!--        注意：您所购买的 Bcoin ，将在未来xx个小时内被限制-->
      <!--      </div>-->
      <!--      <div class="limitText">限制规则>></div>-->
    </div>
  </AbPopup>
</template>

<style lang="scss" scoped>
.titleBox {
  padding: 0 16px;
}
.popBox {
  padding: 0 27px;
}
.warningText {
  margin-top: 5px;
  color: var(--ab-text-warning);
  font-weight: 500;
  font-size: 12px;
  text-align: left;
}
.otherCancel {
  color: var(--ab-text-warning);
  font-weight: 600;
  font-size: 12px;
}
.limitText {
  margin-top: 7px;
  font-weight: 500;
  font-size: 12px;
  text-align: right;
}
</style>

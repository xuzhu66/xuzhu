<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTradeStore } from '@/store/modules/trade'
import AbPopup from '@/components/AbPopup'
import AbCellItem from '@/components/AbCellItem'
import OrderDetailNumber from './OrderDetailNumber.vue'
import { Switch } from 'vant'
import { useSelectStore } from '@/store/modules/select'
import { selectFilterName } from '@/utils/selectFilter'

const storeTrade = useTradeStore()
const { showTradeSell, showTradeSellLoading, selectPaywayObj, preSell } = storeToRefs(storeTrade)
const { fetchSellOrderConfirm } = storeTrade
const selectStore = useSelectStore()
const { paymentClassListAble } = storeToRefs(selectStore)
// const confirm = () => {
//   showTradeBuy.value = false
// }
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
const clickBank = () => {
  console.log('11')
  storeTrade.$patch((state) => {
    state.showTradePaymentList = true
  })
}

const checked = ref(false)

const confirm = () => {
  fetchSellOrderConfirm({
    checked: checked.value
  })
  // storeTrade.$patch((state) => {
  //   state.showTradeSellNotice = true
  // })
}

</script>

<template>
  <AbPopup
    v-model:show="showTradeSell"
    closeable
    close-icon="close"
    position="bottom"
    show-cancel-button
    show-confirm-button
    :confirm-loading="showTradeSellLoading"
    cancel-button-text="放弃出售"
    confirm-button-text="确认出售"
    @confirm="confirm"
  >
    <template #title>
      <div class="titleBox">
        <OrderDetailNumber
          label-type="black"
          label="确认出售"
          :value="preSell.sellAmt"
        ></OrderDetailNumber>
        <div class="van-hairline--bottom"></div>
      </div>
    </template>
    <div class="popBox">
      <AbCellItem
        title="收款账号"
        :value="paywayStr"
        right-type="arrow"
        @clickRight="clickBank"
      ></AbCellItem>
      <AbCellItem title="单价" :value="`¥${preSell.price} / DDB`"></AbCellItem>
      <AbCellItem
        title="可得"
        :value="`${preSell.availableAmount} DDB`"
      ></AbCellItem>
      <AbCellItem title="是否开启拆分出售">
        <template #iconRight>
          <Switch v-model="checked" size="18px" class="switchStyle"></Switch>
        </template>
      </AbCellItem>
      <div class="van-hairline--bottom"></div>
      <div class="warningText">友情提示：拆分出售可加速成交</div>
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
.limitText {
  margin-top: 7px;
  font-weight: 500;
  font-size: 12px;
  text-align: right;
}
.switchStyle {
  //width: 40px;
  //height: 20px;

  //width: 18px;
  //height: 18px;
}
</style>

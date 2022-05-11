<script>
export default {
  name: 'TradeOrderMatching'
}
</script>
<script setup>
import { computed, unref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import AbSkeleton from '@/components/AbSkeleton'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import AbNavBar from '@/components/AbNavBar'
import AbCellItem from '@/components/AbCellItem.vue'
import TradeOrderMatchingBuy from './components/TradeOrderMatchingBuy.vue'
import TradeOrderMatchingSell from './components/TradeOrderMatchingSell'
import AbScrollLayout from '@/components/AbScrollLayout'
import { useTradeStore } from '@/store/modules/trade'
import AbDialog from '@/components/AbDialog'
import { pushWithQuery } from '@/hooks/useQuery'
import { useSelectStore } from '@/store/modules/select'
import { selectFilterName } from '@/utils/selectFilter'
import { useCountDown } from '@/hooks/useCountDown'
import { goBack } from '@/hooks/useQuery'

const tradeStore = useTradeStore()
const {
  orderMatchDetail,
  orderMatchLoading,
  matchTimer,
  showOrderAppealing,
  appealingTime
} = storeToRefs(tradeStore)
const { fetchBuyOrderMatchDetail, fetchSellOrderMatchDetail, fetchSafeCenter } =
  tradeStore

const selectStore = useSelectStore()
const { dictionariesAction, fetchPaymentClassList } = selectStore
const { dictionary } = storeToRefs(selectStore)

const route = useRoute()
const query = route.query

// const confirmTrans = () => {
//   pushWithQuery('TradeMyOrderDetail')
// }
// const appeal = () => {
//   pushWithQuery('TradeOrderAppeal')
// }
// const { state, start } = countDown(orderMatchDetail.value.matchCountdown)
// start()
// const timeFormat = computed(() => {
//   return formatTime(state.count)
// })
// const status = computed(() => {
//   return orderMatchDetail.value.status
// })
// const label = computed(() => {
//   const { label } = useOrderDetail(orderMatchDetail.value.status, [], 'match')
//   return label.value
// })
const orderNo = computed(() => {
  return query.tradeRole == 10
    ? orderMatchDetail.value.buyNo
    : orderMatchDetail.value.tradeNo
})
const appealType = computed(() => {
  const name = selectFilterName(
    orderMatchDetail.value?.appealCategory,
    dictionary.value['APPEAL_CATEGORY']
  )
  return unref(name)
})
// const haveTime = ref(10)
// const startCount = computed(() => {
//   return haveTime.value
// })
const { state, start, clear } = useCountDown(appealingTime)

// const confirmCancel = () => {
//   fetchBuyOrderCancel({
//     buyNo: orderMatchDetail.value.buyNo
//   })
// }
const toHelp = () => {
  pushWithQuery('Chat')
}
const cancelBack = () => {
  clear()
  showOrderAppealing.value = false
  goBack()
}
watch(state, (t) => {
  if (t.count == 0 && showOrderAppealing.value) {
    cancelBack()
  }
})
watch(showOrderAppealing, (t) => {
  if (t) {
    start()
  }
})
const initData = () => {
  if (query.tradeRole == 10) {
    const params = {
      // tradeRole: query.tradeRole,
      buyNo: query.buyNo
    }
    fetchBuyOrderMatchDetail(params)
  } else if (query.tradeRole == 20) {
    const params = {
      // tradeRole: query.tradeRole,
      tradeNo: query.tradeNo
    }
    fetchSellOrderMatchDetail(params)
  }
}

fetchSafeCenter()
dictionariesAction({
  codes: ['APPEAL_CATEGORY']
})
fetchPaymentClassList()
initData()
matchTimer.value = setInterval(() => {
  initData()
}, 5000)
orderMatchLoading.value = true
onBeforeRouteLeave((to, from) => {
  clearInterval(matchTimer.value)
})
</script>

<template>
  <AbScrollLayout>
    <div class="tradeOrderMatching">
      <AbNavBar title="DDB交易" show-service></AbNavBar>
      <div class="detailContentBox">
        <div class="detailContent">
          <AbSkeleton :row="3" :loading="orderMatchLoading" title>
            <div>
              <AbCellItem
                class="cellItem"
                title="订单号："
                :value="orderNo"
                right-type="copy"
              ></AbCellItem>
              <AbCellItem
                class="cellItem"
                title="购买数量："
                :value="`${
                  query.tradeRole == 10
                    ? orderMatchDetail.buyAmt
                    : orderMatchDetail.amt
                } DDB`"
              ></AbCellItem>
              <AbCellItem
                class="cellItem"
                title="奖励："
                :value="`${orderMatchDetail.profitAmt} DDB`"
              ></AbCellItem>
              <AbCellItem
                class="cellItem"
                title="单价："
                :value="`¥${orderMatchDetail.price} DDB`"
              ></AbCellItem>
              <AbCellItem
                class="cellItem"
                title="创建时间："
                :value="orderMatchDetail.createdTime"
              ></AbCellItem>
              <div class="lineMargin">
                <div class="van-hairline--bottom"></div>
              </div>
              <TradeOrderMatchingBuy
                v-if="query.tradeRole == 10"
                :order-detail="orderMatchDetail"
              ></TradeOrderMatchingBuy>
              <TradeOrderMatchingSell
                v-if="query.tradeRole == 20"
                :order-detail="orderMatchDetail"
              ></TradeOrderMatchingSell>
            </div>
          </AbSkeleton>
        </div>
      </div>

      <AbDialog
        v-model:show="showOrderAppealing"
        show-cancel-button
        show-confirm-button
        cancel-button-text="我知道了"
        confirm-button-text="联系客服"
        title="您的订单已被申诉！ "
        @cancel="cancelBack"
        @confirm="toHelp"
      >
        <div class="infoBox">
          <AbCellItem
            class="cellItem"
            title="申诉单号："
            :value="orderMatchDetail.appealNo"
            right-type="copy"
          ></AbCellItem>
          <AbCellItem
            class="cellItem"
            title="申诉方信息："
            :value="orderMatchDetail.appealRealName"
          ></AbCellItem>
          <AbCellItem
            class="cellItem"
            title="申诉理由："
            :value="appealType"
          ></AbCellItem>
          <div class="otherCancel tips">
            *提交申诉后当前订单涉及的DDB会被冻结，直到申诉处理完毕！
          </div>
        </div>
        <template #otherCancel>
          <span class="otherCancel">({{ state.count }}s)</span>
        </template>
      </AbDialog>
    </div>
  </AbScrollLayout>
</template>

<style lang="scss" scoped>
.cellItem {
  //height: 14px;
  //margin-bottom: 14px;
  font-weight: 500;
  .abCellTitle {
    font-weight: 500;
    font-size: 14px;
  }
  .abCellValue {
    font-weight: 500;
    font-size: 14px;
  }
}
.infoBox {
  padding: 10px 10px 0;
}
.tradeOrderMatching {
  min-height: calc(100% - 116px);
  padding-top: 46px;
  padding-bottom: 70px;
  background-color: var(--ab-page-container-background-color);
}
.detailContentBox {
  padding-bottom: 20px;
}
.detailContent {
  margin: 15px 16px 0;
  padding: 23px 10px;
  background-color: var(--ab-main-content-background-color);
}

.lineMargin {
  height: 1px;
  margin: 16px 0;
}
.otherCancel {
  font-size: 12px;
  color: var(--ab-text-warning);
}
.tips {
  margin-top: 14px;
}
</style>

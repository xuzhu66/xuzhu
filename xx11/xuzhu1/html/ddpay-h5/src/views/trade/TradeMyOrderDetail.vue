<script setup>
import AbNavBar from '@/components/AbNavBar'
import AbScrollLayout from '@/components/AbScrollLayout'
import AbBottomFixed from '@/components/AbBottomFixed'
import TradeDialogConfirmDown from './components/TradeDialogConfirmDown.vue'
import { useTradeStore } from '@/store/modules/trade'
import { storeToRefs } from 'pinia'
import AbSkeleton from '@/components/AbSkeleton'
import { useRoute } from 'vue-router'
import OrderDetailBuy from './components/OrderDetailBuy.vue'
import OrderDetailSell from './components/OrderDetailSell'
import OrderDetailSellGoing from './components/OrderDetailSellGoing'
import { useSelectStore } from '@/store/modules/select'

const tradeStore = useTradeStore()
const { myOrderDetail, orderDetailLoading, showOrderDownDialog } = storeToRefs(tradeStore)
const { fetchMyOrderDetail, fetchMyOrderDetailSell } = tradeStore

const selectStore = useSelectStore()
const { tradeStatusArr, sellStatusArr } = storeToRefs(selectStore)
const { fetchPaymentClassList } = selectStore

const route = useRoute()
const query = route.query

const showOrderDown = () => {
  showOrderDownDialog.value = true
}
fetchPaymentClassList()
const initData = () => {
  let params
  if (query.type == 1) {
    if (query.tradeRole == 10) {
      params = {
        buyNo: query.buyNo
      }
    } else {
      params = {
        tradeNo: query.tradeNo
      }
    }
    // const params = {
    //   tradeNo: query.tradeRole == 20 ? query.tradeNo : '',
    //   buyNo: query.tradeRole == 10 ? query.buyNo : ''
    //   // tradeRole: query.tradeRole
    //   // createdTime: query.createdTime
    // }
    fetchMyOrderDetail(params)
  } else if (query.type == 2) {
    const params = {
      sellNo: query.sellNo
    }
    fetchMyOrderDetailSell(params)
  }
}
initData()
</script>

<template>
  <AbScrollLayout :bottom-height="90" @refresh="initData">
    <div class="tradeMyOrderDetail">
      <AbNavBar title="订单明细"></AbNavBar>
      <div
        class="detailContentBox"
        :class="query.type == 2 ? 'showBottomFixed' : ''"
      >
        <div class="detailContent">
          <AbSkeleton :row="3" :loading="orderDetailLoading" title>
            <OrderDetailSell
              v-if="query.type == 1 && query.tradeRole == 20"
              :order-detail="myOrderDetail"
              :sell-status-arr="sellStatusArr"
              :trade-status-arr="tradeStatusArr"
              :type="query.type"
            ></OrderDetailSell>
            <OrderDetailBuy
              v-if="query.type == 1 && query.tradeRole == 10"
              :order-detail="myOrderDetail"
              :sell-status-arr="sellStatusArr"
              :trade-status-arr="tradeStatusArr"
              :type="query.type"
            ></OrderDetailBuy>
            <OrderDetailSellGoing
              v-if="query.type == 2"
              :order-detail="myOrderDetail"
              :sell-status-arr="sellStatusArr"
              :trade-status-arr="tradeStatusArr"
              :type="query.type"
            ></OrderDetailSellGoing>
          </AbSkeleton>
        </div>
        <AbBottomFixed
          v-if="query.type == 2 && myOrderDetail.status == 10"
          confirm-text="订单下架"
          @confirm="showOrderDown"
        ></AbBottomFixed>
      </div>
      <TradeDialogConfirmDown :sell-no="query.sellNo"></TradeDialogConfirmDown>
    </div>
  </AbScrollLayout>
</template>

<style lang="scss" scoped>
.tradeMyOrderDetail {
  min-height: calc(100% - 46px);
  padding-top: 46px;
  background-color: var(--ab-page-container-background-color);
}
.detailContentBox {
  padding-bottom: 20px;
  &.showBottomFixed {
    padding-bottom: 90px;
  }
}
.detailContent {
  margin: 15px 16px 0;
  padding: 23px 10px;
  background-color: var(--ab-main-content-background-color);
}
.infoBox {
  padding: 0 20px;
}
</style>

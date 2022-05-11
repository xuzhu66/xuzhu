<script>
export default {
  name: 'TradeMyOrder'
}
</script>
<script setup>
import { ref, onActivated } from 'vue'
import AbNavBar from '@/components/AbNavBar'
import AbTabsSwipe from '@/components/AbTabsSwipe.vue'
import AbDialog from '@/components/AbDialog.vue'
import TradeMyOrderListItem from './components/TradeMyOrderListItem.vue'
import { useTradeStore } from '@/store/modules/trade'
import { storeToRefs } from 'pinia'
import { pushWithQuery } from '@/hooks/useQuery'
import { useCssVar } from '@vueuse/core'
import { onBeforeRouteLeave } from 'vue-router'
import { useSelectStore } from '@/store/modules/select'

const active = ref(0)
const selectStore = useSelectStore()
const { tradeStatusArr, sellStatusArr } = storeToRefs(selectStore)

const tradeStore = useTradeStore()
const {
  myOrderTradeListCurrent,
  myOrderTradeList,
  myOrderTradeListLoading,
  myOrderTradeListFinished,
  myOrderTradeListRefreshing,

  myOrderGoingListCurrent,
  myOrderGoingList,
  myOrderGoingListLoading,
  myOrderGoingListFinished,
  myOrderGoingListRefreshing,

  myOrderDoneListCurrent,
  myOrderDoneList,
  myOrderDoneListLoading,
  myOrderDoneListFinished,
  myOrderDoneListRefreshing,

  myOrderCancelListCurrent,
  myOrderCancelList,
  myOrderCancelListLoading,
  myOrderCancelListFinished,
  myOrderCancelListRefreshing,

  myOrderQuestionListCurrent,
  myOrderQuestionList,
  myOrderQuestionListLoading,
  myOrderQuestionListFinished,
  myOrderQuestionListRefreshing,

  myOrderSellListCurrent,
  myOrderSellList,
  myOrderSellListLoading,
  myOrderSellListFinished,
  myOrderSellListRefreshing
} = storeToRefs(tradeStore)
const {
  fetchOrderTradeList,
  fetchOrderGoingList,
  fetchOrderDoneList,
  fetchOrderCancelList,
  fetchOrderQuestionList,
  fetchOrderSellList,

  resetOrderTradeListState,
  resetOrderGoingListState,
  resetOrderDoneListState,
  resetOrderCancelListState,
  resetOrderQuestionListState,
  resetOrderSellListState
} = tradeStore

const tabsList = ref([
  {
    id: '0',
    title: '交易订单',
    items: myOrderTradeList,
    refreshing: myOrderTradeListRefreshing,
    loading: myOrderTradeListLoading,
    error: false,
    finished: myOrderTradeListFinished,
    onLoad: fetchOrderTradeList,
    current: myOrderTradeListCurrent
  },
  {
    id: '1',
    title: '进行中',
    items: myOrderGoingList,
    refreshing: myOrderGoingListRefreshing,
    loading: myOrderGoingListLoading,
    error: false,
    finished: myOrderGoingListFinished,
    onLoad: fetchOrderGoingList,
    current: myOrderGoingListCurrent
  },
  {
    id: '2',
    title: '已完成',
    items: myOrderDoneList,
    refreshing: myOrderDoneListRefreshing,
    loading: myOrderDoneListLoading,
    error: false,
    finished: myOrderDoneListFinished,
    onLoad: fetchOrderDoneList,
    current: myOrderDoneListCurrent
  },
  {
    id: '3',
    title: '已取消',
    items: myOrderCancelList,
    refreshing: myOrderCancelListRefreshing,
    loading: myOrderCancelListLoading,
    error: false,
    finished: myOrderCancelListFinished,
    onLoad: fetchOrderCancelList,
    current: myOrderCancelListCurrent
  },
  {
    id: '4',
    title: '申诉中',
    items: myOrderQuestionList,
    refreshing: myOrderQuestionListRefreshing,
    loading: myOrderQuestionListLoading,
    error: false,
    finished: myOrderQuestionListFinished,
    onLoad: fetchOrderQuestionList,
    current: myOrderQuestionListCurrent
  },
  {
    id: '5',
    title: '出售挂单',
    items: myOrderSellList,
    refreshing: myOrderSellListRefreshing,
    loading: myOrderSellListLoading,
    error: false,
    finished: myOrderSellListFinished,
    onLoad: fetchOrderSellList,
    current: myOrderSellListCurrent
  }
])

const clickItem = (item) => {
  // console.log(item)
  if (item.status == 20 || item.status == 30 || item.status == 40) {
    pushWithQuery('TradeOrderMatching', item)
  } else if (item.status == 50) {
    show.value = true
  } else {
    let param
    if (active.value == 5) {
      param = {
        type: 2,
        sellNo: item.sellNo
      }
    } else {
      param = {
        type: 1,
        tradeNo: item.tradeNo,
        buyNo: item.buyNo,
        tradeRole: item.tradeRole
      }
    }
    pushWithQuery('TradeMyOrderDetail', param)
  }
  // tradeStore.setOrderDownDialog(true)
  // if (item == 1) {
  //   const param = {
  //     type: 3,
  //     ...item
  //   }
  //   pushWithQuery('TradeOrderMatching', param)
  // }
}

const navBarBackgroundVar = useCssVar('--ab-page-container-background-color')
const titleActiveColorVar = useCssVar('--ab-button-main-color')
const titleInactiveColorVar = useCssVar('--ab-button-gray-text-color')
const titleThemeColorVar = useCssVar('--ab-button-main-color')

const toDetail = ref(false)
const hasOpen = ref(false)
onBeforeRouteLeave((to, from) => {
  // console.log('onBeforeRouteLeave')
  hasOpen.value = true
  if (to.name == 'TradeOrderMatching' || to.name == 'TradeMyOrderDetail' || to.name == 'Chat') {
    // 缓存列表数据
    toDetail.value = true
    console.log(to.name)
  } else {
    setTimeout(() => {
      active.value = 0
      resetOrderTradeListState()
      resetOrderGoingListState()
      resetOrderDoneListState()
      resetOrderCancelListState()
      resetOrderQuestionListState()
      resetOrderSellListState()
    }, 1000)
    toDetail.value = false
  }
})
onActivated(() => {
  // console.log('onActivated')
  if (hasOpen.value && !toDetail.value) {
    fetchOrderTradeList()
  }
})
const show = ref(false)
const confirm = () => {
  show.value = false
  pushWithQuery('Chat')
}
</script>

<template>
  <div class="myOrderPage">
    <AbNavBar title="我的订单"></AbNavBar>
    <div class="orderBox">
      <AbTabsSwipe
        v-model:tabActive="active"
        :swipeable="true"
        :data-list="tabsList"
        :to-detail-name="['TradeOrderMatching', 'TradeMyOrderDetail', 'Chat']"
        class-name="tradeMyOrderId"
        :show-tab="true"
        :nav-bar-background="navBarBackgroundVar"
        :title-active-color="titleActiveColorVar"
        :title-inactive-color="titleInactiveColorVar"
        :title-theme-color="titleThemeColorVar"
        :bottom-height="60"
      >
        <template #default="{ item }">
          <TradeMyOrderListItem
            :sell-status-arr="sellStatusArr"
            :trade-status-arr="tradeStatusArr"
            :item="item"
            :active="active"
            @orderClick="clickItem"
          ></TradeMyOrderListItem>
          <div class="van-hairline--bottom linePadding"></div>
        </template>
      </AbTabsSwipe>
      <AbDialog
        v-model:show="show"
        show-cancel-button
        show-confirm-button
        cancel-button-text="我知道了"
        confirm-button-text="联系客服"
        @confirm="confirm"
      >
        <div class="appeal">当前订单已被申诉，无法进行操作及查看</div>
      </AbDialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.myOrderPage {
  min-height: calc(100% - 46px);
  padding-top: 46px;
  background-color: var(--ab-page-container-background-color);
  :deep(.abTabsSwipeListCenter) {
    padding: 1px 10px;
    border-radius: 8px;
    background-color: #ffffff;
  }
  .linePadding {
    height: 1px;
    //padding: 16px 9px;
  }
}
.orderTabs {
  position: fixed;
  top: 46px;
  left: 0;
  z-index: 10;
  width: 100%;
}
.orderBox {
  //background-color: var(--ab-main-content-background-color);
  margin: 0 16px;
}
.paddingStyle {
  padding-bottom: 20px;
}
.appeal {
  padding: 20px 10px;
  text-align: center;
  font-weight: 500;
  font-size: 15px;
  color: var(--ab-main-text-color);
}
</style>

<script>
export default {
  name: 'TradeGoing'
}
</script>
<script setup>
import { storeToRefs } from 'pinia'
import TradeGoingListItem from './TradeGoingListItem.vue'
import { useTradeStore } from '@/store/modules/trade'
import AbTabsSwipe from '@/components/AbTabsSwipe.vue'
import { ref, onActivated } from 'vue'
import { pushWithQuery } from '@/hooks/useQuery'
import { onBeforeRouteLeave } from 'vue-router'
import { useSelectStore } from '@/store/modules/select'
// import { selectFilterName } from '@/utils/selectFilter'

const tradeStore = useTradeStore()
const {
  tradeGoingListCurrent,
  tradeGoingList,
  tradeGoingListLoading,
  tradeGoingListFinished,
  tradeGoingListRefreshing
} = storeToRefs(tradeStore)
const { fetchTradeGoingList, resetTradeGoingListState } = tradeStore
fetchTradeGoingList()

const selectStore = useSelectStore()
// const { getDictionaryAction } = selectStore
const { tradeStatusArr } = storeToRefs(selectStore)

const tabsList = ref([
  {
    id: '0',
    items: tradeGoingList,
    refreshing: tradeGoingListRefreshing,
    loading: tradeGoingListLoading,
    error: false,
    finished: tradeGoingListFinished,
    onLoad: fetchTradeGoingList,
    current: tradeGoingListCurrent
  }
])

const clickItem = (item) => {
  console.log(item)
  // tradeStore.setOrderDownDialog(true)
  let param
  if (item.tradeRole == 10) {
    param = {
      tradeRole: item.tradeRole,
      buyNo: item.buyNo
    }
  } else if (item.tradeRole == 20) {
    param = {
      tradeRole: item.tradeRole,
      tradeNo: item.tradeNo
    }
  }
  pushWithQuery('TradeOrderMatching', param)
}
// const refreshList = (item) => {
//   tradeStore.$patch((state) => {
//     state.tradeGoingListList = []
//     state.tradeGoingListFinished = false
//     state.tradeGoingListCurrent = 1
//   })
//   fetchTradeGoingList()
// }

const tabActive = ref(0)

const toDetail = ref(false)
const hasOpen = ref(false)
onBeforeRouteLeave((to, from) => {
  // console.log('onBeforeRouteLeave')
  hasOpen.value = true
  if (to.name == 'TradeOrderMatching' || to.name == 'TradeMyOrder') {
    // 缓存列表数据
    toDetail.value = true
  } else {
    setTimeout(() => {
      resetTradeGoingListState()
    }, 1000)
    toDetail.value = false
  }
})
onActivated(() => {
  console.log('trade going onActivated')
  if (hasOpen.value && !toDetail.value) {
    fetchTradeGoingList()
  }
})
</script>

<template>
  <div class="goingList">
    <AbTabsSwipe
      v-model:tabActive="tabActive"
      :swipeable="false"
      :data-list="tabsList"
      :to-detail-name="['TradeOrderMatching', 'TradeMyOrder']"
      class-name="tradeGoingId"
      :bottom-height="50"
    >
      <template #default="{ item }">
        <TradeGoingListItem
          :trade-status-arr="tradeStatusArr"
          :item="item"
          @orderClick="clickItem"
        ></TradeGoingListItem>
      </template>
    </AbTabsSwipe>
  </div>
</template>

<style lang="scss" scoped>
.goingList {
  //padding-bottom: 70px;
}
</style>

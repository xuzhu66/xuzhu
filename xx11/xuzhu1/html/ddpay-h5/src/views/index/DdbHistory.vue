<script>
export default {
  name: 'DdbHistory'
}
</script>
<script setup>
import AbNavBar from '@/components/AbNavBar'
import AbTableTitle from '@/components/AbTableTitle.vue'
import AbTabsSwipe from '@/components/AbTabsSwipe.vue'
import AbScrollLayout from '@/components/AbScrollLayout'
import DialogTimeList from './common/DialogTimeList.vue'
import { ref, onUnmounted, onActivated, onDeactivated, unref } from 'vue'
import { storeToRefs } from 'pinia'
import { pushWithQuery } from '@/hooks/useQuery'
import { selectFilterName } from '@/utils/selectFilter'
import { onBeforeRouteLeave } from 'vue-router'
import { useFundStore } from '@/store/modules/fund'
import { useSelectStore } from '@/store/modules/select'

const toDetail = ref(false)
const hasOpen = ref(false)
onBeforeRouteLeave((to, from) => {
  // console.log('onBeforeRouteLeave')
  hasOpen.value = true
  if (to.name == 'DetailCoin') {
    toDetail.value = true
  } else {
    setTimeout(() => {
      resetDdbExchangeHistoryState()
    }, 1000)
    toDetail.value = false
  }
})

onUnmounted(() => {
  // console.log('onUnmounted')
  // resetDdbExchangeHistoryState()
})

onActivated(() => {
  // console.log('onActivated')
  if (hasOpen.value && !toDetail.value) {
    fetchDdbExchangeList()
  }
})

onDeactivated(() => {
  // console.log('onDeactivated')
})

const fundStore = useFundStore()
const {
  ddbExchangeHistoryCurrent,
  ddbExchangeHistoryList,
  ddbExchangeHistoryListLoading,
  ddbExchangeHistoryFinished,
  ddbExchangeHistoryListRefreshing,

  showTimeDropdown,
  checkedTime,
  // checkedLabel,
  tabActiveUsdtHistory,
  tabsUsdtHistory
} = storeToRefs(fundStore)
const { fetchDdbExchangeList, resetDdbExchangeHistoryState } = fundStore

const selectStore = useSelectStore()
const { dictionariesAction } = selectStore
const { dictionary } = storeToRefs(selectStore)

const tableTitleTabs = () => {
  return [
    {
      name: '时间'
    },
    {
      name: '数量'
    },
    {
      name: '状态'
    }
  ]
}
const setArrayName = (item) => {
  const name = selectFilterName(item.status, dictionary.value['EXCHANGE_ORDER_STATUS'])
  return [
    {
      name: item.createdTime
    },
    {
      name: item.buyAmt
    },
    {
      name: unref(name)
    }
  ]
}
const getStatusType = (item) => {
  if (item.status == 10) {
    return '1'
  } else if (item.status == 100) {
    return '2'
  } else if (item.status == -100) {
    return '3'
  }
}
// const clickRight = () => {
//   fundStore.$patch((state) => {
//     state.showTimeDropdown = true
//   })
// }
// 时间筛选类型
dictionariesAction({
  codes: ['APP_FUNDS_QUERY', 'EXCHANGE_ORDER_STATUS']
}).then(() => {
  fundStore.$patch((state) => {
    state.checkedTime = dictionary.value['APP_FUNDS_QUERY'][0].key
    state.checkedLabel = dictionary.value['APP_FUNDS_QUERY'][0].value
  })
})
// fetchDdbExchangeList()

const tabsList = ref([
  {
    id: '0',
    items: ddbExchangeHistoryList,
    refreshing: ddbExchangeHistoryListRefreshing,
    loading: ddbExchangeHistoryListLoading,
    error: false,
    finished: ddbExchangeHistoryFinished,
    onLoad: fetchDdbExchangeList,
    current: ddbExchangeHistoryCurrent
  }
])

const clickItem = (item) => {
  // console.log(item)
  const param = {
    type: 4,
    ...item
  }
  pushWithQuery('DetailCoin', param)
}
const refreshList = (item) => {
  fundStore.$patch((state) => {
    // state.checkedTime = time
    state.checkedLabel = item.value
    state.showTimeDropdown = false

    state.ddbExchangeHistoryList = []
    state.ddbExchangeHistoryFinished = false
    state.ddbExchangeHistoryCurrent = 1

    // state.checkedTime = dictionary.value['APP_FUNDS_QUERY'][0].key
    // state.checkedLabel = dictionary.value['APP_FUNDS_QUERY'][0].value
  })
  fetchDdbExchangeList()
}
</script>
<template>
  <AbScrollLayout hidden-scroll disabled>
    <div class="detail">
      <AbNavBar title="历史记录"></AbNavBar>
      <main class="content">
        <div class="contentList">
          <AbTableTitle
            :tabs="tableTitleTabs()"
            class="listTitleBottom"
            layout="center"
          ></AbTableTitle>
          <div class="van-hairline--bottom lineSpace"></div>
          <div class="coinBoxHeight">
            <AbTabsSwipe
              v-model:tab-active="tabActiveUsdtHistory"
              :tabs="tabsUsdtHistory"
              :swipeable="false"
              :data-list="tabsList"
              :to-detail-name="['DetailCoin']"
              class-name="fundListId"
            >
              <template #default="{ item }">
                <AbTableTitle
                  :tabs="setArrayName(item)"
                  :status="2"
                  :status-type="getStatusType(item)"
                  style-type="black"
                  show-arrow
                  layout="center"
                  @click="clickItem(item)"
                ></AbTableTitle>
              </template>
            </AbTabsSwipe>
          </div>
        </div>
      </main>
      <DialogTimeList
        v-model:checkedTime="checkedTime"
        v-model:show="showTimeDropdown"
        @refresh="refreshList"
      ></DialogTimeList>
    </div>
  </AbScrollLayout>
</template>

<style lang="scss" scoped>
.detail {
  min-height: calc(100% - 46px);
  padding-top: 46px;
  .content {
    //padding: 0 16px 0;
  }
}
.contentList {
  padding: 10px 10px 8px;
  background-color: var(--ab-main-content-background-color);
  border-radius: 8px;
  .abTableTitle {
    padding: 0 0 8px;
  }
}
.lineSpace {
  height: 1px;
}
.listTitleBottom {
  margin-bottom: 8px;
}
</style>

<script>
export default {
  name: 'FundList'
}
</script>
<script setup>
import AbNavBar from '@/components/AbNavBar'
import AbTabsCheck from '@/components/AbTabsCheck.vue'
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
      resetFundState()
    }, 1000)
    toDetail.value = false
  }
})

onUnmounted(() => {
  // console.log('onUnmounted')
  // resetFundState()
})

onActivated(() => {
  // console.log('onActivated')
  if (hasOpen.value && !toDetail.value) {
    fetchDdbRecordList()
  }
})

onDeactivated(() => {
  // console.log('onDeactivated')
})

const fundStore = useFundStore()
const {
  // usdt
  usdtDetailsCurrent,
  usdtDetailsList,
  usdtDetailsListLoading,
  usdtDetailsFinished,
  usdtDetailsRefreshing,
  // ddb
  ddbDetailsCurrent,
  ddbDetailsList,
  ddbDetailsListLoading,
  ddbDetailsFinished,
  ddbDetailsListRefreshing,

  showTimeDropdown,
  checkedTime,
  checkedLabel,
  tabActive,
  tabs
} = storeToRefs(fundStore)
const { fetchUsdtRecordList, fetchDdbRecordList, resetFundState } = fundStore

const selectStore = useSelectStore()
const { getDictionaryAction } = selectStore
const { dictionary, ddbTransType } = storeToRefs(selectStore)

// resetFundState()
const onTabs = (index) => {
  console.log(index)
  fundStore.$patch((state) => {
    state.tabActive = index
  })
}

const tableTitleTabs = () => {
  if (tabActive.value === 1) {
    return [
      {
        name: '订单号'
      },
      {
        name: '数量'
      },
      {
        name: '时间'
      }
    ]
  } else {
    return [
      {
        name: '状态'
      },
      {
        name: '数量'
      },
      {
        name: '时间'
      }
    ]
  }
}
const getTransType = (key) => {
  const name = selectFilterName(key, ddbTransType)
  return unref(name)
}
const setArrayName = (item) => {
  if (tabActive.value === 1) {
    return [
      {
        name: item.rechargeNo
      },
      {
        name: item.tradeAmt
      },
      {
        name: item.createdTime
      }
    ]
  } else {
    return [
      {
        name: getTransType(item.transType)
      },
      {
        name: item.tradeAmt
      },
      {
        name: item.createdTime
      }
    ]
  }
}
const clickRight = () => {
  fundStore.$patch((state) => {
    state.showTimeDropdown = true
  })
}
// 时间筛选类型
getDictionaryAction('APP_FUNDS_QUERY').then(() => {
  fundStore.$patch((state) => {
    state.checkedTime = dictionary.value['APP_FUNDS_QUERY'][0].key
    state.checkedLabel = dictionary.value['APP_FUNDS_QUERY'][0].value
  })
})

// fetchUsdtRecordList()

const tabsList = ref([
  {
    id: '0',
    items: ddbDetailsList,
    refreshing: ddbDetailsListRefreshing,
    loading: ddbDetailsListLoading,
    error: false,
    finished: ddbDetailsFinished,
    onLoad: fetchDdbRecordList,
    current: ddbDetailsCurrent
  },
  {
    id: '1',
    items: usdtDetailsList,
    refreshing: usdtDetailsRefreshing,
    loading: usdtDetailsListLoading,
    error: false,
    finished: usdtDetailsFinished,
    onLoad: fetchUsdtRecordList,
    current: usdtDetailsCurrent
  }
])
// const refresh = (item, index) => {
//   console.log(index)
//   // if (index === 0) {
//   //   fundStore.$patch(state => {
//   //     state.ddbDetailsFinished = false
//   //     state.ddbDetailsCurrent = 1
//   //   })
//   //   fetchDdbRecordList()
//   // } else {
//   //   fundStore.$patch(state => {
//   //     state.usdtDetailsFinished = false
//   //     state.usdtDetailsCurrent = 1
//   //   })
//   //   fetchUsdtRecordList()
//   // }
// }

const clickItem = (item) => {
  // console.log(item)
  let param
  if (tabActive.value === 0) {
    param = {
      type: 1,
      transType: item.transType,
      voucherNo: item.voucherNo
    }
  } else {
    param = {
      type: 2,
      depositNo: item.rechargeNo
    }
  }
  pushWithQuery('DetailCoin', param)
}

const refreshList = (item) => {
  const time = item.key
  // const label = dictionary.value['APP_FUNDS_QUERY'][index].value
  fundStore.$patch((state) => {
    state.checkedTime = time
    state.checkedLabel = item.value
    state.showTimeDropdown = false

    state.ddbDetailsList = []
    state.ddbDetailsFinished = false
    state.ddbDetailsCurrent = 1

    state.usdtDetailsList = []
    state.usdtDetailsFinished = false
    state.usdtDetailsCurrent = 1
  })
  // console.log(tabActive)
  if (tabActive.value === 0) {
    fetchDdbRecordList()
  } else {
    fetchUsdtRecordList
  }
}
</script>
<template>
  <AbScrollLayout hidden-scroll disabled>
    <div class="detail">
      <AbNavBar
        title="资金明细"
        right-icon="abRightArrowIcon"
        :right-text="checkedLabel"
        @clickRight="clickRight"
      ></AbNavBar>
      <main class="content">
        <AbTabsCheck
          :tab-active="tabActive"
          :tabs="tabs"
          @changeTab="onTabs"
        ></AbTabsCheck>
        <div class="contentList">
          <AbTableTitle
            :tabs="tableTitleTabs()"
            class="listTitleBottom"
          ></AbTableTitle>
          <div class="van-hairline--bottom lineSpace"></div>
          <div class="coinBoxHeight">
            <AbTabsSwipe
              v-model:tab-active="tabActive"
              :tabs="tabs"
              :data-list="tabsList"
              :to-detail-name="['DetailCoin']"
              class-name="fundListId"
            >
              <template #default="{ item }">
                <AbTableTitle
                  :tabs="setArrayName(item)"
                  style-type="black"
                  show-arrow
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
    padding: 16px 16px 0;
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

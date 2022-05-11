<script>
export default {
  name: 'UsdtHistory'
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
      resetUsdtHistoryState()
    }, 1000)
    toDetail.value = false
  }
})

onUnmounted(() => {
  // console.log('onUnmounted')
  // resetUsdtHistoryState()
})

onActivated(() => {
  // console.log('onActivated')
  if (hasOpen.value && !toDetail.value) {
    fetchUsdtTopupList()
  }
})

onDeactivated(() => {
  // console.log('onDeactivated')
})

const fundStore = useFundStore()
const {
  usdtTopupHistoryCurrent,
  usdtTopupHistoryList,
  usdtTopupHistoryListLoading,
  usdtTopupHistoryFinished,
  usdtTopupHistoryRefreshing,

  showTimeDropdown,
  checkedTime,
  checkedLabel,
  tabActiveUsdtHistory,
  tabsUsdtHistory
} = storeToRefs(fundStore)
const { fetchUsdtTopupList, resetUsdtHistoryState } = fundStore

const selectStore = useSelectStore()
const { getDictionaryAction } = selectStore
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
const auditStatusArr = [
  {
    key: 10,
    value: '审核中'
  },
  {
    key: 100,
    value: '充值成功'
  },
  {
    key: -100,
    value: '充值失败'
  }
]
const setArrayName = (item) => {
  const name = selectFilterName(item.auditStatus, auditStatusArr)
  return [
    {
      name: item.createdTime
    },
    {
      name: item.transQty
    },
    {
      name: unref(name)
    }
  ]
}
const getStatusType = (item) => {
  if (item.auditStatus == 10) {
    return '1'
  } else if (item.auditStatus == 100) {
    return '2'
  } else if (item.auditStatus == -100) {
    return '3'
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

// fetchUsdtTopupList()

const tabsList = ref([
  {
    id: '1',
    items: usdtTopupHistoryList,
    refreshing: usdtTopupHistoryRefreshing,
    loading: usdtTopupHistoryListLoading,
    error: false,
    finished: usdtTopupHistoryFinished,
    onLoad: fetchUsdtTopupList,
    current: usdtTopupHistoryCurrent
  }
])

const clickItem = (item) => {
  console.log(item)
  const param = {
    type: 3,
    ...item
  }
  pushWithQuery('DetailCoin', param)
}
const refreshList = (item) => {
  fundStore.$patch((state) => {
    // state.checkedTime = time
    state.checkedLabel = item.value
    state.showTimeDropdown = false

    state.usdtTopupHistoryList = []
    state.usdtTopupHistoryFinished = false
    state.usdtTopupHistoryCurrent = 1

    // state.checkedTime = dictionary.value['APP_FUNDS_QUERY'][0].key
    // state.checkedLabel = dictionary.value['APP_FUNDS_QUERY'][0].value
  })
  fetchUsdtTopupList()
}
</script>
<template>
  <AbScrollLayout hidden-scroll disabled>
    <div class="detail">
      <AbNavBar
        title="历史记录"
        right-icon="abRightArrowIcon"
        :right-text="checkedLabel"
        @clickRight="clickRight"
      ></AbNavBar>
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

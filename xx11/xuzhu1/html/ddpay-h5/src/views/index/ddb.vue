<script>
export default {
  name: 'DdbExchange'
}
</script>
<script setup>
import AbNavBar from '@/components/AbNavBar'
import AbTableTitle from '@/components/AbTableTitle.vue'
import AbTabsSwipe from '@/components/AbTabsSwipe.vue'
import AbScrollLayout from '@/components/AbScrollLayout'
import AbInput from '@/components/AbInput'
import AbCellItem from '@/components/AbCellItem'
import AbButton from '@/components/AbButton'
import { ref, onActivated, watch, unref } from 'vue'
import { storeToRefs } from 'pinia'
import { pushWithQuery } from '@/hooks/useQuery'
import { selectFilterName } from '@/utils/selectFilter'
import { onBeforeRouteLeave } from 'vue-router'
import { useFundStore } from '@/store/modules/fund'
import { useHomeStore } from '@/store/modules/home'
import { useSelectStore } from '@/store/modules/select'
import { useDebounce } from '@vueuse/core'
import { ddbExchangeCalcApi, ddbExchangeConfirmApi } from '@/api/fund'
import { Toast } from 'vant'

const toDetail = ref(false)
const hasOpen = ref(false)
onBeforeRouteLeave((to, from) => {
  // console.log('onBeforeRouteLeave')
  hasOpen.value = true
  if (to.name == 'DetailCoin' || to.name == 'DdbHistory') {
    toDetail.value = true
  } else {
    setTimeout(() => {
      resetDdbExchangeState()
    }, 1000)
    toDetail.value = false
  }
})
onActivated(() => {
  // console.log('onActivated')
  if (hasOpen.value && !toDetail.value) {
    fetchDdbExchangeListDays()
  }
  fetchHomeAccountList()
})

const homeStore = useHomeStore()
const { fetchHomeAccountList } = homeStore
const { usdtTotal } = storeToRefs(homeStore)

const fundStore = useFundStore()
const {
  ddbExchangeCurrent,
  ddbExchangeList,
  ddbExchangeListLoading,
  ddbExchangeFinished,
  ddbExchangeListRefreshing,

  // ddbExchangeList: [],
  // ddbExchangeCurrent: 1,
  // ddbExchangeSize: 20,
  // ddbExchangeListLoading: false,
  // ddbExchangeFinished: false,
  // ddbExchangeListRefreshing: false,

  tabActiveUsdtHistory,
  tabsUsdtHistory
} = storeToRefs(fundStore)
const { fetchDdbExchangeListDays, resetDdbExchangeState } = fundStore

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
  // return unref(name)
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
// 时间筛选类型
dictionariesAction({
  codes: ['APP_FUNDS_QUERY', 'EXCHANGE_ORDER_STATUS']
}).then(() => {
  fundStore.$patch((state) => {
    state.checkedTime = dictionary.value['APP_FUNDS_QUERY'][0].key
    state.checkedLabel = dictionary.value['APP_FUNDS_QUERY'][0].value
  })
})

const tabsList = ref([
  {
    id: '0',
    items: ddbExchangeList,
    refreshing: ddbExchangeListRefreshing,
    loading: ddbExchangeListLoading,
    error: false,
    finished: ddbExchangeFinished,
    onLoad: fetchDdbExchangeListDays,
    current: ddbExchangeCurrent
  }
])

const clickItem = (item) => {
  const param = {
    type: 4,
    ...item
  }
  pushWithQuery('DetailCoin', param)
}
// const setAll = () => {}

const loadingBuy = ref(false)
const inputValue = ref('')
const payAmt = ref('0')
const availableAmt = ref('0')
const debounced = useDebounce(inputValue, 800)
watch(debounced, () => {
  if (debounced.value) {
    ddbExchangeCalcApi({ buyAmt: debounced.value }).then((res) => {
      console.log(res)
      if (res.success) {
        payAmt.value = res.data.payAmt
        availableAmt.value = res.data.availableAmt
      }
    })
  }
})
const confirmBuy = () => {
  if (debounced.value) {
    if (loadingBuy.value) return
    loadingBuy.value = true
    ddbExchangeConfirmApi({
      buyAmt: debounced.value
    })
      .then((res) => {
        console.log(res)
        loadingBuy.value = false
        if (res.success) {
          payAmt.value = res.data.payAmt
          availableAmt.value = res.data.availableAmt
          Toast('兑换成功')
          inputValue.value = ''
        } else {
          Toast(res.msg)
        }
      })
      .catch(() => {
        // console.log(1)
        loadingBuy.value = false
      })
  } else {
    Toast('请输入要兑换的DDB数量')
  }
}
const refresh = () => {
  fetchHomeAccountList()
}
</script>
<template>
  <AbScrollLayout hidden-scroll disabled>
    <div class="detail">
      <AbNavBar
        title="兑换DDB"
        right-text="历史记录"
        @clickRight="pushWithQuery('DdbHistory')"
      ></AbNavBar>
      <AbTabsSwipe
        v-model:tab-active="tabActiveUsdtHistory"
        :tabs="tabsUsdtHistory"
        :swipeable="false"
        :data-list="tabsList"
        :to-detail-name="['DetailCoin', 'DdbHistory']"
        class-name="fundListId"
        @refresh="refresh"
      >
        <template #topContent>
          <div>
            <div class="warningText">
              请注意：实际到账DDB数量根据市场汇率会有些许波动。
            </div>
            <div class="topContent">
              <div class="c-top fw600 fz14">
                <div class="text-align-left">兑换DDB</div>
                <div class="c-input flex-center-between">
                  <AbInput
                    v-model="inputValue"
                    left-icon="logo-img"
                    placeholder="请输入要兑换的DDB数量"
                    type="number"
                  >
                  </AbInput>
                </div>
                <AbCellItem
                  class="cellItem"
                  black-title
                  title="钱包余额"
                  gray-value
                  :value="usdtTotal + ' USDT'"
                ></AbCellItem>
                <AbCellItem
                  class="cellItem"
                  black-title
                  title="需要USDT"
                  gray-value
                  :value="'≈' + payAmt + ' USDT'"
                ></AbCellItem>
                <div class="van-hairline--bottom lineSpaceCell"></div>
                <AbCellItem
                  class="cellItem"
                  black-title
                  title="实际到账DDB"
                  gray-value
                  :value="availableAmt + ' DDB'"
                ></AbCellItem>
                <AbButton
                  :loading="loadingBuy"
                  class="toExchange"
                  label="马上兑换"
                  @click="confirmBuy"
                ></AbButton>
              </div>
            </div>
            <div class="historyList">
              <div class="historyTopTitle">近三天内</div>
              <AbTableTitle
                :tabs="tableTitleTabs()"
                class="listTitleBottom"
                layout="center"
              ></AbTableTitle>
            </div>
            <div class="van-hairline--bottom lineSpace"></div>
          </div>
        </template>
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
  </AbScrollLayout>
</template>

<style lang="scss" scoped>
.detail {
  min-height: calc(100% - 46px);
  padding-top: 46px;
  :deep(.abTabsSwipeListCenter) {
    padding: 0 16px;
  }
}
.topContent {
  margin-left: 16px;
  margin-right: 16px;
  background-color: var(--ab-main-content-background-color);
  border-radius: 8px;
}
.warningText {
  color: var(--ab-text-warning);
  padding: 16px;
  font-weight: 500;
  font-size: 12px;
  text-align: left;
}
.historyList {
  padding-left: 16px;
  padding-right: 16px;

  .abTableTitle {
    padding: 0 0 8px;
  }
}
.historyTopTitle {
  font-weight: 500;
  font-size: 14px;
  text-align: left;
  margin-bottom: 8px;
  margin-top: 30px;
}
.lineSpace {
  height: 1px;
}
.listTitleBottom {
  margin-bottom: 8px;
}
.cellItem {
  padding-top: 20px;
}
.lineSpaceCell {
  height: 1px;
  padding-top: 20px;
}
.toExchange {
  margin-top: 30px;
}
.c-top {
  border-radius: 8px;
  padding: 14px 10px;
  box-shadow: -10px -10px 10px rgba(216, 221, 240, 0.15),
    10px 10px 10px rgba(216, 221, 240, 0.15);
  .c-input {
    margin-top: 20px;
    border-bottom: 1px solid #f6f7fd;
  }
}
</style>

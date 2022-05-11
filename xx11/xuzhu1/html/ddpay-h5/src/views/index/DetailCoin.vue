<script>
export default {
  name: 'DetailCoin'
}
</script>
<script setup>
import { computed, unref } from 'vue'
import AbNavBar from '@/components/AbNavBar'
import AbScrollLayout from '@/components/AbScrollLayout'
import AbSkeleton from '@/components/AbSkeleton'
import CoinDdbDetail from './common/CoinDdbDetail.vue'
import CoinUsdtDetail from './common/CoinUsdtDetail'
import CoinUsdtDetailTopup from './common/CoinUsdtDetailTopup.vue'
import CoinDdbExchangeDetail from './common/CoinDdbExchangeDetail.vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useFundStore } from '@/store/modules/fund'
import { useSelectStore } from '@/store/modules/select'
import { selectFilterName } from '@/utils/selectFilter'

const selectStore = useSelectStore()
const { ddbTransType } = storeToRefs(selectStore)
const { dictionariesAction } = selectStore
const fundStore = useFundStore()
const { coinDetailLoading, coinDetailObj } = storeToRefs(fundStore)
const { fetchCoinUsdtDetail, fetchCoinDdbDetail } = fundStore
const route = useRoute()
const query = route.query
// query.type = 1 ddb资金明细， 2 usdt资金明细， 3 usdt充值详情

const getDetail = () => {
  let params
  if (query.type == 1) {
    // ddb
    params = {
      voucherNo: query.voucherNo,
      transType: query.transType
    }
    fetchCoinDdbDetail(params)
  } else if (query.type == 2) {
    // usdt
    params = {
      depositNo: query.depositNo
    }
    fetchCoinUsdtDetail(params)
  }
}

const getTransType = (key) => {
  console.log(key)
  console.log(ddbTransType.value)
  return unref(selectFilterName(key, ddbTransType.value))
}
const getTitleName = computed(() => {
  // console.log(query)
  // console.log(getTransType(query.transType))
  if (query.type == 1) {
    return getTransType(query.transType) + '明细'
  } else if (query.type == 4) {
    return '兑换明细'
  } else {
    return '充值明细'
  }
})
dictionariesAction({
  codes: ['BUY_ORDER_STATUS', 'AUDIT_STATUS', 'EXCHANGE_ORDER_STATUS']
})
const initData = () => {
  if (query.type == '1' || query.type == '2') {
    getDetail()
  }
}
initData()
</script>
<template>
  <AbScrollLayout @refresh="initData">
    <div class="pageContent">
      <AbNavBar :title="getTitleName" show-service></AbNavBar>
      <div class="content">
        <AbSkeleton :row="3" title :loading="coinDetailLoading">
          <CoinDdbDetail v-if="query.type == 1" :order-detail="coinDetailObj"></CoinDdbDetail>
          <CoinUsdtDetail v-if="query.type == 2" :order-detail="coinDetailObj"></CoinUsdtDetail>
          <CoinUsdtDetailTopup v-if="query.type == 3" :order-detail="query"></CoinUsdtDetailTopup>
          <CoinDdbExchangeDetail v-if="query.type == 4" :order-detail="query"></CoinDdbExchangeDetail>
          <!--          {{ coinDetailObj }}-->
        </AbSkeleton>
      </div>
    </div>
  </AbScrollLayout>
</template>

<style lang="scss" scoped>
.pageContent {
  min-height: calc(100% - 46px);
  padding-top: 46px;
  .content {
    margin: 16px 16px 0;
    padding: 23px 10px;
    border-radius: 8px;
    background-color: var(--ab-main-content-background-color);
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

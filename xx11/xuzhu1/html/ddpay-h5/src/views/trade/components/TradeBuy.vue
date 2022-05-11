<script>
export default {
  name: 'TradeBuy',
  inheritAttrs: true
}
</script>
<script setup>
import { storeToRefs } from 'pinia'
import { useSelectStore } from '@/store/modules/select'
import AbCell from '@/components/AbCell.vue'
import AbCellItem from '@/components/AbCellItem.vue'
import AbPayMethod from '@/components/AbPayMethod'
import { computed, ref, watch } from 'vue'
import AbCheckbox from '@/components/AbCheckbox'
import AbButton from '@/components/AbButton'
import AbInput from '@/components/AbInput'
import AbSkeleton from '@/components/AbSkeleton.vue'
import { useTradeStore } from '@/store/modules/trade'
import { useDebounce } from '@vueuse/core'
import { Toast } from 'vant'
import { cmpNumber } from '@/utils/validate'

const tradeStore = useTradeStore()
const {
  tradeLimitList,
  profitCalcBuy,
  showUserTip,
  userTipTitle,
  showActualDialog
} = storeToRefs(tradeStore)
const { fetchCalcProfit, fetchBuyOrderPreMatch } = tradeStore

const limitMin = computed(() => {
  const result = tradeLimitList.value.filter(
    (item) => item.payway == activePay.value
  )
  let buyAmtMin = 0
  if (result.length > 0) {
    buyAmtMin = result[0].buyAmtMin
  }
  // console.log(result)
  return buyAmtMin
})
const limitMax = computed(() => {
  const result = tradeLimitList.value.filter(
    (item) => item.payway == activePay.value
  )
  let buyAmtMax = 0
  if (result.length > 0) {
    buyAmtMax = result[0].buyAmtMax
  }
  // console.log(result)
  return buyAmtMax
})
const limitHolder = computed(() => {
  return `限额${limitMin.value}-${limitMax.value} DDB`
})

const selectStore = useSelectStore()
const { paymentClassListLoading } = storeToRefs(selectStore)
// const { fetchPaymentList } = centerStore

const inputValue = ref('')
const activePay = ref(10)
const checked = ref(false)
const loadingBuy = ref(false)
// const payAmt = ref('0')
// const availableAmt = ref('0')
const debounced = useDebounce(inputValue, 800)
watch(debounced, () => {
  calc()
})
const checkBefore = async (type) => {
  if (type === 'buy') {
    if (!debounced.value) {
      Toast('请输入购买的DDB数量')
      return false
    }
    if (!activePay.value) {
      Toast('请选择付款方式')
      return false
    }
    if (!checked.value) {
      Toast('请阅读并勾选"《用户须知》"')
      return false
    }
  }
  if (
    (await cmpNumber(debounced.value, limitMin.value) !== 0 &&
      await cmpNumber(debounced.value, limitMin.value) !== 1) ||
    (await cmpNumber(debounced.value, limitMax.value) !== 0 &&
      await cmpNumber(debounced.value, limitMax.value) !== -1)
  ) {
    Toast(`请输入${limitHolder.value}`)
    return false
  }
  return true
}
const calc = async () => {
  if (debounced.value) {
    if (await checkBefore()) {
      fetchCalcProfit({
        payway: activePay.value,
        amt: inputValue.value,
        tradeRole: 10
      })
    }
  } else {
    tradeStore.$patch((state) => {
      state.profitCalcBuy = {
        profitAmt: '0',
        profitAmtLaw: '0',
        availableAmt: '0',
        availableAmtLaw: '0'
      }
    })
  }
}
const confirmBuy = async () => {
  if (checkBefore('buy')) {
    if (loadingBuy.value) return
    loadingBuy.value = true
    const param = {
      buyAmt: debounced.value,
      payway: activePay.value
    }
    // console.log(param)
    // tradeStore.$patch(state => {
    //   state.showTradeBuy = true
    // })
    try {
      const res = await fetchBuyOrderPreMatch(param)
      // let bankRes
      // if (res.success) {
      //   bankRes = await
      // }
    } finally {
      loadingBuy.value = false
    }
  }
}
const changePayway = () => {
  calc()
}
const clickBlue = () => {
  showUserTip.value = true
  userTipTitle.value = '用户须知'
}
const clickQuestion = (type) => {
  if (type == 1) {
    showUserTip.value = true
    userTipTitle.value = '奖励说明'
  } else if (type == 2) {
    showActualDialog.value = true
  }
}
</script>

<template>
  <div>
    <div class="tradeBuy">
      <AbCell title="购买DDB"></AbCell>
      <AbInput
        v-model="inputValue"
        type="digit"
        left-icon="logo-img"
        :placeholder="limitHolder"
      ></AbInput>
      <div class="linePadding"></div>
      <AbCell class="lineSpace" title="选择付款方式"></AbCell>
      <AbSkeleton :loading="paymentClassListLoading" :row="2">
        <AbPayMethod v-model="activePay" @change="changePayway"></AbPayMethod>
      </AbSkeleton>
      <div class="van-hairline--bottom linePadding lineSpace2"></div>
      <AbCellItem
        class="cellItem"
        title="活动奖励"
        :value="`¥ ${profitCalcBuy.profitAmt}/DDB`"
        icon-name="question"
        @clickQuestion="clickQuestion(1)"
      ></AbCellItem>
      <AbCellItem
        class="cellItem"
        title="实际获得"
        :value="`${profitCalcBuy.availableAmt}/DDB`"
        icon-name="question"
        @clickQuestion="clickQuestion(2)"
      ></AbCellItem>
    </div>
    <AbButton
      class="buyBtn"
      label="购买DDB"
      :loading="loadingBuy"
      @click="confirmBuy"
    ></AbButton>
    <AbCheckbox
      v-model:checked="checked"
      blue-text="《用户须知》"
      normal-text="请在交易前阅读"
      text-position="out"
      @clickBlue="clickBlue"
    ></AbCheckbox>
  </div>
</template>

<style lang="scss" scoped>
.tradeBuy {
  margin-top: 17px;
  border-radius: 8px;
  background-color: var(--ab-main-content-background-color);
}
.buyBtn {
  margin-top: 22px;
}
.linePadding {
  margin: 0 10px;
}
.lineSpace {
  margin-top: 15px;
}
.lineSpace2 {
  margin-top: 30px;
}
.cellItem {
  padding: 10px 10px 0;
  //margin-top: 10px;
  //margin-bottom: 10px;
}
</style>

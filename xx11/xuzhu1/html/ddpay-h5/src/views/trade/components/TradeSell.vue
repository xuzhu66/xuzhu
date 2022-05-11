<script>
export default {
  name: 'TradeSell'
}
</script>
<script setup>
import AbCell from '@/components/AbCell.vue'
import AbPayMethodBank from '@/components/AbPayMethodBank.vue'
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import AbCheckbox from '@/components/AbCheckbox'
import AbButton from '@/components/AbButton'
import AbButtonText from '@/components/AbButtonText'
import AbInput from '@/components/AbInput'
import AbCellItem from '@/components/AbCellItem.vue'
import { useTradeStore } from '@/store/modules/trade'
import { useHomeStore } from '@/store/modules/home'
import { useDebounce } from '@vueuse/core'
import { Toast } from 'vant'
import { cmpNumber } from '@/utils/validate'
import TradeDialogConfirmSellNotice from './TradeDialogConfirmSellNotice'
import { selectFilterName } from '@/utils/selectFilter'
import { useSelectStore } from '@/store/modules/select'

const homeStore = useHomeStore()
const { currencyList } = storeToRefs(homeStore)

const tradeStore = useTradeStore()
const {
  tradeLimitList,
  profitCalcSell,
  selectPaywayObj,
  showUserTip,
  userTipTitle,
  showActualDialog
} = storeToRefs(tradeStore)
const { fetchCalcProfit, fetchSellOrderPreMatch } = tradeStore
const selectStore = useSelectStore()
const { paymentClassListAble } = storeToRefs(selectStore)

const inputValue = ref('')
const activePay = ref(10)
const checked = ref(false)
const loadingBuy = ref(false)
const paywayStr = computed(() => {
  const name = selectFilterName(
    selectPaywayObj.value?.payway,
    paymentClassListAble.value,
    {
      key: 'payway',
      value: 'payName'
    }
  )
  return selectPaywayObj.value?.acctNo
    ? `${name.value} ${selectPaywayObj.value.acctNo}`
    : ''
})
const debounced = useDebounce(inputValue, 800)
watch(debounced, () => {
  calc()
})
const setAll = (event) => {
  inputValue.value = avlAmt.value
}
const limitMin = computed(() => {
  const result = tradeLimitList.value.filter(
    (item) => item.payway == activePay.value
  )
  let sellAmtMin = 0
  if (result.length > 0) {
    sellAmtMin = result[0].sellAmtMin
  }
  return sellAmtMin
})
const limitMax = computed(() => {
  const result = tradeLimitList.value.filter(
    (item) => item.payway == activePay.value
  )
  let sellAmtMax = 0
  if (result.length > 0) {
    sellAmtMax = result[0].sellAmtMax
  }
  return sellAmtMax
})
const limitHolder = computed(() => {
  return `限额${limitMin.value}-${limitMax.value} DDB`
})
const avlAmt = computed(() => {
  if (currencyList.value && currencyList.value.length > 0) {
    const list = currencyList.value
    let amt = 0
    for (let i = 0; i < list.length; i++) {
      if (list[i].coinCode == 'DDB') {
        amt = list[i].avlAmt
      }
    }
    return amt
  } else {
    return 0
  }
})

const checkBefore = async (type) => {
  if (type === 'sell') {
    if (!debounced.value) {
      Toast('请输入出售的DDB数量')
      return false
    }
    if (!selectPaywayObj.value?.acctNo) {
      Toast('请选择收款方式')
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
        tradeRole: 20
      })
    }
  } else {
    tradeStore.$patch((state) => {
      state.profitCalcSell = {
        profitAmt: '0',
        profitAmtLaw: '0',
        availableAmt: '0',
        availableAmtLaw: '0'
      }
    })
  }
}
const submit = (event) => {
  if (checkBefore('sell')) {
    tradeStore.$patch((state) => {
      state.showTradeSellNotice = true
    })
  }
}
const selectPay = () => {
  tradeStore.$patch((state) => {
    state.showTradePaymentList = true
  })
}
const confirmBuy = async () => {
  if (loadingBuy.value) return
  loadingBuy.value = true
  const param = {
    sellAmt: debounced.value,
    recBankId: selectPaywayObj.value.id
  }
  try {
    await fetchSellOrderPreMatch(param)
  } finally {
    loadingBuy.value = false
  }
}
const clickBlue = () => {
  showUserTip.value = true
  userTipTitle.value = '奖励说明'
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
      <AbCell title="出售DDB"></AbCell>
      <AbInput
        v-model="inputValue"
        type="digit"
        left-icon="logo-img"
        :placeholder="limitHolder"
      >
        <template #button>
          <AbButtonText label="全部" @click="setAll"></AbButtonText>
        </template>
      </AbInput>
      <div class="linePadding"></div>
      <div class="moneyAll">可用余额 {{ avlAmt }} DDB</div>
      <AbCell class="lineSpace" title="选择收款方式"></AbCell>
      <AbPayMethodBank
        :label="paywayStr ? paywayStr : '请选择收款方式'"
        @click="selectPay"
      ></AbPayMethodBank>
      <div class="van-hairline--bottom linePadding lineSpace2"></div>
      <AbCellItem
        class="cellItem"
        title="活动奖励"
        :value="`¥ ${profitCalcSell.profitAmt}/DDB`"
        icon-name="question"
        @clickQuestion="clickQuestion(1)"
      ></AbCellItem>
      <AbCellItem
        class="cellItem"
        title="实际获得"
        :value="`${profitCalcSell.availableAmt}/DDB`"
        icon-name="question"
        @clickQuestion="clickQuestion(2)"
      ></AbCellItem>
    </div>
    <AbButton class="buyBtn" label="出售DDB" @click="submit"></AbButton>
    <AbCheckbox
      v-model:checked="checked"
      blue-text="《用户须知》"
      normal-text="请在交易前阅读"
      text-position="out"
      @clickBlue="clickBlue"
    ></AbCheckbox>
    <TradeDialogConfirmSellNotice
      :loading="loadingBuy"
      @confirm="confirmBuy"
    ></TradeDialogConfirmSellNotice>
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
.moneyAll {
  padding: 0 10px;
  margin-top: 4px;
  font-size: 12px;
  text-align: right;
  color: var(--ab-main-text-color);
}
.cellItem {
  padding: 15px 10px 0;
  //margin-top: 10px;
  //margin-bottom: 10px;
}
</style>

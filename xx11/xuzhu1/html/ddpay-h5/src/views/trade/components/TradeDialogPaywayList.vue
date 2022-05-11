<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useTradeStore } from '@/store/modules/trade'
import AbPopup from '@/components/AbPopup'
import PaymentSelectListItem from './PaymentSelectListItem'
import { useSelectStore } from '@/store/modules/select'
import { Toast } from 'vant'
import { pushWithQuery } from '@/hooks/useQuery'

const selectStore = useSelectStore()
const { paymentList, paymentClassListAble } = storeToRefs(selectStore)

const tradeStore = useTradeStore()
const { showTradePaymentList, selectPaywayObj } = storeToRefs(tradeStore)
const selectId = ref('')
const changeTab = (item) => {
  selectId.value = item.id
}
const close = () => {
  selectId.value = ''
}

const confirm = (item) => {
  if (!selectId.value) {
    Toast('请选择银行卡')
    return
  }
  const arr = paymentList.value
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id == selectId.value) {
      tradeStore.$patch((state) => {
        state.selectPaywayObj = arr[i]
      })
    }
  }
  showTradePaymentList.value = false
}
const addMore = () => {
  // showTradePaymentList.value = false
  pushWithQuery('AccountIndex')
}

const initData = () => {
  if (selectPaywayObj.value && selectPaywayObj.value.id) {
    selectId.value = selectPaywayObj.value.id
  }
}
watch(
  showTradePaymentList,
  () => {
    initData()
  },
  { immediate: true }
)
initData()
</script>

<template>
  <AbPopup
    v-model:show="showTradePaymentList"
    closeable
    close-icon="close"
    close-icon-position="top-left"
    position="bottom"
    show-confirm-button
    title="更换银行卡"
    confirm-position="topRight"
    @confirm="confirm"
    @close="close"
  >
    <div class="popBox">
      <!--      <AbSelectList-->
      <!--        v-model:modelValue="selectValue"-->
      <!--        :list="paymentListOneDeep"-->
      <!--        value-prop="id"-->
      <!--        label-prop="acctNo"-->
      <!--        @changeTab="changeTab"-->
      <!--      ></AbSelectList>-->
      <div class="abPaymentSelectList">
        <div v-for="(item, index) in paymentList" :key="index">
          <PaymentSelectListItem
            :item="item"
            :active="selectId == item.id"
            :payment-class-list-able="paymentClassListAble"
            @changeTab="changeTab(item)"
          ></PaymentSelectListItem>
          <div class="van-hairline--bottom"></div>
        </div>
      </div>
      <div class="addMore" @click="addMore">+添加新的收款方式</div>
    </div>
  </AbPopup>
</template>

<style lang="scss" scoped>
.popBox {
  padding: 0 16px;
}
.addMore {
  font-weight: 600;
  font-size: 15px;
  color: #c4c4c4;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<script setup>
import { defineProps, computed } from 'vue'
import { storeToRefs } from 'pinia'
import AbCellItem from '@/components/AbCellItem.vue'
import AbTabsItem from '@/components/AbTabsItem.vue'
import AbOrderIconType from '@/components/AbOrderIconType.vue'
import { selectFilterName } from '@/utils/selectFilter'
import { useOrderDetail } from '@/hooks/useOrderDetail'
import { useSelectStore } from '@/store/modules/select'

const props = defineProps({
  topLabel: {
    type: String,
    default: ''
  },
  bottomLabel: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: ''
  },
  // Mini Middle
  size: {
    type: String,
    default: 'Middle'
  },
  icon: {
    type: String,
    default: 'abOrderIcon'
  },
  orderDetail: {
    type: Object,
    default: () => {
      return {}
    }
  },

  tradeStatusArr: {
    type: Array,
    default: () => {
      return []
    }
  },
  sellStatusArr: {
    type: Array,
    default: () => {
      return []
    }
  }
})
const selectStore = useSelectStore()
const { paymentClassList } = storeToRefs(selectStore)
const payway = computed(() => {
  const name = selectFilterName(props.orderDetail.payway, paymentClassList, {
    key: 'payway',
    value: 'payName'
  })
  return name.value
  // return selectFilterName(props.orderDetail.payway, paymentClassList)
})
const { colorType, label } = useOrderDetail(
  props.orderDetail.status,
  [],
  props.type == 2 ? 'sell' : 'tradeDetail'
)
</script>

<template>
  <div>
    <AbOrderIconType
      class="itemInfoBuy"
      :top-label="'¥' + orderDetail.recAmt"
      :bottom-label="label"
      :type="colorType"
    ></AbOrderIconType>
    <div class="lineMargin">
      <div class="van-hairline--bottom"></div>
    </div>
    <AbTabsItem label="订单信息" active size="Mini"></AbTabsItem>
    <AbCellItem
      class="cellItem"
      title="挂单ID："
      :value="orderDetail.sellNo"
      right-type="copy"
    ></AbCellItem>
    <AbCellItem
      class="cellItem"
      title="挂单总数量："
      :value="orderDetail.totalAmt"
    ></AbCellItem>
    <AbCellItem
      class="cellItem"
      title="已成交数量："
      :value="orderDetail.tradeAmt"
    ></AbCellItem>
    <AbCellItem
      class="cellItem"
      title="交易中数量："
      :value="orderDetail.tradingAmt"
    ></AbCellItem>
    <AbCellItem
      class="cellItem"
      title="剩余数量："
      :value="orderDetail.remainAmt"
    ></AbCellItem>
    <AbCellItem
      class="cellItem"
      title="已收款金额："
      :value="orderDetail.recAmt"
    ></AbCellItem>
    <AbCellItem
      class="cellItem"
      title="预计剩余金额："
      :value="orderDetail.expectedAmt"
    ></AbCellItem>
    <AbCellItem
      class="cellItem"
      title="活动奖励："
      :value="orderDetail.profitSellAmt + ' DDB'"
    ></AbCellItem>
    <div class="lineMargin">
      <div class="van-hairline--bottom"></div>
    </div>
    <AbTabsItem label="收款信息" active size="Mini"></AbTabsItem>
    <AbCellItem
      class="cellItem"
      title="收款方式："
      :value="payway"
    ></AbCellItem>
    <AbCellItem
      class="cellItem"
      title="银行卡号："
      :value="orderDetail.recAcctNo"
      right-type="copy"
    ></AbCellItem>
    <div class="lineMargin">
      <div class="van-hairline--bottom"></div>
    </div>
    <AbTabsItem label="已完成订单" active size="Mini"></AbTabsItem>
    <div v-for="(item, index) in orderDetail.tradList" :key="index">
      <AbCellItem
        class="cellItem"
        title="收款方式："
        :value="payway"
      ></AbCellItem>
      <AbCellItem
        class="cellItem"
        title="收款人："
        :value="item.recAcctName"
      ></AbCellItem>
      <AbCellItem
        class="cellItem"
        title="银行卡号："
        :value="item.recAcctNo"
        right-type="copy"
      ></AbCellItem>
      <AbCellItem
        class="cellItem"
        title="开户行："
        :value="item.recBankName"
      ></AbCellItem>
      <div class="lineMargin">
        <div class="van-hairline--bottom"></div>
      </div>
      <AbCellItem
        class="cellItem"
        title="单价："
        :value="'¥' + item.price + ' / DDB'"
      ></AbCellItem>
      <AbCellItem
        class="cellItem"
        title="数量："
        :value="item.tradeAmt"
      ></AbCellItem>
      <div class="lineMargin">
        <div class="van-hairline--bottom"></div>
      </div>
      <AbCellItem
        class="cellItem"
        title="交易订单号："
        :value="item.tradeAmt"
        right-type="copy"
      ></AbCellItem>
      <AbCellItem
        class="cellItem"
        title="创建时间："
        :value="item.createdTime"
      ></AbCellItem>
      <AbCellItem
        class="cellItem"
        title="付款时间："
        :value="item.payTime"
      ></AbCellItem>
      <!--      <AbCellItem-->
      <!--        class="cellItem"-->
      <!--        title="放币时间："-->
      <!--        value="2021-01-03 12:30:30"-->
      <!--      ></AbCellItem>-->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.itemInfoBuy {
  margin-bottom: 21px;
}

.lineMargin {
  height: 1px;
  margin: 16px 0;
}

.cellItem {
  //height: 14px;
  //margin-bottom: 14px;
  font-weight: 500;
  .abCellTitle {
    font-weight: 500;
    font-size: 14px;
  }
  .abCellValue {
    font-weight: 500;
    font-size: 14px;
  }
}
</style>

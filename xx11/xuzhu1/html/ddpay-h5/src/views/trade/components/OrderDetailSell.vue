<script setup>
import { defineProps, computed } from 'vue'
import { storeToRefs } from 'pinia'
import AbCellItem from '@/components/AbCellItem.vue'
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
      :top-label="'¥' + orderDetail.tradeMoney"
      :bottom-label="label"
      :type="colorType"
    ></AbOrderIconType>
    <div class="lineMargin">
      <div class="van-hairline--bottom"></div>
    </div>
    <AbCellItem
      class="cellItem"
      title="付款方式："
      :value="payway"
    ></AbCellItem>
    <AbCellItem
      class="cellItem"
      title="活动奖励："
      :value="'¥' + orderDetail.profitAmt + ' / DDB'"
    ></AbCellItem>
    <AbCellItem
      class="cellItem"
      title="实际获得："
      :value="orderDetail.tradeAmt + ' DDB'"
    ></AbCellItem>
    <AbCellItem
      class="cellItem"
      title="挂单订单号："
      :value="orderDetail.sellNo"
      right-type="copy"
    ></AbCellItem>
    <div class="lineMargin">
      <div class="van-hairline--bottom"></div>
    </div>
    <AbCellItem
      class="cellItem"
      title="付款方式："
      :value="payway"
    ></AbCellItem>
    <AbCellItem
      class="cellItem"
      title="付款人："
      :value="orderDetail.payAcctName"
      right-type="copy"
    ></AbCellItem>
    <AbCellItem
      class="cellItem"
      title="银行卡号："
      :value="orderDetail.payAcctNo"
      right-type="copy"
    ></AbCellItem>
    <AbCellItem
      class="cellItem"
      title="开户行："
      :value="orderDetail.payBankName"
    ></AbCellItem>
    <div class="lineMargin">
      <div class="van-hairline--bottom"></div>
    </div>
    <AbCellItem
      class="cellItem"
      title="单价："
      :value="'¥' + orderDetail.price + '/ DDB'"
    ></AbCellItem>
    <AbCellItem
      class="cellItem"
      title="数量："
      :value="orderDetail.buyAmt"
    ></AbCellItem>
    <div class="lineMargin">
      <div class="van-hairline--bottom"></div>
    </div>
    <AbCellItem
      class="cellItem"
      title="交易订单号："
      :value="
        orderDetail.tradeRole == 10 ? orderDetail.buyNo : orderDetail.tradeNo
      "
      right-type="copy"
    ></AbCellItem>
    <AbCellItem
      class="cellItem"
      title="创建时间："
      :value="orderDetail.createdTime"
    ></AbCellItem>
    <AbCellItem
      class="cellItem"
      title="付款时间："
      :value="orderDetail.payTime"
    ></AbCellItem>
    <AbCellItem
      class="cellItem"
      title="放币时间："
      :value="orderDetail.releaseTime"
    ></AbCellItem>
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

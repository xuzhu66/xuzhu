<script>
export default {
  name: 'CoinUsdtDetail'
}
</script>
<script setup>
import { computed, unref } from 'vue'
import { defineProps } from 'vue'
import { storeToRefs } from 'pinia'
import AbCellItem from '@/components/AbCellItem.vue'
import AbOrderIconType from '@/components/AbOrderIconType.vue'
import { useSelectStore } from '@/store/modules/select'
import { selectFilterName } from '@/utils/selectFilter'

const selectStore = useSelectStore()
const {
  // ddbTransType,
  dictionary
} = storeToRefs(selectStore)
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
  }
})
// const getTransType = (key) => {
//   return selectFilterName(key, ddbTransType.value)
// }
// console.log(dictionary)
// const statusType = ref(1)
const getStatusName = computed(() => {
  const orderDetail = props.orderDetail
  const orderStatus = orderDetail.auditStatus
  const arrKey = 'AUDIT_STATUS'
  return unref(selectFilterName(orderStatus, dictionary.value[arrKey]))
  // dictionary
})
const statusType = computed(() => {
  const orderDetail = props.orderDetail
  const transType = orderDetail.transType
  const orderStatus = orderDetail.auditStatus
  let type

  if (orderStatus == '0') {
    type = 'going'
  } else if (orderStatus == '1') {
    type = 'done'
  } else {
    type = 'cancel'
  }
  return type
})
// const getSellName = computed(() => {
//   return getTransType(props.orderDetail.transType)
// })

const getUsdtUrl = computed(() => {
  if (props.orderDetail.chain == 'TRC20') {
    return `https://tronscan.org/#/transaction/${props.orderDetail.hashId}`
  }
  return `https://etherscan.io/tx/${props.orderDetail.hashId}`
})
</script>

<template>
  <div>
    <div>
      <AbOrderIconType
        class="itemInfoBuy"
        :top-label="orderDetail.orderAmt + ' USDT'"
        :bottom-label="getStatusName"
        :type="statusType"
      ></AbOrderIconType>
      <div class="lineMargin">
        <div class="van-hairline--bottom"></div>
      </div>
      <AbCellItem
        class="cellItem"
        title="买卖类型："
        value="充值"
      ></AbCellItem>
      <AbCellItem
        class="cellItem"
        title="订单号："
        :value="orderDetail.depositNo"
        right-type="copy"
      ></AbCellItem>
      <AbCellItem
        class="cellItem"
        title="付款方式："
        :value="orderDetail.coinCode"
      ></AbCellItem>
      <AbCellItem
        class="cellItem"
        title="区块链地址："
        :value="orderDetail.hashId"
        value-type="usdtUrl"
        :value-type-str="getUsdtUrl"
      ></AbCellItem>
      <AbCellItem
        class="cellItem"
        title="付款数量："
        :value="orderDetail.orderAmt + ' / ' + orderDetail.coinCode"
      ></AbCellItem>
      <AbCellItem
        class="cellItem"
        title="时间："
        :value="orderDetail.createdTime"
      ></AbCellItem>
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
.lineMargin {
  padding-bottom: 15px;
}
.infoTop {
  margin-bottom: 15px;
  .orderLabel {
    color: var(--ab-cell-label-color);
    font-size: 12px;
  }
  .orderNumber {
    color: var(--ab-main-text-color);
    font-weight: bold;
    font-size: 20px;
  }
}
.backItem {
  .lineBack {
    height: 10px;
    margin: 10px 0;
    background: #f6f7fd;
  }
  &:last-child {
    .lineBack {
      display: none;
    }
  }
}
//
//.cellItem {
//  //height: 14px;
//  //margin-bottom: 14px;
//  font-weight: 500;
//  .abCellTitle {
//    font-weight: 500;
//    font-size: 14px;
//  }
//  .abCellValue {
//    font-weight: 500;
//    font-size: 14px;
//  }
//}
</style>

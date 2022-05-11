<script>
export default {
  name: 'CoinDdbDetail'
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
const { ddbTransType, dictionary } = storeToRefs(selectStore)
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
const getTransType = (key) => {
  return unref(selectFilterName(key, ddbTransType.value))
}
// console.log(dictionary)
// const statusType = ref(1)
const getStatusName = computed(() => {
  const orderDetail = props.orderDetail
  const transType = orderDetail.transType
  const orderStatus = orderDetail.orderStatus
  let arrKey
  if (transType == 10 || transType == 11) {
    arrKey = 'BUY_ORDER_STATUS'
    // if (orderStatus) {
    //
    // }
  } else if (transType == 33) {
    arrKey = 'AUDIT_STATUS'
  } else if (transType == 41) {
    arrKey = 'EXCHANGE_ORDER_STATUS'
  }
  return unref(selectFilterName(orderStatus, dictionary.value[arrKey]))
  // dictionary
})
const statusType = computed(() => {
  const orderDetail = props.orderDetail
  const transType = orderDetail.transType
  const orderStatus = orderDetail.orderStatus
  let type
  if (transType == 10 || transType == 11) {
    if (orderStatus == '100') {
      type = 'done'
    } else if (orderStatus == '-100') {
      type = 'cancel'
    } else {
      type = 'going'
    }
  } else if (transType == 33) {
    if (orderStatus == '0') {
      type = 'going'
    } else if (orderStatus == '1') {
      type = 'done'
    } else {
      type = 'cancel'
    }
  } else if (transType == 41) {
    if (orderStatus == '100') {
      type = 'done'
    } else if (orderStatus == '-100') {
      type = 'cancel'
    } else {
      type = 'going'
    }
  }
  return type
})
const getSellName = computed(() => {
  return getTransType(props.orderDetail.transType)
})
</script>

<template>
  <div>
    <div v-if="orderDetail.transType != 33">
      <AbOrderIconType
        class="itemInfoBuy"
        :top-label="orderDetail.orderAmt + ' DDB'"
        :bottom-label="getStatusName"
        :type="statusType"
      ></AbOrderIconType>
      <div class="lineMargin">
        <div class="van-hairline--bottom"></div>
      </div>
      <AbCellItem
        class="cellItem"
        title="买卖类型："
        :value="getSellName"
      ></AbCellItem>
      <AbCellItem
        class="cellItem"
        title="订单号："
        :value="orderDetail.voucherNo"
        right-type="copy"
      ></AbCellItem>
      <AbCellItem
        class="cellItem"
        title="付款方式："
        :value="orderDetail.paymentType"
      ></AbCellItem>
      <AbCellItem
        class="cellItem"
        title="付款数量："
        :value="orderDetail.orderAmt"
      ></AbCellItem>
      <AbCellItem
        class="cellItem"
        title="时间："
        :value="orderDetail.createdTime"
      ></AbCellItem>
    </div>
    <div v-else>
      <div class="infoTop flex-column-center-center">
        <div class="orderLabel">返佣数量</div>
        <div class="orderNumber">1,599.0000 DDB</div>
      </div>
      <div class="van-hairline--bottom"></div>
      <div class="lineMargin"></div>
      <div class="backBox">
        <div
          v-for="(item, index) in orderDetail.rebateDetailList"
          :key="index"
          class="backItem"
        >
          <AbCellItem
            class="cellItem"
            title="交易信息："
            :value="item.realName + ' / ' + item.username"
          ></AbCellItem>
          <AbCellItem
            class="cellItem"
            title="交易数量："
            :value="item.tradeAmt"
          ></AbCellItem>
          <AbCellItem
            class="cellItem"
            title="返佣数量："
            :value="item.rebateAmt"
          ></AbCellItem>
          <AbCellItem
            class="cellItem"
            title="时间："
            :value="item.createdTime"
          ></AbCellItem>
          <div class="lineBack"></div>
        </div>
      </div>
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

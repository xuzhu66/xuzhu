<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import AbButtonText from '@/components/AbButtonText.vue'
import AbCellItem from '@/components/AbCellItem.vue'
import AbButton from '@/components/AbButton.vue'
import { useOrderDetail } from '@/hooks/useOrderDetail'
import { useCountDown } from '@/hooks/useCountDown'

const props = defineProps({
  item: {
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
  }
})
const emit = defineEmits(['orderClick'])
const orderClick = () => {
  emit('orderClick', props.item)
}
const haveTime = computed(() => {
  return props.item.countDownTime
})
const { hms } = useCountDown(haveTime)

const showCountDown = computed(() => {
  // if (props.item.countDownTime == 0) return false
  return (
    props.item.status == 20 ||
    props.item.status == 30 ||
    props.item.status == 40 ||
    props.item.status == 60
  )
})
const status = computed(() => {
  return props.item.status
})
const tradeRole = computed(() => {
  return props.item.tradeRole
})
const { label, labelBtn } = useOrderDetail(status, [], 'tradeGoing', {
  tradeRole: tradeRole
})
</script>
<template>
  <div class="listItem">
    <div class="infoTop flex-center-between">
      <div class="itemInfoBuy flex-center-start">
        <div
          class="infoIconBox flex-center-center"
          :class="item.tradeRole == 20 ? 'abSell' : 'abBuy'"
        >
          <div
            class="infoIcon"
            :class="item.tradeRole == 20 ? 'abSellIcon' : 'abBuyIcon'"
          ></div>
        </div>
        <div class="infoType flex flex-column align-start">
          <div class="infoTypeMoney">{{ item.buyAmt }} DDB</div>
          <div class="infoTypeText">
            {{ item.tradeRole == 20 ? '出售' : '购买' }}
          </div>
        </div>
      </div>
      <div class="infoTimeBox flex flex-column align-end justify-between">
        <!--      <div class="infoTimeType">待确认</div>-->
        <AbButtonText :label="label"></AbButtonText>
        <div v-if="showCountDown" class="infoTime">{{ hms }}</div>
      </div>
    </div>
    <AbCellItem
      class="cellItem"
      :title="item.tradeRole == 20 ? '买家：' : '卖家：'"
      :value="item.tradeRole == 20 ? item.buyRealName : item.sellRealName"
    ></AbCellItem>
    <AbCellItem
      class="cellItem"
      title="订单号："
      :value="item.tradeRole == 10 ? item.buyNo : item.tradeNo"
    ></AbCellItem>
    <AbCellItem
      class="cellItem"
      title="下单时间："
      :value="item.createdTime"
    ></AbCellItem>
    <div class="flex-center-end">
      <AbButton
        class="buyBtn"
        :width-full="false"
        :label="labelBtn"
        @click="orderClick"
      ></AbButton>
    </div>
  </div>
</template>
<style scoped lang="scss">
.listItem {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background: var(--ab-main-content-background-color);
  border-radius: 8px;
}
.infoTop {
  margin-bottom: 8px;
}
.infoIconBox {
  width: 40px;
  height: 40px;
  margin-right: 4px;
  background: #f4f7ff;
  border-radius: 8px;
  &.abSell {
    background: #FFF8F1;
  }
}
.infoIcon {
  width: 18px;
  height: 18px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.abBuyIcon {
  background-image: url('~@/assets/images/trade/BuyIcon.png');
}
.abSellIcon {
  background-image: url('~@/assets/images/trade/SellIcon.png');
}
.infoTypeMoney {
  font-weight: 600;
  font-size: 15px;
  color: var(--ab-main-text-color);
}
.infoTypeText {
  font-weight: 600;
  font-size: 12px;
  color: var(--ab-main-text-color);
}
.infoTime {
  font-size: 10px;
  color: #ff9f3d;
}
.buyBtn {
  height: 35px;
  font-size: 14px;
}
</style>

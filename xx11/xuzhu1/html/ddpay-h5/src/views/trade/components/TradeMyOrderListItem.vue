<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import AbButtonText from '@/components/AbButtonText.vue'
import AbCellItem from '@/components/AbCellItem.vue'
import { useCountDown } from '@/hooks/useCountDown'
import { useOrderDetail } from '@/hooks/useOrderDetail'

const props = defineProps({
  item: {
    type: Object,
    default: () => {
      return {}
    }
  },
  active: {
    type: Number,
    default: 0
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
const emit = defineEmits(['orderClick'])
const orderClick = () => {
  emit('orderClick', props.item)
}
const countDownTime = computed(() => {
  return props.item.countDownTime
})
const { hms } = useCountDown(countDownTime)

const showCountDown = computed(() => {
  // if (props.item.countDownTime == 0) return false
  return (
    props.item.status == 20 ||
    props.item.status == 30 ||
    props.item.status == 40 ||
    props.item.status == 60
  )
})
const { colorType, label } = useOrderDetail(
  props.item.status,
  [],
  props.active == 5 ? 'sell' : 'trade'
)

const sellOrBuy = computed(() => {
  if (props.active == 5) {
    return '出售'
  } else {
    return props.item.tradeRole == 20 ? '出售' : '购买'
  }
})
</script>
<template>
  <div class="listItem" @click="orderClick">
    <div class="infoTop flex-center-between">
      <div class="infoTypeText">{{ sellOrBuy }}{{ item.coinCode }}</div>
      <div class="infoTimeBox flex-center-end">
        <!--      <div class="infoTimeType">待确认</div>-->
        <div v-if="showCountDown" class="infoTime">{{ hms }}</div>
        <AbButtonText :label="label" :class="colorType"></AbButtonText>
        <div class="abThreeDotIcon"></div>
      </div>
    </div>
    <div class="flex-center-between">
      <AbCellItem
        class="cellItem timeItem"
        title="时间"
        :value="active == 5 ? item.createdTime : item.showTime"
        flex-type="columnStart"
      ></AbCellItem>
      <AbCellItem
        class="cellItem"
        title="数量"
        :value="active == 5 ? item.totalAmt : item.buyAmt"
        flex-type="columnCenter"
      ></AbCellItem>
      <AbCellItem
        class="cellItem"
        title="交易金(CNY)"
        :value="active == 5 ? item.totalIncome : item.tradeAmt"
        flex-type="columnEnd"
      ></AbCellItem>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.listItem {
  width: 100%;
  /*padding: 10px;*/
  margin-top: 16px;
  margin-bottom: 10px;
}
.infoTop {
  margin-bottom: 15px;
}
.abThreeDotIcon {
  width: 3px;
  height: 13px;
  margin-left: 7px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url('~@/assets/images/trade/threeDot.png');
}
.infoTypeText {
  font-weight: 600;
  font-size: 14px;
  color: var(--ab-main-text-color);
}
.infoTime {
  height: 17px;
  font-size: 10px;
  color: #ff9f3d;
  margin-right: 7px;
  line-height: 18px;
  background: #fff8f1;
  border-radius: 8px;
  padding-left: 4px;
  padding-right: 4px;
}
.cellItem {
  font-weight: 500;
  :deep .abCellTitle {
    font-weight: 500;
  }
  :deep .abCellValue {
    font-weight: 500;
  }
  &.timeItem {
    min-width: 130px;
  }
}
</style>

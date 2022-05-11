<script>
export default {
  name: 'AbOrderIconType'
}
</script>
<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
  topLabel: {
    type: String,
    default: ''
  },
  bottomLabel: {
    type: String,
    default: ''
  },
  bottomType: {
    // time倒计时
    type: String,
    default: ''
  },
  time: {
    // 单位 秒
    type: Number,
    default: 0
  },
  type: {
    // 1进行中, 2已完成， 3已取消， 4已下架
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
  flex: {
    type: String,
    default: 'start'
  }
})
const sizeClass = `abOrderIcon${props.size}`

const flexString = ref('flex-center-start')
const setFlex = () => {
  if (props.flex === 'between') {
    flexString.value = 'flex-center-between'
  }
}
setFlex()

const flexStringLabel = ref('align-start')
const setFlexLabel = () => {
  if (props.flex === 'between') {
    flexStringLabel.value = 'align-end'
  } else {
    flexStringLabel.value = 'align-start'
  }
}
setFlexLabel()
</script>

<template>
  <div class="abOrderIconType" :class="[flexString, sizeClass, type]">
    <div class="flex-center-center infoIconBox">
      <div class="infoIcon abOrderIcon"></div>
    </div>
    <div class="infoType flex flex-column" :class="flexStringLabel">
      <div class="infoTypeMoney">{{ topLabel }}</div>
      <div class="infoTypeText">
        <span>{{ bottomLabel }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.infoIconBox {
  width: 60px;
  height: 60px;
  margin-right: 19px;
  border-radius: 8px;
}
.infoIcon {
  width: 32px;
  height: 32px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.infoTypeMoney {
  font-weight: 600;
  font-size: 20px;
  color: var(--ab-main-text-color);
}
.infoTypeText {
  font-weight: 500;
  font-size: 12px;
}
.abOrderIconMini {
  .infoIconBox {
    width: 40px;
    height: 40px;
  }
  .infoIcon {
    width: 20px;
    height: 20px;
  }

  .infoTypeMoney {
    font-weight: 500;
    font-size: 14px;
  }
  .infoTypeText {
    font-weight: 600;
    font-size: 12px;
  }
}
.abOrderIconType {
  // 订单取消
  &.cancel {
    .infoIconBox {
      background: #ffeded;
    }
    .abOrderIcon {
      background-image: url('~@/assets/images/trade/cancelIcon.png');
    }
    .infoTypeText {
      color: #ff6666;
    }
  }
  // 订单已完成
  &.done {
    .infoIconBox {
      background: #edfff7;
    }
    .abOrderIcon {
      background-image: url('~@/assets/images/trade/doneIcon.png');
    }
    .infoTypeText {
      color: #33e264;
    }
  }
  // 挂单进行中
  &.going {
    .infoIconBox {
      background: #fff8f1;
    }
    .abOrderIcon {
      background-image: url('~@/assets/images/trade/goingIcon.png');
    }
    .infoTypeText {
      color: #ff9f3d;
    }
  }
  // 已下架
  &.down {
    .infoIconBox {
      background: #f2f2f2;
    }
    .abOrderIcon {
      background-image: url('~@/assets/images/trade/downOrderIcon.png');
    }
    .infoTypeText {
      color: #c4c4c4;
    }
  }
}
</style>

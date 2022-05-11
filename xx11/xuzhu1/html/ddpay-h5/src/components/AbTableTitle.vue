<script>
export default {
  name: 'AbTableTitle'
}
</script>
<script setup>
import { defineProps, defineEmits } from 'vue'
// const checked = ref(false)
const props = defineProps({
  tabs: {
    type: Array,
    default: () => {
      return []
    }
  },
  // 黑色 灰色
  styleType: {
    type: String,
    default: ''
  },
  showArrow: {
    type: Boolean,
    default: false
  },
  // 3种状态类型，根据类型显示颜色
  statusType: {
    // 1进行中 2成功 3失败
    type: [String, Number],
    default: ''
  },
  // 状态颜色 显示在tabs的第几个下标
  status: {
    type: Number,
    default: -1
  },
  // 默认between靠两边对齐, center均分宽度，
  layout: {
    type: String,
    default: 'between'
  }
})
const emit = defineEmits(['click'])
const clickItem = () => {
  emit('click')
}
const typeClass = () => {
  if (props.statusType == '1') {
    return 'going'
  } else if (props.statusType == '2') {
    return 'done'
  } else if (props.statusType == '3') {
    return 'cancel'
  }
}
</script>
<template>
  <div class="abTableTitleBox" :class="styleType" @click="clickItem">
    <div class="abTableTitle" :class="layout">
      <div
        v-for="(item, index) in tabs"
        :key="index"
        class="abTableTitleItem"
      >
        <span v-if="status == index" :class="[typeClass()]">{{ item.name }}</span>
        <span v-else>{{ item.name }}</span>
        <span v-if="showArrow && (tabs.length - 1 === index)" class="abTableTitleArrow"></span>
      </div>
    </div>
    <div class="van-hairline--bottom"></div>
  </div>
</template>
<style lang="scss">
.abTableTitleBox {
  .van-hairline--bottom {
    display: none;
  }
  &.black {
    line-height: 49px;
    .abTableTitleItem {
      color: var(--ab-main-text-color);
      line-height: 49px;
    }
    .van-hairline--bottom {
      display: block;
      height: 1px;
    }
  }
}
.abTableTitle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  &.center {
    justify-content: space-around;
  }
  &.between {
    .abTableTitleItem {
      &:first-child {
        min-width: 80px;
        justify-content: flex-start;
        flex: none;
        word-break: keep-all;
      }
      &:last-child {
        min-width: 100px;
        justify-content: flex-end;
        flex: none;
        word-break: keep-all;
      }
    }
  }
}
.abTableTitleItem {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 12px;
  //line-height: 17px;
  color: var(--ab-main-gray-text-color);
  flex: 1;
  .going {
    color: var(--ab-text-warning);
  }
  .done {
    color: var(--ab-text-success);
  }
  .cancel {
    color: var(--ab-text-cancel);
  }
}
.abTableTitleArrow {
  width: 5.29px;
  height: 9.54px;
  margin-left: 5px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url('~@/assets/images/index/detailArrow.png');
}
</style>

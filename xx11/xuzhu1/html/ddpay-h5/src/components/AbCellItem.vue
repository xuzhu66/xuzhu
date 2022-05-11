<script>
export default {
  name: 'AbCellItem'
}
</script>
<script setup>
import { defineProps, defineEmits } from 'vue'
import { copyText } from '@/hooks/useQuery'
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  value: {
    type: [String, Number],
    default: ''
  },
  valueType: {
    type: String,
    default: ''
  },
  flexType: {
    type: String,
    default: 'row'
  },
  rightType: {
    type: String,
    default: ''
  },
  copyTitle: {
    type: Boolean,
    default: false
  },
  blackTitle: {
    type: Boolean,
    default: false
  },
  grayValue: {
    type: Boolean,
    default: false
  },
  valueTypeStr: {
    type: String,
    default: ''
  },
  iconName: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['clickRight', 'clickQuestion'])
const clickRight = (event) => {
  emit('clickRight', event)
}
const clickQuestion = (event) => {
  emit('clickQuestion', event)
}

const defineClass = () => {
  // console.log(props.flexType)
  if (props.flexType === 'columnCenter') {
    return 'flexColumnCenter'
  } else if (props.flexType === 'columnStart') {
    return 'flexColumnStart'
  } else if (props.flexType === 'columnEnd') {
    return 'flexColumnEnd'
  } else if (props.flexType === 'rowStart') {
    return 'flexRowStart'
  } else {
    return 'flex-center-between'
  }
}

const copyTextBy = () => {
  if (props.copyTitle) {
    copyText(props.title)
  } else {
    copyText(props.value)
  }
}
</script>
<template>
  <div class="abCellItem" :class="defineClass()">
    <div class="abCellTitle" :class="{ blackTitle: blackTitle }">
      <slot name="iconTitleLeft"></slot>
      <div>{{ title }}</div>
      <slot name="icon">
        <div v-if="iconName" class="icon" :class="iconName" @click="clickQuestion"></div>
      </slot>
    </div>
    <div class="abCellValue" :class="{ grayValue: grayValue }" @click="clickRight">
      <div class="abCellText">
        <a
          v-if="valueType == 'usdtUrl'"
          :href="valueTypeStr"
          class="urlText"
          target="_blank"
        >
          {{ value }}
        </a>
        <span v-else> {{ value ? value : ' ' }} </span>
      </div>
      <slot name="iconRight">
        <div
          v-if="rightType === 'copy'"
          class="abCopyIcon"
          @click="copyTextBy"
        ></div>
        <div v-if="rightType === 'arrow'" class="abArrowRightIcon"></div>
      </slot>
    </div>
  </div>
</template>

<style lang="scss">
.abCellItem {
  min-height: 30px;
  justify-content: space-between;
  .abCellTitle {
    display: flex;
    align-items: center;
    word-break: keep-all;
    font-weight: 600;
    font-size: 14px;
    color: var(--ab-main-gray-text-color);
    &.blackTitle {
      color: var(--ab-main-text-color);
    }
  }
  .abCellValue {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
    font-weight: 600;
    font-size: 14px;
    color: var(--ab-main-text-color);
    &.grayValue {
      color: var(--ab-main-gray-text-color);
    }
    .urlText {
      color: var(--ab-button-main-text-color);
      text-decoration: underline;
    }
    span {
      display: inline-block;
      min-height: 14px;
    }

  }
  .abCellText {
    margin-right: 5px;
    word-break: break-word;
    text-align: right;
  }

  .question {
    margin-left: 10px;
    width: 12px;
    height: 12px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('~@/assets/images/trade/question.png');
  }
}
.flexColumnCenter {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flexColumnStart {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.flexColumnEnd {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.flexRowStart {
  display: flex;
  align-items: flex-start;
  flex-direction: row;
}
.abCopyIcon {
  width: 11px;
  height: 13px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url('~@/assets/images/trade/copyIcon.png');
}
.abArrowRightIcon {
  width: 5.71px;
  height: 9.95px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url('~@/assets/images/trade/arrowRight.png');
}
</style>

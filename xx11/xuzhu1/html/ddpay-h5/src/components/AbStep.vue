<script>
export default {
  name: 'AbStep'
}
</script>
<script setup>
import { Step } from 'vant'
import { defineProps } from 'vue'
defineProps({
  content: {
    type: String,
    default: ''
  },
  time: {
    type: String,
    default: ''
  },
  showStepIcon: {
    type: Boolean,
    default: true
  },
  showStepContent: {
    type: Boolean,
    default: true
  },
  showOtherContent: {
    type: Boolean,
    default: false
  },
  warningText: {
    type: String,
    default: ''
  },
  showWarning: {
    type: Boolean,
    default: false
  }
})
</script>
<template>
  <Step :class="{ abStepHideIcon: !showStepIcon }">
    <div>
      <div v-if="showStepContent" class="abStepBox">
        <slot>
          <div class="abStepContent">{{ content }}</div>
          <div class="abStepTime">{{ time }}</div>
        </slot>
      </div>
      <div v-if="showOtherContent" class="abStepBox">
        <slot name="other"></slot>
      </div>
      <div v-if="showWarning" class="abWarningText">{{ warningText }}</div>
    </div>
  </Step>
</template>
<style lang="scss">
.abStepHideIcon {
  .van-step__circle-container {
    display: none;
  }
}
.abStepBox {
  padding: 14px 10px;
  margin-top: 15px;
  background-color: var(--ab-content-gray-bg-color);
  border-radius: 8px;
  color: var(--ab-main-text-color);
  text-align: left;
  &:first-child {
    margin-top: 0;
  }
}
.abStepContent {
  font-weight: 500;
  font-size: 14px;
}
.abStepTime {
  font-weight: 500;
  font-size: 12px;
  color: var(--ab-button-gray-text-color);
}
.abWarningText {
  text-align: left;
  margin-top: 10px;
  font-weight: 500;
  font-size: 12px;
  color: var(--ab-text-warning);
}
</style>

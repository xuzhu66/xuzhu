<script>
export default {
  name: 'AbSteps'
}
</script>
<script setup>
import { Steps } from 'vant'
import { defineProps } from 'vue'
defineProps({
  activeIcon: {
    type: String,
    default: 'abStepIcon'
  },
  direction: {
    type: String,
    default: 'vertical'
  },
  inactiveIcon: {
    type: String,
    default: 'abStepIcon'
  },
  activeColor: {
    type: String,
    default: '#F6F7FD'
  },
  inactiveColor: {
    type: String,
    default: '#F6F7FD'
  }
})
</script>
<template>
  <Steps
    class="abStepsStyle"
    :direction="direction"
    :active-icon="activeIcon"
    :inactive-icon="inactiveIcon"
    :active-color="inactiveColor"
    :inactive-color="inactiveColor"
  >
    <slot></slot>
  </Steps>
</template>
<style lang="scss">
.van-icon-abStepIcon {
  width: 14px;
  height: 14px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  //background-image: url('~@/assets/images/index/back.png');
  background-color: #486bf6;
  border-radius: 50%;
}
.abStepsStyle {
  [class*=van-hairline]:after {
    display: none;
  }
}
</style>

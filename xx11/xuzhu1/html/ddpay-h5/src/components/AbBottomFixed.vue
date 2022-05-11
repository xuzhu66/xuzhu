<script>
export default {
  name: 'AbBottomFixed'
}
</script>
<script setup>
import AbButton from '@/components/AbButton'
import { defineProps, defineEmits } from 'vue'
const emit = defineEmits(['confirm', 'appeal'])
defineProps({
  confirmText: {
    type: String,
    default: '确认'
  },
  showConfirm: {
    type: Boolean,
    default: true
  },
  appealText: {
    type: String,
    default: ''
  },
  appealColor: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  widthFull: {
    type: Boolean,
    default: true
  },
  showAppeal: {
    type: Boolean,
    default: false
  }
})
const handleConfirm = (event) => {
  // eslint-disable-next-line vue/require-explicit-emits
  emit('confirm', event)
}
const handleAppeal = (event) => {
  emit('appeal', event)
}
// const buttonColor = useCssVar('--ab-button-main-color')
</script>
<template>
  <div class="abBottomFixed flex-center-between">
    <div class="abBottomLeft">
      <AbButton
        v-if="showConfirm"
        :loading="loading"
        :label="confirmText"
        @click="handleConfirm"
      ></AbButton>
    </div>
    <div
      v-if="showAppeal"
      class="abBottomFixedAsk"
      :class="appealColor"
      @click="handleAppeal"
    >
      {{ appealText }}
    </div>
  </div>
</template>
<style lang="scss">
.abBottomFixed {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 26px;
  background-color: var(--ab-main-content-background-color);
  z-index: 10;
  box-shadow: -10px -10px 10px rgba(216, 221, 240, 0.2);
  .abBottomLeft {
    flex: 1;
  }
  .abBottomFixedAsk {
    width: 100px;
    margin-left: 30px;
    font-weight: 600;
    font-size: 15px;
    color: var(--ab-text-warning);
    &.gray {
      color: var(--ab-button-gray-text-color);
    }
  }
}
</style>

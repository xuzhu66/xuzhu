<script>
export default {
  name: 'AbButton'
}
</script>
<script setup>
import { Button } from 'vant'
import { defineProps, defineEmits } from 'vue'
const emit = defineEmits(['click'])
defineProps({
  label: {
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
  backgroundType: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  width: {
    type: String,
    default: ''
  }
})
const handleClick = (event) => {
  // eslint-disable-next-line vue/require-explicit-emits
  emit('click', event)
}
// const buttonColor = useCssVar('--ab-button-main-color')
</script>
<template>
  <Button
    :loading="loading"
    :disabled="disabled"
    class="abBtn flex-center-center"
    :class="[{ widthFull: widthFull }, backgroundType]"
    :style="{
      width: width
    }"
    type="primary"
    @click="handleClick"
  >
    {{ label }}
    <slot name="other"></slot>
  </Button>
</template>
<style lang="scss">
.abBtn {
  //margin-top: 22px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  background-color: var(--ab-button-main-color);
  border: none;
  &.gray {
    background-color: var(--ab-button-gray-color);
    color: var(--ab-button-gray-text-color);
  }
  &.white {
    background-color: var(--ab-main-content-background-color);
    color: #dadada;
    border: 1px solid #dadada;
  }
  &.blue {
    background-color: #ffffff;
    color: var(--ab-button-main-color);
    border: 1px solid var(--ab-button-main-color);
  }
  &.going {
    background-color: #ff9f3d;
    color: #ffffff;
  }
}
.widthFull {
  width: 100%;
}
</style>

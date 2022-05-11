<script>
export default {
  name: 'AbButtonText'
}
</script>
<script setup>
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
  }
})
const handleClick = (event) => {
  // eslint-disable-next-line vue/require-explicit-emits
  emit('click', event)
}
// const buttonColor = useCssVar('--ab-button-main-color')
</script>
<template>
  <div
    class="abBtnText flex-center-center"
    @click="handleClick"
  >
    {{ label }}
  </div>
</template>
<style lang="scss">
.abBtnText {
  font-size: 12px;
  color: var(--ab-button-main-text-color);

  &.going {
    color: var(--ab-text-warning);
  }
  &.done {
    color: var(--ab-text-success);
  }
  &.cancel {
    color: var(--ab-text-cancel);
  }
  &.blue {
    color: var(--ab-button-main-color);
  }
  &.gray {
    color: var(--ab-main-gray-text-color);
  }
}
</style>

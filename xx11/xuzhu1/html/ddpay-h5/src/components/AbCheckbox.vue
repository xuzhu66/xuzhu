<script>
export default {
  name: 'AbCheckbox'
}
</script>
<script setup>
import { Checkbox } from 'vant'
import { defineProps, defineEmits } from 'vue'
import { useVModel } from '@vueuse/core'

// const checked = ref(false)
const props = defineProps({
  checked: {
    type: Boolean,
    default: false
  },
  blueText: {
    type: String,
    default: ''
  },
  normalText: {
    type: String,
    default: ''
  },
  textPosition: {
    type: String,
    default: 'in'
  }
})
const emit = defineEmits(['clickBlue', 'update:checked'])

const checked = useVModel(props, 'checked', emit)
// const updateChecked = (event) => {
//   // console.log(event)
//   checked.value = event
// }
const clickChecked = (event) => {
  // console.log(event)
  checked.value = !checked.value
}
const clickBlue = (event) => {
  emit('clickBlue', event)
}
</script>
<template>
  <div class="abCheckboxOut">
    <Checkbox
      :model-value="checked"
      class="abCheckbox"
      shape="square"
      icon-size="12px"
      @click="clickChecked"
    >
      <span v-if="textPosition === 'in'">
        <span class="abUserFine" @click="clickBlue">{{ blueText }}</span>
        <span @click="clickChecked">{{ normalText }}</span>
      </span>
      <slot></slot>
    </Checkbox>
    <div v-if="textPosition === 'out'">
      <span class="abUserFine" @click="clickBlue">{{ blueText }}</span>
      <span @click="clickChecked">{{ normalText }}</span>
    </div>
  </div>
</template>
<style lang="scss">
.abCheckboxOut {
  font-size: 12px;
  margin-top: 14px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .van-checkbox__label {
    line-height: 1;
  }
  .abUserFine {
    font-weight: 500;
    font-size: 12px;
    color: #486bf6;
  }
}
.abCheckbox {
}
</style>

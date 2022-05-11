<script>
export default {
  name: 'AbInput'
}
</script>
<script setup>
import { defineProps, defineEmits } from 'vue'
import { useVModel } from '@vueuse/core'
import { Field } from 'vant'
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  leftIcon: {
    type: String,
    // logo-img
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  isFull: {
    type: Boolean,
    default: false
  },
  showEye: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: true
  },
  maxlength: {
    type: [Number, String],
    default: '-'
  }
})
const emit = defineEmits(['change', 'update:modelValue', 'update:type'])

const modelValue = useVModel(props, 'modelValue', emit)
const type = useVModel(props, 'type', emit)

const changeMethod = (event) => {
  // console.log(event)
  emit('change', event.target.value)
  // modelValue.value = event.target.value
}
const clearMethod = (event) => {
  modelValue.value = ''
}
const changeEye = (event) => {
  // console.log(type.value)
  if (type.value == 'text') {
    type.value = 'password'
  }
  if (type.value == 'password') {
    type.value = 'text'
  }
  // console.log(type.value)
}

</script>
<template>
  <Field
    v-model="modelValue"
    class="abInputStyle"
    :class="{'isFull': isFull}"
    :clearable="clearable"
    :type="type"
    :left-icon="leftIcon"
    :placeholder="placeholder"
    :maxlength="maxlength"
    @change="changeMethod"
    @clear="clearMethod"
  >
    <template #button>
      <div class="abInputRightButton">
        <span v-if="showEye" class="eye" :class="type == 'text' ? 'open' : 'close'" @click="changeEye"></span>
        <slot name="button"></slot>
      </div>
    </template>
  </Field>
</template>
<style lang="scss">
.abInputStyle {
  font-size: 15px;
  font-weight: 600;
  padding-left: 10px;
  .van-field__left-icon {
    display: flex;
    align-items: center;
  }
  &.isFull {
    height: 100%;
    .van-field__value {
      height: 100%;
    }
    .van-field__body {
      height: 100%;
    }
    .van-field__control {
      height: 100%;
    }
  }

  .eye{
    width: 18px;
    height: 16px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    &.open{
      background-image: url("~@/assets/images/center/eyeo.png");
    }
    &.close{
      background-image: url("~@/assets/images/center/eyec.png");
    }
  }
  .abInputRightButton {
    display: flex;
    align-items: center;
  }
}

.van-icon-logo-img {
  width: 20px;
  height: 20px;
  background-image: url('~@/assets/images/trade/Ellipse.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>

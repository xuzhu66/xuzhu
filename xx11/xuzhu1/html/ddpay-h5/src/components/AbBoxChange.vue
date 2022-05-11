<script>
export default {
  name: 'AbBoxChange'
}
</script>
<script setup>
import { defineProps, defineEmits } from 'vue'
import { useVModel } from '@vueuse/core'

// const checked = ref(false)
const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: ''
  },
  list: {
    type: Array,
    default: () => {
      return []
    }
  }
})
const emit = defineEmits(['update:modelValue'])

const modelValue = useVModel(props, 'modelValue', emit)
// const updateValue = (event) => {
//   // console.log(event)
//   modelValue.value = event
// }
const changeMethod = (item) => {
  modelValue.value = item.key
}
</script>
<template>
  <div class="abBoxChange">
    <div
      v-for="(item, index) in list"
      :key="index"
      :class="modelValue == item.key ? 'active' : ''"
      class="abBoxChangeItem"
      @click="changeMethod(item)"
    >
      {{ item.value }}
    </div>
  </div>
</template>
<style lang="scss">

.abBoxChange {
  //padding: 0 10px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
}
.abBoxChangeItem {
  min-width: 104px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 0 10px;
  //margin-right: 15px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #D1D3DA;
  border-radius: 8px;
  background-color: var(--ab-content-gray-bg-color);
  &.active {
    background: #FFFFFF;
    border: 1.5px solid #486BF6;
    box-shadow: 0px 10px 10px rgba(68, 103, 243, 0.1);
    color: var(--ab-main-text-color)
  }
}
</style>

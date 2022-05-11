<script>
export default {
  name: 'AbSelectList'
}
</script>
<script setup>
import AbSelectListItem from '@/components/AbSelectListItem.vue'
import { defineProps, defineEmits } from 'vue'
import { useVModel } from '@vueuse/core'

// const checked = ref(false)
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: 0
  },
  list: {
    type: Array,
    default: () => {
      return []
    }
  },
  showLine: {
    type: Boolean,
    default: false
  },
  labelProp: {
    type: String,
    default: 'label'
  },
  valueProp: {
    type: String,
    default: 'value'
  }
})
const emit = defineEmits(['changeTab', 'update:modelValue'])
const modelValue = useVModel(props, 'modelValue', emit)
const changeTab = (item) => {
  modelValue.value = item[props.valueProp]
  emit('changeTab', item)
}
</script>

<template>
  <div class="abPaymentSelectList">
    <div v-for="(item, index) in list" :key="index">
      <AbSelectListItem
        :item="item"
        :label-prop="labelProp"
        :active="item[valueProp] === modelValue"
        @clickItem="changeTab"
      ></AbSelectListItem>
      <div v-if="showLine" class="van-hairline--bottom"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.abPaymentSelectList {
  display: flex;
  flex-direction: column;
}
</style>

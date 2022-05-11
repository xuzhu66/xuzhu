<script setup>
import { defineProps, defineEmits } from 'vue'
import { useVModel } from '@vueuse/core'
import AbPopup from '@/components/AbPopup'
import AbSelectList from '@/components/AbSelectList.vue'
import { storeToRefs } from 'pinia'
import { useSelectStore } from '@/store/modules/select'
const selectStore = useSelectStore()
const props = defineProps({
  checkedTime: {
    type: String,
    default: ''
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['refresh', 'update:tabActive', 'update:checkedTime', 'update:show'])
// const tabActive = useVModel(props, 'tabActive', emit)
const checkedTime = useVModel(props, 'checkedTime', emit)
const show = useVModel(props, 'show', emit)
const { dictionary } = storeToRefs(selectStore)
const changeTab = (item) => {
  emit('refresh', item)
}
</script>

<template>
  <AbPopup v-model:show="show" position="bottom">
    <div class="popBox">
      <AbSelectList
        v-model:modelValue="checkedTime"
        :list="dictionary['APP_FUNDS_QUERY']"
        value-prop="key"
        label-prop="value"
        @changeTab="changeTab"
      ></AbSelectList>
    </div>
  </AbPopup>
</template>

<style lang="scss" scoped>
.popBox {
  padding: 0 16px;
}
</style>

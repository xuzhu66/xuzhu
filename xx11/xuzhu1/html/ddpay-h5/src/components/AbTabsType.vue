<script>
export default {
  name: 'AbTabsType'
}
</script>
<script setup>
import { defineEmits, defineProps } from 'vue'
import { useVModel } from '@vueuse/core'
import AbTabsItem from '@/components/AbTabsItem.vue'

const props = defineProps({
  activeTab: {
    type: Number,
    default: 0
  },
  tabList: {
    type: Array,
    default: () => {
      return []
    }
  }
})
const emit = defineEmits(['change', 'update:activeTab'])

const activeTab = useVModel(props, 'activeTab', emit)
const updateActiveTab = (event) => {
  // console.log(event)
  emit('change', event)
  activeTab.value = event
}
const activeStr = (index) => {
  return activeTab.value === index
}
</script>

<template>
  <div class="tabBox">
    <AbTabsItem
      v-for="(item, index) in tabList"
      :key="index"
      :class="{active: activeStr(index)}"
      :label="item.name"
      size="Large"
      @click="updateActiveTab(index)"
    >
    </AbTabsItem>
  </div>
</template>

<style lang="scss">
.tabBox {
  display: flex;
  align-items: flex-end;
}
</style>

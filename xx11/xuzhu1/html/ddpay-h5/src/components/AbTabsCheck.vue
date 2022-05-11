<script>
export default {
  name: 'AbTabsCheck'
}
</script>
<script setup>
import { defineProps, defineEmits } from 'vue'
// import { useVModel } from '@vueuse/core'

// const checked = ref(false)
defineProps({
  tabActive: {
    type: Number,
    default: 0
  },
  tabs: {
    type: Array,
    default: () => {
      return []
    }
  }
})
const emit = defineEmits(['changeTab', 'update:tabActive'])

// const tabActive = useVModel(props, 'tabActive', emit)

const changeMethod = (index) => {
  // tabActive.value = index
  emit('changeTab', index)
}
</script>
<template>
  <div class="abTabsCheck fz14 fw600 flex">
    <div
      v-for="(item, index) in tabs"
      :key="index"
      :class="{ active: tabActive === item.value }"
      @click="changeMethod(index)"
    >
      {{ item.name }}
    </div>
  </div>
</template>
<style lang="scss">
.abTabsCheck {
  //margin-top: 16px;
  margin-bottom: 16px;
  div {
    width: 172px;
    height: 34px;
    line-height: 34px;
    background: #fff;
  }
  div:first-child {
    border-radius: 8px 0px 0px 8px;
  }
  div:last-child {
    border-radius: 0px 8px 8px 0px;
  }
  .active {
    background: #486bf6;
    color: #fff;
  }
}
</style>

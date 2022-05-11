<script>
export default {
  name: 'AbTableContent'
}
</script>
<script setup>
import { defineProps } from 'vue'
// const checked = ref(false)
defineProps({
  tabs: {
    type: Array,
    default: () => {
      return []
    }
  }
})
</script>
<template>
  <div class="abTableTitle">
    <div
      v-for="(item, index) in tabs"
      :key="index"
      class="abTableTitleItem"
    >
      {{ item.name }}
    </div>
  </div>
</template>
<style lang="scss">
.abTableTitle {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.abTableTitleItem {
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;
  color: var(--ab-main-gray-text-color);
  &:first-child {
    text-align: left;
  }
  &:last-child {
    text-align: right;
  }
}
</style>

<script setup>
import NotifyListItem from './NotifyListItem.vue'
import {
  defineProps
  // defineEmits
} from 'vue'
defineProps({
  list: {
    type: Array,
    default: () => {
      return []
    }
  }
})
// const emit = defineEmits()
</script>
<template>
  <div class="listBox" :class="list.length == 1 ? 'flex-center-center' : ''">
    <NotifyListItem v-for="(item, index) in list" :key="index"></NotifyListItem>
  </div>
</template>

<style scoped>
.listBox {
  margin: 0 16px;
  overflow-x: auto;
  display: flex;
  /*justify-content: center;*/
}
</style>

<script>
export default {
  name: 'AbSelectListItem'
}
</script>
<script setup>
import { defineProps, defineEmits } from 'vue'
const props = defineProps({
  item: {
    type: Object,
    default: () => {
      return {}
    }
  },
  active: {
    type: Boolean,
    default: false
  },
  labelProp: {
    type: String,
    default: 'label'
  },
  valueProp: {
    type: String,
    default: 'label'
  }
})
const emit = defineEmits(['clickItem'])
const clickItem = () => {
  emit('clickItem', props.item)
}
</script>
<template>
  <div class="abSelectListItem" :class="{ active: active }" @click="clickItem">
    <div class="abSelectListItemLabel">{{ item[labelProp] }}</div>
    <div class="abSelectIcon"></div>
  </div>
</template>
<style lang="scss">
.abSelectListItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 45px;
  //padding: 20px 10px;
  padding: 0 10px;
  border-radius: 8px;

  &.active {
    background: #f6f7fd;
    .abSelectIcon {
      display: block;
    }
    .abSelectListItem {
      color: var(--ab-main-text-color);
    }
  }
}
.abSelectIcon {
  display: none;
  width: 16px;
  height: 16px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url('~@/assets/images/trade/selectActive.png');
}
.abSelectListItemLabel {
  font-size: 15px;
  font-weight: 500;
  color: var(--ab-main-gray-text-color);
}
</style>

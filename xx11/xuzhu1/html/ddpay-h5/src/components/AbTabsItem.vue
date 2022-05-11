<script>
export default {
  name: 'AbTabsItem'
}
</script>
<script setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  // Mini Middle Large
  size: {
    type: String,
    default: 'Middle'
  }
})
const emit = defineEmits(['click'])
const sizeClass = `abTab${props.size}`
</script>

<template>
  <div
    class="AbTabItem"
    :class="[{ active: active }, sizeClass]"
    @click="emit('click', $event)"
  >
    <div class="abTabCon">{{ label }}</div>
    <div class="abTabBottomLine"></div>
  </div>
</template>

<style lang="scss">
.AbTabItem {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-right: 30px;
  &:last-child {
    margin-right: 0;
  }
}
.abTabCon {
  margin-bottom: 5px;
  font-size: 14px;
  color: var(--ab-nav-normal-color);
}
.abTabBottomLine {
  background-color: var(--van-tabs__line);
  width: var(--van-tabs-bottom-bar-width);
  height: var(--van-tabs-bottom-bar-height);
  border-radius: 2px 2px 0 0;
  opacity: 0;
}
.active {
  .abTabCon {
    font-weight: 600;
    color: var(--ab-nav-active-color);
  }
  &.abTabMini {
    .abTabCon {
      font-size: 14px;
      line-height: 15px;
    }
  }
  &.abTabMiddle {
    .abTabCon {
      font-size: 16px;
      line-height: 19px;
    }
  }
  &.abTabLarge {
    .abTabCon {
      font-size: 20px;
      line-height: 27px;
    }
  }
  .abTabBottomLine {
    opacity: 1;
  }
}

</style>

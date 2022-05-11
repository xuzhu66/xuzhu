<script>
export default {
  name: 'AbNavBar'
}
</script>
<script setup>
import { NavBar } from 'vant'
import { defineProps, defineEmits } from 'vue'
import { goBack, pushWithQuery } from '@/hooks/useQuery'
import { useRoute } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  rightText: {
    type: String,
    default: ''
  },
  beforeLeft: {
    type: Boolean,
    default: false
  },
  rightIcon: {
    type: String,
    // abRightArrowIcon
    default: ''
  },
  border: {
    type: Boolean,
    default: false
  },
  showLeftIcon: {
    type: Boolean,
    default: true
  },
  showService: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['clickLeft', 'clickRight'])
const route = useRoute()
const clickLeft = (event) => {
  if (!props.beforeLeft) {
    if (route.query.fromUrl) {
      goBack(route.query.fromUrl)
    } else {
      goBack()
    }
  }
  emit('clickLeft', event)
}
const clickRight = (event) => {
  emit('clickRight', event)
  if (props.showService) {
    pushWithQuery('Chat')
  }
}
</script>
<template>
  <NavBar
    fixed
    sticky
    :border="border"
    :right-text="rightText"
    :z-index="10"
    class="abNavBar"
    @clickLeft="clickLeft"
    @clickRight="clickRight"
  >
    <template #left>
      <div class="abLeft">
        <div v-if="showLeftIcon" class="abLeftIcon abArrowIcon"></div>
        <div class="abLeftText">{{ title }}</div>
      </div>
    </template>
    <template #right>
      <div class="abRight" @click="clickRight">
        <span class="abRightText">{{ rightText }}</span>
        <span v-if="rightIcon" class="abRightIcon" :class="rightIcon"></span>
        <span v-if="showService" class="abRightIcon abRightServiceIcon"></span>
      </div>
    </template>
  </NavBar>
</template>

<style lang="scss">
.abLeft {
  display: flex;
  align-items: center;
  color: var(--ab-main-text-color);
  font-weight: 600;
  font-size: 20px;
}
.abLeftIcon {
  width: 14px;
  height: 14px;
  margin-right: 20px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.abArrowIcon {
  background-image: url('~@/assets/images/index/back.png');
}
.abLeftText {
  line-height: 1;
}
.abNavBar {
  .van-nav-bar__text {
    color: #a1a0a0;
  }
}
.abRight {
  display: flex;
  align-items: center;
}
.abRightText {
  color: #a1a0a0;
}
.abRightIcon {
  width: 12px;
  height: 8px;
  margin-left: 5px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.abRightArrowIcon {
  background-image: url('~@/assets/images/arrow.png');
}
.abRightServiceIcon {
  width: 16px;
  height: 17px;
  background-image: url('~@/assets/images/trade/service.png');
}
</style>

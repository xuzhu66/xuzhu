<script>
export default {
  name: 'AbCircle'
}
</script>
<script setup>
import { defineProps, defineEmits } from 'vue'
import { Circle } from 'vant'
import { useVModel } from '@vueuse/core'

const props = defineProps({
  strokeWidth: {
    type: [Number, String],
    default: 60
  },
  text: {
    type: String,
    default: ''
  },
  textStyle: {
    type: String,
    default: 'going'
  },
  currentRate: {
    type: Number,
    default: 0
  },
  rate: {
    type: [Number, String],
    default: 100
  },
  speed: {
    type: Number,
    default: 0
  },
  layerColor: {
    type: String,
    default: '#ff9f3d57'
  },
  color: {
    type: [String, Object],
    default: '#FF9F3D'
  },
  fill: {
    type: String,
    default: ''
  },
  clockwise: {
    type: Boolean,
    default: false
  },
  size: {
    type: [Number, String],
    default: 70
  },
  startPosition: {
    type: String,
    default: 'top'
  }
})
const emit = defineEmits(['update:currentRate'])
const currentRate = useVModel(props, 'currentRate', emit)
</script>
<template>
  <Circle
    v-model:current-rate="currentRate"
    class="abCircleText"
    :rate="rate"
    :speed="speed"
    :text="text"
    :stroke-width="strokeWidth"
    :layer-color="layerColor"
    :color="color"
    :clockwise="clockwise"
    :size="size"
    :start-position="startPosition"
  >
    <div :class="textStyle">
      <slot>{{ text }}</slot>
    </div>
  </Circle>
</template>

<style lang="scss">
.abCircleText {
  display: flex;
  align-items: center;
  justify-content: center;
  .going {
    color: var(--ab-text-warning);
    font-size: 12px;
  }
}
</style>

<script>
export default {
  name: 'AbCountdown'
}
</script>
<script setup>
import { defineProps } from 'vue'
import VueCountdown from '@chenfengyuan/vue-countdown'
defineProps({
  time: {
    type: Number,
    default: 0
  },
  showDay: {
    type: Boolean,
    default: false
  }
})
</script>
<template>
  <VueCountdown
    v-slot="{ days, hours, minutes, seconds }"
    :time="time"
    class="abCountDown"
  >
    <span v-if="showDay">{{ days }}:</span>
    <span>{{ 10 > hours ? '0' + hours : hours }}:</span>
    <span>{{ 10 > minutes ? '0' + minutes : minutes }}:</span>
    <span>{{ 10 > seconds ? '0' + seconds : seconds }}</span>
  </VueCountdown>
</template>

<style lang="scss">
.abCountDown {
  display: flex;
  align-items: center;
}
</style>

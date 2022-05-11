<script setup>
import { storeToRefs } from 'pinia'
import { defineEmits, defineProps } from 'vue'
import { useTradeStore } from '@/store/modules/trade'
import AbDialog from '@/components/AbDialog'

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
const storeTrade = useTradeStore()
const { showActualDialog } = storeToRefs(storeTrade)
const emit = defineEmits(['confirm'])
const confirm = async () => {
  showActualDialog.value = false
  emit('confirm')
}
</script>

<template>
  <AbDialog
    v-model:show="showActualDialog"
    show-confirm-button
    confirm-button-text="我知道了"
    @confirm="confirm"
  >
    <div class="infoBox">
      <div class="infoItem">请注意：实际获得数额是根据顶到最终成交数量决定</div>
    </div>
  </AbDialog>
</template>

<style lang="scss" scoped>
.infoBox {
  padding: 0 20px;
}
.infoItem {
  color: var(--ab-main-text-color);
  font-size: 14px;
  text-align: left;
  font-weight: 500;
  margin-bottom: 8px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>

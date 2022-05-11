<script setup>
import { ref } from 'vue'
import AbDialog from '@/components/AbDialog.vue'
import AbCheckbox from '@/components/AbCheckbox.vue'
import { storeToRefs } from 'pinia'
import { useTradeStore } from '@/store/modules/trade'
const storeTrade = useTradeStore()
const { showOrderDownDialog } = storeToRefs(storeTrade)
const confirm = () => {
  showOrderDownDialog.value = false
}

const checked = ref(false)
</script>

<template>
  <AbDialog
    v-model:show="showOrderDownDialog"
    title="订单下架后，您仍需处理未完成的订单！"
    show-cancel-button
    show-confirm-button
    confirm-button-text="确认下架"
    @confirm="confirm"
  >
    <div class="infoBox">
      <div class="infoItem">1.仅会退还您挂单剩余DDB</div>
      <div class="infoItem">
        2.正在交易中的订单不会受下架的影响，交易不会关闭
      </div>
      <div class="infoItem">3.取消后，剩余货币不会马上退还给您；</div>
      <AbCheckbox v-model="checked" normal-text="我已知晓并同意"></AbCheckbox>
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

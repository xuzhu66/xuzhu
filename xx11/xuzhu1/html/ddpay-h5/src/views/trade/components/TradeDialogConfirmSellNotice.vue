<script setup>
import { storeToRefs } from 'pinia'
import { ref, defineEmits, defineProps } from 'vue'
import { useTradeStore } from '@/store/modules/trade'
import AbDialog from '@/components/AbDialog'
import AbCheckbox from '@/components/AbCheckbox'
import { Toast } from 'vant'

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
const storeTrade = useTradeStore()
const { showTradeSellNotice } = storeToRefs(storeTrade)
const checked = ref(false)
const emit = defineEmits(['confirm'])
const confirm = async () => {
  if (!checked.value) {
    Toast('请勾选"我已知晓并同意"')
    return
  }
  emit('confirm')
  // storeTrade.$patch((state) => {
  //   state.showTradeSellNotice = false
  //   state.showTradeSell = true
  // })
}
</script>

<template>
  <AbDialog
    v-model:show="showTradeSellNotice"
    closeable
    close-icon="close"
    title="挂单出售须知"
    show-cancel-button
    show-confirm-button
    :confirm-loading="loading"
    confirm-button-text="确认挂单出售"
    @confirm="confirm"
  >
    <div class="infoBox">
      <div class="infoItem">1.仅会退还您挂单剩余DDB</div>
      <div class="infoItem">
        2.正在交易中的订单不会受下架的影响，交易不会关闭
      </div>
      <div class="infoItem">3.取消后，剩余货币不会马上退还给您；</div>
      <AbCheckbox
        v-model:checked="checked"
        normal-text="我已知晓并同意"
        text-position="out"
      ></AbCheckbox>
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

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTradeStore } from '@/store/modules/trade'
import AbPopup from '@/components/AbPopup'
import UserAgreementContent from '@/views/static/userAgreementContent.vue'

const tradeStore = useTradeStore()
const { showUserTip, userTipTitle } = storeToRefs(tradeStore)

const confirm = (item) => {
  close()
}
const close = () => {
  showUserTip.value = false
}
const innerHeight = ref(window.innerHeight)
</script>

<template>
  <AbPopup
    v-model:show="showUserTip"
    closeable
    close-icon="close"
    close-icon-position="top-left"
    position="bottom"
    show-confirm-button
    confirm-button-text="我知道了"
    confirm-width="155px"
    button-layout="center"
    class="userTipsBox"
    @confirm="confirm"
    @close="close"
  >
    <div class="popBox" :style="{ height: innerHeight - 170 + 'px' }">
      <div class="tipsLayout">
        <div class="tipTitle">{{ userTipTitle }}</div>
        <div v-if="showUserTip" ref="tipContent" class="tipContent">
          <UserAgreementContent></UserAgreementContent>
        </div>
      </div>
    </div>
  </AbPopup>
</template>
<style lang="scss">
.userTipsBox {
  .abPopupContent {
    padding-bottom: 0;
  }
  .abPopupFooter {
    box-shadow: -10px -10px 10px rgba(216, 221, 240, 0.2);
  }
}
</style>
<style lang="scss" scoped>
.popBox {
  padding: 0 16px;
}
.tipsLayout {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.tipTitle {
  padding: 18px 0 14px;
  font-weight: bold;
  font-size: 20px;
  line-height: 27px;
  color: var(--ab-main-text-color);
}
.tipContent {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>

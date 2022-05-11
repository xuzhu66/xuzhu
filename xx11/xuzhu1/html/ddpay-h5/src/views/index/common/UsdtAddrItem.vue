<script setup>
import AbButton from '@/components/AbButton.vue'
import {
  defineProps,
  defineEmits
} from 'vue'
import { copyText } from '@/hooks/useQuery'

const props = defineProps({
  item: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const emit = defineEmits([
  'viewClick'
])

const viewClick = () => {
  emit('viewClick', props.item)
}
</script>
<template>
  <div class="usdtAddrItem">
    <div class="usdtTypeName">
      <span class="usdt">USDT</span>
      <span class="type">-{{ item.chain }}</span>
    </div>
    <div class="van-hairline--bottom lineMargin"></div>
    <div class="addrInfo flex-center-between">
      <div class="addrLeft">
        <div class="addr">{{ item.addr }}</div>
        <AbButton class="copyBtn" label="复制地址" @click="copyText(item.addr)"></AbButton>
      </div>
      <div class="addrRight" @click="viewClick">
        <div class="qrCode"></div>
        <div class="viewCode">点击查看</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.usdtAddrItem {
  padding: 13px 10px;
  margin-bottom: 14px;
  background: #FFFFFF;
  box-shadow: -10px -10px 10px rgba(216, 221, 240, 0.15), 10px 10px 10px rgba(216, 221, 240, 0.15);
  border-radius: 8px;

}
.lineMargin {
  height: 1px;
}
.usdtTypeName {
  margin-bottom: 13px;
  text-align: left;
  color: #000000;
  .usdt {
    font-weight: bold;
    font-size: 15px;
  }
  .type {
    font-weight: 500;
    font-size: 14px;
  }
}
.addrInfo {
  margin-top: 14px;
}
.copyBtn {
  width: auto;
  height: 26px;
  margin-top: 14px;
  background: #486BF6;
  border: 1px solid #486BF6;
  font-weight: 600;
  font-size: 12px;
}
.addrLeft {
  flex: 1;
}
.addr {
  text-align: left;
  font-weight: 500;
  font-size: 12px;
  color: var(--ab-main-text-color);
}
.qrCode {
  background-image: url('~@/assets/images/index/qr-code.png');
  width: 40px;
  height: 40px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.viewCode {
  font-weight: 500;
  font-size: 10px;
  color: #A1A0A0;
}
</style>

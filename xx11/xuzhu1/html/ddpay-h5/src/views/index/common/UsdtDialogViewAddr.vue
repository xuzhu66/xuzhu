<script setup>
import { storeToRefs } from 'pinia'
import AbPopup from '@/components/AbPopup'
import AbCellItem from '@/components/AbCellItem'
// import { pushWithQuery } from '@/hooks/useQuery'
import { useFundStore } from '@/store/modules/fund'
import { copyText, downloadFile } from '@/hooks/useQuery'
import QrcodeVue from 'qrcode.vue'

const fundStore = useFundStore()
const { showAddrDetail, dialogAddrItem } = storeToRefs(fundStore)
// const confirm = () => {
//   showTradeBuy.value = false
// }
const clickCancel = () => {
  // console.log('11')
  copyText(dialogAddrItem.value.addr)
  // storeTrade.$patch((state) => {
  //   state.showTradePaymentList = true
  // })
}
const confirm = () => {
  // storeTrade.$patch((state) => {
  //   state.showTradeBuy = false
  // })
  // pushWithQuery('TradeOrderMatching')
  // pushWithQuery('TradeOrderMatching')
  downloadFile('qrcode')
}

</script>

<template>
  <AbPopup
    v-model:show="showAddrDetail"
    position="bottom"
    show-cancel-button
    show-confirm-button
    cancel-style-type="blue"
    :cancel-is-close="false"
    cancel-button-text="复制地址"
    confirm-button-text="保存相册"
    @confirm="confirm"
    @cancel="clickCancel"
  >
    <template #title>
      <div class="titleBox">
        <div class="usdtTypeName flex-center-start">
          <div class="usdtLogo"></div>
          <span class="usdt">USDT</span>
          <span class="type">-{{ dialogAddrItem.chain }}收款地址</span>
        </div>
        <QrcodeVue id="qrcode" :value="dialogAddrItem.addr"></QrcodeVue>
        <AbCellItem :title="dialogAddrItem.addr" copy-title right-type="copy" black-title></AbCellItem>
        <div class="van-hairline--bottom"></div>
      </div>
    </template>
    <div class="popBox">
      <AbCellItem title="手续费" value="1.00 USDT"></AbCellItem>
      <div class="warningText">
        <div class="textItem">注意：</div>
        <div class="textItem">1.此地址只可接收USDT，请再次确认您选择的主网络是{{ dialogAddrItem.chain }}</div>
        <div class="textItem">2.实际到账的USDT数量根据市场汇率会有些许波动</div>
        <div class="textItem">3.最小充币数量:1 USDT</div>
      </div>
    </div>
  </AbPopup>
</template>

<style lang="scss" scoped>
.titleBox {
  padding: 0 16px;
}
.popBox {
  padding: 0 16px;
}
.warningText {
  margin-top: 5px;
  color: var(--ab-text-warning);
  font-weight: 500;
  font-size: 12px;
  text-align: left;
}
.limitText {
  margin-top: 7px;
  font-weight: 500;
  font-size: 12px;
  text-align: right;
}

.usdtLogo {
  background-image: url("~@/assets/images/index/usdt.png");
  width: 20px;
  height: 20px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 10px;
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
.warningText {
  margin-top: 20px;
  color: var(--ab-text-warning);
  font-weight: 500;
  font-size: 12px;
  text-align: left;
  .textItem {
    margin-bottom: 6px;
  }
}
</style>

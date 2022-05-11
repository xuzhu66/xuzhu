<script setup>
import { ref, defineProps } from 'vue'
import AbSteps from '@/components/AbSteps'
import AbStep from '@/components/AbStep'
import AbUploader from '@/components/AbUploader'
import AbCellItem from '@/components/AbCellItem.vue'

defineProps({
  tradeRole: {
    type: String,
    default: ''
  },
  orderDetail: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const fileList = ref([])
const afterRead = (file) => {
  console.log(file)
  fileList.value[0].status = 'done'
  fileList.value[0].message = '上传中...'
}
</script>

<template>
  <div>
    <AbSteps v-if="tradeRole == 10">
      <AbStep
        v-if="orderDetail.status >= 10"
        content="已为您成功匹配卖家，待卖家确认接单"
        time="2022/01/06 12:30:24"
      >
      </AbStep>
      <AbStep v-if="orderDetail.status >= 20">
        <div>
          <div>上传支付凭证方便卖家快速确认</div>
          <div>
            <AbUploader
              v-model="fileList"
              accept=".jpg,.jpeg,.png"
              :max-size="1024 * 100"
              :after-read="afterRead"
            ></AbUploader>
          </div>
        </div>
      </AbStep>
      <AbStep v-if="orderDetail.status >= 30" content="买家已付款，待卖家确认" time="2022/01/06 12:30:24">
      </AbStep>
      <AbStep content="卖家已放币，订单完成" time="2022/01/06 12:30:24">
      </AbStep>
      <AbStep :show-step-icon="false" :show-step-content="false"> </AbStep>
    </AbSteps>

    <AbSteps v-if="tradeRole == 20">
      <AbStep
        content="已为您匹配买家（张三里斯）"
        time="2022/01/06 12:30:24"
        show-other-content
      >
        <template #other>
          <div>买家（张三里斯）付款信息</div>
          <AbCellItem
            class="cellItem"
            title="收款方式"
            value="银行卡"
            right-type="copy"
          ></AbCellItem>
          <AbCellItem
            class="cellItem"
            title="收款户名"
            value="张三里斯"
            right-type="copy"
          ></AbCellItem>
          <AbCellItem
            class="cellItem"
            title="付款金额"
            value="1,500.00 DDB"
            right-type="copy"
          ></AbCellItem>
        </template>
      </AbStep>
      <AbStep content="买家已付款，待确认" time="2022/01/06 12:30:24"> </AbStep>
      <AbStep
        warning-text="友情提示：（实名：张三里斯）已标记付款，请确认付款信息是否一致，非同名卡交易，引起任何财产损失，请自行承担！"
        show-warning
      >
        <div>
          <div>上传支付凭证方便卖家快速确认</div>
          <div>
            <AbUploader
              v-model="fileList"
              accept=".jpg,.jpeg,.png"
              :max-size="1024 * 100"
              :after-read="afterRead"
            ></AbUploader>
          </div>
        </div>
      </AbStep>
      <AbStep content="您已放币，订单完成" time="2022/01/06 12:30:24"> </AbStep>
    </AbSteps>
  </div>
</template>

<style lang="scss" scoped></style>

<script setup>
import { computed, defineProps, ref } from 'vue'
import { storeToRefs } from 'pinia'
import AbBottomFixed from '@/components/AbBottomFixed.vue'
import AbOrderIconType from '@/components/AbOrderIconType'
import AbSteps from '@/components/AbSteps'
import AbStep from '@/components/AbStep'
import AbUploader from '@/components/AbUploader'
import AbDialog from '@/components/AbDialog'
import AbPopup from '@/components/AbPopup'
import { useTradeStore } from '@/store/modules/trade'
import { pushWithQuery } from '@/hooks/useQuery'
import { useOrderDetail } from '@/hooks/useOrderDetail'
import AbCheckbox from '@/components/AbCheckbox'
import { useCountDown, formatTime } from '@/hooks/useCountDown'
import AbCellItem from '@/components/AbCellItem.vue'
import { selectFilterName } from '@/utils/selectFilter'
import { useSelectStore } from '@/store/modules/select'
import md5 from 'js-md5'
import AbInput from '@/components/AbInput'
import { Toast } from 'vant'

const props = defineProps({
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
const tradeStore = useTradeStore()
const {
  checkedContinue,
  // 确认付款 输入密码弹层
  showBuyOrderPwd,
  buyOrderPwdLoading,
  // 确认放币
  showSellOrderConfirmRelease,
  safeCenter
} = storeToRefs(tradeStore)
const { fetchSellOrderConfirmRelease } = tradeStore

const selectStore = useSelectStore()
const { paymentClassList } = storeToRefs(selectStore)
// const route = useRoute()
// const query = route.query

const orderStatus = computed(() => {
  return props.orderDetail.status
})
const haveTime = computed(() => {
  if (props.orderDetail.status == 30) {
    return props.orderDetail.payCountdown
  } else if (props.orderDetail.status == 40) {
    return props.orderDetail.releaseCountdown
  } else {
    return 0
  }
  // releaseCountdown
})
const { state } = useCountDown(haveTime)
// const { state } = countDown(toRef(props.orderDetail, 'matchCountdown'))
const timeFormat = computed(() => {
  return formatTime(state.count)
})
const { label } = useOrderDetail(orderStatus, [], 'matchSell')
const fileList = computed(() => {
  if (props.orderDetail.payCertPics) {
    return [
      {
        url: props.orderDetail.payCertPics,
        message: ''
      }
    ]
  } else {
    return []
  }
})
const pwdType = ref('password')
const pwdTrade = ref('')
const googleCode = ref('')

// const paywayArr = paymentClassList
const payway = computed(() => {
  const name = selectFilterName(props.orderDetail.payway, paymentClassList, {
    key: 'payway',
    value: 'payName'
  })
  return name.value
  // return selectFilterName(props.orderDetail.payway, paymentClassList)
})
// const currentRate = ref(70)

const showConfirmRelease = () => {
  showSellOrderConfirmRelease.value = true
}
const showConfirmPwd = () => {
  if (!checkedContinue.value) {
    Toast('请勾选"我确认对方已付款"')
    return
  }
  showBuyOrderPwd.value = true
  console.log(safeCenter.value.enGoogleCode)
  // if (safeCenter.value.enGoogleCode) {
  //   showBuyOrderGoogleCode.value = true
  // } else {
  // }
}
const confirmTrans = async () => {
  const param = {
    tradeNo: props.orderDetail.tradeNo
    // tradePwd: md5(pwdTrade.value)
  }
  if (safeCenter.value.enGoogleCode === '1') {
    if (!googleCode.value) {
      Toast('请输入谷歌验证码')
      return
    }
    param.gcode = googleCode.value
  } else {
    if (!pwdTrade.value) {
      Toast('请输入交易密码')
      return
    }
    param.tradePwd = md5(pwdTrade.value)
  }
  fetchSellOrderConfirmRelease(param)
  // try {
  //   await
  // } finally {
  //   buyOrderPwdLoading.value = false
  //   showSellOrderConfirmRelease.value = false
  // }
}
const appeal = () => {
  pushWithQuery('TradeOrderAppeal', {
    type: 2,
    tradeNo: props.orderDetail.tradeNo
  })
}
</script>

<template>
  <div>
    <div class="matchingBox">
      <div class="orderTypeBox">
        <AbOrderIconType
          type="going"
          size="Mini"
          :top-label="label"
          :bottom-label="timeFormat"
          flex="between"
        ></AbOrderIconType>
      </div>
    </div>
    <AbSteps>
      <AbStep
        v-if="orderDetail.status >= 30"
        :content="`已为您匹配买家(${orderDetail.buyRealName})`"
        :time="orderDetail.confirmTime"
      >
      </AbStep>
      <AbStep v-if="orderDetail.status >= 30" :show-step-icon="false">
        <div>
          <div class="stepTitle">买家付款信息</div>
          <AbCellItem
            class="cellItem"
            title="付款方式"
            :value="payway"
          ></AbCellItem>
          <AbCellItem
            class="cellItem"
            title="付款人"
            :value="orderDetail.payAcctName"
            right-type="copy"
          ></AbCellItem>
          <AbCellItem
            class="cellItem"
            title="付款金额"
            :value="`¥${orderDetail.tradeAmount}`"
            right-type="copy"
          ></AbCellItem>
        </div>
      </AbStep>
      <AbStep
        v-if="orderDetail.status >= 40"
        :content="`买家(${orderDetail.buyRealName})已付款，请确认`"
        :time="orderDetail.payTime"
      >
      </AbStep>
      <AbStep
        v-if="orderDetail.status >= 40"
        :show-step-icon="false"
        :show-step-content="false"
        :show-warning="true"
        :warning-text="`友情提示：（实名：${orderDetail.buyRealName}）已标记付款，请确认付款信息是否一致，非同名卡交易，引起任何财产损失，请自行承担！`"
        :time="orderDetail.payTime"
      >
      </AbStep>
      <AbStep v-if="orderDetail.status >= 40" :show-step-icon="false">
        <div>
          <div>
            请核实账户尾号（{{
              orderDetail.payAcctNo.substr(-4, 4)
            }}）的凭证信息
          </div>
          <div>
            <AbUploader
              v-if="fileList.length > 0"
              v-model="fileList"
              accept=".jpg,.jpeg,.png"
              disabled
              :deletable="false"
            ></AbUploader>
          </div>
          <div class="abWarningText">请注意核实凭证金额与订单金额是否一致</div>
        </div>
      </AbStep>
      <!--      <AbStep-->
      <!--        v-if="orderDetail.status >= 40"-->
      <!--        content="买家已付款，待卖家确认"-->
      <!--        :time="orderDetail.payTime"-->
      <!--      >-->
      <!--      </AbStep>-->
      <AbStep :show-step-icon="false" :show-step-content="false"> </AbStep>
    </AbSteps>
    <!--    <AbBottomFixed-->
    <!--      v-if="orderDetail.status == 30"-->
    <!--      :show-confirm="false"-->
    <!--      appeal-text="交易申诉"-->
    <!--      show-appeal-->
    <!--      @appeal="appeal"-->
    <!--    ></AbBottomFixed>-->
    <AbBottomFixed
      v-if="orderDetail.status == 40"
      confirm-text="确认放币"
      :show-confirm="true"
      appeal-text="交易申诉"
      show-appeal
      @confirm="showConfirmRelease"
      @appeal="appeal"
    ></AbBottomFixed>
    <AbBottomFixed
      v-if="orderDetail.status == 100"
      confirm-text="好的"
      @confirm="goBack"
    ></AbBottomFixed>
    <AbDialog
      v-model:show="showSellOrderConfirmRelease"
      show-cancel-button
      show-confirm-button
      cancel-button-text="取消"
      confirm-button-text="确认放币"
      @confirm="showConfirmPwd"
    >
      <div class="infoBox">
        请再次确认您已收到款项，放币后，您的资产无法被追回！
        <AbCheckbox
          v-model:checked="checkedContinue"
          normal-text="我确认对方已付款"
          text-position="out"
        ></AbCheckbox>
      </div>
    </AbDialog>
    <AbPopup
      v-model:show="showBuyOrderPwd"
      :confirm-loading="buyOrderPwdLoading"
      :show-confirm-button="true"
      confirm-button-text="确认"
      @confirm="confirmTrans"
    >
      <div class="infoBox">
        <div v-if="safeCenter.enGoogleCode === '1'">
          <div>谷歌验证</div>
          <div>
            <AbInput
              v-model="googleCode"
              placeholder="请输入谷歌验证码"
            ></AbInput>
            <div class="van-hairline--bottom lineHeight"></div>
          </div>
        </div>
        <div v-else>
          <div>交易密码</div>
          <div>
            <AbInput
              v-model="pwdTrade"
              v-model:type="pwdType"
              show-eye
              placeholder="请输入交易密码"
            ></AbInput>
            <div class="van-hairline--bottom lineHeight"></div>
          </div>
        </div>
      </div>
    </AbPopup>
  </div>
</template>
<style lang="scss">
.fastPopup {
  .abPopupFooter {
    padding-left: 26px;
    padding-right: 26px;
  }
}
</style>
<style lang="scss" scoped>
.matchingBox {
  //padding: 0 10px;
  background: #ffffff;
  box-shadow: -10px -10px 10px rgba(216, 221, 240, 0.15),
    10px 10px 10px rgba(216, 221, 240, 0.15);
  border-radius: 8px;
  margin-bottom: 16px;
}
.orderTypeBox {
  padding: 7px 10px;
}
.infoBox {
  text-align: left;
  padding: 10px;
}
.infoBoxFast {
  text-align: left;
  padding: 0px 26px 10px;
}
.stepTitle {
  font-weight: 500;
  font-size: 14px;
}
.linePadding {
  height: 1px;
}
.fastZan {
  width: 15px;
  height: 14px;
  background-image: url('~@/assets/images/trade/fastZan.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.fastTop {
  .fastZanWord {
    margin-left: 7px;
    font-weight: 600;
    font-size: 14px;
  }
  .amount {
    margin-top: 15px;
    font-weight: bold;
    font-size: 30px;
    color: var(--ab-text-warning);
  }
}
.fastRemark {
  margin-bottom: 13px;
  font-weight: 500;
  font-size: 12px;
  color: var(--ab-main-gray-text-color);
}
.cellBox {
  margin-top: 10px;
  margin-bottom: 10px;
}
.tips {
  margin-top: 5px;
  font-weight: 500;
  font-size: 12px;
  color: var(--ab-text-warning);
}
</style>

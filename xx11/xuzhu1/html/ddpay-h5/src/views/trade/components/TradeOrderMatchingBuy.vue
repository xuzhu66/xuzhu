<script setup>
import { computed, watch, defineProps, ref } from 'vue'
import { storeToRefs } from 'pinia'
import AbBottomFixed from '@/components/AbBottomFixed.vue'
import AbOrderIconType from '@/components/AbOrderIconType'
import AbSteps from '@/components/AbSteps'
import AbStep from '@/components/AbStep'
import AbUploader from '@/components/AbUploader'
import AbDialog from '@/components/AbDialog'
import AbPopup from '@/components/AbPopup'
import { useTradeStore } from '@/store/modules/trade'
import { pushWithQuery, goBack } from '@/hooks/useQuery'
import { useOrderDetail } from '@/hooks/useOrderDetail'
import AbCheckbox from '@/components/AbCheckbox'
import { useCountDown } from '@/hooks/useCountDown'
import AbCellItem from '@/components/AbCellItem.vue'
import { selectFilterName } from '@/utils/selectFilter'
import AbCircle from '@/components/AbCircle'
import { useSelectStore } from '@/store/modules/select'
import md5 from 'js-md5'
import AbInput from '@/components/AbInput'
import { uploadApi } from '@/api/center'
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
  // orderMatchLoadingConfirm,
  showOrderCancelBuyDialog,
  showBuyAskMatchContinue,
  checkedContinue,
  askMatchCancelLoading,
  askMatchConfirmLoading,
  buyOrderCancelLoading,
  showBuyOrderFast,
  buyFastLoadingCancel,
  buyFastLoadingConfirm,
  showBuyOrderRematch,
  buyRematchLoadingCancel,
  buyRematchLoadingConfirm,
  // 确认付款 输入密码弹层
  showBuyOrderPwd,
  buyOrderPwdLoading,
  safeCenter
} = storeToRefs(tradeStore)
const {
  fetchBuyOrderCancel,
  fetchBuyOrderRematch,
  fetchBuyOrderMatchContinue,
  fetchBuyOrderMatchSnapUp,
  fetchBuyOrderMatchConfirmPay
} = tradeStore

const selectStore = useSelectStore()
const { paymentClassList } = storeToRefs(selectStore)
// const route = useRoute()
// const query = route.query

const orderStatus = computed(() => {
  return props.orderDetail.status
})
const haveTime = computed(() => {
  if (props.orderDetail.status == 10) {
    return props.orderDetail.matchCountdown
  } else if (props.orderDetail.status == 20) {
    return props.orderDetail.confirmCountdown
  } else if (props.orderDetail.status == 30) {
    return props.orderDetail.payCountdown
  } else if (props.orderDetail.status == 40) {
    return props.orderDetail.releaseCountdown
  } else {
    return 0
  }
  // releaseCountdown
})
const { state, hms } = useCountDown(haveTime)
// const { state } = countDown(toRef(props.orderDetail, 'matchCountdown'))
// watch(haveTime, (t) => {
//   console.log(t)
//   start()
// })

const { label } = useOrderDetail(orderStatus, [], 'match')
const fileList = ref([])
const fileListDisabled = computed(() => {
  if (props.orderDetail.payCertPics) {
    return [
      {
        url: props.orderDetail.payCertPics
      }
    ]
  } else {
    return []
  }
})
const pwdType = ref('password')
const pwdTrade = ref('')
const googleCode = ref('')

const afterRead = async (file) => {
  file.status = 'uploading'
  file.message = '上传中...'
  const formData = new FormData()
  formData.append('file', file.file)
  try {
    const res = await uploadApi(formData)
    if (res.success) {
      file.status = ''
      file.message = ''
      fileList.value[0].url = res.data.link
    }
    // link: "/oss/ddpay-app/upload/20220224/13f5d5795850afc4a480e30721c8dd14.png"
    // originalName: "87913b71b5aa343fc7e24a434d6f3d51.png"
  } catch (e) {
    // console.log(e)
    fileList.value = []
  }
}
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
const showConfirmPwd = () => {
  showBuyOrderPwd.value = true
  // if (fileList.value && fileList.value.length > 0) {
  //   showBuyOrderPwd.value = true
  // } else {
  //   Toast('请上传支付凭证')
  // }
}
const confirmTrans = async () => {
  // pushWithQuery('TradeMyOrderDetail')
  let picUrl
  if (fileList.value && fileList.value.length > 0) {
    if (fileList.value[0].status === 'done') {
      picUrl = fileList.value[0].url
    }
  }
  const param = {
    buyNo: props.orderDetail.buyNo,
    payCertPics: picUrl
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
  fetchBuyOrderMatchConfirmPay(param)
}
const appeal = () => {
  pushWithQuery('TradeOrderAppeal', {
    type: 1,
    buyNo: props.orderDetail.buyNo
  })
}
// 取消匹配
const startCancel = () => {
  showOrderCancelBuyDialog.value = true
}
const confirmCancel = () => {
  fetchBuyOrderCancel({
    buyNo: props.orderDetail.buyNo
  })
}
const closeOrderCancel = () => {
  showOrderCancelBuyDialog.value = false
}
// 询问是否继续匹配
const cancelAskMatch = async () => {
  askMatchCancelLoading.value = true
  fetchBuyOrderCancel({
    buyNo: props.orderDetail.buyNo
  })
  askMatchCancelLoading.value = false
}
const continueAskMatch = async () => {
  askMatchConfirmLoading.value = true
  await fetchBuyOrderMatchContinue({
    buyNo: props.orderDetail.buyNo,
    check: checkedContinue.value
  })
  askMatchConfirmLoading.value = false
}

// 重新匹配
// const startRematch = () => {
//   fetchBuyOrderRematch({
//     buyNo: props.orderDetail.buyNo
//   })
// }
const cancelRematch = async () => {
  buyRematchLoadingCancel.value = true
  await fetchBuyOrderCancel({
    buyNo: props.orderDetail.buyNo
  })
  buyRematchLoadingCancel.value = false
}
const continueRematch = async () => {
  buyRematchLoadingConfirm.value = true
  await fetchBuyOrderRematch({
    buyNo: props.orderDetail.buyNo,
    check: checkedContinue.value
  })
  buyRematchLoadingConfirm.value = false
}
// 快速成交 确定
const cancelFast = async () => {
  buyFastLoadingCancel.value = true
  await fetchBuyOrderRematch({
    buyNo: props.orderDetail.buyNo
  })
  buyFastLoadingCancel.value = false
}
const continueFast = async () => {
  buyFastLoadingConfirm.value = true
  await fetchBuyOrderMatchSnapUp({
    buyNo: props.orderDetail.buyNo,
    check: checkedContinue.value
  })
  buyFastLoadingConfirm.value = false
}
// 已完成
watch(
  state,
  (t) => {
    // console.log(t)
    if (t.count == 0 && orderStatus.value == 10) {
      showBuyAskMatchContinue.value = true
    }
  },
  { deep: true }
)
</script>

<template>
  <div>
    <div class="matchingBox">
      <div class="orderTypeBox">
        <AbOrderIconType
          type="going"
          size="Mini"
          :top-label="label"
          :bottom-label="hms"
          flex="between"
        ></AbOrderIconType>
      </div>
    </div>
    <AbSteps>
      <AbStep
        v-if="orderDetail.status >= 30"
        :content="`卖家(${orderDetail.sellRealName})已确认接单`"
        :time="orderDetail.confirmTime"
      >
      </AbStep>
      <AbStep v-if="orderDetail.status >= 30" :show-step-icon="false">
        <div>
          <div class="stepTitle">卖家收款信息</div>
          <AbCellItem
            class="cellItem"
            title="收款方式"
            :value="payway"
          ></AbCellItem>
          <AbCellItem
            class="cellItem"
            title="收款人"
            :value="orderDetail.recAcctName"
            right-type="copy"
          ></AbCellItem>
          <AbCellItem
            class="cellItem"
            title="银行卡号"
            :value="orderDetail.recAcctNo"
            right-type="copy"
          ></AbCellItem>
          <AbCellItem
            class="cellItem"
            title="付款金额"
            :value="`¥${orderDetail.tradeAmount}`"
            right-type="copy"
          ></AbCellItem>
          <AbCellItem
            class="cellItem"
            title="收款银行"
            :value="orderDetail.recBankName"
          ></AbCellItem>
        </div>
      </AbStep>
      <AbStep v-if="orderDetail.status >= 30" :show-step-icon="false">
        <div>
          <div>上传支付凭证方便卖家快速确认</div>
          <div>
            <AbUploader
              v-if="orderDetail.status <= 30"
              v-model="fileList"
              accept=".jpg,.jpeg,.png"
              :after-read="afterRead"
              deletable
            ></AbUploader>
            <AbUploader
              v-if="orderDetail.status > 30 && fileListDisabled.length > 0"
              v-model="fileListDisabled"
              accept=".jpg,.jpeg,.png"
              disabled
              :deletable="false"
            ></AbUploader>
          </div>
        </div>
      </AbStep>
      <AbStep
        v-if="orderDetail.status >= 40"
        content="买家已付款，待卖家确认"
        :time="orderDetail.payTime"
      >
      </AbStep>
      <AbStep
        v-if="orderDetail.status >= 100"
        content="卖家已放币，订单完成"
        :time="orderDetail.releaseTime"
      >
      </AbStep>
      <AbStep :show-step-icon="false" :show-step-content="false"> </AbStep>
    </AbSteps>

    <AbBottomFixed
      v-if="orderDetail.status == 10"
      :show-confirm="false"
      show-appeal
      appeal-text="取消匹配"
      appeal-color="gray"
      @appeal="startCancel"
    ></AbBottomFixed>
    <!--    <AbBottomFixed-->
    <!--      v-if="orderDetail.status == 10 && orderDetail.matchCountdown == 0"-->
    <!--      :loading="orderMatchLoadingConfirm"-->
    <!--      confirm-text="重新匹配"-->
    <!--      @confirm="startRematch"-->
    <!--    ></AbBottomFixed>-->
    <AbBottomFixed
      v-if="orderDetail.status == 30"
      confirm-text="确认付款"
      @confirm="showConfirmPwd"
    ></AbBottomFixed>
    <AbBottomFixed
      v-if="orderDetail.status == 40"
      :show-confirm="false"
      appeal-text="交易申诉"
      show-appeal
      @appeal="appeal"
    ></AbBottomFixed>
    <AbBottomFixed
      v-if="orderDetail.status == 100"
      confirm-text="好的"
      @confirm="goBack"
    ></AbBottomFixed>

    <AbDialog
      v-model:show="showOrderCancelBuyDialog"
      :cancel-is-close="false"
      show-cancel-button
      show-confirm-button
      :cancel-loading="buyOrderCancelLoading"
      cancel-button-text="取消匹配"
      confirm-button-text="我再想想"
      @confirm="closeOrderCancel"
      @cancel="confirmCancel"
    >
      <div class="infoBox">取消后不在匹配，连续多次取消，会影响交易</div>
    </AbDialog>
    <AbDialog
      v-model:show="showBuyAskMatchContinue"
      :cancel-loading="askMatchCancelLoading"
      :confirm-loading="askMatchConfirmLoading"
      :cancel-is-close="false"
      show-cancel-button
      show-confirm-button
      cancel-button-text="取消匹配"
      confirm-button-text="继续匹配"
      @cancel="cancelAskMatch"
      @confirm="continueAskMatch"
    >
      <div class="infoBox">
        <div>当前未匹配到合适的卖家，是否继续等待或调整金额。</div>
        <AbCheckbox
          v-model:checked="checkedContinue"
          normal-text="选中后不再提醒，直到成功匹配"
          text-position="out"
        ></AbCheckbox>
      </div>
    </AbDialog>
    <AbDialog
      v-model:show="showBuyOrderRematch"
      :cancel-loading="buyRematchLoadingCancel"
      :confirm-loading="buyRematchLoadingConfirm"
      :cancel-is-close="false"
      show-cancel-button
      show-confirm-button
      cancel-button-text="取消匹配"
      confirm-button-text="重新匹配"
      @cancel="cancelRematch"
      @confirm="continueRematch"
    >
      <div class="infoBox">
        <div>当前未匹配到合适的卖家，是否重新匹配</div>
      </div>
    </AbDialog>
    <AbPopup
      v-model:show="showBuyOrderFast"
      :cancel-loading="buyFastLoadingCancel"
      :confirm-loading="buyFastLoadingConfirm"
      :cancel-is-close="false"
      show-cancel-button
      show-confirm-button
      cancel-button-text="取消"
      confirm-button-text="立即抢购"
      cancel-background="white"
      cancel-width="100px"
      confirm-background="going"
      class="fastPopup"
      @cancel="cancelFast"
      @confirm="continueFast"
    >
      <div class="infoBoxFast">
        <div class="flex-center-between">
          <div class="fastTop flex-column flex">
            <div class="flex-center-start">
              <div class="fastZan"></div>
              <div class="fastZanWord">急速成交</div>
            </div>
            <div class="amount">¥ {{ orderDetail.tradeAmount }}</div>
          </div>
          <div>
            <AbCircle
              v-model:current-rate="state.count"
              :text="hms"
              :rate="haveTime"
              :speed="1000"
            >
            </AbCircle>
          </div>
        </div>
        <div class="fastRemark">为您推荐快速成交金额，无需等待直接下单</div>
        <div class="van-hairline--bottom linePadding lineSpace2"></div>
        <div class="cellBox">
          <AbCellItem
            class="cellItem"
            title="单价"
            :value="`¥${orderDetail.price} / DDB`"
          ></AbCellItem>
          <AbCellItem
            class="cellItem"
            title="可得"
            :value="`${orderDetail.availableAmt} DDB`"
          ></AbCellItem>
        </div>
        <div class="van-hairline--bottom linePadding"></div>
        <div class="tips">
          注意：选择后会以当前订单金额成交，请注意转账时填写的金额是否准确，如金额不同，卖家有权取消订单！
        </div>
      </div>
    </AbPopup>
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

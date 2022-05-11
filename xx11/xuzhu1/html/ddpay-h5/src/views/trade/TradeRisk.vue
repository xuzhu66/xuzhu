<script>
export default {
  name: 'TradeRisk'
}
</script>
<script setup>
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import AbNavBar from '@/components/AbNavBar'
import AbInput from '@/components/AbInput'
import AbBottomFixed from '@/components/AbBottomFixed.vue'
import AbUploader from '@/components/AbUploader'
import AbCellItem from '@/components/AbCellItem'
// import { useRoute } from 'vue-router'
import { useTradeStore } from '@/store/modules/trade'
import { uploadApi } from '@/api/center'
import { Toast } from 'vant'
import AbScrollLayout from '@/components/AbScrollLayout'
import { getUserInfoApi } from '@/api/center'

const tradeStore = useTradeStore()
const { riskUploadLoadingConfirm } = storeToRefs(tradeStore)
const { fetchRiskUpload } = tradeStore

// const route = useRoute()
// const query = route.query
const fileList = ref([])
const remark = ref('')
const userInfo = reactive({
  uid: '',
  realName: ''
})

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
      // fileList.value[0].url = res.data.link
      file.url = res.data.link
    }
    // link: "/oss/ddpay-app/upload/20220224/13f5d5795850afc4a480e30721c8dd14.png"
    // originalName: "87913b71b5aa343fc7e24a434d6f3d51.png"
  } catch (e) {
    // console.log(e)
    // fileList.value = []
  }
  const successArr = fileList.value.filter((item) => {
    return !item.status
  })
  fileList.value = successArr
  console.log(fileList)
}
const checkInput = () => {
  if (!remark.value || remark.value.length != 4) {
    Toast('请输入银行卡后4位')
    return false
  }
  if (!fileList.value || fileList.value.length === 0) {
    Toast('请上传截图')
    return false
  }

  return true
}
const confirm = () => {
  if (!checkInput()) return
  const list = fileList.value.map((item) => {
    return item.url
  })
  const param = {
    userUid: userInfo.uid,
    accNo: remark.value,
    eventMethod: 'provideDetails',
    voucherUrl: list.join(',')
  }
  fetchRiskUpload(param)
}
getUserInfoApi().then((res) => {
  userInfo.realName = res.data.realName
  userInfo.uid = res.data.uid
})
</script>

<template>
  <AbScrollLayout :bottom-height="140">
    <div class="TradeOrderAppeal">
      <AbNavBar title="安全审核"></AbNavBar>
      <div class="detailContentBox">
        <div class="bgfff topt">
          <div class="warningText">
            近期出现用户银行账户被冻结情况，请配合完成审核！
          </div>
          <div class="smallText">
            为了保障交易双方的权益及交易通畅，请您配合完成安全审核，完成后可继续交易。
          </div>
        </div>
        <div class="bigLine"></div>
        <div class="bgfff scon">
          <AbCellItem
            class="cellItem"
            title="付款方式"
            value="银行卡"
          ></AbCellItem>
          <div class="van-hairline--bottom"></div>
          <AbCellItem
            class="cellItem"
            title="付款人"
            :value="userInfo.realName"
          ></AbCellItem>
          <div class="van-hairline--bottom"></div>
          <div class="inputLabelBox cellItem">
            <div class="inputLabel">银行卡</div>
            <AbInput
              v-model="remark"
              class="abInput"
              placeholder="请输入银行卡后4位"
              type="digit"
              :is-full="false"
              :maxlength="4"
            ></AbInput>
          </div>
          <div class="van-hairline--bottom"></div>
          <div class="appealLabel uploadTitle">
            <div>上传付款银行卡近3天流水截图</div>
          </div>
          <div>
            <div class="smallText">
              *截图中需要带有
              <span class="red">交易方姓名</span>
              的流水记录截图和个人中心余额且带银行卡尾号截图
            </div>
            <div class="smallText">
              <span>*为了保证交易可以顺利进行，请务必上传</span>
              <span class="red">实时最新截图</span>。
            </div>
          </div>
          <div class="lineMargin">
            <div class="van-hairline--bottom"></div>
          </div>
          <div class="uploadBox">
            <AbUploader
              v-model="fileList"
              accept="*"
              :after-read="afterRead"
              :max-count="10"
            ></AbUploader>
          </div>
        </div>
        <div class="bigLine"></div>
        <div class="abBottomFixedTopText">
          请注意：请务必使用以上银行卡转账，如使用其他银行卡进行转账，卖方有权不予放币，
          对此造成的任何形式财产损失及产生的其他问题或纠纷，平台一概不予处理，请慎重！
        </div>
        <div class="bigLine"></div>
      </div>

      <AbBottomFixed
        confirm-text="提交审核"
        :loading="riskUploadLoadingConfirm"
        @confirm="confirm"
      >
      </AbBottomFixed>
    </div>
  </AbScrollLayout>
</template>

<style lang="scss" scoped>
.TradeOrderAppeal {
  padding-top: 46px;
  padding-bottom: 70px;
  //height: 100%;
  text-align: left;
  //background-color: var(--ab-page-container-background-color);
}
.bgfff {
  background-color: var(--ab-main-content-background-color);
}
.detailContentBox {
  //min-height: calc(100% - 160px);
  //height: 100%;
  //margin: 15px 0 0;
  padding: 0 10px 20px;
}
.topt {
  padding: 20px 0 20px;
}
.appealLabel {
  display: flex;
  align-items: flex-end;
  //margin-bottom: 13px;
  font-weight: 600;
  font-size: 14px;
  color: var(--ab-main-text-color);
  text-align: left;
}
.warningText {
  font-weight: 500;
  font-size: 12px;
  color: var(--ab-text-warning);
}

.smallText {
  text-align: left;
  font-weight: 500;
  font-size: 12px;
  color: #a1a0a0;
  margin-top: 8px;
}
.red {
  color: red;
}
.bigLine {
  background: #fbfcff;
  height: 10px;
}

.abBottomFixedTopText {
  padding: 10px 0;
  margin-bottom: 10px;
  font-weight: 500;
  font-size: 12px;
  color: #a1a0a0;
  text-align: justify;
  background-color: var(--ab-main-content-background-color);
}
.scon {
  padding: 10px;
}
.cellItem {
  //padding: 20px 0;
  height: 60px;
}
.inputLabelBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  //padding: 10px 0;
  //margin-bottom: 30px;
  .inputLabel {
    font-weight: 600;
    font-size: 14px;
    color: var(--ab-main-gray-text-color);
    flex: 1;
  }
  .abInput {
    width: 200px;
    :deep(input) {
      text-align: right;
    }
  }
}
.uploadTitle {
  margin-top: 30px;
}
.uploadBox {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
}
.lineMargin {
  height: 1px;
  margin: 9px 0 0;
}
</style>

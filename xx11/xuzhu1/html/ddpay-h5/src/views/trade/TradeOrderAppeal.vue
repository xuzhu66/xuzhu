<script>
export default {
  name: 'TradeOrderAppeal'
}
</script>
<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import AbNavBar from '@/components/AbNavBar'
import AbInput from '@/components/AbInput'
import AbBottomFixed from '@/components/AbBottomFixed.vue'
import AbBoxChange from '@/components/AbBoxChange.vue'
import AbUploader from '@/components/AbUploader'
import { useRoute } from 'vue-router'
import { useTradeStore } from '@/store/modules/trade'
import { uploadApi } from '@/api/center'
import { Toast } from 'vant'
import { useSelectStore } from '@/store/modules/select'
import AbScrollLayout from '@/components/AbScrollLayout'

const tradeStore = useTradeStore()
const { appealOrderLoadingConfirm } = storeToRefs(tradeStore)
const { fetchBuyOrderAppeal, fetchSellOrderAppeal } = tradeStore

const selectStore = useSelectStore()
const { dictionariesAction } = selectStore
const { dictionary } = storeToRefs(selectStore)

const route = useRoute()
const query = route.query
const active = ref('')
const remark = ref('')
const listQuestion = computed(() => {
  return query.type == 1
    ? dictionary.value['BUY_APPEAL_CATEGORY']
    : dictionary.value['SELL_APPEAL_CATEGORY']
})
const fileList = ref([])

const afterRead = async (file) => {
  console.log(file)
  file.status = 'uploading'
  file.message = '上传中...'
  const formData = new FormData()
  formData.append('file', file.file)
  try {
    const res = await uploadApi(formData)
    if (res.success) {
      file.status = ''
      file.message = ''
      file.url = res.data.link
      // fileList.value[0].url = res.data.link
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
  if (!active.value) {
    Toast('请选择申诉事由')
    return false
  }
  if (!remark.value.trim()) {
    Toast('请输入详细描述')
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
  const param = {
    category: active.value,
    remark: remark.value,
    certPics: fileList.value.map((item) => {
      return item.url
    })
  }
  // console.log(param)
  if (query.type == 1) {
    param.buyNo = query.buyNo
    fetchBuyOrderAppeal(param)
  } else if (query.type == 2) {
    param.tradeNo = query.tradeNo
    fetchSellOrderAppeal(param)
  }
}
dictionariesAction({
  codes: ['BUY_APPEAL_CATEGORY', 'SELL_APPEAL_CATEGORY']
}).then(() => {
  // active.value = listQuestion.value
})
</script>

<template>
  <AbScrollLayout>
    <div class="TradeOrderAppeal">
      <AbNavBar title="交易申诉"></AbNavBar>
      <div class="detailContentBox">
        <div class="appealLabel">请选择申诉事由</div>
        <AbBoxChange
          v-model="active"
          class="selectBox"
          :list="listQuestion"
        ></AbBoxChange>
        <div class="appealLabel">请描述您碰到的问题</div>
        <div class="remarkBox">
          <AbInput
            v-model:modelValue="remark"
            placeholder="请详细描述您碰到的问题并留下您的联系方式..."
            type="textarea"
            is-full
            :clearable="false"
          ></AbInput>
        </div>
        <div class="selectBox"></div>
        <div class="appealLabel">
          <div>上传截图</div>
          <div class="smallRemark">方便客服快速确认</div>
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

      <AbBottomFixed
        confirm-text="提交"
        :loading="appealOrderLoadingConfirm"
        @confirm="confirm"
      ></AbBottomFixed>
    </div>
  </AbScrollLayout>
</template>

<style lang="scss" scoped>
.TradeOrderAppeal {
  padding-top: 46px;
  padding-bottom: 70px;
  height: 100%;
  //background-color: var(--ab-page-container-background-color);
}
.detailContentBox {
  //min-height: calc(100% - 160px);
  height: 100%;
  margin: 15px 0 0;
  padding: 20px 10px;
  background-color: var(--ab-main-content-background-color);
}
.appealLabel {
  display: flex;
  align-items: flex-end;
  //margin-bottom: 13px;
  font-weight: 600;
  font-size: 14px;
  color: var(--ab-main-text-color);
  text-align: left;

  .smallRemark {
    margin-left: 7px;
    font-weight: 500;
    font-size: 10px;
    color: #a1a0a0;
  }
}
.selectBox {
  margin-top: 20px;
  margin-bottom: 35px;
}
.remarkBox {
  //width: 343px;
  height: 180px;
  margin-top: 13px;
  margin-bottom: 35px;
  background: #f6f7fd;
  border-radius: 8px;
  .van-cell {
    background: #f6f7fd;
  }
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

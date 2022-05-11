<template lang="pug">
.page-con
  .goback
    .left-icon(@click="goBack")
  .common-title 分享邀请
  .page-flow
    .title 邀请您的朋友一起来DDB
    .qr-con(v-if="sharObj.url")
      comQrcode(:codeurl="sharObj.url",:clasz="'promot'")
      .promote-no 您的推广码：
      .pro-con
        .num 9423
        .copy(@click="copyText(sharObj.inviteCode)")
    .save-btn(v-if="sharObj.url" @click="download" ) 保存至相册

//粘贴板
.clipboard-con(:data-clipboard-text="copyValue")
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import centerHeader from '@/views/mine/centerHeader'
import { useRouter } from 'vue-router'
import Clipboard from 'clipboard'
import comQrcode from '@/components/comQrcode'
import { useCenterStore } from '@/store/modules/center'
export default defineComponent({
  name: 'Message',
  components: {
    centerHeader,
    comQrcode
  },
  setup() {
    const router = useRouter()
    const centerStore = useCenterStore()
    const getShareAction = (param) => centerStore.getShareAction(param)
    const state = reactive({
      copyValue: '', // 复制
      url: 'www.baidu.com',
      sharObj: '' // 分享对象
    })

    const jumpPage = (path) => {
      router.push({
        path: path
      })
    }

    const goBack = () => {
      router.push({ path: '/mine/center' })
    }
    const initClipboard = () => {
      // 初始化黏贴版
      const btnCopy = new Clipboard('.clipboard-con')
      btnCopy.on('success', e => {
        // this.$message.success(`复制成功`)
        e.clearSelection()
      })
    }
    // 复制内容
    const copyText = (text) => {
      state.copyValue = text
      setTimeout(() => {
        document.getElementsByClassName('clipboard-con')[0].click()
      }, 300)
    }
    // 下载图片
    const downloadImg = (url, name) => {
      let canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = function() {
        canvas.height = img.height
        canvas.width = img.width
        ctx.drawImage(img, 0, 0)
        const dataURL = canvas.toDataURL('image/png')
        const a = document.createElement('a')
        a.href = dataURL
        a.download = name
        document.body.appendChild(a)
        a.click()
        setTimeout(() => {
          document.body.removeChild(a)
          canvas = null
        }, 1000)
      }
      img.src = url
    }
    const download = () => {
      const url = document.querySelector('.qrcode.promot img').src
      downloadImg(url, 'promoteImg')
    }
    onMounted(() => {
      initClipboard()
      getShareAction().then(res => {
        state.sharObj = res
      })
    })
    return {
      ...toRefs(state),
      jumpPage,
      goBack,
      copyText,
      downloadImg,
      download
    }
  }

})
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/center.scss";

.clipboard-con{
  display: none;
}
// 页面样式
.page-con {
  height: 100vh;
  background: linear-gradient(167.96deg, #50B1A9 0%, #0E52D7 100%);
  .goback{
    position: relative;
    height: 45px;
    .left-icon{
      background: url("~@/assets/images/center/rightjt.png") center/contain no-repeat;
      width: 9px;
      height: 16px;
      transform: rotate(180deg) ;
      margin-right: 10px;
      position: absolute;
      left: 10px;
      top: 22px;
    }
  }
  .common-title{
    color: #FFFFFF;
    font-size: 20px;
    font-weight: 600;
    text-align: left;
    padding-left: 10px;
    margin-bottom: 20px;
    padding-top: 20px;
  }

  .page-flow {
    background: rgba(246, 247, 253, 0.7);
    width: 323px;
    margin: 0 auto;
    padding-bottom: 30px;
    border-radius: 16px;
    .title{
      padding-top: 20px;
      color: #333333;
      font-size: 14px;
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .qr-con{
      margin: 20px auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .promot{
        margin: 10px;
      }
      .promote-no{
        color: #333333;
        font-size: 14px;
        font-weight: 500;
      }
      .pro-con{
        width: 176px;
        height: 45px;
        line-height: 45px;
        left: 100px;
        top: 509px;
        border: 1px solid #E1E7FF;
        box-sizing: border-box;
        border-radius: 30px;
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        .num{
          flex: 1;
        }
        .copy{
          flex: none;
          background: url("~@/assets/images/center/copy.png") center /contain no-repeat;
          width: 16px;
          height: 19px;
          margin-right: 10px;
        }
      }
    }
    .save-btn{
      width: 290px;
      height: 45px;
      line-height: 45px;
      background: #486BF6;
      border-radius: 8px;
      margin: 30px auto;
      color: #ffffff;
    }

  }
}
</style>

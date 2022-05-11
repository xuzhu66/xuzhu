<template lang="pug">
.page-con
  centerHeader(@goBack="goBack")
  .common-title 谷歌验证
  .page-flow
    .title 1.确保已安装谷歌身份验证APP（Google Authenticayor）
    .title 2.请备份一下32位秘钥，并保存在安全的地方，在手机丢失/谷歌验证器被卸载的情况下，可以通过此秘钥恢复
    .qr-con(v-if="googleObj.key")
      comQrcode(:codeurl="googleObj.key",:clasz="'promot'")
      .promote-no {{googleObj.key}}
    .save-btn(@click="copyText(googleObj.key)") 复制密钥
    .footer-con
      .submit-btn(@click="jumpPage('/mine/googleCode')") 下一步
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
import { Toast } from 'vant'
export default defineComponent({
  name: 'Google',
  components: {
    centerHeader,
    comQrcode
  },
  setup() {
    const router = useRouter()
    const centerStore = useCenterStore()
    const getGoogleKeyAction = () => centerStore.getGoogleKeyAction()
    const state = reactive({
      copyValue: '', // 复制
      googleObj: {
        key: '',
        qrCode: '',
        type: '',
        tel: '',
        email: ''
      }
    })

    const jumpPage = (path) => {
      router.push({
        path: path
      })
    }

    const goBack = () => {
      router.push({ path: '/mine/safeCenter' })
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
        Toast('复制成功！')
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
    const getKeyFun = () => {
      getGoogleKeyAction().then(res => {
        state.googleObj = res
      })
    }
    onMounted(() => {
      initClipboard()
      getKeyFun()
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
  padding-top: 50px;
  //background: linear-gradient(167.96deg, #50B1A9 0%, #0E52D7 100%);
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
    color: #333333;
    font-size: 20px;
    font-weight: 600;
    text-align: left;
    padding-left: 10px;
    margin-bottom: 20px;
    padding-top: 20px;
  }

  .page-flow {
    background:#FFFFFF;
    width: 323px;
    margin: 0 auto;
    padding-bottom: 30px;
    border-radius: 16px;
    padding-top: 20px;
    .title{
      color: #333333;
      font-size: 13px;
      text-align: left;
      padding: 10px;
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
      margin: 30px auto;
      width: 90px;
      height: 30px;
      left: 143px;
      top: 608px;
      border: 1px solid #486BF6;
      box-sizing: border-box;
      border-radius: 8px;
      font-size: 12px;
      line-height: 30px;
      color: #486BF6;
    }
    .footer-con{
      position: fixed;
      width: 100%;
      height: 80px;
      left: 0px;
      bottom: 0px;
      background: #FFFFFF;
      .submit-btn{
        width: 323px;
        height: 45px;
        line-height: 45px;
        background: #486BF6;
        border-radius: 8px;
        color: #FFFFFF;
        text-align: center;
        margin: 15px auto;
      }
    }
  }
}
</style>

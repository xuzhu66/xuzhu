<template lang="pug">
.page-con
  centerHeader(@goBack="goBack")
  .common-title 设置防钓鱼码
  .common-tip *请输入4-20位英文，数字或者特殊字符
  .page-flow
    .info-con
      .item
        van-cell-group
          van-field(v-model='fishCode'  label='' placeholder='请输入防钓鱼码' maxlength=30 border=false label-width="60")

      .submit-btn(@click="fishCodeFun" :class="success?'success':'faill'") 确定
      .common-tip 成功设置后，您收到的每一封Bcoin邮件都会附带防钓鱼码
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted, watchEffect } from 'vue'
import centerHeader from '@/views/mine/centerHeader'
import { useRouter } from 'vue-router'
import Clipboard from 'clipboard'
import comQrcode from '@/components/comQrcode'
import { useCenterStore } from '@/store/modules/center'
import { CellGroup, Field } from 'vant'
export default defineComponent({
  name: 'PhishingCode',
  components: {
    centerHeader,
    comQrcode,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field
  },
  setup() {
    const router = useRouter()
    const centerStore = useCenterStore()
    const fishCodeAction = (param) => centerStore.fishCodeAction(param)
    const getCenterInfoAction = (param) => centerStore.getCenterInfoAction(param)
    const state = reactive({
      success: false, // 校验标识
      requestFlag: true, // 接口请求标识
      copyValue: '', // 复制
      url: 'www.baidu.com',
      code: '',
      transPwd: '',
      fishCode: '',
      openFlag: false, // 显示密码
      pswType: 'password',
      timeLoadding: false
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
    const fishCodeFun = () => {
      if (!state.success) return
      if (!state.requestFlag) return
      state.requestFlag = false
      const param = {
        enable: true, // 是否开启防钓鱼码 0-否 1-是
        fishCode: state.fishCode// enable为1时，需要传fishCode参数
      }
      fishCodeAction(param).then(res => {
        state.requestFlag = true
        getCenterInfoAction()
        jumpPage('/mine/safeCenter')
      })
    }
    watchEffect(() => {
      state.success = state.fishCode
    })
    onMounted(() => {
      initClipboard()
    })
    return {
      ...toRefs(state),
      jumpPage,
      goBack,
      fishCodeFun
    }
  }

})
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/center.scss";

.clipboard-con{
  display: none;
}

.van-hairline--top-bottom:after, .van-hairline-unset--top-bottom:after{
  border-top: none;
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
  .common-tip{
    font-weight: 500;
    font-size: 12px;
    line-height: 21px;
    color: #A1A0A0;
    padding-left: 10px;
    margin-top: -10px;
    margin-bottom: 10px;
    text-align: left;
  }
  .page-flow {
    background:#FFFFFF;
    width: 345px;
    margin: 30px auto;
    padding-bottom: 10px;
    border-radius: 16px;
    padding-top: 20px;
    .info-con {
      .item {
        margin-bottom: 10px;
        position: relative;
        .lable{
          text-align: left;
          padding-left: 18px;
          padding-bottom: 10px;
        }
        .btn{
          font-size: 12px;
          line-height: 21px;
          text-decoration-line: underline;
          color: #486BF6;
          position: absolute;
          bottom: 10px;
          right: 10px;
        }
        .time{
          position: absolute;
          bottom: 10px;
          right: 10px;
        }

        .eye{
          width: 18px;
          height: 16px;
          position: absolute;
          bottom: 10px;
          right: 10px;
          &.open{
            background: url("~@/assets/images/center/eyeo.png") center/contain no-repeat;
          }
          &.close{
            background: url("~@/assets/images/center/eyec.png") center/contain no-repeat;
          }
        }
        .down-icon{
          background: url("~@/assets/images/center/down.png") center/contain no-repeat;
          width: 9px;
          height: 6px;
          position: absolute;
          top: 17px;
          left: 45px;
        }
      }
      .submit-btn{
        width: 280px;
        height: 45px;
        line-height: 45px;
        background: #486BF6;
        border-radius: 8px;
        color: #FFFFFF;
        text-align: center;
        margin: 30px auto 10px;
        &.success{
          background-color: #486BF6;
        }
        &.faill{
          background-color: #C4C4C4;
        }
      }
      .common-tip{
        text-align: center;
        margin-top: 10px;
      }
    }
  }
}
</style>

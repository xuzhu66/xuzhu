<template lang="pug">
.page-con
  centerHeader(@goBack="goBack")
  .common-title {{userRegistInfo.type === 1 ? '手机验证' : '邮箱验证'}}
  .common-tip(v-if="sendStatus") *验证码已发送至 {{userRegistInfo.type === 1 ? userRegistInfo.tel : userRegistInfo.email}}
  .page-flow
    .info-con
      .item
        .lable 验证码
        van-cell-group
          van-field(v-model='code'  label='' placeholder='请输入验证码' maxlength=6 border=false label-width="60")
        .btn(v-show="!timeLoadding" @click="sendMsg") 发送验证码
        .time(v-show="timeLoadding")
          van-count-down(ref='divRef' millisecond='' :time='60000' :auto-start='false' format='倒计时ss秒' @finish='finishTime' )

      .item
        .lable 交易密码
        van-cell-group
          van-field(v-model='tradePwd'  :type="pswType"   label='' placeholder='请输入交易密码' maxlength=8 border=false label-width="60")
        .eye(:class="openFlag?'open':'close'" @click="changeOpen")
      .item
        .lable 谷歌验证码
        van-cell-group
          van-field(v-model='googleCode' type='number'  label='' placeholder='请输入谷歌验证码' maxlength=6 border=false label-width="60")

    .footer-con
      .submit-btn(@click="submitFun" :class="success?'success':'faill'") 确定

</template>

<script>
import { defineComponent, reactive, ref, toRefs, onMounted, watchEffect } from 'vue'
import centerHeader from '@/views/mine/centerHeader'
import { useRouter } from 'vue-router'
import comQrcode from '@/components/comQrcode'
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'
import { useCenterStore } from '@/store/modules/center'
import { Toast, CellGroup, Field, CountDown } from 'vant'
import {
  validateTelCode,
  validateDepositPwd
} from '@/utils/validate'
export default defineComponent({
  name: 'GoogleCode',
  components: {
    centerHeader,
    comQrcode,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [CountDown.name]: CountDown
  },
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const { userRegistInfo } = storeToRefs(userStore)
    const sendPhoneHasLoginAction = (param) => userStore.sendPhoneHasLoginAction(param)
    const centerStore = useCenterStore()
    const { googleObj } = storeToRefs(centerStore)
    const bindGoogleMobileAction = (param) => centerStore.bindGoogleMobileAction(param)
    const bindGoogleEmailAction = (param) => centerStore.bindGoogleEmailAction(param)
    const setGoogleCodeAction = (param) => centerStore.setGoogleCodeAction(param)

    const state = reactive({
      success: false, // 校验标识
      requestFlag: true, // 接口请求标识
      sendStatus: false,
      url: '',
      code: '',
      tradePwd: '',
      googleCode: '',
      openFlag: false, // 显示密码
      pswType: 'password',
      timeLoadding: false
    })
    const divRef = ref(null)

    const jumpPage = (path) => {
      router.push({
        path: path
      })
    }

    const goBack = () => {
      router.push({ path: '/mine/google' })
    }

    const changeOpen = () => {
      state.openFlag = !state.openFlag
      if (state.openFlag) {
        state.pswType = 'number'
      } else {
        state.pswType = 'password'
      }
    }
    const finishTime = () => {
      state.timeLoadding = false
    }
    const startFun = () => {
      divRef.value.start()
    }
    const pauseFun = () => {
      divRef.value.pause()
    }
    const resetFun = () => {
      divRef.value.reset()
    }
    const sendMsg = () => {
      state.timeLoadding = true
      startFun()
      sendMsgFun()
    }
    // 手机验证码验证
    const bindGoogleMobileFun = () => {
      const param = {
        captcha: state.code,
        type: 9,
        tradePwd: state.tradePwd,
        googleSecret: googleObj.value.key,
        googleCode: state.googleCode
      }
      bindGoogleMobileAction(param).then(res => {
        state.requestFlag = true
        setGoogleCodeFun()
      })
    }
    // 邮箱验证码验证
    const bindGoogleEmailFun = () => {
      const param = {
        captcha: state.code,
        type: 10,
        tradePwd: state.tradePwd,
        googleSecret: googleObj.value.key,
        googleCode: state.googleCode
      }
      bindGoogleEmailAction(param).then(res => {
        state.requestFlag = true
        setGoogleCodeFun()
      })
    }
    const setGoogleCodeFun = () => {
      const param = {
        enable: true
      }
      setGoogleCodeAction(param).then(res => {

      })
    }
    const submitFun = () => {
      const valiteFlag = beforeSubmit()
      if (!valiteFlag) return
      if (!state.success) return
      if (!state.requestFlag) return
      state.requestFlag = false
      // 手机
      if (userRegistInfo.value.type === 1) {
        bindGoogleMobileFun()
      } else {
        bindGoogleEmailFun()
      }
    }
    // 发送手机验证码 -- 未登陆  1.忘记密码-手机，2.忘记密码-邮箱，3.设置手机，4.设置邮箱，5.修改密码-手机，6.修改密码-邮箱，7.重置交易密码-手机，8.重置交易密码-邮箱，9.绑定谷歌-手机，10.绑定谷歌-邮箱
    const sendMsgFun = () => {
      // 9.绑定谷歌-手机，10.绑定谷歌-邮箱
      const param = {
        type: userRegistInfo.value.type === 1 ? 9 : 10
      }
      console.log(param)
      sendPhoneHasLoginAction(param).then(res => {
        Toast('发送成功！')
        state.sendStatus = true
      }).catch((err) => {
        state.sendStatus = false
        console.log(err)
      })
    }
    // 提交校验
    const beforeSubmit = () => {
      if (!validateTelCode(state.code)) {
        Toast('请输入6位验证码')
        return false
      }
      if (!validateDepositPwd(state.tradePwd)) {
        Toast('请输入6位交易密码')
        return false
      }
      if (!validateTelCode(state.googleCode)) {
        Toast('请输入6位谷歌验证码')
        return false
      }
      return true
    }
    watchEffect(() => {
      state.success = state.code && state.tradePwd && state.googleCode
    })
    onMounted(() => {
      if (!googleObj.value.key) {
        jumpPage('/mine/google')
      }
    })
    return {
      ...toRefs(state),
      jumpPage,
      goBack,
      changeOpen,
      finishTime,
      startFun,
      pauseFun,
      resetFun,
      divRef,
      sendMsg,
      userRegistInfo,
      submitFun
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
    width: 323px;
    margin: 0 auto;
    padding-bottom: 30px;
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
      }
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
        &.success{
          background-color: #486BF6;
        }
        &.faill{
          background-color: #C4C4C4;
        }
      }
    }
  }
}
</style>

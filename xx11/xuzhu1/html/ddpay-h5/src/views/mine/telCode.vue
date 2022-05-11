<template lang="pug">
.page-con
  centerHeader(@goBack="goBack")
  .common-title {{titleList[pageType]}}
  .common-tip(v-if="sendStatus") *验证码已发送至 {{userRegistInfo.type === 1 ? userRegistInfo.tel : userRegistInfo.email}}
  .page-flow
    .info-con
      .item
        .lable 验证码
        van-cell-group
          van-field(v-model='code'  label='' placeholder='请输入验证码' maxlength=20 border=false label-width="60")
        .btn(v-show="!timeLoadding" @click="sendMsg") 发送验证码
        .time(v-show="timeLoadding")
          van-count-down(ref='divRef' millisecond='' :time='60000' :auto-start='false' format='ss 秒' @finish='finishTime' )

      .submit-btn(@click="submitFun" :class="success?'success':'faill'") 确定

</template>

<script>
import { defineComponent, reactive, ref, toRefs, onMounted, watchEffect } from 'vue'
import centerHeader from '@/views/mine/centerHeader'
import { useRoute, useRouter } from 'vue-router'
import comQrcode from '@/components/comQrcode'
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'
import { useCenterStore } from '@/store/modules/center'
import { Toast, CellGroup, Field, CountDown } from 'vant'
import { validateTelCode } from '@/utils/validate'
export default defineComponent({
  name: 'TelCode',
  components: {
    centerHeader,
    comQrcode,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [CountDown.name]: CountDown
  },
  setup() {
    const route = useRoute()
    const router = useRouter()

    const userStore = useUserStore()
    const { userRegistInfo } = storeToRefs(userStore)
    const sendPhoneHasLoginAction = (param) => userStore.sendPhoneHasLoginAction(param)

    const centerStore = useCenterStore()
    const resetPwdMobileAction = (param) => centerStore.resetPwdMobileAction(param) // 重置密码-短信验证
    const resetPwdEmailAction = (param) => centerStore.resetPwdEmailAction(param) // 重置密码-邮箱验证码
    const resetTradePwdMobileAction = (param) => centerStore.resetTradePwdMobileAction(param) // 重置交易密码-短信验证
    const resetTradePwdEmailAction = (param) => centerStore.resetTradePwdEmailAction(param) // 重置交易密码-邮箱验证码

    const state = reactive({
      success: false, // 校验标识
      requestFlag: true, // 接口请求标识
      code: '',
      timeLoadding: false,
      pageType: 0,
      titleList: {
        1: '忘记密码', // 忘记密码-手机
        2: '忘记密码', // 忘记密码-邮箱
        3: '设置手机', // 设置手机
        4: '设置邮箱', // 设置邮箱
        5: '修改密码', // 修改密码-手机，
        6: '修改密码', // 修改密码-邮箱，
        7: '重置交易密码', // 重置交易密码-手机，
        8: '重置交易密码', // 重置交易密码-邮箱，
        9: '绑定谷歌', // 绑定谷歌-手机，
        10: '绑定谷歌', // 绑定谷歌-邮箱
        11: '手机注册', // 手机注册
        12: '邮箱注册', // 邮箱注册
        13: '安全验证', // 登录验证-手机号
        14: '安全验证' // 登录验证-邮箱
      },
      sendStatus: false // 发送成功
    })
    const divRef = ref(null)

    const jumpPage = (path) => {
      router.push({
        path: path
      })
    }

    const goBack = () => {
      router.push({ path: '/mine/safeCenter' })
    }
    const finishTime = () => {
      state.timeLoadding = false
    }
    const startFun = () => {
      resetFun()
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
      sendAction()
    }
    // 发送手机验证码 -- 未登陆  1.忘记密码-手机，2.忘记密码-邮箱，3.设置手机，4.设置邮箱，5.修改密码-手机，6.修改密码-邮箱，7.重置交易密码-手机，8.重置交易密码-邮箱，9.绑定谷歌-手机，10.绑定谷歌-邮箱
    const sendAction = () => {
      const param = {
        type: state.pageType
      }
      console.log(param)
      sendPhoneHasLoginAction(param).then(res => {
        console.log(res)
        state.sendStatus = true
      }).catch((err) => {
        state.sendStatus = false
        console.log(err)
      })
    }
    const submitFun = () => {
      const valiteFlag = beforeSubmit()
      if (!valiteFlag) return
      if (!state.success) return
      if (!state.requestFlag) return
      state.requestFlag = false

      const param = {
        captcha: state.code,
        type: state.pageType
      }
      // jumpPage('/mine/loginPwd')
      if (state.pageType === '5') {
        // 修改密码-手机，
        resetPwdMobileAction(param).then(res => {
          jumpPage('/mine/loginPwd')
        })
      } else if (state.pageType === '6') {
        // 修改密码-邮箱
        resetPwdEmailAction(param).then(res => {
          jumpPage('/mine/loginPwd')
        })
      } else if (state.pageType === '7') {
        // 修改交易密码-手机
        resetTradePwdMobileAction(param).then(res => {
          jumpPage('/mine/depositPwd')
        })
      } else if (state.pageType === '8') {
        // 修改交易密码-邮箱
        resetTradePwdEmailAction(param).then(res => {
          jumpPage('/mine/depositPwd')
        })
      }
    }
    // 提交校验
    const beforeSubmit = () => {
      if (!validateTelCode(state.code)) {
        Toast('请输入6位验证码')
        return false
      }

      return true
    }
    watchEffect(() => {
      state.success = state.code
    })
    onMounted(() => {
      state.pageType = route.query.type
    })
    return {
      ...toRefs(state),
      jumpPage,
      goBack,
      finishTime,
      startFun,
      pauseFun,
      resetFun,
      divRef,
      sendMsg,
      sendAction,
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
    }
  }
}
</style>

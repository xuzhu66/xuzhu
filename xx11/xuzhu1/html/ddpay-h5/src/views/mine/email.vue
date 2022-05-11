<template lang="pug">
.page-con
  centerHeader(@goBack="goBack")
  .common-title 绑定邮箱
  .common-tip(v-if="sendStatus") *验证码已发送至 {{userRegistInfo.tel}}
  .page-flow
    .info-con
      .item
        van-cell-group
          van-field(v-model='email'  label='' placeholder='请输入邮箱' maxlength=30 border=false label-width="60")
      .item
        van-cell-group
          van-field(v-model='code'  label='' placeholder='请输入6位验证码' maxlength=6 border=false label-width="60")
        .btn(v-show="!timeLoadding" @click="sendMsg") 发送验证码
        .time(v-show="timeLoadding")
          van-count-down(ref='divRef' millisecond='' :time='60000' :auto-start='false' format='ss 秒' @finish='finishTime' )

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
import { validEmail, validateTelCode } from '@/utils/validate'
export default defineComponent({
  name: 'Telephone',
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
    const centerStore = useCenterStore()
    const captchaBindEmailAction = (param) => centerStore.captchaBindEmailAction(param)
    const setEmailAction = (param) => centerStore.setEmailAction(param)

    const state = reactive({
      success: false, // 校验标识
      requestFlag: true, // 接口请求标识
      email: '',
      openFlag: false, // 显示密码
      pswType: 'password',
      timeLoadding: false,
      code: '',
      sendStatus: false// 发送状态
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
      if (!validEmail(state.email)) {
        Toast('请输入正确的邮箱')
        return false
      }
      state.timeLoadding = true
      startFun()
      sendMsgFun()
    }
    // 发送手机验证码 -- 未登陆  1.忘记密码-手机，2.忘记密码-邮箱，3.设置手机，4.设置邮箱，5.修改密码-手机，6.修改密码-邮箱，7.重置交易密码-手机，8.重置交易密码-邮箱，9.绑定谷歌-手机，10.绑定谷歌-邮箱
    const sendMsgFun = () => {
      const param = {
        type: 4,
        email: state.email
      }
      console.log(param)
      captchaBindEmailAction(param).then(res => {
        console.log(res)
        state.sendStatus = true
        Toast('绑定成功！')
        jumpPage('/mine/safeCenter')
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
        type: 4,
        email: state.email,
        captcha: state.code
      }
      setEmailAction(param).then(res => {
        state.requestFlag = true
      }).catch(() => {
        state.requestFlag = true
      })
    }
    // 提交校验
    const beforeSubmit = () => {
      if (!validEmail(state.email)) {
        Toast('请输入正确的邮箱')
        return false
      }
      if (!validateTelCode(state.code)) {
        Toast('请输入验证码')
        return false
      }
      return true
    }

    watchEffect(() => {
      state.success = state.email && state.code
    })

    onMounted(() => {
      startFun()
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
      submitFun,
      userRegistInfo
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
    }
  }
}
</style>

<template lang="pug">
.forgot-pass
  my-header(@clickLeft='$router.go(-1)')
  main.content.fw500
    .fz30.fw600.title 忘记密码
    van-tabs(v-model:active='active' title-active-color='#486BF6' color='#486BF6')
      van-tab(title='手机')
        .phone.p1.flex-center-start
          img(src='../../assets/images/login/phone-icon.png' alt='')
          span.fz15.fw500 +86
          input.phone-input(v-model='form.phone' maxlength=11 placeholder='请输入手机号码')
        .phone.code.flex-center-start
          img(src='../../assets/images/login/lock-icon.png' alt='')
          input.code-input(v-model='form.code' autocomplete='off' maxlength=6 type="text" spellcheck='false' placeholder='请输入6位验证码')
          .btn(v-show="!timeLoadding" @click="sendMsg") 发送验证码
          .time(v-show="timeLoadding")
            van-count-down(ref='divRef' millisecond='' :time='60000' :auto-start='false' format='ss 秒' @finish='finishTime' )
        .button
          .on-login.fz15.fw600(:class="success?'active':''" @click="submitFun") 下一步

      van-tab(title='邮箱')
        .phone.code.p1.flex-center-start
          img(src='../../assets/images/login/phone-icon.png' alt='')
          input.code-input(v-model='form2.email' type='text' maxlength=30 placeholder='请输入邮箱')
        .phone.code.flex-center-start
          img(src='../../assets/images/login/lock-icon.png' alt='')
          input.code-input(v-model='form2.code' autocomplete='off' maxlength=6 type="text" spellcheck='false' placeholder='请输入6位验证码')
          .btn(v-show="!timeLoadding2" @click="sendEmialMsg") 发送验证码
          .time(v-show="timeLoadding2")
            van-count-down(ref='divRef2' millisecond='' :time='60000' :auto-start='false' format='ss 秒' @finish='finishTime2' )
        .button
          .on-login.fz15.fw600(:class="success?'active':''" @click="submitEmailFun") 下一步

    footer.footer.flex-center-around.fz14.fw500
      .fz14
        router-link(to='/allForgot')
          span.fontF6  忘记手机或邮箱
</template>
<script>
import { reactive, toRefs, ref, watchEffect } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import myHeader from '@/components/Header'
import { Toast, Tabs, Tab, CountDown } from 'vant'
import { validEmail, validateTelCode, validateTelephone } from '@/utils/validate'
export default {
  components: {
    myHeader,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [CountDown.name]: CountDown
  },
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const { userRegistInfo, forgotObj } = storeToRefs(userStore)
    const sendPhoneAction = (param) => userStore.sendPhoneAction(param)
    const sendEmailAction = (param) => userStore.sendEmailAction(param)
    const forgetPwdMobileAction = (param) => userStore.forgetPwdMobileAction(param)
    const forgetPwdEmailAction = (param) => userStore.forgetPwdEmailAction(param)

    const state = reactive({
      success: false, // 校验标识
      requestFlag: true, // 接口请求标识
      form: {
        phone: '',
        code: ''
      },
      form2: {
        email: '',
        code: ''
      },
      eyeFlag: false,
      active: ref(0),
      timeLoadding: false, // 发送中loadding
      timeLoadding2: false// 发送中loadding
    })
    const divRef = ref(null)
    const divRef2 = ref(null)
    const finishTime = () => {
      state.timeLoadding = false
    }
    const finishTime2 = () => {
      state.timeLoadding2 = false
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
      if (state.active === 0 && !validateTelephone(state.form.phone)) {
        Toast('请输入11位手机密码')
        return false
      }

      state.timeLoadding = true
      startFun()
      sendAction()
    }
    const finishEmailTime = () => {
      state.timeLoadding2 = false
    }
    const startEmailFun = () => {
      resetEmailFun()
      divRef2.value.start()
    }
    const pauseEmailFun = () => {
      divRef2.value.pause()
    }
    const resetEmailFun = () => {
      divRef2.value.reset()
    }
    const sendEmailMsg = () => {
      state.timeLoadding2 = true
      startFun()
      sendAction()
    }
    // 发送手机验证码 -- 未登陆  1.忘记密码-手机，2.忘记密码-邮箱，3.设置手机，4.设置邮箱，5.修改密码-手机，6.修改密码-邮箱，7.重置交易密码-手机，8.重置交易密码-邮箱，9.绑定谷歌-手机，10.绑定谷歌-邮箱
    const sendAction = () => {
      const param = {
        type: 1,
        tel: state.form.phone,
        areaCode: '86'
      }
      sendPhoneAction(param).then(res => {
        console.log(res)
        state.sendStatus = true
        Toast('发送成功！')
      }).catch((err) => {
        state.sendStatus = false
        console.log(err)
        Toast('发送失败！')
      })
    }
    const sendEmailFun = () => {
      const param = {
        type: '2',
        email: state.form2.email
      }
      sendEmailAction(param).then(res => {
        console.log(res)
        state.sendStatus = true
        Toast('发送成功！')
      }).catch((err) => {
        state.sendStatus = false
        console.log(err)
        Toast('发送失败！')
      })
    }

    const submitFun = () => {
      const valiteFlag = beforeSubmit()
      if (!valiteFlag) return
      if (!state.success) return
      if (!state.requestFlag) return
      state.requestFlag = false

      const param = {
        tel: state.form.phone,
        captcha: state.form.code,
        type: '1',
        areaCode: '86'
      }
      forgotObj.value.tel = state.form.phone
      forgotObj.value.type = 1
      forgetPwdMobileAction(param).then((res) => {
        forgotObj.value.uid = res.uid
        forgotObj.value.code = res.code
        forgotObj.value.verify = res.verify
        state.requestFlag = true
        if (res.verify === 1) {
          jumpPage('/forgotPwdCertify')
        } else {
          jumpPage('/resetPwd')
        }
      }).catch(() => {
        state.requestFlag = true
      })
    }
    const submitEmailFun = () => {
      const valiteFlag = beforeSubmit()
      if (!valiteFlag) return
      if (!state.success) return
      if (!state.requestFlag) return
      state.requestFlag = false

      const param = {
        email: state.form2.email,
        captcha: state.form2.code,
        type: '2'
      }
      forgotObj.value.email = state.form2.email
      forgotObj.value.type = 2
      forgetPwdEmailAction(param).then((res) => {
        console.log(res)
        forgotObj.value.uid = res.uid
        forgotObj.value.code = res.code
        forgotObj.value.verify = res.verify
        state.requestFlag = true
        if (res.verify === 1) {
          jumpPage('/forgotPwdCertify')
        } else {
          jumpPage('/resetPwd')
        }
      }).catch(() => {
        state.requestFlag = true
      })
    }

    const sendEmialMsg = () => {
      if (state.active === 1 && !validEmail(state.form2.email)) {
        Toast('请输入邮箱')
        return false
      }
      state.timeLoadding2 = true
      startEmailFun()
      sendEmailFun()
    }

    const onEyes = () => {
      state.eyeFlag = !state.eyeFlag
    }
    // 路由
    const jumpPage = (path) => {
      router.push({
        path: path
      })
    }
    // 提交校验
    const beforeSubmit = () => {
      if (state.active === 1 && !validEmail(state.form2.email)) {
        Toast('请输入邮箱')
        return false
      }
      if (state.active === 1 && !validateTelCode(state.form2.code)) {
        Toast('请输入6位验证码')
        return false
      }
      if (state.active === 0 && !validateTelephone(state.form.phone)) {
        Toast('请输入11位手机密码')
        return false
      }
      if (state.active === 0 && !validateTelCode(state.form.code)) {
        Toast('请输入6位验证码')
        return false
      }
      return true
    }

    watchEffect(() => {
      if (state.active === 1) {
        state.success = state.form2.email && state.form2.code
      } else {
        state.success = state.form.phone && state.form.code
      }
    })
    return {
      ...toRefs(state),
      onEyes,
      finishTime,
      finishTime2,
      startFun,
      pauseFun,
      resetFun,
      divRef,
      divRef2,
      sendMsg,
      sendAction,
      userRegistInfo,
      submitFun,
      sendEmialMsg,
      finishEmailTime,
      startEmailFun,
      pauseEmailFun,
      sendEmailMsg,
      sendEmailFun,
      jumpPage,
      submitEmailFun
    }
  }
}
</script>
<style lang="scss" scoped>
.forgot-pass{
  height: 100vh;
  background-size: 100%;
  background-color: #fff;
  .content{
    padding-top: 60px;
    text-align: left;
    margin: 0 26px;

    .title{
      margin-bottom: 30px;
    }
    .phone{
      position: relative;
      img{
        width: 15px;
        height: 20px;
        position: absolute;
        left: 13px;
      }
      span{
        position: absolute;
        left: 38px;
      }
      .phone-input{
        width: 330px;
        height: 55px;
        border: 1px solid #F6F7FD;
        //opacity: 0.5;
        border-radius: 8px;
        padding-left: 80px;
        background-color: transparent;
      }
      .h{
        width: 1px;
        height: 12px;
        background-color: #B8BBC3;
        position: absolute;
        right: 93px;
      }
      .send-code{
        position: absolute;
        right: 10px;
      }
      .eye{
        position: absolute;
        right: 10px;
        color: #B8BBC3;
      }
    }
    .code{
      margin-top: 32px;
      .code-input{
        width: 330px;
        height: 55px;
        border: 1px solid #F6F7FD;
        border-radius: 8px;
        padding-left: 52px;
        background-color: transparent;
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
    }
    .qr{
      img{
        width: 16px;
        height: 16px;
      }
    }
    .p1{
      margin-top: 13px;
    }
    .button{
      margin-top: 32px;
      .on-login{
        width: 323px;
        height: 45px;
        line-height: 45px;
        text-align: center;
        background-color: #DADADA;
        border-radius: 8px;
        color: #B8BBC3;
      }
      .on-login.active{
        width: 323px;
        height: 45px;
        line-height: 45px;
        text-align: center;
        background-color: #486BF6;
        border-radius: 8px;
        color: #fff;
      }
      .email-login{
        margin-top: 16px;
        float: right;
        img{
          width: 18px;
          height: 10px;
        }
      }
    }
    .footer{
      width: 86%;
      position: fixed;
      bottom: 50px;
      //margin-top: 188px;
      .h{
        width: 1px;
        height: 10px;
        background-color: #B8BBC3;
      }
    }
    ::v-deep .van-tabs__nav{
      background-color: transparent;
    }
  }
  //background: linear-gradient(
  //    103.49deg
  //  , #4aa59e 0.57%, #486BF6 100%);
}
</style>

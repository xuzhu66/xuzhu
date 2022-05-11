<template lang="pug">
.forgot-pass
  my-header(@clickLeft="$router.go(-1)")
  main.content.fw500
    .fz30.fw600.title 忘记密码
    .phone.flex-center-start
      input.phone-input(v-model="phone", type='number', placeholder='请输入邮箱地址')
    .phone.password.flex-center-start
      input.password-input(v-model="code", type='text', placeholder='请输入6位验证码')
      .h
      .send-code.fz15.fontF6.fw500(v-if="flag", @click="onSend") 发送验证码
      .send-code.fz15.fontF6.fw500(v-if="!flag") 剩余
        | {{ second }}
        |s
    .button
      .on-login.fz15.fw600(:class="phone && code ? 'active' : ''") 下一步
      router-link.email-login.fz14.fw600.font333(to='/forgotPassword') 手机验证
        img(src='../../assets/images/to-icon.png')
    footer.footer.flex-center-around.fz14.fw500
      router-link.font333(to='/forgotPassword') 忘记手机或邮箱
</template>
<script>
import { onMounted, reactive, toRefs } from 'vue'
import myHeader from '../../components/Header'
export default {
  components: { myHeader },
  setup() {
    const state = reactive({
      phone: '',
      code: '',
      second: 60,
      flag: true
    })
    const onSubmit = () => {
      console.log(1)
    }
    // 获取验证码
    const onSend = () => {
      if (state.flag) {
        state.flag = false
        const endMsRes = (new Date()).getTime() + 60000
        localStorage.setItem('codeTime', JSON.stringify(endMsRes))
        codeCountDown(endMsRes)
      }
    }
    // 验证码倒计时
    const codeCountDown = (endMsRes) => {
      state.flag = false
      state.second = Math.ceil((endMsRes - (new Date()).getTime()) / 1000)
      const time = setTimeout(() => {
        state.second--
        if (state.second < 1) {
          state.flag = true
          state.second = 60
          clearTimeout(time)
        } else {
          codeCountDown(endMsRes)
        }
      }, 1000)
    }

    onMounted(() => {
      const codeTime = localStorage.getItem('codeTime') || ''
      codeCountDown(codeTime)
    })

    return {
      ...toRefs(state),
      onSubmit,
      onSend,
      codeCountDown
    }
  }
}
</script>
<style lang="scss" scoped>
.forgot-pass{
  height: 100vh;
  //background: url("../../assets/images/login/bg.png")center no-repeat;
  background-size: 100%;
  background-color: #fff;
  .content{
    padding-top: 60px;
    text-align: left;
    margin: 0 26px;

    .title{
      margin-bottom: 93px;
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
        left: 18px;
      }
      .phone-input{
        width: 310px;
        height: 55px;
        border: 1px solid #F6F7FD;
        border-radius: 8px;
        padding-left: 16px;
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
    }
    .password{
      margin-top: 32px;
      .password-input{
        width: 310px;
        height: 55px;
        border: 1px solid #F6F7FD;
        border-radius: 8px;
        padding-left: 16px;
      }
    }
    .button{
      margin-top: 44px;
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
  }
  //background: linear-gradient(
  //    103.49deg
  //  , #4aa59e 0.57%, #486BF6 100%);
}
</style>


<template lang="pug">
.forgot-pass.login-bg
  main.content.fw500
    .fz30.fw600.title 欢迎注册
    van-tabs(v-model:active='active' title-active-color='#486BF6' color='#486BF6')
      van-tab(title='手机')
        .phone.p1.flex-center-start
          img(src='../../assets/images/login/phone-icon.png' alt='')
          span.fz15.fw500 +86
          input.phone-input(v-model='form.phone' maxlength=11 placeholder='请输入手机号码')
        .phone.password.flex-center-start
          img(src='../../assets/images/login/lock-icon.png' alt='')
          input.password-input(v-model='form.password' autocomplete='off' :type="eyeFlag? 'text': 'password'" spellcheck='false' placeholder='5-12包含字母和数字密码')
          van-icon.eye(:name="eyeFlag? 'eye-o' : 'closed-eye'" :size='24' @click='onEyes')
        .phone.password.qr.flex-center-start
          img(src='../../assets/images/login/qr-icon.png' alt='')
          input.password-input(v-model='form.code' type='text' placeholder='邀请码（选填）')
        .button
          .on-login.fz15.fw600(:class="success?'active':''" @click="nextStep") 继续

      van-tab(title='邮箱')
        .phone.password.p1.flex-center-start
          img(src='../../assets/images/login/phone-icon.png' alt='')
          input.password-input(v-model='form2.email' type='text' maxlength=30 placeholder='请输入邮箱')
        .phone.password.flex-center-start
          img(src='../../assets/images/login/lock-icon.png' alt='')
          input.password-input(v-model='form2.password' autocomplete='off' :type="eyeFlag? 'text': 'password'" spellcheck='false' placeholder='5-12包含字母和数字密码')
          van-icon.eye(:name="eyeFlag? 'eye-o' : 'closed-eye'" :size='24' @click='onEyes')
        .phone.password.qr.flex-center-start
          img(src='../../assets/images/login/qr-icon.png' alt='')
          input.password-input(v-model='form2.code' type='text' placeholder='邀请码（选填）')
        .button
          .on-login.fz15.fw600(:class="form2.email && form2.password ? 'active' : ''" @click="nextStep") 继续

    footer.footer.flex-center-around.fz14.fw500
      .fz14
        | 已有账号，
        router-link(to='/login')
          span.fontF6 立即登录
</template>
<script>
import { reactive, toRefs, ref, onMounted, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'
import { Toast, Tabs, Tab, CountDown, Icon } from 'vant'
import { validateLoginPwd, validateTelephone, validEmail } from '@/utils/validate'
import MD5Encrypt from 'js-md5'
import { loadTencent } from '@/utils/util'

export default {
  components: {
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [CountDown.name]: CountDown,
    [Icon.name]: Icon
  },
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const { tencentConfig, registerForm } = storeToRefs(userStore)
    const registerAccountAction = () => userStore.registerAccountAction()
    const getTencentAppIdAction = () => userStore.getTencentAppIdAction()
    const state = reactive({
      success: false, // 校验标识
      requestFlag: true, // 接口请求标识
      form: {
        phone: '',
        password: '',
        code: ''
      },
      form2: {
        email: '',
        password: '',
        code: ''
      },
      eyeFlag: false,
      active: ref(0),
      tempus: ''
    })
    const onSubmit = () => {
      console.log(1)
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
    // // 路由跳转带参数
    // const jumpPageQuery = (param) => {
    //   router.push({ path: param.path, query: { type: param.type }})
    // }
    const nextStep = () => {
      const valiteFlag = beforeSubmit()
      if (!valiteFlag) return
      if (!state.success) return
      if (!state.requestFlag) return
      state.requestFlag = false

      if (tencentConfig.value.boolCcij) {
        openCaptcha()
      } else {
        goNextPage()
      }
    }
    const submitFun = () => {
      const param = {
        account: state.form.phone, // 手机号码/邮箱号
        mobileAreaCode: '86', // 国际区号
        password: MD5Encrypt(state.form.password), // 密码
        inviteCode: state.form.code, // 邀请码.  -A
        category: state.active, // 0-短信，1-邮件
        verifyCode: '', // 手机验证码 邮件验证码
        sessionId: '', // 阿里云
        sig: '', // 阿里云
        token: '', // 阿里云
        scene: '', // 阿里云
        ticket: '', // 腾讯云
        randstr: ''// 腾讯云
      }
      registerAccountAction(param).then(() => {
        state.requestFlag = true
      }).catch(() => {
        state.requestFlag = true
      })
    }
    const openCaptcha = () => {
      try {
        const captcha = new window.TencentCaptcha(tencentConfig.value.picAppId, (res) => {
          state.requestFlag = true
          const param = {
            ticket: res.ticket,
            randstr: res.randstr
          }
          if (res.ticket && res.randstr) {
            getForm(param)
            router.push({ path: '/telCodeRegist', query: { type: state.active === 0 ? '1' : '2' }})
          }
        })
        captcha.show() // 显示验证码
      } catch (error) {
        console.log(error)
      }
    }
    const testOpen = () => {
      // eslint-disable-next-line no-undef
      var captcha = new TencentCaptcha('2090883959', function(res) {
        console.log(res)
      })
      captcha.show() // 显示验证码
    }

    const getForm = (tencent) => {
      const param = {
        account: state.form.phone, // 手机号码/邮箱号
        mobileAreaCode: '86', // 国际区号
        password: state.form.password, // 密码
        inviteCode: state.form.code, // 邀请码
        category: state.active, // 0-短信，1-邮件
        verifyCode: '', // 手机验证码 邮件验证码
        sessionId: '', // 阿里云
        sig: '', // 阿里云
        token: '', // 阿里云
        scene: '', // 阿里云
        ticket: '', // 腾讯云
        randstr: ''// 腾讯云
      }
      if (state.active === 1) {
        param.account = state.form2.email
        param.password = state.form2.password
      }
      // 如果开通腾讯验证码
      if (tencentConfig.value.boolCcij && tencent) {
        param.ticket = tencent.ticket
        param.randstr = tencent.randstr
      }
      // 保存注册信息
      userStore.registerForm = param
      console.log(registerForm.value)
      return param
    }
    // 验证码跳转下一步
    const goNextPage = () => {
      getForm()
      router.push({ path: '/telCodeRegist', query: { type: state.active === 0 ? '1' : '2' }})
    }
    const testSubmit = () => {
      router.push({ path: '/telCodeRegist', query: { type: 1 }})
    }

    // 提交校验
    const beforeSubmit = () => {
      if (state.active === 1 && !validEmail(state.form2.email)) {
        Toast('请输入邮箱')
        return false
      }
      if (state.active === 1 && !validateLoginPwd(state.form2.password)) {
        Toast('请输入数字、字母组成的5-12位密码')
        return false
      }
      if (state.active === 0 && !validateTelephone(state.form.phone)) {
        Toast('请输入11位手机密码')
        return false
      }
      if (state.active === 0 && !validateLoginPwd(state.form.password)) {
        Toast('请输入数字、字母组成的5-12位密码')
        return false
      }
      return true
    }

    watchEffect(() => {
      if (state.active === 1) {
        state.success = state.form2.email && state.form2.password
      } else {
        state.success = state.form.phone && state.form.password
      }
    })
    onMounted(() => {
      getTencentAppIdAction().then(res => {

      })
    })
    loadTencent()
    return {
      ...toRefs(state),
      onSubmit,
      onEyes,
      jumpPage,
      submitFun,
      openCaptcha,
      testOpen,
      nextStep,
      testSubmit
    }
  }
}
</script>
<style lang="scss" scoped>
.forgot-pass{
  height: 100vh;
  //background: url("../../assets/images/login/bg.png")center no-repeat;
  //background-size: 100%;
  //background-color: #fff;
  .content{
    padding-top: 113px;
    text-align: left;
    margin: 0 26px;

    .title{
      margin-bottom: 63px;
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
        width: 258px;
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
    .password{
      margin-top: 32px;
      .password-input{
        width: 272px;
        height: 55px;
        border: 1px solid #F6F7FD;
        border-radius: 8px;
        padding-left: 52px;
        background-color: transparent;
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

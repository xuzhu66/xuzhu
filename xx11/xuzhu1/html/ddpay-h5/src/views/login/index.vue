<template lang="pug">
.login.login-bg
  .content
    .fz30.fw600.title 欢迎登录
    Form(:validation-schema="schema", @submit="handleLogin")
      .phone.flex-center-start
        img(src="../../assets/images/login/account-icon.png")
        Field.phone-input.form-control(v-model="form.username", name="username",  type="text", placeholder="请输入手机号码或邮箱")
      ErrorMessage.error-feedback.error-msg.fw500(name="username")
      .phone.password.flex-center-start
        img(src="../../assets/images/login/lock-icon.png")
        Field.phone-input.form-control(v-model="form.password", name="password", autocomplete="off", :type="eyeFlag? 'text': 'password'", spellcheck="false", placeholder="登陆密码")
        van-icon.eye(:name="eyeFlag? 'eye-o' : 'closed-eye'", :size="24", @click="onEyes")
      ErrorMessage.error-feedback.error-msg.fw500(name="password")
      .text-align-right.forgot
        router-link.fz14.fw600.font333(to="/forgotPassword") 忘记密码 ？
      .button.form-group
        button.on-login.fz15.fw600(:class="form.username && form.password ? 'active' : ''") 登录

    footer.footer.flex-center-around.fz14.fw500
      router-link(to="/register") 用户注册

</template>
<script>
import { reactive, toRefs, watchEffect } from 'vue'
import MD5Encrypt from 'js-md5'
import { useUserStore } from '@/store/modules/user'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { useRouter, useRoute } from 'vue-router'

import * as yup from 'yup'
import { Icon } from 'vant'

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    [Icon.name]: Icon
  },
  setup() {
    const userStore = useUserStore()
    const login = (form) => userStore.loginAction(form)
    const route = useRoute()
    const router = useRouter()

    const state = reactive({
      form: {
        username: '',
        password: '',
        grant_type: 'password',
        terminal_name: 'h5',
        terminal_no: ''
      },
      eyeFlag: false,
      loading: false,
      redirect: undefined

    })

    const handleRoute = () => {
      return state.redirect === '/404' || state.redirect === '/403'
        ? '/index'
        : state.redirect
    }

    const handleLogin = async() => {
      // 保存用户名
      userStore.setUsername(state.form.username)
      const param = Object.assign({}, state.form)
      const md5Pwd = MD5Encrypt(state.form.password)
      param.password = md5Pwd
      try {
        const res = await login(param).then((res) => {
          console.log(res)
        }).catch((err) => {
          console.log(err)
          validateLoginPage(err)
        })
        console.log(res)
      } finally {
        state.loading = false
      }
    }
    const validateLoginPage = async(data) => {
      userStore.loginObj = data
      data.telephone = state.form.username
      if (data.code === 201001) { // 登录验证（邮箱）
        jumpPageQuery('/loginValidate', 2)
      } else if (data.code === 201002) { // 登录验证（google）
        jumpPageQuery('/loginValidate', 3)
      } else if (data.code === 201003) { // 	登录验证（电话）
        jumpPageQuery('/loginValidate', 1)
      } else if (data.code === 201004) { // 手机号未注册

      } else if (data.code === 201005) { // 密码错误

      } else if (data.code === 201006) { // 密码错误次数提醒

      } else if (data.code === 201007) { // 账号限制登录

      }
    }

    // 路由
    const jumpPage = (path) => {
      router.push({
        path: path
      })
    }
    // 路由 - 参数
    const jumpPageQuery = (path, type) => {
      router.push({ path: path, query: { type: type }})
    }

    const test = () => {
      router.push(handleRoute())
    }
    const onEyes = () => {
      state.eyeFlag = !state.eyeFlag
    }
    const schema = yup.object().shape({
      username: yup
        .string()
        .required('*请输入手机和邮箱')
        .min(10, '*格式不正确，请输入正确手机号码和邮箱'),
      password: yup
        .string()
        .required('*请输入密码')
        .min(6, '*必须至少6个字符！')
        .max(40, '*不得超过 40 个字符！')
    })

    watchEffect(() => {
      state.redirect = (route.query && route.query.redirect) || '/'
    })
    return {
      ...toRefs(state),
      onEyes,
      schema,
      handleLogin,
      test,
      jumpPage,
      jumpPageQuery
    }
  }
}
</script>
<style lang="scss" scoped>
.login{
  height: 100vh;
  //background: url("../../assets/images/login/bg.png")center no-repeat;
  //background-size: 100%;
  padding: 0 26px;

  .content{
    padding-top: 120px;
    text-align: left;
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
        left: 58px;
      }
      .phone-input{
        //width: 218px;
        width: 272px;
        height: 55px;
        border: 1px solid #F6F7FD;
        //opacity: 0.5;
        border-radius: 8px;
        //padding-left: 106px;
        padding-left: 52px;
        background-color: transparent;

      }
      .eye{
        position: absolute;
        right: 10px;
        color: #B8BBC3;
      }
    }
    .error-msg{
      color: #FF6666;
      font-size: 12px;
      margin-top: 10px;
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
    .forgot{
      margin-top: 10px;
    }
    .button{
      margin-top: 24px;
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
}
</style>

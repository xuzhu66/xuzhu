<template lang="pug">
.forgot-pass
  // 导航栏
  my-header(@clickLeft='$router.go(-1)')
  main.content.fw500
    .fz30.fw600.title 重置密码
    .phone.flex-center-start
      input.phone-input(v-model='form.pwd1' autocomplete='off' :type="eyeFlag? 'text': 'password'" spellcheck='false' placeholder='5-12包含字母和数字密码')
      van-icon.eye(:name="eyeFlag? 'eye-o' : 'closed-eye'" :size='24' @click='onEyes')
    .phone.password.flex-center-start
      input.phone-input(v-model='form.pwd2' autocomplete='off' :type="eyeFlag2? 'text': 'password'" spellcheck='false'  placeholder='请再次输入密码')
      van-icon.eye(:name="eyeFlag2? 'eye-o' : 'closed-eye'" :size='24' @click='onEyes2')
    .button
      .on-login.fz15.fw600(:class="success ? 'active' : ''" @click='onNext') 确认

</template>
<script>
import { reactive, toRefs, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import myHeader from '../../components/Header'
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'
import { Toast, Icon } from 'vant'
import { validateLoginPwd } from '@/utils/validate'
import MD5Encrypt from 'js-md5'
export default {
  components: {
    myHeader,
    [Icon.name]: Icon
  },

  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const { resetObj } = storeToRefs(userStore)
    const resetPwdAction = (param) => userStore.resetPwdAction(param)
    const loginAction = (param) => userStore.loginAction(param)
    const state = reactive({
      success: false, // 校验标识
      requestFlag: true, // 接口请求标识
      form: {
        pwd1: '',
        pwd2: ''
      },
      eyeFlag: false,
      eyeFlag2: false

    })
    const onSubmit = () => {
      console.log(1)
    }
    const onNext = () => {
      const valiteFlag = beforeSubmit()
      if (!valiteFlag) return
      if (!state.success) return
      if (!state.requestFlag) return
      state.requestFlag = false

      const param = {
        password: MD5Encrypt(state.form.pwd1),
        confirmPassword: MD5Encrypt(state.form.pwd2),
        uid: resetObj.value.uid,
        code: resetObj.value.code
      }
      resetPwdAction(param).then((res) => {
        state.requestFlag = true
        // 自动登陆
        loginAction({
          certToken: res.certToken,
          grant_type: 'autologin'
        }).then(data => {
          router.push({ path: '/' })
        })
      }).catch(() => {
        state.requestFlag = true
      })
    }
    const onEyes = () => {
      state.eyeFlag = !state.eyeFlag
    }
    const onEyes2 = () => {
      state.eyeFlag2 = !state.eyeFlag2
    }
    // 提交校验
    const beforeSubmit = () => {
      if (!validateLoginPwd(state.form.pwd1) || !validateLoginPwd(state.form.pwd2)) {
        Toast('请输入数字、字母组成的5-12位密码')
        return false
      }
      if (state.form.pwd1 != state.form.pwd2) {
        Toast('两次输入的密码不一致！')
        return false
      }
      return true
    }

    watchEffect(() => {
      state.success = state.form.pwd1 && state.form.pwd2
    })
    return {
      ...toRefs(state),
      onSubmit,
      onNext,
      onEyes,
      onEyes2
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
      margin-bottom: 52px;
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
        width: 330px;
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
      .van-icon{
        position: absolute;
        right: 10px;
      }
    }
    .password{
      margin-top: 32px;
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
    }
  }
}
</style>


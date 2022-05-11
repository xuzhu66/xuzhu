<template lang="pug">
.forgot-pass
  // 导航栏
  my-header(@clickLeft='$router.go(-1)')
  main.content.fw500
    .fz30.fw600 忘记
    .fz30.fw600.title 手机或邮箱
    .phone.flex-center-start
      input.phone-input(v-model='form.name' type='text' placeholder='请输入注册真实姓名')
    .phone.password.flex-center-start
      input.phone-input(v-model='form.id' type='text' placeholder='请输入身份证号码')
    .button
      .on-login.fz15.fw600(:class="form.name && form.id ? 'active' : ''" @click='onNext') 下一步
</template>
<script>
import { reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import myHeader from '../../components/Header'
import { useUserStore } from '@/store/modules/user'
export default {
  components: { myHeader },

  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const forgetMobileOrEmailAction = () => userStore.forgetMobileOrEmailAction()
    const state = reactive({
      form: {
        name: '',
        id: ''
      }
    })
    const onSubmit = () => {
      console.log(1)
    }
    const onNext = () => {
      forgetMobileOrEmailAction().then(() => {
        router.push({
          path: '/certify'
        })
      })
    }
    return {
      ...toRefs(state),
      onSubmit,
      onNext
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
        //width: 258px;
        //width: 272px;
        width: 310px;

        height: 55px;
        border: 1px solid #F6F7FD;
        //opacity: 0.5;
        border-radius: 8px;
        //padding-left: 80px;
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


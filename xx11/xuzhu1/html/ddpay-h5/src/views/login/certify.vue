<template lang="pug">
.forgot-pass
  // 导航栏
  my-header(@clickLeft='$router.go(-1)')
  main.content.fw500
    .fz14.fw600.title 您使用的手机号码是
    .phone.password.flex-center-start
      input.password-input(v-model='userRegistInfo.tel' type='text' readonly)
      .send-code.fz15.fontF6.fw500(@click="jumpPage('/mine/telCode')") 去登录
    .fz14.fw600.title 您使用的邮箱是
    .phone.password.flex-center-start
      input.password-input(v-model='userRegistInfo.email' type='text' readonly)
      .send-code.fz15.fontF6.fw500 去登录
  footer
    div {{userRegistInfo.email}}
</template>
<script>
import { reactive, toRefs, onMounted } from 'vue'
import myHeader from '../../components/Header'
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
export default {
  components: { myHeader },

  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const { userRegistInfo, token } = storeToRefs(userStore)
    const getUserRegistInfoAction = () => userStore.getUserRegistInfoAction()
    const state = reactive({
      form: {
        phone: '130 **** 0987',
        email: '130 **** @gmail.com'
      }
    })
    const jumpPage = (path) => {
      // 带查询参数，结果是 /register?plan=private
      router.push({ path: path, query: { type: 1 }})
    }
    const onSubmit = () => {
      console.log(1)
    }
    onMounted(() => {
      if (token.value) {
        getUserRegistInfoAction().then((res) => {
          console.log(res)
        })
      }
    })
    return {
      ...toRefs(state),
      onSubmit,
      userRegistInfo,
      userStore,
      jumpPage
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
      margin-bottom: 14px;
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
        right: 20px;
      }
    }
    .password{
      margin-bottom: 40px;
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


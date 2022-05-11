<template lang="pug">
.forgot-pass
  // 导航栏
  my-header(@clickLeft='$router.go(-1)')
  main.content.fw500
    .fz30.fw600.title 忘记密码
    .phone.flex-center-start
      input.phone-input(v-model='realName' type='text' maxlength='20' placeholder='请输入注册真实姓名')
    .phone.password.flex-center-start
      input.phone-input(v-model='cardID' type='text' maxlength='4' placeholder='请输入绑定身份证后4位')
    .button
      .on-login.fz15.fw600(:class="success ? 'active' : ''" @click='onSubmit') 认证
</template>
<script>
import { onMounted, reactive, toRefs, watchEffect } from 'vue'
import myHeader from '../../components/Header'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'
import { Toast } from 'vant'
import { validateCommonUserName, validateIDLast } from '@/utils/validate'
export default {
  components: { myHeader },

  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const { forgotObj } = storeToRefs(userStore)
    const legalizeAction = (param) => userStore.legalizeAction(param)
    const state = reactive({
      success: false, // 校验标识
      requestFlag: true, // 接口请求标识
      realName: '',
      cardID: ''
    })
    const onSubmit = () => {
      const valiteFlag = beforeSubmit()
      if (!valiteFlag) return
      if (!state.success) return
      if (!state.requestFlag) return
      state.requestFlag = false
      const param = {
        realName: state.realName,
        idNoLastNum: state.cardID

      }
      // 邮箱 2 手机 1
      if (forgotObj.value.type === 2) {
        param.email = forgotObj.value.email
      } else {
        param.tel = forgotObj.value.tel
      }
      legalizeAction(param).then((res) => {
        state.requestFlag = true
        forgotObj.value.uid = res.uid
        forgotObj.value.code = res.code
        jumpPage('/resetPwd')
      }).catch(() => {
        state.requestFlag = true
      })
    }
    // 路由
    const jumpPage = (path) => {
      router.push({
        path: path
      })
    }
    // 提交校验
    const beforeSubmit = () => {
      if (!validateCommonUserName(state.realName)) {
        Toast('请输入中英文、数字、字母组成的2-20位真实姓名')
        return false
      }
      if (!validateIDLast(state.cardID)) {
        Toast('请输入绑定身份证后4位')
        return false
      }
      return true
    }

    watchEffect(() => {
      state.success = state.realName && state.cardID
    })
    onMounted(() => {

    })
    return {
      ...toRefs(state),
      onSubmit,
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


<template lang="pug">
.page-con
  centerHeader(@goBack="goBack")
  .common-title 登陆密码
  .common-tip *请设置5-12位包含字母数字的登陆密码
  .page-flow
    .info-con
      .item
        van-cell-group
          van-field(v-model='password'  :type="pswType1"   label='' placeholder='请输入5-12位密码' maxlength=12 border=false label-width="60")
        .eye(:class="openFlag1?'open':'close'" @click="changeOpen1")
      .item
        van-cell-group
          van-field(v-model='confirmPassword'  :type="pswType2"   label='' placeholder='请输入5-12位密码' maxlength=12 border=false label-width="60")
        .eye(:class="openFlag2?'open':'close'" @click="changeOpen2")

      .submit-btn(@click="submitFun" :class="success?'success':'faill'") 确定

</template>

<script>
import { defineComponent, reactive, toRefs, onMounted, watchEffect, getCurrentInstance } from 'vue'
import centerHeader from '@/views/mine/centerHeader'
import { useRouter } from 'vue-router'
import { useCenterStore } from '@/store/modules/center'
import MD5Encrypt from 'js-md5'
import { Toast, CellGroup, Field } from 'vant'
import { validateLoginPwd } from '@/utils/validate'
export default defineComponent({
  name: 'LoginPwd',
  components: {
    centerHeader,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field
  },
  setup() {
    const router = useRouter()
    const centerStore = useCenterStore()
    const resetPwdAction = (param) => centerStore.resetPwdAction(param) // 重置密码
    const instance = getCurrentInstance()
    const state = reactive({
      success: false, // 校验标识
      requestFlag: true, // 接口请求标识
      password: '',
      confirmPassword: '',
      openFlag1: false, // 显示密码
      openFlag2: false, // 显示密码
      pswType1: 'password',
      pswType2: 'password',
      timeLoadding: false
    })

    const jumpPage = (path) => {
      router.push({
        path: path
      })
    }

    const goBack = () => {
      router.push({ path: '/mine/safeCenter' })
    }

    const changeOpen1 = () => {
      state.openFlag1 = !state.openFlag1
      if (state.openFlag1) {
        state.pswType1 = 'text'
      } else {
        state.pswType1 = 'password'
      }
    }
    const changeOpen2 = () => {
      state.openFlag2 = !state.openFlag2
      if (state.openFlag2) {
        state.pswType2 = 'text'
      } else {
        state.pswType2 = 'password'
      }
    }

    const submitFun = () => {
      const valiteFlag = beforeSubmit()
      if (!valiteFlag) return
      if (!state.success) return
      if (!state.requestFlag) return
      state.requestFlag = false

      const param = {
        password: MD5Encrypt(state.password),
        confirmPassword: MD5Encrypt(state.confirmPassword)
      }
      instance.proxy.$loading.show()
      resetPwdAction(param).then(res => {
        state.requestFlag = true
        instance.proxy.$loading.hide()
        Toast('修改成功！')
        jumpPage('/mine/safeCenter')
      }).catch(() => {
        state.requestFlag = true
        instance.proxy.$loading.hide()
      })
    }
    // 提交校验
    const beforeSubmit = () => {
      if (!validateLoginPwd(state.password)) {
        Toast('请输入英文、数字、字母组成的5-12位密码')
        return false
      }
      if (!validateLoginPwd(state.confirmPassword)) {
        Toast('请输入英文、数字、字母组成的5-12位密码')
        return false
      }
      if (state.password != state.confirmPassword) {
        Toast('两次输入的密码不一致！')
        return false
      }
      return true
    }

    watchEffect(() => {
      state.success = state.password && state.confirmPassword
    })
    onMounted(() => {

    })
    return {
      ...toRefs(state),
      jumpPage,
      goBack,
      changeOpen1,
      changeOpen2,
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
    margin: 36px auto;
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

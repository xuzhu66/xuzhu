<template lang="pug">
.page-con
  centerHeader(@goBack="goBack")
  .common-title 安全中心
  .commont-tip  *建议开启所有设置，提升账号安全
  .page-flow
    .menu-list
      .menu-item(@click="editLoginPwd")
        .menu-name 登陆密码
        .menu-right 已设置
      .menu-item(@click="editDepositPwd")
        .menu-name 交易密码
        .menu-right {{centerInfo.enTradePwd ?'已设置':'未设置'}}

    .menu-list
      .menu-item(@click="openTelephonePage")
        .menu-name 手机
        .menu-right {{centerInfo.tel ?centerInfo.tel:'未设置'}}
      .menu-item(@click="openEmailPage")
        .menu-name 邮箱
        .menu-right {{centerInfo.email ?centerInfo.email:'未设置'}}
      .menu-item.right-flag
        .menu-name 谷歌验证码
        .menu-right
          van-switch(v-model='google' active-color='#67c23a' inactive-color='#dcdee0' size="18px" @change="googleChange")

      .menu-item(@click="jumpPage('/mine/activity')")
        .menu-name 活动
      .menu-item(@click="jumpPage('/mine/terminal')")
        .menu-name 设备

    .menu-list
      .menu-item.right-flag
        .menu-name 防钓鱼码
        .menu-right
          van-switch(v-model='centerInfo.enFishCode' active-color='#67c23a' inactive-color='#dcdee0' size="18px" @change="phishingCodeChange")
      .menu-item.right-flag
        .menu-name 短信通知
        .menu-right
          van-switch(v-model='centerInfo.enMsgInfo' active-color='#67c23a' inactive-color='#dcdee0' size="18px" @change="telCodeChange")
      .menu-item.right-flag
        .menu-name 邮件通知
        .menu-right
          van-switch(v-model='centerInfo.enMailInfo' active-color='#67c23a' inactive-color='#dcdee0' size="18px" @change="emailCodeChange")

</template>

<script>
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import centerHeader from '@/views/mine/centerHeader'
import { useRouter } from 'vue-router'
import { Dialog, Switch } from 'vant'
import { storeToRefs } from 'pinia'
import { useCenterStore } from '@/store/modules/center'
import { useUserStore } from '@/store/modules/user'
export default defineComponent({
  name: 'SafeCenter',
  components: {
    centerHeader,
    [Switch.name]: Switch,
    [Dialog.name]: Dialog
  },

  setup() {
    const router = useRouter()
    const centerStore = useCenterStore()
    const userStore = useUserStore()
    const { userRegistInfo } = storeToRefs(userStore)
    const { centerInfo } = storeToRefs(centerStore)
    const getCenterInfoAction = (param) => centerStore.getCenterInfoAction(param)
    const fishCodeAction = (param) => centerStore.fishCodeAction(param)
    const setMsgInfoAction = (param) => centerStore.setMsgInfoAction(param)
    const setEmailInfoAction = (param) => centerStore.setEmailInfoAction(param)

    const state = reactive({
      google: false, // 谷歌验证码
      phishingCode: '', // 钓鱼码
      telCode: false,
      emailCode: false,
      telPageType: ''
    })
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

    // 回退
    const goBack = () => {
      router.push({ path: '/mine/center' })
    }
    // goolge 验证码
    const googleChange = (flag) => {
      console.log(flag)
      if (flag) {
        jumpPage('/mine/google')
      }
    }
    const telCodeChange = (flag) => {
      if (!flag) {
        Dialog.confirm({
          title: '开启短信通知',
          message: '您账号的每次交易变动，都会通过短信的方式发送给您。',
          theme: 'round-button',
          cancelButtonText: '暂不开启',
          confirmButtonText: '开启'
        })
          .then(() => {
            centerInfo.value.enMsgInfo = true
          })
          .catch(() => {
            setMsgInfoFun(false)
          })
      } else {
        setMsgInfoFun(true)
      }
    }
    const emailCodeChange = (flag) => {
      if (!flag) {
        Dialog.confirm({
          title: '开启邮件通知',
          message: '您账号的每次交易变动，都会通过邮件的方式发送给您。',
          theme: 'round-button',
          cancelButtonText: '暂不开启',
          confirmButtonText: '开启'
        })
          .then((param) => {
            centerInfo.value.enMailInfo = true
          })
          .catch(() => {
            setEmailInfoFun(false)
          })
      } else {
        setEmailInfoFun(true)
      }
    }

    const phishingCodeChange = (flag) => {
      if (flag) {
        jumpPage('/mine/phishingCode')
      } else {
        fishCodeFun()
      }
    }

    // 交易密码
    const editDepositPwd = () => {
      // 如果没有设置交易密码 直接跳转
      if (!centerInfo.value.enTradePwd) {
        jumpPageQuery('/mine/depositPwd', 1)
        return
      }
      // 7.重置交易密码-手机，8.重置交易密码-邮箱，
      // 手机
      if (userRegistInfo.value.type === 1) {
        state.telPageType = 7
      } else if (userRegistInfo.value.type === 2) { // 邮箱
        state.telPageType = 8
      }
      jumpPageQuery('/mine/telCode', state.telPageType)
    }
    // 登陆密码
    const editLoginPwd = () => {
      // 5.修改密码-手机， 6.修改密码-邮箱，
      // 手机
      if (userRegistInfo.value.type === 1) {
        state.telPageType = 5
      } else if (userRegistInfo.value.type === 2) { // 邮箱
        state.telPageType = 6
      }
      jumpPageQuery('/mine/telCode', state.telPageType)
    }
    const fishCodeFun = () => {
      const param = {
        enable: 0 // 是否开启防钓鱼码 0-否 1-是
      }
      fishCodeAction(param).then(res => {
        jumpPage('/mine/safeCenter')
      })
    }
    // 是否开启短信通知
    const setMsgInfoFun = (flag) => {
      const param = {
        enable: flag ? 1 : 0 // 是否开启短信通知 0-否 1-是
      }
      setMsgInfoAction(param).then(res => {

      })
    }
    // 邮件通知
    const setEmailInfoFun = (flag) => {
      const param = {
        enable: flag ? 1 : 0 // 是否开启短信通知 0-否 1-是
      }
      setEmailInfoAction(param).then(res => {

      })
    }
    const openTelephonePage = () => {
      if (!centerInfo.value.tel) {
        jumpPage('/mine/telephone')
      }
    }
    const openEmailPage = () => {
      if (!centerInfo.value.email) {
        jumpPage('/mine/email')
      }
    }
    onMounted(() => {
      getCenterInfoAction()
    })

    return {
      ...toRefs(state),
      jumpPage,
      goBack,
      googleChange,
      phishingCodeChange,
      telCodeChange,
      emailCodeChange,
      centerInfo,
      jumpPageQuery,
      editLoginPwd,
      editDepositPwd,
      openTelephonePage,
      openEmailPage
    }
  }

})
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/center.scss";
.commont-tip{
  font-weight: 500;
  font-size: 12px;
  line-height: 21px;
  color: #A1A0A0;
  padding-left: 18px;
  margin-top: -10px;
  margin-bottom: 10px;
}
.common-title{
  font-size:20px;
  font-weight: 600;
  color: #333333;
  margin: 18px;
}
// 页面样式
.page-con {
  height: 100vh;
  overflow-y: auto;
  padding-top:50px;
  padding-bottom: 50px;
  background-color: #f5f7fc;
  text-align: initial;
  font-size: 12px;

  .page-flow {
    .menu-list{
      width: 320px;
      margin: 0 auto;
      background-color: #FFFFFF;
      padding: 10px;
      border-radius: 10px;
      @include flex-fun;
      flex-direction: column;
      margin-bottom: 20px;
      .menu-item{
        width: 100%;
        height: 45px;
        flex:none;
        @include flex-fun;
        border-bottom: 1px solid #F6F7FD;
        &:after{
          content: '';
          display: block;
          background: url("~@/assets/images/center/rightjt.png") center/contain no-repeat;
          width: 9px;
          height: 16px;
          margin-right: 10px;
        }
        &.right-flag:after{
          display: none;
        }
        .menu-right{
          margin-right: 10px;
          color: #C4C4C4;
          font-size: 14px;
        }
        .icon{
          flex:none;
          width: 16px;
          height: 16px;
          margin-left: 12px;
          &.order{
            background: url("~@/assets/images/center/order.png") center/contain no-repeat;
            width: 16px;
            height: 18px;
          }
        }
        .menu-name{
          flex:1;
          text-align: left;
          padding-left: 10px;
          font-weight: 500;
          font-size: 15px;
        }
      }
    }

  }
}

</style>

<template lang="pug">
.page-con
  centerHeader(@goBack="goBack")
  .common-title 设置
  .page-flow
    .menu-list
      .menu-item(@click="jumpPage('/mine/userAgreement')")
        .icon.order
        .menu-name 用户协议

      .menu-item(@click="jumpPage('/mine/privacyAgreement')")
        .icon.order
        .menu-name 隐私协议
    .common-btn(@click="logoutFun") 退出账号
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import centerHeader from '@/views/mine/centerHeader'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'

export default defineComponent({
  name: 'Setting',
  components: {
    centerHeader
  },

  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const logoutAction = (param) => userStore.logoutAction(param)
    const state = reactive({
      item: {}
    })
    // 路由
    const jumpPage = (path) => {
      router.push({
        path: path
      })
    }
    // 回退
    const goBack = () => {
      router.push({ path: '/mine/center' })
    }
    const logoutFun = () => {
      logoutAction()
    }

    onMounted(() => {

    })
    return {
      ...toRefs(state),
      jumpPage,
      goBack,
      logoutFun
    }
  }

})
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/center.scss";

// 页面样式
.page-con {
  height: 100vh;
  overflow-y: auto;
  padding-top:50px;
  padding-bottom: 50px;
  background-color: #f5f7fc;
  text-align: initial;
  font-size: 12px;
  .common-title{
    font-size:20px;
    margin: 20px;
  }
  .page-flow {
    .menu-list{
      width: 320px;
      height: 120px;
      margin: 0 auto;
      background-color: #FFFFFF;
      padding: 10px;
      border-radius: 10px;
      @include flex-fun;
      flex-direction: column;
      .menu-item{
        width: 100%;
        height: 45px;
        flex:1;
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
    .common-btn{
      width: 343px;
      height: 45px;
      line-height: 45px;
      background: #C4C4C4;
      border-radius: 8px;
      margin: 20px auto;
      color: #FFFFFF;
      font-size: 16px;
      text-align: center;
    }
  }
}

</style>

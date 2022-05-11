<template lang="pug">
.page-con
  centerHeader(@goBack="goBackPage")
    template(v-slot:right)
      span(@click="openPopUpAction") 添加
      //span.down-icon
  .common-title 收款方式
  .page-flow
    .menu-list(v-if='myPayList')
      template(v-if="myPayList && myPayList.unionPayList && myPayList.unionPayList.length" )
        .lable 银行卡
        .menu-item(v-for="item in myPayList.unionPayList" @click="editBank(item)")
            .name
              span.icon-bank
              span {{item.bankName}}
            .count {{item.acctNo}}

      template(v-if="myPayList && myPayList.weChatList && myPayList.weChatList.length" )
        .lable 微信
        .menu-item(v-for="item in myPayList.weChatList" @click="editWechat(item)")
          .name
            span.icon-wechat
            span {{item.wxNickName}}
            .count {{item.acctNo}}

      template(v-if="myPayList && myPayList.aliPayList && myPayList.aliPayList.length" )
        .lable 支付宝
        .menu-item(v-for="item in myPayList.aliPayList" @click="editAlipay(item)")
          .name
            span.icon-alipay
            span {{item.realName}}
            .count {{item.acctNo}}

van-popup(:show="show" closeable round close-icon="close" position='bottom' :style="{ height: '36%' }" @close="onCancelAction" @click-overlay="onCancelAction")
  ul.pop-con
    li( @click="selectQuery(0)")
      .name 本人
      .status 实名认证
      .flag.ok 推荐
    li(@click="selectQuery(1)")
      .name 非本人
      .status.oringe 无法保障您的权限及财产安全
      .flag.no 不推荐
  .btn(@click="countOpenAction") 取消

van-popup(:show="showCountList" closeable round close-icon="close" position='bottom' :style="{ height: '45%' }" @close="countCancelAction" @click-overlay="countCancelAction")
  ul.count-con
    li(v-for="item in payList"  @click="selectCurrtCount(item)")
      span(:class="item.payCode")
      span {{item.payName}}
  .btn(@click="countCancelAction") 取消

</template>

<script>
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import centerHeader from '@/views/mine/centerHeader'
import { useRouter } from 'vue-router'
import { useCenterStore } from '@/store/modules/center'
import { storeToRefs } from 'pinia'
import { Popup } from 'vant'

export default defineComponent({
  name: 'SafeCenter',
  components: {
    centerHeader,
    [Popup.name]: Popup
  },

  setup() {
    const router = useRouter()
    const centerStore = useCenterStore()
    const { userInfo } = storeToRefs(centerStore)
    const getPayListAction = (param) => centerStore.getPayListAction(param)
    const getShoukuanListAction = (param) => centerStore.getShoukuanListAction(param)

    const state = reactive({
      show: false,
      showCountList: false,
      currt: '', // 当前选中的查询条件
      currtCount: '',
      payList: [], // 支付方式
      myPayList: {} // 支付方式
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
    const goBackPage = (path) => {
      router.go(-1)
    }
    const onCancelAction = () => {
      state.show = false
    }
    // 打开用户类型弹框
    const openPopUpAction = () => {
      // 判断当前用户类型 10:本人 20: 商家
      if (userInfo.value.kind.toString() === '20') {
        state.show = true
      } else {
        state.currtCount = ''
        state.showCountList = true
      }
    }
    const selectQuery = (item) => {
      state.currt = item
      onCancelAction()
      countOpenAction()
    }
    const countCancelAction = () => {
      state.showCountList = false
    }
    const countOpenAction = () => {
      state.currtCount = ''
      state.showCountList = true
    }
    const selectCurrtCount = (item) => {
      state.currtCount = item
      countCancelAction()
      if (item.payCode === 'UNIONPAY') {
        jumpPageQuery('/mine/bank', 1)
      } else if (item.payCode === 'AILIPAY') {
        jumpPageQuery('/mine/alipay', 1)
      } else if (item.payCode === 'WECHAT') {
        jumpPageQuery('/mine/wechat', 1)
      }
    }
    // 支付方式查询
    const getPayListFun = (item) => {
      getPayListAction().then(res => {
        state.payList = res
      })
    }
    // 获取我的支付方式列表
    const getMyPayListFun = () => {
      getShoukuanListAction({ payway: '' }).then(res => {
        state.myPayList = res
      })
    }
    const editBank = (item) => {
      centerStore.currtTempObj = item
      jumpPageQuery('/mine/bank', '2')
    }
    const editWechat = (item) => {
      centerStore.currtTempObj = item
      jumpPageQuery('/mine/wechat', '2')
    }
    const editAlipay = (item) => {
      centerStore.currtTempObj = item
      jumpPageQuery('/mine/alipay', '2')
    }

    onMounted(() => {
      getMyPayListFun()
      getPayListFun()
    })
    return {
      ...toRefs(state),
      jumpPage,
      goBack,
      goBackPage,
      openPopUpAction,
      selectQuery,
      onCancelAction,
      countCancelAction,
      selectCurrtCount,
      countOpenAction,
      userInfo,
      jumpPageQuery,
      editBank,
      editWechat,
      editAlipay
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
  height: 100%;
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
      .lable{
        font-weight: 600;
        font-size: 15px;
        line-height: 21px;
        color: #333333;
        text-align: left;
        width: 100%;
        padding-left: 10px;
        position: relative;
        margin-bottom: 20px;
        &:after{
          content: '';
          display: block;
          width: 320px;
          height: 1px;
          position: absolute;
          bottom: -5px;
          background: #F2F2F2;
          left: 50%;
          transform: translateX(-50%);
        }
      }
      .menu-item{
        position: relative;
        flex:none;
        width: 303px;
        height: 80px;
        border: 1px solid #333333;
        border-radius: 8px;
        margin-bottom: 20px;
        padding-top: 15px;
        padding-left: 10px;
        &:after{
          content: '';
          display: block;
          background: url("~@/assets/images/center/rightjt.png") center/contain no-repeat;
          width: 9px;
          height: 16px;
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
        }
        .name{
          font-weight: 500;
          font-size: 14px;
          line-height: 21px;
          color: #333333;
          .icon-bank{
            background: url("~@/assets/images/center/bank1.png") center /contain no-repeat;
            width: 20px;
            height: 15px;
            display: inline-block;
            margin-right: 10px;
          }
          .icon-wechat{
            background: url("~@/assets/images/center/wechat.png") center /contain no-repeat;
            display: inline-block;
            margin-right: 10px;
            width: 17px;
            height: 16px;
          }
          .icon-alipay{
            background: url("~@/assets/images/center/alipay.png") center /contain no-repeat;
            display: inline-block;
            margin-right: 10px;
            width: 18px;
            height: 14px;
          }

        }
        .count{
          font-weight: 500;
          font-size: 14px;
          line-height: 21px;
          color: #333333;
          margin-top: 10px;
        }
      }
    }

  }
}

// 弹出框样式
.pop-con{
  margin-top: 45px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  li{
    flex: none;
    width: 343px;
    height: 60px;
    padding-left: 10px;
    margin-bottom: 10px;
    position: relative;
    background: #F6F7FD;
    border-radius: 8px;
    text-align: left;
    .name{
      font-weight: 600;
      font-size: 15px;
      line-height: 21px;
      color: #333333;
      margin-top: 12px;
      margin-bottom: 5px;
    }
    .status{
      font-weight: 500;
      font-size: 12px;
      line-height: 17px;
      color: #33E264;
      &.oringe{
        color: #FF9F3D;
      }
    }
    .flag{
      position: absolute;
      width: 40px;
      height: 18px;
      line-height: 18px;
      text-align: center;
      background: #33E264;
      border-radius: 4px;
      font-weight: 500;
      font-size: 10px;
      color: #FFFFFF;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      &.no{
        background: #FF9F3D;
      }
    }
  }
}

// 弹出框样式
.count-con{
  margin-top: 45px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  //height: calc(100% - 50px);

  padding: 20px;
  li{
    flex: none;
    @include flex-fun;
    justify-content: flex-start;
    width: 343px;
    height: 45px;
    padding-left: 10px;
    margin-bottom: 10px;
    position: relative;
    &.active{
      background: #F6F7FD;
      border-radius: 8px;
      &:after{
        content: '';
        width: 16px;
        height: 16px;
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        z-index: 2;
        border-radius: 50%;
        background: url("~@/assets/images/center/select.png") center/contain no-repeat;
      }
    }
    .UNIONPAY{
      background: url("~@/assets/images/center/bank1.png") center /contain no-repeat;
      width: 20px;
      height: 15px;
      display: inline-block;
      margin-right: 10px;
    }
    .WECHAT{
      background: url("~@/assets/images/center/wechat.png") center /contain no-repeat;
      display: inline-block;
      margin-right: 10px;
      width: 17px;
      height: 16px;
    }
    .AILIPAY{
      background: url("~@/assets/images/center/alipay.png") center /contain no-repeat;
      display: inline-block;
      margin-right: 10px;
      width: 18px;
      height: 14px;
    }
  }
}
</style>

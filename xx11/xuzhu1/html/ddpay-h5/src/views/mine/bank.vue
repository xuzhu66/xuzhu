<template lang="pug">
.page-con
  centerHeader(@goBack="goBackPage")
  .common-title {{type==1?'添加银行卡':'编辑银行卡'}}
  //.common-tip *请设置5-12位包含字母数字的交易密码
  .page-flow
    .info-con
      .item
        van-cell-group
          van-field(v-model='realName'  label='' :readonly="readOnly" placeholder='请输入真实姓名' maxlength=30 border=false label-width="60")

      .item
        van-cell-group
          van-field(v-model='acctNo' label='' type='number' placeholder='请输入银行卡卡号' maxlength=19 border=false label-width="60")

      .item(@click="openPopUpAction")
        van-cell-group
          van-field(v-model='bankName' label='' readonly placeholder='请选择开户行' maxlength=30 border=false label-width="60")
        .down-icon

      .item
        van-cell-group
          van-field(v-model='subBankName' label='' placeholder='请输入支行名称（选填）' maxlength=50 border=false label-width="60")

      .submit-btn(@click="submitBankFun" :class="success?'success':'faill'") 添加

van-popup(:show="show" class="count-list" round  position='bottom' :style="{ height: '450px' }" @close="onCancelAction" @click-overlay="onCancelAction")
  .nav-con
    .close(@click="onCancelAction")
      van-icon(name="close" size="22")
    .title 选择银行
    .btn(@click="checkBank") 确定
  ul.pop-con
    li(v-for="item in bankList" :class="currt.id==item.id?'active':''" @click="selectQuery(item)") {{item.bankName}}

</template>

<script>
import { defineComponent, reactive, toRefs, onMounted, watchEffect, getCurrentInstance } from 'vue'
import centerHeader from '@/views/mine/centerHeader'
import { useRoute, useRouter } from 'vue-router'
import comQrcode from '@/components/comQrcode'
import { storeToRefs } from 'pinia'
import { useCenterStore } from '@/store/modules/center'
import { validateCommonUserName, isBankCard } from '@/utils/validate'
import { Toast, CellGroup, Field, Popup, Icon } from 'vant'
export default defineComponent({
  name: 'Bank',
  components: {
    centerHeader,
    comQrcode,
    [Popup.name]: Popup,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Icon.name]: Icon
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const centerStore = useCenterStore()
    const { userInfo, currtTempObj } = storeToRefs(centerStore)
    const submitUnionpayAction = (param) => centerStore.submitUnionpayAction(param) // 新增
    const updateUnionpayAction = (param) => centerStore.updateUnionpayAction(param) // 修改
    const getBankListAction = (param) => centerStore.getBankListAction(param) // 银行卡列表
    const instance = getCurrentInstance()
    const state = reactive({
      success: false, // 校验标识
      requestFlag: true, // 接口请求标识
      openFlag: false, // 显示密码
      pswType: 'password',
      timeLoadding: false,
      show: false,
      currt: '',
      realName: '',
      acctNo: '',
      bankName: '',
      subBankName: '',
      readOnly: false,
      bankList: [],
      type: ''
    })

    const jumpPage = (path) => {
      router.push({
        path: path
      })
    }

    const goBack = () => {
      router.push({ path: '/mine/accountIndex' })
    }
    const goBackPage = () => {
      router.go(-1)
    }

    const changeOpen = () => {
      state.openFlag = !state.openFlag
      if (state.openFlag) {
        state.pswType = 'number'
      } else {
        state.pswType = 'password'
      }
    }
    const onCancelAction = () => {
      state.show = false
    }
    const openPopUpAction = () => {
      state.show = true
    }
    const selectQuery = (item) => {
      state.currt = item
    }
    const submitBankFun = () => {
      const valiteFlag = beforeSubmit()
      if (!valiteFlag) return
      if (!state.success) return
      if (!state.requestFlag) return
      state.requestFlag = false
      instance.proxy.$loading.show()
      // 新增
      if (state.type === '1') {
        const param = {
          realName: state.realName,
          acctNo: state.acctNo,
          bankName: state.bankName,
          subBankName: state.subBankName
        }
        submitUnionpayAction(param).then(res => {
          state.requestFlag = true
          instance.proxy.$loading.hide()
          router.go(-1)
        })
      }
      // 编辑
      if (state.type === '2') {
        const param = {
          id: currtTempObj.value.id,
          realName: state.realName,
          acctNo: state.acctNo,
          bankName: state.bankName,
          subBankName: state.subBankName
        }
        updateUnionpayAction(param).then(res => {
          state.requestFlag = true
          instance.proxy.$loading.hide()
          router.go(-1)
        })
      }
    }
    const getBankList = () => {
      getBankListAction().then(res => {
        state.bankList = res.bankList
      })
    }
    const checkBank = () => {
      state.bankName = state.currt ? state.currt.bankName : ''
      onCancelAction()
    }
    watchEffect(() => {
      state.success = state.realName && state.acctNo && state.bankName
    })
    watchEffect(() => {
      state.realName = userInfo.value.realName
      // 本人
      if (userInfo.value.kind === 10) {
        state.readOnly = true
      } else {
        state.readOnly = false
      }
    })
    // 提交校验
    const beforeSubmit = () => {
      if (!validateCommonUserName(state.realName)) {
        Toast('请输入中英文、数字、字母组成的2-20位真实姓名')
        return false
      }
      if (!isBankCard(state.acctNo)) {
        Toast('请输入16-19位银行卡号')
        return false
      }
      // if (!validateBankName(state.subBankName)) {
      //   Toast('请输入银行支行')
      //   return false
      // }
      return true
    }
    onMounted(() => {
      state.type = route.query.type
      getBankList()
      if (state.type === '2') {
        state.realName = currtTempObj.value.realName
        state.acctNo = currtTempObj.value.acctNoWithoutMosaic
        state.bankName = currtTempObj.value.bankName
        state.subBankName = currtTempObj.value.subBankName
      }
    })
    return {
      ...toRefs(state),
      jumpPage,
      goBack,
      changeOpen,
      openPopUpAction,
      onCancelAction,
      selectQuery,
      userInfo,
      submitBankFun,
      checkBank,
      goBackPage
    }
  }

})
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/center.scss";

.down-icon{
  background: url("~@/assets/images/center/down.png") center/contain no-repeat;
  width: 12px;
  height: 12px;
  display: inline-block;
  position: absolute;
  right: 20px;
  top: 10px;
}

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
// 弹出框样式
.count-list{
  position: relative;
  border: 1px solid skyblue;
  .nav-con{
    position: fixed;
    bottom: 400px;
    width: 100%;
    border-radius: 8px 8px 0 0;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    z-index: 2;
    background-color: #FFFFFF;
    .close{
      flex: none;
      width: 50px;
    }
    .title{
      flex: 1;
    }
    .btn{
      flex: none;
      width: 80px;
      color: #486BF6;
    }
  }
  .pop-con{
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #FFFFFF;
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
          z-index: 1;
          border-radius: 50%;
          background: url("~@/assets/images/center/select.png") center/contain no-repeat;
        }
      }
    }
  }
}

</style>

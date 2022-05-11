<template lang="pug">
.common-page
  .page-flow
    .header-con
      .top
        .user-con
          .name Hi , {{userInfo.realName}}
          .uuid UID: {{userInfo.uid}}
        .msg-icon(@click="jumpPage('message')")
          .new(v-if="msgNotReadNum>0")
      .down
        .type {{`资产(${depositType})`}}
        .money {{userInfo.ddbAmt}}

    .info-list
      .info-item(@click="jumpPage('/mine/userinfo')")
        .card-id
          .icon
        .title 身份认证
        .status {{getDictByKey('ID_VERIFY',userInfo.idVerify)}}
      .info-item(@click="jumpPage('/mine/safeCenter')")
        .safe
          .icon
        .title 安全中心
        .status 【 {{getDictByKey('USER_INFO_VERIFY_LEVEL',userInfo.securityLevel)}} 】
      .info-item(@click="jumpPage('/mine/accountIndex')")
        .bank
          .icon
        .title 收款方式
        .status 【 {{userInfo.payMethodNum}} 】

    .menu-list
      .menu-item(@click="jumpPage('/mine/promot')")
        .icon.share
        .menu-name 邀请分享

      .menu-item(@click="jumpPage('/mine/promot/list')")
        .icon.order
        .menu-name 推广明细

      .menu-item(@click="jumpPage('/mine/help')")
        .icon.help
        .menu-name 帮助中心

      .menu-item(@click="jumpPage('/mine/chat')")
        .icon.service
        .menu-name 联系客服

      .menu-item(@click="jumpPage('/mine/about')")
        .icon.about
        .menu-name 关于我们

      .menu-item(@click="jumpPage('/mine/setting')")
        .icon.setting
        .menu-name 设置

</template>

<script>
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCenterStore } from '@/store/modules/center'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/modules/user'

export default defineComponent({
  name: 'Center',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const { token } = storeToRefs(userStore)

    const centerStore = useCenterStore()
    const { userInfo, msgNotReadNum, dictionary } = storeToRefs(centerStore)
    const getMsgNotReadCountAction = (param) => centerStore.getMsgNotReadCountAction(param)
    const state = reactive({
      depositType: 'DDB',
      name: ''
    })

    // 路由
    const jumpPage = (path) => {
      router.push({
        path: path
      })
    }
    // 获取数据字典对应的key
    const getDictByKey = (item, key) => {
      let str = ''
      const list = dictionary.value[item]
      if (key && list && list.length > 0) {
        list.forEach((dict) => {
          if (dict.key === key.toString()) {
            str = dict.value
          }
        })
      }
      return str
    }
    onMounted(() => {
      if (token.value) {
        // 未读消息数量
        getMsgNotReadCountAction({ kindCodeIds: [] })
        console.log(msgNotReadNum)
      }
    })

    return {
      ...toRefs(state),
      jumpPage,
      userInfo,
      msgNotReadNum,
      getDictByKey
    }
  }

})
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/center.scss";

.common-page{
  font-size: 12px;
  padding-bottom: 50px;
  .page-flow{
    position: relative;
    .header-con{
      width: 100%;
      height: 260px;
      left: 0px;
      top: 0px;
      background: url("~@/assets/images/center/center-top.png") center/contain no-repeat;
      color :#fff;
      .top{
        @include flex-fun;
        padding-top: 45px;
        .user-con{
          flex:1;
          font-size: 1.8em;
          @include flex-fun;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          padding: 10px;
          .uuid{
            font-size: 12px;
            font-weight: 500;
          }
          .name{
            font-weight: 600;
          }
        }
        .msg-icon{
          flex:none;
          background: url("~@/assets/images/center/msg.png") center/contain no-repeat;
          width: 19px;
          height: 18px;
          margin-right: 20px;
          position: relative;
          .new{
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: red;
            right: -4px;
            top: 0px;
          }
        }
      }
      .down{
        @include flex-fun;
        flex-direction: column;
        align-items: flex-start;
        padding: 10px;
        font-size: 1.8em;
        .type{
          font-size: 12px;
          font-weight: 500;
        }
        .money{
          font-weight: 600;
        }
      }
    }
    .info-list{
      position: absolute;
      width: 343px;
      height: 135px;
      left: 16px;
      top: 212px;
      background: url("~@/assets/images/center/center-middile.png") center/contain no-repeat;
      @include flex-fun;
      .info-item{
        flex:1;
        @include flex-fun;
        flex-direction: column;
        .title{
          color:#333333;
          margin: 5px auto;
          font-weight: 600;
        }
        .status{
          color:#FF9F3D;
          font-weight: 500;
        }
        .card-id{
          background: url("~@/assets/images/center/bg01.png") center/contain no-repeat;
          width: 50px;
          height: 50px;
          @include flex-fun;
          .icon{
            flex:1;
            background: url("~@/assets/images/center/card.png") center/contain no-repeat;
            width: 26px;
            height: 19px;
          }
        }
        .safe{
          background: url("~@/assets/images/center/bg02.png") center/contain no-repeat;
          width: 50px;
          height: 50px;
          @include flex-fun;
          .icon{
            flex:1;
            background: url("~@/assets/images/center/safe.png") center/contain no-repeat;
            width: 19px;
            height: 22px;
          }
        }
        .bank{
          background: url("~@/assets/images/center/bg03.png") center/contain no-repeat;
          width: 50px;
          height: 50px;
          @include flex-fun;
          .icon{
            flex:1;
            background: url("~@/assets/images/center/bank.png") center/contain no-repeat;
            width: 22px;
            height: 20px;
          }
        }

      }
    }
    .menu-list{
      width: 320px;
      height: 340px;
      margin: 108px auto 0;
      background-color: #FFFFFF;
      padding: 10px;
      border-radius: 10px;
      @include flex-fun;
      flex-direction: column;
      .menu-item{
        width: 100%;
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
          &.share{
            background: url("~@/assets/images/center/share.png") center/contain no-repeat;
          }
          &.order{
            background: url("~@/assets/images/center/order.png") center/contain no-repeat;
            width: 16px;
            height: 18px;
          }
          &.help{
            background: url("~@/assets/images/center/help.png") center/contain no-repeat;
            width: 16px;
            height: 18px;
          }
          &.service{
            background: url("~@/assets/images/center/service.png") center/contain no-repeat;
            width: 18px;
            height: 20px;
          }
          &.about{
            background: url("~@/assets/images/center/about.png") center/contain no-repeat;
            width: 18px;
            height: 18px;
          }
          &.setting{
            background: url("~@/assets/images/center/setting.png") center/contain no-repeat;
            width: 18px;
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

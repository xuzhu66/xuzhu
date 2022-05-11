<template lang="pug">
.page-con
  //centerHeader(@goBack="goBack")
  AbNavBar(:show-left-icon="showLeftIcon" :title="showLeftIcon ? '' : '帮助中心'")
  .common-title(v-if="showLeftIcon") 帮助中心
  .page-flow
    h2 滴滴付 新手入门指南
    h3 A1. 如何注册“滴滴付”账户？
    .text 在“www.域名地址.com”成功下载“滴滴付”客户端，安装完成后可以使用手机或邮箱进行注册
    img(:src="help01")
    img(:src="help0101")

    h3 A2. 如何在“滴滴付”进行交易？
    .text 首先，在滴滴付交易时需要强制设置交易密码，在交易时必须验证以保证您的财产安全
    img(:src="help02")
    img(:src="help03")
    .text 在滴滴付选择交易，然后选择购买或出售
    img(:src="help04")
    h3 A3. 在“滴滴付”交易，需要实名认证么？
    .text 需要，为了保障买卖双方的权益及财产安全，滴滴付平台要求每位用户在交易前，都需要先进行实名认证后，才可以进行交易
    img(:src="help05")
    .text 提交身份信息与帐号进行绑定，审核通过后您需要填写同名收款银行
    img(:src="help06")
    .text 在我的页面，选择收款方式添加同名卡，添加完成就可以开始交易了
    img(:src="help07")
    img(:src="help08")
    h3  A4. 如何在“滴滴付”购买DDB？
    .text 第一步，点击交易界面，选择购买DDB，输入需要购买的金额
    img(:src="help09")
    img(:src="help10")
    .text 第二步，付款、上传凭证并确认付款
    img(:src="help11")
    .text 第三步，返回首页查看账户DDB余额
    img(:src="help12")
    h3 A5. 如何在“滴滴付”出售DDB？
    .text 第一步，选择出售DDB，输入出售数量，点击出售
    img(:src="help13")
    .text 第二步，确认出售和拆分出售（订单分批出售会更快完成交易）
    img(:src="help14")
    .text 第三步，确认收到买家付款后，确认放币完成交易
    img(:src="help15")
    h3 A6. 我用USDT可以购买DDB么？
    .text 可以，在首页选择充值USDT，到帐后兑换DDB即可（图）第一步，首页选择充值USDT
    img(:src="help16")
    img(:src="help17")
    .text 第二步，首页选择兑换DDB，输入数量后完成USDT兑换DDB
    img(:src="help18")
    img(:src="help19")
    h3 B1.“滴滴付”交易收取手续费么？如何收？
    .text 滴滴付不会以任何形式收取手续费，交易完全免费

    h3 B2.“滴滴付”连续取消交易匹配的订单，会如何？
    .text 滴滴付官方不建议用户有这种行为，因为买卖双方如果有恶意取消匹配的情况，平台会视情况严重给予一定惩罚，最高冻结账户，请不要恶意取消交易（推荐匹配金额不计算在内）

    h3 B3. 如何管理绑定收款信息
    .text 在我的界面，“收款方式”中添加查看您的收款方式

    h3 B4. 如何修改登录密码和交易密码
    .text 在我的界面，“安全中心”内修改帐号的登录和交易密码。

    h3 B5. 如何加强自己的帐号安全？
    .text 在我的界面，“安全中心”内开启谷歌验证和短信邮箱通知，确保您帐号内的财产安全。

    h3 B6.“滴滴付”都支持哪些付款方式？
    .text 目前支持 银联、微信、支付宝，陆续会支持其他支付方式，敬请期待。

    h3 C1. 什么情况下会冻结币资产？
    .text 挂单出售，交易中订单会暂扣您的币资产，在完成交易和您手动下架后，币资产会返还到您的账户中。
    .text 订单投诉，交易中订单被投诉，币资产会被冻结到客服给出处理结果。

    h3 C2. 交易中怎么向客服进行投诉？
    .text 买卖交易中，在页面中选择“交易申诉”，选择申诉的事由并提交，当前的订单会被暂停交易并冻结买卖双方的币资产，直到客服有处理结果后返还。
    img(:src="help20")
    img(:src="help21")

    h3 C3. 客户提供的收款信息错误，如何处理？
    .text 如碰到客户提供的收款信息错误或与客户真实姓名不符，请马上进行“交易申诉”中止交易，以免造成不可挽回的损失。

    h3 C4. 卖单付款信息错误，如何处理？
    .text 如碰到卖家付款信息错误，无法正常打款，请马上进行“交易申诉”中止交易，以免造成不可挽回的损失。

    h3 C5. 未受到客服付款，点击“确认放币”如何处理？
    .text 确认放币前，请一定务必确认已收到买家付款后，在进行确认操作！

    h3 C6. 如付款信息包含铭感信息如何处理？
    .text 买家付款凭证中包含了敏感信息，如数字货币 游戏等等类似备注信息时，请马上进行“交易申诉”中止交易并联系客服！

    h3 C7. 收款款项与订单金额不一致，如何处理？
    .text 如果碰到付款的金额与订单金额不一致，请马上进行“交易申诉”中止交易并联系客服！

    h3 C8. 客户姓名与付款信息姓名不一致，如何处理？
    .text 如果碰到非同名卡付款的情况，请马上进行“交易申诉”中止交易并联系客服！

</template>

<script>
import { defineComponent, reactive, toRefs, onMounted, ref, watch } from 'vue'
// import centerHeader from '@/views/mine/centerHeader'
import AbNavBar from '@/components/AbNavBar'
import { useRouter, useRoute } from 'vue-router'
import help01 from '@/assets/images/help/help01.png'
import help0101 from '@/assets/images/help/help0101.png'
import help02 from '@/assets/images/help/help02.png'
import help03 from '@/assets/images/help/help03.png'
import help04 from '@/assets/images/help/help04.png'
import help05 from '@/assets/images/help/help05.png'
import help06 from '@/assets/images/help/help06.png'
import help07 from '@/assets/images/help/help07.png'
import help08 from '@/assets/images/help/help08.png'
import help09 from '@/assets/images/help/help09.png'
import help10 from '@/assets/images/help/help10.png'
import help11 from '@/assets/images/help/help11.png'
import help12 from '@/assets/images/help/help12.png'
import help13 from '@/assets/images/help/help13.png'
import help14 from '@/assets/images/help/help14.png'
import help15 from '@/assets/images/help/help15.png'
import help16 from '@/assets/images/help/help16.png'
import help17 from '@/assets/images/help/help17.png'
import help18 from '@/assets/images/help/help18.png'
import help19 from '@/assets/images/help/help19.png'
import help20 from '@/assets/images/help/help20.png'
import help21 from '@/assets/images/help/help21.png'

export default defineComponent({
  name: 'Help',
  components: {
    // centerHeader,
    AbNavBar
  },

  setup() {
    const router = useRouter()
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
      router.go(-1)
    }
    onMounted(() => {

    })
    const showLeftIcon = ref(false)
    const route = useRoute()
    watch(
      route,
      (route) => {
        showLeftIcon.value = !route.meta?.showTab
      },
      { immediate: true }
    )
    return {
      ...toRefs(state),
      showLeftIcon,
      jumpPage,
      goBack,
      help01,
      help02,
      help03,
      help04,
      help05,
      help06,
      help07,
      help08,
      help09,
      help10,
      help11,
      help12,
      help13,
      help14,
      help15,
      help16,
      help17,
      help18,
      help19,
      help20,
      help21,
      help0101
    }
  }

})
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/center.scss";

// 页面样式
.page-con {
  height: 100%;
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
    padding: 10px;
    .text{
      font-size: 13px;
      line-height: 21px;
      margin: 10px 0px 10px 10px ;
    }
    h4,h5{
      margin-top: 10px;
    }
    img{
      width: 100%;
      height: auto;
      margin: 10px auto;
    }
  }
}

</style>

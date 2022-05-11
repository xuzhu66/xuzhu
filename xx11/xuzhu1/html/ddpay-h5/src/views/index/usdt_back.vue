<template lang="pug">
.usdt
  // 导航栏
  my-header(:r-icon="require('../../assets/images/arrow.png')" title='充值' r-title2='历史记录' @clickLeft='$router.go(-1)' @clickRight='toHistory')
  main.content
    scroll(ref='indexScroll' :style="{ height: wrapperHeight - 80 + 'px' }")
      // usdt标题
      .cell.flex-center-between
        .flex-center-start
          img(src='../../assets/images/index/usdt.png' alt='')
          span.usdt_text.fz15.fw700 USDT
          span.fw500 TetherUS
        van-icon(name='arrow')
      // 选择转账网络
      .t-network.text-align-left.fw500
        div 选择转账网络
        .flex.net.fz14.fw500.fontF6
          div(v-for='(item, index) in data' :key='index' :class="active == index ? 'click' : ''" @click='onNetWork(index)') {{ item.name }}
        .recharge-num 充值数量
        .flex-center-between
          van-field.input-field.fz15.fw600(type='number' placeholder='最少充值10.000个USDT')
            div USDT
        .bottom.fz12.fw500 汇率：1 USDT≈6.45 DDB
      footer.fz15.fw600(@click="show = true") 确定
  // 确认弹窗
  van-popup(v-model:show="show" round='' position='bottom' :style="{ height: '65%' }")
    .usdt-pop
      .title.flex-center-start.fz14
        img(src='../../assets/images/index/usdt.png' alt='')
        span.fw700 USDT
        span.fw500 -TRC20收款地址
      .qr-icon
        img(src='../../assets/images/index/qr-code.png' alt='')
      .address.flex-center-between
        .fz12.fw500 TNG2DZWxBcD1TFrnBRUbW3nUMDtGKqAGpz
        img(src='../../assets/images/index/copy2.png' alt='')
      .tips
        .top.flex-center-between.fz14.fw600
          .fontA1A 手续费
          div 1.00 USDT
        .bottom.fz12.text-align-left.fw500
          p 注意
          p 1.此地址只可接收USDT，请再次确认您选择的主网络是 Tron （TRC20）
          p 2.实际到账的USDT数量根据市场汇率会有些许波动
        .bottom-btn.flex-center-between.fw600
          div 复制地址
          div 保存相册

</template>
<script>
import Scroll from '../../components/Scroll'
import myHeader from '../../components/Header'

import { reactive, toRefs, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Field, Popup, Icon } from 'vant'

export default {
  components: {
    Scroll,
    myHeader,
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Icon.name]: Icon
  },
  setup() {
    const router = useRouter()
    const wrapperHeight = ref(window.innerHeight)
    const state = reactive({
      active: ref(0),
      show: ref(false),
      data: [{ name: 'TRC20' }, { name: 'TRC20' }]
    })
    const onNetWork = (index) => {
      state.active = index
    }
    const onSelect = () => {
      state.show = false
    }
    const toHistory = () => {
      router.push({
        path: '/history'
      })
    }
    return {
      ...toRefs(state),
      wrapperHeight,
      onSelect,
      onNetWork,
      toHistory
    }
  }
}
</script>
<style lang="scss" scoped>
.usdt {
  background-color: #fff;
  .header {
    padding: 0 16px;
    height: 44px;
    background-color: #fff;
    .back-icon {
      width: 14px;
      height: 14px;
      margin-right: 14px;
    }
  }
  .content {
    padding: 16px;
    .cell {
      height: 55px;
      background-color: #fff;
      border-radius: 8px;
      padding: 0 10px;
      box-shadow: -10px -10px 10px rgba(216, 221, 240, 0.15),
        10px 10px 10px rgba(216, 221, 240, 0.15);
      img {
        width: 20px;
        height: 20px;
      }
      .usdt_text {
        margin: 0 10px;
      }
    }
    .t-network {
      margin-top: 30px;
      .recharge-num {
        margin-bottom: 30px;
      }
      .net {
        div {
          width: 90px;
          height: 35px;
          line-height: 35px;
          text-align: center;
          border: 1.5px solid #f6f7fd;
          box-shadow: -10px -10px 10px rgba(216, 221, 240, 0.1),
            10px 10px 10px rgba(216, 221, 240, 0.1);
          border-radius: 8px;
          margin: 13px 17px 30px 0;
          background: #f6f7fd;
          color: #d1d3da;
        }
        div.click {
          border: 1.5px solid #486bf6;
          background-color: #fff;
          color: #486bf6;
        }
      }
      .input-field {
        padding: 10px 0;
        border-bottom: 1px solid #f6f7fd;
      }
      .van-cell:after {
        border-bottom: none;
      }
      .bottom {
        //float: right;
        text-align: right;
        margin-top: 6px;
      }
    }
    footer {
      height: 45px;
      line-height: 45px;
      text-align: center;
      background-color: #486bf6;
      color: #fff;
      margin-top: 20px;
      border-radius: 8px;
    }
  }
  .usdt-pop {
    margin: 24px;
    .title {
      img {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
    }
    .qr-icon {
      margin: 0 auto;
      img {
        margin-top: 30px;
        width: 150px;
        height: 150px;
      }
    }
    .address {
      height: 50px;
      border-bottom: 1px solid #f6f7fd;
      img {
        width: 11px;
        height: 13px;
      }
    }
    .tips {
      .top {
        margin-top: 7px;
      }
      .bottom {
        color: #ff9f3d;
        margin-top: 20px;
        p {
          line-height: 25px;
        }
      }
      .bottom-btn {
        margin-top: 17px;
        div:first-child {
          width: 155px;
          height: 45px;
          line-height: 45px;
          border: 1px solid #486bf6;
          border-radius: 8px;
          color: #486bf6;
        }
        div:last-child {
          width: 155px;
          height: 45px;
          line-height: 45px;
          border: 1px solid #486bf6;
          background-color: #486bf6;
          border-radius: 8px;
          color: #fff;
        }
      }
    }
  }
}
</style>

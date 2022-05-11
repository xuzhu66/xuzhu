<template lang="pug">
.ddb
  // 导航栏
  my-header(:r-icon="require('../../assets/images/arrow.png')" title='兑换DDB' r-title2='历史记录' @clickLeft='$router.go(-1)' @clickRight='toHistory')
  main.content
    .tips.fz12.fw500.text-align-left 请注意：实际到账DDB数量根据市场汇率会有些许波动。
    .c-top.fw600.fz14
      .text-align-left 兑换DDB
      .c-input.flex-center-between
        img.ddb-img(src='../../assets/images/index/ddb.png' alt='')
        van-field.input-field.fz15.fw600(v-model='balance' type='number' placeholder='请输入要兑换的DDB数量')
          .fz12.fw500.all.fw500(@click='onAll') 全部
      .money.flex-center-between
        div 钱包余额
        .fontA1A {{ info.balance }} USDT
      .money.line.flex-center-between
        div 需要USDT
        .fontA1A ≈{{ info.needUsdt }} USDT
      .money.account.flex-center-between
        div 实际到账DDB
        .fontA1A {{ info.ddb }} DDB
      .btn.flex-center-center(@click='onSubmit') 马上兑换
  footer
    .days-ago.text-align-left.fz14.fw600 近三天内
    // 历史记录
    history(:list='list' :status-color='statusColor' :status-render='statusRender' :title-item='titleList')

</template>
<script>
import myHeader from '../../components/Header'
import History from '@/components/History'

import { reactive, toRefs, ref, computed, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { Field } from 'vant'

export default {
  components: { myHeader, History, [Field.name]: Field },
  setup() {
    const router = useRouter()
    const wrapperHeight = ref(window.innerHeight)
    const { proxy } = getCurrentInstance()
    const state = reactive({
      balance: '',
      info: {
        balance: '9887675655.787',
        needUsdt: '7986.976',
        ddb: '0.003767'
      },
      titleList: [{ name: '时间' }, { name: '数量' }, { name: '状态' }],
      list: [
        { status: 1, time: '01-06 13:30', num: '1,200.0000' },
        { status: 2, time: '01-06 13:30', num: '1,200.0000' },
        { status: 3, time: '01-06 13:30', num: '1,200.0000' },
        { status: 1, time: '01-06 13:30', num: '1,200.0000' },
        { status: 1, time: '01-06 13:30', num: '1,200.0000' },
        { status: 1, time: '01-06 13:30', num: '1,200.0000' },
        { status: 1, time: '01-06 13:30', num: '1,200.0000' },
        { status: 1, time: '01-06 13:30', num: '1,200.0000' },
        { status: 1, time: '01-06 13:30', num: '1,200.0000' },
        { status: 1, time: '01-06 13:30', num: '1,200.0000' },
        { status: 1, time: '01-06 13:30', num: '1,200.0000' },
        { status: 1, time: '01-06 13:30', num: '1,200.0000' },
        { status: 1, time: '01-06 13:30', num: '1,200.0000' },
        { status: 1, time: '01-06 13:30', num: '1,200.0000' },
        { status: 1, time: '01-06 13:30', num: '1,200.0000' },
        { status: 1, time: '01-06 13:30', num: '1,200.0000' },
        { status: 1, time: '01-06 13:30', num: '1,200.0000' },
        { status: 1, time: '01-06 13:30', num: '1,200.0000' },
        { status: 1, time: '01-06 13:30', num: '1,200.0000' },
        { status: 1, time: '01-06 13:30', num: '1,200.0000' },
        { status: 1, time: '01-06 13:30', num: '1,200.0000' },
        { status: 2, time: '01-06 13:30', num: '1,200.0000' }
      ]
    })
    // 兑换
    const onSubmit = () => {
      proxy.$toast('兑换成功')
    }
    const toHistory = () => {
      router.push({
        name: 'DdbHistory'
      })
    }
    // 状态
    const statusRender = computed(() => {
      return function (status) {
        switch (status) {
          case 1:
            return '已完成'
          case 2:
            return '进行中'
          case 3:
            return '失败'
        }
      }
    })
    // 状态颜色
    const statusColor = computed(() => {
      return function (status) {
        switch (status) {
          case 1:
            return '#33E264'
          case 2:
            return '#FF9F3D'
          case 3:
            return '#FF6666'
        }
      }
    })
    const onAll = () => {
      state.balance = state.info.balance
    }
    return {
      ...toRefs(state),
      wrapperHeight,
      toHistory,
      statusRender,
      statusColor,
      onAll,
      onSubmit
    }
  }
}
</script>
<style lang="scss" scoped>
.ddb {
  background-color: #fff;
  .content {
    margin: 16px;
    .tips {
      color: #ff9f3d;
    }
    .c-top {
      height: 312px;
      border-radius: 8px;
      margin-top: 16px;
      padding: 14px 10px;
      box-shadow: -10px -10px 10px rgba(216, 221, 240, 0.15),
        10px 10px 10px rgba(216, 221, 240, 0.15);
      .c-input {
        margin-top: 20px;
        border-bottom: 1px solid #f6f7fd;

        .ddb-img {
          width: 20px;
          height: 20px;
          margin-right: 13px;
        }
        .input-field {
          padding: 10px 0;
        }
        .all {
          width: 30px;
          color: #486bf6;
        }
        .van-cell:after {
          border-bottom: none;
        }
      }
      .money {
        height: 50px;
      }
      .line {
        border-bottom: 1px solid #f6f7fd;
      }
      .btn {
        height: 45px;
        background-color: #486bf6;
        color: #fff;
        border-radius: 8px;
      }
      .account {
        margin: 10px 0 20px 0;
      }
    }
  }
  footer {
    margin-top: 30px;
    .days-ago {
      margin-left: 16px;
    }
  }
}
</style>

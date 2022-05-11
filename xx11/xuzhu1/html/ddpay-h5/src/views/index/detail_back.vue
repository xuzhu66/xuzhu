<script setup>
// import AbNavBar from '@/components/AbNavBar'
import Scroll from '../../components/Scroll'
import myHeader from '../../components/Header'

import {
  reactive, toRefs, ref
} from 'vue'
import { Popup, Radio, RadioGroup } from 'vant'

export default {
  components: {
    Scroll,
    myHeader,
    [Popup.name]: Popup,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup
  },
  setup() {
    const wrapperHeight = ref(window.innerHeight)

    const state = reactive({
      tabActive: ref(0),
      radioActive: ref(0),
      tabs: [
        { name: 'DDB' },
        { name: 'USDT' }
      ],
      actions: [
        { name: '近7天', value: '0' },
        { name: '2个月（60天）', value: '1' },
        { name: '3个月（90天）', value: '2' },
        { name: '6个月（120天）', value: '3' }
      ],
      show: ref(false),
      checked: ref('0'),
      data: [
        { name: '出售DDB', status: '已完成', time: '01-27 3:52', num: '1,3000.0000', account: '2434T' },
        { name: '出售DDB', status: '已完成', time: '01-27 3:52', num: '1,3000.0000', account: '2434T' },
        { name: '出售DDB', status: '已完成', time: '01-27 3:52', num: '1,3000.0000', account: '2434T' },
        { name: '出售DDB', status: '已完成', time: '01-27 3:52', num: '1,3000.0000', account: '2434T' },
        { name: '出售DDB', status: '已完成', time: '01-27 3:52', num: '1,3000.0000', account: '2434T' },
        { name: '出售DDB', status: '已完成', time: '01-27 3:52', num: '1,3000.0000', account: '2434T' },
        { name: '出售DDB', status: '已完成', time: '01-27 3:52', num: '1,3000.0000', account: '2434T' },
        { name: '出售DDB', status: '已完成', time: '01-27 3:52', num: '1,3000.0000', account: '2434T' },
        { name: '出售DDB', status: '已完成', time: '01-27 3:52', num: '1,3000.0000', account: '2434T' },
        { name: '出售DDB', status: '已完成', time: '01-27 3:52', num: '1,3000.0000', account: '2434T' }
      ]
    })

    // tabs选择
    const onTabs = (index) => {
      state.tabActive = index
    }

    // 单选
    const onRadio = (item) => {
      state.radioActive = item
    }
    return {
      ...toRefs(state),
      onTabs,
      wrapperHeight,
      onRadio
    }
  }
}
</script>
<template lang="pug">
.detail
  // 导航栏
  my-header(:r-icon="require('../../assets/images/arrow.png')" title='资金明细' r-title='全部' @clickLeft='$router.go(-1)' @clickRight='show = true')
  main.content
    // 资金明细tabs
    .tabs.fz14.fw600.flex
      div(v-for='(item, index) in tabs' :key='index' :class='{active:tabActive === index}' @click='onTabs(index)') {{ item.name }}
    // 资金明细列表
    scroll(ref='indexScroll' :style="{ height: wrapperHeight - 130 + 'px' }")
      .list
        .s-content(v-for='(item, index) in data' :key='index')
          .title.flex-center-between
            .fz14.fw600 {{ item.name }}
            .fz12.fw500 {{ item.status }}
          .s-title.flex-center-between.fz12.fw500
            div
              .name 时间
              div {{ item.time }}
            div
              .name 数量
              div {{ item.num }}
            div
              .name 交易账号
              div {{ item.account }}
  // 明细筛选
  van-popup(v-model:show='show' round='' position='bottom' :style="{ height: '28%' }")
    .date-pop
      van-radio-group(v-model='checked' @change='onRadio')
        .flex-center-between(v-for='(item,index) in actions' :key='index' :class='{active: radioActive == index}')
          span {{ item.name }}
          van-radio(:name='item.value' checked-color='#33E264')

</template>

<style lang="scss" scoped>
.detail{
  .header{
    padding: 0 16px;
    height: 44px;
    background-color: #fff;
    .back-icon{
      width: 14px;
      height: 14px;
      margin-right: 14px;
    }
  }
  .content{
    padding: 16px;

    .tabs{
      //margin-top: 16px;
      margin-bottom: 16px;
      div{
        width: 172px;
        height: 34px;
        line-height: 34px;
        background: #fff;
      }
      div:first-child{
        border-radius: 8px 0px 0px 8px;
      }
      div:last-child{
        border-radius: 0px 8px 8px 0px;
      }
      .active{
        background: #486BF6;
        color: #fff;
      }
    }
    .list{
      background-color: #fff;
      //padding-top: 16px;
      border-radius: 8px;
      .s-content{
        height: 100px;
        border-bottom: 1px solid #F6F7FD;
        margin: 0 16px;
        .title{
          padding-top: 20px;
        }
        .title div:last-child{
          color: #33E264;
        }
        .s-title{
          margin-top: 15px;
          line-height: 20px;
          .name{
            color: #A1A0A0;
          }
        }
      }
      .s-content:last-child{
        border-bottom: none;
      }
    }
  }
  .date-pop{
    margin: 16px;
    div{
      height: 45px;
      line-height: 45px;
      text-align: left;
      padding:0 10px;
      border-radius: 8px;
      .active{
        background-color: #F6F7FD;
      }
    }
  }
}
</style>


<script>
import AbSkeleton from '@/components/AbSkeleton.vue'
import { Icon } from 'vant'
export default {
  components: {
    AbSkeleton,
    [Icon.name]: Icon
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    eyeFlag: {
      type: Boolean,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['onDetails', 'onCopy', 'onEyes'],
  setup(props, { emit }) {
    const clickItem = (item) => {
      emit(item)
    }
    return {
      clickItem
    }
  }
}
</script>

<template lang="pug">
AbSkeleton(:loading="loading" :row="3" title)
  article.content
    article.info
      article
        .title.btc
          .t1.btc
            span 钱包余额
            van-icon(:name="eyeFlag? 'eye-o' : 'closed-eye'" size='23' @click="clickItem('onEyes')")
          .t2.center(@click="clickItem('onDetails')")
            img(src='../../../assets/images/index/mx.png' alt='')
            |  明细

        .money.row {{ eyeFlag? `¥${data.avlAmt}` : `* * * * *` }}
      article
        .address
          .row 钱包地址：
          .row.bt(:data-clipboard-text='data.address') {{ data.address }}
            img.wallet(src='../../../assets/images/index/copy.png' :data-clipboard-text='data.address' alt='复制' @click="clickItem('onCopy')")
</template>

<style lang="scss" scoped>
@import '~@/assets/styles/common.scss';

.content{
  //width: 342px;
  min-height: 165px;
  background: url("../../../assets/images/index/wallet-bg.png") no-repeat;
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  //margin: 0 16px;
  .info{
    color: #E1E7FF;
    padding: 20px 18px;
    .title{
      .t1{
        font-weight: $font-weight-md;
        font-size: $font-size-14;
        span{
          margin-right: 13px;
        }
        .van-icon-eye-o{
          font-weight: $font-weight-md;
          color: #E1E7FF;
        }
      }
      .t2{
        width: 61px;
        height: 24px;
        background: #1E45D0;
        border-radius: 12px;
        font-size: $font-size-12;
        img{
          width: 11px;
          height: 11px;
          margin-right: 4px;
        }
      }
    }
    .money{
      margin-top: 9px;
      font-size: $font-size-24;
      font-weight: $font-weight-lg;
    }
    .address{
      margin-top: 30px;
      line-height: 20px;
      font-size: $font-size-12;
      font-weight: $font-weight-lg;
      img{
        width: 11px;
        height: 13px;
      }
      .bt {
        word-break: break-all;
        text-align: left;
      }
    }
  }
}
</style>

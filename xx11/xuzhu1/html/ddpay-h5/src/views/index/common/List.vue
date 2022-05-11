<script>
import AbSkeleton from '@/components/AbSkeleton.vue'
export default {
  components: {
    AbSkeleton
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['rechargeUsdt', 'toBuy', 'toDDB'],
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
article.currency
  AbSkeleton(:loading="loading" :row="3" title)
    div
      .content(v-for='(item,index) in list' :key='index')
        .flex-start-between
          .c-left.flex-center-start
            img(:src="require('../../../assets/images/index/'+ item.coinCode.toLowerCase() + '.png')")
            span.fz14.fw600 {{ item.coinCode }}
          .c-right.fw600
            div
              .fz20 {{ item.avlAmt }}
              .belike.fz12 ≈ {{ item.avlCNY }} CNY
        .c-bottom.flex-center-around.fz14.fontF6.fw500(v-if="item.coinCode == 'DDB'")
          div(@click="clickItem('toBuy')") 购买{{ item.coinCode }}
          .h
          div(@click="clickItem('toDDB')") 兑换{{ item.coinCode }}
        .c-bottom.flex-center-around.fz14.fontF6.fw500(v-else)
          div(@click="clickItem('rechargeUsdt')") 充值{{ item.coinCode }}
</template>

<style lang="scss" scoped>
.currency{
  background-color: #fff;
  border-radius: 16px;
  padding: 10px;
  .content{
    border-radius: 8px;
    border: 1px solid #F2F2F2;
    //height: 100px;
    padding: 10px;
    display:flex;
    flex-direction:column;
    margin-bottom: 10px;
    .c-left{
      img{
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
    }
    .c-right{
      text-align: right;
      .belike{
        color: #C4C4C4;
      }
    }
  }
  .content:last-child{
    margin-bottom: 0px;
  }
  .c-bottom{
    margin-top: 30px;
    .h{
      width: 1px;
      height: 8px;
      background-color: #B8BBC3;
    }
  }
}
</style>

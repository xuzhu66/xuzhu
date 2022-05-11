<script>
export default {
  emits: ['clickBuy'],
  setup(props, { emit }) {
    const onClickBuy = (index) => {
      console.log(index)
      emit('clickBuy', index)
    }
    return {
      onClickBuy
    }
  }
}
</script>
<template lang="pug">
article.buy.flex-center-between
  .buy-box.btc(@click='onClickBuy(0)')
    .buy-box-left
      .text-align-left
        img.icon-img(src='../../../assets/images/index/buy.png' alt='')
      .fz14.fw600 我要买
  .buy-box.flex-center-between(@click='onClickBuy(1)')
    .buy-box-right
      .text-align-left
        img.icon-img(src='../../../assets/images/index/sell.png' alt='')
      .fz14.fw600 我要卖
</template>

<style lang="scss" scoped>
.buy{
  background-color: #fff;
  //width: 342px;
  height: 80px;
  border-radius: 16px;
  margin: 15px auto;
  .buy-box{
    width: 154px;
    height: 60px;
    background: url("../../../assets/images/index/buy-icon.png") right bottom no-repeat;
    background-color: #FFF8F1;
    background-size: 30%;
    border-radius: 16px;
    .buy-box-left, .buy-box-right{
      margin-left: 12px;
      .icon-img{
        width: 17px;
        height: 13px;
      }
    }

  }
  .buy-box:last-child{
    background: url("../../../assets/images/index/sell-icon.png") right bottom no-repeat;
    background-color: #F1F7FF;
    background-size: 30%;
  }
}
</style>

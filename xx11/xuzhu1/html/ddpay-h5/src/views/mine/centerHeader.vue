<template lang="pug">
.header-page
  .left(@click="$emit('goBack')")
    .left-icon
  .center
    slot(name="default")
  .right
    slot(name='right')
</template>

<script>
export default {
  name: 'CenterHeader',
  emits: ['goBack']
}
</script>

<style lang="scss" scoped>
.header-page{
  position: fixed;
  width: 375px;
  height: 45px;
  left: 0px;
  top: 0px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #FFFFFF;
  z-index: 1;
  .left{
    flex:1;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding-left: 15px;
    .left-icon{
      background: url("~@/assets/images/center/rightjt.png") center/contain no-repeat;
      width: 9px;
      height: 16px;
      transform: rotate(180deg) ;
      margin-right: 10px;
    }
  }
  .center{
    flex:1.8;
  }
  .right{
    flex:1;
    text-align: right;
    padding-right: 15px;
    color: #A1A0A0;
    font-size: 14px;
  }
}

</style>

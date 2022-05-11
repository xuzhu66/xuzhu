<template lang="pug">
header.header.flex-center-between
  .fz20.fw600
    img.back-icon(src='../assets/images/index/back.png' alt='' @click='clickLeft')
    | {{ title }}
  .fz14.all.fw500(v-if='rTitle' @click='clickRight')
    | {{ rTitle }}
    img(:src='rIcon' alt='')
  .fz14.all.fw500.fontA1A(v-if='rTitle2' @click='clickRight') {{ rTitle2 }}
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: () => ''
    },
    rTitle: {
      type: String,
      default: () => ''
    },
    rIcon: {
      type: String,
      default: () => ''
    },
    rTitle2: {
      type: String,
      default: () => ''
    }
  },
  emits: ['clickLeft', 'clickRight'],
  setup(props, { emit }) {
    const clickLeft = () => {
      emit('clickLeft')
    }
    const clickRight = () => {
      emit('clickRight')
    }
    return {
      clickLeft,
      clickRight
    }
  }
}
</script>

<style lang="scss" scoped>
.header{
  padding: 0 16px;
  height: 44px;
  background-color: #fff;
  .back-icon{
    width: 14px;
    height: 14px;
    margin-right: 14px;
  }
  .all{
    img{
      width: 12px;
      height: 8px;
    }
  }
}
</style>

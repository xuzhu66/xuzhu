<template lang="pug">
article
  .top.flex-center-around.fz12.fontA1A.fw500
    div(v-for='(item,index) in titleItem' :key='index') {{ item.name }}
  scroll.content(ref='indexScroll' :style="{ height: wrapperHeight - 80 + 'px' }")
    .cell.flex-center-between.fw500.fz14(v-for='(item,index) in list' :key='index')
      div {{ item.time }}
      div {{ item.num }}
      div
        span.status(:style='{color: statusColor(item.status)}') {{ statusRender (item.status) }}
        van-icon(name='arrow')
</template>
<script>
import Scroll from '../components/Scroll'
import { ref } from 'vue'
import { Icon } from 'vant'

export default {
  components: {
    Scroll,
    [Icon.name]: Icon
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    titleItem: {
      type: Array,
      default: () => []
    },
    statusColor: {
      type: Function,
      default: () => ''
    },
    statusRender: {
      type: Function,
      default: () => ''
    }
  },
  setup() {
    const wrapperHeight = ref(window.innerHeight)
    return {
      wrapperHeight
    }
  }
}
</script>

<style lang="scss" scoped>
.top{
  height: 37px;
  border-bottom: 1px solid #F6F7FD;
  padding: 0 10px;
  background-color: #fff;
  div{
    flex: 1;
  }
}
.content{
  .cell{
    height: 55px;
    background-color: #fff;
    //border-radius: 8px;
    border-bottom: 1px solid #F6F7FD;
    div{
      flex: 1;
    }
    .status{
      margin-right: 14px;
    }
    .van-icon-arrow{
      color: #C4C4C4;
    }
  }
  .cell:last-child{
    border-bottom: none;

  }
}
</style>

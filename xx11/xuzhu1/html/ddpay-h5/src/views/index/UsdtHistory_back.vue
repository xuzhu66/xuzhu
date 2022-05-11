<template lang="pug">
.history
  // 导航栏
  my-header(:r-icon="require('../../assets/images/arrow.png')" title='历史记录' @clickLeft='$router.go(-1)' @clickRight='show = true')
  main
    // 历史记录
    history(:list='list' :status-color='statusColor' :status-render='statusRender' :title-item='titleList')

</template>
<script>
import myHeader from '../../components/Header'
import History from '../../components/History'

import {
  reactive, toRefs, ref, computed
} from 'vue'

export default {
  components: { myHeader, History },
  setup() {
    const state = reactive({
      show: ref(false),
      titleList: [
        { name: '时间' },
        { name: '数量' },
        { name: '状态' }
      ],
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
    // 状态
    const statusRender = computed(() => {
      return function(status) {
        switch (status) {
          case 1: return '已完成'
          case 2: return '进行中'
          case 3: return '失败'
        }
      }
    })
    // 状态颜色
    const statusColor = computed(() => {
      return function(status) {
        switch (status) {
          case 1: return '#33E264'
          case 2: return '#FF9F3D'
          case 3: return '#FF6666'
        }
      }
    })
    return {
      ...toRefs(state),
      statusRender,
      statusColor
    }
  }
}
</script>
<style lang="scss" scoped>
.history{
  background-color: #fff;
}
</style>

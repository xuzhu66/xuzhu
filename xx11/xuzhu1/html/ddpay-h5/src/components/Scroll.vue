<template lang="pug">
.wrapper(ref='wrapper')
  .content
    .box(v-if='isPullDown')
      van-loading.loading(:color='loadingColor' size='20px' text-color='#C8C9CC')
        van-icon(v-show='isShowArrow' :class='{ arrow: isArrow }' name='down')
          | {{ loadingText }}
    slot
</template>

<script>
import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'
import PullDown from '@better-scroll/pull-down'
import { onMounted, ref, reactive } from 'vue'
import emitter from '../plugins/common/Bus'
import { Loading, Icon } from 'vant'
BScroll.use(PullUp)
BScroll.use(PullDown)

export default {
  components: {
    // loading
    [Loading.name]: Loading,
    [Icon.name]: Icon
  },
  props: {
    isPullDown: {
      type: Boolean,
      default: false
    }
  },
  emits: ['pullingUp', 'scrollXy', 'pullingDown'],
  setup(props, { emit }) {
    const wrapper = ref(null)
    const scroll = reactive([])
    const pullDownLoading = ref(false)
    const loadingColor = ref('#fff')
    const loadingText = ref('下拉刷新')
    const isArrow = ref(false)
    const isShowArrow = ref(true)
    // 判断是否需要上拉刷新
    let obj = null
    if (props.isPullDown) {
      obj = {
        threshold: 50,
        stop: 50
      }
    } else {
      obj = false
    }
    onMounted(() => {
      scroll[0] = new BScroll(wrapper.value, {
        pullUpLoad: true,
        pullDownRefresh: obj,
        click: true
        // deceleration: 0
      })
      // 图片加载回调
      const debounces = () => {
        console.log('图片加载')
        scroll[0].refresh()
      }
      emitter.on('imgLoad', debounce(debounces, 20, this))
      // 监听下拉
      scroll[0].on('pullingUp', () => {
        emit('pullingUp')
      })
      // 监听上拉
      if (props.isPullDown) {
        scroll[0].on('pullingDown', () => {
          isShowArrow.value = false
          loadingColor.value = '#C8C9CC'
          loadingText.value = '加载中'
          setTimeout(() => {
            pullDownLoading.value = false
            emit('pullingDown')
            scroll[0].finishPullDown()
          }, 1000)
        })
        scroll[0].on('enterThreshold', () => {
          isShowArrow.value = true
          loadingColor.value = '#fff'
          loadingText.value = '下拉刷新'
          isArrow.value = false
        })
        scroll[0].on('leaveThreshold', () => {
          loadingText.value = '释放刷新'
          isArrow.value = true
        })
      }
      // 监听滚动坐标
      const positions = (position) => {
        emit('scrollXy', position)
      }
      scroll[0].on('scroll', debounce(positions, 20, this))
      // scroll[0].on('scroll', positions)
    })
    // 下拉停止
    const stopPullUp = () => {
      console.log('下拉停止')
      scroll[0].finishPullUp()
    }
    // 回到x y指定的距离
    const goXy = (x, y, time = 300) => {
      scroll[0].scrollTo(x, y, time)
    }
    // 防抖函数
    function debounce(fn, delay = 50, obj) {
      let timer = null
      return function(...args) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          fn.apply(obj, args)
        }, delay)
      }
    }
    return {
      scroll,
      wrapper,
      stopPullUp,
      goXy,
      loadingColor,
      loadingText,
      isArrow,
      isShowArrow
    }
  }
}
</script>

<style scoped lang="scss">
  .wrapper {
    overflow: hidden;
    .content {
      .box {
        color: #c8c9cc;
        font-size: 14px;
        .arrow {
          transform: rotate(180deg);
        }
      }
      .loading {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>

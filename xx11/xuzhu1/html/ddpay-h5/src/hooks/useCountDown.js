import { reactive, onBeforeUnmount, watch, ref, computed } from 'vue'
import { isNum } from '@/utils/validate'

export function useCountDown(count = ref(0)) {
  const newCount = ref(count)
  const state = reactive({
    count: 0,
    timer: null
  })
  const hms = computed(() => {
    return formatTime(state.count)
  })

  /**
   * 开始倒计时
   */
  function start() {
    clear()
    // console.log(count)
    state.count = newCount.value
    state.timer = setInterval(() => {
      state.count--
      if (state.count <= 0) {
        clear()
      }
    }, 1000)
  }

  /**
   * 清除倒计时
   */
  function clear() {
    if (state.timer) {
      clearInterval(state.timer)
    }
  }
  watch(
    count,
    (t) => {
      // console.log(t)
      if (t > 0) {
        start()
      }
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    clear()
  })
  start()
  return {
    state,
    start,
    clear,
    hms
  }
}

export function formatTime(value) {
  if (!isNum(value)) return '00:00:00'
  if (Number(value) <= 0) return '00:00:00'
  let secondTime = parseInt(value) // 秒
  let minuteTime = 0 // 分
  let hourTime = 0 // 小时
  if (secondTime > 60) {
    minuteTime = parseInt(secondTime / 60)
    secondTime = parseInt(secondTime % 60)
    if (minuteTime > 60) {
      hourTime = parseInt(minuteTime / 60)
      minuteTime = parseInt(minuteTime % 60)
    }
  }
  const secondTimePre = secondTime < 10 ? '0' : ''
  const timeS = '' + secondTimePre + parseInt(secondTime)

  let timeM
  if (minuteTime > 0) {
    const minuteTimePre = minuteTime < 10 ? '0' : ''
    timeM = minuteTimePre + parseInt(minuteTime)
  } else {
    timeM = '00'
  }

  let timeH
  if (hourTime > 0) {
    const hourTimePre = hourTime < 10 ? '0' : ''
    timeH = hourTimePre + parseInt(hourTime)
  } else {
    timeH = '00'
  }
  // console.log(time)
  return `${timeH}:${timeM}:${timeS}`
}

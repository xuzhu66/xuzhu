import { computed, ref, watch } from 'vue'
// import { isArray } from 'lodash'
// import { selectFilterName } from '@/utils/selectFilter'

export function useOrderDetail(keyVal, arrVal, typeVal, option) {
  // keyVal = isRef(keyVal) ? unref(keyVal) : keyVal
  // if ((keyVal ?? '') === '') return
  // if (!isArray(arrVal)) return
  // if (!isArray(typeVal)) return
  // console.log(keyVal)
  const keyValStr = ref(keyVal)
  // const arrValStr = computed(() => {
  //   return arrVal
  // })
  const typeValStr = computed(() => {
    return typeVal
  })
  const optionObj = computed(() => {
    return option
  })
  const key = ref(keyValStr)
  // const arr = ref(arrValStr)
  const type = ref(typeValStr)
  // const optionObj = ref(typeValStr)
  const label = ref('')
  const labelBtn = ref('')
  // going黄色 done绿色 cancel红色 blue蓝色
  const colorType = ref('')

  const runRes = () => {
    if (type.value === 'sell') {
      // 10-匹配中，90-已下架，91-已售罄
      if (key.value == 10) {
        label.value = '挂单中'
        colorType.value = 'going'
      } else if (key.value == 90) {
        label.value = '已下架'
        colorType.value = 'cancel'
      } else if (key.value == 91) {
        label.value = '已售罄'
        colorType.value = 'done'
      }
    } else if (type.value === 'trade') {
      // 20-待确认，30-待支付，40-已支付，50-申诉中，60-已放行，100-已完成，-100-已取消
      if (
        key.value == 20 ||
        key.value == 30 ||
        key.value == 40 ||
        key.value == 60
      ) {
        label.value = '进行中'
        colorType.value = 'blue'
      } else if (key.value == 50) {
        label.value = '申诉中'
        colorType.value = 'going'
      } else if (key.value == 100) {
        label.value = '已完成'
        colorType.value = 'done'
      } else if (key.value == -100) {
        label.value = '已取消'
        colorType.value = 'cancel'
      }
    } else if (type.value === 'tradeDetail') {
      // 20-待确认，30-待支付，40-已支付，50-申诉中，60-已放行，100-已完成，-100-已取消
      if (
        key.value == 20 ||
        key.value == 30 ||
        key.value == 40 ||
        key.value == 60
      ) {
        label.value = '订单进行中'
        colorType.value = 'going'
      } else if (key.value == 50) {
        label.value = '订单申诉中'
        colorType.value = 'going'
      } else if (key.value == 100) {
        label.value = '订单已完成'
        colorType.value = 'done'
      } else if (key.value == -100) {
        label.value = '订单已取消'
        colorType.value = 'cancel'
      }
    } else if (type.value === 'tradeGoing') {
      if (key.value == 20) {
        label.value = '进行中'
        labelBtn.value = '进行中'
        colorType.value = 'blue'
      } else if (key.value == 30) {
        colorType.value = 'blue'
        if (optionObj.value?.tradeRole == 10) {
          label.value = '待付款'
          labelBtn.value = '待付款'
        } else {
          label.value = '待买家付款'
          labelBtn.value = '待买家付款'
        }
      } else if (key.value == 40) {
        colorType.value = 'blue'
        if (optionObj.value?.tradeRole == 10) {
          label.value = '已付款，待放币'
          labelBtn.value = '待放币'
        } else {
          label.value = '已付款，待放币'
          labelBtn.value = '待放币'
        }
      }
    } else if (type.value === 'match') {
      // 10-匹配中 20-待确认，30-待支付，40-已支付，50-申诉中，60-已放行，100-已完成，-100-已取消
      // console.log(key.value)
      // console.log(key.value == 10)
      if (key.value == 10) {
        label.value = '订单匹配中'
        colorType.value = 'going'
      } else if (key.value == 20) {
        label.value = '等待买家付款'
        colorType.value = 'going'
      } else if (key.value == 30) {
        label.value = '等待买家付款'
        colorType.value = 'going'
      } else if (key.value == 40) {
        label.value = '等待卖家放币'
        colorType.value = 'going'
      } else if (key.value == 50) {
        label.value = '申诉中'
        colorType.value = 'going'
      } else if (key.value == 100) {
        label.value = '交易订单已完成'
        colorType.value = 'going'
      }
    } else if (type.value === 'matchSell') {
      // 10-匹配中 20-待确认，30-待支付，40-已支付，50-申诉中，60-已放行，100-已完成，-100-已取消
      // console.log(key.value)
      // console.log(key.value == 10)
      if (key.value == 10) {
        label.value = '订单匹配中'
        colorType.value = 'going'
      } else if (key.value == 20) {
        label.value = '订单匹配中'
        colorType.value = 'going'
      } else if (key.value == 30) {
        label.value = '等待买家付款'
        colorType.value = 'going'
      } else if (key.value == 40) {
        label.value = '待放币'
        colorType.value = 'going'
      } else if (key.value == 50) {
        label.value = '申诉中'
        colorType.value = 'going'
      } else if (key.value == 100) {
        label.value = '交易订单已完成'
        colorType.value = 'going'
      }
    }
  }

  runRes()

  watch(
    keyValStr,
    (t, o) => {
      // console.log(t)
      runRes()
    },
    { immediate: true }
  )

  // watch(
  //   arrValStr,
  //   (t, o) => {
  //     // console.log(t)
  //     runRes()
  //     console.log(label.value)
  //     console.log(colorType.value)
  //   },
  //   { immediate: true }
  // )

  watch(
    optionObj,
    (t, o) => {
      // console.log(t)
      runRes()
      // console.log(label.value)
      // console.log(colorType.value)
    },
    { deep: true }
  )
  return {
    label,
    colorType,
    labelBtn
  }
}

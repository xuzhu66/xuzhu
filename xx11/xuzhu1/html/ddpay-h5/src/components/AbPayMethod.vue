<script>
export default {
  name: 'AbPayMethod'
}
</script>
<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import { useVModel } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useSelectStore } from '@/store/modules/select'

const selectStore = useSelectStore()
const { paymentClassListAble } = storeToRefs(selectStore)
// const checked = ref(false)
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['update:modelValue', 'change'])

const modelValue = useVModel(props, 'modelValue', emit)
// const updateValue = (event) => {
//   // console.log(event)
//   modelValue.value = event
// }

const payMethodArr = ref([
  {
    name: '银行卡',
    value: 10,
    color: '',
    bg: '#FFF8F1',
    border: '#D69734',
    icon: 'abIconBank',
    shadow: 'bank'
  },
  {
    name: '微信',
    value: 30,
    color: '',
    bg: '#F1FFF0',
    border: 'green',
    icon: 'abIconWechat',
    shadow: 'wechat'
  },
  {
    name: '支付宝',
    value: 20,
    color: '',
    bg: '#F3F7FF',
    border: 'blue',
    icon: 'abIconAlipay',
    shadow: 'alipay'
  }
])
const changeMethod = (item, index) => {
  modelValue.value = item.payway
  emit('change', item.payway)
}
const getStyle = (item) => {
  let obj = {}
  const list = payMethodArr.value
  for (let i = 0; i < list.length; i++) {
    if (item.payway == list[i].value) {
      obj = list[i]
    }
  }
  return obj
}
</script>
<template>
  <div class="payBox flex-center-between">
    <div
      v-for="(item, index) in paymentClassListAble"
      :key="index"
      :style="{
        backgroundColor: getStyle(item).bg,
        borderColor: modelValue == item.payway ? getStyle(item).border : ''
      }"
      :class="[modelValue == item.payway ? 'active' : '', getStyle(item).shadow]"
      class="payMethodItem flex-center-center"
      @click="changeMethod(item)"
    >
      <div :class="getStyle(item).icon" class="payIcon"></div>
      <div>{{ item.payName }}</div>
    </div>
  </div>
</template>
<style lang="scss">
.payBox {
  padding: 0 10px;
}
.payMethodItem {
  width: 100px;
  height: 45px;
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  border-radius: 8px;
  &.active {
    border-width: 1.5px;
    border-style: solid;
    //box-shadow: 10px 10px;

    //214, 151, 52
    //0 128 0
    &.bank {
      box-shadow: 0px 10px 10px rgba(214, 151, 52, 0.1);
    }
    &.wechat {
      box-shadow: 0px 10px 10px rgba(0, 128, 0, 0.1);
    }
    &.alipay {
      box-shadow: 0px 10px 10px rgba(68, 103, 243, 0.1);
    }
  }
}
.payIcon {
  width: 18px;
  height: 18px;
  margin-right: 5px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.abIconBank {
  background-image: url('~@/assets/images/trade/abIconBank.png');
}
.abIconWechat {
  background-image: url('~@/assets/images/trade/abIconWechat.png');
}
.abIconAlipay {
  background-image: url('~@/assets/images/trade/abIconAlipay.png');
}
</style>

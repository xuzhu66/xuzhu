<script setup>
import { defineProps, defineEmits, useCssModule, ref } from 'vue'
import { useVModel } from '@/hooks/useVModel'
import tradeStyles from '@/assets/module/trade.module.scss'
// import { useStorage } from '@/hooks/useStorage'
import { useCssVar, useStorage } from '@vueuse/core'

const el = ref(null)
const color1 = useCssVar('--color-100', el)
color1.value = 'blue'
const props = defineProps({
  foo: {
    type: String,
    default: ''
  },
  bar: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits()

const bar = useVModel(props, 'bar', emit)
const foo = useVModel(props, 'foo', emit)

// console.log(foo.value) // props.foo
// foo.value = 'foo' // emit('update:foo', 'foo')
const updateFoo = (event) => {
  foo.value = event.target.value
}
const updateBar = (event) => {
  bar.value = event.target.value
}
const style = useCssModule()
console.log(style)
console.log(style.cc)

const myName = useStorage('my-name', '')
</script>

<template>
  <div>
    <div>color: {{ color1 }}</div>
    <div>my name: {{ myName }}</div>
    <input :value="foo" type="text" @input="updateFoo" />
    <input :value="bar" @input="updateBar" />
    <div :class="$style.red">red</div>
    <div :class="[$style.aa]">
      aa
      <div :class="[$style.cc, 'bb', 'libc']">bb</div>
    </div>
    <div :class="[tradeStyles.ddItem]">
      <div :class="['ffItem']"></div>
    </div>
  </div>
</template>

<style module lang="scss">
.red {
  color: red;
}
.redItem {
  color: red;
}
.aa {
  color: var(--color-100);
  .bb {
    color: blue;
  }
}
.cc {
  color: gold;
  .bb {
    color: green;
  }
}
</style>

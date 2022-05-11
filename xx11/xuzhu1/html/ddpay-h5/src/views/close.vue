<template>
  <div>接口加密功能：<Switch v-model="encrypt"></Switch></div>
</template>

<script setup>
import { Switch } from 'vant'
import { useStorage } from '@vueuse/core'
const encrypt = useStorage('encrypt', true)
</script>

<style scoped></style>

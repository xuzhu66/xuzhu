<template lang="pug">
.page-con
  centerHeader(@goBack="goBack")
  //.common-title 用户协议
  .page-flow
    h2 用户须知
    UserAgreementContent
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import centerHeader from '@/views/mine/centerHeader'
import { useRouter } from 'vue-router'
import UserAgreementContent from './userAgreementContent.vue'

export default defineComponent({
  name: 'UserAgreement',
  components: {
    centerHeader,
    UserAgreementContent
  },

  setup() {
    const router = useRouter()
    const state = reactive({
      item: {}
    })
    // 路由
    const jumpPage = (path) => {
      router.push({
        path: path
      })
    }
    // 回退
    const goBack = () => {
      router.push({ path: '/mine/setting' })
    }
    onMounted(() => {})
    return {
      ...toRefs(state),
      jumpPage,
      goBack
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/center.scss';

// 页面样式
.page-con {
  height: 100%;
  padding-top: 50px;
  padding-bottom: 50px;
  background-color: #f5f7fc;
  text-align: initial;
  font-size: 12px;
  .common-title {
    font-size: 20px;
    margin: 20px;
  }
  .page-flow {
    padding: 20px;
    .text {
      font-size: 13px;
      line-height: 21px;
      margin: 10px 0px 10px 10px;
    }
  }
}
</style>

<template>
  <div class="mine-page-main">
    <router-view />
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useCenterStore } from '@/store/modules/center'
export default {
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const centerStore = useCenterStore()
    const { userRegistInfo } = storeToRefs(userStore)
    const getUserRegistInfoAction = (param) => userStore.getUserRegistInfoAction(param)
    const dictionariesAction = (param) => centerStore.dictionariesAction(param)
    const getUserInfoAction = (param) => centerStore.getUserInfoAction(param)
    const getSystemParamAction = (param) => centerStore.getSystemParamAction(param)

    const state = reactive({
      center: ''
    })
    const jumpPage = (path) => {
      // 带查询参数，结果是 /register?plan=private
      router.push({ path: path, query: { type: 1 }})
    }
    // 获取数据字典
    const getDictionariesFun = () => {
      dictionariesAction({ codes: ['ID_VERIFY', 'USER_INFO_VERIFY_LEVEL', 'USER_INFO_KIND'] })
    }
    onMounted(() => {
      getUserRegistInfoAction().then((res) => {
        // console.log(res)
      })
      getDictionariesFun()
      // 用户信息
      getUserInfoAction().then(res => {})
      // 查询客服链接
      getSystemParamAction('csc.channel.access.link')
    })
    return {
      ...toRefs(state),
      userRegistInfo,
      userStore,
      jumpPage
    }
  }
}
</script>
<style lang="scss" scoped>
.mine-page-main{
  height: 100%;
  overflow: hidden;
  background: #fafafa;
  .app-flow{
    height: 100%;
    overflow :hidden;
    position :relative;
    z-index: 1;
  }
  .app-center{
    height :100%;
    overflow: auto;
    position :relative;
  }
}

.slide-right-enter-active {
  opacity: 0;
  transform: translateX(-100%);
  transition : all 0.25s ease;
}

.slide-right-leave-active {
  opacity: 0;
  transform: translateX(100%);
  transition : all 0.25s ease;
}

.slide-left-enter-active {
  opacity: 0;
  transform: translateX(100%);
  transition : all 0.25s ease;
}

.slide-left-leave-active {
  opacity: 0;
  transform: translateX(-100%);
  bottom: 0;
  transition:  all 0.25s ease
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 10ms;
  bottom: 0
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>

<template>
  <footer ref="tabBar">
    <tab-bar />
  </footer>
</template>

<script>
import TabBar from './common/TabBar.vue'

// import { useRouter } from 'vue-router'
// import { useStore } from 'vuex'
import { ref, onMounted } from 'vue'
export default {
  components: {
    TabBar
  },
  setup() {
    const tabBar = ref(null)
    // const router = useRouter()
    // const store = useStore()
    onMounted(() => {
      // store.commit('getTabBarHeight', tabBar.value.clientHeight)
      // console.log(useGetInfoStore, 111)
    })
    // const goPublish = () => {
    //   const publishShow = store.state.publishShow
    //   console.log(publishShow)
    //   if (publishShow) {
    //     router.back()
    //   } else {
    //     router.push('/game')
    //   }
    // }
    return {
      // goPublish,
      tabBar
    }
  }
}
</script>

<style>
footer {
  height: 50px;
}
</style>

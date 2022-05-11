<template>
  <div class="home">
    <router-view v-slot="{ Component }">
      <transition mode="out-in" name="slide-fade">
        <keep-alive :include="names">
          <component :is="Component" class="component" />
        </keep-alive>
      </transition>
    </router-view>
    <all-tab-bar v-if="$route.meta.showTab" />
  </div>
</template>
<script>

import AllTabBar from './components/tabBar/AllTabBar'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
export default {
  name: 'App',
  components: {
    AllTabBar
  },
  setup() {
    onMounted(() => {
      // console.log(process.env.NODE_ENV)
      // console.log(process.env.VUE_APP_BASE_URL)
    })

    const names = ref([])
    function multiarr(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].meta?.keepAlive && arr[i].meta?.name) {
          // component
          // console.log(arr[i])
          names.value.push(arr[i].meta.name)
        }
        // if (arr[i].name) {
        //   names.value.push(arr[i].name)
        // }
        if (arr[i].children && arr[i].children.length > 0) {
          multiarr(arr[i].children)
        }
      }
    }
    const router = useRouter()
    multiarr(router.options.routes)
    return {
      names
    }
  }

}
</script>
<style lang="scss">
html, body{
  &::-webkit-scrollbar{width:0px !important;}
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.home {
  //position: absolute;
  //top: 0px;
  //bottom: 0px;
  width: 100%;
  //background-color: #f5f7fc;
  background-color: var(--ab-page-container-background-color);

  .component {
    transition: all 0.1s cubic-bezier(0.58, 0.09, 0.33, 0.91);
  }

  .slide-fade-leave-to {
    transform: translate3d(-30%, 0, 0);
    opacity: 0;
  }

  .slide-fade-enter-from {
    transform: translate3d(10%, 0, 0);
    opacity: 0;
  }
}
</style>

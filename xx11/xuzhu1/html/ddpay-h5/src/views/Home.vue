<template>
  <main class="home">
    <router-view v-slot="{ Component }">
      <transition mode="out-in" name="slide-fade">
        <keep-alive :include="names">
          <component :is="Component" class="component" />
        </keep-alive>
      </transition>
    </router-view>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const names = ref([])
function multiarr(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].meta?.keepAlive) {
      // component
      names.value.push(arr[i].name)
    }
    // if (arr[i].name) {
    //   names.push(arr[i].name)
    // }
    if (arr[i].children && arr[i].children.length > 0) {
      multiarr(arr[i].children)
    }
  }
}
const router = useRouter()
multiarr(router.options.routes)
// console.log(names)
</script>

<style lang="scss"></style>

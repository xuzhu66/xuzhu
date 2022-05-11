<template>
  <div v-if="setShow" class="page" @click.stop>
    <div class="loading">
      <img src="../../assets/images/loading/pinwheel.gif" height="32" width="32" />
      <div class="text">加载中</div>
    </div>

  </div>
</template>
<script>
import { ref } from 'vue'
export default {
  name: 'Loading',
  setup() {
    const setShow = ref(false)

    const show = () => {
      setShow.value = true
    }

    const hide = () => {
      setShow.value = false
    }

    return {
      setShow,
      show,
      hide
    }
  }
}
</script>

<style scoped>
.page {
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.3);
}
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 30vw;
  height: 30vw;
  border-radius: 6px;
  background-color: #fff;
}
.text{
  font-size: 12px;
  margin-top: 10px;
}
</style>

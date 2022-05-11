<template lang="pug">
.page-con
    .page-flow
        .im-ifram-con
            iframe(:src="serviceUrl",height="100%",frameborder="0")
            .title(@click="goBack")

</template>

<script>
import { useCenterStore } from '@/store/modules/center'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

export default {
  name: 'Chat',
  components: {},
  setup() {
    const router = useRouter()
    const centerStore = useCenterStore()
    const { serviceUrl } = storeToRefs(centerStore)
    const goBack = () => {
      console.log('11111111')
      router.go(-1)
    }
    const testFun = () => {
      console.log('234234')
    }
    return {
      serviceUrl: serviceUrl,
      goBack: goBack,
      testFun: testFun
    }
  },
  watch: {},
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.page-con {
  position: relative;
  .page-flow {
    position: relative;
    .im-ifram-con {
      position: fixed;
      top: 0px;
      left: 0;
      right: 0;
      bottom: 0px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      z-index: 1;
      iframe {
        width: 100%;
        height: 100%;
        border: 0;
        padding-bottom: 0;
        vertical-align: bottom;
        //padding-top: 45px;
      }
      .title{
        position: absolute;
        width: 18px;
        height: 24px;
        line-height: 45px;
        background-color: skyblue;
        z-index: 2;
        top: 10px;
        left: 10px;
        cursor: pointer;
        background: url("~@/assets/images/center/rightjt.png") center/contain no-repeat;
        transform: rotate(180deg) ;
      }
    }
  }
}

</style>

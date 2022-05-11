<template lang="pug">
.page-con
  centerHeader(@goBack="goBack")
  .common-title 消息类型
  .page-flow
    .list-con
      .item
        .top
          span.point(v-if="!currtMsg.viewStatus")
          span.text {{currtMsg.title}}
          span.time {{currtMsg.createdTime}}
        .down {{currtMsg.content}}

</template>

<script>
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import centerHeader from '@/views/mine/centerHeader'
import { useRouter } from 'vue-router'
import { useCenterStore } from '@/store/modules/center'
import { storeToRefs } from 'pinia'

export default defineComponent({
  name: 'MessageDetail',
  components: {
    centerHeader
  },

  setup() {
    const centerStore = useCenterStore()
    const { currtMsg } = storeToRefs(centerStore)
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
      router.push({ path: '/mine/message' })
    }
    onMounted(() => {
      console.log(currtMsg.value)
      if (centerStore.currtMsg) {
        state.item = centerStore.currtMsg
      } else {
        goBack()
      }
    })
    return {
      ...toRefs(state),
      jumpPage,
      goBack,
      currtMsg
    }
  }

})
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/center.scss";

// 页面样式
.page-con {
  height: 100%;
  padding-top:50px;
  padding-bottom: 50px;
  background-color: #f5f7fc;
  text-align: initial;
  .common-title{
    font-size:20px;
    margin: 20px;
  }
  .page-flow {
    .list-con {
      min-height: 108px;
      .item {
        width: 345px;
        min-height: 108px;
        background: #fff;
        border-radius: 8px;
        margin: 0px auto 10px;
        position: relative;
        padding-left: 10px;
        .status {
          width: 40px;
          height: 18px;
          background: #1575ff;
          border-radius: 8px 0px 8px 0px;
          position: absolute;
          top: 0px;
          left: 0px;
          font-size: 12px;
          font-weight: 400;
          color: #fff;
          line-height: 18px;
          text-align: center;
        }
        .top {
          position: relative;
          align-items: center;
          display: flex;
          flex-direction: row;
          //border: 1px solid skyblue;
          padding-top: 15px;
          .point{
            width: 6px;
            height: 6px;
            flex: none;
            border-radius: 50%;
            background-color: red;
            margin-right: 4px;
          }
          .text {
            flex: 1;
            justify-content: flex-start;
            align-items: flex-end;
            color: #4d4d4d;
            font-size: 14px;
            font-weight: 600;
          }
          .time {
            flex: none;
            align-items: flex-end;
            color: #ccc;
            font-size: 12px;
            padding-right: 10px;
          }
        }
        .down {
          position: relative;
          min-height: 69px;
          font-size: 14px;
          line-height: 22px;
          margin: 12px 0px;
          padding-bottom: 10px;
        }
        .detail {
          height: 24px;
          font-weight: 500;
          color: #1575ff;
          text-align: right;
          font-size: 12px;
          padding-right: 20px;
        }
        &.hasRead {
          .top {
            .text {
              color: #ccc;
            }
          }
          .down {
            color: #ccc;
          }
        }
      }
    }

  }
}

</style>

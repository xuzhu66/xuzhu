<template lang="pug">
.page-con
  centerHeader(@goBack="goBack")
    template(v-slot:right)
      span(@click="openPopUpAction") {{currt.value}}
      span.down-icon
  .common-title 消息中心
  .page-flow
    van-pull-refresh(v-model='refreshing' @refresh='onRefresh')
      van-list(v-model='loading' :finished='finished' finished-text='~~没有更多了~~' error-text="请求失败，点击重新加载" @load='onLoad' offset="10")
        .list-con
          .item(v-for='(item,index) in list' :key='index' @click="goMessageDetail(item)" :class="item.viewStatus == 1?'hasRead':''")
            .top
              span.point(v-if="item.viewStatus == 0")
              span.text {{item.title}}
              span.time {{item.createdTime}}
            .down {{item.content}}
        .loadding(v-if="loading && list.length>0")
          van-loading(size='24px' color="#1989fa" ) 加载中...
        .nodata(v-if="list.length == 0")

  van-popup(:show="show" closeable round close-icon="close" position='bottom' :style="{ height: '45%' }" @close="onCancelAction" @click-overlay="onCancelAction")
    ul.pop-con
      li(v-for="item in messageTypeList" :class="currt.key==item.key?'active':''" @click="selectQuery(item)") {{item.value}}

</template>

<script>
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import centerHeader from '@/views/mine/centerHeader'
import { useRouter } from 'vue-router'
import { useCenterStore } from '@/store/modules/center'
import { storeToRefs } from 'pinia'
import { PullRefresh, List, Popup, Loading } from 'vant'

export default defineComponent({
  name: 'Message',
  components: {
    centerHeader,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Popup.name]: Popup,
    [Loading.name]: Loading
  },
  setup() {
    const centerStore = useCenterStore()
    const { dictionary } = storeToRefs(centerStore)
    const getMsgPageAction = (param) => centerStore.getMsgPageAction(param)

    const getDictionaryAction = (param) => centerStore.getDictionaryAction(param)
    const setMsgStatusAction = (param) => centerStore.setMsgStatusAction(param)
    const getMsgNotReadCountAction = (param) => centerStore.getMsgNotReadCountAction(param)
    const router = useRouter()
    const state = reactive({
      list: [], // 列表
      loading: false, // 加载中
      finished: false, // 加载完毕,最后一页
      refreshing: false, // 刷新 重新加载
      currtTab: 1, // 1:通知消息 2:系统公告
      newsType: 1, // 消息类型;消息类型0-系统，1-通知 */
      query: {
        current: 0,
        size: 10
      },
      tongzhiHasNewFlag: false, // 系统新消息
      sysHasNewFlag: false, // 系统新消息
      hasNewFlag: false, // 所有的消息
      show: false, // 搜索弹框
      actions: [{ name: '选项一' }, { name: '选项二' }, { name: '选项三' }],
      currt: { value: '全部', key: '', sort: 0 }, // 当前选中的查询条件
      messageTypeList: []// 消息类型列表
    })

    const jumpPage = (path) => {
      router.push({
        path: path
      })
    }
    const onLoad = () => {
      // 如果总条数大于等于最大数量, 停止请求
      if (state.finished) {
        return
      }
      state.loading = true
      // 刷新 , 重新加载
      if (state.refreshing) {
        state.query.current = 0
        state.list = []
        state.refreshing = false
      }
      state.query.current = state.query.current + 1
      getMsgList()
    }
    // 刷新
    const onRefresh = () => {
      // 清空列表数据
      state.finished = false
      // 将 loading 设置为 true，表示处于加载状态
      state.loading = true
      // 刷新标识
      state.refreshing = true
      onLoad()
    }
    const goMessageDetail = (item) => {
      // 设置已读
      setMsgStatusAction({ id: item.id })
      // 未读消息数量
      getMsgNotReadCountAction({ kindCodeIds: [] })
      centerStore.currtMsg = item
      const url = '/mine/message/detail/' + item.id
      jumpPage(url)
    }
    const testClick = () => {
      state.list.push({
        id: '2222',
        name: 'test',
        createdTime: '2022-12-12 12:12:12',
        message: 'asdfadsfasdfadsf'
      })
    }
    const onCancelAction = () => {
      state.show = false
    }
    const openPopUpAction = () => {
      state.show = true
    }
    const selectQuery = (item) => {
      state.currt = item
      onCancelAction()
      onRefresh()
    }
    const goBack = () => {
      router.push({ path: '/mine/center' })
    }
    // 获取消息类型列表
    const getMessageTypeList = () => {
      if (!dictionary.value['NEWS_KIND_CODE']) {
        getDictionaryAction('NEWS_KIND_CODE').then(res => {
          state.messageTypeList = res
          state.messageTypeList.push({ value: '全部', key: '', sort: 0 })
          state.messageTypeList.sort(function(a, b) {
            return (a.sort - b.sort)
          })
        })
      }
    }
    // 获取消息列表
    const getMsgList = () => {
      const param = {
        kindCodeIds: state.currt.key ? [state.currt.key] : [],
        current: state.query.current,
        size: state.query.size
      }
      state.loading = true
      try {
        getMsgPageAction(param).then(res => {
          state.loading = false
          state.list.push(...res.records)
          centerStore.temp = state.list
          // 判断是否是最后一页
          if (res.current >= res.pages) {
            state.finished = true
          }
        }).catch((err) => {
          console.log(err)
          state.loading = false
        })
      } finally {
        state.loading = false
      }
    }
    onMounted(() => {
      state.currt = { value: '全部', key: '', sort: 0 }
      getMessageTypeList()
    })
    return {
      ...toRefs(state),
      jumpPage,
      onLoad,
      onRefresh,
      goMessageDetail,
      testClick,
      openPopUpAction,
      onCancelAction,
      selectQuery,
      goBack
    }
  }

})
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/center.scss";

// 公用样式
.nodata{
  background: url("~@/assets/images/center/nodata.png") center/contain no-repeat;
  width: 190px;
  height: 222px;
  margin: 10px auto;
}
.down-icon{
  background: url("~@/assets/images/center/down.png") center/contain no-repeat;
  width: 12px;
  height: 12px;
  display: inline-block;
}
.loadding{
  text-align: center;
}
// 页面样式
.page-con {
  height: 100vh;
  overflow-y: auto;
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
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          font-size: 14px;
          line-height: 22px;
          margin: 12px 0px;
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

// 弹出框样式
.pop-con{
  margin-top: 45px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  //height: calc(100% - 50px);

  padding: 20px;
  li{
    flex: none;
    @include flex-fun;
    justify-content: flex-start;
    width: 343px;
    height: 45px;
    padding-left: 10px;
    margin-bottom: 10px;
    position: relative;
    &.active{
      background: #F6F7FD;
      border-radius: 8px;
      &:after{
        content: '';
        width: 16px;
        height: 16px;
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        z-index: 2;
        border-radius: 50%;
        background: url("~@/assets/images/center/select.png") center/contain no-repeat;
      }
    }
  }
}
</style>

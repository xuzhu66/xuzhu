<template lang="pug">
.page-con
  centerHeader(@goBack="goBack")
    //template(v-slot:right)
      span(@click="openPopUpAction") 全部
      span.down-icon
  .common-title 推广明细
  .page-flow
    van-pull-refresh(v-model='refreshing' @refresh='onRefresh')
      van-list(v-model='loading' :finished='finished' finished-text='~~没有更多了~~' error-text="请求失败，点击重新加载" @load='onLoad' offset="0")
        .list-con
          .item(v-for='(item,index) in list' :key='index')
            .top
              span.text {{item.username}}
              span.time {{item.time}}
        .loadding(v-if="loading && list.length>0")
          van-loading(size='24px' color="#1989fa" ) 加载中...
        .nodata(v-if="list.length == 0")

  van-popup(:show="show" closeable round close-icon="close" position='bottom' :style="{ height: '45%' }" @close="onCancelAction" @click-overlay="onCancelAction")
    ul.pop-con
      li(:class="currt==0?'active':''" @click="selectQuery(0)") 全部
      li(:class="currt==1?'active':''" @click="selectQuery(1)") 系统消息
      li(:class="currt==2?'active':''" @click="selectQuery(2)") 买入
      li(:class="currt==3?'active':''" @click="selectQuery(3)") 卖出
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import centerHeader from '@/views/mine/centerHeader'
import { useRouter } from 'vue-router'
import { useCenterStore } from '@/store/modules/center'
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
    const getInviteListAction = (param) => centerStore.getInviteListAction(param)
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
        size: 20
      },
      tongzhiHasNewFlag: false, // 系统新消息
      sysHasNewFlag: false, // 系统新消息
      hasNewFlag: false, // 所有的消息
      show: false, // 搜索弹框
      actions: [{ name: '选项一' }, { name: '选项二' }, { name: '选项三' }],
      currt: ''// 当前选中的查询条件
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
    const onRefresh = () => {
      // 清空列表数据
      state.finished = false
      // 将 loading 设置为 true，表示处于加载状态
      state.loading = true
      state.refreshing = true
      onLoad()
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
    }
    const goBack = () => {
      router.push({ path: '/mine/center' })
    }
    // 获取消息列表
    const getMsgList = () => {
      const param = {
        current: state.query.current,
        size: state.query.size
      }
      state.loading = true
      try {
        getInviteListAction(param).then(res => {
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
      state.currt = ''
    })
    return {
      ...toRefs(state),
      jumpPage,
      onLoad,
      onRefresh,
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
        background: #fff;
        margin: 0px auto;
        position: relative;
        padding-left: 10px;
        height: 60px;
        line-height: 60px;
        border-bottom: 1px solid #F6F7FD;
        &:first-child{
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        &:last-child{
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }

        .top {
          position: relative;
          align-items: center;
          display: flex;
          flex-direction: row;
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
      }
    }

  }
}
</style>

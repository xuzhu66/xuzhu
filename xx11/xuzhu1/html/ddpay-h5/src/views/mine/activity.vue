<template lang="pug">
.page-con
  centerHeader(@goBack="goBack")
    //template(v-slot:right)
      span(@click="openPopUpAction") 全部
      span.down-icon
  .common-title 设备活动
  .action-con
    .tabs
      .tab(@click="changeQuery(1)" :class="currtQuery == 1?'active':''") 登陆
      .tab(@click="changeQuery(2)" :class="currtQuery == 2?'active':''") 安全
    .search-con
      .day
        van-dropdown-menu(active-color="#1989fa")
          van-dropdown-item(v-model='day' :options='option' @change="selectTime")
          van-dropdown-item(v-model='status' :options='option2' @change="selectStatus")
  .page-flow
    van-pull-refresh(v-model='refreshing' @refresh='onRefresh')
      van-list(v-model='loading' :finished='finished' finished-text='~~没有更多了~~' error-text="请求失败，点击重新加载" @load='onLoad' offset="0")
        .list-con
          .item(v-for='(item,index) in list' :key='index')
            .top
              span.text {{item.name}}
              span.time {{item.createdTime}}
            .down
              .down-item
                span 平台
                span {{item.platform}}
              .down-item
                span 设备型号
                span {{item.version}}
              .down-item
                span 位置
                span {{item.address}}
              .down-item
                span IP地址
                span {{item.ip}}

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
import { storeToRefs } from 'pinia'
import { Popup, PullRefresh, List, Loading, DropdownMenu, DropdownItem } from 'vant'
export default defineComponent({
  name: 'Activity',
  components: {
    centerHeader,
    [Popup.name]: Popup,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Loading.name]: Loading,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem
  },
  setup() {
    const centerStore = useCenterStore()
    const { dictionary } = storeToRefs(centerStore)
    const loginLogAction = (param) => centerStore.loginLogAction(param) // 活动-登录
    const loginAuthLogAction = (param) => centerStore.loginAuthLogAction(param) // 活动-安全
    const getDictionaryAction = (param) => centerStore.getDictionaryAction(param)

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
      currt: '', // 当前选中的查询条件
      day: 1, // 时间
      status: 0,
      option: [
        { text: '1天', value: 1 },
        { text: '7天', value: 7 },
        { text: '1个月', value: 30 },
        { text: '3个月', value: 90 }
      ],
      option2: [
        { text: '全部', value: 0 },
        { text: '成功', value: 1 },
        { text: '失败', value: 2 }
      ],
      currtQuery: 1,
      dateTypeList: [], // 查询时间列表
      statusTypeList: []// 查询状态列表
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
      onLoad()
    }
    const goMessageDetail = (item) => {
      centerStore.currtMsg = item
      const url = '/mine/message/detail/' + item.id
      jumpPage(url)
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
      router.push({ path: '/mine/safeCenter' })
    }
    const changeQuery = (item) => {
      state.currtQuery = item
      state.query.current = 0
      state.refreshing = true
      onRefresh()
    }
    // 获取活动-登录列表
    const getLoginLogList = () => {
      const param = {
        type: state.currtQuery,
        current: state.query.current,
        size: state.query.size
      }
      state.loading = true
      try {
        loginLogAction(param).then(res => {
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
    // 活动-安全
    const getloginAuthLogList = () => {
      const param = {
        type: state.currtQuery,
        current: state.query.current,
        size: state.query.size
      }
      state.loading = true
      try {
        loginAuthLogAction(param).then(res => {
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
    const getMsgList = () => {
      if (state.currtQuery === 1) {
        getLoginLogList()
      } else {
        getloginAuthLogList()
      }
    }
    // 获取时间类型列表
    const getAppDateTypeList = () => {
      if (!dictionary.value['APP_DATE_QUERY']) {
        getDictionaryAction('APP_DATE_QUERY').then(res => {
          state.dateTypeList = res
          state.dateTypeList.push({ value: '全部', key: '', sort: 0 })
          state.dateTypeList.sort(function(a, b) {
            return (a.sort - b.sort)
          })
        })
      }
    }
    // 获取状态类型列表
    const getStatusList = () => {
      if (!dictionary.value['LOGIN_TYPE']) {
        getDictionaryAction('LOGIN_TYPE').then(res => {
          state.statusTypeList = res
          state.statusTypeList.push({ value: '全部', key: '', sort: 0 })
          state.statusTypeList.sort(function(a, b) {
            return (a.sort - b.sort)
          })
        })
      }
    }
    const selectTime = (item) => {
      onRefresh()
    }
    const selectStatus = (item) => {
      onRefresh()
    }

    onMounted(() => {
      state.currt = { value: '全部', key: '', sort: 0 }
      getAppDateTypeList()
      getStatusList()
      console.log(state.dateTypeList)
    })
    return {
      ...toRefs(state),
      jumpPage,
      onLoad,
      onRefresh,
      goMessageDetail,
      openPopUpAction,
      onCancelAction,
      selectQuery,
      goBack,
      changeQuery,
      selectTime,
      selectStatus
    }
  }

})
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/center.scss";

::v-deep .van-dropdown-menu__bar{
  background: transparent !important;
  box-shadow: none !important;
}

::v-deep .van-dropdown-menu__title{
  color: #A1A0A0 !important;
  font-size: 14px !important;
}

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
  .action-con{
    padding: 0 10px;
    @include flex-fun;
    .tabs{
      flex: 1;
      @include flex-fun;
      .tab{
        flex: 1;
        height: 34px;
        line-height: 34px;
        &:last-child{
          border-radius: 0px 8px 8px 0px;
        }
        &:first-child{
          border-radius: 8px 0px 0px 8px;
        }

        font-weight: 600;
        color: #333333;
        text-align: center;
        background: #FFFFFF;
        &.active{
          background: #486BF6;
          color: #fff;

        }
      }
    }
    .search-con{
      flex: 1;
    }
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
          align-items: flex-start;
          display: flex;
          flex-direction: column;
          padding-top: 10px;
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
        .down{
          padding: 10px 10px 10px 0px;
          .down-item{
            height: 36px;
            display: flex;
            flex-direction: row;
            span{
              flex: 1;
              color: #A1A0A0;
              font-size: 14px;
              font-weight: 500;
              &:last-child{
                flex: none;
              }
            }
          }
        }
      }
    }

  }
}
</style>

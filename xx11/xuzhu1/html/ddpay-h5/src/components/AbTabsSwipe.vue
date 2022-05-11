<script>
export default {
  name: 'AbTabsSwipe'
}
</script>
<script setup>
import { defineProps, defineEmits, ref, onMounted, onActivated } from 'vue'
import { Tab, Tabs, List, PullRefresh } from 'vant'
import { useVModel, useCssVar } from '@vueuse/core'
import AbSkeleton from '@/components/AbSkeleton.vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
// import { useRouter } from 'vue-router'

// const router = useRouter()
// router.afterEach((to, from) => {
//   if (props.toDetailName.includes(from.name)) {
//     console.log(from)
//     if (toDetail.value == true) {
//       // 恢复滚动位置
//       const arr = scrollPositionArr.value
//       for (let i = 0; i < arr.length; i++) {
//         const scrollDiv = document.querySelectorAll(
//           `.${props.className} .abTabsSwipeHeight`
//         )
//         console.log(scrollDiv)
//         scrollDiv[i].scrollTo({ top: arr[i].scrollTop })
//       }
//     }
//   }
//   return true
// })
const toDetail = ref(false)
const scrollPositionArr = ref([])
onBeforeRouteLeave((to, from) => {
  // console.log('onBeforeRouteLeave')
  // console.log(to)
  // console.log(from)
  if (props.toDetailName.includes(to.name)) {
    // console.log(props.toDetailName)
    toDetail.value = true
    // 存储滚动位置
    scrollPositionArr.value = []
    const arr = props.dataList
    for (let i = 0; i < arr.length; i++) {
      const scrollDiv = document.querySelectorAll(
        `.${props.className} .abTabsSwipeHeight`
      )
      const obj = {
        scrollTop: scrollDiv[i].scrollTop
      }
      scrollPositionArr.value.push(obj)
      // console.log(scrollPositionArr.value)
    }
  } else {
    toDetail.value = false
  }
})

onActivated(() => {
  // console.log('onActivated')
  // console.log(toDetail.value)
  if (toDetail.value == true) {
    // 恢复滚动位置
    const arr = scrollPositionArr.value
    for (let i = 0; i < arr.length; i++) {
      const scrollDiv = document.querySelectorAll(
        `.${props.className} .abTabsSwipeHeight`
      )
      // console.log(scrollDiv)
      scrollDiv[i].scrollTo({ top: arr[i].scrollTop })
    }
  }
})
// watch(
//   router,
//   (route) => {
//     console.log(route)
//   },
//   { immediate: true }
// )

// onDeactivated(() => {
//   // console.log('onDeactivated')
// })

// const checked = ref(false)
const props = defineProps({
  className: {
    type: String,
    default: 'abTabsSwipeList'
  },
  tabActive: {
    type: Number,
    default: 0
  },
  tabs: {
    type: Array,
    default: () => {
      return []
    }
  },
  dataList: {
    type: Array,
    default: () => {
      return []
    }
  },
  navBarBackground: {
    type: String,
    default: ''
  },
  titleThemeColor: {
    type: String,
    default: ''
  },
  titleActiveColor: {
    type: String,
    default: ''
  },
  titleInactiveColor: {
    type: String,
    default: ''
  },
  showTab: {
    type: Boolean,
    default: false
  },
  beforeRefresh: {
    type: Boolean,
    default: false
  },
  finishedText: {
    type: String,
    default: '已加载全部'
  },
  toDetailName: {
    type: Array,
    default: () => {
      return []
    }
  },
  swipeable: {
    type: Boolean,
    default: true
  },
  bottomHeight: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits([
  'changeTab',
  'update:tabActive',
  'update:navBarBackground',
  'update:titleActiveColor',
  'update:titleInactiveColor',
  'update:titleThemeColor',
  'refresh'
])

const tabActive = useVModel(props, 'tabActive', emit)

const changeMethod = (index) => {
  tabActive.value = index
  emit('changeTab', index)
}

const navBarBackground = useVModel(props, 'navBarBackground', emit)
const titleActiveColor = useVModel(props, 'titleActiveColor', emit)
const titleInactiveColor = useVModel(props, 'titleInactiveColor', emit)
const titleThemeColor = useVModel(props, 'titleThemeColor', emit)
const checkColor = () => {
  const navBarBackgroundVar = useCssVar('--ab-page-container-background-color')
  const titleActiveColorVar = useCssVar('--ab-button-main-color')
  const titleInactiveColorVar = useCssVar('--ab-button-gray-text-color')
  const titleThemeColorVar = useCssVar('--ab-button-main-color')
  if (!props.navBarBackground) {
    navBarBackground.value = navBarBackgroundVar
  }
  if (!props.titleActiveColor) {
    titleActiveColor.value = titleActiveColorVar
  }
  if (!props.titleInactiveColor) {
    titleInactiveColor.value = titleInactiveColorVar
  }
  if (!props.titleThemeColor) {
    titleThemeColor.value = titleThemeColorVar
  }
  // console.log(navBarBackgroundVar.value)
}
checkColor()
// const innerHeight = ref(0)
// innerHeight.value = window.innerHeight
const wrapperHeight = ref(window.innerHeight)
const abTabsSwipeListTop = ref(null)
const route = useRoute()
onMounted(() => {
  const offsetTop = abTabsSwipeListTop.value.$el.offsetTop
  // console.log(offsetTop)
  // console.log(route.meta.showTab)
  let tabHeight = 0
  if (route.meta.showTab) {
    const tabDiv = document.querySelector(`.homeVanTabbar`)
    if (tabDiv) {
      tabHeight = tabDiv.offsetHeight
    }
    // console.log(tabHeight)
  }
  // console.log(offsetTop)
  wrapperHeight.value =
    window.innerHeight - offsetTop - props.bottomHeight - tabHeight
})

const onRefresh = (item, index) => {
  if (!props.beforeRefresh) {
    item.finished = false
    item.current = 1
    item.onLoad()
  }
  emit('refresh', item, index)
}
// const listMinHeight = (item) => {
//   return item.items.length > 0 && !item.loading ? wrapperHeight.value + 'px' : 0
// }
</script>
<template>
  <Tabs
    ref="abTabsSwipeListTop"
    class="abTabsSwipe"
    :class="[{ hideTab: !showTab }, className]"
    :active="tabActive"
    :offset="400"
    :swipeable="swipeable"
    :background="navBarBackground"
    :title-active-color="titleActiveColor"
    :title-inactive-color="titleInactiveColor"
    :color="titleThemeColor"
    @change="changeMethod"
  >
    <Tab
      v-for="(item, index) in dataList"
      :ref="'tabs' + index"
      :key="item.id"
      :title="item.title"
      class="abTabsSwipeHeight"
      :style="{ height: wrapperHeight + 'px' }"
    >
      <PullRefresh
        v-model="item.refreshing"
        class="abTabsSwipeRefresh"
        @refresh="onRefresh(item, index)"
      >
        <List
          :loading="item.loading"
          :finished="item.finished"
          :style="{ minHeight: wrapperHeight + 'px' }"
          @load="item.onLoad"
        >
          <div>
            <div class="abTabsSwipeTopContent">
              <slot name="topContent"></slot>
            </div>
            <div class="abTabsSwipeListCenter">
              <div
                v-for="(itemCell, itemCellIndex) in item.items"
                :key="itemCellIndex"
              >
                <slot :item="itemCell"></slot>
              </div>
            </div>
            <div
              v-if="item.items.length === 0 && item.finished"
              class="abNoDataIconBox"
              :style="{ height: wrapperHeight - 3 + 'px' }"
            >
              <div class="abNoDataIcon"></div>
            </div>
          </div>
          <template #loading>
            <slot name="loading">
              <AbSkeleton :row="3" loading></AbSkeleton>
            </slot>
          </template>
        </List>
      </PullRefresh>
    </Tab>
  </Tabs>
</template>
<style lang="scss">
.abTabsSwipe {
  &.hideTab {
    .van-tabs__wrap {
      display: none;
    }
  }
  .van-tab__panel {
    //min-height: 100%;
    //height: 100%;
  }
}
.abTabsSwipeRefresh {
  //min-height: 100%;
  //height: 100%;
}
.abTabsSwipeHeight {
  //height: calc(innerHeight - 156px);
  //max-height: calc(100% - 146px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.abNoDataIconBox {
  display: flex;
  align-items: center;
  justify-content: center;
}
.abNoDataIcon {
  width: 190px;
  height: 210.89px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url('~@/assets/images/index/noData.png');
}
</style>

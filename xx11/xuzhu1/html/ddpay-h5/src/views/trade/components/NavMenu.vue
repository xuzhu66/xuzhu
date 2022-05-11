<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import { useVModel } from '@vueuse/core'
import TabsType from '@/components/AbTabsType.vue'
import { useRoute } from 'vue-router'
import { Badge } from 'vant'
import { replaceWithQuery } from '@/hooks/useQuery'
// import SvgNotify from '@/assets/images/svg/Vector.svg'
// import AbSvg from '@/components/AbSvg'
const props = defineProps({
  activeTab: {
    type: [Number],
    default: 0
  },
  notifyNumber: {
    type: [Number],
    default: 0
  }
})
const emit = defineEmits(['clickNotify', 'update:activeTab', 'change'])
const activeTab = useVModel(props, 'activeTab', emit)

const route = useRoute()
// const { queryState, setQuery, setRedirect } = useQuery()
// const { otherQuery } = queryState
const tabList = ref([
  {
    name: '购买',
    value: 0
  },
  {
    name: '出售',
    value: 0
  },
  {
    name: '交易中',
    value: 0
  }
])
const clickNotify = (event) => {
  emit('clickNotify', event)
}
watch(
  route,
  (route) => {
    const query = route.query
    if (query) {
      // setQuery(getOtherQuery(query))
      // setRedirect(query.redirect)
      // console.log(otherQuery)
      if ((query.tab ?? '') !== '') {
        activeTab.value = Number(query.tab)
      }
    }
  },
  { immediate: true }
)

const goPage = (tab) => {
  // console.log(tab)
  activeTab.value = tab
  replaceWithQuery('Trade', {
    tab: tab
  })
}
const change = (event) => {
  emit('change', event)
}

</script>
<template>
  <div class="abNavBar">
    <div class="tabsType flex-end-between">
      <TabsType
        :active-tab="activeTab"
        class="tabsType"
        :tab-list="tabList"
        @update:activeTab="goPage"
        @change="change"
      ></TabsType>
      <div class="imgBox" @click="clickNotify">
        <Badge :content="notifyNumber || ''">
          <!--          <AbSvg>-->
          <!--            <SvgNotify class="SvgNotify"></SvgNotify>-->
          <!--          </AbSvg>-->
          <img :src="require('@/assets/images/trade/Vector.png')" alt="" />
        </Badge>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.abNav {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.abNavBar {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  background-color: var(--ab-nav-background-color);
  height: var(--ab-nav-height);
  z-index: 1;
}
.tabsType {
  padding: 0 var(--ab-content-padding);
}
.imgBox {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  img {
    width: 16px;
    height: 21px;
  }
}
.SvgNotify {
  font-size: 20px;
}
</style>

<template>
  <van-tabbar class="homeVanTabbar" active-color="#486BF6" route z-index="0">
    <van-tabbar-item to="/">
      <span>首页</span>
      <template #icon="props">
        <img class="tabIcon" :src="props.active ? iconHome.active : iconHome.inactive" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item to="/trade">
      <span>交易</span>
      <template #icon="props">
        <img class="tabIcon" :src="props.active ? iconTrade.active : iconTrade.inactive" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item to="/helpTab">
      <span>帮助</span>
      <template #icon="props">
        <img class="tabIcon" :src="props.active ? iconHelp.active : iconHelp.inactive" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item to="/mine">
      <span>我的</span>
      <template #icon="props">
        <img class="tabIcon" :src="props.active ? iconMy.active : iconMy.inactive" />
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant'

export default {
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem
  },
  setup() {
    const iconTrade = {
      active: require('@/assets/images/tab/tradeActive.png'),
      inactive: require('@/assets/images/tab/trade.png')
    }
    const iconHome = {
      active: require('@/assets/images/tab/homeActive.png'),
      inactive: require('@/assets/images/tab/home.png')
    }
    const iconHelp = {
      active: require('@/assets/images/tab/helpActive.png'),
      inactive: require('@/assets/images/tab/help.png')
    }
    const iconMy = {
      active: require('@/assets/images/tab/myActive.png'),
      inactive: require('@/assets/images/tab/my.png')
    }
    return {
      iconTrade,
      iconHome,
      iconHelp,
      iconMy
    }
  }
}
</script>
<style>
.tabIcon {
  width: 20px;
  height: 20px;
}
</style>

<script>
export default {
  name: 'HomeIndex'
}
</script>
<script setup>
import Swipper from './common/Swipe'
import Wallet from './common/Wallet'
import List from './common/List'
import Trade from './common/Trade'
import { Icon } from 'vant'
import { useRouter } from 'vue-router'
import { useHomeStore } from '@/store/modules/home'
import { copyText } from '@/hooks/useQuery'
import { storeToRefs } from 'pinia'
import AbSkeleton from '@/components/AbSkeleton.vue'
import AbScrollLayout from '@/components/AbScrollLayout'
import { onActivated } from 'vue'

const homeStore = useHomeStore()
const {
  homeLoading,
  eyeFlag,
  swipperImages,
  walletInfo,
  currencyList,
  bannerLoading
} = storeToRefs(homeStore)
const { fetchHomeAccountList, fetchBannerList } = homeStore
const router = useRouter()

const toBuy = (index) => {
  console.log(index)
  router.push({
    name: 'Trade',
    query: {
      tab: index
    }
  })
}
// 跳转
const toLink = (name) => {
  router.push({
    name: name
  })
}

// 轮播图点击事件
const onSwipper = (e) => {
  console.log(e)
}

const onEyes = () => {
  // console.log(state.eyeFlag)
  // state.eyeFlag = !state.eyeFlag
  homeStore.$patch((state) => {
    state.eyeFlag = !state.eyeFlag
  })
}

// 复制
const onCopy = () => {
  copyText(walletInfo.value.address)
}

onActivated(() => {
  initData()
})

const initData = () => {
  fetchBannerList()
  fetchHomeAccountList()
}
</script>
<template>
  <AbScrollLayout @refresh="initData">
    <template #header>
      <div class="header">
        <AbSkeleton :row="1" :loading="homeLoading" row-width="100px">
          <div class="title">
            Hi, {{ walletInfo.realName }}
          </div>
        </AbSkeleton>
        <div class="img">
          <!--          <img src="../../assets/images/index/qr.png" alt="扫码" />-->
          <Icon name="chat-o" dot="" class="van-message" @click="toLink('Message')"></Icon>
        </div>
      </div>
    </template>
    <main class="main">
      <Wallet
        :loading="homeLoading"
        :data="walletInfo"
        :eye-flag="eyeFlag"
        @onDetails="toLink('FundList')"
        @onCopy="onCopy"
        @onEyes="onEyes"
      ></Wallet>
      <Trade @clickBuy="toBuy"></Trade>
      <Swipper
        :loading="bannerLoading"
        :images="swipperImages"
        @click="onSwipper"
      ></Swipper>
      <List
        :loading="homeLoading"
        :list="currencyList"
        @rechargeUsdt="toLink('USDT')"
        @toBuy="toBuy(0)"
        @toDDB="toLink('DdbExchange')"
      ></List>
    </main>
  </AbScrollLayout>
</template>

<style lang="scss" scoped>
//.index {
//  overflow: hidden;
//  height: 100%;
//  display: flex;
//  flex-direction: column;
//}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 44px;
  background-color: #fff;
  .title {
    font-weight: 600;
    font-size: 20px;
  }
  img {
    width: 16px;
    height: 16px;
    margin-right: 20px;
  }
  .van-message {
    font-size: 22px;
  }
}
.main {
  padding: 20px 18px 60px;
  flex: 1;
  overflow-y: auto;
}
</style>

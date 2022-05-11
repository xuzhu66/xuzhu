<script>
export default {
  name: 'UsdtTopUp'
}
</script>
<script setup>
import AbNavBar from '@/components/AbNavBar'
import AbScrollLayout from '@/components/AbScrollLayout'
import UsdtDialogViewAddr from './common/UsdtDialogViewAddr.vue'
import UsdtAddrItem from './common/UsdtAddrItem'
import { storeToRefs } from 'pinia'
// import { Icon } from 'vant'
import { ref } from 'vue'
import { useFundStore } from '@/store/modules/fund'
import AbSkeleton from '@/components/AbSkeleton'
import { pushWithQuery } from '@/hooks/useQuery'

const fundStore = useFundStore()
const {
  usdtErcAddrList,
  usdtTrcAddrList,
  usdtLoadng,
  usdtPriceLoading,
  usdtPriceString
} = storeToRefs(fundStore)
const { fetchUsdtList, fetchUsdtPrice, fetchUsdtFee } = fundStore

const active = ref(0)
// const show = ref(false)
const usdtTypeArr = ref([{ name: 'ERC20' }, { name: 'TRC20' }])
const onNetWork = (index) => {
  active.value = index
  fundStore.$patch((state) => {
    state.addrActive = index
  })
  fetchUsdtList({
    chain: usdtTypeArr.value[index].name,
    coinCode: 'USDT'
  })
}
const viewClick = (item) => {
  // show.value = true
  fundStore.$patch((state) => {
    state.dialogAddrItem = item
    state.showAddrDetail = true
  })
}
const toHistory = () => {
  pushWithQuery('UsdtHistory')
}
fundStore.$patch((state) => {
  state.addrActive = 0
})
fetchUsdtList({
  chain: usdtTypeArr.value[0].name,
  coinCode: 'USDT'
})
fetchUsdtPrice()
fetchUsdtFee()
</script>
<template>
  <AbScrollLayout>
    <div class="usdt">
      <AbNavBar
        title="充值"
        right-text="历史记录"
        @clickRight="toHistory"
      ></AbNavBar>
      <main class="content">
        <div class="cell flex-center-between">
          <div class="flex-center-start">
            <div class="usdtLogo"></div>
            <span class="usdt_text fz15 fw700">USDT</span>
            <span class="fw500">TetherUS</span>
          </div>
          <!--          <Icon name="arrow"></Icon>-->
        </div>
        <div class="huilv">
          <AbSkeleton
            :loading="usdtPriceLoading"
            :row="1"
            row-width="100px"
          >
            汇率：1 USDT ≈ {{ usdtPriceString }} DDB
          </AbSkeleton>
        </div>
        <div class="t-network text-align-left fw500">
          <div class="labelLeft">选择转账网络</div>
          <div class="flex net fz14 fw500 fontF6">
            <div
              v-for="(item, index) in usdtTypeArr"
              :key="index"
              :class="active === index ? 'click' : ''"
              @click="onNetWork(index)"
            >
              {{ item.name }}
            </div>
          </div>
          <div class="flex-center-between"></div>
        </div>

        <div class="labelLeft">收款地址</div>
        <div v-if="active === 0" class="usdtAddrList">
          <AbSkeleton :row="3" title :loading="usdtLoadng">
            <UsdtAddrItem
              v-for="(item, index) in usdtErcAddrList"
              :key="index"
              :item="item"
              @viewClick="viewClick"
            ></UsdtAddrItem>
          </AbSkeleton>
        </div>
        <div v-if="active === 1" class="usdtAddrList">
          <AbSkeleton :row="3" title :loading="usdtLoadng">
            <UsdtAddrItem
              v-for="(item, index) in usdtTrcAddrList"
              :key="index"
              :item="item"
              @viewClick="viewClick"
            ></UsdtAddrItem>
          </AbSkeleton>
        </div>
      </main>
      <UsdtDialogViewAddr></UsdtDialogViewAddr>
    </div>
  </AbScrollLayout>
</template>
<style lang="scss" scoped>
.usdt {
  //background-color: #fff;
  //min-height: calc(100% - 50px);
  padding-top: 50px;
  background-color: var(--ab-page-container-background-color);
  .content {
    padding: 16px;
    .cell {
      height: 55px;
      background-color: #fff;
      border-radius: 8px;
      padding: 0 10px;
      box-shadow: -10px -10px 10px rgba(216, 221, 240, 0.15),
        10px 10px 10px rgba(216, 221, 240, 0.15);
      img {
        width: 20px;
        height: 20px;
      }
      .usdt_text {
        margin: 0 10px;
      }
    }
    .t-network {
      margin-top: 30px;
      .net {
        div {
          width: 90px;
          height: 35px;
          line-height: 35px;
          text-align: center;
          border: 1.5px solid #f6f7fd;
          box-shadow: -10px -10px 10px rgba(216, 221, 240, 0.1),
            10px 10px 10px rgba(216, 221, 240, 0.1);
          border-radius: 8px;
          margin: 13px 17px 30px 0;
          background: #f6f7fd;
          color: #d1d3da;
        }
        div.click {
          border: 1.5px solid #486bf6;
          background-color: #fff;
          color: #486bf6;
        }
      }
    }
  }
}
.huilv {
  margin-top: 13px;
  text-align: left;
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;
}

.labelLeft {
  text-align: left;
  font-weight: 500;
  font-size: 14px;
  color: var(--ab-main-text-color);
}

.usdtAddrList {
  margin-top: 14px;
}
.usdtLogo {
  background-image: url('~@/assets/images/index/usdt.png');
  width: 20px;
  height: 20px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>

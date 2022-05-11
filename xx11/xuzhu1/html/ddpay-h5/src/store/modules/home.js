import { defineStore } from 'pinia'
import {
  acctInfo,
  bannerListApi
} from '@/api/index'

export const useHomeStore = defineStore('home', {
  state: () => ({
    // 首页
    homeLoading: false,
    eyeFlag: true,
    // 钱包信息
    walletInfo: {
      avlAmt: '',
      address: '',
      realName: ''
    },
    // usdt 账号总余额
    usdtTotal: '0',
    // 币种列表
    currencyList: [],
    // 轮播图
    bannerLoading: false,
    swipperImages: [
      // {
      //   url: require('../../assets/images/index/benner.png'),
      //   link: 'baidu.com'
      // },
      // {
      //   url: require('../../assets/images/index/benner.png'),
      //   link: 'google.com'
      // }
    ]

  }),
  actions: {
    async fetchHomeAccountList(payload) {
      this.homeLoading = this.walletInfo.avlAmt === ''
      try {
        const res = await acctInfo(payload)
        if (res.success) {
          const data = res.data
          this.currencyList = data.acctList
          this.walletInfo = {
            avlAmt: data.avlAmt,
            address: data.address,
            realName: data.realName
          }
          this.homeLoading = false
          const list = this.currencyList
          for (let i = 0; i < list.length; i++) {
            if (list[i].coinCode == 'USDT') {
              this.usdtTotal = list[i].avlAmt
            }
          }
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      }
    },
    async fetchBannerList(payload) {
      // console.log(this.swipperImages)
      this.bannerLoading = this.swipperImages.length === 0
      try {
        const res = await bannerListApi()
        if (res.success) {
          const data = res.data
          this.swipperImages = data
          this.bannerLoading = false
        }
        // console.log(res)
      } catch (e) {
        console.log(e)
      }
    }
  }
})

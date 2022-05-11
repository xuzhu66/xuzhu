import { defineStore } from 'pinia'
import {
  usdtAddrApi,
  usdtDetailsListApi,
  ddbDetailsListApi,
  coinDdbDetailApi,
  coinUsdtDetailApi,
  usdtTopupListApi,
  ddbExchangeListApi,
  ddbExchangeDetailApi,
  ddbExchangeDaysListApi, usdtPriceApi, usdtFeeApi
} from '@/api/fund'
const fundState = () => {
  return {
    tabActive: 0,
    radioActive: 0,
    tabs: [
      { name: 'DDB', value: 0 },
      { name: 'USDT', value: 1 }
    ],
    tabActiveUsdtHistory: 0,
    tabsUsdtHistory: [
      { name: 'USDT', value: 1 }
    ],
    showTimeDropdown: false,
    checkedTime: '1',
    checkedLabel: '近7天',
    // 资金明细usdt
    usdtDetailsList: [],
    usdtDetailsCurrent: 1,
    usdtDetailsSize: 20,
    usdtDetailsListLoading: false,
    usdtDetailsFinished: false,
    usdtDetailsRefreshing: false,
    // 资金明细ddb
    ddbDetailsList: [],
    ddbDetailsCurrent: 1,
    ddbDetailsSize: 20,
    ddbDetailsListLoading: false,
    ddbDetailsFinished: false,
    ddbDetailsListRefreshing: false
  }
}
const ddbExchangeState = () => {
  return {
    // 兑换ddb 近3天
    ddbExchangeList: [],
    ddbExchangeCurrent: 1,
    ddbExchangeSize: 20,
    ddbExchangeListLoading: false,
    ddbExchangeFinished: false,
    ddbExchangeListRefreshing: false
  }
}
const ddbExchangeHistoryState = () => {
  return {
    // 兑换历史记录
    ddbExchangeHistoryList: [],
    ddbExchangeHistoryCurrent: 1,
    ddbExchangeHistorySize: 20,
    ddbExchangeHistoryListLoading: false,
    ddbExchangeHistoryFinished: false,
    ddbExchangeHistoryListRefreshing: false
  }
}
const usdtHistoryState = () => {
  return {
    // usdt 充值历史记录
    usdtTopupHistoryList: [],
    usdtTopupHistoryCurrent: 1,
    usdtTopupHistorySize: 20,
    usdtTopupHistoryListLoading: false,
    usdtTopupHistoryFinished: false,
    usdtTopupHistoryListRefreshing: false
  }
}

export const useFundStore = defineStore('fund', {
  state: () => ({
    // usdt 充值页面
    usdtLoadng: false,
    usdtTrcAddrList: [],
    usdtErcAddrList: [],
    showAddrDetail: false,
    addrActive: 0,
    dialogAddrItem: {},
    usdtPriceString: '',
    usdtPriceLoading: false,
    usdtFeeArr: [],
    usdtFeeLoading: false,

    // 资金明细页面
    ...fundState(),
    // ddb 兑换
    ...ddbExchangeState(),
    ...ddbExchangeHistoryState(),
    ...usdtHistoryState(),

    // 资金详情
    coinDetailLoading: false,
    coinDetailObj: {}

  }),
  actions: {
    resetFundState() {
      const obj = fundState()
      for (const property in obj) {
        this[property] = obj[property]
        // console.log(`${property}: ${obj[property]}`)
      }
    },
    resetDdbExchangeState() {
      const obj = ddbExchangeState()
      for (const property in obj) {
        this[property] = obj[property]
        // console.log(`${property}: ${obj[property]}`)
      }
    },
    resetDdbExchangeHistoryState() {
      const obj = ddbExchangeHistoryState()
      for (const property in obj) {
        this[property] = obj[property]
        // console.log(`${property}: ${obj[property]}`)
      }
    },
    resetUsdtHistoryState() {
      const obj = usdtHistoryState()
      for (const property in obj) {
        this[property] = obj[property]
        // console.log(`${property}: ${obj[property]}`)
      }
    },
    async fetchUsdtPrice(payload) {
      if (!this.usdtPriceString) {
        this.usdtPriceLoading = true
      }
      try {
        const res = await usdtPriceApi(payload)
        if (res.success) {
          this.usdtPriceString = res.data.price
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      } finally {
        this.usdtPriceLoading = false
      }
    },
    async fetchUsdtFee(payload) {
      this.usdtFeeLoading = true
      try {
        const res = await usdtFeeApi(payload)
        if (res.success) {
          this.usdtFeeArr = res.data ? res.data : []
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      } finally {
        this.usdtFeeLoading = false
      }
    },
    async fetchUsdtList(payload) {
      this.usdtLoadng = true
      if (payload.chain === 'TRC20' && this.usdtTrcAddrList.length > 0) {
        this.usdtLoadng = false
      }
      if (payload.chain === 'ERC20' && this.usdtErcAddrList.length > 0) {
        this.usdtLoadng = false
      }
      try {
        const res = await usdtAddrApi(payload)
        if (res.success) {
          if (payload.chain === 'TRC20') {
            this.usdtTrcAddrList = res.data ? res.data : []
          }
          if (payload.chain === 'ERC20') {
            this.usdtErcAddrList = res.data ? res.data : []
          }
          this.usdtLoadng = false
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      }
    },
    async fetchUsdtRecordList(payload) {
      // if (this.usdtDetailsListLoading) return
      this.usdtDetailsListLoading = true
      const params = {
        type: this.checkedTime,
        current: this.usdtDetailsCurrent,
        size: this.usdtDetailsSize
      }
      try {
        const res = await usdtDetailsListApi(params)
        if (res.success) {
          if (params.current == 1) {
            this.usdtDetailsList = []
          }
          this.usdtDetailsCurrent += 1
          const records = res.data.records
          this.usdtDetailsList = this.usdtDetailsList.concat(records)
          this.usdtDetailsListLoading = false
          if (records.length < params.size) {
            this.usdtDetailsFinished = true
          }
        }
        // console.log(res)
      } catch (e) {
        console.log(e)
        // this.usdtDetailsListLoading = false
      } finally {
        console.log('finally')
        // this.usdtDetailsListLoading = false
        this.usdtDetailsRefreshing = false
      }
    },
    async fetchDdbRecordList(payload) {
      // console.log(this.ddbDetailsListLoading)
      // if (this.ddbDetailsListLoading) return
      this.ddbDetailsListLoading = true
      const params = {
        type: this.checkedTime,
        current: this.ddbDetailsCurrent,
        size: this.ddbDetailsSize
      }
      try {
        const res = await ddbDetailsListApi(params)
        if (res.success) {
          if (params.current == 1) {
            this.ddbDetailsList = []
          }
          this.ddbDetailsCurrent += 1
          const records = res.data.records
          this.ddbDetailsList = this.ddbDetailsList.concat(records)
          this.ddbDetailsListLoading = false
          if (records.length < params.size) {
            this.ddbDetailsFinished = true
          }
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      } finally {
        // this.ddbDetailsListLoading = false
        this.ddbDetailsListRefreshing = false
      }
    },
    async fetchCoinUsdtDetail(payload) {
      // if (this.coinDetailLoading) return
      this.coinDetailLoading = true
      try {
        const res = await coinUsdtDetailApi(payload)
        if (res.success) {
          this.coinDetailObj = res.data
          this.coinDetailLoading = false
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      }
    },
    async fetchCoinDdbDetail(payload) {
      // if (this.coinDetailLoading) return
      this.coinDetailLoading = true
      try {
        const res = await coinDdbDetailApi(payload)
        if (res.success) {
          this.coinDetailObj = res.data
          this.coinDetailLoading = false
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      }
    },
    // usdt 充币记录
    async fetchUsdtTopupList(payload) {
      this.usdtTopupHistoryListLoading = true
      const params = {
        type: this.checkedTime,
        current: this.usdtTopupHistoryCurrent,
        size: this.usdtTopupHistorySize
      }
      try {
        const res = await usdtTopupListApi(params)
        if (res.success) {
          if (params.current == 1) {
            this.usdtTopupHistoryList = []
          }
          this.usdtTopupHistoryCurrent += 1
          const records = res.data.records
          this.usdtTopupHistoryList = this.usdtTopupHistoryList.concat(records)
          this.usdtTopupHistoryListLoading = false
          if (records.length < params.size) {
            this.usdtTopupHistoryFinished = true
          }
        }
        // console.log(res)
      } catch (e) {
        console.log(e)
      } finally {
        console.log('finally')
        this.usdtTopupHistoryRefreshing = false
      }
    },
    // ddb 兑换记录
    async fetchDdbExchangeList(payload) {
      this.ddbExchangeHistoryListLoading = true
      const params = {
        type: this.checkedTime,
        current: this.ddbExchangeHistoryCurrent,
        size: this.ddbExchangeHistorySize
      }
      try {
        const res = await ddbExchangeListApi(params)
        if (res.success) {
          if (params.current == 1) {
            this.ddbExchangeHistoryList = []
          }
          this.ddbExchangeHistoryCurrent += 1
          const records = res.data.records
          this.ddbExchangeHistoryList = this.ddbExchangeHistoryList.concat(records)
          this.ddbExchangeHistoryListLoading = false
          if (records.length < params.size) {
            this.ddbExchangeHistoryFinished = true
          }
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      } finally {
        this.ddbExchangeHistoryListRefreshing = false
      }
    },
    // ddb 近几天 兑换记录
    async fetchDdbExchangeListDays(payload) {
      this.ddbExchangeListLoading = true
      const params = {
        days: 3,
        current: this.ddbExchangeCurrent,
        size: this.ddbExchangeSize
      }
      try {
        const res = await ddbExchangeDaysListApi(params)
        if (res.success) {
          if (params.current == 1) {
            this.ddbExchangeList = []
          }
          this.ddbExchangeCurrent += 1
          const records = res.data.records
          this.ddbExchangeList = this.ddbExchangeList.concat(records)
          this.ddbExchangeListLoading = false
          if (records.length < params.size) {
            this.ddbExchangeFinished = true
          }
        }
      } catch (e) {
        // console.log(e)
      } finally {
        this.ddbExchangeListRefreshing = false
      }
    },
    async fetchDdbExchangeDetail(payload) {
      // if (this.coinDetailLoading) return
      this.coinDetailLoading = true
      try {
        const res = await ddbExchangeDetailApi(payload)
        if (res.success) {
          this.coinDetailObj = res.data
          this.coinDetailLoading = false
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      }
    }
  }
})
